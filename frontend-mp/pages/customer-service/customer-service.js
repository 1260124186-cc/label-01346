const {
  TICKET_TYPES,
  TICKET_TYPE_CONFIG,
  TICKET_STATUS,
  TICKET_STATUS_CONFIG,
  CUSTOMER_SERVICE_PHONE,
  FAQ_LIST,
  ticketManager
} = require('../../utils/ticket')
const { showToast, showModal, navigateTo } = require('../../utils/util')

Page({
  data: {
    ticketTypeList: [],
    ticketCount: {},
    faqList: [],
    expandedFaqIds: [],
    servicePhone: CUSTOMER_SERVICE_PHONE
  },

  onLoad() {
    console.log('[CustomerService] 页面加载')
    this.initData()
  },

  onShow() {
    console.log('[CustomerService] 页面显示')
    this.refreshData()
  },

  initData() {
    const ticketTypeList = Object.values(TICKET_TYPE_CONFIG).map(config => ({
      ...config,
      typeId: config.id
    }))

    const faqList = FAQ_LIST.map(faq => ({
      ...faq,
      answerLines: faq.answer.split('\n')
    }))

    this.setData({
      ticketTypeList,
      faqList
    })
  },

  refreshData() {
    const ticketCount = ticketManager.getCountByStatus()
    this.setData({ ticketCount })
  },

  onTicketTypeTap(e) {
    const { typeId } = e.currentTarget.dataset
    console.log('[CustomerService] 点击工单类型:', typeId)
    navigateTo('/pages/ticket-create/ticket-create', { type: typeId })
  },

  onViewAllTickets() {
    console.log('[CustomerService] 查看全部工单')
    navigateTo('/pages/tickets/tickets')
  },

  onViewTicketsByStatus(e) {
    const { status } = e.currentTarget.dataset
    console.log('[CustomerService] 查看状态工单:', status)
    navigateTo('/pages/tickets/tickets', { status })
  },

  onFaqTap(e) {
    const { id } = e.currentTarget.dataset
    console.log('[CustomerService] 点击FAQ:', id)

    let expandedFaqIds = [...this.data.expandedFaqIds]
    const index = expandedFaqIds.indexOf(id)

    if (index > -1) {
      expandedFaqIds.splice(index, 1)
    } else {
      expandedFaqIds.push(id)
    }

    this.setData({ expandedFaqIds })
  },

  onCallService() {
    console.log('[CustomerService] 拨打客服电话')
    showModal({
      title: '联系客服',
      content: `是否拨打客服热线 ${CUSTOMER_SERVICE_PHONE}？`,
      confirmText: '立即拨打',
      confirmColor: '#5BBD72'
    }).then(confirmed => {
      if (confirmed) {
        wx.makePhoneCall({
          phoneNumber: CUSTOMER_SERVICE_PHONE,
          success: () => {
            console.log('[CustomerService] 拨号成功')
          },
          fail: (err) => {
            if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
              console.error('[CustomerService] 拨号失败', err)
              showToast('拨号失败，请手动拨打')
            }
          }
        })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '垃圾分类助手 - 客服中心',
      path: '/pages/customer-service/customer-service'
    }
  }
})
