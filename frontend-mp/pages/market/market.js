const app = getApp()
const {
  MARKET_CATEGORIES,
  TRADE_TYPES,
  CONDITION_LEVELS
} = require('../../data/market')
const {
  showToast,
  navigateTo
} = require('../../utils/util')

Page({
  data: {
    categories: MARKET_CATEGORIES,
    currentCategory: 'all',
    tradeTypes: [{ id: 'all', name: '全部', icon: '🔄', color: '#5BBD72' }, ...TRADE_TYPES],
    currentTradeType: 'all',
    conditionLevels: CONDITION_LEVELS,
    items: [],
    userPoints: 0,
    searchKeyword: '',
    isSearchFocused: false
  },

  onLoad() {
    console.log('[Market] 页面加载')
    this.loadUserPoints()
    this.loadItems()
  },

  onShow() {
    console.log('[Market] 页面显示')
    this.loadUserPoints()
    this.loadItems()
  },

  loadUserPoints() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userPoints: userInfo.points || 0
      })
    }
  },

  loadItems() {
    const { currentCategory, currentTradeType, searchKeyword } = this.data
    const filter = {
      category: currentCategory,
      tradeType: currentTradeType,
      status: 'available'
    }
    if (searchKeyword.trim()) {
      filter.keyword = searchKeyword.trim()
    }
    const items = app.getMarketItems(filter)
    const processedItems = items.map(item => {
      const condition = CONDITION_LEVELS.find(c => c.id === item.condition)
      const tradeType = TRADE_TYPES.find(t => t.id === item.tradeType)
      return {
        ...item,
        conditionName: condition ? condition.name : '',
        tradeTypeName: tradeType ? tradeType.name : '',
        tradeTypeIcon: tradeType ? tradeType.icon : ''
      }
    })
    this.setData({ items: processedItems })
    console.log('[Market] 加载物品', processedItems.length, '条')
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ currentCategory: id }, () => {
      this.loadItems()
    })
  },

  onTradeTypeTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ currentTradeType: id }, () => {
      this.loadItems()
    })
  },

  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
  },

  onSearchConfirm() {
    this.loadItems()
  },

  onSearchFocus() {
    this.setData({ isSearchFocused: true })
  },

  onSearchBlur() {
    this.setData({ isSearchFocused: false })
  },

  onClearSearch() {
    this.setData({ searchKeyword: '' }, () => {
      this.loadItems()
    })
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset
    navigateTo('/pages/market-detail/market-detail', { id })
  },

  onPublishTap() {
    navigateTo('/pages/market-publish/market-publish')
  },

  onMyItemsTap() {
    navigateTo('/pages/market-my/market-my')
  },

  onPullDownRefresh() {
    console.log('[Market] 下拉刷新')
    this.loadItems()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  },

  onShareAppMessage() {
    return {
      title: '环保市集 - 让闲置物品循环起来',
      path: '/pages/market/market'
    }
  }
})
