/**
 * 答题页面
 * @description 实现答题逻辑和积分发放
 */
const app = getApp()
const {
  getQuestionsByChapter,
  getQuestionsByDifficulty,
  getDailyQuestions,
  QUIZ_DIFFICULTIES
} = require('../../utils/constants')
const {
  navigateTo,
  navigateBack,
  showToast,
  showSuccess,
  getStorage,
  setStorage
} = require('../../utils/util')

Page({
  data: {
    quizType: '',
    chapterId: null,
    chapterName: '',
    difficulty: '',
    difficultyName: '',
    isWrongReview: false,

    questions: [],
    currentIndex: 0,
    currentQuestion: null,

    selectedIndex: -1,
    isAnswered: false,
    isCorrect: false,

    correctCount: 0,
    wrongCount: 0,
    totalPoints: 0,

    showResult: false,
    resultData: null,

    progressPercent: 0
  },

  onLoad(options) {
    console.log('[QuizPlay] 页面加载', options)
    this.initQuiz(options)
  },

  initQuiz(options) {
    const { type, chapterId, chapterName, difficulty, difficultyName, isWrongReview } = options

    let questions = []
    let quizType = type || 'chapter'

    if (isWrongReview === 'true') {
      quizType = 'wrong'
      const wrongQuestions = getStorage('wrongQuestions', [])
      questions = wrongQuestions.map(q => ({
        ...q,
        isWrongReview: true
      }))
    } else if (type === 'daily') {
      questions = getDailyQuestions()
    } else if (type === 'chapter' && chapterId) {
      questions = getQuestionsByChapter(parseInt(chapterId))
    } else if (type === 'difficulty' && difficulty) {
      questions = getQuestionsByDifficulty(difficulty)
    }

    if (questions.length === 0) {
      showToast('暂无题目')
      setTimeout(() => {
        navigateBack()
      }, 1500)
      return
    }

    const processedQuestions = questions.map(q => ({
      ...q,
      optionsWithLabel: q.options.map((opt, idx) => ({
        text: opt,
        label: String.fromCharCode(65 + idx)
      })),
      correctAnswerLabel: String.fromCharCode(65 + q.correctIndex)
    }))

    const shuffled = processedQuestions.sort(() => 0.5 - Math.random())

    this.setData({
      quizType,
      chapterId: chapterId ? parseInt(chapterId) : null,
      chapterName: chapterName || '',
      difficulty: difficulty || '',
      difficultyName: difficultyName || '',
      isWrongReview: isWrongReview === 'true',
      questions: shuffled,
      currentIndex: 0,
      currentQuestion: shuffled[0],
      selectedIndex: -1,
      isAnswered: false,
      isCorrect: false,
      correctCount: 0,
      wrongCount: 0,
      totalPoints: 0,
      showResult: false,
      progressPercent: 0
    })

    this.updateNavigationTitle()
  },

  updateNavigationTitle() {
    let title = '知识问答'
    if (this.data.chapterName) {
      title = this.data.chapterName
    } else if (this.data.difficultyName) {
      title = this.data.difficultyName + '难度'
    } else if (this.data.quizType === 'daily') {
      title = '每日一练'
    } else if (this.data.isWrongReview) {
      title = '错题复习'
    }

    wx.setNavigationBarTitle({ title })
  },

  onSelectOption(e) {
    if (this.data.isAnswered) return

    const { index } = e.currentTarget.dataset
    const question = this.data.currentQuestion
    const isCorrect = index === question.correctIndex

    this.setData({
      selectedIndex: index,
      isAnswered: true,
      isCorrect
    })

    if (isCorrect) {
      const pointsEarned = this.calculatePoints()
      const newCorrectCount = this.data.correctCount + 1
      const newTotalPoints = this.data.totalPoints + pointsEarned

      this.setData({
        correctCount: newCorrectCount,
        totalPoints: newTotalPoints
      })

      app.updateUserPoints(pointsEarned)
      showSuccess(`答对了！+${pointsEarned}积分`)

      this.removeFromWrongQuestions(question.id)
    } else {
      const newWrongCount = this.data.wrongCount + 1
      this.setData({
        wrongCount: newWrongCount
      })

      showToast('答错了，继续加油！', 'none')
      this.addToWrongQuestions(question)
    }

    this.updateProgress()
  },

  calculatePoints() {
    const question = this.data.currentQuestion
    const difficulty = question.difficulty

    const diffConfig = QUIZ_DIFFICULTIES.find(d => d.id === difficulty)
    if (diffConfig) {
      return diffConfig.pointsPerQuestion
    }

    return 5
  },

  addToWrongQuestions(question) {
    const wrongQuestions = getStorage('wrongQuestions', [])
    const exists = wrongQuestions.some(q => q.id === question.id)

    if (!exists) {
      wrongQuestions.push({
        ...question,
        wrongTime: new Date().toISOString()
      })
      setStorage('wrongQuestions', wrongQuestions)
    }
  },

  removeFromWrongQuestions(questionId) {
    const wrongQuestions = getStorage('wrongQuestions', [])
    const filtered = wrongQuestions.filter(q => q.id !== questionId)
    setStorage('wrongQuestions', filtered)
  },

  updateProgress() {
    const total = this.data.questions.length
    const answered = this.data.currentIndex + 1
    const percent = Math.round((answered / total) * 100)

    this.setData({
      progressPercent: percent
    })
  },

  onNextQuestion() {
    const nextIndex = this.data.currentIndex + 1

    if (nextIndex >= this.data.questions.length) {
      this.showQuizResult()
      return
    }

    this.setData({
      currentIndex: nextIndex,
      currentQuestion: this.data.questions[nextIndex],
      selectedIndex: -1,
      isAnswered: false,
      isCorrect: false
    })
  },

  showQuizResult() {
    const total = this.data.questions.length
    const correct = this.data.correctCount
    const wrong = this.data.wrongCount
    const basePoints = this.data.totalPoints
    const bonusPoints = 20
    const totalPoints = basePoints + bonusPoints
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

    let resultTitle = '继续加油！'
    let resultEmoji = '💪'

    if (accuracy >= 80) {
      resultTitle = '太棒了！'
      resultEmoji = '🎉'
    } else if (accuracy >= 60) {
      resultTitle = '不错哦！'
      resultEmoji = '👍'
    }

    app.updateUserPoints(bonusPoints)

    this.setData({
      showResult: true,
      resultData: {
        title: resultTitle,
        emoji: resultEmoji,
        total,
        correct,
        wrong,
        points: totalPoints,
        basePoints,
        bonusPoints,
        accuracy
      }
    })

    this.updateChapterProgress()
    this.markDailyCompleted()
  },

  updateChapterProgress() {
    if (this.data.quizType !== 'chapter' || !this.data.chapterId) return

    const chaptersProgress = getStorage('chaptersProgress', {})
    const currentProgress = chaptersProgress[this.data.chapterId] || 0
    const accuracy = this.data.resultData.accuracy

    const newProgress = Math.max(currentProgress, accuracy)
    chaptersProgress[this.data.chapterId] = newProgress

    if (newProgress >= 80) {
      const nextChapterId = this.data.chapterId + 1
      if (nextChapterId <= 5) {
        const unlockedChapters = getStorage('unlockedChapters', [1, 2])
        if (!unlockedChapters.includes(nextChapterId)) {
          unlockedChapters.push(nextChapterId)
          setStorage('unlockedChapters', unlockedChapters)
        }
      }
    }

    setStorage('chaptersProgress', chaptersProgress)
  },

  markDailyCompleted() {
    if (this.data.quizType !== 'daily') return

    const today = new Date().toDateString()
    setStorage('lastDailyQuizDate', today)
  },

  onRestart() {
    this.setData({
      currentIndex: 0,
      currentQuestion: this.data.questions[0],
      selectedIndex: -1,
      isAnswered: false,
      isCorrect: false,
      correctCount: 0,
      wrongCount: 0,
      totalPoints: 0,
      showResult: false,
      progressPercent: 0
    })
  },

  onBackToHome() {
    navigateBack()
  },

  onGoToWrong() {
    if (this.data.wrongCount === 0) {
      showToast('暂无错题')
      return
    }
    navigateTo('/pages/quiz-wrong/quiz-wrong')
  },

  onShareAppMessage() {
    return {
      title: '我在垃圾分类助手答题赢积分，快来一起学习吧！',
      path: '/pages/index/index'
    }
  }
})
