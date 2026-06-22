const app = getApp()
const {
  showToast,
  navigateBack
} = require('../../utils/util')

const REVIEW_TAGS = [
  { id: 'accurate', name: '描述相符', positive: true },
  { id: 'clean', name: '物品干净', positive: true },
  { id: 'fast', name: '交易迅速', positive: true },
  { id: 'friendly', name: '态度友好', positive: true },
  { id: 'on_time', name: '准时守约', positive: true },
  { id: 'good_pack', name: '包装完好', positive: true },
  { id: 'inaccurate', name: '描述不符', positive: false },
  { id: 'dirty', name: '物品较脏', positive: false },
  { id: 'slow', name: '沟通不畅', positive: false }
]

Page({
  data: {
    itemId: '',
    item: null,
    rating: 5,
    hoverRating: 0,
    content: '',
    maxContentLength: 500,
    selectedTags: [],
    positiveTags: REVIEW_TAGS.filter(t => t.positive),
    negativeTags: REVIEW_TAGS.filter(t => !t.positive),
    anonymous: false
  },

  onLoad(options) {
    console.log('[MarketReview] 页面加载', options)
    const { itemId } = options
    if (!itemId) {
      showToast('参数错误')
      setTimeout(() => navigateBack(), 1000)
      return
    }
    const item = app.getMarketItemById(itemId)
    if (!item) {
      showToast('物品不存在')
      setTimeout(() => navigateBack(), 1000)
      return
    }
    this.setData({ itemId, item })
  },

  onRatingTap(e) {
    const { value } = e.currentTarget.dataset
    this.setData({ rating: parseInt(value) })
  },

  onRatingHover(e) {
    const { value } = e.currentTarget.dataset
    this.setData({ hoverRating: parseInt(value) })
  },

  onRatingLeave() {
    this.setData({ hoverRating: 0 })
  },

  onContentInput(e) {
    const content = e.detail.value
    if (content.length <= this.data.maxContentLength) {
      this.setData({ content })
    }
  },

  onTagTap(e) {
    const { id } = e.currentTarget.dataset
    const selectedTags = [...this.data.selectedTags]
    const idx = selectedTags.indexOf(id)
    if (idx > -1) {
      selectedTags.splice(idx, 1)
    } else {
      selectedTags.push(id)
    }
    this.setData({ selectedTags })
  },

  onAnonymousChange(e) {
    this.setData({ anonymous: e.detail.value })
  },

  onSubmit() {
    const { itemId, rating, content, selectedTags, anonymous, item } = this.data
    if (!rating || rating < 1) {
      showToast('请选择评分')
      return
    }

    const reviewData = {
      itemId,
      itemTitle: item.title,
      itemImage: item.images[0],
      toUserId: item.userId,
      toUserNickName: item.userNickName,
      toUserAvatarEmoji: item.userAvatarEmoji,
      rating,
      content: content.trim(),
      tags: selectedTags,
      anonymous
    }

    app.addMarketReview(reviewData)
    showToast('评价成功 +10积分', 'success')
    setTimeout(() => {
      navigateBack()
    }, 1200)
  }
})
