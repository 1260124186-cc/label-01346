/**
 * 首页
 * @description 展示垃圾分类小程序的各项功能，点击垃圾桶图片跳转到相应分类页面
 */
const app = getApp()
const { TRASH_TYPES, BANNER_LIST, ECO_TIPS, HOT_WASTE_NEWS } = require('../../utils/constants')
const { navigateTo, showToast, switchTab } = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bannerList: BANNER_LIST,
    currentBannerIndex: 0,
    trashTypes: TRASH_TYPES,
    isLoading: false,
    isSignedToday: false,
    streakDays: 0,
    ecoTips: ECO_TIPS,
    currentTipIndex: 0,
    currentTip: ECO_TIPS[0],
    tipTimer: null,
    hotNews: HOT_WASTE_NEWS
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

  onHide() {
    if (this.data.tipTimer) {
      clearInterval(this.data.tipTimer)
    }
  },

  onUnload() {
    if (this.data.tipTimer) {
      clearInterval(this.data.tipTimer)
    }
  },

  /**
   * 初始化页面数据
   */
  initPageData() {
    console.log('[Index] 初始化页面数据')
    this.refreshSignInStatus()
    this.startTipRotation()
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

    if (!item.linkType) return

    switch (item.linkType) {
      case 'activity':
        navigateTo('/pages/activity/activity', { id: item.linkId || '1' })
        break
      case 'quiz':
        navigateTo('/pages/quiz/quiz')
        break
      case 'classify':
        if (item.linkId) {
          const trashType = TRASH_TYPES.find(t => t.id === parseInt(item.linkId))
          navigateTo('/pages/classify/classify', {
            id: item.linkId,
            name: trashType ? trashType.name : '垃圾分类'
          })
        }
        break
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

  startTipRotation() {
    if (this.data.tipTimer) {
      clearInterval(this.data.tipTimer)
    }
    const timer = setInterval(() => {
      const nextIndex = (this.data.currentTipIndex + 1) % this.data.ecoTips.length
      this.setData({
        currentTipIndex: nextIndex,
        currentTip: this.data.ecoTips[nextIndex]
      })
    }, 6000)
    this.setData({ tipTimer: timer })
  },

  onTipDotTap(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      currentTipIndex: index,
      currentTip: this.data.ecoTips[index]
    })
    this.startTipRotation()
  },

  onHotNewsTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Index] 点击热点动态', item.title)
    if (item.tag === '活动') {
      navigateTo('/pages/activity/activity', { id: '1' })
    } else if (item.tag === '政策') {
      navigateTo('/pages/classify/classify', { id: 1 })
    }
  },

  goToSearch() {
    console.log('[Index] 点击搜索框')
    navigateTo('/pages/search/search')
  },

  goToPhotoRecognize() {
    console.log('[Index] 点击拍一拍识垃圾')
    navigateTo('/pages/photo-recognize/photo-recognize')
  },

  goToDropPoint() {
    console.log('[Index] 点击投放点地图')
    navigateTo('/pages/drop-point/drop-point')
  },

  goToCommunity() {
    console.log('[Index] 点击环保社区')
    navigateTo('/pages/community/community')
  },

  /**
   * 跳转到游戏大厅
   */
  goToGameHall() {
    console.log('[Index] 点击垃圾分类小游戏')
    navigateTo('/pages/game-hall/game-hall')
  },

  goToRecycleBook() {
    console.log('[Index] 点击预约上门回收')
    navigateTo('/pages/recycle-book/recycle-book')
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
    console.log('[Index] 用户分享')
    const shareInfo = app.generateShareInfo()

    const result = app.handleShareSuccess()
    if (result.success && result.points > 0) {
      showToast(`分享成功 +${result.points}积分`)
    } else if (result.reason === 'daily_limit') {
      console.log('[Index] 今日分享积分已达上限')
    }

    return shareInfo
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    console.log('[Index] 分享到朋友圈')
    const { SHARE_CONFIG } = require('../../utils/constants')
    return {
      title: SHARE_CONFIG.shareTitle,
      query: `inviterId=${app.getUserId()}`,
      imageUrl: SHARE_CONFIG.shareImageUrl
    }
  }
})
