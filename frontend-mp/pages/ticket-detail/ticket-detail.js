const {
  TICKET_TYPES,
  TICKET_TYPE_CONFIG,
  TICKET_STATUS,
  TICKET_STATUS_CONFIG,
  CUSTOMER_SERVICE_PHONE,
  ticketManager
} = require('../../utils/ticket')
const { showToast, showSuccess, showModal, navigateTo, navigateBack } = require('../../utils/util')

Page({
  data: {
    ticketId: '',
    ticket: null,
    typeConfig: null,
    statusConfig: null,
    replyContent: '',
    replyImages: [],
    maxImages: 3,
    isSubmitting: false,
    showRating: false,
    rating: 0,
    tempRating: 0,
    isUrgentType: false,
    imagesToPreview: []
  },

  onLoad(options) {
    console.log('[TicketDetail] 页面加载', options)
    const { id } = options
    if (!id) {
      showToast('无效的工单ID')
      navigateBack()
      return
    }
    this.setData({ ticketId: id })
    this.loadTicket()
  },

  onShow() {
    console.log('[TicketDetail] 页面显示')
    if (this.data.ticketId) {
      this.loadTicket()
    }
  },

  loadTicket() {
    const { ticketId } = this.data
    const ticket = ticketManager.getTicketById(ticketId)

    if (!ticket) {
      showToast('工单不存在')
      navigateBack()
      return
    }

    const typeConfig = TICKET_TYPE_CONFIG[ticket.type] || TICKET_TYPE_CONFIG[TICKET_TYPES.ORDER]
    const statusConfig = TICKET_STATUS_CONFIG[ticket.status] || TICKET_STATUS_CONFIG[TICKET_STATUS.PENDING]

    const allImages = [...(ticket.images || [])]
    if (ticket.replies) {
      ticket.replies.forEach(reply => {
        if (reply.images && reply.images.length > 0) {
          allImages.push(...reply.images)
        }
      })
    }

    this.setData({
      ticket,
      typeConfig,
      statusConfig,
      isUrgentType: typeConfig.isUrgent || false,
      imagesToPreview: allImages,
      showRating: ticket.status === TICKET_STATUS.RESOLVED && !ticket.rating,
      rating: ticket.rating || 0
    })

    this.markRepliesAsRead(ticket)
  },

  markRepliesAsRead(ticket) {
    if (!ticket.replies) return
    let hasUnread = false
    ticket.replies.forEach(reply => {
      if (reply.isStaff && !reply.isRead) {
        reply.isRead = true
        hasUnread = true
      }
    })
    if (hasUnread) {
      ticketManager.save()
    }
  },

  onReplyInput(e) {
    this.setData({
      replyContent: e.detail.value
    })
  },

  onChooseImage() {
    const { replyImages, maxImages } = this.data
    const remainCount = maxImages - replyImages.length

    if (remainCount <= 0) {
      showToast(`最多只能上传${maxImages}张图片`)
      return
    }

    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const tempFiles = res.tempFiles || []
        const newImages = tempFiles.map(file => file.tempFilePath)
        console.log('[TicketDetail] 选择图片:', newImages)

        this.setData({
          replyImages: [...this.data.replyImages, ...newImages]
        })
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          console.error('[TicketDetail] 选择图片失败', err)
          showToast('选择图片失败')
        }
      }
    })
  },

  onRemoveImage(e) {
    const { index } = e.currentTarget.dataset
    const replyImages = [...this.data.replyImages]
    replyImages.splice(index, 1)
    this.setData({ replyImages })
  },

  onPreviewImage(e) {
    const { current } = e.currentTarget.dataset
    wx.previewImage({
      current,
      urls: this.data.imagesToPreview
    })
  },

  onSubmitReply() {
    const { replyContent, replyImages, ticketId } = this.data

    if (!replyContent.trim() && replyImages.length === 0) {
      showToast('请输入内容或上传图片')
      return
    }

    if (this.data.isSubmitting) return

    this.setData({ isSubmitting: true })

    try {
      const reply = ticketManager.appendReply(
        ticketId,
        replyContent.trim(),
        [...replyImages]
      )

      if (reply) {
        showSuccess('回复成功')
        this.setData({
          replyContent: '',
          replyImages: [],
          isSubmitting: false
        })

        this.loadTicket()
      }
    } catch (error) {
      console.error('[TicketDetail] 回复失败', error)
      showToast('回复失败，请重试')
      this.setData({ isSubmitting: false })
    }
  },

  onCallService() {
    console.log('[TicketDetail] 拨打客服电话')
    showModal({
      title: '联系客服',
      content: `是否拨打客服热线 ${CUSTOMER_SERVICE_PHONE}？`,
      confirmText: '立即拨打',
      confirmColor: this.data.isUrgentType ? '#E74C3C' : '#5BBD72'
    }).then(confirmed => {
      if (confirmed) {
        wx.makePhoneCall({
          phoneNumber: CUSTOMER_SERVICE_PHONE,
          fail: (err) => {
            if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
              showToast('拨号失败，请手动拨打')
            }
          }
        })
      }
    })
  },

  onUrgentCall() {
    console.log('[TicketDetail] 紧急拨号')
    wx.makePhoneCall({
      phoneNumber: CUSTOMER_SERVICE_PHONE,
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          showToast('拨号失败，请手动拨打')
        }
      }
    })
  },

  onRatingTap(e) {
    const { rating } = e.currentTarget.dataset
    this.setData({ tempRating: rating })
  },

  onRatingMouseMove(e) {
    const { rating } = e.currentTarget.dataset
    if (rating !== this.data.tempRating) {
      this.setData({ tempRating: rating })
    }
  },

  onSubmitRating() {
    const { tempRating, ticketId } = this.data

    if (tempRating === 0) {
      showToast('请选择评分')
      return
    }

    showModal({
      title: '确认评价',
      content: `您确定给出 ${tempRating} 星评价吗？`,
      confirmText: '确认评价',
      confirmColor: '#5BBD72'
    }).then(confirmed => {
      if (confirmed) {
        try {
          ticketManager.rateTicket(ticketId, tempRating)
          showSuccess('感谢您的评价')
          this.setData({
            rating: tempRating,
            showRating: false
          })
          this.loadTicket()
        } catch (error) {
          console.error('[TicketDetail] 评价失败', error)
          showToast('评价失败，请重试')
        }
      }
    })
  },

  onCancelRating() {
    this.setData({
      showRating: false,
      tempRating: 0
    })
  },

  onShowRating() {
    this.setData({
      showRating: true,
      tempRating: this.data.rating || 0
    })
  },

  onShareAppMessage() {
    const { ticket } = this.data
    return {
      title: `工单详情 - ${ticket ? ticket.title : '垃圾分类助手'}`,
      path: '/pages/ticket-detail/ticket-detail?id=' + this.data.ticketId
    }
  }
})
