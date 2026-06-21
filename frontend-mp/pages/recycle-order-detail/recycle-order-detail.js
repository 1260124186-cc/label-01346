const app = getApp()
const { RECYCLE_ORDER_STATUS, RECYCLE_CANCEL_RULES, RECYCLE_PHOTO_CONFIG, RECYCLE_CATEGORIES } = require('../../utils/constants')
const { showToast, showSuccess, showModal, formatDate, navigateTo, redirectTo, showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    orderId: '',
    order: null,
    statusList: RECYCLE_ORDER_STATUS,
    cancelRules: RECYCLE_CANCEL_RULES.rules || [],
    photoConfig: RECYCLE_PHOTO_CONFIG,
    photos: [],
    estimatedPoints: 0,
    estimatedPointsBreakdown: [],
    cancelPenalty: 0,
    cancelPenaltyDesc: '',
    canCancel: false,
    canMarkVisiting: false,
    canMarkComplete: false,
    showCancelModal: false,
    cancelReasons: [
      '时间安排不合适',
      '回收品类有变化',
      '价格/积分不满意',
      '临时有事',
      '其他原因'
    ],
    selectedCancelReason: '',
    customCancelReason: '',
    statusSteps: []
  },

  onLoad(options) {
    const { id } = options
    console.log('[RecycleOrderDetail] 加载订单详情', id)
    this.setData({ orderId: id })
    this.loadOrderDetail()
  },

  onShow() {
    if (this.data.orderId) {
      this.loadOrderDetail()
    }
  },

  loadOrderDetail() {
    const order = app.getRecycleOrderById(this.data.orderId)
    if (!order) {
      showToast('订单不存在')
      setTimeout(() => {
        wx.navigateBack({ delta: 1 })
      }, 1500)
      return
    }

    const category = RECYCLE_CATEGORIES.find(c => c.id === order.categoryId)
    const hasPhoto = order.photos && order.photos.length > 0
    const estimatedPoints = app.calculateRecyclePoints(order.categoryId, order.quantity, { hasPhoto })
    const estimatedPointsBreakdown = app.getPointsBreakdown(order.categoryId, order.quantity, { hasPhoto })

    const canTransition = (target) => app.canTransitionStatus(order.status, target)

    const cancelPenalty = app.calculateCancelPenalty(order)
    let cancelPenaltyDesc = ''
    if (cancelPenalty.penaltyPoints > 0) {
      cancelPenaltyDesc = `将扣除 ${cancelPenalty.penaltyPoints} 积分违约金（${Math.round(cancelPenalty.rate * 100)}%）`
    } else {
      cancelPenaltyDesc = '免费取消，不扣除积分'
    }

    const statusSteps = this.buildStatusSteps(order.status)

    this.setData({
      order,
      estimatedPoints,
      estimatedPointsBreakdown,
      canCancel: canTransition('cancelled'),
      canMarkVisiting: canTransition('visiting'),
      canMarkComplete: canTransition('completed'),
      cancelPenalty: cancelPenalty.penaltyPoints,
      cancelPenaltyDesc,
      photos: order.photos || [],
      statusSteps
    })
  },

  buildStatusSteps(currentStatus) {
    const statusOrder = ['pending', 'appointed', 'visiting', 'completed']
    const steps = statusOrder.map(key => {
      const status = RECYCLE_ORDER_STATUS[key]
      return {
        key,
        text: status ? status.text : '',
        color: status ? status.color : '#95A5A6',
        active: statusOrder.indexOf(key) <= statusOrder.indexOf(currentStatus),
        current: key === currentStatus
      }
    })

    if (currentStatus === 'cancelled') {
      steps.forEach(s => {
        s.active = false
        s.current = false
      })
    }

    return steps
  },

  onChoosePhoto() {
    const { photos, photoConfig } = this.data
    const remainCount = photoConfig.maxPhotos - photos.length
    if (remainCount <= 0) {
      showToast(`最多上传${photoConfig.maxPhotos}张照片`)
      return
    }

    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const newPhotos = res.tempFiles.map(f => f.tempFilePath)
        const updatedPhotos = [...photos, ...newPhotos].slice(0, photoConfig.maxPhotos)
        this.setData({ photos: updatedPhotos })

        app.updateRecycleOrderPhotos(this.data.orderId, updatedPhotos)
        showSuccess('照片上传成功')
        console.log('[RecycleOrderDetail] 上传照片', updatedPhotos.length, '张')
      },
      fail: (err) => {
        console.warn('[RecycleOrderDetail] 上传照片失败', err)
      }
    })
  },

  onRemovePhoto(e) {
    const { index } = e.currentTarget.dataset
    const photos = [...this.data.photos]
    photos.splice(index, 1)
    this.setData({ photos })
    app.updateRecycleOrderPhotos(this.data.orderId, photos)
  },

  onPreviewPhoto(e) {
    const { index } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.photos,
      current: this.data.photos[index]
    })
  },

  onMarkVisiting() {
    showModal({
      title: '确认开始上门',
      content: '请确认回收员已出发前往用户地址',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          showLoading('操作中...')
          setTimeout(() => {
            const result = app.updateRecycleOrderStatus(this.data.orderId, 'visiting')
            hideLoading()
            if (result) {
              showSuccess('已标记为上门中')
              this.loadOrderDetail()
            } else {
              showToast('操作失败')
            }
          }, 500)
        }
      }
    })
  },

  onMarkComplete() {
    showModal({
      title: '确认完成回收',
      content: '确认回收完成后将发放积分奖励',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          showLoading('操作中...')
          setTimeout(() => {
            const result = app.updateRecycleOrderStatus(this.data.orderId, 'completed')
            hideLoading()
            if (result) {
              showSuccess('回收完成，积分已发放')
              this.loadOrderDetail()
            } else {
              showToast('操作失败')
            }
          }, 500)
        }
      }
    })
  },

  onCancelOrder() {
    const { order } = this.data
    if (!order) return

    if (order.status === 'completed' || order.status === 'cancelled') {
      showToast('当前状态无法取消')
      return
    }

    this.setData({
      showCancelModal: true,
      selectedCancelReason: '',
      customCancelReason: ''
    })
  },

  onCloseCancelModal() {
    this.setData({ showCancelModal: false })
  },

  onSelectCancelReason(e) {
    const { reason } = e.currentTarget.dataset
    this.setData({
      selectedCancelReason: reason,
      customCancelReason: reason === '其他原因' ? this.data.customCancelReason : ''
    })
  },

  onCustomReasonInput(e) {
    this.setData({
      customCancelReason: e.detail.value
    })
  },

  onConfirmCancel() {
    const { selectedCancelReason, customCancelReason, cancelPenalty } = this.data
    let finalReason = selectedCancelReason

    if (!finalReason) {
      showToast('请选择取消原因')
      return
    }

    if (finalReason === '其他原因') {
      if (!customCancelReason.trim()) {
        showToast('请填写具体取消原因')
        return
      }
      finalReason = customCancelReason.trim()
    }

    if (cancelPenalty > 0) {
      showModal({
        title: '取消订单确认',
        content: `取消订单将扣除 ${cancelPenalty} 积分违约金，是否继续？`,
        showCancel: true,
        success: (res) => {
          if (res.confirm) {
            this.doCancelOrder(finalReason)
          }
        }
      })
    } else {
      this.doCancelOrder(finalReason)
    }
  },

  doCancelOrder(reason) {
    showLoading('处理中...')
    setTimeout(() => {
      const result = app.cancelRecycleOrder(this.data.orderId, reason)
      hideLoading()

      if (result) {
        showSuccess('订单已取消')
        this.setData({ showCancelModal: false })
        this.loadOrderDetail()
      } else {
        showToast('取消失败')
      }
    }, 500)
  },

  onCallCollector() {
    const { order } = this.data
    if (!order || !order.collector || !order.collector.phone) {
      showToast('暂无回收员联系方式')
      return
    }

    wx.makePhoneCall({
      phoneNumber: order.collector.phone.replace(/\*/g, '0'),
      fail: () => {
        showToast('拨号失败')
      }
    })
  },

  onContactService() {
    showToast('客服功能开发中')
  },

  onGoBack() {
    wx.navigateBack({ delta: 1 })
  }
})
