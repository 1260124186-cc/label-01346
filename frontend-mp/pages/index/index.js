/**
 * 首页
 * @description 展示垃圾分类小程序的各项功能，点击垃圾桶图片跳转到相应分类页面
 */
const app = getApp()
const { TRASH_TYPES, BANNER_LIST } = require('../../utils/constants')
const { navigateTo, showToast, switchTab } = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数据
    bannerList: BANNER_LIST,
    // 当前轮播索引
    currentBannerIndex: 0,
    // 四种垃圾分类数据
    trashTypes: TRASH_TYPES,
    // 页面加载状态
    isLoading: false,
    // 签到相关
    isSignedToday: false,
    streakDays: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log('[Index] 页面加载')
    this.initPageData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('[Index] 页面显示')
    this.refreshSignInStatus()
  },

  /**
   * 初始化页面数据
   */
  initPageData() {
    console.log('[Index] 初始化页面数据')
    this.refreshSignInStatus()
  },

  refreshSignInStatus() {
    this.setData({
      isSignedToday: app.isTodaySignedIn(),
      streakDays: app.getStreakDays()
    })
  },

  goToSignIn() {
    console.log('[Index] 点击每日签到')
    navigateTo('/pages/signin/signin')
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
    console.log('[Index] 轮播图切换', current)
  },

  /**
   * 点击轮播图
   * @param {Object} e 事件对象
   */
  onBannerTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Index] 点击轮播图', item)
    if (item.link) {
      navigateTo(item.link)
    }
  },

  /**
   * 点击垃圾分类卡片，跳转到分类详情页
   * @param {Object} e 事件对象
   */
  goToClassify(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Index] 点击垃圾分类', item.name)

    // 跳转到垃圾分类常识页面，传递分类ID
    navigateTo('/pages/classify/classify', {
      id: item.id,
      name: item.name
    })
  },

  /**
   * 开始练习此类垃圾
   * @param {Object} e 事件对象
   */
  startSortPractice(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Index] 开始练习', item.name)

    navigateTo('/pages/sort-practice/sort-practice', {
      mode: 'category',
      typeId: item.id,
      typeName: item.name
    })
  },

  /**
   * 长按垃圾分类卡片
   * @param {Object} e 事件对象
   */
  onTrashCardLongPress(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Index] 长按垃圾分类卡片', item.name)

    wx.showActionSheet({
      itemList: ['查看分类知识', '开始练一练'],
      itemColor: '#2D3436',
      success: (res) => {
        if (res.tapIndex === 0) {
          this.goToClassify(e)
        } else if (res.tapIndex === 1) {
          this.startSortPractice(e)
        }
      }
    })
  },

  /**
   * 点击"了解分类详情"，跳转到第一个分类（可回收垃圾）
   */
  goToFirstClassify() {
    const firstType = this.data.trashTypes[0]
    console.log('[Index] 点击了解分类详情', firstType.name)

    navigateTo('/pages/classify/classify', {
      id: firstType.id,
      name: firstType.name
    })
  },

  /**
   * 跳转到知识问答页面
   */
  goToQuiz() {
    console.log('[Index] 点击知识问答')
    navigateTo('/pages/quiz/quiz')
  },

  /**
   * 跳转到每日一练页面
   */
  goToDailyQuiz() {
    console.log('[Index] 点击每日一练')
    navigateTo('/pages/quiz-daily/quiz-daily')
  },

  /**
   * 跳转到垃圾分类练习（随机混合模式）
   */
  goToSortPracticeRandom() {
    console.log('[Index] 点击垃圾分类练习（随机混合）')
    navigateTo('/pages/sort-practice/sort-practice', {
      mode: 'random'
    })
  },

  /**
   * 跳转到垃圾分类练习（易错题模式）
   */
  goToSortPracticeWrong() {
    console.log('[Index] 点击垃圾分类练习（易错题）')
    navigateTo('/pages/sort-practice/sort-practice', {
      mode: 'wrong'
    })
  },

  /**
   * 跳转到积分兑换页面
   */
  goToExchange() {
    console.log('[Index] 点击积分兑换')
    switchTab('/pages/exchange/exchange')
  },

  /**
   * 跳转到个人中心页面
   */
  goToProfile() {
    console.log('[Index] 点击个人中心')
    switchTab('/pages/profile/profile')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log('[Index] 下拉刷新')
    this.initPageData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '垃圾分类助手 - 让垃圾分类更简单',
      path: '/pages/index/index',
      imageUrl: ''
    }
  }
})
