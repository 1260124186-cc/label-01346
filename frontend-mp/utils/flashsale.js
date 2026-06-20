const { generateId, formatDate, getStorage, setStorage } = require('./util')
const { EXCHANGE_GOODS } = require('./constants')

const FLASH_SALE_STORAGE_KEY = 'flashSaleSystem'
const FLASH_SALE_RESERVATION_KEY = 'flashSaleReservations'
const FLASH_SALE_PURCHASE_KEY = 'flashSalePurchases'
const FLASH_SALE_REMINDER_KEY = 'flashSaleReminders'

const FLASH_SALE_STATUS = {
  NOT_STARTED: 'not_started',
  REMINDER_WINDOW: 'reminder_window',
  ONGOING: 'ongoing',
  ENDED: 'ended',
  SOLD_OUT: 'sold_out'
}

class FlashSaleManager {
  constructor() {
    this.sales = {}
    this.reservations = []
    this.purchases = []
    this.sentReminders = []
    this.goodsStockCache = {}
    this.init()
  }

  init() {
    const storedSales = getStorage(FLASH_SALE_STORAGE_KEY)
    this.sales = storedSales || {}

    const storedReservations = getStorage(FLASH_SALE_RESERVATION_KEY)
    this.reservations = storedReservations || []

    const storedPurchases = getStorage(FLASH_SALE_PURCHASE_KEY)
    this.purchases = storedPurchases || []

    const storedReminders = getStorage(FLASH_SALE_REMINDER_KEY)
    this.sentReminders = storedReminders || []

    console.log('[FlashSaleManager] 初始化完成')
  }

  save() {
    setStorage(FLASH_SALE_STORAGE_KEY, this.sales)
    setStorage(FLASH_SALE_RESERVATION_KEY, this.reservations)
    setStorage(FLASH_SALE_PURCHASE_KEY, this.purchases)
    setStorage(FLASH_SALE_REMINDER_KEY, this.sentReminders)
  }

  _getSessionKey(activityId, schedule) {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    return `${activityId}_${today}_${schedule.hour}_${schedule.minute}`
  }

  getFlashSession(activity, app) {
    const now = new Date()
    const nowTime = now.getTime()
    const schedules = activity.flashSchedule || [{ hour: 20, minute: 0, durationMin: 30 }]

    let currentSession = null
    let nextSession = null
    let nearestSession = null
    let minDiffToNext = Infinity

    for (const schedule of schedules) {
      const sessionStart = new Date()
      sessionStart.setHours(schedule.hour, schedule.minute, 0, 0)
      const startTime = sessionStart.getTime()

      const duration = schedule.durationMin || 30
      const sessionEnd = new Date(startTime + duration * 60 * 1000)
      const endTime = sessionEnd.getTime()

      const reminderMinutesBefore = activity.reminderMinutesBefore || 5
      const reminderStart = startTime - reminderMinutesBefore * 60 * 1000

      let status = FLASH_SALE_STATUS.NOT_STARTED

      if (nowTime >= startTime && nowTime <= endTime) {
        status = FLASH_SALE_STATUS.ONGOING
        currentSession = {
          schedule,
          startTime,
          endTime,
          reminderStart,
          status,
          sessionKey: this._getSessionKey(activity.id, schedule),
          timeLabel: `${String(schedule.hour).padStart(2, '0')}:${String(schedule.minute).padStart(2, '0')}`
        }
      } else if (nowTime >= reminderStart && nowTime < startTime) {
        status = FLASH_SALE_STATUS.REMINDER_WINDOW
        if (nextSession === null || startTime < nextSession.startTime) {
          nextSession = {
            schedule,
            startTime,
            endTime,
            reminderStart,
            status,
            sessionKey: this._getSessionKey(activity.id, schedule),
            timeLabel: `${String(schedule.hour).padStart(2, '0')}:${String(schedule.minute).padStart(2, '0')}`,
            countdownToStart: this._formatCountdown(startTime - nowTime)
          }
        }
      } else if (nowTime < reminderStart) {
        const diff = startTime - nowTime
        if (diff < minDiffToNext) {
          minDiffToNext = diff
          nearestSession = {
            schedule,
            startTime,
            endTime,
            reminderStart,
            status: FLASH_SALE_STATUS.NOT_STARTED,
            sessionKey: this._getSessionKey(activity.id, schedule),
            timeLabel: `${String(schedule.hour).padStart(2, '0')}:${String(schedule.minute).padStart(2, '0')}`,
            countdownToStart: this._formatCountdown(startTime - nowTime)
          }
        }
      }
    }

    const effectiveNext = nextSession || nearestSession
    const displaySession = currentSession || effectiveNext

    return {
      current: currentSession,
      next: effectiveNext,
      display: displaySession,
      isActive: !!currentSession,
      isReminderWindow: !!nextSession && nextSession.status === FLASH_SALE_STATUS.REMINDER_WINDOW,
      overallStatus: currentSession ? FLASH_SALE_STATUS.ONGOING : (effectiveNext ? effectiveNext.status : FLASH_SALE_STATUS.ENDED)
    }
  }

