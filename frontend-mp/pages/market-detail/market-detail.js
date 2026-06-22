const app = getApp()
const {
  CONDITION_LEVELS,
  TRADE_TYPES,
  DELIVERY_TYPES,
  MARKET_REPORT_REASONS,
  TRASH_DISPOSAL_TIPS
} = require('../../data/market')
const {
  showToast,
  showSuccess,
  showModal,
  navigateTo
} = require('../../utils/util')

Page({
  data: {
    itemId: '',
    item: null,
    conditionName: '',
    tradeTypeName: '',
    tradeTypeIcon: '',
    deliveryName: '',
    deliveryIcon: '',
    isFavorited: false,
    reviews: [],
    currentImageIndex: 0,
    showNegotiateModal: false,
    offerPoints: '',
    showBarterModal: false,
    barterItemTitle: '',
    barterItemDesc: '',
    showReportModal: false,
    reportReasons: MARKET_REPORT_REASONS,
    selectedReportReason: '',
    showContactModal: false,
    isOwner: false,
    userPoints: 0
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ itemId: options.id })
      this.loadItemDetail()
      this.loadReviews()
      this.loadUserPoints()
    }
  },

  onShow() {
    if (this.data.itemId) {
      this.loadItemDetail()
    }
    this.loadUserPoints()
  },

  loadUserPoints() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({ userPoints: userInfo.points || 0 })
    }
  },

  loadItemDetail() {
    const item = app.getMarketItemById(this.data.itemId)
    if (!item) {
      showToast('物品不存在或已下架')
      return
    }

    app.incrementMarketItemView(item.id)

    const condition = CONDITION_LEVELS.find(c => c.id === item.condition)
    const tradeType = TRADE_TYPES.find(t => t.id === item.tradeType)
    const delivery = DELIVERY_TYPES.find(d => d.id === item.delivery)
    const isFavorited = app.isMarketFavorited(item.id)

    const userInfo = app.globalData.userInfo
    const currentUserId = userInfo ? (userInfo.id || 'u001') : 'u001'

    this.setData({
      item,
      conditionName: condition ? condition.name : '',
      tradeTypeName: tradeType ? tradeType.name : '',
      tradeTypeIcon: tradeType ? tradeType.icon : '',
      deliveryName: delivery ? delivery.name : '',
      deliveryIcon: delivery ? delivery.icon : '',
      isFavorited,
      isOwner: item.userId === currentUserId
    })

    wx.setNavigationBarTitle({ title: item.title.slice(0, 15) })
  },

  loadReviews() {
    const reviews = app.getMarketReviews({ itemId: this.data.itemId })
    this.setData({ reviews })
  },

  onImageChange(e) {
    this.setData({ currentImageIndex: e.detail.current })
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset
    const urls = this.data.item.images
    wx.previewImage({
      current: urls[index],
      urls: urls
    })
  },

  onFavoriteTap() {
    const result = app.toggleMarketFavorite(this.data.itemId)
    this.setData({ isFavorited: result.favorited })
    showToast(result.favorited ? '已收藏' : '已取消收藏')
    this.loadItemDetail()
  },

  onNegotiateTap() {
    if (this.data.isOwner) {
      showToast('这是你发布的物品')
      return
    }
    this.setData({
      showNegotiateModal: true,
      offerPoints: this.data.item.price ? String(Math.floor(this.data.item.price * 0.8)) : ''
    })
  },

  onOfferPointsInput(e) {
    this.setData({ offerPoints: e.detail.value.replace(/[^\d]/g, '') })
  },

  closeNegotiateModal() {
    this.setData({ showNegotiateModal: false })
  },

  async submitNegotiate() {
    const { offerPoints, item } = this.data
    if (!offerPoints || parseInt(offerPoints) <= 0) {
      showToast('请输入合理的积分出价')
      return
    }
    if (parseInt(offerPoints) > this.data.userPoints) {
      showToast('积分不足')
      return
    }

    const confirmed = await showModal({
      title: '确认议价',
      content: `确定向卖家出价 ${offerPoints} 积分购买「${item.title}」吗？`,
      confirmText: '确认出价'
    })

    if (!confirmed) return

    const result = app.startNegotiate(item.id, parseInt(offerPoints))
    if (result.success) {
      this.setData({ showNegotiateModal: false })
      showSuccess('议价请求已发送')
    } else {
      showToast(result.message || '发送失败')
    }
  },

  onBarterTap() {
    if (this.data.isOwner) {
      showToast('这是你发布的物品')
      return
    }
    this.setData({
      showBarterModal: true,
      barterItemTitle: '',
      barterItemDesc: ''
    })
  },

  onBarterTitleInput(e) {
    this.setData({ barterItemTitle: e.detail.value })
  },

  onBarterDescInput(e) {
    this.setData({ barterItemDesc: e.detail.value })
  },

  closeBarterModal() {
    this.setData({ showBarterModal: false })
  },

  async submitBarter() {
    const { barterItemTitle, barterItemDesc, item } = this.data
    if (!barterItemTitle.trim()) {
      showToast('请填写你用来交换的物品名称')
      return
    }

    const confirmed = await showModal({
      title: '确认以物易物',
      content: `确定用「${barterItemTitle}」交换「${item.title}」吗？`,
      confirmText: '确认交换'
    })

    if (!confirmed) return

    const result = app.startBarter(item.id, barterItemTitle.trim(), barterItemDesc.trim())
    if (result.success) {
      this.setData({ showBarterModal: false })
      showSuccess('交换请求已发送')
    } else {
      showToast(result.message || '发送失败')
    }
  },

  onContactTap() {
    if (this.data.isOwner) {
      showToast('这是你发布的物品')
      return
    }
    this.setData({ showContactModal: true })
  },

  closeContactModal() {
    this.setData({ showContactModal: false })
  },

  onCopyContact() {
    wx.setClipboardData({
      data: this.data.item.userNickName,
      success: () => {
        showSuccess('卖家昵称已复制')
      }
    })
  },

  onReportTap() {
    if (this.data.isOwner) {
      showToast('不能举报自己的物品')
      return
    }
    this.setData({
      showReportModal: true,
      selectedReportReason: ''
    })
  },

  onReportReasonTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ selectedReportReason: id })
  },

  closeReportModal() {
    this.setData({ showReportModal: false })
  },

  async submitReport() {
    if (!this.data.selectedReportReason) {
      showToast('请选择举报原因')
      return
    }

    const reason = this.data.reportReasons.find(r => r.id === this.data.selectedReportReason)
    const confirmed = await showModal({
      title: '确认举报',
      content: `确定以「${reason.name}」为由举报该物品吗？`,
      confirmText: '确认举报'
    })

    if (!confirmed) return

    app.reportMarketItem(this.data.itemId, this.data.selectedReportReason)
    this.setData({ showReportModal: false })
    showSuccess('举报已提交，我们会尽快处理')
  },

  onReviewTap() {
    navigateTo('/pages/market-review/market-review', { itemId: this.data.itemId, toUserId: this.data.item.userId })
  },

  onGoReview() {
    navigateTo('/pages/market-review/market-review', { itemId: this.data.itemId, toUserId: this.data.item.userId })
  },

  onMarkSold() {
    showModal({
      title: '标记已交易',
      content: '确定标记该物品为已交易状态吗？',
      confirmText: '确认'
    }).then(confirmed => {
      if (!confirmed) return
      app.markMarketItemSold(this.data.itemId)
      showSuccess('已标记为已交易')
      this.loadItemDetail()
    })
  },

  onOffShelf() {
    showModal({
      title: '下架物品',
      content: '确定要下架该物品吗？',
      confirmText: '确认下架'
    }).then(confirmed => {
      if (!confirmed) return
      app.offShelfMarketItem(this.data.itemId)
      showSuccess('已下架')
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    })
  },

  preventClose() {},

  onShareAppMessage() {
    const { item } = this.data
    return {
      title: item ? `${item.title} - 环保市集闲置好物` : '环保市集 - 让闲置物品循环起来',
      path: item ? `/pages/market-detail/market-detail?id=${item.id}` : '/pages/market/market'
    }
  }
})
