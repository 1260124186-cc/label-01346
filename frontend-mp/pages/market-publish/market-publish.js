const app = getApp()
const {
  MARKET_CATEGORIES,
  CONDITION_LEVELS,
  TRADE_TYPES,
  DELIVERY_TYPES,
  TRASH_DISPOSAL_TIPS
} = require('../../data/market')
const {
  showToast,
  showSuccess,
  showModal,
  navigateBack
} = require('../../utils/util')

Page({
  data: {
    categories: MARKET_CATEGORIES.filter(c => c.id !== 'all'),
    currentCategory: '',
    conditionLevels: CONDITION_LEVELS,
    currentCondition: '',
    tradeTypes: TRADE_TYPES,
    currentTradeType: '',
    deliveryTypes: DELIVERY_TYPES,
    currentDelivery: '',
    title: '',
    description: '',
    price: '',
    barterWish: '',
    location: '',
    images: [],
    maxImages: 9,
    titleMaxLength: 50,
    descMaxLength: 500,
    disposalTip: null,
    showDisposalTip: false,
    publishPoints: 20
  },

  onLoad() {
    console.log('[MarketPublish] 页面加载')
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      currentCategory: id,
      disposalTip: TRASH_DISPOSAL_TIPS[id] || null
    })
  },

  onConditionTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ currentCondition: id })
  },

  onTradeTypeTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ currentTradeType: id })
  },

  onDeliveryTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ currentDelivery: id })
  },

  onTitleInput(e) {
    const value = e.detail.value
    if (value.length > this.data.titleMaxLength) {
      showToast(`标题最多${this.data.titleMaxLength}字`)
      return
    }
    this.setData({ title: value })
  },

  onDescInput(e) {
    const value = e.detail.value
    if (value.length > this.data.descMaxLength) {
      showToast(`描述最多${this.data.descMaxLength}字`)
      return
    }
    this.setData({ description: value })
  },

  onPriceInput(e) {
    const value = e.detail.value.replace(/[^\d]/g, '')
    this.setData({ price: value })
  },

  onBarterWishInput(e) {
    this.setData({ barterWish: e.detail.value })
  },

  onLocationInput(e) {
    this.setData({ location: e.detail.value })
  },

  toggleDisposalTip() {
    this.setData({ showDisposalTip: !this.data.showDisposalTip })
  },

  onChooseImage() {
    const remain = this.data.maxImages - this.data.images.length
    if (remain <= 0) {
      showToast(`最多上传${this.data.maxImages}张图片`)
      return
    }

    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath)
        this.setData({
          images: [...this.data.images, ...newImages].slice(0, this.data.maxImages)
        })
      },
      fail: () => {
        showToast('选择图片失败')
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
    const { index } = e.currentTarget.dataset
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    })
  },

  validateForm() {
    const {
      currentCategory,
      currentCondition,
      currentTradeType,
      currentDelivery,
      title,
      description,
      price,
      location,
      images
    } = this.data

    if (!currentCategory) {
      showToast('请选择物品分类')
      return false
    }
    if (images.length === 0) {
      showToast('请至少上传一张图片')
      return false
    }
    if (!title.trim() || title.trim().length < 3) {
      showToast('标题至少3个字')
      return false
    }
    if (!description.trim() || description.trim().length < 10) {
      showToast('描述至少10个字')
      return false
    }
    if (!currentCondition) {
      showToast('请选择物品成色')
      return false
    }
    if (!currentTradeType) {
      showToast('请选择交易方式')
      return false
    }
    if (currentTradeType === 'points' && (!price || parseInt(price) <= 0)) {
      showToast('请输入合理的积分价格')
      return false
    }
    if (!currentDelivery) {
      showToast('请选择配送方式')
      return false
    }
    if (!location.trim()) {
      showToast('请填写交易地点')
      return false
    }
    return true
  },

  async onPublish() {
    if (!this.validateForm()) return

    const confirmed = await showModal({
      title: '确认发布',
      content: '发布闲置物品可获得20积分，确定要发布吗？',
      confirmText: '确认发布'
    })

    if (!confirmed) return

    wx.showLoading({ title: '发布中...', mask: true })

    const {
      currentCategory,
      currentCondition,
      currentTradeType,
      currentDelivery,
      title,
      description,
      price,
      barterWish,
      location,
      images
    } = this.data

    const result = app.addMarketItem({
      title: title.trim(),
      category: currentCategory,
      images: images,
      condition: currentCondition,
      description: description.trim(),
      tradeType: currentTradeType,
      price: currentTradeType === 'points' ? parseInt(price) : 0,
      barterWish: barterWish.trim(),
      delivery: currentDelivery,
      location: location.trim(),
      tags: []
    })

    wx.hideLoading()

    if (result) {
      showSuccess('发布成功 +20积分')
      setTimeout(() => {
        navigateBack()
      }, 1200)
    } else {
      showToast('发布失败，请重试')
    }
  }
})
