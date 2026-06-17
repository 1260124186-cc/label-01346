/**
 * 答题历史列表页面
 * @description 展示所有答题记录，支持按类型筛选
 */
const app = getApp()
const { navigateTo, formatDate } = require('../../utils/util')

Page({
  data: {
    records: [],
    filteredRecords: [],
    filterType: 'all',
    filterOptions: [
      { id: 'all', name: '全部', icon: '📋' },
      { id: 'chapter', name: '章节', icon: '📚' },
      { id: 'daily', name: '每日', icon: '📅' },
      { id: 'timed', name: '限时', icon: '⏱️' },
      { id: 'boss', name: 'Boss', icon: '👹' },
      { id: 'wrong', name: '错题', icon: '📝' }
    ],
    stats: {
      totalCount: 0,
      totalPoints: 0,
      totalQuestions: 0,
      totalCorrect: 0,
      avgAccuracy: 0
    }
  },

  onLoad() {
    console.log('[QuizRecords] 页面加载')
    this.loadRecords()
  },

  onShow() {
    console.log('[QuizRecords] 页面显示')
    this.loadRecords()
  },

  loadRecords() {
    const records = app.getQuizRecords()
    const processedRecords = records.map(record => {
      const quizType = record.quizType || 'chapter'
      const isTimed = record.isTimed || quizType === 'timed'
      const isBoss = record.isBoss || quizType === 'boss'
      const isWrongReview = record.isWrongReview || quizType === 'wrong'
      const isDaily = quizType === 'daily'

      let typeIcon = '📚'
      let typeName = '章节练习'
      let typeColor = '#4A90D9'

      if (isTimed) {
        typeIcon = '⏱️'
        typeName = '限时挑战'
        typeColor = '#9B59B6'
      } else if (isBoss) {
        typeIcon = '👹'
        typeName = 'Boss关'
        typeColor = '#E74C3C'
      } else if (isWrongReview) {
        typeIcon = '📝'
        typeName = '错题复习'
        typeColor = '#E85D5D'
      } else if (isDaily) {
        typeIcon = '📅'
        typeName = '每日一练'
        typeColor = '#5BBD72'
      }

      const accuracy = record.accuracy || 0
      let accuracyLevel = 'normal'
      if (accuracy >= 90) accuracyLevel = 'excellent'
      else if (accuracy >= 80) accuracyLevel = 'good'
      else if (accuracy >= 60) accuracyLevel = 'normal'
      else accuracyLevel = 'poor'

      const timeoutCount = record.timeoutCount || 0

      return {
        ...record,
        typeIcon,
        typeName,
        typeColor,
        accuracyLevel,
        timeoutCount
      }
    })

    this.setData({
      records: processedRecords
    })

    this.filterRecords()
    this.calculateStats(processedRecords)
  },

  filterRecords() {
    const filterType = this.data.filterType
    const records = this.data.records

    let filtered = records
    if (filterType !== 'all') {
      filtered = records.filter(r => {
        if (filterType === 'timed') return r.isTimed || r.quizType === 'timed'
        if (filterType === 'boss') return r.isBoss || r.quizType === 'boss'
        if (filterType === 'wrong') return r.isWrongReview || r.quizType === 'wrong'
        return r.quizType === filterType
      })
    }

    this.setData({
      filteredRecords: filtered
    })
  },

  calculateStats(records) {
    if (records.length === 0) {
      this.setData({
        stats: {
          totalCount: 0,
          totalPoints: 0,
          totalQuestions: 0,
          totalCorrect: 0,
          avgAccuracy: 0
        }
      })
      return
    }

    const totalCount = records.length
    const totalPoints = records.reduce((sum, r) => sum + (r.points || 0), 0)
    const totalQuestions = records.reduce((sum, r) => sum + (r.totalQuestions || 0), 0)
    const totalCorrect = records.reduce((sum, r) => sum + (r.correctCount || 0), 0)
    const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

    this.setData({
      stats: {
        totalCount,
        totalPoints,
        totalQuestions,
        totalCorrect,
        avgAccuracy
      }
    })
  },

  onFilterChange(e) {
    const { filterType } = e.currentTarget.dataset
    console.log('[QuizRecords] 切换筛选', filterType)
    this.setData({ filterType })
    this.filterRecords()
  },

  onRecordTap(e) {
    const { record } = e.currentTarget.dataset
    console.log('[QuizRecords] 点击记录', record.id)
    navigateTo('/pages/quiz-record-detail/quiz-record-detail', {
      recordId: record.id
    })
  },

  onPullDownRefresh() {
    console.log('[QuizRecords] 下拉刷新')
    this.loadRecords()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
