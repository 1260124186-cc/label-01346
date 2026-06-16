/**
 * 积分兑换页面
 * @description 展示积分商城，用户可以使用积分兑换各种礼品
 */
const app = getApp()
const { EXCHANGE_GOODS, EXCHANGE_BANNERS } = require('../../utils/constants')
const { showToast, showModal, showLoading, hideLoading, formatNumber } = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 用户积分
    userPoints: 0,
    // 轮播广告数据
    bannerList: EXCHANGE_BANNERS,
    // 当前轮播索引
    currentBannerIndex: 0,
    // 商品列表
    goodsList: EXCHANGE_GOODS,
    // 商品分类
    categories: [
      { id: 'all', name: '全部' },
      { id: 'hot', name: '热门' },
      { id: 'new', name: '新品' },
      { id: 'limit', name: '限量' }
    ],
    // 当前分类
    currentCategory: 'all',
    // 滚动高度
    scrollTop: 0,
    // 是否显示回到顶部按钮
    showBackTop: false,
    // 兑换中的商品ID
    exchangingId: null,
    // 是否显示积分规则弹窗
    showRulesModal: false,
    // 积分规则数据
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log('[Exchange] 页面加载')
    this.initPageData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('[Exchange] 页面显示')
    // 刷新用户积分
    this.refreshUserPoints()
  },

  /**
   * 初始化页面数据
   */
  initPageData() {
    this.refreshUserPoints()
  },

  /**
   * 刷新用户积分
   */
  refreshUserPoints() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userPoints: userInfo.points || 0
      })
    }
  },

  /**
   * 显示积分规则弹窗
   */
  showPointsRules() {
    this.setData({ showRulesModal: true })
  },

  /**
   * 隐藏积分规则弹窗
   */
  hidePointsRules() {
    this.setData({ showRulesModal: false })
  },

  /**
   * 阻止弹窗内容区域的点击事件冒泡
   */
  preventClose() {
    // 阻止冒泡，不做任何操作
  },

  /**
   * 轮播图切换事件
   * @param {Object} e 事件对象
   */
  onBannerChange(e) {
    const current = e.detail.current
    this.setData({
      currentBannerIndex: current
    })
  },

  /**
   * 点击轮播广告
   * @param {Object} e 事件对象
   */
  onBannerTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Exchange] 点击轮播广告', item)
    showToast('活动详情开发中')
  },

  /**
   * 切换商品分类
   * @param {Object} e 事件对象
   */
  onCategoryChange(e) {
    const { id } = e.currentTarget.dataset
    console.log('[Exchange] 切换分类', id)
    
    this.setData({
      currentCategory: id
    })
    
    // 根据分类筛选商品
    this.filterGoods(id)
  },

  /**
   * 筛选商品
   * @param {string} categoryId 分类ID
   */
  filterGoods(categoryId) {
    let filteredGoods = [...EXCHANGE_GOODS]
    
    switch (categoryId) {
      case 'hot':
        filteredGoods = EXCHANGE_GOODS.filter(item => item.tag === '热门')
        break
      case 'new':
        filteredGoods = EXCHANGE_GOODS.filter(item => item.tag === '推荐')
        break
      case 'limit':
        filteredGoods = EXCHANGE_GOODS.filter(item => item.tag === '限量')
        break
      default:
        filteredGoods = EXCHANGE_GOODS
    }
    
    this.setData({
      goodsList: filteredGoods
    })
  },

  /**
   * 滚动事件
   * @param {Object} e 事件对象
   */
  onScroll(e) {
    const { scrollTop } = e.detail
    const showBackTop = scrollTop > 500
    
    if (showBackTop !== this.data.showBackTop) {
      this.setData({ showBackTop })
    }
  },

  /**
   * 回到顶部
   */
  scrollToTop() {
    this.setData({
      scrollTop: 0
    })
  },

  /**
   * 点击商品
   * @param {Object} e 事件对象
   */
  onGoodsTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Exchange] 点击商品', item.name)
    
    // 显示商品详情
    wx.showModal({
      title: item.name,
      content: `${item.description}\n\n所需积分：${item.points}\n库存：${item.stock}件`,
      showCancel: true,
      cancelText: '取消',
      confirmText: '立即兑换',
      confirmColor: '#5BBD72',
      success: (res) => {
        if (res.confirm) {
          this.handleExchange(item)
        }
      }
    })
  },

  /**
   * 兑换商品
   * @param {Object} item 商品数据
   */
  async handleExchange(item) {
    const { userPoints, exchangingId } = this.data
    
    // 防止重复点击
    if (exchangingId) {
      return
    }
    
    // 检查积分是否足够
    if (userPoints < item.points) {
      showToast('积分不足，无法兑换')
      return
    }
    
    // 检查库存
    if (item.stock <= 0) {
      showToast('商品已售罄')
      return
    }
    
    // 确认兑换
    const confirmed = await showModal({
      title: '确认兑换',
      content: `确定使用 ${item.points} 积分兑换「${item.name}」吗？`,
      confirmText: '确认兑换'
    })
    
    if (!confirmed) return
    
    // 开始兑换
    this.setData({ exchangingId: item.id })
    showLoading('兑换中...')
    
    // 模拟网络请求
    setTimeout(() => {
      hideLoading()
      
      // 扣除积分
      app.updateUserPoints(-item.points)
      this.refreshUserPoints()
      
      // 更新商品库存
      const goodsList = this.data.goodsList.map(goods => {
        if (goods.id === item.id) {
          return {
            ...goods,
            stock: goods.stock - 1,
            sales: goods.sales + 1
          }
        }
        return goods
      })
      
      this.setData({
        goodsList,
        exchangingId: null
      })
      
      showToast('兑换成功')
      console.log('[Exchange] 兑换成功', item.name)
    }, 1500)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '积分商城 - 用积分兑换环保好礼',
      path: '/pages/exchange/exchange',
      imageUrl: ''
    }
  }
})
