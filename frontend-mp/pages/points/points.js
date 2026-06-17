const app = getApp()
const { navigateTo, formatDate } = require('../../utils/util')

Page({
  data: {
    currentPoints: 0,
    totalEarned: 0,
    totalSpent: 0,
    expiringPoints: 0,
    nearestExpireDate: '',

    filterTabs: [
      { id: 'all', name: '全部' },
      { id: 'earn', name: '获得' },
      { id: 'spend', name: '消费' }
    ],
    currentFilter: 'all',

    allPoints: [],
    pointsList: [],

    quickActions: [
      { id: 'signin', emoji: '📅', title: '每日签到', desc: '连续签到赢积分', color: '#5BBD72' },
      { id: 'quiz', emoji: '❓', title: '知识问答', desc: '答题获得积分', color: '#4A90D9' },
      { id: 'exchange', emoji: '🎁', title: '积分兑换', desc: '积分兑换好礼', color: '#F39C12' },
      { id: 'daily', emoji: '📝', title: '每日一练', desc: '每日答题打卡', color: '#9B59B6' }
    ],

    isSignedToday: false,
    streakDays: 0,
    showValidityModal: false
  },

  onLoad() {
    console.log('[Points] 页面加载')
    this.loadPointsRecords()
  },

  onShow() {
    this.loadPointsRecords()
    this.refreshSignInStatus()
    this.loadExpiringInfo()
  },

  refreshSignInStatus() {
    this.setData({
      isSignedToday: app.isTodaySignedIn(),
      streakDays: app.getStreakDays()
    })
  },

  loadExpiringInfo() {
    const validityInfo = app.getPointsValidityInfo()
    this.setData({
      expiringPoints: validityInfo.expiringPoints,
      nearestExpireDate: validityInfo.nearestExpireDate
    })
  },

  loadPointsRecords() {
    const allPoints = app.getPointsRecords()
    const userInfo = app.globalData.userInfo
    const totalEarned = allPoints
      .filter(item => item.type === 'earn')
      .reduce((sum, item) => sum + item.points, 0)
    const totalSpent = allPoints
      .filter(item => item.type === 'spend')
      .reduce((sum, item) => sum + item.points, 0)
    const currentPoints = userInfo ? userInfo.points : 0

    this.setData({
      allPoints,
      currentPoints,
      totalEarned,
      totalSpent
    })
    this.filterPoints(this.data.currentFilter)
    console.log('[Points] 加载积分记录', allPoints.length, '条')
  },

  filterPoints(type) {
    let list = this.data.allPoints
    if (type === 'earn') {
      list = this.data.allPoints.filter(item => item.type === 'earn')
    } else if (type === 'spend') {
      list = this.data.allPoints.filter(item => item.type === 'spend')
    }

    this.setData({
      pointsList: list,
      currentFilter: type
    })
  },

  onFilterChange(e) {
    const { id } = e.currentTarget.dataset
    this.filterPoints(id)
  },

  onQuickAction(e) {
    const { id } = e.currentTarget.dataset
    console.log('[Points] 点击快捷功能:', id)
    switch (id) {
      case 'signin':
        navigateTo('/pages/signin/signin')
        break
      case 'quiz':
        navigateTo('/pages/quiz/quiz')
        break
      case 'exchange':
        wx.switchTab({ url: '/pages/exchange/exchange' })
        break
      case 'daily':
        navigateTo('/pages/quiz-daily/quiz-daily')
        break
    }
  },

  showValidityRules() {
    this.setData({ showValidityModal: true })
  },

  hideValidityRules() {
    this.setData({ showValidityModal: false })
  },

  preventClose() {},

  onPullDownRefresh() {
    console.log('[Points] 下拉刷新')
    this.loadPointsRecords()
    this.refreshSignInStatus()
    this.loadExpiringInfo()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
