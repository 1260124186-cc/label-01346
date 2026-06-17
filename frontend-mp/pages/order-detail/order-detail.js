const app = getApp()
const { showToast, showModal, navigateTo } = require('../../utils/util')

Page({
  data: {
    orderId: '',
    order: null,
    statusSteps: [
      { key: 'pending', text: '待发货', icon: '📦' },
      { key: 'shipped', text: '已发货', icon: '🚚' },
      { key: 'completed', text: '已完成', icon: '✅' }
    ]
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ orderId: options.id })
      this.loadOrderDetail()
    }
  },

  onShow() {
    if (this.data.orderId) {
      this.loadOrderDetail()
    }
  },

  loadOrderDetail() {
    const order = app.getOrderById(this.data.orderId)
    if (order) {
      this.setData({ order })
      wx.setNavigationBarTitle({ title: '订单详情' })
    }
  },

  getStatusIndex(status) {
    const map = { pending: 0, shipped: 1, completed: 2 }
    return map[status] || 0
  },

  async onConfirmReceive() {
    const confirmed = await showModal({
      title: '确认收货',
      content: '请确认您已收到商品，确认后订单将完成。',
      confirmText: '确认收货'
    })
    
    if (!confirmed) return
    
    app.updateOrderStatus(this.data.orderId, 'completed')
    this.loadOrderDetail()
    showToast('收货成功', 'success')
  },

  onCopyLogisticsNo() {
    if (!this.data.order || !this.data.order.logisticsNo) return
    
    wx.setClipboardData({
      data: this.data.order.logisticsNo,
      success: () => {
        showToast('单号已复制')
      }
    })
  },

  onGoExchange() {
    wx.switchTab({
      url: '/pages/exchange/exchange'
    })
  },

  onContactService() {
    showToast('客服功能开发中')
  }
})
