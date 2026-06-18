const {
  TICKET_TYPES,
  TICKET_TYPE_CONFIG,
  TICKET_STATUS,
  CUSTOMER_SERVICE_PHONE,
  ticketManager
} = require('../../utils/ticket')
const { showToast, showSuccess, showModal, navigateTo, navigateBack } = require('../../utils/util')

Page({
  data: {
    ticketType: '',
    typeConfig: null,
    title: '',
    description: '',
    images: [],
    orderNo: '',
    recycleOrderNo: '',
    maxImages: 9,
    isSubmitting: false,
    isUrgentType: false
  },

  onLoad(options) {
    console.log('[TicketCreate] 页面加载', options)
    const type = options.type || TICKET_TYPES.ORDER
    this.initWithType(type)
  },

  initWithType(type) {
    const typeConfig = TICKET_TYPE_CONFIG[type]
    if (!typeConfig) {
      showToast('无效的工单类型')
      navigateBack()
      return
    }

    this.setData({
      ticketType: type,
      typeConfig,
      isUrgentType: typeConfig.isUrgent || false
    })

    wx.setNavigationBarTitle({
      title: typeConfig.name
    })
  },

  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },

  onDescriptionInput(e) {
    this.setData({
      description: e.detail.value
    })
  },

  onOrderNoInput(e) {
    this.setData({
      orderNo: e.detail.value
    })
  },

  onRecycleOrderNoInput(e) {
    this.setData({
      recycleOrderNo: e.detail.value
    })
  },

  onChooseImage() {
    const { images, maxImages } = this.data
    const remainCount = maxImages - images.length

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
        console.log('[TicketCreate] 选择图片:', newImages)

        this.setData({
          images: [...this.data.images, ...newImages]
        })
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          console.error('[TicketCreate] 选择图片失败', err)
          showToast('选择图片失败')
        }
      }
    })
  },

  onRemoveImage(e) {
    const { index } = e.currentTarget.dataset
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },

  onPreviewImage(e) {
    const { current } = e.currentTarget.dataset
    wx.previewImage({
      current,
      urls: this.data.images
    })
  },

  validateForm() {
    const { title, description, ticketType, orderNo, recycleOrderNo } = this.data

    if (!title.trim()) {
      showToast('请输入问题标题')
      return false
    }

    if (title.trim().length < 5) {
      showToast('标题至少5个字符')
      return false
    }

    if (!description.trim()) {
      showToast('请输入详细描述')
      return false
    }

    if (description.trim().length < 10) {
      showToast('描述至少10个字符')
      return false
    }

    if (ticketType === TICKET_TYPES.ORDER && !orderNo.trim()) {
      showToast('请输入订单号')
      return false
    }

    if (ticketType === TICKET_TYPES.RECYCLE && !recycleOrderNo.trim()) {
      showToast('请输入回收订单号')
      return false
    }

    return true
  },

  onSubmit() {
    if (!this.validateForm()) return
    if (this.data.isSubmitting) return

    showModal({
      title: '确认提交',
      content: '提交后我们会尽快处理您的问题，确认提交吗？',
      confirmText: '确认提交',
      confirmColor: '#5BBD72'
    }).then(confirmed => {
      if (confirmed) {
        this.doSubmit()
      }
    })
  },

  doSubmit() {
    const {
      ticketType,
      title,
      description,
      images,
      orderNo,
      recycleOrderNo,
      isUrgentType
    } = this.data

    this.setData({ isSubmitting: true })

    const ticketData = {
      type: ticketType,
      title: title.trim(),
      description: description.trim(),
      images: [...images],
      isUrgent: isUrgentType
    }

    if (ticketType === TICKET_TYPES.ORDER && orderNo.trim()) {
      ticketData.orderNo = orderNo.trim()
    }

    if (ticketType === TICKET_TYPES.RECYCLE && recycleOrderNo.trim()) {
      ticketData.recycleOrderNo = recycleOrderNo.trim()
    }

    try {
      const newTicket = ticketManager.createTicket(ticketData)
      console.log('[TicketCreate] 工单创建成功:', newTicket.id)

      showSuccess('提交成功')

      ticketManager.simulateStaffReply(newTicket.id)

      setTimeout(() => {
        navigateTo('/pages/ticket-detail/ticket-detail', { id: newTicket.id })
      }, 1000)
    } catch (error) {
      console.error('[TicketCreate] 工单创建失败', error)
      showToast('提交失败，请重试')
      this.setData({ isSubmitting: false })
    }
  },

  onCallService() {
    console.log('[TicketCreate] 拨打客服电话')
    showModal({
      title: '紧急联系',
      content: `是否拨打客服热线 ${CUSTOMER_SERVICE_PHONE}？`,
      confirmText: '立即拨打',
      confirmColor: '#E74C3C'
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
  }
})
