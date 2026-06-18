/**
 * 错题本页面
 * @description 复习做错的题目
 */
const app = getApp()
const { QUIZ_WRONG_SORT_CONFIG } = require('../../utils/constants')
const { navigateTo, showToast, showModal, getStorage, setStorage, formatDate } = require('../../utils/util')

Page({
  data: {
    wrongQuestions: [],
    selectedQuestions: [],
    isSelectMode: false,
    userPoints: 0,
    sortBy: 'wrongCount',
    sortOptions: [
      { id: 'wrongCount', name: '错误次数', icon: '📊' },
      { id: 'wrongTime', name: '最近错误', icon: '⏰' }
    ],
    QUESTION_TYPE_MAP: {
      single: { name: '单选', icon: '○' },
      multiple: { name: '多选', icon: '☐' },
      judge: { name: '判断', icon: '✓' }
    },
    SCENE_MAP: {
      kitchen: '厨房',
      office: '办公室',
      campus: '校园'
    }
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
    let wrongQuestions = app.getWrongQuestions()

    const sortBy = this.data.sortBy
    wrongQuestions = this.sortWrongQuestions(wrongQuestions, sortBy)

    const processedQuestions = wrongQuestions.map(q => {
      const type = q.type || 'single'
      let options = q.options
      let correctIndex = q.correctIndex
      let correctIndexes = q.correctIndexes || []
      const wrongCount = q.wrongCount || 1
      const wrongTime = q.wrongTime || new Date().toISOString()

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
      const difficultyNameMap = { easy: '简单', medium: '中等', hard: '困难' }
      const difficulty = q.difficulty || 'medium'

      const wrongTimeDisplay = formatDate(new Date(wrongTime), 'MM-DD HH:mm')

      return {
        ...q,
        type,
        options,
        optionsWithLabel,
        correctIndex,
        correctIndexes,
        correctAnswerLabel,
        sceneLabels,
        difficulty,
        difficultyName: difficultyNameMap[difficulty] || '简单',
        wrongCount,
        wrongTime,
        wrongTimeDisplay
      }
    })

    this.setData({
      wrongQuestions: processedQuestions,
      selectedQuestions: [],
      isSelectMode: false
    })
  },

  sortWrongQuestions(questions, sortBy) {
    const sorted = [...questions]
    
    if (sortBy === 'wrongCount') {
      sorted.sort((a, b) => {
        const countA = a.wrongCount || 1
        const countB = b.wrongCount || 1
        if (countB !== countA) {
          return countB - countA
        }
        return new Date(b.wrongTime || 0) - new Date(a.wrongTime || 0)
      })
    } else if (sortBy === 'wrongTime') {
      sorted.sort((a, b) => {
        const timeA = new Date(a.wrongTime || 0)
        const timeB = new Date(b.wrongTime || 0)
        if (timeB.getTime() !== timeA.getTime()) {
          return timeB - timeA
        }
        return (b.wrongCount || 1) - (a.wrongCount || 1)
      })
    }

    return sorted
  },

  onSortChange(e) {
    const { sortBy } = e.currentTarget.dataset
    console.log('[QuizWrong] 切换排序', sortBy)
    this.setData({ sortBy })
    this.loadWrongQuestions()
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

  onEnterSelectMode() {
    if (!this.data.isSelectMode) {
      this.setData({
        isSelectMode: true,
        selectedQuestions: []
      })
    }
  },

  onQuestionLongPress(e) {
    const { index } = e.currentTarget.dataset
    console.log('[QuizWrong] 长按题目', index)

    if (!this.data.isSelectMode) {
      this.setData({
        isSelectMode: true,
        selectedQuestions: index !== undefined ? [index] : []
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
