/**
 * 首页
 * @description 展示垃圾分类小程序的各项功能，支持智能化运营配置
 */

const app = getApp()
const { TRASH_TYPES, BANNER_LIST, ECO_TIPS, HOT_WASTE_NEWS } = require('../../utils/constants')
const { navigateTo, showToast, switchTab } = require('../../utils/util')
const { handleBannerTap, navigateByLinkType } = require('../../utils/router')
const { recordPageVisit, getSortedQuickActions } = require('../../utils/userBehavior')
const operationConfig = require('../../utils/operationConfig')
const { shouldShowGuide } = require('../../components/guide-mask/guide-mask')

const DEFAULT_QUICK_ACTIONS = [
  { key: 'quiz', name: '知识问答', emoji: '❓', action: 'goToQuiz', bgGradient: 'linear-gradient(135deg, rgba(91, 189, 114, 0.18) 0%, rgba(91, 189, 114, 0.06) 100%)', ringColor: 'rgba(91, 189, 114, 0.25)' },
  { key: 'dailyQuiz', name: '每日一练', emoji: '📅', action: 'goToDailyQuiz', bgGradient: 'linear-gradient(135deg, rgba(74, 144, 217, 0.18) 0%, rgba(74, 144, 217, 0.06) 100%)', ringColor: 'rgba(74, 144, 217, 0.25)' },
  { key: 'sortPractice', name: '分类练习', emoji: '♻️', action: 'goToSortPracticeRandom', bgGradient: 'linear-gradient(135deg, rgba(46, 204, 113, 0.18) 0%, rgba(46, 204, 113, 0.06) 100%)', ringColor: 'rgba(46, 204, 113, 0.25)' },
  { key: 'wrongQuestions', name: '易错题', emoji: '📝', action: 'goToSortPracticeWrong', bgGradient: 'linear-gradient(135deg, rgba(231, 76, 60, 0.18) 0%, rgba(231, 76, 60, 0.06) 100%)', ringColor: 'rgba(231, 76, 60, 0.25)' },
  { key: 'dropPoint', name: '投放点地图', emoji: '🗺️', action: 'goToDropPoint', bgGradient: 'linear-gradient(135deg, rgba(26, 188, 156, 0.18) 0%, rgba(26, 188, 156, 0.06) 100%)', ringColor: 'rgba(26, 188, 156, 0.25)' },
  { key: 'exchange', name: '积分兑换', emoji: '🎁', action: 'goToExchange', bgGradient: 'linear-gradient(135deg, rgba(243, 156, 18, 0.18) 0%, rgba(243, 156, 18, 0.06) 100%)', ringColor: 'rgba(243, 156, 18, 0.25)' },
  { key: 'lottery', name: '积分抽奖', emoji: '🎰', action: 'goToLottery', bgGradient: 'linear-gradient(135deg, rgba(232, 93, 93, 0.18) 0%, rgba(232, 93, 93, 0.06) 100%)', ringColor: 'rgba(232, 93, 93, 0.25)' },
  { key: 'blindbox', name: '惊喜盲盒', emoji: '📦', action: 'goToBlindbox', bgGradient: 'linear-gradient(135deg, rgba(155, 89, 182, 0.18) 0%, rgba(155, 89, 182, 0.06) 100%)', ringColor: 'rgba(155, 89, 182, 0.25)' },
  { key: 'community', name: '环保社区', emoji: '💚', action: 'goToCommunity', bgGradient: 'linear-gradient(135deg, rgba(52, 152, 219, 0.18) 0%, rgba(52, 152, 219, 0.06) 100%)', ringColor: 'rgba(52, 152, 219, 0.25)' },
  { key: 'profile', name: '个人中心', emoji: '👤', action: 'goToProfile', bgGradient: 'linear-gradient(135deg, rgba(243, 156, 18, 0.18) 0%, rgba(243, 156, 18, 0.06) 100%)', ringColor: 'rgba(243, 156, 18, 0.25)' }
]

