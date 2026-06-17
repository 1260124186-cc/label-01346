const app = getApp()
const { navigateTo, switchTab, showToast } = require('../../utils/util')

Page({
  data: {
    orderList: [],
    currentTab: 'all',
    tabs: [
      { id: 'all', name: '全部' },
      { id: 'pending', name: '待发货' },
      { id: 'shipped', name: '已发货' },
      { id: 'completed', name: '已完成' }
    ]
  },

  onLoad() {
    console.log('[Orders] 页面加载')
    this.loadOrders()
  },

  onShow() {
    this.loadOrders()
  },

  loadOrders() {
    const { currentTab } = this.data
    const orders = app.getOrdersByStatus(currentTab)
    this.setData({ orderList: orders })
    console.log('[Orders] 加载订单', orders.length, '条')
  },

  onTabChange(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ currentTab: id })
    this.loadOrders()
  },

  onOrderTap(e) {
    const { id } = e.currentTarget.dataset
    navigateTo('/pages/order-detail/order-detail', { id })
  },

  async onConfirmReceive(e) {
    const { id } = e.currentTarget.dataset
    const confirmed = await wx.showModal({
      title: '确认收货',
      content: '请确认您已收到商品，确认后订单将完成。',
      confirmText: '确认收货',
      confirmColor: '#5BBD72'
    })
    
    if (!confirmed.confirm) return
    
    app.updateOrderStatus(id, 'completed')
    this.loadOrders()
    showToast('收货成功', 'success')
  },

  onGoExchange() {
    switchTab('/pages/exchange/exchange')
  },

  onPullDownRefresh() {
    console.log('[Orders] 下拉刷新')
    this.loadOrders()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
