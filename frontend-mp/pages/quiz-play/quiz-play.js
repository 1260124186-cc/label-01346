/**
 * 答题页面
 * @description 实现答题逻辑和积分发放，支持单选、多选、判断三种题型
 */
const app = getApp()
const {
  getQuestionsByChapter,
  getQuestionsByDifficulty,
  getDailyQuestions,
  getRandomQuestions,
  QUIZ_DIFFICULTIES,
  QUIZ_QUESTION_TYPES,
  QUIZ_SCENES,
  TRASH_TYPES,
  QUIZ_TIMED_CONFIG,
  QUIZ_BOSS_CONFIG,
  isQuestionCorrect
} = require('../../utils/constants')
const {
  navigateTo,
  navigateBack,
  showToast,
  showSuccess,
  getStorage,
  setStorage,
  formatDate,
  generateId
} = require('../../utils/util')

Page({
  data: {
    quizType: '',
    chapterId: null,
    chapterName: '',
    difficulty: '',
    difficultyName: '',
    isWrongReview: false,
    isTimedMode: false,
    isBossMode: false,

    questions: [],
    currentIndex: 0,
    currentQuestion: null,

    selectedIndex: -1,
    selectedIndexes: [],
    isAnswered: false,
    isCorrect: false,
    isTimeout: false,

    userAnswer: null,

    correctCount: 0,
    wrongCount: 0,
    timeoutCount: 0,
    totalPoints: 0,

    showResult: false,
    resultData: null,

    progressPercent: 0,

    timeLeft: 0,
    timer: null,

    QUESTION_TYPE_MAP: {
      single: { name: '单选题', icon: '○' },
      multiple: { name: '多选题', icon: '☐' },
      judge: { name: '判断题', icon: '✓' }
    },
    SCENE_MAP: {
      kitchen: '厨房',
      office: '办公室',
      campus: '校园'
    },
    TRASH_TYPE_MAP: {}
  },

  onLoad(options) {
    console.log('[QuizPlay] 页面加载', options)
    this.initTrashTypeMap()
    this.initQuiz(options)
  },

  initTrashTypeMap() {
    const map = {}
    TRASH_TYPES.forEach(t => {
      map[t.id] = t
    })
    this.setData({ TRASH_TYPE_MAP: map })
  },

  initQuiz(options) {
    const { type, chapterId, chapterName, difficulty, difficultyName, isWrongReview, isTimed, isBoss } = options

    let questions = []
    let quizType = type || 'chapter'
    let isTimedMode = isTimed === 'true'
    let isBossMode = isBoss === 'true'

    if (isWrongReview === 'true') {
      quizType = 'wrong'
      const wrongQuestions = app.getWrongQuestions()
      questions = wrongQuestions.map(q => ({
        ...q,
        isWrongReview: true
      }))
    } else if (type === 'daily') {
      questions = getDailyQuestions()
    } else if (type === 'chapter' && chapterId) {
      if (isBossMode) {
        questions = this.getBossQuestions(parseInt(chapterId))
      } else {
        questions = getQuestionsByChapter(parseInt(chapterId))
      }
    } else if (type === 'difficulty' && difficulty) {
      questions = getQuestionsByDifficulty(difficulty)
    } else if (isTimedMode) {
      quizType = 'timed'
      questions = getRandomQuestions(QUIZ_TIMED_CONFIG.totalQuestions)
    }

    if (questions.length === 0) {
      showToast('暂无题目')
      setTimeout(() => {
        navigateBack()
      }, 1500)
      return
    }

    const processedQuestions = questions.map(q => this.processQuestion(q))

    const shuffled = processedQuestions.sort(() => 0.5 - Math.random())

    this.setData({
      quizType,
      chapterId: chapterId ? parseInt(chapterId) : null,
      chapterName: chapterName || '',
      difficulty: difficulty || '',
      difficultyName: difficultyName || '',
      isWrongReview: isWrongReview === 'true',
      isTimedMode,
      isBossMode,
      questions: shuffled,
      currentIndex: 0,
      currentQuestion: shuffled[0],
      selectedIndex: -1,
      selectedIndexes: [],
      isAnswered: false,
      isCorrect: false,
      isTimeout: false,
      userAnswer: null,
      correctCount: 0,
      wrongCount: 0,
      timeoutCount: 0,
      totalPoints: 0,
      showResult: false,
      progressPercent: 0,
      timeLeft: isTimedMode ? QUIZ_TIMED_CONFIG.timePerQuestion : 0
    })

    this.updateNavigationTitle()

    if (isTimedMode) {
      this.startTimer()
    }
  },

  processQuestion(q) {
    const type = q.type || 'single'
    let options = q.options
    let correctIndex = q.correctIndex
    let correctIndexes = q.correctIndexes || []

    if (type === 'judge' && (!options || options.length === 0)) {
      options = ['正确', '错误']
    }

    const optionsWithLabel = options.map((opt, idx) => ({
      text: opt,
      label: type === 'judge' ? (idx === 0 ? '✓' : '✗') : String.fromCharCode(65 + idx)
    }))

    let correctAnswerLabel = ''
    if (type === 'multiple') {
      correctAnswerLabel = correctIndexes
        .sort((a, b) => a - b)
        .map(i => String.fromCharCode(65 + i))
        .join('、')
    } else if (type === 'judge') {
      correctAnswerLabel = correctIndex === 0 ? '正确' : '错误'
    } else {
      correctAnswerLabel = String.fromCharCode(65 + correctIndex)
    }

    const sceneLabels = (q.scenes || []).map(s => this.data.SCENE_MAP[s] || s)

    return {
      ...q,
      type,
      options,
      optionsWithLabel,
      correctIndex,
      correctIndexes,
      correctAnswerLabel,
      sceneLabels
    }
  },

  updateNavigationTitle() {
    let title = '知识问答'
    if (this.data.isBossMode) {
      title = QUIZ_BOSS_CONFIG.bossName
    } else if (this.data.isTimedMode) {
      title = '限时挑战'
    } else if (this.data.chapterName) {
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

  startTimer() {
    this.stopTimer()
    const timer = setInterval(() => {
      const timeLeft = this.data.timeLeft - 1
      if (timeLeft <= 0) {
        this.stopTimer()
        this.handleTimeout()
      } else {
        this.setData({ timeLeft })
      }
    }, 1000)
    this.setData({ timer })
  },

  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  },

  handleTimeout() {
    if (this.data.isAnswered) return

    const question = this.data.currentQuestion
    const userAnswer = question.type === 'multiple' ? [] : -1

    this.setData({
      isAnswered: true,
      isCorrect: false,
      isTimeout: true,
      userAnswer,
      timeoutCount: this.data.timeoutCount + 1,
      wrongCount: this.data.wrongCount + 1
    })

    showToast('时间到！答错了', 'none')
    this.addToWrongQuestions(question)
    this.updateProgress()
  },

  getBossQuestions(chapterId) {
    const chapterQuestions = getQuestionsByChapter(chapterId)
    const allQuestions = [...chapterQuestions]

    const otherChapters = [1, 2, 3, 4, 5].filter(id => id !== chapterId)
    otherChapters.forEach(id => {
      const qs = getQuestionsByChapter(id)
      const randomQs = qs.sort(() => 0.5 - Math.random()).slice(0, 2)
      allQuestions.push(...randomQs)
    })

    return allQuestions.sort(() => 0.5 - Math.random()).slice(0, QUIZ_BOSS_CONFIG.questionsCount)
  },

  onSelectOption(e) {
    if (this.data.isAnswered) return

    const { index } = e.currentTarget.dataset
    const question = this.data.currentQuestion
    const type = question.type || 'single'

    if (type === 'multiple') {
      let selected = [...this.data.selectedIndexes]
      const idx = selected.indexOf(index)
      if (idx > -1) {
        selected.splice(idx, 1)
      } else {
        selected.push(index)
      }
      this.setData({ selectedIndexes: selected })
      return
    }

    if (this.data.isTimedMode) {
      this.stopTimer()
    }

    let userAnswer = index
    if (type === 'judge') {
      userAnswer = index
    }

    const correct = isQuestionCorrect(question, userAnswer)

    this.setData({
      selectedIndex: index,
      userAnswer,
      isAnswered: true,
      isCorrect: correct
    })

    this.handleAnswerResult(correct, question)
  },

  onSubmitMultiple() {
    if (this.data.isAnswered) return

    const question = this.data.currentQuestion
    const selected = [...this.data.selectedIndexes]

    if (selected.length === 0) {
      showToast('请至少选择一个选项', 'none')
      return
    }

    if (this.data.isTimedMode) {
      this.stopTimer()
    }

    const userAnswer = selected.sort((a, b) => a - b)
    const correct = isQuestionCorrect(question, userAnswer)

    this.setData({
      userAnswer,
      isAnswered: true,
      isCorrect: correct
    })

    this.handleAnswerResult(correct, question)
  },

  handleAnswerResult(isCorrect, question) {
    const questions = [...this.data.questions]
    const currentIndex = this.data.currentIndex
    questions[currentIndex] = {
      ...questions[currentIndex],
      userAnswer: this.data.userAnswer,
      isCorrect
    }

    if (isCorrect) {
      const pointsEarned = this.calculatePoints()
      const newCorrectCount = this.data.correctCount + 1
      const newTotalPoints = this.data.totalPoints + pointsEarned

      this.setData({
        correctCount: newCorrectCount,
        totalPoints: newTotalPoints,
        questions
      })

      app.updateUserPoints(pointsEarned, {
        category: 'quiz',
        title: '知识问答',
        desc: `答题正确：${question.question.length > 15 ? question.question.slice(0, 15) + '...' : question.question}`,
        emoji: '❓'
      })
      showSuccess(`答对了！+${pointsEarned}积分`)

      this.removeFromWrongQuestions(question.id)
    } else {
      const newWrongCount = this.data.wrongCount + 1
      this.setData({
        wrongCount: newWrongCount,
        questions
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
      let base = diffConfig.pointsPerQuestion
      if (question.type === 'multiple') base = Math.round(base * 1.5)
      if (question.type === 'hard') base = Math.round(base * 1.2)
      return base
    }

    return 5
  },

  addToWrongQuestions(question) {
    app.addWrongQuestion(question)
  },

  removeFromWrongQuestions(questionId) {
    app.removeWrongQuestion(questionId)
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
      selectedIndexes: [],
      isAnswered: false,
      isCorrect: false,
      isTimeout: false,
      userAnswer: null,
      timeLeft: this.data.isTimedMode ? QUIZ_TIMED_CONFIG.timePerQuestion : 0
    })

    if (this.data.isTimedMode) {
      this.startTimer()
    }
  },

  showQuizResult() {
    const total = this.data.questions.length
    const correct = this.data.correctCount
    const wrong = this.data.wrongCount
    const timeout = this.data.timeoutCount
    const basePoints = this.data.totalPoints
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

    let bonusPoints = 20
    let bonusTitle = '完成奖励'
    let resultTitle = '继续加油！'
    let resultEmoji = '💪'

    if (this.data.isTimedMode) {
      const bonusConfig = QUIZ_TIMED_CONFIG.accuracyBonus.find(b => accuracy >= b.minAccuracy)
      bonusPoints = bonusConfig ? bonusConfig.bonus : 0
      bonusTitle = `${bonusConfig ? bonusConfig.name : '加油'}奖励`
    } else if (this.data.isBossMode) {
      bonusPoints = QUIZ_BOSS_CONFIG.bonusPoints
      bonusTitle = 'Boss奖励'
    }

    const totalPoints = basePoints + bonusPoints

    if (accuracy >= 90) {
      resultTitle = '完美！'
      resultEmoji = '🏆'
    } else if (accuracy >= 80) {
      resultTitle = '太棒了！'
      resultEmoji = '🎉'
    } else if (accuracy >= 60) {
      resultTitle = '不错哦！'
      resultEmoji = '👍'
    }

    app.updateUserPoints(bonusPoints, {
      category: 'quiz',
      title: bonusTitle,
      desc: `${this.data.isTimedMode ? '限时挑战' : this.data.isBossMode ? 'Boss关' : '答题'}正确率${accuracy}%`,
      emoji: '🎁'
    })

    this.setData({
      showResult: true,
      resultData: {
        title: resultTitle,
        emoji: resultEmoji,
        total,
        correct,
        wrong,
        timeout,
        points: totalPoints,
        basePoints,
        bonusPoints,
        bonusTitle,
        accuracy,
        isTimedMode: this.data.isTimedMode,
        isBossMode: this.data.isBossMode
      }
    })

    let recordChapterName = this.data.chapterName
    if (!recordChapterName) {
      if (this.data.isTimedMode) {
        recordChapterName = '限时挑战'
      } else if (this.data.isBossMode) {
        recordChapterName = 'Boss关'
      } else if (this.data.quizType === 'daily') {
        recordChapterName = '每日一练'
      } else if (this.data.quizType === 'difficulty') {
        recordChapterName = this.data.difficultyName + '难度'
      } else if (this.data.isWrongReview) {
        recordChapterName = '错题复习'
      } else {
        recordChapterName = '知识问答'
      }
    }

    const quizRecord = {
      id: generateId(),
      quizType: this.data.quizType,
      isTimedMode: this.data.isTimedMode,
      isBossMode: this.data.isBossMode,
      chapterName: recordChapterName,
      totalQuestions: total,
      correctCount: correct,
      wrongCount: wrong,
      timeoutCount: timeout,
      accuracy,
      points: totalPoints,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      questions: this.data.questions.map(q => ({
        id: q.id,
        question: q.question,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect
      }))
    }
    app.addQuizRecord(quizRecord)

    this.updateChapterProgress()
    this.markDailyCompleted()

    if (this.data.isTimedMode) {
      this.stopTimer()
    }
  },

  updateChapterProgress() {
    if (this.data.quizType !== 'chapter' || !this.data.chapterId) return

    const chaptersProgress = getStorage('chaptersProgress', {})
    const currentProgress = chaptersProgress[this.data.chapterId] || 0
    const accuracy = this.data.resultData.accuracy

    const newProgress = Math.max(currentProgress, accuracy)
    chaptersProgress[this.data.chapterId] = newProgress

    const unlockAccuracy = this.data.isBossMode ? QUIZ_BOSS_CONFIG.unlockAccuracy : 80

    if (newProgress >= unlockAccuracy) {
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

    const today = formatDate(new Date(), 'YYYY-MM-DD')
    app.addDailyQuizRecord(today)
  },

  onRestart() {
    const shuffled = this.data.questions.sort(() => 0.5 - Math.random())
    this.setData({
      questions: shuffled,
      currentIndex: 0,
      currentQuestion: shuffled[0],
      selectedIndex: -1,
      selectedIndexes: [],
      isAnswered: false,
      isCorrect: false,
      userAnswer: null,
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

  onPreviewImage(e) {
    const { url } = e.currentTarget.dataset
    if (!url) return
    wx.previewImage({
      urls: [url],
      current: url
    })
  },

  onShareAppMessage() {
    return {
      title: '我在垃圾分类助手答题赢积分，快来一起学习吧！',
      path: '/pages/index/index'
    }
  },

  onUnload() {
    this.stopTimer()
  }
})