  _formatCountdown(diffMs) {
    if (diffMs <= 0) return { hours: '00', minutes: '00', seconds: '00', totalSeconds: 0 }
    const totalSeconds = Math.floor(diffMs / 1000)
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return {
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
      totalSeconds
    }
  }

  getFlashGoodsList(activity, app) {
    const session = this.getFlashSession(activity, app)
    const sessionKey = session.display ? session.display.sessionKey : `default_${activity.id}`
    const goodsIds = activity.flashGoodsIds || []
    const override = activity.flashGoodsOverride || {}
    const goodsList = app.getGoodsList ? app.getGoodsList() : EXCHANGE_GOODS

    return goodsIds.map(goodsId => {
      const goods = goodsList.find(g => g.id === goodsId)
      if (!goods) return null

      const goodsOverride = override[goodsId] || {}
      const salePoints = goodsOverride.salePoints != null ? goodsOverride.salePoints : Math.round(goods.points * 0.5)
      const limitPerUser = goodsOverride.limitPerUser != null ? goodsOverride.limitPerUser : 1

      const realStock = this._getSessionStock(sessionKey, goodsId, goods.stock)
      const soldCount = this._getSessionSold(sessionKey, goodsId)
      const isSoldOut = realStock <= 0

      return {
        id: goodsId,
        name: goods.name,
        image: goods.image,
        description: goods.description,
        originalPoints: goods.points,
        salePoints,
        discount: Math.round(salePoints / goods.points * 100) / 10,
        stock: realStock,
        sold: soldCount,
        totalStock: goods.stock,
        limitPerUser,
        isSoldOut,
        progress: goods.stock > 0 ? Math.min(100, Math.round(soldCount / goods.stock * 100)) : 0,
        sessionKey
      }
    }).filter(Boolean)
  }

  _getSessionStock(sessionKey, goodsId, defaultStock) {
    const cacheKey = `${sessionKey}_${goodsId}`
    if (this.goodsStockCache[cacheKey] !== undefined) {
      return this.goodsStockCache[cacheKey]
    }
    if (this.sales[cacheKey] !== undefined) {
      return this.sales[cacheKey].remainingStock
    }
    this.goodsStockCache[cacheKey] = defaultStock
    return defaultStock
  }

  _getSessionSold(sessionKey, goodsId) {
    const cacheKey = `${sessionKey}_${goodsId}`
    if (this.sales[cacheKey] !== undefined) {
      return this.sales[cacheKey].soldCount || 0
    }
    return 0
  }

  _updateSessionStock(sessionKey, goodsId, delta, soldDelta, defaultStock) {
    const cacheKey = `${sessionKey}_${goodsId}`
    if (this.sales[cacheKey] === undefined) {
      this.sales[cacheKey] = {
        sessionKey,
        goodsId,
        remainingStock: defaultStock,
        soldCount: 0,
        createdAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      }
    }
    this.sales[cacheKey].remainingStock = Math.max(0, this.sales[cacheKey].remainingStock + delta)
    this.sales[cacheKey].soldCount = Math.max(0, this.sales[cacheKey].soldCount + soldDelta)
    this.goodsStockCache[cacheKey] = this.sales[cacheKey].remainingStock
    this.save()
    return this.sales[cacheKey]
  }

