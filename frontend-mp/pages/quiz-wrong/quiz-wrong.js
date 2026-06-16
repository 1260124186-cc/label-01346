/**
 * 错题本页面
 * @description 复习做错的题目
 */
const app = getApp()
const { navigateTo, showToast, showModal, getStorage, setStorage } = require('../../utils/util')

Page({
  data: {
    wrongQuestions: [],
    selectedQuestions: [],
    isSelectMode: false,
    userPoints: 0
  },

  onLoad() {
    console.log('[QuizWrong] 页面加载')
    this.initPageData()
  },

  onShow() {
    console.log('[QuizWrong] 页面显示')
    this.refreshData()
  },

  initPageData() {
    this.refreshData()
  },

  refreshData() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userPoints: userInfo.points || 0
      })
    }

    this.loadWrongQuestions()
  },

  loadWrongQuestions() {
    const wrongQuestions = getStorage('wrongQuestions', [])

    const processedQuestions = wrongQuestions.map(q => ({
      ...q,
      optionsWithLabel: q.options.map((opt, idx) => ({
        text: opt,
        label: String.fromCharCode(65 + idx)
      })),
      correctAnswerLabel: String.fromCharCode(65 + q.correctIndex)
    }))

    this.setData({
      wrongQuestions: processedQuestions,
      selectedQuestions: [],
      isSelectMode: false
    })
  },

  onQuestionTap(e) {
    const { question, index } = e.currentTarget.dataset
    console.log('[QuizWrong] 点击题目', question.question)

    if (this.data.isSelectMode) {
      this.toggleSelect(index)
    } else {
      this.startReview([question])
    }
  },

  onQuestionLongPress(e) {
    const { index } = e.currentTarget.dataset
    console.log('[QuizWrong] 长按题目', index)

    if (!this.data.isSelectMode) {
      this.setData({
        isSelectMode: true,
        selectedQuestions: [index]
      })
    }
  },

  toggleSelect(index) {
    const selected = [...this.data.selectedQuestions]
    const idx = selected.indexOf(index)

    if (idx > -1) {
      selected.splice(idx, 1)
    } else {
      selected.push(index)
    }

    this.setData({
      selectedQuestions: selected
    })

    if (selected.length === 0) {
      this.setData({
        isSelectMode: false
      })
    }
  },

  onSelectAll() {
    const total = this.data.wrongQuestions.length
    const selected = this.data.selectedQuestions.length

    if (selected === total) {
      this.setData({
        selectedQuestions: [],
        isSelectMode: false
      })
    } else {
      const allIndices = this.data.wrongQuestions.map((_, i) => i)
      this.setData({
        selectedQuestions: allIndices
      })
    }
  },

  onDeleteSelected() {
    if (this.data.selectedQuestions.length === 0) {
      showToast('请先选择题目')
      return
    }

    showModal({
      title: '确认删除',
      content: `确定要删除选中的 ${this.data.selectedQuestions.length} 道题目吗？`,
      confirmText: '删除',
      confirmColor: '#E85D5D'
    }).then(confirmed => {
      if (confirmed) {
        this.deleteSelected()
      }
    })
  },

  deleteSelected() {
    const selected = this.data.selectedQuestions.sort((a, b) => b - a)
    let wrongQuestions = [...this.data.wrongQuestions]

    selected.forEach(index => {
      wrongQuestions.splice(index, 1)
    })

    setStorage('wrongQuestions', wrongQuestions)

    this.setData({
      wrongQuestions,
      selectedQuestions: [],
      isSelectMode: false
    })

    showToast('删除成功')
  },

  onStartReview() {
    let questionsToReview = []

    if (this.data.isSelectMode && this.data.selectedQuestions.length > 0) {
      questionsToReview = this.data.selectedQuestions.map(index => this.data.wrongQuestions[index])
    } else {
      questionsToReview = [...this.data.wrongQuestions]
    }

    if (questionsToReview.length === 0) {
      showToast('暂无错题')
      return
    }

    this.startReview(questionsToReview)
  },

  startReview(questions) {
    const questionIds = questions.map(q => q.id).join(',')
    navigateTo('/pages/quiz-play/quiz-play', {
      type: 'wrong',
      isWrongReview: 'true',
      questionIds: questionIds
    })
  },

  onCancelSelect() {
    this.setData({
      isSelectMode: false,
      selectedQuestions: []
    })
  },

  onPullDownRefresh() {
    console.log('[QuizWrong] 下拉刷新')
    this.refreshData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
