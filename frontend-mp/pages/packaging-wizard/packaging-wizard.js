const app = getApp()
const {
  getCompositePackagingById,
  generateQuizFromPackaging,
  PACKAGING_QUIZ_POINTS
} = require('../../data/packaging')
const {
  getTrashTypesForCity
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

const POINTS_PER_CORRECT = PACKAGING_QUIZ_POINTS

Page({
  data: {
    packagingId: '',
    packaging: null,
    currentStepIndex: 0,
    currentComponent: null,
    totalSteps: 0,
    requiredCount: 0,
    progressPercent: 0,

    showQuiz: false,
    quizQuestions: [],
    quizCurrentIndex: 0,
    currentQuizQuestion: null,
    quizOptions: [],
    quizSelectedIndex: -1,
    quizIsAnswered: false,
    quizIsCorrect: false,
    quizCorrectCount: 0,
    quizWrongCount: 0,
    quizProgressPercent: 0,

    showResult: false,
    resultTitle: '',
    resultEmoji: '',
    resultTotal: 0,
    resultCorrect: 0,
    resultWrong: 0,
    resultPoints: 0,
    resultBasePoints: 0,
    resultBonusPoints: 0,
    resultAccuracy: 0
  },

  onLoad(options) {
    console.log('[PackagingWizard] 页面加载', options)
    if (options.id) {
      this.initWizard(options.id)
    } else {
      showToast('参数错误')
      setTimeout(() => navigateBack(), 1500)
    }
  },

  initWizard(pkgId) {
    const pkg = getCompositePackagingById(pkgId)
    if (!pkg) {
      showToast('未找到该包装信息')
      setTimeout(() => navigateBack(), 1500)
      return
    }

    const requiredCount = pkg.components.filter(c => c.isRequired).length
    const currentComponent = pkg.components[0]
    const progressPercent = pkg.components.length > 0 ? (1 / pkg.components.length) * 100 : 0

    this.setData({
      packagingId: pkgId,
      packaging: pkg,
      currentStepIndex: 0,
      currentComponent: currentComponent,
      totalSteps: pkg.components.length,
      requiredCount: requiredCount,
      progressPercent: progressPercent
    })

    wx.setNavigationBarTitle({ title: pkg.name + ' · 拆解向导' })
  },

  onPrevStep() {
    const prevIndex = this.data.currentStepIndex - 1
    if (prevIndex < 0) return

    const prevComponent = this.data.packaging.components[prevIndex]
    const progressPercent = ((prevIndex + 1) / this.data.totalSteps) * 100

    this.setData({
      currentStepIndex: prevIndex,
      currentComponent: prevComponent,
      progressPercent: progressPercent
    })
  },

  onNextStep() {
    const nextIndex = this.data.currentStepIndex + 1

    if (nextIndex >= this.data.totalSteps) {
      this.startQuiz()
      return
    }

    const nextComponent = this.data.packaging.components[nextIndex]
    const progressPercent = ((nextIndex + 1) / this.data.totalSteps) * 100

    this.setData({
      currentStepIndex: nextIndex,
      currentComponent: nextComponent,
      progressPercent: progressPercent
    })
  },

  startQuiz() {
    console.log('[PackagingWizard] 开始小测')
    const pkg = this.data.packaging
    const quizQuestions = generateQuizFromPackaging(pkg)
    const currentCity = app.getCurrentCity()
    const cityTypes = getTrashTypesForCity(currentCity)

    const quizOptions = cityTypes.map(t => ({
      optTypeId: t.id,
      optTypeName: t.name,
      optTypeEmoji: t.emoji,
      optTypeColor: t.color,
      optTypeBgColor: t.bgColor
    })).sort(() => 0.5 - Math.random())

    this.setData({
      showQuiz: true,
      quizQuestions: quizQuestions,
      quizCurrentIndex: 0,
      currentQuizQuestion: quizQuestions[0],
      quizOptions: quizOptions,
      quizSelectedIndex: -1,
      quizIsAnswered: false,
      quizIsCorrect: false,
      quizCorrectCount: 0,
      quizWrongCount: 0,
      quizProgressPercent: (1 / quizQuestions.length) * 100
    })

    wx.setNavigationBarTitle({ title: '拆解小测' })
  },

  onQuizSelect(e) {
    if (this.data.quizIsAnswered) return

    const { opttypeid, optindex } = e.currentTarget.dataset
    const question = this.data.currentQuizQuestion
    const selectedTypeId = parseInt(opttypeid)
    const correct = selectedTypeId === question.correctTypeId

    this.setData({
      quizSelectedIndex: parseInt(optindex),
      quizIsAnswered: true,
      quizIsCorrect: correct
    })

    if (correct) {
      const newCorrectCount = this.data.quizCorrectCount + 1
      this.setData({ quizCorrectCount: newCorrectCount })
      this.addPackagingRecord(question)
      app.updateUserPoints(POINTS_PER_CORRECT, {
        category: 'classify',
        title: '组合包装拆解',
        desc: '正确分类：' + question.componentname,
        emoji: '🔧'
      })
      showSuccess('答对了！+' + POINTS_PER_CORRECT + '积分')
    } else {
      const newWrongCount = this.data.quizWrongCount + 1
      this.setData({ quizWrongCount: newWrongCount })
      showToast('答错了，继续加油！', 'none')
    }
  },

  addPackagingRecord(question) {
    const record = {
      id: generateId(),
      trashName: question.componentname,
      typeId: question.typeId,
      typeName: question.typeName,
      emoji: question.typeEmoji,
      bgColor: question.typeBgColor,
      points: POINTS_PER_CORRECT,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      source: 'packaging_quiz'
    }
    app.addClassifyRecord(record)
  },

  onQuizNext() {
    const nextIndex = this.data.quizCurrentIndex + 1

    if (nextIndex >= this.data.quizQuestions.length) {
      this.showQuizResult()
      return
    }

    const nextQuestion = this.data.quizQuestions[nextIndex]
    const currentCity = app.getCurrentCity()
    const cityTypes = getTrashTypesForCity(currentCity)
    const quizOptions = cityTypes.map(t => ({
      optTypeId: t.id,
      optTypeName: t.name,
      optTypeEmoji: t.emoji,
      optTypeColor: t.color,
      optTypeBgColor: t.bgColor
    })).sort(() => 0.5 - Math.random())

    this.setData({
      quizCurrentIndex: nextIndex,
      currentQuizQuestion: nextQuestion,
      quizOptions: quizOptions,
      quizSelectedIndex: -1,
      quizIsAnswered: false,
      quizIsCorrect: false,
      quizProgressPercent: ((nextIndex + 1) / this.data.quizQuestions.length) * 100
    })
  },

  showQuizResult() {
    const total = this.data.quizQuestions.length
    const correct = this.data.quizCorrectCount
    const wrong = this.data.quizWrongCount
    const basePoints = correct * POINTS_PER_CORRECT
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
        title: '拆解小测奖励',
        desc: '完成小测正确率' + accuracy + '%',
        emoji: '🎁'
      })
    }

    const completedPkgIds = getStorage('completedPackagingWizard', [])
    if (!completedPkgIds.includes(this.data.packagingId)) {
      completedPkgIds.push(this.data.packagingId)
      setStorage('completedPackagingWizard', completedPkgIds)
    }

    this.setData({
      showQuiz: false,
      showResult: true,
      resultTitle: resultTitle,
      resultEmoji: resultEmoji,
      resultTotal: total,
      resultCorrect: correct,
      resultWrong: wrong,
      resultPoints: totalPoints,
      resultBasePoints: basePoints,
      resultBonusPoints: bonusPoints,
      resultAccuracy: accuracy
    })

    wx.setNavigationBarTitle({ title: '拆解结果' })
  },

  onGoBack() {
    navigateBack()
  },

  onRestartWizard() {
    this.setData({
      showQuiz: false,
      showResult: false,
      currentStepIndex: 0,
      currentComponent: this.data.packaging.components[0],
      progressPercent: (1 / this.data.totalSteps) * 100
    })
    wx.setNavigationBarTitle({ title: this.data.packaging.name + ' · 拆解向导' })
  },

  goToSubmitPackaging() {
    navigateTo('/pages/packaging-submit/packaging-submit')
  },

  onShareAppMessage() {
    const pkg = this.data.packaging
    return {
      title: (pkg ? pkg.name : '组合包装') + '拆解向导 - 垃圾分类助手',
      path: '/pages/packaging-wizard/packaging-wizard?id=' + this.data.packagingId
    }
  }
})
