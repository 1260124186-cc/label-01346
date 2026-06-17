const app = getApp()
const { LEADERBOARD_CONFIG } = require('../../utils/constants')
const { navigateTo, formatNumber } = require('../../utils/util')

Page({
  data: {
    periods: LEADERBOARD_CONFIG.periods,
    dimensions: LEADERBOARD_CONFIG.dimensions,
    currentPeriod: 'week',
    currentDimension: 'points',
    leaderboardList: [],
    myRank: 0,
    myData: null,
    seasonInfo: null
  },

  onLoad() {
    this.loadSeasonInfo()
    this.loadLeaderboard()
  },

  onShow() {
    this.loadSeasonInfo()
    this.loadLeaderboard()
  },

  onPeriodTap(e) {
    const { id } = e.currentTarget.dataset
    if (id === this.data.currentPeriod) return
    this.setData({ currentPeriod: id })
    this.loadLeaderboard()
  },

  onDimensionTap(e) {
    const { id } = e.currentTarget.dataset
    if (id === this.data.currentDimension) return
    this.setData({ currentDimension: id })
    this.loadLeaderboard()
  },

  loadLeaderboard() {
    const { currentPeriod, currentDimension } = this.data
    const result = app.getLeaderboard(currentPeriod, currentDimension)
    if (!result) return

    const currentDim = this.data.dimensions.find(d => d.id === currentDimension)
    const list = result.list.map(user => ({
      ...user,
      displayValue: this.formatValue(user[currentDimension], currentDim)
    }))

    this.setData({
      leaderboardList: list,
      myRank: result.myRank,
      myData: result.myData ? {
        ...result.myData,
        displayValue: this.formatValue(result.myData[currentDimension], currentDim)
      } : null
    })
  },

  loadSeasonInfo() {
    const seasonInfo = app.getSeasonInfo()
    this.setData({ seasonInfo })
  },

  formatValue(value, dimension) {
    if (!dimension) return value
    if (dimension.id === 'accuracy') {
      return value + '%'
    }
    return formatNumber(value || 0) + (dimension.unit || '')
  },

  onPKTap() {
    navigateTo('/pages/pk-battle/pk-battle')
  },

  onPullDownRefresh() {
    this.loadSeasonInfo()
    this.loadLeaderboard()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  }
})
