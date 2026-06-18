const app = getApp()
const { navigateTo, formatDate } = require('../../utils/util')

Page({
  data: {
    currentPoints: 0,
    totalEarned: 0,
    totalSpent: 0,
    expiringPoints: 0,
    nearestExpireDate: '',
    expiringBadge: null,

    filterTabs: [
      { id: 'all', name: '全部' },
      { id: 'expiring', name: '即将过期' },
      { id: 'earn', name: '获得' },
      { id: 'spend', name: '消费' }
    ],
    currentFilter: 'all',

    allPoints: [],
    pointsList: [],
    expiringTiered: null,
    expiryPlan: [],

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

  onLoad(options) {
    console.log('[Points] 页面加载')
    if (options && options.tab) {
      this.setData({ currentFilter: options.tab })
    }
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
    const tiered = app.getExpiringPointsTiered()
    const expiryPlan = app.getPointsExpiryPlan()
    const badge = app.getNearestExpiringBadge()

    this.setData({
      expiringPoints: validityInfo.expiringPoints,
      nearestExpireDate: validityInfo.nearestExpireDate,
      expiringTiered: tiered,
      expiryPlan: expiryPlan,
      expiringBadge: badge
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

  buildExpiringList(tiered) {
    const list = []
    const addSection = (tier, tierLabel, tierColor) => {
      if (tier && tier.records && tier.records.length > 0) {
        list.push({
          isSectionHeader: true,
          tierLabel,
          tierColor,
          tierPoints: tier.points
        })
        tier.records.forEach(r => {
          list.push({
            isSectionHeader: false,
            ...r,
            tierLabel,
            tierColor
          })
        })
      }
    }
    addSection(tiered.within1Day, '1天内过期', '#E85D5D')
    addSection(tiered.within7Days, '7天内过期', '#F39C12')
    addSection(tiered.within30Days, '30天内过期', '#4A90D9')
    return list
  },

  filterPoints(type) {
    let list = this.data.allPoints
    if (type === 'earn') {
      list = this.data.allPoints.filter(item => item.type === 'earn')
    } else if (type === 'spend') {
      list = this.data.allPoints.filter(item => item.type === 'spend')
    } else if (type === 'expiring') {
      const tiered = app.getExpiringPointsTiered()
      list = this.buildExpiringList(tiered)
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
    const expiryPlan = app.getPointsExpiryPlan()
    this.setData({
      showValidityModal: true,
      expiryPlan: expiryPlan
    })
  },

  hideValidityRules() {
    this.setData({ showValidityModal: false })
  },

  preventClose() {},

  goToExchange() {
    wx.switchTab({ url: '/pages/exchange/exchange' })
  },

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
