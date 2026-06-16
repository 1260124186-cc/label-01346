/**
 * 分类记录页面
 */
const app = getApp()
const { TRASH_TYPES } = require('../../utils/constants')

Page({
  data: {
    // 统计数据
    totalCount: 0,
    totalPoints: 0,
    continuousDays: 0,
    
    // 分类统计
    categoryStats: [],
    
    // 记录列表（混合分类和答题记录）
    recordList: []
  },

  onLoad() {
    console.log('[Records] 页面加载')
    this.loadRecords()
  },

  onShow() {
    this.loadRecords()
  },

  loadRecords() {
    const stats = app.getStatistics()
    const categoryStats = app.getCategoryStats()
    const classifyRecords = app.getClassifyRecords()
    const quizRecords = app.getQuizRecords()

    const totalClassifyPoints = classifyRecords.reduce((sum, r) => sum + r.points, 0)
    const totalQuizPoints = quizRecords.reduce((sum, r) => sum + r.points, 0)

    const mixedRecords = this.mixRecords(classifyRecords, quizRecords)

    this.setData({
      totalCount: stats.classifyCount,
      totalPoints: totalClassifyPoints + totalQuizPoints,
      continuousDays: stats.continuousDays,
      categoryStats,
      recordList: mixedRecords
    })

    console.log('[Records] 记录已加载', mixedRecords.length, '条')
  },

  mixRecords(classifyRecords, quizRecords) {
    const formattedClassify = classifyRecords.map(r => ({
      ...r,
      recordType: 'classify',
      displayTitle: r.trashName,
      displaySubtitle: r.typeName,
      points: r.points,
      pointsPrefix: '+',
      time: r.time
    }))

    const formattedQuiz = quizRecords.map(r => ({
      id: r.id,
      recordType: 'quiz',
      displayTitle: r.chapterName || '知识问答',
      displaySubtitle: `正确${r.correctCount}/${r.totalQuestions}题 正确率${r.accuracy}%`,
      emoji: '❓',
      bgColor: 'rgba(155, 89, 182, 0.1)',
      points: r.points,
      pointsPrefix: '+',
      time: r.time
    }))

    const all = [...formattedClassify, ...formattedQuiz]
    all.sort((a, b) => {
      const timeA = new Date(a.time.replace(' ', 'T')).getTime()
      const timeB = new Date(b.time.replace(' ', 'T')).getTime()
      return timeB - timeA
    })

    return all
  },

  onPullDownRefresh() {
    console.log('[Records] 下拉刷新')
    this.loadRecords()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
