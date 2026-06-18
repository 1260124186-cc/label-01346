const {
  TICKET_TYPES,
  TICKET_TYPE_CONFIG,
  TICKET_STATUS,
  TICKET_STATUS_CONFIG,
  ticketManager
} = require('../../utils/ticket')
const { showToast, navigateTo, navigateBack } = require('../../utils/util')

Page({
  data: {
    currentStatus: 'all',
    statusTabs: [],
    ticketList: [],
    ticketCount: {},
    isLoading: false,
    isEmpty: false
  },

  onLoad(options) {
    console.log('[Tickets] 页面加载', options)
    const initialStatus = options.status || 'all'
    this.initTabs()
    this.setData({ currentStatus: initialStatus })
  },

  onShow() {
    console.log('[Tickets] 页面显示')
    this.refreshData()
  },

  onPullDownRefresh() {
    console.log('[Tickets] 下拉刷新')
    this.refreshData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  initTabs() {
    const statusTabs = [
      { id: 'all', name: '全部', ...TICKET_STATUS_CONFIG[TICKET_STATUS.PENDING] },
      { id: TICKET_STATUS.PENDING, name: '待受理', ...TICKET_STATUS_CONFIG[TICKET_STATUS.PENDING] },
      { id: TICKET_STATUS.PROCESSING, name: '处理中', ...TICKET_STATUS_CONFIG[TICKET_STATUS.PROCESSING] },
      { id: TICKET_STATUS.RESOLVED, name: '已解决', ...TICKET_STATUS_CONFIG[TICKET_STATUS.RESOLVED] }
    ]
    this.setData({ statusTabs })
  },

  refreshData() {
    this.setData({ isLoading: true })

    try {
      const { currentStatus } = this.data
      const tickets = ticketManager.getTicketsByStatus(currentStatus)
      const ticketCount = ticketManager.getCountByStatus()

      const ticketList = tickets.map(ticket => ({
        ...ticket,
        typeConfig: TICKET_TYPE_CONFIG[ticket.type] || TICKET_TYPE_CONFIG[TICKET_TYPES.ORDER],
        statusConfig: TICKET_STATUS_CONFIG[ticket.status] || TICKET_STATUS_CONFIG[TICKET_STATUS.PENDING],
        lastReply: ticket.replies && ticket.replies.length > 0
          ? ticket.replies[ticket.replies.length - 1]
          : null,
        hasNewReply: ticket.replies && ticket.replies.some(r => r.isStaff && !r.isRead)
      }))

      this.setData({
        ticketList,
        ticketCount,
        isEmpty: ticketList.length === 0,
        isLoading: false
      })
    } catch (error) {
      console.error('[Tickets] 刷新数据失败', error)
      showToast('加载失败，请重试')
      this.setData({ isLoading: false })
    }
  },

  onTabTap(e) {
    const { id } = e.currentTarget.dataset
    if (id === this.data.currentStatus) return

    console.log('[Tickets] 切换状态:', id)
    this.setData({ currentStatus: id }, () => {
      this.refreshData()
    })
  },

  onTicketTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Tickets] 点击工单:', item.id, item.title)
    navigateTo('/pages/ticket-detail/ticket-detail', { id: item.id })
  },

  onBack() {
    navigateBack()
  }
})