Page({
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
    hotNews: HOT_WASTE_NEWS,
    expiringBadge: null,
    quickActions: DEFAULT_QUICK_ACTIONS,
    showGuideMask: false,
    isRefreshing: false,
    experienceClasses: ''
  },

  onLoad() {
    console.log('[Index] 页面加载')
    this.setData({ experienceClasses: app.getExperienceClasses() })
    this.initPageData()
    this.checkAndShowGuide()
    this.loadOperationConfig()
  },

  onShow() {
    console.log('[Index] 页面显示')
    this.setData({ experienceClasses: app.getExperienceClasses() })
    this.refreshSignInStatus()
    this.sortQuickActions()
    recordPageVisit('index')
  },

  onThemeChange(isDark) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onFontChange(isLarge) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
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

  initPageData() {
    console.log('[Index] 初始化页面数据')
    this.refreshSignInStatus()
    this.startTipRotation()
    this.sortQuickActions()
  },

  async loadOperationConfig() {
    try {
      const config = await operationConfig.getConfig()
      console.log('[Index] 运营配置已加载', config.version)

      if (config.banners && config.banners.length > 0) {
        this.setData({ bannerList: config.banners })
      }

      if (config.ecoTips && config.ecoTips.length > 0) {
        this.setData({
          ecoTips: config.ecoTips,
          currentTip: config.ecoTips[0],
          currentTipIndex: 0
        })
        this.startTipRotation()
      }

      if (config.hotNews && config.hotNews.length > 0) {
        this.setData({ hotNews: config.hotNews })
      }

      if (config.quickActions && config.quickActions.length > 0) {
        this.mergeQuickActions(config.quickActions)
      }
    } catch (e) {
      console.warn('[Index] 加载运营配置失败，使用默认配置', e)
    }
  },

  mergeQuickActions(remoteActions) {
    const merged = remoteActions.map(remote => {
      const defaultAction = DEFAULT_QUICK_ACTIONS.find(d => d.key === remote.key)
      return {
        ...defaultAction,
        ...remote
      }
    })
    this.setData({ quickActions: merged })
    this.sortQuickActions()
  },

  sortQuickActions() {
    const sorted = getSortedQuickActions(this.data.quickActions)
    this.setData({ quickActions: sorted })
  },

  checkAndShowGuide() {
    if (shouldShowGuide()) {
      setTimeout(() => {
        this.setData({ showGuideMask: true })
      }, 500)
    }
  },

  onGuideClose() {
    this.setData({ showGuideMask: false })
  },

  refreshSignInStatus() {
    this.setData({
      isSignedToday: app.isTodaySignedIn(),
      streakDays: app.getStreakDays(),
      expiringBadge: app.getNearestExpiringBadge()
    })
  },

  goToPoints() {
    console.log('[Index] 点击积分即将过期提示')
    app.safeNavigateTo('/pages/points/points?tab=expiring')
    recordPageVisit('points')
  },

  goToSignIn() {
    console.log('[Index] 点击每日签到')
    app.safeNavigateTo('/pages/signin/signin')
    recordPageVisit('signin')
  },

  onBannerChange(e) {
    const current = e.detail.current
    this.setData({
      currentBannerIndex: current
    })
    console.log('[Index] 轮播图切换', current)
  },

  onBannerTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Index] 点击轮播图', item)
    handleBannerTap(item)
  },

  goToLearningCenter() {
    console.log('[Index] 点击学习中心')
    app.safeNavigateTo('/pages/learning-center/learning-center')
    recordPageVisit('learningCenter')
  },

  goToGreenGuide() {
    console.log('[Index] 点击绿色消费指南')
    app.safeNavigateTo('/pages/green-guide/green-guide')
    recordPageVisit('greenGuide')
  },

  goToClassify(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Index] 点击垃圾分类', item.name)

    app.safeNavigateTo('/pages/classify/classify', {
      id: item.id,
      name: item.name
    })
    app.recordChildClassify()
    recordPageVisit('classify')
  },

  startSortPractice(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Index] 开始练习', item.name)

    app.safeNavigateTo('/pages/sort-practice/sort-practice', {
      mode: 'category',
      typeId: item.id,
      typeName: item.name
    })
    app.recordChildGame()
    recordPageVisit('sortPractice')
  },

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

  goToFirstClassify() {
    const firstType = this.data.trashTypes[0]
    console.log('[Index] 点击了解分类详情', firstType.name)

    app.safeNavigateTo('/pages/classify/classify', {
      id: firstType.id,
      name: firstType.name
    })
  },

  goToQuiz() {
    console.log('[Index] 点击知识问答')
    app.safeNavigateTo('/pages/quiz/quiz')
    recordPageVisit('quiz')
  },

  goToDailyQuiz() {
    console.log('[Index] 点击每日一练')
    app.safeNavigateTo('/pages/quiz-daily/quiz-daily')
    recordPageVisit('dailyQuiz')
  },

  goToSortPracticeRandom() {
    console.log('[Index] 点击垃圾分类练习（随机混合）')
    app.safeNavigateTo('/pages/sort-practice/sort-practice', {
      mode: 'random'
    })
    app.recordChildGame()
    recordPageVisit('sortPractice')
  },

  goToSortPracticeWrong() {
    console.log('[Index] 点击垃圾分类练习（易错题）')
    app.safeNavigateTo('/pages/sort-practice/sort-practice', {
      mode: 'wrong'
    })
    app.recordChildGame()
    recordPageVisit('wrongQuestions')
  },

  goToExchange() {
    console.log('[Index] 点击积分兑换')
    switchTab('/pages/exchange/exchange')
    recordPageVisit('exchange')
  },

  goToLottery() {
    console.log('[Index] 点击积分抽奖')
    navigateTo('/pages/lottery/lottery')
    recordPageVisit('lottery')
  },

  goToBlindbox() {
    console.log('[Index] 点击惊喜盲盒')
    navigateTo('/pages/blindbox/blindbox')
    recordPageVisit('blindbox')
  },

  goToProfile() {
    console.log('[Index] 点击个人中心')
    switchTab('/pages/profile/profile')
    recordPageVisit('profile')
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

    if (item.linkType) {
      navigateByLinkType({
        linkType: item.linkType,
        linkId: item.linkId,
        linkUrl: item.linkUrl
      })
    } else if (item.tag === '活动') {
      app.safeNavigateTo('/pages/activity/activity', { id: '1' })
    } else if (item.tag === '政策') {
      app.safeNavigateTo('/pages/classify/classify', { id: 1 })
    }
  },

  goToSearch() {
    console.log('[Index] 点击搜索框')
    app.safeNavigateTo('/pages/search/search')
    recordPageVisit('search')
  },

  goToBarcodeScan() {
    console.log('[Index] 点击扫码识物')
    app.safeNavigateTo('/pages/barcode-scan/barcode-scan')
    recordPageVisit('barcodeScan')
  },

  goToPhotoRecognize() {
    console.log('[Index] 点击拍一拍识垃圾')
    app.safeNavigateTo('/pages/photo-recognize/photo-recognize')
    recordPageVisit('photoRecognize')
  },

  goToDropPoint() {
    console.log('[Index] 点击投放点地图')
    app.safeNavigateTo('/pages/drop-point/drop-point')
    recordPageVisit('dropPoint')
  },

  goToCommunity() {
    console.log('[Index] 点击环保社区')
    app.safeNavigateTo('/pages/community/community')
    recordPageVisit('community')
  },

  goToGameHall() {
    console.log('[Index] 点击垃圾分类小游戏')
    app.safeNavigateTo('/pages/game-hall/game-hall')
    app.recordChildGame()
    recordPageVisit('gameHall')
  },

  goToLearningPath() {
    console.log('[Index] 点击我的学习路径')
    app.safeNavigateTo('/pages/learning-path/learning-path')
    recordPageVisit('learningPath')
  },

  goToRecycleBook() {
    console.log('[Index] 点击预约上门回收')
    app.safeNavigateTo('/pages/recycle-book/recycle-book')
    recordPageVisit('recycleBook')
  },

  goToVerify() {
    console.log('[Index] 点击证书验真')
    app.safeNavigateTo('/pages/certificate-verify/certificate-verify')
    recordPageVisit('certVerify')
  },

  onQuickActionTap(e) {
    const { action } = e.currentTarget.dataset
    console.log('[Index] 点击快捷入口', action)

    if (action && typeof this[action] === 'function') {
      this[action]()
    }
  },

  async onPullDownRefresh() {
    console.log('[Index] 下拉刷新')
    this.setData({ isRefreshing: true })

    try {
      await operationConfig.refreshConfig()
      await this.loadOperationConfig()
      this.refreshSignInStatus()
      this.sortQuickActions()
      showToast('刷新成功', 'success')
    } catch (e) {
      console.warn('[Index] 下拉刷新失败', e)
      showToast('刷新失败')
    }

    this.setData({ isRefreshing: false })
    wx.stopPullDownRefresh()
  },

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
