const app = getApp()
const { showToast, showModal, navigateTo } = require('../../utils/util')
const { RECYCLE_ORDER_STATUS } = require('../../utils/constants')

Page({
  data: {
    orderId: '',
    order: null,
    statusSteps: [
      { key: 'pending', text: '待接单', icon: '⏳' },
      { key: 'appointed', text: '已预约', icon: '✅' },
      { key: 'visiting', text: '上门中', icon: '🚚' },
      { key: 'completed', text: '已完成', icon: '🎉' }
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
    const order = app.getRecycleOrderById(this.data.orderId)
    if (order) {
      this.setData({ order })
      wx.setNavigationBarTitle({ title: '回收订单详情' })
    }
  },

  getStatusIndex(status) {
    const map = { pending: 0, appointed: 1, visiting: 2, completed: 3 }
    return map[status] !== undefined ? map[status] : 0
  },

  isStepDone(stepKey) {
    const order = this.data.order
    if (!order) return false
    const statusOrder = ['pending', 'appointed', 'visiting', 'completed']
    const currentIndex = statusOrder.indexOf(order.status)
    const stepIndex = statusOrder.indexOf(stepKey)
    return stepIndex <= currentIndex
  },

  getStepTime(stepKey) {
    const order = this.data.order
    if (!order || !order.statusHistory) return ''
    const history = order.statusHistory.find(h => h.status === stepKey)
    return history ? history.time : ''
  },

  async onCancelOrder() {
    const confirmed = await showModal({
      title: '取消订单',
      content: '确定要取消这个回收订单吗？取消后无法恢复。',
      confirmText: '确认取消',
      confirmColor: '#E85D5D'
    })

    if (!confirmed) return

    const success = app.cancelRecycleOrder(this.data.orderId)
    if (success) {
      showToast('订单已取消', 'success')
      this.loadOrderDetail()
    } else {
      showToast('取消失败，请重试')
    }
  },

  onReorder() {
    navigateTo('/pages/recycle-book/recycle-book')
  },

  onCopyOrderNo() {
    if (!this.data.order || !this.data.order.orderNo) return

    wx.setClipboardData({
      data: this.data.order.orderNo,
      success: () => {
        showToast('订单号已复制')
      }
    })
  },

  onContactService() {
    showToast('客服功能开发中')
  }
})
