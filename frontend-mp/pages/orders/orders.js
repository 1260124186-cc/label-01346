/**
 * 兑换订单页面
 */
const app = getApp()

Page({
  data: {
    orderList: []
  },

  onLoad() {
    console.log('[Orders] 页面加载')
    this.loadOrders()
  },

  onShow() {
    this.loadOrders()
  },

  loadOrders() {
    const orders = app.getOrders()
    this.setData({ orderList: orders })
    console.log('[Orders] 加载订单', orders.length, '条')
  },

  onReorder(e) {
    wx.switchTab({
      url: '/pages/exchange/exchange'
    })
  },

  goExchange() {
    wx.switchTab({
      url: '/pages/exchange/exchange'
    })
  },

  onPullDownRefresh() {
    console.log('[Orders] 下拉刷新')
    this.loadOrders()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
