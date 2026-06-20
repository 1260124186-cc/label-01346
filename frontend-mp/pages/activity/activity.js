const app = getApp()
const { showToast, showSuccess, navigateTo, formatDate, showModal } = require('../../utils/util')
const {
  ACTIVITY_TYPES,
  ELIGIBILITY_META
} = require('../../utils/activity')
const { FLASH_SALE_STATUS } = require('../../utils/flashsale')

Page({
  data: {
    activityId: '',
    activity: null,
    activityTypeMeta: null,
    userPoints: 0,
    userLevel: '',
    userLevelNum: 1,
    joinDate: '',
    countdown: {
      hours: '00',
      minutes: '00',
      seconds: '00'
    },
    timer: null,
    eligibilityResult: null,
    flashSession: null,
    flashGoodsList: [],
    isReserved: false,
    reservations: [],
    flashPurchases: [],
    activeDoubles: [],
    discountGoodsList: [],
    userDiscount: null,
    activityReport: null,
    participationStats: null,
    inDateRange: true,
    multiplier: null,
    multiplierText: ''
  },

  onLoad(options) {
    const id = options.id || 'act_double_new'
    this.setData({ activityId: id })
    this.loadActivity(id)
    this.refreshUserInfo()
    this.refreshActiveDoubles()
  },

  onShow() {
    this.refreshUserInfo()
    this.refreshActiveDoubles()

    const { activity } = this.data
    if (!activity) return

    if (activity.type === ACTIVITY_TYPES.FLASH_SALE) {
      this.startCountdown()
      this.refreshFlashGoods()
      this.checkReservationStatus()
    } else if (activity.type === ACTIVITY_TYPES.LEVEL_DISCOUNT) {
      this.refreshDiscountGoods()
    }

    this.refreshParticipationStats()
    this.checkActivityReport()
  },

  onHide() {
    this.stopCountdown()
  },

  onUnload() {
    this.stopCountdown()
  },

  onPullDownRefresh() {
    const { activityId } = this.data
    this.loadActivity(activityId)
    this.refreshUserInfo()
    this.refreshActiveDoubles()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  loadActivity(id) {
    const activity = app.getActivityById(id)
    if (!activity) {
      showToast('活动不存在')
      return
    }

    const { ACTIVITY_TYPE_META } = require('../../utils/activity')
    const activityTypeMeta = ACTIVITY_TYPE_META[activity.type] || null
    const inDateRange = app.getActivityManager().isActivityInDateRange(activity)
    const eligibilityResult = app.checkActivityEligibility(activity)

    const multiplier = activity.multiplier || (activityTypeMeta && activityTypeMeta.defaultPointsMultiplier) || null
    const multiplierText = multiplier ? `${multiplier}倍积分` : ''

    this.setData({
      activity,
      activityTypeMeta,
      inDateRange,
      eligibilityResult,
      multiplier,
      multiplierText
    })

    wx.setNavigationBarTitle({ title: activity.title })

    if (activity.type === ACTIVITY_TYPES.FLASH_SALE) {
      this.initFlashSale()
    } else if (activity.type === ACTIVITY_TYPES.LEVEL_DISCOUNT) {
      this.refreshDiscountGoods()
    }

    this.refreshParticipationStats()
    this.checkActivityReport()
  },

  refreshUserInfo() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      const { USER_LEVELS } = require('../../utils/constants')
      let levelInfo = USER_LEVELS[0]
      for (const level of USER_LEVELS) {
        if (userInfo.points >= level.minPoints) {
          levelInfo = level
        }
      }

      const userDiscount = app.getUserLevelDiscount()

      this.setData({
        userPoints: userInfo.points || 0,
        userLevel: 'LV.' + levelInfo.level + ' ' + levelInfo.name,
        userLevelNum: levelInfo.level,
        joinDate: userInfo.joinDate || '',
        userDiscount
      })

      if (this.data.activity) {
        const eligibilityResult = app.checkActivityEligibility(this.data.activity)
        this.setData({ eligibilityResult })
      }
    }
  },

  refreshActiveDoubles() {
    const activeDoubles = app.getActivePointsDoubles()
    this.setData({ activeDoubles })
  },

  initFlashSale() {
    const { activity } = this.data
    const flashSaleMgr = app.getFlashSaleManager()
    const session = flashSaleMgr.getFlashSession(activity, app)

    this.setData({ flashSession: session })

    flashSaleMgr.refreshGoodsStockFromApp(activity, app)

    this.refreshFlashGoods()
    this.checkReservationStatus()
    this.loadUserPurchases()
    this.startCountdown()
  },

  refreshFlashGoods() {
    const { activity } = this.data
    if (!activity) return
    const flashSaleMgr = app.getFlashSaleManager()
    const goodsList = flashSaleMgr.getFlashGoodsList(activity, app)
    this.setData({ flashGoodsList: goodsList })
  },

  refreshDiscountGoods() {
    const { activity } = this.data
    if (!activity) return

    const goodsIds = activity.discountGoodsIds || []
    const goodsList = app.getGoodsList()
    const activityMgr = app.getActivityManager()
    const userInfo = app.globalData.userInfo

    const discountGoodsList = goodsIds.map(gid => {
      const goods = goodsList.find(g => g.id === gid)
      if (!goods) return null
      const discountInfo = activityMgr.getDiscountForGoods(goods, userInfo, activity)
      return {
        ...goods,
        discountInfo
      }
    }).filter(Boolean)

    this.setData({ discountGoodsList })
  },

  checkReservationStatus() {
    const { activity, flashSession } = this.data
    if (!activity || !flashSession || !flashSession.display) return

    const userId = app.getUserId()
    const flashSaleMgr = app.getFlashSaleManager()
    const isReserved = flashSaleMgr.isReserved(
      activity.id,
      flashSession.display.sessionKey,
      userId
    )
    const reservations = flashSaleMgr.getUserReservations(userId, activity.id)

    this.setData({ isReserved, reservations })
  },

  loadUserPurchases() {
    const { activity } = this.data
    if (!activity) return
    const userId = app.getUserId()
    const flashSaleMgr = app.getFlashSaleManager()
    const stats = flashSaleMgr.getUserPurchaseStats(userId, activity.id)
    this.setData({ flashPurchases: stats.purchases })
  },

  refreshParticipationStats() {
    const { activity } = this.data
    if (!activity) return
    const stats = app.getActivityManager().getParticipationStats(activity.id)
    this.setData({ participationStats: stats })
  },

  checkActivityReport() {
    const { activity } = this.data
    if (!activity || !activity.reportGenerated || !activity.reportId) return
    const report = app.getActivityManager().getReportById(activity.reportId)
    this.setData({ activityReport: report })
  },

  startCountdown() {
    this.stopCountdown()
    this.updateCountdown()
    const timer = setInterval(() => {
      this.updateCountdown()
      this.refreshFlashGoodsTick()
    }, 1000)
    this.setData({ timer })
  },

  stopCountdown() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  },

  refreshFlashGoodsTick() {
    const { activity } = this.data
    if (!activity || activity.type !== ACTIVITY_TYPES.FLASH_SALE) return
    const flashSaleMgr = app.getFlashSaleManager()
    const session = flashSaleMgr.getFlashSession(activity, app)

    const oldSession = this.data.flashSession
    const sessionChanged =
      (!oldSession && session.display) ||
      (oldSession && oldSession.display && session.display &&
        oldSession.display.sessionKey !== session.display.sessionKey) ||
      (oldSession && session.isActive !== oldSession.isActive)

    this.setData({ flashSession: session })

    if (sessionChanged) {
      this.refreshFlashGoods()
      this.checkReservationStatus()
      this.loadUserPurchases()
    }
  },

  updateCountdown() {
    const { activity, flashSession } = this.data
    if (!activity || activity.type !== ACTIVITY_TYPES.FLASH_SALE) return

    const now = Date.now()
    let diffMs = 0

    if (flashSession && flashSession.current) {
      diffMs = Math.max(0, flashSession.current.endTime - now)
    } else if (flashSession && flashSession.next) {
      diffMs = Math.max(0, flashSession.next.startTime - now)
    } else {
      return
    }

    const totalSeconds = Math.floor(diffMs / 1000)
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60

    this.setData({
      countdown: {
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      }
    })
  },

  onReserve() {
    const { activity, eligibilityResult } = this.data

    if (!eligibilityResult || !eligibilityResult.eligible) {
      showToast(eligibilityResult?.failSummary || '您不满足活动参与条件')
      return
    }

    const userId = app.getUserId()
    const flashSaleMgr = app.getFlashSaleManager()
    const result = flashSaleMgr.makeReservation(activity, userId, app)

    if (result.success) {
      showSuccess('预约成功')
      this.checkReservationStatus()
      app.recordActivityParticipation(activity.id, 'reserve', {
        extra: { sessionKey: result.reservation.sessionKey }
      })
    } else if (result.alreadyReserved) {
      showToast('已预约过该场次')
    } else {
      showToast(result.message || '预约失败')
    }
  },

  onCancelReserve(e) {
    const { reservationId } = e.currentTarget.dataset
    const userId = app.getUserId()
    const flashSaleMgr = app.getFlashSaleManager()
    const result = flashSaleMgr.cancelReservation(reservationId, userId)
    if (result.success) {
      showSuccess('已取消预约')
      this.checkReservationStatus()
    } else {
      showToast(result.message || '取消失败')
    }
  },

  onFlashPurchase(e) {
    const { goodsId, goodsName } = e.currentTarget.dataset
    const { activity, eligibilityResult, flashSession } = this.data

    if (!flashSession || !flashSession.isActive) {
      showToast('当前不在秒杀时间段内')
      return
    }

    if (!eligibilityResult || !eligibilityResult.eligible) {
      showToast(eligibilityResult?.failSummary || '您不满足活动参与条件')
      return
    }

    const flashGoods = this.data.flashGoodsList.find(g => g.id === goodsId)
    if (!flashGoods) {
      showToast('商品不存在')
      return
    }

    showModal({
      title: '确认秒杀',
      content: `确定使用 ${flashGoods.salePoints} 积分秒杀「${goodsName}」吗？\n原价 ${flashGoods.originalPoints} 积分，省 ${flashGoods.originalPoints - flashGoods.salePoints} 积分！`,
      confirmText: '立即秒杀',
      confirmColor: '#E85D5D'
    }).then(confirmed => {
      if (!confirmed) return

      wx.showLoading({ title: '秒杀中...', mask: true })

      setTimeout(() => {
        const userId = app.getUserId()
        const flashSaleMgr = app.getFlashSaleManager()
        const result = flashSaleMgr.purchaseFlashGoods(activity, goodsId, userId, app)

        wx.hideLoading()

        if (result.success) {
          showSuccess('秒杀成功！')
          this.refreshFlashGoods()
          this.loadUserPurchases()
          this.refreshUserInfo()

          app.recordActivityParticipation(activity.id, 'redeem', {
            points: flashGoods.salePoints,
            goodsId,
            extra: {
              originalPoints: flashGoods.originalPoints,
              savedPoints: flashGoods.originalPoints - flashGoods.salePoints
            }
          })

          setTimeout(() => {
            wx.navigateTo({ url: '/pages/orders/orders' })
          }, 1500)
        } else {
          showToast(result.message || '秒杀失败')
          if (result.soldOut) {
            this.refreshFlashGoods()
          }
        }
      }, 500)
    })
  },

  onGoodsTap(e) {
    const { id } = e.currentTarget.dataset
    navigateTo('/pages/goods-detail/goods-detail', { id })
  },

  onGoExchange() {
    wx.switchTab({ url: '/pages/exchange/exchange' })
  },

  onGoMessages(e) {
    const { tab } = e.currentTarget.dataset
    const url = tab
      ? `/pages/messages/messages?tab=${tab}`
      : '/pages/messages/messages'
    navigateTo(url)
  },

  onGoSignin() {
    navigateTo('/pages/signin/signin')
  },

  onGoQuiz() {
    navigateTo('/pages/quiz/quiz')
  },

  onShareAppMessage() {
    const { activity } = this.data
    return {
      title: activity ? activity.title : '积分商城活动',
      path: activity ? `/pages/activity/activity?id=${activity.id}` : '/pages/exchange/exchange'
    }
  }
})