  makeReservation(activity, userId, app) {
    const session = this.getFlashSession(activity, app)
    if (!session.display) {
      return { success: false, message: '当前没有可预约的秒杀场次' }
    }

    const { sessionKey, timeLabel, startTime } = session.display
    const alreadyReserved = this.reservations.some(r =>
      r.activityId === activity.id &&
      r.sessionKey === sessionKey &&
      r.userId === userId
    )

    if (alreadyReserved) {
      return { success: false, message: '您已经预约过该场次了', alreadyReserved: true }
    }

    const reservation = {
      id: 'res_' + generateId(),
      activityId: activity.id,
      sessionKey,
      timeLabel,
      startTime,
      userId,
      goodsIds: activity.flashGoodsIds || [],
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      notified: false
    }

    this.reservations.push(reservation)
    this.save()

    console.log('[FlashSaleManager] 预约成功:', reservation.id, '场次:', timeLabel)
    return {
      success: true,
      reservation,
      message: `已成功预约 ${timeLabel} 场次，开抢前${activity.reminderMinutesBefore || 5}分钟将提醒您`
    }
  }

  cancelReservation(reservationId, userId) {
    const index = this.reservations.findIndex(r => r.id === reservationId && r.userId === userId)
    if (index === -1) return { success: false, message: '预约不存在' }
    this.reservations.splice(index, 1)
    this.save()
    return { success: true, message: '已取消预约' }
  }

  getUserReservations(userId, activityId = null) {
    let reservations = this.reservations.filter(r => r.userId === userId)
    if (activityId) {
      reservations = reservations.filter(r => r.activityId === activityId)
    }
    return reservations.sort((a, b) => b.startTime - a.startTime)
  }

  isReserved(activityId, sessionKey, userId) {
    return this.reservations.some(r =>
      r.activityId === activityId &&
      r.sessionKey === sessionKey &&
      r.userId === userId
    )
  }

  checkPendingReminders(userId, activity, messageManager, MESSAGE_TYPES) {
    const pendingReservations = this.reservations.filter(r =>
      r.userId === userId &&
      r.activityId === activity.id &&
      !r.notified
    )

    const now = Date.now()
    const fired = []

    for (const reservation of pendingReservations) {
      const reminderMinutesBefore = activity.reminderMinutesBefore || 5
      const reminderTime = reservation.startTime - reminderMinutesBefore * 60 * 1000
      const reminderKey = `${reservation.id}_reminder`

      if (now >= reminderTime && !this.sentReminders.includes(reminderKey)) {
        if (messageManager && MESSAGE_TYPES) {
          messageManager.addMessage({
            type: MESSAGE_TYPES.ACTIVITY,
            title: '⚡ 秒杀即将开始',
            content: `您预约的「${activity.title}」${reservation.timeLabel} 场将于 ${reminderMinutesBefore} 分钟后开始，请准时参与！`,
            emoji: '⏰',
            data: {
              activityId: activity.id,
              reservationId: reservation.id,
              link: `/pages/activity/activity?id=${activity.id}`
            }
          })
        }

        reservation.notified = true
        this.sentReminders.push(reminderKey)
        fired.push(reservation)
      }
    }

    if (fired.length > 0) {
      this.save()
    }

    return fired
  }

