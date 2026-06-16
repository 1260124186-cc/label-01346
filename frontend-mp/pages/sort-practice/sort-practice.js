/**
 * 垃圾分类练习页面
 * @description 随机展示垃圾名称/图片，用户四选一选择类别
 * 支持三种模式：按类别练习、随机混合、易错题
 */
const app = getApp()
const {
  TRASH_TYPES,
  getRandomSortItems,
  SORT_PRACTICE_ITEMS
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

const QUESTION_COUNT = 10
const POINTS_PER_CORRECT = 10

Page({
  data: {
    practiceMode: 'random',
    typeId: null,
    typeName: '',

    questions: [],
    currentIndex: 0,
    currentQuestion: null,

    options: [],

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
    console.log('[SortPractice] 页面加载', options)
    this.initPractice(options)
  },

  initPractice(options) {
    const { mode, typeId, typeName } = options
    let questions = []
    let practiceMode = mode || 'random'

    if (practiceMode === 'wrong') {
      const wrongItems = getStorage('wrongSortItems', [])
      if (wrongItems.length === 0) {
        showToast('暂无错题')
        setTimeout(() => {
          navigateBack()
        }, 1500)
        return
      }
      questions = wrongItems.map(item => ({
        ...item,
        isWrongReview: true
      }))
    } else if (practiceMode === 'category' && typeId) {
      questions = getRandomSortItems(QUESTION_COUNT, parseInt(typeId))
    } else {
      questions = getRandomSortItems(QUESTION_COUNT)
    }

    if (questions.length === 0) {
      showToast('暂无练习题目')
      setTimeout(() => {
        navigateBack()
      }, 1500)
      return
    }

    const processedQuestions = questions.map(q => ({
      ...q,
      correctType: TRASH_TYPES.find(t => t.id === q.typeId)
    }))

    const shuffled = processedQuestions.sort(() => 0.5 - Math.random())

    const firstQuestion = shuffled[0]
    const options = this.generateOptions(firstQuestion.typeId)

    this.setData({
      practiceMode,
      typeId: typeId ? parseInt(typeId) : null,
      typeName: typeName || '',
      questions: shuffled,
      currentIndex: 0,
      currentQuestion: firstQuestion,
      options,
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

  generateOptions(correctTypeId) {
    const types = [...TRASH_TYPES]
    const options = types.map((type, index) => ({
      typeId: type.id,
      name: type.name,
      emoji: type.emoji,
      color: type.color,
      bgColor: type.bgColor,
      index
    }))
    return options.sort(() => 0.5 - Math.random())
  },

  updateNavigationTitle() {
    let title = '垃圾分类练习'
    if (this.data.practiceMode === 'category' && this.data.typeName) {
      title = this.data.typeName + '练习'
    } else if (this.data.practiceMode === 'wrong') {
      title = '易错题练习'
    }
    wx.setNavigationBarTitle({ title })
  },

  onSelectOption(e) {
    if (this.data.isAnswered) return

    const { typeid } = e.currentTarget.dataset
    const question = this.data.currentQuestion
    const isCorrect = parseInt(typeid) === question.typeId
    const selectedIndex = this.data.options.findIndex(opt => opt.typeId === parseInt(typeid))

    this.setData({
      selectedIndex,
      isAnswered: true,
      isCorrect
    })

    if (isCorrect) {
      const newCorrectCount = this.data.correctCount + 1
      const newTotalPoints = this.data.totalPoints + POINTS_PER_CORRECT

      this.setData({
        correctCount: newCorrectCount,
        totalPoints: newTotalPoints
      })

      this.addClassifyRecord(question)

      app.updateUserPoints(POINTS_PER_CORRECT, {
        category: 'classify',
        title: '垃圾分类练习',
        desc: `正确分类：${question.name}`,
        emoji: question.emoji
      })

      showSuccess(`答对了！+${POINTS_PER_CORRECT}积分`)

      this.removeFromWrongItems(question.id)
    } else {
      const newWrongCount = this.data.wrongCount + 1
      this.setData({
        wrongCount: newWrongCount
      })

      showToast('答错了，继续加油！', 'none')
      this.addToWrongItems(question)
    }

    this.updateProgress()
  },

  addClassifyRecord(question) {
    const trashType = TRASH_TYPES.find(t => t.id === question.typeId)
    const record = {
      id: generateId(),
      trashName: question.name,
      typeId: question.typeId,
      typeName: trashType ? trashType.name : '',
      emoji: question.emoji,
      bgColor: trashType ? trashType.bgColor : '',
      points: POINTS_PER_CORRECT,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }
    app.addClassifyRecord(record)
  },

  addToWrongItems(item) {
    const wrongItems = getStorage('wrongSortItems', [])
    const exists = wrongItems.some(i => i.id === item.id)

    if (!exists) {
      wrongItems.push({
        ...item,
        wrongTime: new Date().toISOString(),
        wrongCount: 1
      })
      setStorage('wrongSortItems', wrongItems)
    } else {
      const updated = wrongItems.map(i => {
        if (i.id === item.id) {
          return { ...i, wrongCount: (i.wrongCount || 1) + 1, wrongTime: new Date().toISOString() }
        }
        return i
      })
      setStorage('wrongSortItems', updated)
    }
  },

  removeFromWrongItems(itemId) {
    const wrongItems = getStorage('wrongSortItems', [])
    const filtered = wrongItems.filter(i => i.id !== itemId)
    setStorage('wrongSortItems', filtered)
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
      this.showPracticeResult()
      return
    }

    const nextQuestion = this.data.questions[nextIndex]
    const options = this.generateOptions(nextQuestion.typeId)

    this.setData({
      currentIndex: nextIndex,
      currentQuestion: nextQuestion,
      options,
      selectedIndex: -1,
      isAnswered: false,
      isCorrect: false
    })
  },

  showPracticeResult() {
    const total = this.data.questions.length
    const correct = this.data.correctCount
    const wrong = this.data.wrongCount
    const basePoints = this.data.totalPoints
    const bonusPoints = correct >= total * 0.8 ? 20 : (correct >= total * 0.6 ? 10 : 0)
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

    if (bonusPoints > 0) {
      app.updateUserPoints(bonusPoints, {
        category: 'classify',
        title: '练习奖励',
        desc: `完成练习正确率${accuracy}%`,
        emoji: '🎁'
      })
    }

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
  },

  onGoToKnowledge() {
    const question = this.data.currentQuestion
    const typeId = question.typeId
    const typeName = TRASH_TYPES.find(t => t.id === typeId)

    if (typeName) {
      navigateTo('/pages/classify/classify', {
      id: typeId,
      name: typeName.name
    })
    }
  },

  onRestart() {
    const options = {
      mode: this.data.practiceMode,
      typeId: this.data.typeId,
      typeName: this.data.typeName
    }
    this.initPractice(options)
  },

  onBack() {
    navigateBack()
  },

  onGoToWrong() {
    if (this.data.wrongCount === 0) {
      showToast('暂无错题')
      return
    }
    navigateTo('/pages/sort-practice/sort-practice', {
      mode: 'wrong'
    })
  },

  onShareAppMessage() {
    return {
      title: '我在垃圾分类助手练习分类，快来一起学习吧！',
      path: '/pages/index/index'
    }
  }
})
