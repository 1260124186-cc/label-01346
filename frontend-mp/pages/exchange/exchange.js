/**
 * 积分兑换页面
 * @description 展示积分商城，用户可以使用积分兑换各种礼品
 */
const app = getApp()
const { EXCHANGE_BANNERS } = require('../../utils/constants')
const { showToast, showModal, navigateTo, formatNumber } = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userPoints: 0,
    bannerList: EXCHANGE_BANNERS,
    currentBannerIndex: 0,
    goodsList: [],
    categories: [
      { id: 'all', name: '全部' },
      { id: 'hot', name: '热门' },
      { id: 'new', name: '新品' },
      { id: 'limit', name: '限量' }
    ],
    currentCategory: 'all',
    scrollTop: 0,
    showBackTop: false,
    showRulesModal: false,
    pointsRules: {
      earn: [
        { id: 1, name: '每日签到', points: 5 },
        { id: 2, name: '垃圾分类（每次）', points: 10 },
        { id: 3, name: '连续签到7天奖励', points: 50 },
        { id: 4, name: '邀请好友注册', points: 100 },
        { id: 5, name: '完成知识问答', points: 20 },
        { id: 6, name: '分享小程序', points: 10 }
      ],
      notes: [
        '积分可用于兑换商城中的各类环保商品',
        '积分在兑换商品后将自动扣除',
        '每日签到需连续进行，中断后重新计算',
        '积分有效期为获取后1年内',
        '恶意刷积分将被取消资格并清空积分',
        '最终解释权归垃圾分类助手所有'
      ]
    },
    childModeEnabled: false,
    virtualBadges: [],
    currentBadgeTab: 'goods',
    showBadgeModal: false,
    selectedBadge: null
  },

  onLoad() {
    console.log('[Exchange] 页面加载')
    const childModeEnabled = app.isChildModeEnabled()
    this.setData({
      childModeEnabled,
      currentBadgeTab: childModeEnabled ? 'badges' : 'goods'
    })
    this.initPageData()
  },

  onShow() {
    console.log('[Exchange] 页面显示')
    const childModeEnabled = app.isChildModeEnabled()
    this.setData({
      childModeEnabled,
      currentBadgeTab: childModeEnabled ? 'badges' : 'goods'
    })
    this.refreshUserPoints()
    this.loadGoodsList()
    if (childModeEnabled) {
      const virtualBadges = app.getMyVirtualBadges()
      this.setData({ virtualBadges })
    }
  },

  initPageData() {
    this.refreshUserPoints()
    this.loadGoodsList()
  },

  loadGoodsList() {
    const goodsList = app.getGoodsList()
    this.setData({ goodsList })
    this.filterGoods(this.data.currentCategory)
  },

  refreshUserPoints() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userPoints: userInfo.points || 0
      }, () => {
        this.filterGoods(this.data.currentCategory)
      })
    }
  },

  showPointsRules() {
    this.setData({ showRulesModal: true })
  },

  hidePointsRules() {
    this.setData({ showRulesModal: false })
  },

  preventClose() {},

  onBannerChange(e) {
    const current = e.detail.current
    this.setData({
      currentBannerIndex: current
    })
  },

  onBannerTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Exchange] 点击轮播广告', item)
    navigateTo('/pages/activity/activity', { id: item.id })
  },

  onCategoryChange(e) {
    const { id } = e.currentTarget.dataset
    console.log('[Exchange] 切换分类', id)
    
    this.setData({
      currentCategory: id
    })
    
    this.filterGoods(id)
  },

  filterGoods(categoryId) {
    if (this.data.childModeEnabled) {
      this.setData({ goodsList: [] })
      return
    }
    const allGoods = app.getGoodsList()
    const { userPoints } = this.data
    let filteredGoods = [...allGoods]
    
    switch (categoryId) {
      case 'hot':
        filteredGoods = allGoods.filter(item => item.tag === '热门')
        break
      case 'new':
        filteredGoods = allGoods.filter(item => item.tag === '推荐')
        break
      case 'limit':
        filteredGoods = allGoods.filter(item => item.tag === '限量')
        break
      default:
        filteredGoods = allGoods
    }

    const processedGoods = filteredGoods.map(item => {
      let btnText = '立即兑换'
      if (item.stock <= 0) {
        btnText = '已售罄'
      } else if (userPoints < item.points) {
        btnText = '积分不足'
      }
      return { ...item, btnText }
    })
    
    this.setData({
      goodsList: processedGoods
    })
  },

  onScroll(e) {
    const { scrollTop } = e.detail
    const showBackTop = scrollTop > 500
    
    if (showBackTop !== this.data.showBackTop) {
      this.setData({ showBackTop })
    }
  },

  scrollToTop() {
    this.setData({
      scrollTop: 0
    })
  },

  onGoodsTap(e) {
    if (this.data.childModeEnabled) {
      return
    }
    const { item } = e.currentTarget.dataset
    console.log('[Exchange] 点击商品', item.name)
    navigateTo('/pages/goods-detail/goods-detail', { id: item.id })
  },

  switchBadgeTab(e) {
    const { tab } = e.currentTarget.dataset
    console.log('[Exchange] 切换tab:', tab)

    if (this.data.childModeEnabled && tab === 'goods') {
      wx.showToast({
        title: '儿童模式下仅支持虚拟勋章',
        icon: 'none',
        duration: 1800
      })
      this.setData({ currentBadgeTab: 'badges' })
      return
    }

    this.setData({ currentBadgeTab: tab })
  },

  onBadgeTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Exchange] 点击勋章:', item.name)
    this.setData({
      selectedBadge: item,
      showBadgeModal: true
    })
  },

  hideBadgeModal() {
    this.setData({
      showBadgeModal: false,
      selectedBadge: null
    })
  },

  onShareAppMessage() {
    return {
      title: '积分商城 - 用积分兑换环保好礼',
      path: '/pages/exchange/exchange',
      imageUrl: ''
    }
  }
})
