const app = getApp()
const { navigateTo, showToast } = require('../../utils/util')
const { RECYCLE_ORDER_STATUS, RECYCLE_CATEGORIES } = require('../../utils/constants')

Page({
  data: {
    orderList: [],
    currentTab: 'all',
    tabs: [
      { id: 'all', name: '全部' },
      { id: 'pending', name: '待接单' },
      { id: 'appointed', name: '已预约' },
      { id: 'visiting', name: '上门中' },
      { id: 'completed', name: '已完成' },
      { id: 'cancelled', name: '已取消' }
    ]
  },

  onLoad() {
    console.log('[RecycleOrders] 页面加载')
    this.loadOrders()
  },

  onShow() {
    this.loadOrders()
  },

  loadOrders() {
    const { currentTab } = this.data
    const orders = app.getRecycleOrdersByStatus(currentTab)
    const orderList = orders.map(order => {
      const category = RECYCLE_CATEGORIES.find(c => c.id === order.categoryId) || {}
      const statusInfo = RECYCLE_ORDER_STATUS[order.status] || {}
      const points = order.status === 'completed' ? order.actualPoints : order.estimatedPoints
      const pointsLabel = order.status === 'completed' ? '实际积分' : '预估积分'
      let appointmentTime = ''
      if (order.appointmentDate && order.appointmentTimeName) {
        appointmentTime = order.appointmentDate + ' ' + order.appointmentTimeName
      } else if (order.appointmentDate) {
        appointmentTime = order.appointmentDate
      }
      return {
        ...order,
        categoryName: category.name || order.categoryName || '',
        categoryEmoji: category.emoji || order.categoryEmoji || '📦',
        categoryColor: category.color || '#999',
        statusText: order.statusText || statusInfo.text || '',
        statusColor: statusInfo.color || '#999',
        points,
        pointsLabel,
        appointmentTime
      }
    })
    this.setData({ orderList })
    console.log('[RecycleOrders] 加载订单', orderList.length, '条')
  },

  onTabChange(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ currentTab: id })
    this.loadOrders()
  },

  onOrderTap(e) {
    const { id } = e.currentTarget.dataset
    navigateTo('/pages/recycle-order-detail/recycle-order-detail', { id })
  },

  onGoAppointment() {
    navigateTo('/pages/recycle-book/recycle-book')
  },

  onPullDownRefresh() {
    console.log('[RecycleOrders] 下拉刷新')
    this.loadOrders()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
