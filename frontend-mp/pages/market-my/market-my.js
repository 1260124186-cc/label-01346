const app = getApp()
const {
  MARKET_CATEGORIES,
  TRADE_TYPES,
  CONDITION_LEVELS
} = require('../../data/market')
const {
  showToast,
  showModal,
  navigateTo
} = require('../../utils/util')

Page({
  data: {
    categories: MARKET_CATEGORIES,
    tradeTypes: TRADE_TYPES,
    conditionLevels: CONDITION_LEVELS,
    tabs: [
      { id: 'available', name: '出售中', count: 0 },
      { id: 'sold', name: '已交易', count: 0 },
      { id: 'offshelf', name: '已下架', count: 0 }
    ],
    currentTab: 'available',
    items: [],
    stats: {
      total: 0,
      sold: 0,
      offshelf: 0,
      available: 0
    }
  },

  onLoad() {
    console.log('[MarketMy] 页面加载')
    this.loadData()
  },

  onShow() {
    console.log('[MarketMy] 页面显示')
    this.loadData()
  },

  loadData() {
    const userInfo = app.globalData.userInfo
    if (!userInfo) {
      this.setData({ items: [] })
      return
    }

    const allItems = app.getMarketItems({ userId: userInfo.id })
    const availableItems = allItems.filter(i => i.status === 'available')
    const soldItems = allItems.filter(i => i.status === 'sold')
    const offshelfItems = allItems.filter(i => i.status === 'offshelf')

    const stats = {
      total: allItems.length,
      available: availableItems.length,
      sold: soldItems.length,
      offshelf: offshelfItems.length
    }

    const tabs = this.data.tabs.map(t => ({
      ...t,
      count: stats[t.id] || 0
    }))

    let displayItems = []
    if (this.data.currentTab === 'available') {
      displayItems = availableItems
    } else if (this.data.currentTab === 'sold') {
      displayItems = soldItems
    } else {
      displayItems = offshelfItems
    }

    const processedItems = displayItems.map(item => {
      const category = MARKET_CATEGORIES.find(c => c.id === item.category)
      const condition = CONDITION_LEVELS.find(c => c.id === item.condition)
      const tradeType = TRADE_TYPES.find(t => t.id === item.tradeType)
      return {
        ...item,
        categoryName: category ? category.name : '',
        categoryIcon: category ? category.icon : '',
        conditionName: condition ? condition.name : '',
        tradeTypeName: tradeType ? tradeType.name : '',
        tradeTypeIcon: tradeType ? tradeType.icon : ''
      }
    })

    this.setData({ items: processedItems, tabs, stats })
    console.log('[MarketMy] 加载完成', stats)
  },

  onTabTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ currentTab: id }, () => {
      this.loadData()
    })
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset
    navigateTo('/pages/market-detail/market-detail', { id })
  },

  onMarkSold(e) {
    const { id } = e.currentTarget.dataset
    showModal('确认交易', '确认该物品已完成交易吗？标记后将从出售中移除。')
      .then(confirm => {
        if (!confirm) return
        app.markMarketItemSold(id)
        showToast('已标记为已交易', 'success')
        this.loadData()
      })
  },

  onOffShelf(e) {
    const { id } = e.currentTarget.dataset
    showModal('确认下架', '确认下架该物品吗？下架后他人将无法看到。')
      .then(confirm => {
        if (!confirm) return
        app.offShelfMarketItem(id)
        showToast('已下架', 'success')
        this.loadData()
      })
  },

  onRelist(e) {
    const { id } = e.currentTarget.dataset
    const item = this.data.items.find(i => i.id === id)
    if (!item) return
    app.relistMarketItem(id)
    showToast('已重新上架', 'success')
    this.loadData()
  },

  onReview(e) {
    const { id } = e.currentTarget.dataset
    navigateTo('/pages/market-review/market-review', { itemId: id })
  },

  onPublishTap() {
    navigateTo('/pages/market-publish/market-publish')
  },

  onPullDownRefresh() {
    this.loadData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  }
})