  purchaseFlashGoods(activity, goodsId, userId, app) {
    const session = this.getFlashSession(activity, app)

    if (!session.isActive || !session.current) {
      return { success: false, message: '当前不在秒杀时间段内' }
    }

    const { sessionKey, timeLabel } = session.current

    const goodsList = this.getFlashGoodsList(activity, app)
    const flashGoods = goodsList.find(g => g.id === goodsId)
    if (!flashGoods) {
      return { success: false, message: '商品不存在' }
    }

    if (flashGoods.isSoldOut) {
      return { success: false, message: '商品已抢光', soldOut: true }
    }

    const limitPerUser = flashGoods.limitPerUser
    const userPurchases = this.purchases.filter(p =>
      p.activityId === activity.id &&
      p.sessionKey === sessionKey &&
      p.goodsId === goodsId &&
      p.userId === userId
    )

    if (userPurchases.length >= limitPerUser) {
      return { success: false, message: `您已兑换过该商品，每款限兑${limitPerUser}件` }
    }

    const userInfo = app.globalData.userInfo
    if (!userInfo || (userInfo.points || 0) < flashGoods.salePoints) {
      return { success: false, message: '积分不足' }
    }

    const defaultStock = flashGoods.totalStock
    this._updateSessionStock(sessionKey, goodsId, -1, 1, defaultStock)

    const updatedStock = this._getSessionStock(sessionKey, goodsId, defaultStock)
    if (updatedStock < 0) {
      this._updateSessionStock(sessionKey, goodsId, 1, -1, defaultStock)
      return { success: false, message: '手慢了，商品已被抢光', soldOut: true }
    }

    const purchaseRecord = {
      id: 'pur_' + generateId(),
      activityId: activity.id,
      sessionKey,
      timeLabel,
      goodsId,
      goodsName: flashGoods.name,
      userId,
      salePoints: flashGoods.salePoints,
      originalPoints: flashGoods.originalPoints,
      savedPoints: flashGoods.originalPoints - flashGoods.salePoints,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      timestamp: Date.now()
    }
    this.purchases.push(purchaseRecord)

    app.updateUserPoints(-flashGoods.salePoints, {
      category: 'exchange',
      title: `秒杀兑换 ${flashGoods.name}`,
      desc: `${activity.title} - ${timeLabel}场`,
      emoji: '⚡'
    })

    app.updateGoodsStock(goodsId, -1, 1)

    this.save()

    console.log('[FlashSaleManager] 秒杀成功:', purchaseRecord.id, flashGoods.name)
    return {
      success: true,
      purchase: purchaseRecord,
      message: '恭喜，秒杀成功！',
      remainingStock: updatedStock
    }
  }

  getUserPurchaseStats(userId, activityId = null) {
    let purchases = this.purchases.filter(p => p.userId === userId)
    if (activityId) {
      purchases = purchases.filter(p => p.activityId === activityId)
    }

    const totalSaved = purchases.reduce((sum, p) => sum + (p.savedPoints || 0), 0)
    const totalCount = purchases.length
    const goodsBreakdown = {}

    purchases.forEach(p => {
      if (!goodsBreakdown[p.goodsId]) {
        goodsBreakdown[p.goodsId] = {
          goodsId: p.goodsId,
          goodsName: p.goodsName,
          count: 0,
          totalSaved: 0,
          totalSpent: 0
        }
      }
      goodsBreakdown[p.goodsId].count++
      goodsBreakdown[p.goodsId].totalSaved += p.savedPoints || 0
      goodsBreakdown[p.goodsId].totalSpent += p.salePoints || 0
    })

    return {
      totalCount,
      totalSaved,
      goodsBreakdown: Object.values(goodsBreakdown),
      purchases: purchases.slice(-30)
    }
  }

  getSessionSummary(activityId, sessionKey) {
    const sessionPurchases = this.purchases.filter(p =>
      p.activityId === activityId && p.sessionKey === sessionKey
    )
    const uniqueUsers = new Set(sessionPurchases.map(p => p.userId)).size

    return {
      activityId,
      sessionKey,
      totalPurchases: sessionPurchases.length,
      uniqueUsers,
      purchases: sessionPurchases.slice(-50)
    }
  }

  refreshGoodsStockFromApp(activity, app) {
    const goodsList = app.getGoodsList ? app.getGoodsList() : EXCHANGE_GOODS
    this.goodsStockCache = {}
    const session = this.getFlashSession(activity, app)
    if (session.display) {
      const goodsIds = activity.flashGoodsIds || []
      goodsIds.forEach(goodsId => {
        const goods = goodsList.find(g => g.id === goodsId)
        if (goods) {
          const cacheKey = `${session.display.sessionKey}_${goodsId}`
          if (this.sales[cacheKey] !== undefined) {
            this.sales[cacheKey].remainingStock = Math.min(this.sales[cacheKey].remainingStock, goods.stock)
          }
        }
      })
    }
    this.save()
    console.log('[FlashSaleManager] 商品库存已与 app.getGoodsList() 同步')
  }
}

const flashSaleManager = new FlashSaleManager()

module.exports = {
  FLASH_SALE_STATUS,
  flashSaleManager
}
