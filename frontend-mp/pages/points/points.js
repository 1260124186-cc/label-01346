/**
 * 积分明细页面
 */
const app = getApp()

Page({
  data: {
    currentPoints: 0,
    totalEarned: 0,
    totalSpent: 0,

    filterTabs: [
      { id: 'all', name: '全部' },
      { id: 'earn', name: '获得' },
      { id: 'spend', name: '消费' }
    ],
    currentFilter: 'all',

    allPoints: [],
    pointsList: []
  },

  onLoad() {
    console.log('[Points] 页面加载')
    this.loadPointsRecords()
  },

  onShow() {
    this.loadPointsRecords()
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

  onPullDownRefresh() {
    console.log('[Points] 下拉刷新')
    this.loadPointsRecords()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
