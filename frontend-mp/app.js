/**
 * 垃圾分类小程序 - 入口文件
 * @description 小程序全局逻辑
 */
const { generateId, formatDate } = require('./utils/util')
const {
  getUserLevel,
  ACHIEVEMENTS,
  getCurrentCity,
  setCurrentCity,
  getCityInfo,
  getTypeNameForCity,
  getTrashTypesForCity,
  hasUpcomingStandard,
  getUpcomingStandards,
  incrementWrongCount,
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  DAILY_TREASURE_BOX,
  MISSION_ACHIEVEMENTS,
  MISSION_CONFIG
} = require('./utils/constants')
const {
  MESSAGE_TYPES,
  messageManager
} = require('./utils/message')
const {
  activityManager,
  ACTIVITY_TYPES
} = require('./utils/activity')
const {
  flashSaleManager
} = require('./utils/flashsale')
const {
  correctionManager,
  CONTRIBUTOR_TIERS
} = require('./utils/correction')
const {
  calculateCO2e,
  CARBON_MILESTONES,
  getUnlockedMilestones
} = require('./utils/carbon')
const {
  LOTTERY_CONFIG,
  LOTTERY_PRIZES,
  LOTTERY_PRIZE_TYPES,
  LOTTERY_PRIZE_RARITY,
  BLINDBOX_CONFIG,
  FESTIVAL_TYPES,
  FESTIVAL_BLINDBOXES
} = require('./utils/constants')
const lotterySystem = require('./utils/lottery')

App({
  globalData: {
    userInfo: null,
    userRole: 'user',
    systemInfo: null,
    pointsRecords: null,
    expireCheckTimer: null,
    currentCity: 'shanghai',
    currentCityInfo: null,
    hasUpcomingStandard: false,
    activityManager: null,
    flashSaleManager: null,
    activePointsDoubles: [],
    recycleDispatchMode: 'simulate',
    recycleDispatchTimers: {},
    darkMode: false,
    darkModeSource: 'system',
    largeFont: false,
    carbonRecords: null,
    unlockedCarbonMilestones: null,
    lotterySystem: null,
    festivalBoxActive: null
  },

  /**
   * 小程序启动时触发
   */
  onLaunch(options = {}) {
    console.log('[App] 小程序启动')

    this.initCity()
    this.initUserInfo()
    this.initGoodsStock()
    this.initAddresses()
    this.initOrders()
    this.initPointsRecords()
    this.initClassifyRecords()
    this.initQuizRecords()
    this.initSignInRecords()
    this.initDailyQuizRecords()
    this.initWrongQuestions()
    this.initDailyPoints()
    this.initMasteredQuestions()
    this.initDailyCompletionBonus()
    this.initShareRecords()
    this.initInviteRecords()
    this.initDeviceId()
    this.initAchievements()
    this.initCommunityPosts()
    this.initCommunityComments()
    this.initCommunityReports()
    this.initCommunityDailyPoints()
    this.initSeasonData()
    this.initLeaderboardData()
    this.initPKRecords()
    this.initAntiCheatData()
    this.initGameRecords()
    this.initDailyGamePlays()
    this.initRecycleOrders()
    this.initLearningProgress()
    this.initCertificates()
    this.initVerifyLogs()
    this.checkAndExpirePoints()
    this.getSystemInfo()
    this.simulateAutoShipping()
    this.processInviterOnLaunch(options)
    this.initMessageSystem()
    this.initChildMode()
    this.initUserGroups()
    this.initGroupHomework()
    this.initActivitySystem()
    this.initCorrectionSystem()
    this.checkPushStrategies()
    this.initThemeMode()
    this.initLargeFontMode()
    this.initCarbonRecords()
    this.initCarbonMilestones()
    this.initMissionCenter()
    this.initLotterySystem()

    this.startExpireCheckInterval()
  },

  initCity() {
    const city = getCurrentCity()
    const cityInfo = getCityInfo(city)
    const hasUpcoming = hasUpcomingStandard(city)
    this.globalData.currentCity = city
    this.globalData.currentCityInfo = cityInfo
    this.globalData.hasUpcomingStandard = hasUpcoming
    console.log('[App] 城市已初始化:', cityInfo.name, '即将实施新标准:', hasUpcoming)
  },

  setCurrentCity(cityId) {
    const success = setCurrentCity(cityId)
    if (success) {
      const cityInfo = getCityInfo(cityId)
      const hasUpcoming = hasUpcomingStandard(cityId)
      this.globalData.currentCity = cityId
      this.globalData.currentCityInfo = cityInfo
      this.globalData.hasUpcomingStandard = hasUpcoming
      console.log('[App] 城市已切换为:', cityInfo.name)
    }
    return success
  },

  getCurrentCity() {
    return this.globalData.currentCity || getCurrentCity()
  },

  getCurrentCityInfo() {
    return this.globalData.currentCityInfo || getCityInfo(this.getCurrentCity())
  },

  getTypeNameForCity(typeId) {
    return getTypeNameForCity(typeId, this.getCurrentCity())
  },

  getTrashTypesForCity() {
    return getTrashTypesForCity(this.getCurrentCity())
  },

  getCityUpcomingStandards() {
    return getUpcomingStandards(this.getCurrentCity())
  },

  hasCityUpcomingStandard() {
    return this.globalData.hasUpcomingStandard || hasUpcomingStandard(this.getCurrentCity())
  },

  startExpireCheckInterval() {
    if (this.globalData.expireCheckTimer) {
      clearInterval(this.globalData.expireCheckTimer)
    }
    const timer = setInterval(() => {
      console.log('[App] 定时触发积分过期检查')
      this.checkAndExpirePoints()
    }, 30 * 60 * 1000)
    this.globalData.expireCheckTimer = timer
    console.log('[App] 积分过期定时任务已启动，每30分钟检查一次')
  },

  stopExpireCheckInterval() {
    if (this.globalData.expireCheckTimer) {
      clearInterval(this.globalData.expireCheckTimer)
      this.globalData.expireCheckTimer = null
      console.log('[App] 积分过期定时任务已停止')
    }
  },

  setUserRole(role) {
    this.globalData.userRole = role
    wx.setStorageSync('userRole', role)
    console.log('[App] 用户角色已设置为', role)
  },

  onShow() {
    console.log('[App] 小程序显示')
    this.checkAndExpirePoints()
    this.simulateAutoShipping()
    this.simulateRecycleProgress()
    this.refreshActivePointsDoubles()
    this.checkActivityEndAndReports()
    this.checkFlashSaleReminders()
    this.checkPushStrategies()
  },

  onHide() {
    console.log('[App] 小程序隐藏')
  },

  /**
   * 初始化用户信息
   */
  initUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      const levelInfo = getUserLevel(userInfo.points || 0)
      const oldLevel = userInfo.level
      userInfo.level = levelInfo.level
      if (!userInfo.powerups) {
        userInfo.powerups = { hint: 0, time: 0, combo: 0, shield: 0 }
      }
      this.globalData.userInfo = userInfo
      if (oldLevel !== levelInfo.level) {
        wx.setStorageSync('userInfo', userInfo)
      }
      console.log('[App] 用户信息已加载', userInfo)
    } else {
      const defaultPoints = 1280
      const levelInfo = getUserLevel(defaultPoints)
      const defaultUserInfo = {
        avatarUrl: '',
        nickName: '环保达人',
        points: defaultPoints,
        level: levelInfo.level,
        joinDate: this.formatDate(new Date()),
        powerups: { hint: 2, time: 2, combo: 1, shield: 1 }
      }
      this.globalData.userInfo = defaultUserInfo
      wx.setStorageSync('userInfo', defaultUserInfo)
      console.log('[App] 已创建默认用户信息')
    }
  },

  saveUserInfo() {
    if (this.globalData.userInfo) {
      wx.setStorageSync('userInfo', this.globalData.userInfo)
    }
  },

  getPowerups() {
    const userInfo = this.globalData.userInfo
    if (!userInfo) return { hint: 0, time: 0, combo: 0, shield: 0 }
    return userInfo.powerups || { hint: 0, time: 0, combo: 0, shield: 0 }
  },

  getPowerupCount(powerupId) {
    const powerups = this.getPowerups()
    return powerups[powerupId] || 0
  },

  buyPowerup(powerupId, quantity = 1) {
    const { GAME_POWERUPS } = require('./utils/constants')
    const powerup = GAME_POWERUPS.find(p => p.id === powerupId)
    if (!powerup) {
      return { success: false, message: '道具不存在' }
    }
    const totalCost = powerup.cost * quantity
    const userInfo = this.globalData.userInfo
    if (!userInfo) return { success: false, message: '用户未登录' }
    if ((userInfo.points || 0) < totalCost) {
      return { success: false, message: '积分不足' }
    }
    const currentCount = this.getPowerupCount(powerupId)
    const maxStack = powerup.maxStack || 99
    if (currentCount + quantity > maxStack) {
      return { success: false, message: `该道具最多持有${maxStack}个` }
    }
    this.updateUserPoints(-totalCost, {
      category: 'shop',
      title: `购买${powerup.name}x${quantity}`,
      emoji: powerup.emoji
    })
    if (!userInfo.powerups) {
      userInfo.powerups = { hint: 0, time: 0, combo: 0, shield: 0 }
    }
    userInfo.powerups[powerupId] = currentCount + quantity
    this.saveUserInfo()
    console.log('[App] 购买道具成功', powerupId, 'x', quantity, '花费', totalCost)
    return { success: true, count: userInfo.powerups[powerupId] }
  },

  usePowerup(powerupId) {
    const userInfo = this.globalData.userInfo
    if (!userInfo) return { success: false, message: '用户未登录' }
    if (!userInfo.powerups) {
      userInfo.powerups = { hint: 0, time: 0, combo: 0, shield: 0 }
    }
    const count = userInfo.powerups[powerupId] || 0
    if (count <= 0) {
      return { success: false, message: '道具数量不足' }
    }
    userInfo.powerups[powerupId] = count - 1
    this.saveUserInfo()
    console.log('[App] 使用道具', powerupId, '剩余', count - 1)
    return { success: true, remaining: count - 1 }
  },

  initGoodsStock() {
    const { EXCHANGE_GOODS } = require('./utils/constants')
    const storedStock = wx.getStorageSync('goodsStock')

    if (storedStock && storedStock.length > 0) {
      const goodsWithStock = EXCHANGE_GOODS.map(goods => {
        const stockInfo = storedStock.find(s => s.id === goods.id)
        if (stockInfo) {
          return { ...goods, stock: stockInfo.stock, sales: stockInfo.sales || goods.sales }
        }
        return goods
      })
      this.globalData.goodsList = goodsWithStock
      console.log('[App] 商品库存已从存储加载')
    } else {
      this.globalData.goodsList = [...EXCHANGE_GOODS]
      this.saveGoodsStock()
      console.log('[App] 商品库存已初始化')
    }
  },

  saveGoodsStock() {
    const stockData = this.globalData.goodsList.map(goods => ({
      id: goods.id,
      stock: goods.stock,
      sales: goods.sales
    }))
    wx.setStorageSync('goodsStock', stockData)
  },

  getGoodsList() {
    return this.globalData.goodsList || []
  },

  getGoodsById(goodsId) {
    return this.globalData.goodsList.find(g => g.id === goodsId)
  },

  updateGoodsStock(goodsId, stockDelta = -1, salesDelta = 1) {
    const goods = this.getGoodsById(goodsId)
    if (!goods) return false

    goods.stock = Math.max(0, goods.stock + stockDelta)
    goods.sales = Math.max(0, goods.sales + salesDelta)
    this.saveGoodsStock()
    return true
  },

  initAddresses() {
    const addresses = wx.getStorageSync('addresses')
    if (addresses && addresses.length > 0) {
      this.globalData.addresses = addresses
    } else {
      this.globalData.addresses = []
    }
    console.log('[App] 收货地址已加载', this.globalData.addresses.length, '条')
  },

  saveAddresses() {
    wx.setStorageSync('addresses', this.globalData.addresses)
  },

  getAddresses() {
    return this.globalData.addresses || []
  },

  getAddressById(addressId) {
    return this.globalData.addresses.find(a => a.id === addressId)
  },

  getDefaultAddress() {
    return this.globalData.addresses.find(a => a.isDefault) || this.globalData.addresses[0] || null
  },

  addAddress(address) {
    const newAddress = {
      ...address,
      id: generateId()
    }
    if (newAddress.isDefault) {
      this.globalData.addresses.forEach(a => { a.isDefault = false })
    }
    if (this.globalData.addresses.length === 0) {
      newAddress.isDefault = true
    }
    this.globalData.addresses.push(newAddress)
    this.saveAddresses()
    return newAddress
  },

  updateAddress(addressId, address) {
    const index = this.globalData.addresses.findIndex(a => a.id === addressId)
    if (index === -1) return false

    if (address.isDefault) {
      this.globalData.addresses.forEach(a => { a.isDefault = false })
    }

    this.globalData.addresses[index] = {
      ...this.globalData.addresses[index],
      ...address
    }
    this.saveAddresses()
    return true
  },

  deleteAddress(addressId) {
    const index = this.globalData.addresses.findIndex(a => a.id === addressId)
    if (index === -1) return false

    const wasDefault = this.globalData.addresses[index].isDefault
    this.globalData.addresses.splice(index, 1)

    if (wasDefault && this.globalData.addresses.length > 0) {
      this.globalData.addresses[0].isDefault = true
    }

    this.saveAddresses()
    return true
  },

  setDefaultAddress(addressId) {
    this.globalData.addresses.forEach(a => {
      a.isDefault = a.id === addressId
    })
    this.saveAddresses()
  },

  initOrders() {
    const orders = wx.getStorageSync('orders')
    this.globalData.orders = orders || []
    console.log('[App] 订单数据已加载', this.globalData.orders.length, '条')
  },

  addOrder(order) {
    const newOrder = {
      ...order,
      status: 'pending',
      statusText: '待发货'
    }
    this.globalData.orders.unshift(newOrder)
    wx.setStorageSync('orders', this.globalData.orders)
    console.log('[App] 新增订单', order.goodsName)
    return newOrder
  },

  getOrders() {
    return this.globalData.orders || []
  },

  getOrdersByStatus(status) {
    if (status === 'all') return this.getOrders()
    return this.globalData.orders.filter(o => o.status === status)
  },

  getOrderById(orderId) {
    return this.globalData.orders.find(o => o.id === orderId)
  },

  updateOrderStatus(orderId, status, extra = {}) {
    const order = this.getOrderById(orderId)
    if (!order) return false

    const statusMap = {
      'pending': '待发货',
      'shipped': '已发货',
      'completed': '已完成'
    }

    order.status = status
    order.statusText = statusMap[status] || status

    if (extra.logisticsNo) {
      order.logisticsNo = extra.logisticsNo
    }
    if (extra.logisticsCompany) {
      order.logisticsCompany = extra.logisticsCompany
    }
    if (status === 'shipped') {
      order.shipTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }
    if (status === 'completed') {
      order.completeTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }

    wx.setStorageSync('orders', this.globalData.orders)
    return true
  },

  simulateShipping(orderId) {
    const companies = ['顺丰速运', '中通快递', '圆通速递', '韵达快递', '京东物流']
    const company = companies[Math.floor(Math.random() * companies.length)]
    const logisticsNo = 'SF' + Date.now().toString().slice(-10) + Math.floor(Math.random() * 1000)

    this.updateOrderStatus(orderId, 'shipped', {
      logisticsCompany: company,
      logisticsNo: logisticsNo
    })

    const order = this.getOrderById(orderId)
    if (order && messageManager.getSubscriptionSetting('shipmentNotice')) {
      messageManager.addMessage({
        type: MESSAGE_TYPES.ORDER,
        title: '订单已发货',
        content: `您兑换的「${order.goodsName}」已通过${company}发货，物流单号：${logisticsNo}，预计3天内送达。`,
        emoji: '🚚',
        data: {
          orderId: orderId,
          goodsName: order.goodsName,
          logisticsCompany: company,
          logisticsNo: logisticsNo,
          link: '/pages/orders/orders'
        }
      })
    }

    return { company, logisticsNo }
  },

  simulateAutoShipping() {
    const pendingOrders = this.getOrdersByStatus('pending')
    if (pendingOrders.length === 0) return

    const now = Date.now()
    let shippedCount = 0

    pendingOrders.forEach(order => {
      const orderTime = new Date(order.createTime).getTime()
      const timeDiff = now - orderTime
      const hoursDiff = timeDiff / (1000 * 60 * 60)

      if (hoursDiff >= 2) {
        this.simulateShipping(order.id)
        shippedCount++
      }
    })

    if (shippedCount > 0) {
      console.log('[App] 自动模拟发货', shippedCount, '笔订单')
    }
  },

  checkAndExpirePoints() {
    const now = new Date()
    const nowStr = formatDate(now, 'YYYY-MM-DD')

    const records = this.getPointsRecords()
    let totalExpired = 0
    const expiredIds = []

    records.forEach(record => {
      if (record.type === 'earn' && !record.expired && record.expireAt) {
        if (record.expireAt < nowStr && (record.remainingPoints || 0) > 0) {
          record.expired = true
          record.expireTime = formatDate(now, 'YYYY-MM-DD HH:mm')
          expiredIds.push(record.id)
          totalExpired += record.remainingPoints || 0
          record.remainingPoints = 0
        }
      }
    })

    if (totalExpired > 0) {
      this.savePointsRecords()

      const userInfo = this.globalData.userInfo
      userInfo.points = Math.max(0, userInfo.points - totalExpired)
      const levelInfo = getUserLevel(userInfo.points)
      userInfo.level = levelInfo.level
      this.globalData.userInfo = userInfo
      wx.setStorageSync('userInfo', userInfo)

      const expireRecord = {
        id: generateId(),
        type: 'spend',
        category: 'expire',
        title: '积分过期',
        desc: expiredIds.length + '笔积分到期自动过期',
        emoji: '⏰',
        points: totalExpired,
        time: formatDate(now, 'YYYY-MM-DD HH:mm'),
        consumedRecordIds: expiredIds
      }
      this.addPointsRecord(expireRecord)

      if (messageManager && MESSAGE_TYPES.POINTS_EXPIRE) {
        messageManager.addMessage({
          type: MESSAGE_TYPES.POINTS_EXPIRE,
          title: '积分已过期',
          content: `您有 ${totalExpired} 积分已于今日到期自动清零。及时使用积分可避免损失哦~`,
          emoji: '⏰',
          data: {
            link: '/pages/points/points'
          }
        })
      }

      console.log('[App] 积分过期扣减', totalExpired, '分，共', expiredIds.length, '笔')
    }

    return totalExpired
  },

  getExpiringPoints() {
    const tiered = this.getExpiringPointsTiered()
    let nearestDate = ''
    if (tiered.within1Day.nearestDate) nearestDate = tiered.within1Day.nearestDate
    else if (tiered.within7Days.nearestDate) nearestDate = tiered.within7Days.nearestDate
    else if (tiered.within30Days.nearestDate) nearestDate = tiered.within30Days.nearestDate

    return {
      points: tiered.totalExpiringWithin30,
      expireDate: nearestDate || '—'
    }
  },

  getPointsValidityInfo() {
    const expiring = this.getExpiringPoints()
    const totalEarned = this.getPointsRecords()
      .filter(r => r.type === 'earn' && !r.expired)
      .reduce((sum, r) => sum + (r.remainingPoints != null ? r.remainingPoints : r.points), 0)

    return {
      totalValid: totalEarned,
      expiringPoints: expiring.points,
      nearestExpireDate: expiring.expireDate,
      validityPeriod: '自获取之日起1年内有效'
    }
  },

  initPointsRecords() {
    const now = new Date()
    const today = formatDate(now, 'YYYY-MM-DD')
    const yesterday = formatDate(new Date(now.getTime() - 86400000), 'YYYY-MM-DD')
    const twoDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 2), 'YYYY-MM-DD')
    const threeDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 3), 'YYYY-MM-DD')
    const tenDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 10), 'YYYY-MM-DD')
    const twentyDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 20), 'YYYY-MM-DD')
    const threeHundredDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 300), 'YYYY-MM-DD')
    const threeHundredFortyDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 340), 'YYYY-MM-DD')
    const threeHundredSixtyFourDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 364), 'YYYY-MM-DD')

    const makeEarnRecord = (r) => {
      const recordDate = r.time ? r.time.split(' ')[0] : today
      const expireAt = new Date(new Date(recordDate).getTime() + 365 * 24 * 60 * 60 * 1000)
      return {
        ...r,
        expireAt: formatDate(expireAt, 'YYYY-MM-DD'),
        remainingPoints: r.expired ? 0 : (r.remainingPoints != null ? r.remainingPoints : r.points),
        expired: r.expired || false,
        consumedRecordIds: r.consumedRecordIds || []
      }
    }

    const storedRecords = wx.getStorageSync('pointsRecords')
    if (storedRecords && storedRecords.length > 0) {
      const migrated = storedRecords.map(r => {
        if (r.type === 'earn') {
          return makeEarnRecord(r)
        }
        return { consumedRecordIds: r.consumedRecordIds || [], ...r }
      })
      this.globalData.pointsRecords = migrated
      wx.setStorageSync('pointsRecords', migrated)
    } else {
      this.globalData.pointsRecords = [
        makeEarnRecord({
          id: generateId(),
          type: 'earn',
          category: 'classify',
          title: '垃圾分类',
          desc: '正确分类塑料瓶',
          emoji: '♻️',
          points: 10,
          time: today + ' 14:30'
        }),
        {
          id: generateId(),
          type: 'spend',
          category: 'exchange',
          title: '积分兑换',
          desc: '兑换环保购物袋',
          emoji: '🛍️',
          points: 100,
          time: today + ' 10:15',
          consumedRecordIds: []
        },
        makeEarnRecord({
          id: generateId(),
          type: 'earn',
          category: 'signin',
          title: '每日签到',
          desc: '连续签到第15天',
          emoji: '📅',
          points: 20,
          time: today + ' 08:00'
        }),
        makeEarnRecord({
          id: generateId(),
          type: 'earn',
          category: 'classify',
          title: '垃圾分类',
          desc: '正确分类厨余垃圾',
          emoji: '🍂',
          points: 5,
          time: yesterday + ' 18:45'
        }),
        {
          id: generateId(),
          type: 'spend',
          category: 'exchange',
          title: '积分兑换',
          desc: '兑换便携餐具套装',
          emoji: '🍴',
          points: 200,
          time: yesterday + ' 14:20',
          consumedRecordIds: []
        },
        makeEarnRecord({
          id: generateId(),
          type: 'earn',
          category: 'quiz',
          title: '知识问答',
          desc: '答题正确5道',
          emoji: '❓',
          points: 50,
          time: twoDaysAgo + ' 20:30'
        }),
        makeEarnRecord({
          id: generateId(),
          type: 'earn',
          category: 'invite',
          title: '邀请好友',
          desc: '好友注册成功',
          emoji: '👥',
          points: 100,
          time: threeDaysAgo
        }),
        makeEarnRecord({
          id: generateId(),
          type: 'earn',
          category: 'quiz',
          title: '每日答题奖励',
          desc: '30天前获得',
          emoji: '📝',
          points: 30,
          time: tenDaysAgo + ' 09:00'
        }),
        makeEarnRecord({
          id: generateId(),
          type: 'earn',
          category: 'signin',
          title: '签到奖励',
          desc: '20天前获得，30天内过期',
          emoji: '📅',
          points: 80,
          time: twentyDaysAgo + ' 08:30'
        }),
        makeEarnRecord({
          id: generateId(),
          type: 'earn',
          category: 'classify',
          title: '垃圾分类奖励',
          desc: '65天内过期',
          emoji: '♻️',
          points: 120,
          time: threeHundredDaysAgo + ' 15:00'
        }),
        makeEarnRecord({
          id: generateId(),
          type: 'earn',
          category: 'quiz',
          title: '章节闯关奖励',
          desc: '25天内过期',
          emoji: '❓',
          points: 150,
          time: threeHundredFortyDaysAgo + ' 19:20'
        }),
        makeEarnRecord({
          id: generateId(),
          type: 'earn',
          category: 'invite',
          title: '邀请好友奖励',
          desc: '1天内过期示例',
          emoji: '👥',
          points: 50,
          time: threeHundredSixtyFourDaysAgo + ' 10:00'
        })
      ]
      wx.setStorageSync('pointsRecords', this.globalData.pointsRecords)
    }
    console.log('[App] 积分记录已加载', this.globalData.pointsRecords.length, '条')
  },

  savePointsRecords() {
    wx.setStorageSync('pointsRecords', this.globalData.pointsRecords)
  },

  addPointsRecord(record) {
    if (!record.memberId) {
      record.memberId = this.getUserId()
    }
    if (record.type === 'earn' && !record.expireAt) {
      const recordDate = record.time ? record.time.split(' ')[0] : formatDate(new Date(), 'YYYY-MM-DD')
      const expireAt = new Date(new Date(recordDate).getTime() + 365 * 24 * 60 * 60 * 1000)
      record.expireAt = formatDate(expireAt, 'YYYY-MM-DD')
      record.remainingPoints = record.points
      record.consumedRecordIds = []
      record.expired = false
    }
    if (record.type === 'spend' && !record.consumedRecordIds) {
      record.consumedRecordIds = []
    }
    this.globalData.pointsRecords.unshift(record)
    this.savePointsRecords()
    console.log('[App] 新增积分记录', record.title, 'memberId:', record.memberId, 'expireAt:', record.expireAt)
  },

  getPointsRecords(memberId) {
    const all = this.globalData.pointsRecords || []
    if (!memberId) return all
    const targetMemberId = memberId
    const isCurrentUser = targetMemberId === this.getUserId()
    if (isCurrentUser) {
      return all.filter(r => r.memberId === targetMemberId || r.memberId === undefined)
    }
    return all.filter(r => r.memberId === targetMemberId)
  },

  /**
   * 获取指定成员的总积分
   * @param {string} memberId - 可选，指定成员，不传则获取当前用户积分
   * @returns {number} 总积分
   */
  getUserPoints(memberId) {
    const targetMemberId = memberId || this.getUserId()
    if (targetMemberId === this.getUserId()) {
      return (this.globalData.userInfo && this.globalData.userInfo.points) || 0
    }
    const pool = wx.getStorageSync('userPointsPool') || {}
    const userPool = pool[targetMemberId]
    if (userPool) {
      return userPool.points || 0
    }
    const records = this.getPointsRecords(targetMemberId)
    let total = 0
    records.forEach(r => {
      if (r.type === 'earn') total += r.points || 0
      else total -= r.points || 0
    })
    return Math.max(0, total)
  },

  consumePointsFIFO(pointsToConsume, spendRecordId) {
    if (pointsToConsume <= 0) return { success: true, consumed: 0, breakdown: [] }

    const now = new Date()
    const nowStr = formatDate(now, 'YYYY-MM-DD')

    const earnRecords = this.globalData.pointsRecords
      .filter(r => r.type === 'earn' && !r.expired && (r.remainingPoints || 0) > 0)
      .sort((a, b) => {
        const aExp = new Date(a.expireAt || a.time).getTime()
        const bExp = new Date(b.expireAt || b.time).getTime()
        return aExp - bExp
      })

    let remaining = pointsToConsume
    const breakdown = []
    const consumedIds = []

    for (const rec of earnRecords) {
      if (remaining <= 0) break
      const available = Math.min(rec.remainingPoints || 0, remaining)
      if (available > 0) {
        rec.remainingPoints -= available
        remaining -= available
        consumedIds.push(rec.id)
        breakdown.push({
          recordId: rec.id,
          points: available,
          expireAt: rec.expireAt,
          title: rec.title
        })
      }
    }

    const actuallyConsumed = pointsToConsume - remaining
    if (spendRecordId && consumedIds.length > 0) {
      const spendRec = this.globalData.pointsRecords.find(r => r.id === spendRecordId)
      if (spendRec) {
        spendRec.consumedRecordIds = consumedIds
      }
    }

    this.savePointsRecords()
    return {
      success: remaining === 0,
      consumed: actuallyConsumed,
      breakdown,
      remainingToConsume: remaining
    }
  },

  getPointsExpiryPlan() {
    const nowStr = formatDate(new Date(), 'YYYY-MM-DD')
    const now = new Date()
    const earnRecords = this.globalData.pointsRecords
      .filter(r => r.type === 'earn' && !r.expired && (r.remainingPoints || 0) > 0)
      .map(r => ({
        id: r.id,
        points: r.remainingPoints || 0,
        expireAt: r.expireAt,
        title: r.title,
        emoji: r.emoji,
        time: r.time,
        daysLeft: Math.ceil((new Date(r.expireAt).getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
      }))
      .sort((a, b) => new Date(a.expireAt) - new Date(b.expireAt))

    const groups = {}
    earnRecords.forEach(r => {
      const key = r.expireAt
      if (!groups[key]) {
        groups[key] = {
          expireAt: key,
          totalPoints: 0,
          daysLeft: r.daysLeft,
          records: []
        }
      }
      groups[key].totalPoints += r.points
      groups[key].records.push(r)
    })

    const plan = Object.values(groups)
      .sort((a, b) => new Date(a.expireAt) - new Date(b.expireAt))
      .map(g => {
        const d = new Date(g.expireAt)
        return {
          ...g,
          month: d.getMonth() + 1,
          day: d.getDate()
        }
      })

    return plan
  },

  getExpiringPointsTiered() {
    const now = new Date()
    const nowStr = formatDate(now, 'YYYY-MM-DD')
    const tier1 = 1
    const tier7 = 7
    const tier30 = 30

    const result = {
      within1Day: { points: 0, nearestDate: '', records: [] },
      within7Days: { points: 0, nearestDate: '', records: [] },
      within30Days: { points: 0, nearestDate: '', records: [] },
      beyond30Days: { points: 0, nearestDate: '', records: [] },
      totalExpiringWithin30: 0
    }

    const earnRecords = this.globalData.pointsRecords
      .filter(r => r.type === 'earn' && !r.expired && (r.remainingPoints || 0) > 0)

    earnRecords.forEach(r => {
      const expDate = new Date(r.expireAt)
      const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
      const info = {
        id: r.id,
        points: r.remainingPoints || 0,
        expireAt: r.expireAt,
        daysLeft,
        title: r.title,
        emoji: r.emoji
      }

      if (daysLeft <= tier1) {
        result.within1Day.points += info.points
        result.within1Day.records.push(info)
        if (!result.within1Day.nearestDate || r.expireAt < result.within1Day.nearestDate) {
          result.within1Day.nearestDate = r.expireAt
        }
      } else if (daysLeft <= tier7) {
        result.within7Days.points += info.points
        result.within7Days.records.push(info)
        if (!result.within7Days.nearestDate || r.expireAt < result.within7Days.nearestDate) {
          result.within7Days.nearestDate = r.expireAt
        }
      } else if (daysLeft <= tier30) {
        result.within30Days.points += info.points
        result.within30Days.records.push(info)
        if (!result.within30Days.nearestDate || r.expireAt < result.within30Days.nearestDate) {
          result.within30Days.nearestDate = r.expireAt
        }
      } else {
        result.beyond30Days.points += info.points
        result.beyond30Days.records.push(info)
      }
    })

    result.totalExpiringWithin30 =
      result.within1Day.points + result.within7Days.points + result.within30Days.points

    return result
  },

  getNearestExpiringBadge() {
    const tiered = this.getExpiringPointsTiered()
    if (tiered.totalExpiringWithin30 <= 0) return null

    let nearest = null
    if (tiered.within1Day.points > 0) {
      nearest = tiered.within1Day
    } else if (tiered.within7Days.points > 0) {
      nearest = tiered.within7Days
    } else if (tiered.within30Days.points > 0) {
      nearest = tiered.within30Days
    }
    if (!nearest) return null

    const date = new Date(nearest.nearestDate)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return {
      points: nearest.points,
      month,
      day,
      dateLabel: `${month}月${day}日`,
      nearestDate: nearest.nearestDate
    }
  },

  /**
   * 初始化分类记录
   */
  initClassifyRecords() {
    const records = wx.getStorageSync('classifyRecords')
    if (records) {
      this.globalData.classifyRecords = records
    } else {
      const now = new Date()
      const today = formatDate(now, 'YYYY-MM-DD')
      const yesterday = formatDate(new Date(now.getTime() - 86400000), 'YYYY-MM-DD')

      this.globalData.classifyRecords = [
        {
          id: generateId(),
          trashName: '塑料瓶',
          typeId: 1,
          typeName: '可回收垃圾',
          emoji: '🧴',
          bgColor: 'rgba(74, 144, 217, 0.1)',
          points: 10,
          time: today + ' 14:30'
        },
        {
          id: generateId(),
          trashName: '剩菜剩饭',
          typeId: 3,
          typeName: '厨余垃圾',
          emoji: '🍚',
          bgColor: 'rgba(91, 189, 114, 0.1)',
          points: 5,
          time: today + ' 12:15'
        },
        {
          id: generateId(),
          trashName: '废电池',
          typeId: 2,
          typeName: '有害垃圾',
          emoji: '🔋',
          bgColor: 'rgba(232, 93, 93, 0.1)',
          points: 20,
          time: today + ' 09:45'
        },
        {
          id: generateId(),
          trashName: '旧报纸',
          typeId: 1,
          typeName: '可回收垃圾',
          emoji: '📰',
          bgColor: 'rgba(74, 144, 217, 0.1)',
          points: 15,
          time: yesterday + ' 18:20'
        },
        {
          id: generateId(),
          trashName: '果皮',
          typeId: 3,
          typeName: '厨余垃圾',
          emoji: '🍎',
          bgColor: 'rgba(91, 189, 114, 0.1)',
          points: 5,
          time: yesterday + ' 15:30'
        },
        {
          id: generateId(),
          trashName: '卫生纸',
          typeId: 4,
          typeName: '其他垃圾',
          emoji: '🧻',
          bgColor: 'rgba(142, 142, 147, 0.1)',
          points: 3,
          time: yesterday + ' 10:00'
        }
      ]
      wx.setStorageSync('classifyRecords', this.globalData.classifyRecords)
    }
    console.log('[App] 分类记录已加载', this.globalData.classifyRecords.length, '条')
  },

  addClassifyRecord(record) {
    record.source = record.source || 'manual'
    if (!record.memberId) {
      record.memberId = this.getUserId()
    }
    this.globalData.classifyRecords.unshift(record)
    wx.setStorageSync('classifyRecords', this.globalData.classifyRecords)
    console.log('[App] 新增分类记录', record.trashName, 'memberId:', record.memberId, 'source:', record.source)
    const isCurrentUser = !record.memberId || record.memberId === this.getUserId()
    if (isCurrentUser && this.globalData.missionCenter) {
      this.incrementClassifyForMission()
    }
  },

  getClassifyRecords(memberId) {
    const all = this.globalData.classifyRecords || []
    if (!memberId) return all
    const targetMemberId = memberId
    const isCurrentUser = targetMemberId === this.getUserId()
    if (isCurrentUser) {
      return all.filter(r => r.memberId === targetMemberId || r.memberId === undefined)
    }
    return all.filter(r => r.memberId === targetMemberId)
  },

  /**
   * 初始化答题记录
   */
  initQuizRecords() {
    const records = wx.getStorageSync('quizRecords')
    if (records) {
      this.globalData.quizRecords = records
    } else {
      const now = new Date()
      const twoDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 2), 'YYYY-MM-DD')

      this.globalData.quizRecords = [
        {
          id: generateId(),
          quizType: 'chapter',
          chapterName: '综合知识',
          totalQuestions: 5,
          correctCount: 5,
          wrongCount: 0,
          accuracy: 100,
          points: 50,
          memberId: this.getUserId(),
          time: twoDaysAgo + ' 20:30'
        }
      ]
      wx.setStorageSync('quizRecords', this.globalData.quizRecords)
    }
    console.log('[App] 答题记录已加载', this.globalData.quizRecords.length, '条')
  },

  addQuizRecord(record) {
    if (!record.memberId) {
      record.memberId = this.getUserId()
    }
    this.globalData.quizRecords.unshift(record)
    wx.setStorageSync('quizRecords', this.globalData.quizRecords)
    console.log('[App] 新增答题记录', record.points + '分', 'memberId:', record.memberId)
    const isCurrentUser = !record.memberId || record.memberId === this.getUserId()
    if (isCurrentUser && this.globalData.missionCenter && record.correctCount > 0) {
      this.incrementQuizCorrectForMission(record.correctCount)
    }
  },

  getQuizRecords(memberId) {
    const all = this.globalData.quizRecords || []
    if (!memberId) return all
    const targetMemberId = memberId
    const isCurrentUser = targetMemberId === this.getUserId()
    if (isCurrentUser) {
      return all.filter(r => r.memberId === targetMemberId || r.memberId === undefined)
    }
    return all.filter(r => r.memberId === targetMemberId)
  },

  /**
   * 初始化签到记录
   */
  initSignInRecords() {
    const records = wx.getStorageSync('signInRecords')
    if (records) {
      this.globalData.signInRecords = records
    } else {
      const now = new Date()
      const records = []
      for (let i = 0; i < 15; i++) {
        const date = new Date(now.getTime() - 86400000 * i)
        records.push(formatDate(date, 'YYYY-MM-DD'))
      }
      records.reverse()
      this.globalData.signInRecords = records
      wx.setStorageSync('signInRecords', records)
    }
    console.log('[App] 签到记录已加载', this.globalData.signInRecords.length, '条')
  },

  addSignInRecord(dateStr, memberId) {
    const records = this.globalData.signInRecords || []
    const ownerId = memberId || this.getUserId()
    const isCurrentUser = ownerId === this.getUserId()

    const alreadySigned = records.some(r => {
      const d = typeof r === 'string' ? r : r.date
      const o = typeof r === 'string' ? null : r.memberId
      if (isCurrentUser) {
        return d === dateStr && (o === ownerId || o === null || o === undefined)
      }
      return d === dateStr && o === ownerId
    })

    if (!alreadySigned) {
      records.push({
        date: dateStr,
        memberId: ownerId
      })
      this.globalData.signInRecords = records
      wx.setStorageSync('signInRecords', records)
      console.log('[App] 新增签到记录', dateStr, 'memberId:', ownerId)
    }
  },

  getSignInRecords(memberId) {
    const all = this.globalData.signInRecords || []
    const normalized = all.map(r => {
      if (typeof r === 'string') {
        return { date: r, memberId: this.getUserId() }
      }
      return r
    })
    if (!memberId) return normalized.map(r => r.date)
    const targetMemberId = memberId
    const isCurrentUser = targetMemberId === this.getUserId()
    let filtered
    if (isCurrentUser) {
      filtered = normalized.filter(r => r.memberId === targetMemberId || r.memberId === undefined)
    } else {
      filtered = normalized.filter(r => r.memberId === targetMemberId)
    }
    return filtered.map(r => r.date)
  },

  /**
   * 初始化每日一练完成记录（独立于签到记录）
   */
  initDailyQuizRecords() {
    const records = wx.getStorageSync('dailyQuizRecords')
    if (records) {
      this.globalData.dailyQuizRecords = records
    } else {
      this.globalData.dailyQuizRecords = []
      wx.setStorageSync('dailyQuizRecords', [])
    }
    console.log('[App] 每日一练记录已加载', this.globalData.dailyQuizRecords.length, '条')
  },

  /**
   * 添加每日一练完成记录
   * @param {string} dateStr 日期字符串 YYYY-MM-DD
   * @param {string} memberId 可选，指定成员，默认当前用户
   */
  addDailyQuizRecord(dateStr, memberId) {
    const ownerId = memberId || this.getUserId()
    const isCurrentUser = ownerId === this.getUserId()
    const records = this.globalData.dailyQuizRecords || []
    const alreadyExists = records.some(r => {
      const d = typeof r === 'string' ? r : r.date
      const o = typeof r === 'string' ? null : r.memberId
      if (isCurrentUser) {
        return d === dateStr && (o === ownerId || o === null || o === undefined)
      }
      return d === dateStr && o === ownerId
    })
    if (!alreadyExists) {
      records.push({
        date: dateStr,
        memberId: ownerId
      })
      this.globalData.dailyQuizRecords = records
      wx.setStorageSync('dailyQuizRecords', records)
      console.log('[App] 新增每日一练记录', dateStr, 'memberId:', ownerId)
    }
  },

  /**
   * 获取每日一练完成记录
   * @param {string} memberId 可选，指定成员，不传则返回全部（兼容旧格式）
   * @returns {Array} 日期数组
   */
  getDailyQuizRecords(memberId) {
    const all = this.globalData.dailyQuizRecords || []
    const normalized = all.map(r => {
      if (typeof r === 'string') {
        return { date: r, memberId: this.getUserId() }
      }
      return r
    })
    if (!memberId) return normalized.map(r => r.date)
    const targetMemberId = memberId
    const isCurrentUser = targetMemberId === this.getUserId()
    let filtered
    if (isCurrentUser) {
      filtered = normalized.filter(r => r.memberId === targetMemberId || r.memberId === undefined)
    } else {
      filtered = normalized.filter(r => r.memberId === targetMemberId)
    }
    return filtered.map(r => r.date)
  },

  initWrongQuestions() {
    const wrongQuestions = wx.getStorageSync('wrongQuestions')
    this.globalData.wrongQuestions = wrongQuestions || []
    console.log('[App] 错题数据已加载', this.globalData.wrongQuestions.length, '条')
  },

  addWrongQuestion(question) {
    const targetMemberId = question.memberId || this.getUserId()
    const isCurrentUser = targetMemberId === this.getUserId()
    const allWrongQuestions = this.globalData.wrongQuestions || []

    let memberWrongList
    let otherMemberList
    if (isCurrentUser) {
      memberWrongList = allWrongQuestions.filter(q => (q.memberId === targetMemberId || !q.memberId))
      otherMemberList = allWrongQuestions.filter(q => !(q.memberId === targetMemberId || !q.memberId))
    } else {
      memberWrongList = allWrongQuestions.filter(q => q.memberId === targetMemberId)
      otherMemberList = allWrongQuestions.filter(q => !(q.memberId === targetMemberId))
    }

    const updatedMemberList = incrementWrongCount(memberWrongList, question, targetMemberId)
    this.globalData.wrongQuestions = [...otherMemberList, ...updatedMemberList]
    wx.setStorageSync('wrongQuestions', this.globalData.wrongQuestions)

    const foundWrong = this.globalData.wrongQuestions.find(q =>
      q.id === question.id && (isCurrentUser
        ? (q.memberId === targetMemberId || !q.memberId)
        : q.memberId === targetMemberId)
    )
    console.log('[App] 错题已更新（统一逻辑）', question.question, '错误次数:', foundWrong ? foundWrong.wrongCount : 1, 'memberId:', targetMemberId)
  },

  removeWrongQuestion(questionId, memberId) {
    const targetMemberId = memberId || this.getUserId()
    const isCurrentUser = targetMemberId === this.getUserId()
    let wrongQuestions = this.globalData.wrongQuestions || []
    if (isCurrentUser) {
      wrongQuestions = wrongQuestions.filter(q => !(q.id === questionId && (q.memberId === targetMemberId || !q.memberId)))
    } else {
      wrongQuestions = wrongQuestions.filter(q => !(q.id === questionId && q.memberId === targetMemberId))
    }
    this.globalData.wrongQuestions = wrongQuestions
    wx.setStorageSync('wrongQuestions', wrongQuestions)
    console.log('[App] 错题已移除', questionId, 'memberId:', targetMemberId)
  },

  getWrongQuestions(memberId) {
    const all = this.globalData.wrongQuestions || []
    if (!memberId) return all
    const targetMemberId = memberId
    const isCurrentUser = targetMemberId === this.getUserId()
    if (isCurrentUser) {
      return all.filter(q => q.memberId === targetMemberId || q.memberId === undefined)
    }
    return all.filter(q => q.memberId === targetMemberId)
  },

  clearWrongQuestions() {
    this.globalData.wrongQuestions = []
    wx.setStorageSync('wrongQuestions', [])
    console.log('[App] 错题本已清空')
  },

  initDailyPoints() {
    const { QUIZ_POINTS_CONFIG } = require('./utils/constants')
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const stored = wx.getStorageSync('dailyPoints')

    if (stored && stored.date === today) {
      this.globalData.dailyPoints = stored
    } else {
      const modeLimits = QUIZ_POINTS_CONFIG.dailyModeLimits
      const pointsByMode = {}
      Object.keys(modeLimits).forEach(mode => {
        pointsByMode[mode] = 0
      })
      this.globalData.dailyPoints = {
        date: today,
        pointsByMode
      }
      wx.setStorageSync('dailyPoints', this.globalData.dailyPoints)
    }
    console.log('[App] 每日积分统计已加载', this.globalData.dailyPoints)
  },

  getDailyPointsByMode(mode) {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const dailyPoints = this.globalData.dailyPoints

    if (!dailyPoints || dailyPoints.date !== today) {
      this.initDailyPoints()
    }

    return this.globalData.dailyPoints.pointsByMode[mode] || 0
  },

  addDailyPoints(mode, points) {
    const { QUIZ_POINTS_CONFIG } = require('./utils/constants')
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const dailyPoints = this.globalData.dailyPoints

    if (!dailyPoints || dailyPoints.date !== today) {
      this.initDailyPoints()
    }

    const currentPoints = this.globalData.dailyPoints.pointsByMode[mode] || 0
    const maxPoints = QUIZ_POINTS_CONFIG.dailyModeLimits[mode] || Infinity

    const actualPoints = Math.min(points, Math.max(0, maxPoints - currentPoints))

    if (actualPoints > 0) {
      this.globalData.dailyPoints.pointsByMode[mode] = currentPoints + actualPoints
      wx.setStorageSync('dailyPoints', this.globalData.dailyPoints)
      console.log(`[App] 每日积分已更新 [${mode}]: +${actualPoints}分, 总计 ${this.globalData.dailyPoints.pointsByMode[mode]}分`)
    }

    return actualPoints
  },

  isDailyLimitReached(mode) {
    const { QUIZ_POINTS_CONFIG } = require('./utils/constants')
    const currentPoints = this.getDailyPointsByMode(mode)
    const maxPoints = QUIZ_POINTS_CONFIG.dailyModeLimits[mode] || Infinity
    return currentPoints >= maxPoints
  },

  getRemainingDailyPoints(mode) {
    const { QUIZ_POINTS_CONFIG } = require('./utils/constants')
    const currentPoints = this.getDailyPointsByMode(mode)
    const maxPoints = QUIZ_POINTS_CONFIG.dailyModeLimits[mode] || Infinity
    return Math.max(0, maxPoints - currentPoints)
  },

  initMasteredQuestions() {
    const mastered = wx.getStorageSync('masteredQuestions')
    this.globalData.masteredQuestions = mastered || []
    console.log('[App] 已掌握题目已加载', this.globalData.masteredQuestions.length, '道')
  },

  isQuestionMastered(questionId) {
    const mastered = this.globalData.masteredQuestions || []
    return mastered.includes(questionId)
  },

  markQuestionMastered(questionId) {
    let mastered = this.globalData.masteredQuestions || []
    if (!mastered.includes(questionId)) {
      mastered.push(questionId)
      this.globalData.masteredQuestions = mastered
      wx.setStorageSync('masteredQuestions', mastered)
      console.log('[App] 题目已标记为掌握', questionId)
    }
  },

  getMasteredQuestions() {
    return this.globalData.masteredQuestions || []
  },

  initDailyCompletionBonus() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const stored = wx.getStorageSync('dailyCompletionBonus')

    if (stored && stored.date === today) {
      this.globalData.dailyCompletionBonus = stored
    } else {
      this.globalData.dailyCompletionBonus = {
        date: today,
        claimed: false
      }
      wx.setStorageSync('dailyCompletionBonus', this.globalData.dailyCompletionBonus)
    }
    console.log('[App] 每日完成奖励状态已加载', this.globalData.dailyCompletionBonus.claimed ? '已领取' : '未领取')
  },

  isDailyCompletionBonusClaimed() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const bonus = this.globalData.dailyCompletionBonus

    if (!bonus || bonus.date !== today) {
      this.initDailyCompletionBonus()
    }

    return this.globalData.dailyCompletionBonus.claimed
  },

  markDailyCompletionBonusClaimed() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    this.globalData.dailyCompletionBonus = {
      date: today,
      claimed: true
    }
    wx.setStorageSync('dailyCompletionBonus', this.globalData.dailyCompletionBonus)
    console.log('[App] 每日完成奖励已标记为已领取')
  },

  /**
   * 检查今日是否已完成每日一练
   * @returns {boolean} 是否已完成
   */
  isTodayDailyQuizDone() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const records = this.getDailyQuizRecords()
    return records.includes(today)
  },

  /**
   * 检查今日是否已签到
   * @returns {boolean} 是否已签到
   */
  isTodaySignedIn(memberId) {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const records = this.getSignInRecords(memberId)
    return records.includes(today)
  },

  /**
   * 获取连续打卡天数（统一逻辑：签到 + 每日一练合并计算）
   * 一天内任意完成签到或答题都算当天打卡
   * @param {string} memberId - 可选，指定成员（不传则用当前用户）
   * @returns {number} 连续天数
   */
  getStreakDays(memberId) {
    const signInRecords = this.getSignInRecords(memberId)
    const dailyQuizRecords = this.getDailyQuizRecords(memberId)
    const mergedRecords = Array.from(new Set([...signInRecords, ...dailyQuizRecords]))
    return this.calculateContinuousDays(mergedRecords)
  },

  /**
   * 执行签到
   * @param {string} memberId - 可选，指定签到成员，默认当前用户
   * @returns {Object} { success, points, bonus, streakDays, alreadySigned }
   */
  doSignIn(memberId) {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const ownerId = memberId || this.getUserId()

    if (this.isTodaySignedIn(ownerId)) {
      return {
        success: false,
        alreadySigned: true,
        points: 0,
        bonus: 0,
        streakDays: this.getStreakDays(ownerId)
      }
    }

    this.addSignInRecord(today, ownerId)

    const basePoints = 5
    this.updateUserPoints(basePoints, {
      category: 'signin',
      title: '每日签到',
      desc: '每日签到奖励',
      emoji: '📅'
    })

    const streakDays = this.getStreakDays(ownerId)
    let bonus = 0

    if (streakDays > 0 && streakDays % 7 === 0) {
      bonus = 50
      this.updateUserPoints(bonus, {
        category: 'signin',
        title: '连续签到奖励',
        desc: `连续签到${streakDays}天`,
        emoji: '🎁'
      })
    }

    return {
      success: true,
      alreadySigned: false,
      points: basePoints,
      bonus,
      streakDays
    }
  },

  /**
   * 获取统计数据
   * @returns {Object} 统计数据对象
   */
  getStatistics() {
    const classifyRecords = this.getClassifyRecords()
    const pointsRecords = this.getPointsRecords()
    const signInRecords = this.getSignInRecords()
    const dailyQuizRecords = this.getDailyQuizRecords()

    const classifyCount = classifyRecords.length

    const totalEarnedPoints = pointsRecords
      .filter(item => item.type === 'earn')
      .reduce((sum, item) => sum + item.points, 0)

    const mergedRecords = Array.from(new Set([...signInRecords, ...dailyQuizRecords]))
    const continuousDays = this.calculateContinuousDays(mergedRecords)

    return {
      classifyCount,
      totalEarnedPoints,
      continuousDays
    }
  },

  /**
   * 计算连续打卡天数
   * @param {Array} signInRecords 签到日期数组
   * @returns {number} 连续天数
   */
  calculateContinuousDays(signInRecords) {
    if (!signInRecords || signInRecords.length === 0) return 0

    const sortedRecords = [...signInRecords].sort((a, b) => new Date(b) - new Date(a))
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const yesterday = formatDate(new Date(Date.now() - 86400000), 'YYYY-MM-DD')

    let lastDate = sortedRecords[0]
    if (lastDate !== today && lastDate !== yesterday) {
      return 0
    }

    let continuousDays = 1
    for (let i = 1; i < sortedRecords.length; i++) {
      const prevDate = new Date(sortedRecords[i - 1])
      const currDate = new Date(sortedRecords[i])
      const diffDays = Math.round((prevDate - currDate) / 86400000)

      if (diffDays === 1) {
        continuousDays++
      } else {
        break
      }
    }

    return continuousDays
  },

  /**
   * 获取分类统计
   * @returns {Array} 各分类统计数组
   */
  getCategoryStats() {
    const { TRASH_TYPES } = require('./utils/constants')
    const classifyRecords = this.getClassifyRecords()

    const categoryCountMap = {}
    classifyRecords.forEach(record => {
      const typeId = record.typeId
      categoryCountMap[typeId] = (categoryCountMap[typeId] || 0) + 1
    })

    return TRASH_TYPES.map(type => ({
      id: type.id,
      name: type.name.replace('垃圾', ''),
      emoji: type.emoji,
      color: type.color,
      count: categoryCountMap[type.id] || 0
    }))
  },

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync()
      this.globalData.systemInfo = systemInfo
      this.globalData.statusBarHeight = systemInfo.statusBarHeight
      this.globalData.screenHeight = systemInfo.screenHeight
      this.globalData.screenWidth = systemInfo.screenWidth
      console.log('[App] 系统信息获取成功', systemInfo)
    } catch (e) {
      console.error('[App] 获取系统信息失败', e)
    }
  },

  initThemeMode() {
    const themeSetting = wx.getStorageSync('themeSetting') || 'system'
    this.globalData.darkModeSource = themeSetting

    if (themeSetting === 'system') {
      try {
        const systemInfo = wx.getSystemInfoSync()
        this.globalData.darkMode = systemInfo.theme === 'dark'
      } catch (e) {
        this.globalData.darkMode = false
      }
      if (wx.onThemeChange) {
        wx.onThemeChange((result) => {
          if (this.globalData.darkModeSource === 'system') {
            this.globalData.darkMode = result.theme === 'dark'
            this.notifyPagesThemeChange()
          }
        })
      }
    } else {
      this.globalData.darkMode = themeSetting === 'dark'
    }
    console.log('[App] 主题模式已初始化', this.globalData.darkMode ? '深色' : '浅色', '来源:', this.globalData.darkModeSource)
  },

  isDarkMode() {
    return this.globalData.darkMode || false
  },

  getThemeSetting() {
    return this.globalData.darkModeSource || 'system'
  },

  setThemeSetting(setting) {
    this.globalData.darkModeSource = setting
    wx.setStorageSync('themeSetting', setting)

    if (setting === 'system') {
      try {
        const systemInfo = wx.getSystemInfoSync()
        this.globalData.darkMode = systemInfo.theme === 'dark'
      } catch (e) {
        this.globalData.darkMode = false
      }
    } else {
      this.globalData.darkMode = setting === 'dark'
    }
    this.notifyPagesThemeChange()
    console.log('[App] 主题设置已更新', setting, '当前:', this.globalData.darkMode ? '深色' : '浅色')
  },

  notifyPagesThemeChange() {
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page && page.onThemeChange) {
        page.onThemeChange(this.globalData.darkMode)
      }
    })
  },

  initLargeFontMode() {
    const largeFont = wx.getStorageSync('largeFontEnabled') || false
    this.globalData.largeFont = largeFont
    console.log('[App] 大字号模式已初始化', largeFont ? '开启' : '关闭')
  },

  isLargeFont() {
    return this.globalData.largeFont || false
  },

  setLargeFont(enabled) {
    this.globalData.largeFont = enabled
    wx.setStorageSync('largeFontEnabled', enabled)
    this.notifyPagesFontChange()
    console.log('[App] 大字号模式已更新', enabled ? '开启' : '关闭')
  },

  notifyPagesFontChange() {
    const pages = getCurrentPages()
    pages.forEach(page => {
      if (page && page.onFontChange) {
        page.onFontChange(this.globalData.largeFont)
      }
    })
  },

  getExperienceClasses() {
    const classes = []
    if (this.globalData.darkMode) classes.push('dark-mode')
    if (this.globalData.largeFont) classes.push('large-font')
    return classes.join(' ')
  },

  /**
   * 格式化日期
   * @param {Date} date 日期对象
   * @returns {string} 格式化后的日期字符串
   */
  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  /**
   * 更新用户积分并同时添加积分明细记录，同步更新用户等级
   * @param {number} points 积分变化值（正数增加，负数减少）
   * @param {Object} recordInfo 积分记录信息 { title, desc, emoji, category }
   */
  addPoints(points, category = 'other') {
    const { QUIZ_POINTS_CONFIG } = require('./utils/constants')
    const categoryMap = {
      'drop_point_checkin': { mode: 'daily', title: '投放打卡', desc: '投放点正确打卡', emoji: '✓' },
      'classify': { mode: 'daily', title: '垃圾分类', desc: '正确分类垃圾', emoji: '♻️' }
    }

    const config = categoryMap[category] || { mode: 'daily', title: '积分获取', desc: '获取积分', emoji: '💰' }
    const mode = config.mode || 'daily'

    let actualPoints = points
    if (QUIZ_POINTS_CONFIG && QUIZ_POINTS_CONFIG.dailyModeLimits) {
      actualPoints = this.addDailyPoints(mode, points)
    }

    if (actualPoints > 0) {
      this.updateUserPoints(actualPoints, {
        category,
        title: config.title,
        desc: config.desc,
        emoji: config.emoji
      })
    }

    return {
      success: actualPoints > 0,
      points: actualPoints
    }
  },

  updateUserPoints(points, recordInfo = null, memberId) {
    const targetMemberId = memberId || this.getUserId()
    const isCurrentUser = targetMemberId === this.getUserId()
    let finalPoints = points
    let multiplierInfo = { isDoubled: false, multiplier: 1, bonusPoints: 0, appliedActivities: [] }

    if (points > 0 && recordInfo && recordInfo.category) {
      multiplierInfo = this.applyPointsMultiplier(points, recordInfo.category)
      finalPoints = multiplierInfo.points

      if (multiplierInfo.isDoubled && recordInfo) {
        const activityTitles = multiplierInfo.appliedActivities.map(a => a.activityTitle).join('、')
        recordInfo.desc = (recordInfo.desc ? recordInfo.desc + '；' : '') +
          `${activityTitles}x${multiplierInfo.multiplier}，基础${points}分，额外+${multiplierInfo.bonusPoints}分`
        recordInfo.bonusPoints = multiplierInfo.bonusPoints
        recordInfo.appliedActivities = multiplierInfo.appliedActivities
        recordInfo.originalPoints = points
      }
    }

    if (isCurrentUser) {
      const userInfo = this.globalData.userInfo
      userInfo.points = Math.max(0, userInfo.points + finalPoints)
      const levelInfo = getUserLevel(userInfo.points)
      userInfo.level = levelInfo.level
      this.globalData.userInfo = userInfo
      wx.setStorageSync('userInfo', userInfo)
      console.log('[App] 用户积分已更新', userInfo.points, '等级:', userInfo.level,
        multiplierInfo.isDoubled ? `(双倍x${multiplierInfo.multiplier})` : '', 'memberId:', targetMemberId)
    } else {
      const pool = wx.getStorageSync('userPointsPool') || {}
      const userPool = pool[targetMemberId] || {
        userId: targetMemberId,
        nickName: '成员' + targetMemberId.slice(-4),
        points: 0,
        records: []
      }
      userPool.points = Math.max(0, userPool.points + finalPoints)
      pool[targetMemberId] = userPool
      wx.setStorageSync('userPointsPool', pool)
      console.log('[App] 成员积分已更新', targetMemberId, '总积分:', userPool.points,
        multiplierInfo.isDoubled ? `(双倍x${multiplierInfo.multiplier})` : '')
    }

    if (recordInfo) {
      const now = new Date()
      const timeStr = formatDate(now, 'YYYY-MM-DD HH:mm')
      const record = {
        id: generateId(),
        memberId: targetMemberId,
        type: finalPoints >= 0 ? 'earn' : 'spend',
        category: recordInfo.category || 'other',
        title: recordInfo.title || (finalPoints >= 0 ? '积分获取' : '积分消费'),
        desc: recordInfo.desc || '',
        emoji: recordInfo.emoji || (finalPoints >= 0 ? '💰' : '💸'),
        points: Math.abs(finalPoints),
        time: timeStr
      }
      this.addPointsRecord(record)

      if (finalPoints < 0 && isCurrentUser) {
        this.consumePointsFIFO(Math.abs(finalPoints), record.id)
      }
    }

    if (isCurrentUser) {
      this.checkAchievements()
    }

    if (multiplierInfo.isDoubled && recordInfo && recordInfo.category) {
      for (const act of multiplierInfo.appliedActivities) {
        this.recordActivityParticipation(act.activityId, 'points_earn', {
          points: multiplierInfo.bonusPoints,
          extra: { category: recordInfo.category, original: points }
        })
      }
    }
  },

  awardCorrectionPoints(submitterId, submitterName, points, recordInfo) {
    if (submitterId === 'current_user' || !submitterId) {
      this.updateUserPoints(points, recordInfo)
      return
    }

    const pool = wx.getStorageSync('userPointsPool') || {}
    const userPool = pool[submitterId] || {
      userId: submitterId,
      nickName: submitterName || '未知用户',
      points: 0,
      records: []
    }
    userPool.points += points
    userPool.nickName = submitterName || userPool.nickName

    const now = new Date()
    const timeStr = formatDate(now, 'YYYY-MM-DD HH:mm')
    userPool.records.unshift({
      id: generateId(),
      type: 'earn',
      category: recordInfo.category || 'correction',
      title: recordInfo.title || '纠错采纳奖励',
      desc: recordInfo.desc || '',
      emoji: recordInfo.emoji || '✅',
      points,
      time: timeStr
    })
    if (userPool.records.length > 100) {
      userPool.records = userPool.records.slice(0, 100)
    }

    pool[submitterId] = userPool
    wx.setStorageSync('userPointsPool', pool)
    console.log('[App] 纠错积分已发放给', submitterName, '(', submitterId, ') +', points, '总积分:', userPool.points)
  },

  /**
   * 更新用户信息
   * @param {Object} info 要更新的用户信息
   */
  updateUserInfo(info) {
    const userInfo = { ...this.globalData.userInfo, ...info }
    this.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
    console.log('[App] 用户信息已更新', userInfo)
  },

  initShareRecords() {
    const { SHARE_CONFIG } = require('./utils/constants')
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const stored = wx.getStorageSync('shareRecords')

    if (stored && stored.date === today) {
      this.globalData.shareRecords = stored
    } else {
      this.globalData.shareRecords = {
        date: today,
        shareCount: 0,
        pointsEarned: 0
      }
      wx.setStorageSync('shareRecords', this.globalData.shareRecords)
    }
    console.log('[App] 分享记录已加载', this.globalData.shareRecords)
  },

  getShareInfo() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const shareRecords = this.globalData.shareRecords

    if (!shareRecords || shareRecords.date !== today) {
      this.initShareRecords()
    }

    return this.globalData.shareRecords || { date: today, shareCount: 0, pointsEarned: 0 }
  },

  handleShareSuccess() {
    const { SHARE_CONFIG } = require('./utils/constants')
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const shareRecords = this.globalData.shareRecords

    if (!shareRecords || shareRecords.date !== today) {
      this.initShareRecords()
    }

    const currentPoints = this.globalData.shareRecords.pointsEarned || 0
    const maxPoints = SHARE_CONFIG.dailyShareMaxPoints
    const sharePoints = SHARE_CONFIG.dailySharePoints

    if (currentPoints >= maxPoints) {
      console.log('[App] 今日分享积分已达上限')
      return { success: false, points: 0, reason: 'daily_limit' }
    }

    const actualPoints = Math.min(sharePoints, maxPoints - currentPoints)

    this.globalData.shareRecords.shareCount = (this.globalData.shareRecords.shareCount || 0) + 1
    this.globalData.shareRecords.pointsEarned = currentPoints + actualPoints
    this.globalData.shareRecords.date = today
    wx.setStorageSync('shareRecords', this.globalData.shareRecords)

    if (this.globalData.missionCenter) {
      this.incrementShareForMission()
    }

    if (actualPoints > 0) {
      this.updateUserPoints(actualPoints, {
        category: 'share',
        title: '分享奖励',
        desc: '分享小程序给好友',
        emoji: '📤'
      })
    }

    console.log('[App] 分享成功，获得积分', actualPoints)
    return { success: true, points: actualPoints }
  },

  isTodayShared() {
    const shareInfo = this.getShareInfo()
    return shareInfo.shareCount > 0
  },

  getRemainingSharePoints() {
    const { SHARE_CONFIG } = require('./utils/constants')
    const shareInfo = this.getShareInfo()
    return Math.max(0, SHARE_CONFIG.dailyShareMaxPoints - (shareInfo.pointsEarned || 0))
  },

  initInviteRecords() {
    const inviteRecords = wx.getStorageSync('inviteRecords')
    if (inviteRecords) {
      this.globalData.inviteRecords = inviteRecords
    } else {
      this.globalData.inviteRecords = []
      wx.setStorageSync('inviteRecords', [])
    }
    console.log('[App] 邀请记录已加载', this.globalData.inviteRecords.length, '条')
  },

  getInviteRecords() {
    return this.globalData.inviteRecords || []
  },

  addInviteRecord(record) {
    const records = this.globalData.inviteRecords || []
    records.unshift(record)
    this.globalData.inviteRecords = records
    wx.setStorageSync('inviteRecords', records)
    console.log('[App] 新增邀请记录', record.inviteeName)
  },

  getInviteStats() {
    const records = this.getInviteRecords()
    const totalInvited = records.length
    const totalRewards = records.reduce((sum, r) => sum + (r.rewardPoints || 0), 0)

    return {
      totalInvited,
      totalRewards,
      records
    }
  },

  initDeviceId() {
    let deviceId = wx.getStorageSync('deviceId')
    if (!deviceId) {
      deviceId = 'dev_' + generateId()
      wx.setStorageSync('deviceId', deviceId)
    }
    this.globalData.deviceId = deviceId
    console.log('[App] 设备ID已加载', deviceId)
  },

  getDeviceId() {
    return this.globalData.deviceId || ''
  },

  processInviterOnLaunch(options) {
    console.log('[App] 处理邀请关系', options)

    const inviterId = this.extractInviterId(options)
    if (!inviterId) {
      console.log('[App] 无邀请人ID')
      return
    }

    console.log('[App] 检测到邀请人ID:', inviterId)
    this.tryBindInviter(inviterId)
  },

  extractInviterId(options) {
    if (!options) return null

    if (options.query && options.query.inviterId) {
      return options.query.inviterId
    }

    if (options.scene) {
      const sceneStr = String(options.scene)
      const match = sceneStr.match(/inviterId=([^&]+)/)
      if (match) {
        return match[1]
      }
    }

    return null
  },

  tryBindInviter(inviterId) {
    const { INVITE_CONFIG } = require('./utils/constants')

    if (!inviterId) return false

    const userInfo = this.globalData.userInfo
    if (userInfo && userInfo.inviterId) {
      console.log('[App] 用户已绑定邀请人', userInfo.inviterId)
      return false
    }

    const deviceId = this.getDeviceId()
    const boundDevices = wx.getStorageSync('boundDevices') || []

    if (boundDevices.includes(deviceId)) {
      console.log('[App] 该设备已绑定过邀请关系，防刷')
      return false
    }

    const currentUserId = this.getUserId()
    if (inviterId === currentUserId) {
      console.log('[App] 不能邀请自己')
      return false
    }

    this.bindInviter(inviterId)

    boundDevices.push(deviceId)
    wx.setStorageSync('boundDevices', boundDevices)

    this.updateUserPoints(INVITE_CONFIG.inviteeRewardPoints, {
      category: 'invite',
      title: '新人邀请奖励',
      desc: '接受好友邀请注册',
      emoji: '🎁'
    })

    this.addInviteRecord({
      id: generateId(),
      inviterId: inviterId,
      inviteeId: currentUserId,
      inviteeName: '环保达人',
      inviteeAvatar: '',
      rewardPoints: INVITE_CONFIG.inviterRewardPoints,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      status: 'success'
    })

    console.log('[App] 邀请关系绑定成功')
    return true
  },

  bindInviter(inviterId) {
    const userInfo = this.globalData.userInfo || {}
    userInfo.inviterId = inviterId
    userInfo.bindTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    this.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
    console.log('[App] 已绑定邀请人', inviterId)
  },

  getInviterId() {
    const userInfo = this.globalData.userInfo
    return userInfo ? userInfo.inviterId : null
  },

  getUserId() {
    const userInfo = this.globalData.userInfo
    if (userInfo && userInfo.userId) {
      return userInfo.userId
    }

    let userId = wx.getStorageSync('userId')
    if (!userId) {
      userId = 'user_' + generateId()
      wx.setStorageSync('userId', userId)
      if (this.globalData.userInfo) {
        this.globalData.userInfo.userId = userId
        wx.setStorageSync('userInfo', this.globalData.userInfo)
      }
    }

    return userId
  },

  generateSharePath() {
    const { SHARE_CONFIG } = require('./utils/constants')
    const userId = this.getUserId()
    const basePath = SHARE_CONFIG.sharePath
    return `${basePath}?inviterId=${userId}`
  },

  generateShareInfo() {
    const { SHARE_CONFIG } = require('./utils/constants')
    const userId = this.getUserId()

    return {
      title: SHARE_CONFIG.shareTitle,
      path: `${SHARE_CONFIG.sharePath}?inviterId=${userId}`,
      imageUrl: SHARE_CONFIG.shareImageUrl
    }
  },

  simulateInviteAccepted() {
    const { INVITE_CONFIG } = require('./utils/constants')

    const inviteeNames = ['小明', '小红', '小李', '小王', '小张', '小刘', '小陈', '小杨']
    const randomName = inviteeNames[Math.floor(Math.random() * inviteeNames.length)] + Math.floor(Math.random() * 100)

    const record = {
      id: generateId(),
      inviterId: this.getUserId(),
      inviteeId: 'user_' + generateId(),
      inviteeName: randomName,
      inviteeAvatar: '',
      rewardPoints: INVITE_CONFIG.inviterRewardPoints,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      status: 'success'
    }

    this.addInviteRecord(record)

    this.updateUserPoints(INVITE_CONFIG.inviterRewardPoints, {
      category: 'invite',
      title: '邀请好友奖励',
      desc: `好友${randomName}注册成功`,
      emoji: '👥'
    })

    return record
  },

  /**
   * 初始化成就系统
   */
  initAchievements() {
    const unlocked = wx.getStorageSync('unlockedAchievements')
    this.globalData.unlockedAchievements = unlocked || []
    console.log('[App] 成就系统已加载，已解锁成就:', this.globalData.unlockedAchievements.length)
  },

  /**
   * 检查并解锁成就
   * @returns {Array} 新解锁的成就列表
   */
  checkAchievements() {
    const unlockedIds = this.globalData.unlockedAchievements || []
    const newlyUnlocked = []

    const stats = this.getStatistics()
    const classifyCount = stats.classifyCount
    const totalEarnedPoints = stats.totalEarnedPoints
    const continuousDays = this.getStreakDays()
    const inviteCount = this.getInviteRecords().length
    const quizRecords = this.getQuizRecords()
    const correctQuizCount = quizRecords.reduce((sum, r) => sum + (r.correctCount || 0), 0)
    const certificates = this.globalData.certificates || wx.getStorageSync('certificates') || []
    const certCount = certificates.length
    const myGroups = this.getMyGroups ? this.getMyGroups() : []
    const groupTaskCompleteCount = myGroups.filter(g => g.taskCompleted).length

    ACHIEVEMENTS.forEach(achievement => {
      if (unlockedIds.includes(achievement.id)) return

      let unlocked = false
      const cond = achievement.condition

      switch (cond.type) {
        case 'classifyCount':
          unlocked = classifyCount >= cond.value
          break
        case 'correctQuizCount':
          unlocked = correctQuizCount >= cond.value
          break
        case 'continuousSignIn':
          unlocked = continuousDays >= cond.value
          break
        case 'totalPoints':
          unlocked = totalEarnedPoints >= cond.value
          break
        case 'inviteCount':
          unlocked = inviteCount >= cond.value
          break
        case 'certCollect':
          unlocked = certCount >= cond.value
          break
        case 'groupTaskComplete':
          unlocked = groupTaskCompleteCount >= cond.value
          break
      }

      if (unlocked) {
        this.globalData.unlockedAchievements.push(achievement.id)
        newlyUnlocked.push(achievement)
        console.log('[App] 解锁成就:', achievement.name)
      }
    })

    if (newlyUnlocked.length > 0) {
      wx.setStorageSync('unlockedAchievements', this.globalData.unlockedAchievements)

      const unlockRecords = wx.getStorageSync('achievementUnlockRecords') || {}
      const now = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      newlyUnlocked.forEach(achievement => {
        unlockRecords[achievement.id] = now
      })
      wx.setStorageSync('achievementUnlockRecords', unlockRecords)

      newlyUnlocked.forEach(achievement => {
        if (messageManager && MESSAGE_TYPES.ACHIEVEMENT) {
          messageManager.addMessage({
            type: MESSAGE_TYPES.ACHIEVEMENT,
            title: '成就解锁',
            content: `恭喜！你已解锁「${achievement.name}」勋章：${achievement.description}`,
            emoji: achievement.emoji,
            data: {
              achievementId: achievement.id,
              link: '/pages/achievement-detail/achievement-detail?id=' + achievement.id + '&showUnlock=true'
            }
          })
        }

        if (achievement.condition.type === 'groupTaskComplete' || achievement.linkedGroupBadge) {
          this.syncGroupBadge(achievement)
        }
      })

      this.notifyAchievementUnlock(newlyUnlocked)
    }

    return newlyUnlocked
  },

  notifyAchievementUnlock(achievements) {
    const achievement = achievements[0]
    if (!achievement) return

    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (currentPage && currentPage.playUnlockAnimation) {
      currentPage.playUnlockAnimation()
    }
  },

  syncGroupBadge(achievement) {
    const myGroups = this.getMyGroups ? this.getMyGroups() : []
    if (myGroups.length === 0) return

    const groupBadges = wx.getStorageSync('groupBadges') || {}
    myGroups.forEach(group => {
      if (!groupBadges[group.id]) {
        groupBadges[group.id] = []
      }
      if (!groupBadges[group.id].includes(achievement.id)) {
        groupBadges[group.id].push(achievement.id)
      }
    })
    wx.setStorageSync('groupBadges', groupBadges)
    console.log('[App] 已同步组徽章', achievement.name)
  },

  getGroupBadges(groupId) {
    const groupBadges = wx.getStorageSync('groupBadges') || {}
    return groupBadges[groupId] || []
  },

  /**
   * 获取成就列表（包含解锁状态）
   * @returns {Array} 成就列表
   */
  getAchievements() {
    const unlockedIds = this.globalData.unlockedAchievements || []
    const stats = this.getStatistics()
    const classifyCount = stats.classifyCount
    const totalEarnedPoints = stats.totalEarnedPoints
    const continuousDays = this.getStreakDays()
    const inviteCount = this.getInviteRecords().length
    const quizRecords = this.getQuizRecords()
    const correctQuizCount = quizRecords.reduce((sum, r) => sum + (r.correctCount || 0), 0)
    const certificates = this.globalData.certificates || wx.getStorageSync('certificates') || []
    const certCount = certificates.length
    const myGroups = this.getMyGroups ? this.getMyGroups() : []
    const groupTaskCompleteCount = myGroups.filter(g => g.taskCompleted).length

    return ACHIEVEMENTS.map(achievement => {
      let current = 0
      let target = achievement.condition.value

      switch (achievement.condition.type) {
        case 'classifyCount':
          current = classifyCount
          break
        case 'correctQuizCount':
          current = correctQuizCount
          break
        case 'continuousSignIn':
          current = continuousDays
          break
        case 'totalPoints':
          current = totalEarnedPoints
          break
        case 'inviteCount':
          current = inviteCount
          break
        case 'certCollect':
          current = certCount
          break
        case 'groupTaskComplete':
          current = groupTaskCompleteCount
          break
      }

      return {
        ...achievement,
        unlocked: unlockedIds.includes(achievement.id),
        current: Math.min(current, target),
        target,
        progress: Math.min(100, Math.floor((current / target) * 100))
      }
    })
  },

  /**
   * 初始化社区帖子
   */
  initCommunityPosts() {
    const { COMMUNITY_POSTS, OFFICIAL_FEATURED_POSTS, getCreatorLevel } = require('./utils/constants')
    const stored = wx.getStorageSync('communityPosts')

    if (stored && stored.length > 0) {
      this.globalData.communityPosts = stored
    } else {
      this.globalData.communityPosts = COMMUNITY_POSTS.map(post => ({
        ...post,
        isFeatured: OFFICIAL_FEATURED_POSTS.includes(post.id),
        pinnedCommentId: '',
        knowledgeCards: [],
        reportCount: post.reportCount || 0,
        creatorLevel: 1,
        creatorBadge: '初级创作者'
      }))
      this.refreshPostsCreatorLevel()
      wx.setStorageSync('communityPosts', this.globalData.communityPosts)
    }
    console.log('[App] 社区帖子已加载', this.globalData.communityPosts.length, '条')
  },

  refreshPostsCreatorLevel() {
    const { getCreatorLevel } = require('./utils/constants')
    const userStats = {}
    this.globalData.communityPosts.forEach(post => {
      const uid = post.userId
      if (!userStats[uid]) {
        userStats[uid] = { postCount: 0, likeCount: 0 }
      }
      userStats[uid].postCount += 1
      userStats[uid].likeCount += post.likes || 0
    })
    this.globalData.communityPosts.forEach(post => {
      const stats = userStats[post.userId] || { postCount: 0, likeCount: 0 }
      const level = getCreatorLevel(stats.postCount, stats.likeCount)
      post.creatorLevel = level.level
      post.creatorBadge = level.name
      post.creatorBadgeIcon = level.icon
      post.creatorBadgeColor = level.badgeColor
      post.creatorPointsMultiplier = level.pointsMultiplier
      post.isExpertCreator = !!level.isExpert
    })
  },

  saveCommunityPosts() {
    wx.setStorageSync('communityPosts', this.globalData.communityPosts)
  },

  getCommunityPosts(filter = {}) {
    const { WEEKLY_EXPERT_LIST } = require('./utils/constants')
    let posts = this.globalData.communityPosts || []
    posts = posts.filter(p => p.status === 'normal')

    if (filter.type && filter.type !== 'all') {
      posts = posts.filter(p => p.type === filter.type)
    }
    if (filter.topic) {
      posts = posts.filter(p => (p.topics || []).includes(filter.topic))
    }
    if (filter.officialOnly) {
      posts = posts.filter(p => p.isOfficial)
    }

    const expertUserIds = WEEKLY_EXPERT_LIST.map(e => e.userId)
    posts = posts.map(p => {
      let weight = 0
      if (p.isFeatured) weight += 1000
      if (expertUserIds.includes(p.userId)) weight += 500
      if (p.isExpertCreator) weight += 200
      if (p.isOfficial) weight += 300
      weight += (p.likes || 0) * 2
      weight += (p.comments || 0) * 3
      weight += (p.shares || 0) * 5
      return { ...p, _weight: weight }
    })

    return posts.sort((a, b) => {
      if (b._weight !== a._weight) return b._weight - a._weight
      return new Date(b.createTime) - new Date(a.createTime)
    })
  },

  getWeeklyExpertList() {
    const { WEEKLY_EXPERT_LIST, getCreatorLevel } = require('./utils/constants')
    return WEEKLY_EXPERT_LIST.map(exp => {
      const level = getCreatorLevel(exp.postCount, exp.likeCount)
      return { ...exp, creatorLevel: level.level, creatorBadge: level.name, creatorBadgeIcon: level.icon, creatorBadgeColor: level.badgeColor }
    })
  },

  getFeaturedPosts() {
    return this.getCommunityPosts({}).filter(p => p.isFeatured)
  },

  isPostOwner(userId) {
    return userId === this.getUserId()
  },

  getCommunityPostById(postId) {
    return this.globalData.communityPosts.find(p => p.id === postId)
  },

  addCommunityPost(post) {
    const { COMMUNITY_POINTS_CONFIG, getCreatorLevel } = require('./utils/constants')
    const userInfo = this.globalData.userInfo

    const userStats = this.getUserPostStats()
    const creatorLevel = getCreatorLevel(userStats.postCount, userStats.likeCount)

    const newPost = {
      id: 'post_' + generateId(),
      type: post.type,
      userId: this.getUserId(),
      userNickName: userInfo ? userInfo.nickName : '环保达人',
      userAvatar: userInfo ? userInfo.avatarUrl : '',
      userAvatarEmoji: '🌱',
      isOfficial: false,
      title: post.title || '',
      content: post.content || '',
      images: post.images || [],
      topics: post.topics || [],
      topicNames: post.topicNames || [],
      knowledgeCards: post.knowledgeCards || [],
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      isFeatured: false,
      pinnedCommentId: '',
      reportCount: 0,
      creatorLevel: creatorLevel.level,
      creatorBadge: creatorLevel.name,
      creatorBadgeIcon: creatorLevel.icon,
      creatorBadgeColor: creatorLevel.badgeColor,
      isExpertCreator: !!creatorLevel.isExpert,
      creatorPointsMultiplier: creatorLevel.pointsMultiplier,
      createTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      status: 'normal'
    }

    this.globalData.communityPosts.unshift(newPost)
    this.saveCommunityPosts()
    this.refreshPostsCreatorLevel()

    const basePoints = COMMUNITY_POINTS_CONFIG.publishPost
    const multipliedPoints = Math.floor(basePoints * creatorLevel.pointsMultiplier)
    const actualPoints = this.addCommunityDailyPoints('publish', multipliedPoints)
    if (actualPoints > 0) {
      this.updateUserPoints(actualPoints, {
        category: 'community_publish',
        title: '社区发布',
        desc: `发布${post.type === 'experience' ? '环保心得' : post.type === 'skill' ? '分类技巧' : '晒图'}${creatorLevel.pointsMultiplier > 1 ? `(x${creatorLevel.pointsMultiplier}系数)` : ''}`,
        emoji: '✍️'
      })
    }

    console.log('[App] 新增社区帖子', newPost.id)
    return { post: newPost, points: actualPoints }
  },

  getUserPostStats() {
    const userId = this.getUserId()
    let postCount = 0
    let likeCount = 0
    this.globalData.communityPosts.forEach(post => {
      if (post.userId === userId) {
        postCount += 1
        likeCount += post.likes || 0
      }
    })
    return { postCount, likeCount }
  },

  getCurrentUserCreatorLevel() {
    const { getCreatorLevel } = require('./utils/constants')
    const stats = this.getUserPostStats()
    return getCreatorLevel(stats.postCount, stats.likeCount)
  },

  toggleLikePost(postId) {
    const { COMMUNITY_POINTS_CONFIG } = require('./utils/constants')
    const post = this.getCommunityPostById(postId)
    if (!post) return { success: false }

    let points = 0
    if (post.liked) {
      post.likes = Math.max(0, post.likes - 1)
      post.liked = false
    } else {
      post.likes += 1
      post.liked = true
      points = this.addCommunityDailyPoints('like', COMMUNITY_POINTS_CONFIG.likePost)
      if (points > 0) {
        this.updateUserPoints(points, {
          category: 'community_like',
          title: '社区点赞',
          desc: '为优质内容点赞',
          emoji: '👍'
        })
      }
    }

    this.checkQualityBonus(post)
    this.saveCommunityPosts()
    return { success: true, liked: post.liked, likes: post.likes, points }
  },

  sharePost(postId) {
    const { COMMUNITY_POINTS_CONFIG } = require('./utils/constants')
    const post = this.getCommunityPostById(postId)
    if (!post) return { success: false }

    post.shares += 1
    this.saveCommunityPosts()

    const points = this.addCommunityDailyPoints('share', COMMUNITY_POINTS_CONFIG.sharePost)
    if (points > 0) {
      this.updateUserPoints(points, {
        category: 'community_share',
        title: '社区分享',
        desc: '分享优质内容',
        emoji: '📤'
      })
    }

    this.checkQualityBonus(post)
    return { success: true, shares: post.shares, points }
  },

  checkQualityBonus(post) {
    const { COMMUNITY_POINTS_CONFIG } = require('./utils/constants')
    const bonus = COMMUNITY_POINTS_CONFIG.qualityBonus
    const rewarded = post.qualityBonusRewarded || {}

    let bonusPoints = 0
    let bonusDesc = []

    if (post.likes >= 500 && !rewarded.likes500) {
      bonusPoints += bonus.likes500
      bonusDesc.push('点赞超500')
      rewarded.likes500 = true
    } else if (post.likes >= 200 && !rewarded.likes200) {
      bonusPoints += bonus.likes200
      bonusDesc.push('点赞超200')
      rewarded.likes200 = true
    } else if (post.likes >= 50 && !rewarded.likes50) {
      bonusPoints += bonus.likes50
      bonusDesc.push('点赞超50')
      rewarded.likes50 = true
    }

    if (post.comments >= 30 && !rewarded.comments30) {
      bonusPoints += bonus.comments30
      bonusDesc.push('评论超30')
      rewarded.comments30 = true
    }

    if (post.shares >= 50 && !rewarded.shares50) {
      bonusPoints += bonus.shares50
      bonusDesc.push('分享超50')
      rewarded.shares50 = true
    }

    if (bonusPoints > 0) {
      post.qualityBonusRewarded = rewarded
      this.updateUserPoints(bonusPoints, {
        category: 'community_quality',
        title: '优质内容奖励',
        desc: bonusDesc.join('、'),
        emoji: '🏆'
      })
    }
  },

  /**
   * 初始化社区评论
   */
  initCommunityComments() {
    const { COMMUNITY_COMMENTS } = require('./utils/constants')
    const stored = wx.getStorageSync('communityComments')

    if (stored && Object.keys(stored).length > 0) {
      this.globalData.communityComments = stored
    } else {
      const enriched = {}
      Object.keys(COMMUNITY_COMMENTS).forEach(postId => {
        enriched[postId] = COMMUNITY_COMMENTS[postId].map(c => ({
          ...c,
          replies: [],
          mentions: [],
          replyTo: null,
          isPinned: false,
          reportCount: 0
        }))
      })
      this.globalData.communityComments = enriched
      wx.setStorageSync('communityComments', this.globalData.communityComments)
    }
    console.log('[App] 社区评论已加载')
  },

  saveCommunityComments() {
    wx.setStorageSync('communityComments', this.globalData.communityComments)
  },

  parseMentions(content) {
    const mentions = []
    const regex = /@(\S+?)(?=\s|$|,|.|!|\?|，|。|！|？)/g
    let match
    while ((match = regex.exec(content)) !== null) {
      mentions.push({ name: match[1], index: match.index, rawIndex: match.index, length: match[0].length })
    }
    return mentions
  },

  buildDisplayContent(content, mentions) {
    if (!mentions || mentions.length === 0) {
      return [{ type: 'text', text: content }]
    }
    const segs = []
    let cursor = 0
    mentions.forEach(m => {
      if (m.index > cursor) {
        segs.push({ type: 'text', text: content.slice(cursor, m.index) })
      }
      segs.push({ type: 'mention', text: m.name })
      cursor = m.index + m.length
    })
    if (cursor < content.length) {
      segs.push({ type: 'text', text: content.slice(cursor) })
    }
    return segs
  },

  enrichCommentDisplay(comment) {
    const self = this
    if (!comment.mentions || comment.mentions.length === 0) {
      comment.displayContent = [{ type: 'text', text: comment.content }]
    } else {
      comment.displayContent = self.buildDisplayContent(comment.content, comment.mentions)
    }
    if (comment.replies && comment.replies.length > 0) {
      comment.replies = comment.replies.map(r => self.enrichCommentDisplay(r))
    }
    return comment
  },

  getCommentsByPostId(postId) {
    const comments = (this.globalData.communityComments[postId] || []).map(c => this.enrichCommentDisplay(c))
    const post = this.getCommunityPostById(postId)
    const pinnedId = post ? post.pinnedCommentId : ''
    return comments.sort((a, b) => {
      if (a.id === pinnedId) return -1
      if (b.id === pinnedId) return 1
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return 0
    })
  },

  addComment(postId, content, options = {}) {
    const { COMMUNITY_POINTS_CONFIG, getCreatorLevel } = require('./utils/constants')
    const userInfo = this.globalData.userInfo
    const post = this.getCommunityPostById(postId)
    if (!post) return { success: false }

    const mentions = this.parseMentions(content)
    const userStats = this.getUserPostStats()
    const creatorLevel = getCreatorLevel(userStats.postCount, userStats.likeCount)

    const newComment = {
      id: 'comment_' + generateId(),
      postId,
      userId: this.getUserId(),
      userNickName: userInfo ? userInfo.nickName : '环保达人',
      userAvatarEmoji: '🌱',
      content,
      mentions,
      replyTo: options.replyTo || null,
      replies: [],
      likes: 0,
      liked: false,
      isPinned: false,
      reportCount: 0,
      createTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }

    if (!this.globalData.communityComments[postId]) {
      this.globalData.communityComments[postId] = []
    }

    if (options.replyTo && options.replyTo.commentId) {
      const parentComment = this.globalData.communityComments[postId].find(c => c.id === options.replyTo.commentId)
      if (parentComment) {
        if (!parentComment.replies) parentComment.replies = []
        parentComment.replies.push(newComment)
      }
    } else {
      this.globalData.communityComments[postId].unshift(newComment)
    }

    this.saveCommunityComments()

    post.comments += 1
    this.saveCommunityPosts()

    const basePoints = COMMUNITY_POINTS_CONFIG.commentPost
    const multipliedPoints = Math.floor(basePoints * creatorLevel.pointsMultiplier)
    const points = this.addCommunityDailyPoints('comment', multipliedPoints)
    if (points > 0) {
      this.updateUserPoints(points, {
        category: 'community_comment',
        title: '社区评论',
        desc: options.replyTo ? '回复评论' : '参与话题讨论',
        emoji: '💬'
      })
    }

    this.checkQualityBonus(post)
    return { success: true, comment: newComment, points }
  },

  toggleLikeComment(postId, commentId) {
    const comments = this.globalData.communityComments[postId]
    if (!comments) return { success: false }

    let target = null
    for (const c of comments) {
      if (c.id === commentId) { target = c; break }
      if (c.replies && c.replies.length > 0) {
        const found = c.replies.find(r => r.id === commentId)
        if (found) { target = found; break }
      }
    }
    if (!target) return { success: false }

    if (target.liked) {
      target.likes = Math.max(0, target.likes - 1)
      target.liked = false
    } else {
      target.likes += 1
      target.liked = true
    }

    this.saveCommunityComments()
    return { success: true, liked: target.liked, likes: target.likes }
  },

  pinComment(postId, commentId) {
    const { COMMUNITY_POINTS_CONFIG } = require('./utils/constants')
    const post = this.getCommunityPostById(postId)
    if (!post) return { success: false }
    if (!this.isPostOwner(post.userId)) return { success: false, reason: 'not_owner' }

    if (post.pinnedCommentId === commentId) {
      post.pinnedCommentId = ''
      this.saveCommunityPosts()
      return { success: true, pinned: false }
    }

    post.pinnedCommentId = commentId
    this.saveCommunityPosts()

    const comments = this.globalData.communityComments[postId] || []
    for (const c of comments) {
      if (c.id === commentId) {
        c.isPinned = true
      } else {
        c.isPinned = false
      }
      if (c.replies) c.replies.forEach(r => { r.isPinned = false })
    }
    this.saveCommunityComments()

    const bonus = COMMUNITY_POINTS_CONFIG.pinCommentBonus
    if (bonus > 0) {
      this.updateUserPoints(bonus, {
        category: 'community_pin',
        title: '评论被置顶',
        desc: '优质评论被楼主置顶',
        emoji: '📌'
      })
    }
    return { success: true, pinned: true, points: bonus }
  },

  reportComment(postId, commentId, reason) {
    const { COMMUNITY_REPORT_CONFIG } = require('./utils/constants')
    const comments = this.globalData.communityComments[postId]
    if (!comments) return { success: false }

    let target = null
    for (const c of comments) {
      if (c.id === commentId) { target = c; break }
      if (c.replies) {
        const found = c.replies.find(r => r.id === commentId)
        if (found) { target = found; break }
      }
    }
    if (!target) return { success: false }

    target.reportCount = (target.reportCount || 0) + 1
    if (target.reportCount >= COMMUNITY_REPORT_CONFIG.autoHideThreshold) {
      target.isHidden = true
    }
    this.saveCommunityComments()

    this.addReport({
      targetId: commentId,
      targetType: 'comment',
      reasonId: reason.reasonId,
      reasonName: reason.reasonName,
      description: reason.description
    })

    return { success: true }
  },

  /**
   * 初始化举报记录
   */
  initCommunityReports() {
    const { COMMUNITY_REPORT_CONFIG } = require('./utils/constants')
    const stored = wx.getStorageSync('communityReports')
    this.globalData.communityReports = stored || []
    const localMarks = wx.getStorageSync(COMMUNITY_REPORT_CONFIG.localMarkKey)
    this.globalData.communityLocalReports = localMarks || {}
    const queue = wx.getStorageSync(COMMUNITY_REPORT_CONFIG.reviewQueueKey)
    this.globalData.communityReviewQueue = queue || []
    console.log('[App] 社区举报记录已加载')
  },

  saveCommunityReports() {
    wx.setStorageSync('communityReports', this.globalData.communityReports)
  },

  addReport(report) {
    const { COMMUNITY_REPORT_CONFIG } = require('./utils/constants')
    const newReport = {
      id: 'report_' + generateId(),
      targetId: report.targetId,
      targetType: report.targetType,
      reasonId: report.reasonId,
      reasonName: report.reasonName,
      description: report.description || '',
      reporterId: this.getUserId(),
      createTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      status: 'pending'
    }

    this.globalData.communityReports.push(newReport)
    this.saveCommunityReports()

    const key = `${report.targetType}_${report.targetId}`
    if (!this.globalData.communityLocalReports) this.globalData.communityLocalReports = {}
    this.globalData.communityLocalReports[key] = { reported: true, reportTime: newReport.createTime }
    wx.setStorageSync(COMMUNITY_REPORT_CONFIG.localMarkKey, this.globalData.communityLocalReports)

    if (!this.globalData.communityReviewQueue) this.globalData.communityReviewQueue = []
    this.globalData.communityReviewQueue.push(newReport)
    wx.setStorageSync(COMMUNITY_REPORT_CONFIG.reviewQueueKey, this.globalData.communityReviewQueue)

    if (report.targetType === 'post') {
      const post = this.getCommunityPostById(report.targetId)
      if (post) {
        post.reportCount = (post.reportCount || 0) + 1
        if (post.reportCount >= COMMUNITY_REPORT_CONFIG.autoHideThreshold) {
          post.status = 'hidden'
          post.hiddenReason = 'auto_hide_by_reports'
          post.hiddenTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
        } else if (post.reportCount >= 3) {
          post.status = 'reviewing'
        }
        this.saveCommunityPosts()
      }
    }

    console.log('[App] 新增举报', newReport.id)
    return newReport
  },

  isLocallyReported(targetType, targetId) {
    const key = `${targetType}_${targetId}`
    return !!(this.globalData.communityLocalReports && this.globalData.communityLocalReports[key])
  },

  getReviewQueue() {
    return this.globalData.communityReviewQueue || []
  },

  /**
   * 初始化社区每日积分
   */
  initCommunityDailyPoints() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const stored = wx.getStorageSync('communityDailyPoints')

    if (stored && stored.date === today) {
      this.globalData.communityDailyPoints = stored
    } else {
      this.globalData.communityDailyPoints = {
        date: today,
        publish: 0,
        like: 0,
        comment: 0,
        share: 0
      }
      wx.setStorageSync('communityDailyPoints', this.globalData.communityDailyPoints)
    }
    console.log('[App] 社区每日积分已加载')
  },

  addCommunityDailyPoints(action, points) {
    const { COMMUNITY_POINTS_CONFIG } = require('./utils/constants')
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const daily = this.globalData.communityDailyPoints

    if (!daily || daily.date !== today) {
      this.initCommunityDailyPoints()
    }

    const currentPoints = this.globalData.communityDailyPoints[action] || 0
    const maxMap = {
      publish: COMMUNITY_POINTS_CONFIG.dailyPublishMax,
      like: COMMUNITY_POINTS_CONFIG.dailyLikeMax,
      comment: COMMUNITY_POINTS_CONFIG.dailyCommentMax,
      share: COMMUNITY_POINTS_CONFIG.dailyShareMax
    }
    const maxPoints = maxMap[action] || Infinity
    const actualPoints = Math.min(points, Math.max(0, maxPoints - currentPoints))

    if (actualPoints > 0) {
      this.globalData.communityDailyPoints[action] = currentPoints + actualPoints
      wx.setStorageSync('communityDailyPoints', this.globalData.communityDailyPoints)
      console.log(`[App] 社区每日积分 [${action}]: +${actualPoints}`)
    }

    return actualPoints
  },

  initLeaderboardData() {
    const { LEADERBOARD_USERS } = require('./utils/constants')
    const stored = wx.getStorageSync('leaderboardData')
    let currentSeasonId = this.globalData.seasonData && this.globalData.seasonData.seasonId

    if (!currentSeasonId) {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      currentSeasonId = `${year}-${String(month).padStart(2, '0')}`
    }

    if (stored && stored.users && stored.users.length > 0) {
      const needUpgrade = stored.users.some(u => !u.seasonStats)
      if (needUpgrade || !stored.currentSeasonId || stored.currentSeasonId !== currentSeasonId) {
        stored.users = stored.users.map(u => this.generateUserSeasonStats(u, currentSeasonId))
        stored.currentSeasonId = currentSeasonId
        wx.setStorageSync('leaderboardData', stored)
      }
      this.globalData.leaderboardData = stored
    } else {
      const usersWithStats = LEADERBOARD_USERS.map(u => this.generateUserSeasonStats(u, currentSeasonId))
      this.globalData.leaderboardData = {
        users: usersWithStats,
        currentSeasonId,
        lastUpdated: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      }
      wx.setStorageSync('leaderboardData', this.globalData.leaderboardData)
    }
    console.log('[App] 排行榜数据已加载', this.globalData.leaderboardData.users.length, '位用户')
  },

  generateUserSeasonStats(user, currentSeasonId) {
    if (!user.seasonStats) {
      user.seasonStats = {}
    }

    if (!currentSeasonId) {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      currentSeasonId = `${year}-${String(month).padStart(2, '0')}`
    }

    const totalPoints = user.points || 0
    const totalClassify = user.classifyCount || 0
    const totalAccuracy = user.accuracy || 0
    const totalGameScore = user.gameScore || 0

    const seasonRange = this.getSeasonTimeRange(currentSeasonId)
    const daysInSeason = Math.max(1, Math.ceil((seasonRange.endTime - seasonRange.startTime) / (24 * 3600 * 1000)))
    const now = Date.now()
    const elapsedDays = Math.max(1, Math.min(daysInSeason, Math.ceil((now - seasonRange.startTime) / (24 * 3600 * 1000))))
    const seasonProgress = elapsedDays / daysInSeason
    const weekProgress = Math.min(1, 7 / daysInSeason)

    const seasonRatio = 0.3 * seasonProgress
    const seasonPoints = Math.floor(totalPoints * seasonRatio)
    const seasonClassify = Math.floor(totalClassify * seasonRatio)
    const seasonAccuracy = totalAccuracy > 0 ? Math.min(100, Math.round(totalAccuracy * 0.95 + 2)) : 0
    const seasonGameScore = Math.floor(totalGameScore * seasonRatio)

    const weekRatio = 0.3 * weekProgress
    const weekPoints = Math.floor(totalPoints * weekRatio)
    const weekClassify = Math.floor(totalClassify * weekRatio)
    const weekAccuracy = totalAccuracy > 0 ? Math.min(100, Math.round(totalAccuracy * 0.93 + 3)) : 0
    const weekGameScore = Math.floor(totalGameScore * weekRatio)

    const seasonStats = {}
    seasonStats[currentSeasonId] = {
      points: seasonPoints,
      classifyCount: seasonClassify,
      accuracy: seasonAccuracy,
      gameScore: seasonGameScore
    }

    if (!user.seasonStats) {
      const prevMonthDate = new Date(seasonRange.startTime.getTime() - 24 * 3600 * 1000)
      const prevMonthId = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`
      const prevMonthRatio = 0.3
      seasonStats[prevMonthId] = {
        points: Math.floor(totalPoints * prevMonthRatio),
        classifyCount: Math.floor(totalClassify * prevMonthRatio),
        accuracy: totalAccuracy > 0 ? Math.min(100, Math.round(totalAccuracy * 0.95 + 1)) : 0,
        gameScore: Math.floor(totalGameScore * prevMonthRatio)
      }
    }

    return {
      ...user,
      seasonStats: { ...(user.seasonStats || {}), ...seasonStats },
      weekStats: {
        points: weekPoints,
        classifyCount: weekClassify,
        accuracy: weekAccuracy,
        gameScore: weekGameScore
      }
    }
  },

  resetLeaderboardSeasonStats(newSeasonId) {
    if (!this.globalData.leaderboardData || !this.globalData.leaderboardData.users) return
    this.globalData.leaderboardData.users = this.globalData.leaderboardData.users.map(u => {
      const newUser = { ...u }
      if (!newUser.seasonStats) newUser.seasonStats = {}
      newUser.seasonStats[newSeasonId] = {
        points: 0,
        classifyCount: 0,
        accuracy: 0,
        gameScore: 0
      }
      newUser.weekStats = {
        points: 0,
        classifyCount: 0,
        accuracy: 0,
        gameScore: 0
      }
      return newUser
    })
    this.globalData.leaderboardData.currentSeasonId = newSeasonId
    this.globalData.leaderboardData.lastUpdated = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    wx.setStorageSync('leaderboardData', this.globalData.leaderboardData)
    console.log('[App] 排行榜赛季数据已重置', newSeasonId)
  },

  getLeaderboard(period, dimension) {
    const { LEADERBOARD_CONFIG } = require('./utils/constants')
    const leaderboardData = this.globalData.leaderboardData
    const userInfo = this.globalData.userInfo
    const seasonInfo = this.getSeasonInfo()
    const seasonId = seasonInfo ? seasonInfo.seasonId : null

    let users = [...(leaderboardData.users || [])]
    const currentUserId = this.getUserId()
    const currentUserStats = this.getCurrentUserStats(period)

    const existingIndex = users.findIndex(u => u.id === currentUserId)
    if (existingIndex > -1) {
      users[existingIndex] = { ...users[existingIndex], ...currentUserStats }
    } else {
      users.push({
        id: currentUserId,
        nickName: userInfo ? userInfo.nickName : '环保达人',
        avatarEmoji: userInfo && userInfo.avatarUrl ? '' : '🌱',
        ...currentUserStats
      })
    }

    users = users.map(u => {
      if (u.id === currentUserId) {
        return { ...u, ...currentUserStats }
      }
      const stats = this.getUserStatsByPeriod(period, u.id, seasonId)
      return { ...u, ...stats }
    })

    users.sort((a, b) => {
      const aVal = a[dimension] || 0
      const bVal = b[dimension] || 0
      return bVal - aVal
    })

    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: index + 1,
      isCurrentUser: user.id === currentUserId
    }))

    const myRank = rankedUsers.find(u => u.isCurrentUser)

    return {
      list: rankedUsers,
      myRank: myRank ? myRank.rank : rankedUsers.length + 1,
      myData: myRank || null,
      period,
      dimension,
      seasonId,
      timeRange: this.getPeriodTimeRange(period, seasonId)
    }
  },

  getSeasonTimeRange(seasonId) {
    if (!seasonId || !seasonId.includes('-')) {
      const now = new Date()
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      seasonId = `${year}-${String(month).padStart(2, '0')}`
    }
    const [yearStr, monthStr] = seasonId.split('-')
    const year = parseInt(yearStr)
    const month = parseInt(monthStr)
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    return {
      seasonId,
      startDate: formatDate(startDate, 'YYYY-MM-DD'),
      endDate: formatDate(endDate, 'YYYY-MM-DD'),
      startTime: startDate.getTime(),
      endTime: endDate.getTime() + 24 * 60 * 60 * 1000 - 1
    }
  },

  getPeriodTimeRange(period, seasonId = null) {
    const now = new Date()
    const nowTime = now.getTime()

    if (period === 'total') {
      return {
        period,
        startDate: '2000-01-01',
        endDate: formatDate(now, 'YYYY-MM-DD'),
        startTime: 0,
        endTime: nowTime
      }
    }

    if (period === 'month') {
      const seasonRange = this.getSeasonTimeRange(seasonId)
      return {
        period,
        seasonId: seasonRange.seasonId,
        startDate: seasonRange.startDate,
        endDate: seasonRange.endDate,
        startTime: seasonRange.startTime,
        endTime: Math.min(seasonRange.endTime, nowTime)
      }
    }

    if (period === 'week') {
      const weekStart = new Date()
      weekStart.setHours(0, 0, 0, 0)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
      weekEnd.setHours(23, 59, 59, 999)
      return {
        period,
        startDate: formatDate(weekStart, 'YYYY-MM-DD'),
        endDate: formatDate(weekEnd, 'YYYY-MM-DD'),
        startTime: weekStart.getTime(),
        endTime: Math.min(weekEnd.getTime(), nowTime)
      }
    }

    return {
      period,
      startDate: formatDate(now, 'YYYY-MM-DD'),
      endDate: formatDate(now, 'YYYY-MM-DD'),
      startTime: nowTime,
      endTime: nowTime
    }
  },

  getUserStatsByPeriod(period, userId, seasonId = null) {
    const timeRange = this.getPeriodTimeRange(period, seasonId)
    const isCurrentUser = !userId || userId === this.getUserId()

    let pointsRecords = []
    let classifyRecords = []
    let quizRecords = []
    let gameRecords = []
    let userInfo = null

    if (isCurrentUser) {
      pointsRecords = this.getPointsRecords()
      classifyRecords = this.getClassifyRecords()
      quizRecords = this.getQuizRecords()
      gameRecords = this.getGameRecords()
      userInfo = this.globalData.userInfo
    } else {
      const lbUsers = (this.globalData.leaderboardData && this.globalData.leaderboardData.users) || []
      const lbUser = lbUsers.find(u => u.id === userId)
      if (!lbUser) {
        return { points: 0, accuracy: 0, classifyCount: 0, streakDays: 0, gameScore: 0 }
      }
      const seasonStats = lbUser.seasonStats && lbUser.seasonStats[timeRange.seasonId || 'current']
      if (seasonStats && period === 'month') {
        return {
          points: seasonStats.points || 0,
          accuracy: seasonStats.accuracy || 0,
          classifyCount: seasonStats.classifyCount || 0,
          streakDays: lbUser.streakDays || 0,
          gameScore: seasonStats.gameScore || 0
        }
      }
      const weekStats = lbUser.weekStats
      if (weekStats && period === 'week') {
        return {
          points: weekStats.points || 0,
          accuracy: weekStats.accuracy || 0,
          classifyCount: weekStats.classifyCount || 0,
          streakDays: lbUser.streakDays || 0,
          gameScore: weekStats.gameScore || 0
        }
      }
      return { points: 0, accuracy: 0, classifyCount: 0, streakDays: 0, gameScore: 0 }
    }

    const inRange = (recordTime) => {
      if (!recordTime) return false
      try {
        const t = new Date(recordTime.replace(/-/g, '/')).getTime()
        return t >= timeRange.startTime && t <= timeRange.endTime
      } catch (e) {
        return false
      }
    }

    const filteredPointsRecords = pointsRecords.filter(r => {
      if (period === 'total') return !r.expired
      return (r.category === 'game' || r.category === 'season' || r.category === 'quiz' || r.category === 'classify' || r.category === 'signin') && inRange(r.time)
    })
    const points = filteredPointsRecords.reduce((sum, r) => {
      const p = r.remainingPoints != null ? r.remainingPoints : (r.points || 0)
      return sum + Math.max(0, p)
    }, 0)

    const filteredClassify = classifyRecords.filter(r => inRange(r.time))
    const classifyCount = filteredClassify.length

    const filteredQuiz = quizRecords.filter(r => inRange(r.time))
    const totalQuestions = filteredQuiz.reduce((sum, r) => sum + (r.totalQuestions || 0), 0)
    const totalCorrect = filteredQuiz.reduce((sum, r) => sum + (r.correctCount || 0), 0)
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

    const filteredGame = gameRecords.filter(r => inRange(r.time))
    const gameScore = filteredGame.length > 0
      ? Math.max(...filteredGame.map(r => r.score || 0))
      : 0

    const streakDays = period === 'total' ? this.getStreakDays() : (timeRange.endTime - timeRange.startTime) / (24 * 3600 * 1000) >= 6 ? Math.min(7, this.getStreakDays()) : this.getStreakDays()

    return {
      points: Math.round(points),
      accuracy,
      classifyCount,
      streakDays,
      gameScore
    }
  },

  getCurrentUserStats(period = 'total') {
    if (period === 'total') {
      const quizRecords = this.getQuizRecords()
      const classifyRecords = this.getClassifyRecords()
      const userInfo = this.globalData.userInfo

      const totalQuestions = quizRecords.reduce((sum, r) => sum + (r.totalQuestions || 0), 0)
      const totalCorrect = quizRecords.reduce((sum, r) => sum + (r.correctCount || 0), 0)
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

      const weekStart = new Date()
      weekStart.setHours(0, 0, 0, 0)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekStartStr = formatDate(weekStart, 'YYYY-MM-DD')
      const gameRecords = this.getGameRecords()
      const weekGameRecords = gameRecords.filter(r => r.time && r.time >= weekStartStr)
      const gameScore = weekGameRecords.length > 0
        ? Math.max(...weekGameRecords.map(r => r.score || 0))
        : 0

      return {
        points: userInfo ? userInfo.points : 0,
        accuracy,
        classifyCount: classifyRecords.length,
        streakDays: this.getStreakDays(),
        gameScore
      }
    }
    return this.getUserStatsByPeriod(period, this.getUserId())
  },

  initPKRecords() {
    const records = wx.getStorageSync('pkRecords')
    this.globalData.pkRecords = records || []
    console.log('[App] PK记录已加载', this.globalData.pkRecords.length, '条')
  },

  getPKRecords() {
    return this.globalData.pkRecords || []
  },

  addPKRecord(record) {
    this.globalData.pkRecords.unshift(record)
    wx.setStorageSync('pkRecords', this.globalData.pkRecords)
    console.log('[App] 新增PK记录')
  },

  getDailyPKCount() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const records = this.getPKRecords()
    return records.filter(r => r.time && r.time.startsWith(today)).length
  },

  getSameOpponentCountToday(opponentId) {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const records = this.getPKRecords()
    return records.filter(r =>
      r.time && r.time.startsWith(today) && r.opponentId === opponentId
    ).length
  },

  startPK() {
    const { PK_CONFIG, ANTI_CHEAT_CONFIG } = require('./utils/constants')

    if (this.getDailyPKCount() >= PK_CONFIG.maxDailyPK) {
      return { success: false, reason: 'daily_limit' }
    }

    const antiCheat = this.checkAntiCheat()
    if (!antiCheat.passed) {
      return { success: false, reason: 'anti_cheat', detail: antiCheat.reason }
    }

    const { getRandomQuestions } = require('./utils/constants')
    const questions = getRandomQuestions(PK_CONFIG.questionCount)

    const opponent = this.matchRandomOpponent()

    if (!opponent) {
      return { success: false, reason: 'no_opponent' }
    }

    const pkSession = {
      id: generateId(),
      opponentId: opponent.id,
      opponentName: opponent.nickName,
      opponentAvatarEmoji: opponent.avatarEmoji,
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        type: q.type || 'single',
        correctIndex: q.correctIndex,
        correctIndexes: q.correctIndexes || [],
        chapterId: q.chapterId,
        difficulty: q.difficulty
      })),
      startTime: Date.now(),
      myAnswers: [],
      myCorrectCount: 0,
      myTotalTime: 0,
      opponentCorrectCount: 0,
      opponentTotalTime: 0,
      status: 'playing',
      currentQuestionIndex: 0
    }

    this.globalData.currentPKSession = pkSession
    console.log('[App] PK匹配成功，对手:', opponent.nickName)

    return {
      success: true,
      session: pkSession,
      opponent
    }
  },

  matchRandomOpponent() {
    const { LEADERBOARD_USERS } = require('./utils/constants')
    const { PK_CONFIG } = require('./utils/constants')
    const currentUserId = this.getUserId()

    const candidates = LEADERBOARD_USERS.filter(u => u.id !== currentUserId)

    const eligible = candidates.filter(u => {
      const count = this.getSameOpponentCountToday(u.id)
      return count < PK_CONFIG.sameOpponentMaxPerDay
    })

    if (eligible.length === 0) {
      const idx = Math.floor(Math.random() * candidates.length)
      return candidates[idx] || null
    }

    const idx = Math.floor(Math.random() * eligible.length)
    return eligible[idx]
  },

  submitPKAnswer(questionIndex, answer, timeSpent) {
    const session = this.globalData.currentPKSession
    if (!session || session.status !== 'playing') {
      return { success: false, reason: 'no_session' }
    }

    const { ANTI_CHEAT_CONFIG } = require('./utils/constants')
    if (timeSpent < ANTI_CHEAT_CONFIG.minAnswerTime) {
      console.log('[App] 答题时间异常过短，可能作弊', timeSpent)
    }

    const question = session.questions[questionIndex]
    const { isQuestionCorrect } = require('./utils/constants')
    const isCorrect = isQuestionCorrect(question, answer)

    session.myAnswers.push({
      questionIndex,
      answer,
      isCorrect,
      timeSpent
    })

    if (isCorrect) {
      session.myCorrectCount++
    }
    session.myTotalTime += timeSpent
    session.currentQuestionIndex = questionIndex + 1

    return { success: true, isCorrect }
  },

  finishPK() {
    const { PK_CONFIG } = require('./utils/constants')
    const session = this.globalData.currentPKSession
    if (!session || session.status !== 'playing') {
      return { success: false, reason: 'no_session' }
    }

    const opponentCorrectRate = 0.5 + Math.random() * 0.4
    const opponentCorrectCount = Math.round(PK_CONFIG.questionCount * opponentCorrectRate)
    const opponentAvgTime = 3000 + Math.random() * 4000
    const opponentTotalTime = opponentAvgTime * PK_CONFIG.questionCount

    session.opponentCorrectCount = opponentCorrectCount
    session.opponentTotalTime = Math.round(opponentTotalTime)
    session.status = 'finished'

    const myAccuracy = session.myCorrectCount / PK_CONFIG.questionCount
    const opponentAccuracy = opponentCorrectCount / PK_CONFIG.questionCount

    let result = 'lose'
    let pointsEarned = PK_CONFIG.losePoints

    if (session.myCorrectCount > opponentCorrectCount) {
      result = 'win'
      pointsEarned = PK_CONFIG.winPoints
    } else if (session.myCorrectCount === opponentCorrectCount) {
      if (session.myTotalTime < session.opponentTotalTime) {
        result = 'win'
        pointsEarned = PK_CONFIG.winPoints
      } else if (session.myTotalTime === session.opponentTotalTime) {
        result = 'draw'
        pointsEarned = PK_CONFIG.drawPoints
      } else {
        result = 'lose'
        pointsEarned = PK_CONFIG.losePoints
      }
    }

    if (pointsEarned > 0) {
      this.updateUserPoints(pointsEarned, {
        category: 'pk',
        title: result === 'win' ? 'PK胜利' : result === 'draw' ? 'PK平局' : 'PK失败',
        desc: `与${session.opponentName}PK，${session.myCorrectCount}/${PK_CONFIG.questionCount}正确`,
        emoji: result === 'win' ? '🏆' : result === 'draw' ? '🤝' : '💪'
      })
    }

    const pkRecord = {
      id: session.id,
      opponentId: session.opponentId,
      opponentName: session.opponentName,
      opponentAvatarEmoji: session.opponentAvatarEmoji,
      myCorrectCount: session.myCorrectCount,
      opponentCorrectCount: session.opponentCorrectCount,
      myTotalTime: session.myTotalTime,
      opponentTotalTime: session.opponentTotalTime,
      totalQuestions: PK_CONFIG.questionCount,
      result,
      points: pointsEarned,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }

    this.addPKRecord(pkRecord)

    const pkResult = {
      session,
      result,
      pointsEarned,
      myCorrectCount: session.myCorrectCount,
      opponentCorrectCount: session.opponentCorrectCount,
      myTotalTime: session.myTotalTime,
      opponentTotalTime: session.opponentTotalTime,
      totalQuestions: PK_CONFIG.questionCount
    }

    this.globalData.currentPKSession = null
    console.log('[App] PK结束，结果:', result, '+', pointsEarned, '积分')

    return { success: true, pkResult }
  },

  initSeasonData() {
    const { SEASON_CONFIG } = require('./utils/constants')
    const stored = wx.getStorageSync('seasonData')
    const currentSeasonId = this.computeCurrentSeasonId()

    if (stored && stored.seasonId) {
      stored.historyMedals = stored.historyMedals || []
      stored.historySeasons = stored.historySeasons || []

      if (stored.seasonId === currentSeasonId) {
        this.globalData.seasonData = stored
        console.log('[App] 赛季数据已加载', stored.seasonId)
        return
      }

      console.log('[App] 检测到赛季切换:', stored.seasonId, '→', currentSeasonId)
      this.performSeasonSwitch(stored, currentSeasonId)
    } else {
      const newSeason = this.createNewSeasonData(currentSeasonId, [], [])
      this.globalData.seasonData = newSeason
      wx.setStorageSync('seasonData', newSeason)
      console.log('[App] 已初始化赛季数据', currentSeasonId)
    }
  },

  computeCurrentSeasonId() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    return `${year}-${String(month).padStart(2, '0')}`
  },

  createNewSeasonData(seasonId, historySeasons = [], historyMedals = []) {
    const { SEASON_CONFIG } = require('./utils/constants')
    const [yearStr, monthStr] = seasonId.split('-')
    const year = parseInt(yearStr)
    const month = parseInt(monthStr)
    const daysInMonth = new Date(year, month, 0).getDate()

    return {
      seasonId,
      seasonName: `${year}年${month}月赛季`,
      startDate: `${year}-${String(month).padStart(2, '0')}-01`,
      endDate: `${year}-${String(month).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`,
      medals: [],
      vouchers: [],
      historyMedals: [...historyMedals],
      historySeasons: [...historySeasons],
      resetDone: true,
      switchedAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
    }
  },

  performSeasonSwitch(oldSeasonData, newSeasonId) {
    this.globalData.seasonData = oldSeasonData

    this.processSeasonEnd(oldSeasonData)

    const archivedSeason = {
      seasonId: oldSeasonData.seasonId,
      seasonName: oldSeasonData.seasonName,
      startDate: oldSeasonData.startDate,
      endDate: oldSeasonData.endDate,
      userStats: this.computeSeasonUserStats(oldSeasonData.seasonId),
      archivedAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
    }

    const historySeasons = [archivedSeason, ...(oldSeasonData.historySeasons || [])]
      .filter((s, i, arr) => i === arr.findIndex(t => t.seasonId === s.seasonId))

    const historyMedals = [...(oldSeasonData.medals || []), ...(oldSeasonData.historyMedals || [])]
      .filter((m, i, arr) => i === arr.findIndex(t => t.id === m.id))

    const newSeason = this.createNewSeasonData(newSeasonId, historySeasons, historyMedals)

    this.globalData.seasonData = newSeason
    wx.setStorageSync('seasonData', newSeason)

    this.resetLeaderboardSeasonStats(newSeasonId)

    console.log('[App] ✅ 赛季切换完成（原子化）', oldSeasonData.seasonId, '→', newSeasonId,
      '历史赛季:', historySeasons.length, '个, 历史徽章:', historyMedals.length, '枚')
  },

  computeSeasonUserStats(seasonId) {
    const leaderboard = this.getLeaderboard('month', 'points')
    const userStats = {}
    leaderboard.list.forEach(u => {
      userStats[u.id] = {
        nickName: u.nickName,
        points: u.points,
        accuracy: u.accuracy,
        classifyCount: u.classifyCount,
        gameScore: u.gameScore
      }
    })
    return userStats
  },

  checkSeasonReset() {
    const currentSeasonId = this.computeCurrentSeasonId()
    const seasonData = this.globalData.seasonData

    if (!seasonData || !seasonData.seasonId) {
      const newSeason = this.createNewSeasonData(currentSeasonId, [], [])
      this.globalData.seasonData = newSeason
      wx.setStorageSync('seasonData', newSeason)
      return
    }

    if (seasonData.seasonId !== currentSeasonId) {
      console.log('[App] 触发赛季重置检测:', seasonData.seasonId, '→', currentSeasonId)
      this.performSeasonSwitch(seasonData, currentSeasonId)
    }
  },

  processSeasonEnd(seasonData) {
    const { SEASON_CONFIG } = require('./utils/constants')
    const seasonRange = this.getSeasonTimeRange(seasonData.seasonId)
    const leaderboard = this.getLeaderboard('month', 'points')
    const topList = leaderboard.list.slice(0, 3)

    const gameLeaderboard = this.getLeaderboard('month', 'gameScore')
    const gameTopList = gameLeaderboard.list.slice(0, 3)

    const seasonUserStats = {}
    leaderboard.list.forEach(u => {
      seasonUserStats[u.id] = {
        points: u.points,
        accuracy: u.accuracy,
        classifyCount: u.classifyCount,
        gameScore: u.gameScore
      }
    })

    const archivedSeason = {
      seasonId: seasonData.seasonId,
      seasonName: seasonData.seasonName,
      startDate: seasonRange.startDate,
      endDate: seasonRange.endDate,
      pointsRank: topList.map(u => ({ id: u.id, nickName: u.nickName, value: u.points, accuracy: u.accuracy, classifyCount: u.classifyCount })),
      gameRank: gameTopList.map(u => ({ id: u.id, nickName: u.nickName, value: u.gameScore })),
      userStats: seasonUserStats,
      archivedAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }

    if (!this.globalData.seasonData.historySeasons) {
      this.globalData.seasonData.historySeasons = []
    }
    this.globalData.seasonData.historySeasons.unshift(archivedSeason)

    topList.forEach((user, index) => {
      if (user.isCurrentUser) {
        const rank = index + 1
        const reward = SEASON_CONFIG.seasonTopReward[rank]
        if (reward) {
          this.updateUserPoints(reward, {
            category: 'season',
            title: `${seasonData.seasonName}赛季积分榜奖励`,
            desc: `赛季排名第${rank}名`,
            emoji: '🏅'
          })
        }

        const medal = {
          id: generateId(),
          name: `${SEASON_CONFIG.seasonMedalPrefix}·${seasonData.seasonName}积分榜`,
          icon: rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉',
          seasonId: seasonData.seasonId,
          type: 'points',
          rank,
          time: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
        }
        this.addSeasonMedal(medal, true)

        if (rank <= 3) {
          const voucher = {
            id: generateId(),
            name: `${seasonData.seasonName}兑换券`,
            points: SEASON_CONFIG.seasonVoucherPoints,
            seasonId: seasonData.seasonId,
            rank,
            used: false,
            time: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
          }
          this.addSeasonVoucher(voucher)
        }
      }
    })

    gameTopList.forEach((user, index) => {
      if (user.isCurrentUser) {
        const rank = index + 1
        const reward = SEASON_CONFIG.seasonGameReward && SEASON_CONFIG.seasonGameReward[rank]
        if (reward) {
          this.updateUserPoints(reward, {
            category: 'season',
            title: `${seasonData.seasonName}赛季游戏榜奖励`,
            desc: `游戏榜第${rank}名`,
            emoji: '🎮'
          })
        }

        const medal = {
          id: generateId(),
          name: `${SEASON_CONFIG.seasonMedalPrefix}·${seasonData.seasonName}游戏榜`,
          icon: rank === 1 ? '🎮' : rank === 2 ? '🕹️' : '🎯',
          seasonId: seasonData.seasonId,
          type: 'gameScore',
          rank,
          time: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
        }
        this.addSeasonMedal(medal, true)
      }
    })

    const currentMedals = seasonData.medals || []
    currentMedals.forEach(m => {
      if (!this.globalData.seasonData.historyMedals.find(hm => hm.id === m.id)) {
        this.globalData.seasonData.historyMedals.push(m)
      }
    })

    this.globalData.seasonData.medals = []
    this.globalData.seasonData.vouchers = []

    wx.setStorageSync('seasonData', this.globalData.seasonData)
    console.log('[App] 赛季结算完成，当前赛季数据已归档清零', seasonData.seasonId)
  },

  addSeasonMedal(medal, saveToHistory = false) {
    if (!this.globalData.seasonData.medals) {
      this.globalData.seasonData.medals = []
    }
    this.globalData.seasonData.medals.push(medal)
    if (saveToHistory) {
      if (!this.globalData.seasonData.historyMedals) {
        this.globalData.seasonData.historyMedals = []
      }
      this.globalData.seasonData.historyMedals.push(medal)
    }
    wx.setStorageSync('seasonData', this.globalData.seasonData)
  },

  addSeasonVoucher(voucher) {
    if (!this.globalData.seasonData.vouchers) {
      this.globalData.seasonData.vouchers = []
    }
    this.globalData.seasonData.vouchers.push(voucher)
    wx.setStorageSync('seasonData', this.globalData.seasonData)
  },

  getSeasonInfo() {
    const seasonData = this.globalData.seasonData
    if (!seasonData) return null

    const now = new Date()
    const endDate = new Date(seasonData.endDate + 'T23:59:59')
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)))

    return {
      seasonId: seasonData.seasonId,
      seasonName: seasonData.seasonName,
      startDate: seasonData.startDate,
      endDate: seasonData.endDate,
      daysRemaining,
      medals: seasonData.medals || [],
      vouchers: seasonData.vouchers || [],
      historyMedals: seasonData.historyMedals || [],
      historySeasons: seasonData.historySeasons || []
    }
  },

  initAntiCheatData() {
    const stored = wx.getStorageSync('antiCheatData')
    const today = formatDate(new Date(), 'YYYY-MM-DD')

    if (stored && stored.date === today) {
      if (!stored.hourlyGameScores) stored.hourlyGameScores = {}
      if (!stored.tapTimestamps) stored.tapTimestamps = []
      if (!stored.gameSessions) stored.gameSessions = []
      if (!stored.flaggedActions) stored.flaggedActions = []
      this.globalData.antiCheatData = stored
    } else {
      this.globalData.antiCheatData = {
        date: today,
        hourlyScores: {},
        hourlyPKCount: {},
        hourlyGameScores: {},
        tapTimestamps: [],
        gameSessions: [],
        lastMatchOpponent: null,
        lastMatchTime: 0,
        flaggedActions: []
      }
      wx.setStorageSync('antiCheatData', this.globalData.antiCheatData)
    }
    console.log('[App] 防作弊数据已加载')
  },

  initGameRecords() {
    const records = wx.getStorageSync('gameRecords')
    if (records && Array.isArray(records)) {
      this.globalData.gameRecords = records
    } else {
      const now = new Date()
      const today = formatDate(now, 'YYYY-MM-DD')
      const yesterday = formatDate(new Date(now.getTime() - 86400000), 'YYYY-MM-DD')
      const twoDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 2), 'YYYY-MM-DD')

      this.globalData.gameRecords = [
        {
          id: generateId(),
          gameType: 'catch',
          gameName: '接垃圾',
          score: 120,
          rawScore: 150,
          flagged: false,
          flagReason: null,
          durationSeconds: 60,
          correctCount: 12,
          totalCount: 15,
          time: today + ' 16:30'
        },
        {
          id: generateId(),
          gameType: 'conveyor',
          gameName: '传送带',
          score: 85,
          rawScore: 85,
          flagged: false,
          flagReason: null,
          durationSeconds: 45,
          correctCount: 8,
          totalCount: 10,
          time: yesterday + ' 19:15'
        },
        {
          id: generateId(),
          gameType: 'match',
          gameName: '配对消消乐',
          score: 150,
          rawScore: 150,
          flagged: false,
          flagReason: null,
          durationSeconds: 90,
          correctCount: 15,
          totalCount: 15,
          time: twoDaysAgo + ' 20:00'
        }
      ]
      wx.setStorageSync('gameRecords', this.globalData.gameRecords)
    }
    console.log('[App] 游戏记录已加载', this.globalData.gameRecords.length, '条')
  },

  getGameRecords(memberId) {
    const all = this.globalData.gameRecords || []
    if (!memberId) return all
    const targetMemberId = memberId
    const isCurrentUser = targetMemberId === this.getUserId()
    if (isCurrentUser) {
      return all.filter(r => r.memberId === targetMemberId || r.memberId === undefined)
    }
    return all.filter(r => r.memberId === targetMemberId)
  },

  addGameRecord(record) {
    if (!record.memberId) {
      record.memberId = this.getUserId()
    }
    record.id = record.id || generateId()
    record.time = record.time || formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    this.globalData.gameRecords.unshift(record)
    wx.setStorageSync('gameRecords', this.globalData.gameRecords)
    console.log('[App] 新增游戏记录', record.gameName, record.score + '分', 'memberId:', record.memberId)

    const isCurrentUser = !record.memberId || record.memberId === this.getUserId()
    if (isCurrentUser && this.globalData.missionCenter) {
      this.incrementGamePlayForMission()
    }
  },

  initDailyGamePlays() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const stored = wx.getStorageSync('dailyGamePlays')

    if (stored && stored.date === today) {
      this.globalData.dailyGamePlays = stored
    } else {
      this.globalData.dailyGamePlays = {
        date: today,
        count: 0,
        types: {}
      }
      wx.setStorageSync('dailyGamePlays', this.globalData.dailyGamePlays)
    }
    console.log('[App] 每日游戏次数已加载', this.globalData.dailyGamePlays.count, '次')
  },

  getDailyGamePlays() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const dailyGamePlays = this.globalData.dailyGamePlays

    if (!dailyGamePlays || dailyGamePlays.date !== today) {
      this.initDailyGamePlays()
    }

    return this.globalData.dailyGamePlays
  },

  incrementDailyGamePlay(gameType) {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const dailyGamePlays = this.globalData.dailyGamePlays

    if (!dailyGamePlays || dailyGamePlays.date !== today) {
      this.initDailyGamePlays()
    }

    this.globalData.dailyGamePlays.count += 1
    if (!this.globalData.dailyGamePlays.types) {
      this.globalData.dailyGamePlays.types = {}
    }
    this.globalData.dailyGamePlays.types[gameType] = (this.globalData.dailyGamePlays.types[gameType] || 0) + 1
    wx.setStorageSync('dailyGamePlays', this.globalData.dailyGamePlays)
    console.log('[App] 每日游戏次数已更新', this.globalData.dailyGamePlays.count, '次')
  },

  recordAntiCheatGameTap(gameType) {
    const { ANTI_CHEAT_CONFIG } = require('./utils/constants')
    if (!this.globalData.antiCheatData) return { normal: true }

    const now = Date.now()
    const data = this.globalData.antiCheatData
    if (!data.tapTimestamps) data.tapTimestamps = []

    data.tapTimestamps.push({ time: now, gameType })
    const windowStart = now - ANTI_CHEAT_CONFIG.tapWindowMs
    data.tapTimestamps = data.tapTimestamps.filter(t => t.time >= windowStart)

    const recentTaps = data.tapTimestamps.filter(t => t.gameType === gameType || true)
    const tapCount = recentTaps.length
    const windowSeconds = ANTI_CHEAT_CONFIG.tapWindowMs / 1000
    const tapsPerSecond = tapCount / windowSeconds

    let normal = true
    let reason = null

    if (tapCount >= ANTI_CHEAT_CONFIG.abnormalTapThreshold) {
      normal = false
      reason = 'abnormal_tap_frequency'
    } else if (tapsPerSecond >= ANTI_CHEAT_CONFIG.maxTapsPerSecond) {
      normal = false
      reason = 'abnormal_tap_speed'
    }

    if (!normal) {
      if (!data.flaggedActions) data.flaggedActions = []
      data.flaggedActions.push({
        time: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        type: reason,
        gameType,
        detail: { tapCount, tapsPerSecond: tapsPerSecond.toFixed(2) }
      })
    }

    wx.setStorageSync('antiCheatData', data)
    return { normal, reason, tapCount, tapsPerSecond: tapsPerSecond.toFixed(2) }
  },

  checkGameAntiCheat(gameType, gameScore, durationSeconds, correctCount, totalCount) {
    const { ANTI_CHEAT_CONFIG } = require('./utils/constants')
    if (!this.globalData.antiCheatData) return { passed: true }

    const data = this.globalData.antiCheatData
    const now = new Date()
    const hourKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}`

    if (durationSeconds < ANTI_CHEAT_CONFIG.minGameDurationSeconds && gameScore > 50) {
      return {
        passed: false,
        reason: 'abnormal_game_duration',
        message: '游戏时长异常，成绩作废'
      }
    }

    const hourlyGameScore = (data.hourlyGameScores && data.hourlyGameScores[hourKey]) || 0
    if (hourlyGameScore + gameScore > ANTI_CHEAT_CONFIG.maxGameScorePerHour) {
      return {
        passed: false,
        reason: 'abnormal_game_score_hourly',
        message: '每小时游戏得分异常，请稍后再试'
      }
    }

    if (totalCount > 10 && correctCount === totalCount && totalCount > ANTI_CHEAT_CONFIG.maxPerfectStreakSuspicious) {
      if (!data.flaggedActions) data.flaggedActions = []
      data.flaggedActions.push({
        time: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
        type: 'suspicious_perfect_score',
        gameType,
        detail: { totalCount, correctCount }
      })
      wx.setStorageSync('antiCheatData', data)
    }

    return { passed: true }
  },

  recordAntiCheatGameScore(points) {
    const now = new Date()
    const hourKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}`

    if (!this.globalData.antiCheatData) return
    const data = this.globalData.antiCheatData
    if (!data.hourlyGameScores) {
      data.hourlyGameScores = {}
    }
    data.hourlyGameScores[hourKey] = (data.hourlyGameScores[hourKey] || 0) + points
    wx.setStorageSync('antiCheatData', data)
  },

  addGamePoints(points, gameType, gameName, extra = {}) {
    const { durationSeconds, correctCount, totalCount } = extra
    const antiCheat = this.checkGameAntiCheat(gameType, points, durationSeconds, correctCount, totalCount)
    let actualPoints = points
    let flagged = false
    let flagReason = null

    if (!antiCheat.passed) {
      actualPoints = Math.floor(points * 0.2)
      flagged = true
      flagReason = antiCheat.reason
      console.log('[App] 反作弊触发，分数削减为', actualPoints, '原因:', antiCheat.reason)
    }

    const actualResult = this.addPoints(actualPoints, 'game')
    if (actualResult.success && actualResult.points > 0) {
      this.addGameRecord({
        gameType: gameType,
        gameName: gameName,
        score: actualResult.points,
        rawScore: points,
        flagged,
        flagReason,
        durationSeconds,
        correctCount,
        totalCount
      })
      this.recordAntiCheatGameScore(actualResult.points)
    }
    if (actualResult.success) {
      this.incrementGamePlayForMission()
    }
    return { ...actualResult, flagged, flagReason, originalPoints: points }
  },

  getGroupGameLeaderboard(groupId, period = 'week', dimension = 'gameScore') {
    const { LEADERBOARD_CONFIG } = require('./utils/constants')
    const members = this.getGroupMembers(groupId) || []
    const groups = this.globalData.userGroups || []
    const group = groups.find(g => g.id === groupId)
    const myUserId = this.getUserId()
    const seasonInfo = this.getSeasonInfo()

    const timeRange = this.getPeriodTimeRange(period, seasonInfo ? seasonInfo.seasonId : null)

    const memberStats = members.map(member => {
      const isCurrentUser = member.userId === myUserId
      let memberRecords = []

      if (isCurrentUser) {
        memberRecords = this.getGameRecords()
      } else if (group && group.memberGameRecords && group.memberGameRecords[member.userId]) {
        memberRecords = group.memberGameRecords[member.userId] || []
      }

      const inRange = (recordTime) => {
        if (!recordTime) return false
        try {
          const t = new Date(recordTime.replace(/-/g, '/')).getTime()
          return t >= timeRange.startTime && t <= timeRange.endTime
        } catch (e) { return false }
      }

      const filteredRecords = memberRecords.filter(r => inRange(r.time))

      let gameScore = 0
      let weeklyTotal = 0
      let plays = 0

      if (isCurrentUser) {
        const periodStats = this.getCurrentUserStats(period)
        gameScore = periodStats.gameScore || 0
        weeklyTotal = periodStats.points || 0
        plays = filteredRecords.length
      } else {
        const seasonId = timeRange.seasonId
        if (group && group.memberSeasonStats && group.memberSeasonStats[member.userId] && group.memberSeasonStats[member.userId][seasonId] && period === 'month') {
          const s = group.memberSeasonStats[member.userId][seasonId]
          gameScore = s.gameScore || 0
          weeklyTotal = s.points || 0
          plays = s.plays || 0
        } else if (group && group.memberWeekStats && group.memberWeekStats[member.userId] && period === 'week') {
          const s = group.memberWeekStats[member.userId]
          gameScore = s.gameScore || 0
          weeklyTotal = s.points || 0
          plays = s.plays || 0
        } else {
          gameScore = filteredRecords.length > 0 ? Math.max(...filteredRecords.map(r => r.score || 0)) : 0
          weeklyTotal = filteredRecords.reduce((s, r) => s + (r.score || 0), 0)
          plays = filteredRecords.length
        }
      }

      const totalGameScore = memberRecords.length > 0
        ? Math.max(...memberRecords.map(r => r.score || 0))
        : 0

      const stats = {
        id: member.userId,
        nickName: member.nickName || '组员',
        avatarEmoji: member.avatarEmoji || '🌱',
        role: member.role,
        gameScore,
        totalGameScore,
        weeklyTotal,
        plays,
        isCurrentUser
      }

      return stats
    })

    memberStats.sort((a, b) => {
      const aVal = a[dimension] || 0
      const bVal = b[dimension] || 0
      if (bVal !== aVal) return bVal - aVal
      return (b.plays || 0) - (a.plays || 0)
    })

    const ranked = memberStats.map((m, i) => ({ ...m, rank: i + 1 }))
    const myRank = ranked.find(m => m.isCurrentUser)

    return {
      list: ranked,
      myRank: myRank ? myRank.rank : ranked.length + 1,
      myData: myRank || null,
      period,
      dimension,
      startDate: timeRange.startDate,
      endDate: timeRange.endDate,
      seasonId: timeRange.seasonId
    }
  },

  initRecycleOrders() {
    const orders = wx.getStorageSync('recycleOrders')
    this.globalData.recycleOrders = orders || []
    console.log('[App] 回收订单数据已加载', this.globalData.recycleOrders.length, '条')
  },

  saveRecycleOrders() {
    if (!this.globalData.recycleOrders) {
      this.globalData.recycleOrders = []
    }
    wx.setStorageSync('recycleOrders', this.globalData.recycleOrders)
  },

  getRecycleOrders() {
    if (!this.globalData.recycleOrders) {
      this.globalData.recycleOrders = []
    }
    return this.globalData.recycleOrders
  },

  getRecycleOrdersByStatus(status) {
    const orders = this.getRecycleOrders()
    if (status === 'all') return orders
    return orders.filter(o => o.status === status)
  },

  getRecycleOrderById(orderId) {
    const orders = this.getRecycleOrders()
    return orders.find(o => o.id === orderId)
  },

  calculateRecyclePoints(categoryId, quantity, options = {}) {
    const { RECYCLE_CATEGORIES, RECYCLE_POINTS_CONFIG } = require('./utils/constants')
    const category = RECYCLE_CATEGORIES.find(c => c.id === categoryId)
    if (!category) return RECYCLE_POINTS_CONFIG.minPoints

    let points = category.basePoints + category.pointsPerItem * Math.max(0, quantity - 1)
    points = Math.floor(points * (category.bonusMultiplier || 1))

    if (options.hasPhoto) {
      points += RECYCLE_POINTS_CONFIG.photoBonus || 0
    }
    if (category.isLargeItem) {
      points += RECYCLE_POINTS_CONFIG.largeItemBonus || 0
    }
    if (RECYCLE_POINTS_CONFIG.categoryBonus && RECYCLE_POINTS_CONFIG.categoryBonus[categoryId]) {
      points += RECYCLE_POINTS_CONFIG.categoryBonus[categoryId]
    }

    points = Math.max(RECYCLE_POINTS_CONFIG.minPoints, Math.min(RECYCLE_POINTS_CONFIG.maxPoints, points))
    return points
  },

  getPointsBreakdown(categoryId, quantity, options = {}) {
    const { RECYCLE_CATEGORIES, RECYCLE_POINTS_CONFIG } = require('./utils/constants')
    const category = RECYCLE_CATEGORIES.find(c => c.id === categoryId)
    if (!category) return []

    const breakdown = []
    const base = category.basePoints + category.pointsPerItem * Math.max(0, quantity - 1)
    breakdown.push({ label: '基础积分', points: base, emoji: '💰' })

    if (category.bonusMultiplier && category.bonusMultiplier > 1) {
      const multiplierBonus = Math.floor(base * (category.bonusMultiplier - 1))
      if (multiplierBonus > 0) {
        breakdown.push({ label: `${category.name}品类加成(${category.bonusMultiplier}x)`, points: multiplierBonus, emoji: '✨' })
      }
    }

    if (category.isLargeItem && RECYCLE_POINTS_CONFIG.largeItemBonus) {
      breakdown.push({ label: '大件搬运补贴', points: RECYCLE_POINTS_CONFIG.largeItemBonus, emoji: '🚛' })
    }

    if (RECYCLE_POINTS_CONFIG.categoryBonus && RECYCLE_POINTS_CONFIG.categoryBonus[categoryId]) {
      breakdown.push({ label: '高额品类奖励', points: RECYCLE_POINTS_CONFIG.categoryBonus[categoryId], emoji: '🎁' })
    }

    if (options.hasPhoto && RECYCLE_POINTS_CONFIG.photoBonus) {
      breakdown.push({ label: '照片估价补贴', points: RECYCLE_POINTS_CONFIG.photoBonus, emoji: '📷' })
    }

    if (options.isCompleted && RECYCLE_POINTS_CONFIG.completeBonus) {
      breakdown.push({ label: '完成履约奖励', points: RECYCLE_POINTS_CONFIG.completeBonus, emoji: '✅' })
    }

    return breakdown
  },

  assignCollector(categoryId) {
    const { RECYCLE_COLLECTORS } = require('./utils/constants')
    const onlineCollectors = RECYCLE_COLLECTORS.filter(c => c.isOnline)
    if (onlineCollectors.length === 0) return RECYCLE_COLLECTORS[0]

    const matchingCollectors = onlineCollectors.filter(c =>
      !c.specialties || c.specialties.length === 0 || c.specialties.includes(categoryId)
    )

    const pool = matchingCollectors.length > 0 ? matchingCollectors : onlineCollectors
    return pool[Math.floor(Math.random() * pool.length)]
  },

  addRecycleOrder(orderData) {
    try {
      const { RECYCLE_ORDER_STATUS, RECYCLE_DISPATCH_CONFIG, RECYCLE_DISPATCH_STATUS } = require('./utils/constants')

      if (!this.globalData.recycleOrders) {
        this.globalData.recycleOrders = []
      }
      if (!this.globalData.recycleDispatchTimers) {
        this.globalData.recycleDispatchTimers = {}
      }

      const points = this.calculateRecyclePoints(orderData.categoryId, orderData.quantity || 1, {
        hasPhoto: orderData.photos && orderData.photos.length > 0
      })
      const pointsBreakdown = this.getPointsBreakdown(orderData.categoryId, orderData.quantity || 1, {
        hasPhoto: orderData.photos && orderData.photos.length > 0
      })

      const dispatchMode = orderData.dispatchMode || this.globalData.recycleDispatchMode || RECYCLE_DISPATCH_CONFIG.defaultMode
      const dispatchStatus = dispatchMode === 'simulate' ? 'accepted' : 'pending'

      const newOrder = {
        id: 'recycle_' + generateId(),
        orderNo: 'HS' + Date.now().toString().slice(-10) + Math.floor(Math.random() * 1000),
        categoryId: orderData.categoryId,
        categoryName: orderData.categoryName,
        categoryEmoji: orderData.categoryEmoji,
        quantity: orderData.quantity || 1,
        appointmentDate: orderData.appointmentDate,
        appointmentPeriodId: orderData.appointmentPeriodId,
        appointmentPeriodName: orderData.appointmentPeriodName,
        appointmentTimeSlot: orderData.appointmentTimeSlot,
        appointmentTimeName: orderData.appointmentTimeName,
        address: orderData.address,
        contactName: orderData.contactName,
        contactPhone: orderData.contactPhone,
        remark: orderData.remark || '',
        photos: orderData.photos || [],
        estimatedPoints: points,
        estimatedPointsBreakdown: pointsBreakdown,
        actualPoints: 0,
        actualPointsBreakdown: [],
        status: 'pending',
        statusText: RECYCLE_ORDER_STATUS.pending.text,
        collector: null,
        cancelReason: '',
        cancelPenalty: 0,
        dispatchMode: dispatchMode,
        dispatchStatus: dispatchStatus,
        dispatchStatusText: RECYCLE_DISPATCH_STATUS[dispatchStatus.toUpperCase()] ? RECYCLE_DISPATCH_STATUS[dispatchStatus.toUpperCase()].text : '待派单',
        dispatchAttempts: 0,
        dispatchHistory: [],
        createTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
        statusHistory: [
          { status: 'pending', time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'), desc: '订单已提交，等待工作人员确认' }
        ]
      }

      if (dispatchMode === 'simulate') {
        newOrder.collector = this.assignCollector(orderData.categoryId)
        newOrder.dispatchHistory.push({
          status: 'accepted',
          time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
          collectorId: newOrder.collector.id,
          collectorName: newOrder.collector.name,
          desc: '模拟派单：系统自动分配回收员'
        })
      }

      this.globalData.recycleOrders.unshift(newOrder)
      this.saveRecycleOrders()
      console.log('[App] 新增回收订单', newOrder.orderNo, '派单模式:', dispatchMode, '预估积分:', points)
      return newOrder
    } catch (e) {
      console.error('[App] 新增回收订单异常', e)
      return null
    }
  },

  canTransitionStatus(currentStatus, targetStatus) {
    const { RECYCLE_ORDER_STATUS_FLOW } = require('./utils/constants')
    const allowed = RECYCLE_ORDER_STATUS_FLOW[currentStatus] || []
    return allowed.includes(targetStatus)
  },

  updateRecycleOrderStatus(orderId, status, extra = {}) {
    const { RECYCLE_ORDER_STATUS, RECYCLE_POINTS_CONFIG } = require('./utils/constants')
    const order = this.getRecycleOrderById(orderId)
    if (!order) return false

    if (!this.canTransitionStatus(order.status, status)) {
      console.warn('[App] 非法状态转换:', order.status, '->', status)
      return false
    }

    if (order.dispatchMode === 'real') {
      if ((status === 'visiting' || status === 'completed') && order.dispatchStatus !== 'accepted') {
        console.warn('[App] 真实派单模式下，回收员未接单不能推进订单状态:', order.dispatchStatus)
        return false
      }
    }

    const statusInfo = RECYCLE_ORDER_STATUS[status]
    if (!statusInfo) return false

    order.status = status
    order.statusText = statusInfo.text

    const nowStr = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    const statusDescs = {
      pending: '订单已提交，等待工作人员确认',
      appointed: '订单已确认，回收员已分配，等待上门回收',
      visiting: '回收人员已出发，正在上门途中',
      completed: '回收完成，积分已发放到账',
      cancelled: '订单已取消'
    }

    order.statusHistory.push({
      status: status,
      time: nowStr,
      desc: extra.desc || statusDescs[status] || ''
    })

    if (status === 'appointed') {
      order.appointTime = nowStr
      if (!order.collector) {
        order.collector = this.assignCollector(order.categoryId)
      }
    }
    if (status === 'visiting') {
      order.visitTime = nowStr
    }
    if (status === 'completed') {
      order.completeTime = nowStr
      const hasPhoto = order.photos && order.photos.length > 0
      const bonusPoints = this.calculateRecyclePoints(order.categoryId, order.quantity || 1, {
        hasPhoto,
        isCompleted: true
      })
      const breakdown = this.getPointsBreakdown(order.categoryId, order.quantity || 1, {
        hasPhoto,
        isCompleted: true
      })
      order.actualPoints = bonusPoints
      order.actualPointsBreakdown = breakdown

      this.updateUserPoints(bonusPoints, {
        category: 'recycle',
        title: '上门回收奖励',
        desc: `${order.categoryName}回收完成，共${order.quantity}件`,
        emoji: order.categoryEmoji || '♻️'
      })
    }

    this.saveRecycleOrders()
    console.log('[App] 回收订单状态更新', orderId, '->', status)
    return true
  },

  calculateCancelPenalty(order) {
    const { RECYCLE_CANCEL_RULES } = require('./utils/constants')
    if (order.status === 'completed') {
      return { allowed: false, penaltyPoints: 0, rule: RECYCLE_CANCEL_RULES.rules[3] }
    }

    const now = Date.now()
    let appointmentTimestamp = null

    if (order.appointmentDate && order.appointmentTimeSlot) {
      const { RECYCLE_TIME_SLOTS } = require('./utils/constants')
      let slotInfo = null
      for (const period in RECYCLE_TIME_SLOTS) {
        const slot = RECYCLE_TIME_SLOTS[period].find(s => s.id === order.appointmentTimeSlot)
        if (slot) { slotInfo = slot; break }
      }
      if (slotInfo) {
        const dateStr = order.appointmentDate
        const [y, m, d] = dateStr.split('-').map(Number)
        appointmentTimestamp = new Date(y, m - 1, d, slotInfo.startHour, 0, 0).getTime()
      }
    }

    let hoursDiff = 25
    if (appointmentTimestamp) {
      hoursDiff = (appointmentTimestamp - now) / (1000 * 60 * 60)
    }

    let rule
    let penaltyRate = 0
    let allowed = true

    if (order.status === 'visiting') {
      rule = RECYCLE_CANCEL_RULES.rules[2]
      penaltyRate = RECYCLE_CANCEL_RULES.visitingCancelPenaltyRate
      allowed = true
    } else if (hoursDiff >= RECYCLE_CANCEL_RULES.freeCancelHours) {
      rule = RECYCLE_CANCEL_RULES.rules[0]
      penaltyRate = 0
      allowed = true
    } else if (hoursDiff >= 2) {
      rule = RECYCLE_CANCEL_RULES.rules[1]
      penaltyRate = RECYCLE_CANCEL_RULES.lateCancelPenaltyRate
      allowed = true
    } else {
      rule = RECYCLE_CANCEL_RULES.rules[2]
      penaltyRate = RECYCLE_CANCEL_RULES.visitingCancelPenaltyRate
      allowed = true
    }

    let penaltyPoints = Math.floor(order.estimatedPoints * penaltyRate)
    penaltyPoints = Math.max(RECYCLE_CANCEL_RULES.minPointsDeduction, Math.min(RECYCLE_CANCEL_RULES.maxPointsDeduction, penaltyPoints))
    if (penaltyRate === 0) penaltyPoints = 0

    return { allowed, penaltyPoints, rule, hoursDiff, rate: penaltyRate }
  },

  updateRecycleOrderPhotos(orderId, photos) {
    const order = this.getRecycleOrderById(orderId)
    if (!order) return false
    order.photos = photos || []
    this.saveRecycleOrders()
    console.log('[App] 回收订单照片已更新', orderId, photos ? photos.length : 0, '张')
    return true
  },

  setRecycleDispatchMode(mode) {
    const { RECYCLE_DISPATCH_MODE } = require('./utils/constants')
    const validModes = Object.keys(RECYCLE_DISPATCH_MODE).map(k => RECYCLE_DISPATCH_MODE[k].id)
    if (!validModes.includes(mode)) {
      console.warn('[App] 无效的派单模式:', mode)
      return false
    }
    this.globalData.recycleDispatchMode = mode
    wx.setStorageSync('recycleDispatchMode', mode)
    console.log('[App] 派单模式已切换为:', mode)
    return true
  },

  switchOrderDispatchMode(orderId, newMode) {
    const { RECYCLE_DISPATCH_MODE, RECYCLE_DISPATCH_STATUS } = require('./utils/constants')
    const validModes = Object.keys(RECYCLE_DISPATCH_MODE).map(k => RECYCLE_DISPATCH_MODE[k].id)
    if (!validModes.includes(newMode)) {
      return { success: false, message: '无效的派单模式' }
    }

    const order = this.getRecycleOrderById(orderId)
    if (!order) {
      return { success: false, message: '订单不存在' }
    }

    if (order.status !== 'pending') {
      return { success: false, message: '仅待确认订单可切换派单模式' }
    }

    if (order.dispatchMode === newMode) {
      return { success: true, message: '已是该派单模式', order }
    }

    this.clearDispatchTimer(orderId)

    order.dispatchMode = newMode
    order.dispatchAttempts = 0
    order.dispatchHistory = []

    if (newMode === 'simulate') {
      order.dispatchStatus = 'accepted'
      order.dispatchStatusText = RECYCLE_DISPATCH_STATUS.ACCEPTED.text
      order.collector = this.assignCollector(order.categoryId)
      order.dispatchHistory.push({
        status: 'accepted',
        time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
        collectorId: order.collector.id,
        collectorName: order.collector.name,
        desc: '切换为模拟派单：系统自动分配回收员'
      })
    } else {
      order.dispatchStatus = 'pending'
      order.dispatchStatusText = RECYCLE_DISPATCH_STATUS.PENDING.text
      order.collector = null
      order.dispatchHistory.push({
        status: 'pending',
        time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
        desc: '切换为真实派单：等待发起派单'
      })
    }

    this.saveRecycleOrders()
    this.setRecycleDispatchMode(newMode)
    console.log('[App] 订单派单模式切换成功', orderId, '->', newMode)
    return { success: true, order }
  },

  getRecycleDispatchMode() {
    if (!this.globalData.recycleDispatchMode) {
      const savedMode = wx.getStorageSync('recycleDispatchMode')
      if (savedMode) {
        this.globalData.recycleDispatchMode = savedMode
      }
    }
    return this.globalData.recycleDispatchMode
  },

  getAvailableCollectors(categoryId) {
    const { RECYCLE_COLLECTORS } = require('./utils/constants')
    const onlineCollectors = RECYCLE_COLLECTORS.filter(c => c.isOnline)
    if (onlineCollectors.length === 0) {
      return []
    }
    const matchingCollectors = onlineCollectors.filter(c =>
      !c.specialties || c.specialties.length === 0 || c.specialties.includes(categoryId)
    )
    const result = matchingCollectors.length > 0 ? matchingCollectors : onlineCollectors
    console.log('[App] 获取可接单回收员', result.length, '人，品类:', categoryId)
    return result
  },

  dispatchRecycleOrder(orderId, collectorId) {
    const { RECYCLE_DISPATCH_STATUS, RECYCLE_DISPATCH_CONFIG, RECYCLE_COLLECTORS } = require('./utils/constants')
    const order = this.getRecycleOrderById(orderId)
    if (!order) {
      return { success: false, message: '订单不存在' }
    }
    if (order.dispatchMode !== 'real') {
      return { success: false, message: '非真实派单模式，无需手动派单' }
    }
    if (order.dispatchAttempts >= RECYCLE_DISPATCH_CONFIG.maxDispatchAttempts) {
      return { success: false, message: `已达最大派单次数(${RECYCLE_DISPATCH_CONFIG.maxDispatchAttempts}次)` }
    }

    let collector = null
    if (collectorId) {
      collector = RECYCLE_COLLECTORS.find(c => c.id === collectorId)
      if (!collector) {
        return { success: false, message: '指定的回收员不存在' }
      }
    } else {
      const available = this.getAvailableCollectors(order.categoryId)
      if (available.length === 0) {
        this.updateDispatchStatus(order, 'failed', null, '无可用回收员')
        return { success: false, message: '暂无可用回收员' }
      }
      collector = available[Math.floor(Math.random() * available.length)]
    }

    order.dispatchAttempts += 1
    order.collector = collector
    this.updateDispatchStatus(order, 'dispatching', collector, `正在向${collector.name}派单`)

    this.clearDispatchTimer(orderId)
    const timer = setTimeout(() => {
      const currentOrder = this.getRecycleOrderById(orderId)
      if (currentOrder && currentOrder.dispatchStatus === 'dispatching') {
        this.updateDispatchStatus(currentOrder, 'timeout', collector, '回收员未及时接单，派单超时')
        console.log('[App] 派单超时', orderId, '回收员:', collector.id)
      }
    }, RECYCLE_DISPATCH_CONFIG.dispatchTimeoutSeconds * 1000)
    this.globalData.recycleDispatchTimers[orderId] = timer

    this.saveRecycleOrders()
    console.log('[App] 订单派单成功', orderId, '回收员:', collector.id, '尝试次数:', order.dispatchAttempts)
    return { success: true, collector, attempts: order.dispatchAttempts }
  },

  acceptRecycleDispatch(orderId) {
    const order = this.getRecycleOrderById(orderId)
    if (!order) {
      return { success: false, message: '订单不存在' }
    }
    if (order.dispatchStatus !== 'dispatching') {
      return { success: false, message: '当前订单不在派单中' }
    }
    if (!order.collector) {
      return { success: false, message: '未分配回收员' }
    }

    this.clearDispatchTimer(orderId)
    this.updateDispatchStatus(order, 'accepted', order.collector, `${order.collector.name}已接单`)

    if (order.status === 'pending') {
      this.updateRecycleOrderStatus(orderId, 'appointed', {
        desc: `回收员${order.collector.name}已接单，等待上门`
      })
    }

    this.saveRecycleOrders()
    console.log('[App] 回收员接单成功', orderId, order.collector.id)
    return { success: true }
  },

  rejectRecycleDispatch(orderId, reason = '') {
    const { RECYCLE_DISPATCH_CONFIG } = require('./utils/constants')
    const order = this.getRecycleOrderById(orderId)
    if (!order) {
      return { success: false, message: '订单不存在' }
    }
    if (order.dispatchStatus !== 'dispatching') {
      return { success: false, message: '当前订单不在派单中' }
    }

    this.clearDispatchTimer(orderId)
    const rejectReason = reason || RECYCLE_DISPATCH_CONFIG.rejectReasons[0]
    this.updateDispatchStatus(order, 'rejected', order.collector, `${order.collector.name}拒单：${rejectReason}`)

    const collector = order.collector
    order.collector = null
    this.saveRecycleOrders()

    console.log('[App] 回收员拒单', orderId, '原因:', rejectReason)
    return { success: true, reason: rejectReason, canRetry: order.dispatchAttempts < RECYCLE_DISPATCH_CONFIG.maxDispatchAttempts }
  },

  retryDispatchRecycleOrder(orderId) {
    const { RECYCLE_DISPATCH_CONFIG } = require('./utils/constants')
    const order = this.getRecycleOrderById(orderId)
    if (!order) {
      return { success: false, message: '订单不存在' }
    }
    if (order.dispatchAttempts >= RECYCLE_DISPATCH_CONFIG.maxDispatchAttempts) {
      this.updateDispatchStatus(order, 'failed', null, `超过最大派单次数(${RECYCLE_DISPATCH_CONFIG.maxDispatchAttempts}次)，派单失败`)
      return { success: false, message: '已达最大派单次数' }
    }
    return this.dispatchRecycleOrder(orderId)
  },

  updateDispatchStatus(order, status, collector, desc = '') {
    const { RECYCLE_DISPATCH_STATUS } = require('./utils/constants')
    const statusInfo = RECYCLE_DISPATCH_STATUS[status.toUpperCase()]
    if (!statusInfo) return

    order.dispatchStatus = status
    order.dispatchStatusText = statusInfo.text

    const nowStr = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    order.dispatchHistory.push({
      status,
      time: nowStr,
      collectorId: collector ? collector.id : null,
      collectorName: collector ? collector.name : null,
      desc: desc || statusInfo.desc
    })
  },

  clearDispatchTimer(orderId) {
    const timer = this.globalData.recycleDispatchTimers[orderId]
    if (timer) {
      clearTimeout(timer)
      delete this.globalData.recycleDispatchTimers[orderId]
    }
  },

  cancelRecycleOrder(orderId, reason = '') {
    const order = this.getRecycleOrderById(orderId)
    if (!order) return { success: false, message: '订单不存在' }

    const { allowed, penaltyPoints, rule } = this.calculateCancelPenalty(order)
    if (!allowed) {
      return { success: false, message: rule ? rule.desc : '该订单不可取消' }
    }

    order.status = 'cancelled'
    order.statusText = '已取消'
    order.cancelTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    order.cancelReason = reason || '用户主动取消'
    order.cancelPenalty = penaltyPoints
    order.statusHistory.push({
      status: 'cancelled',
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      desc: `订单已取消，原因: ${order.cancelReason}${penaltyPoints > 0 ? `，扣除${penaltyPoints}积分违约金` : ''}`
    })

    if (penaltyPoints > 0) {
      const currentPoints = this.getUserPoints()
      const actualDeduction = Math.min(currentPoints, penaltyPoints)
      if (actualDeduction > 0) {
        this.updateUserPoints(-actualDeduction, {
          category: 'recycle_cancel',
          title: '回收订单取消违约金',
          desc: `${order.categoryName}订单号${order.orderNo}取消`,
          emoji: '❌'
        })
      }
    }

    this.saveRecycleOrders()
    console.log('[App] 回收订单已取消', orderId, '违约金:', penaltyPoints)
    return { success: true, penaltyPoints, rule }
  },

  simulateRecycleProgress() {
    const pendingOrders = this.getRecycleOrdersByStatus('pending')
    const appointedOrders = this.getRecycleOrdersByStatus('appointed')
    const visitingOrders = this.getRecycleOrdersByStatus('visiting')
    const now = Date.now()

    pendingOrders.forEach(order => {
      if (order.dispatchMode === 'real') {
        if (order.dispatchStatus !== 'accepted') return
      }

      const orderTime = new Date(order.createTime).getTime()
      const timeDiff = now - orderTime
      const minutesDiff = timeDiff / (1000 * 60)
      if (minutesDiff >= 1) {
        this.updateRecycleOrderStatus(order.id, 'appointed', {
          desc: order.dispatchMode === 'real' && order.collector
            ? `回收员${order.collector.name}已接单，订单确认`
            : '系统自动确认订单，已为您分配回收员'
        })
      }
    })

    appointedOrders.forEach(order => {
      if (order.dispatchMode === 'real') return

      const appointTime = order.appointTime ? new Date(order.appointTime).getTime() : 0
      if (appointTime > 0) {
        const timeDiff = now - appointTime
        const minutesDiff = timeDiff / (1000 * 60)
        if (minutesDiff >= 2) {
          this.updateRecycleOrderStatus(order.id, 'visiting', {
            desc: `${order.collector ? order.collector.name : '回收员'}已出发，正在前往您的地址`
          })
        }
      }
    })

    visitingOrders.forEach(order => {
      if (order.dispatchMode === 'real') return

      const visitTime = order.visitTime ? new Date(order.visitTime).getTime() : 0
      if (visitTime > 0) {
        const timeDiff = now - visitTime
        const minutesDiff = timeDiff / (1000 * 60)
        if (minutesDiff >= 3) {
          this.updateRecycleOrderStatus(order.id, 'completed', {
            desc: '回收完成，积分已发放至您的账户'
          })
        }
      }
    })
  },

  initLearningProgress() {
    const progress = wx.getStorageSync('learningProgress')
    this.globalData.learningProgress = progress || {}
    console.log('[App] 学习进度已加载', Object.keys(this.globalData.learningProgress).length, '门课程')
  },

  saveLearningProgress() {
    wx.setStorageSync('learningProgress', this.globalData.learningProgress)
  },

  getLearningProgress() {
    return this.globalData.learningProgress || {}
  },

  getCourseProgress(courseId) {
    return this.globalData.learningProgress[courseId] || { completedChapters: [], lastChapter: null, lastTime: 0 }
  },

  markChapterCompleted(courseId, chapterId, chapterDuration = 0) {
    const progress = this.getCourseProgress(courseId)
    const isFirstTime = !progress.completedChapters.includes(chapterId)

    if (isFirstTime) {
      progress.completedChapters.push(chapterId)
    }
    progress.lastChapter = chapterId
    progress.lastTime = Date.now()
    progress.totalDuration = (progress.totalDuration || 0) + (isFirstTime ? chapterDuration : 0)

    this.globalData.learningProgress[courseId] = progress
    this.saveLearningProgress()

    if (isFirstTime && chapterDuration > 0) {
      const studyPoints = Math.min(20, Math.max(5, Math.floor(chapterDuration / 2)))
      this.updateUserPoints(studyPoints, {
        category: 'learning',
        title: '章节学习奖励',
        desc: `完成章节学习，时长约${chapterDuration}分钟`,
        emoji: '📖'
      })
    }

    console.log('[App] 章节已完成', courseId, chapterId, '首次:', isFirstTime)
    return { isFirstTime, progress }
  },

  isChapterCompleted(courseId, chapterId) {
    const progress = this.getCourseProgress(courseId)
    return progress.completedChapters.includes(chapterId)
  },

  isChapterUnlocked(courseId, chapterIndex, chapters) {
    if (chapterIndex <= 0) return true
    const prevChapter = chapters[chapterIndex - 1]
    if (!prevChapter) return false
    return this.isChapterCompleted(courseId, prevChapter.id)
  },

  isCourseFullyLearned(courseId, totalChapters) {
    const progress = this.getCourseProgress(courseId)
    return progress.completedChapters.length >= totalChapters
  },

  getMemberCourseProgress(memberId) {
    const { COURSES } = require('./data/courses')
    const targetMemberId = memberId || this.getUserId()
    const isCurrentUser = targetMemberId === this.getUserId()
    const categoryMap = {
      kitchen: { id: 3, name: '厨余垃圾', emoji: '🍂', color: '#5BBD72' },
      harmful: { id: 2, name: '有害垃圾', emoji: '☣️', color: '#E85D5D' },
      recyclable: { id: 1, name: '可回收物', emoji: '♻️', color: '#4A90D9' },
      other: { id: 4, name: '其他垃圾', emoji: '🗑️', color: '#8E8E93' }
    }

    const memberQuizRecords = this.getQuizRecords(targetMemberId)
    const memberClassifyRecords = this.getClassifyRecords(targetMemberId)

    return COURSES.filter(c => c.categoryId && ['kitchen', 'harmful', 'recyclable', 'other'].includes(c.categoryId)).map(course => {
      let progress = 0
      const totalChapters = course.totalChapters || (course.chapters ? course.chapters.length : 0)

      if (isCurrentUser) {
        const courseProgress = this.getCourseProgress(course.id)
        const completed = courseProgress.completedChapters ? courseProgress.completedChapters.length : 0
        progress = totalChapters > 0 ? Math.round((completed / totalChapters) * 100) : 0
      } else {
        const category = categoryMap[course.categoryId]
        let categoryQuizCount = 0
        let categoryClassifyCount = 0
        if (category) {
          categoryQuizCount = memberQuizRecords.filter(r =>
            r.chapterId === category.id || r.chapterName === category.name
          ).reduce((s, r) => s + (r.totalQuestions || 0), 0)
          categoryClassifyCount = memberClassifyRecords.filter(r => r.typeId === category.id).length
        }
        const totalActivity = categoryQuizCount + categoryClassifyCount
        const baselinePerChapter = 5
        const estimated = totalChapters > 0 ? Math.min(100, Math.round(((totalActivity / baselinePerChapter) / totalChapters) * 100)) : 0
        progress = estimated
      }

      const category = categoryMap[course.categoryId] || { id: 0, name: course.title, emoji: '📚', color: '#9B59B6' }

      return {
        id: course.id,
        name: course.title,
        categoryId: category.id,
        categoryName: category.name,
        emoji: course.icon || category.emoji,
        color: category.color,
        progress
      }
    })
  },

  getLearningStats() {
    const progress = this.getLearningProgress()
    const { COURSES } = require('./data/courses')
    const certs = this.getCertificates()

    let completedCourses = 0
    let totalMinutes = 0

    COURSES.forEach(course => {
      const p = progress[course.id]
      if (p) {
        totalMinutes += p.totalDuration || 0
        if (p.completedChapters.length >= course.totalChapters) {
          completedCourses++
        }
      }
    })

    return {
      completedCourses,
      certificates: certs.length,
      totalMinutes,
      inProgressCourses: Object.keys(progress).filter(id => {
        const p = progress[id]
        const course = COURSES.find(c => c.id === id)
        return course && p.completedChapters.length > 0 && p.completedChapters.length < course.totalChapters
      }).length
    }
  },

  initCertificates() {
    let certs = wx.getStorageSync('certificates') || []
    certs = certs.map(cert => {
      if (!cert.verifyCode) {
        cert.verifyCode = 'VC' + (cert.certNo || cert.id || generateId()).slice(-8)
      }
      if (!cert.issueAt) {
        cert.issueAt = cert.issueTime || new Date(cert.issueDate || Date.now()).toISOString()
      }
      if (cert.revoked === undefined && cert.revokeAt === undefined) {
        cert.revokeAt = null
      }
      if (cert.revoked && !cert.revokeAt) {
        cert.revokeAt = new Date().toISOString()
      }
      return cert
    })
    this.globalData.certificates = certs
    this.saveCertificates()
    console.log('[App] 证书数据已加载', this.globalData.certificates.length, '张')
  },

  saveCertificates() {
    wx.setStorageSync('certificates', this.globalData.certificates)
  },

  getCertificates() {
    return this.globalData.certificates || []
  },

  getCertificateById(certId) {
    return this.globalData.certificates.find(c => c.id === certId)
  },

  getCertificateByCourse(courseId) {
    return this.globalData.certificates.find(c => c.courseId === courseId)
  },

  grantCertificate(course, accuracy) {
    const existing = this.getCertificateByCourse(course.id)
    if (existing) {
      console.log('[App] 该课程证书已存在，跳过发放')
      return existing
    }

    const certId = 'cert_' + generateId()
    const now = new Date()
    const { COURSE_CATEGORIES } = require('./data/courses')
    const category = COURSE_CATEGORIES.find(c => c.id === course.categoryId) || COURSE_CATEGORIES[0]
    const userInfo = this.globalData.userInfo || {}

    const rawNo = 'CERT' + Date.now().toString().slice(-10) + Math.floor(Math.random() * 1000)
    const certificate = {
      id: certId,
      certNo: rawNo,
      verifyCode: 'VC' + rawNo.slice(-8),
      courseId: course.id,
      courseTitle: course.title,
      certificateName: course.certificateName,
      certificateLevel: course.certificateLevel,
      categoryId: course.categoryId,
      categoryColor: category.color,
      categoryIcon: category.icon,
      holderName: userInfo.nickName || '环保达人',
      holderAvatar: userInfo.avatarUrl || '',
      totalDuration: course.totalDuration,
      totalChapters: course.totalChapters,
      accuracy: accuracy || 100,
      pointsReward: course.pointsReward || 0,
      issueDate: formatDate(now, 'YYYY-MM-DD'),
      issueTime: formatDate(now, 'YYYY-MM-DD HH:mm:ss'),
      issueAt: now.toISOString(),
      expireDate: formatDate(new Date(now.getTime() + 365 * 24 * 3600 * 1000), 'YYYY-MM-DD'),
      revokeAt: null,
      issuer: '垃圾分类培训认证中心',
      instructor: course.instructor ? course.instructor.name : ''
    }

    this.globalData.certificates.unshift(certificate)
    this.saveCertificates()

    if (course.pointsReward && course.pointsReward > 0) {
      this.updateUserPoints(course.pointsReward, {
        category: 'certificate',
        title: '结业证书奖励',
        desc: `通过《${course.title}》获得「${course.certificateName}」证书`,
        emoji: '🏆'
      })
    }

    this.addSystemMessage('🎓 获得新证书', `恭喜您通过《${course.title}》考核，获得「${course.certificateName}」${course.certificateLevel}证书！`, {
      type: 'certificate',
      link: `/pages/certificate/certificate?certId=${certId}`
    })

    const achievement = {
      id: 'ach_cert_first',
      name: '初出茅庐',
      desc: '获得第一张结业证书',
      icon: '🎓',
      points: 50,
      unlockedAt: formatDate(now, 'YYYY-MM-DD HH:mm')
    }
    this.unlockAchievement(achievement)

    console.log('[App] 证书已发放', certId, certificate.certificateName)
    return certificate
  },

  initVerifyLogs() {
    let logs = wx.getStorageSync('certVerifyLogs') || []
    const now = Date.now()
    const windowMs = 60 * 1000
    logs = logs.filter(log => now - log.timestamp < windowMs)
    this.globalData.certVerifyLogs = logs
    this.globalData.verifyRateLimit = {
      windowMs: windowMs,
      maxPerWindow: 20
    }
    wx.setStorageSync('certVerifyLogs', logs)
    console.log('[App] 验真日志初始化完成，窗口内记录:', logs.length)
  },

  addVerifyLog(logEntry) {
    const log = {
      id: generateId(),
      timestamp: Date.now(),
      ...logEntry
    }
    const logs = this.globalData.certVerifyLogs || []
    const now = Date.now()
    const verifyRateLimit = this.globalData.verifyRateLimit || {}
    const windowMs = verifyRateLimit.windowMs || 60 * 1000
    const filtered = logs.filter(l => now - l.timestamp < windowMs)
    filtered.push(log)
    this.globalData.certVerifyLogs = filtered
    wx.setStorageSync('certVerifyLogs', filtered)

    const allLogs = wx.getStorageSync('certVerifyHistoryLogs') || []
    allLogs.push(log)
    if (allLogs.length > 1000) {
      allLogs.splice(0, allLogs.length - 1000)
    }
    wx.setStorageSync('certVerifyHistoryLogs', allLogs)
    return log
  },

  checkRateLimit(requesterKey) {
    const limit = this.globalData.verifyRateLimit || { windowMs: 60 * 1000, maxPerWindow: 20 }
    const logs = this.globalData.certVerifyLogs || []
    const now = Date.now()
    const windowMs = limit.windowMs

    const windowLogs = logs.filter(l => now - l.timestamp < windowMs)
    const totalInWindow = windowLogs.length
    const byRequester = windowLogs.filter(l => l.requesterKey === requesterKey).length

    return {
      allowed: totalInWindow < limit.maxPerWindow && byRequester < 10,
      totalInWindow,
      byRequester,
      maxPerWindow: limit.maxPerWindow,
      maxPerRequester: 10
    }
  },

  maskNickName(nickName) {
    if (!nickName) return '***'
    if (nickName.length <= 1) return nickName + '**'
    if (nickName.length === 2) return nickName[0] + '*'
    const maskLen = Math.max(1, Math.floor(nickName.length / 2))
    const start = Math.floor((nickName.length - maskLen) / 2)
    let result = ''
    for (let i = 0; i < nickName.length; i++) {
      result += (i >= start && i < start + maskLen) ? '*' : nickName[i]
    }
    return result
  },

  verifyCertificate(query) {
    const requesterKey = this.getDeviceId() || 'anon'
    const rateCheck = this.checkRateLimit(requesterKey)

    if (!rateCheck.allowed) {
      this.addVerifyLog({
        requesterKey,
        query,
        success: false,
        errorCode: 'RATE_LIMIT',
        errorMsg: '查询次数过多，请稍后再试'
      })
      return {
        valid: false,
        errorCode: 'RATE_LIMIT',
        errorMsg: '查询次数过多，请稍后再试',
        rateCheck
      }
    }

    if (!query) {
      this.addVerifyLog({
        requesterKey,
        query,
        success: false,
        errorCode: 'EMPTY_QUERY',
        errorMsg: '请输入证书编号或验证码'
      })
      return {
        valid: false,
        errorCode: 'EMPTY_QUERY',
        errorMsg: '请输入证书编号或验证码'
      }
    }

    const trimmed = String(query).trim().toUpperCase()
    const certs = this.getCertificates()

    const cert = certs.find(c =>
      (c.certNo && String(c.certNo).toUpperCase() === trimmed) ||
      (c.verifyCode && String(c.verifyCode).toUpperCase() === trimmed) ||
      (c.id && String(c.id).toUpperCase() === trimmed)
    )

    if (!cert) {
      this.addVerifyLog({
        requesterKey,
        query,
        success: false,
        errorCode: 'NOT_FOUND',
        errorMsg: '未找到该证书信息'
      })
      return {
        valid: false,
        errorCode: 'NOT_FOUND',
        errorMsg: '未找到该证书信息'
      }
    }

    if (cert.revokeAt) {
      this.addVerifyLog({
        requesterKey,
        query,
        certId: cert.id,
        certNo: cert.certNo,
        success: false,
        errorCode: 'REVOKED',
        errorMsg: '该证书已被撤销'
      })
      return {
        valid: false,
        errorCode: 'REVOKED',
        errorMsg: '该证书已被撤销',
        certificate: {
          certNo: cert.certNo,
          verifyCode: cert.verifyCode,
          holderMaskedName: this.maskNickName(cert.holderName),
          courseTitle: cert.courseTitle,
          certificateName: cert.certificateName,
          certificateLevel: cert.certificateLevel,
          issueDate: cert.issueDate,
          issueAt: cert.issueAt,
          revokeAt: cert.revokeAt,
          revoked: true
        }
      }
    }

    const now = new Date()
    if (cert.expireDate) {
      const expireDate = new Date(cert.expireDate)
      if (now > expireDate) {
        this.addVerifyLog({
          requesterKey,
          query,
          certId: cert.id,
          certNo: cert.certNo,
          success: false,
          errorCode: 'EXPIRED',
          errorMsg: '该证书已过期'
        })
        return {
          valid: false,
          errorCode: 'EXPIRED',
          errorMsg: '该证书已过期',
          certificate: {
            certNo: cert.certNo,
            verifyCode: cert.verifyCode,
            holderMaskedName: this.maskNickName(cert.holderName),
            courseTitle: cert.courseTitle,
            certificateName: cert.certificateName,
            certificateLevel: cert.certificateLevel,
            issueDate: cert.issueDate,
            issueAt: cert.issueAt,
            expireDate: cert.expireDate,
            expired: true
          }
        }
      }
    }

    this.addVerifyLog({
      requesterKey,
      query,
      certId: cert.id,
      certNo: cert.certNo,
      success: true,
      errorCode: null,
      errorMsg: null
    })

    return {
      valid: true,
      certificate: {
        certNo: cert.certNo,
        verifyCode: cert.verifyCode,
        holderMaskedName: this.maskNickName(cert.holderName),
        courseTitle: cert.courseTitle,
        certificateName: cert.certificateName,
        certificateLevel: cert.certificateLevel,
        issueDate: cert.issueDate,
        issueAt: cert.issueAt,
        expireDate: cert.expireDate,
        issuer: cert.issuer,
        accuracy: cert.accuracy,
        totalDuration: cert.totalDuration,
        categoryIcon: cert.categoryIcon,
        categoryColor: cert.categoryColor,
        revoked: false,
        expired: false
      }
    }
  },

  revokeCertificate(certId, reason = '') {
    const cert = this.getCertificateById(certId)
    if (!cert) {
      return { success: false, error: '证书不存在' }
    }
    if (cert.revokeAt) {
      return { success: false, error: '证书已被撤销' }
    }

    cert.revokeAt = new Date().toISOString()
    cert.revokeReason = reason
    this.saveCertificates()

    console.log('[App] 证书已撤销', certId, reason)
    return { success: true, certificate: cert }
  },

  getVerifyLink(certId) {
    const cert = this.getCertificateById(certId)
    if (!cert) return ''
    const code = cert.verifyCode || cert.certNo || certId
    return `/pages/certificate-verify/certificate-verify?code=${encodeURIComponent(code)}`
  },

  getVerifyHistory() {
    return wx.getStorageSync('certVerifyHistoryLogs') || []
  },

  checkAndGrantCertificate(chapterId, accuracy) {
    const { COURSES } = require('./data/courses')
    const course = COURSES.find(c => c.quizChapterId === Number(chapterId))
    if (!course) return null

    if (!this.isCourseFullyLearned(course.id, course.totalChapters)) {
      console.log('[App] 课程章节尚未全部学完，暂不发证')
      return null
    }

    if (accuracy < 60) {
      console.log('[App] 正确率不足60%，未通过考核', accuracy)
      return null
    }

    return this.grantCertificate(course, accuracy)
  },

  initMessageSystem() {
    this.globalData.messageManager = messageManager
    console.log('[App] 消息系统初始化完成')
  },

  checkPushStrategies() {
    console.log('[App] 检查推送策略')

    if (!this.isTodaySignedIn()) {
      const signInRecords = this.getSignInRecords()
      const today = formatDate(new Date(), 'YYYY-MM-DD')
      const yesterday = formatDate(new Date(Date.now() - 86400000), 'YYYY-MM-DD')
      const twoDaysAgo = formatDate(new Date(Date.now() - 86400000 * 2), 'YYYY-MM-DD')

      const missedYesterday = !signInRecords.includes(yesterday)
      const missedTwoDaysAgo = !signInRecords.includes(twoDaysAgo)

      if (missedYesterday && missedTwoDaysAgo) {
        if (messageManager.shouldSendSigninReminder()) {
          messageManager.addMessage({
            type: MESSAGE_TYPES.SIGNIN,
            title: '连续2天未签到提醒',
            content: '您已经连续2天没有签到啦！连续签到7天可获得额外50积分奖励，快去签到吧~',
            emoji: '⚠️',
            data: {
              link: '/pages/signin/signin'
            }
          })
          messageManager.updateSigninReminderTime()
          console.log('[App] 已推送连续2天未签到提醒')
        }
      } else if (!signInRecords.includes(today)) {
        if (messageManager.shouldSendSigninReminder()) {
          messageManager.addMessage({
            type: MESSAGE_TYPES.SIGNIN,
            title: '今日签到提醒',
            content: '今天还没有签到哦！签到可获得5积分奖励，连续签到还有额外奖励~',
            emoji: '📅',
            data: {
              link: '/pages/signin/signin'
            }
          })
          messageManager.updateSigninReminderTime()
          console.log('[App] 已推送今日签到提醒')
        }
      }
    }

    const tiered = this.getExpiringPointsTiered()
    let expireMessage = null
    let priority = 0

    if (tiered.within1Day.points > 0) {
      priority = 3
      expireMessage = {
        title: '积分今日过期提醒',
        content: `您有 ${tiered.within1Day.points} 积分将于今日过期，立即使用避免损失！`,
        emoji: '⚠️'
      }
    } else if (tiered.within7Days.points > 0 && tiered.within7Days.nearestDate) {
      priority = 2
      const date = new Date(tiered.within7Days.nearestDate)
      expireMessage = {
        title: '积分7天内过期提醒',
        content: `您有 ${tiered.within7Days.points} 积分将于 ${date.getMonth() + 1}月${date.getDate()}日 过期，快去积分商城兑换吧！`,
        emoji: '⏰'
      }
    } else if (tiered.within30Days.points > 0 && tiered.within30Days.nearestDate && tiered.totalExpiringWithin30 >= 50) {
      priority = 1
      const date = new Date(tiered.within30Days.nearestDate)
      expireMessage = {
        title: '积分即将过期提醒',
        content: `您有 ${tiered.totalExpiringWithin30} 积分将于 ${date.getMonth() + 1}月${date.getDate()}日 过期，及时使用哦~`,
        emoji: '🔔'
      }
    }

    if (expireMessage && messageManager.shouldSendPointsExpireReminder()) {
      messageManager.addMessage({
        type: MESSAGE_TYPES.POINTS_EXPIRE,
        title: expireMessage.title,
        content: expireMessage.content,
        emoji: expireMessage.emoji,
        data: {
          link: '/pages/points/points?tab=expiring'
        }
      })
      messageManager.updatePointsExpireReminderTime()
      console.log('[App] 已推送积分过期提醒（优先级' + priority + '）', tiered)
    }
  },

  addSystemMessage(title, content, data = {}) {
    return messageManager.addMessage({
      type: MESSAGE_TYPES.SYSTEM,
      title,
      content,
      emoji: '🔔',
      data
    })
  },

  addActivityMessage(title, content, activityId, link = '/pages/activity/activity') {
    return messageManager.addMessage({
      type: MESSAGE_TYPES.ACTIVITY,
      title,
      content,
      emoji: '🎉',
      data: {
        activityId,
        link,
        ...arguments[4] || {}
      }
    })
  },

  addQuizNewQuestionsMessage(title, content, chapterId = null) {
    return messageManager.addMessage({
      type: MESSAGE_TYPES.QUIZ,
      title,
      content,
      emoji: '📚',
      data: {
        chapterId,
        link: '/pages/quiz/quiz'
      }
    })
  },

  getUnreadMessageCount(type = null) {
    return messageManager.getUnreadCount(type)
  },

  getUnreadMessageCountByType() {
    return messageManager.getUnreadCountByType()
  },

  markMessageAsRead(messageId) {
    return messageManager.markAsRead(messageId)
  },

  markAllMessagesAsRead(type = null) {
    return messageManager.markAllAsRead(type)
  },

  deleteMessage(messageId) {
    return messageManager.deleteMessage(messageId)
  },

  getMessages(type = null) {
    return messageManager.getMessagesByType(type)
  },

  getSubscriptionSettings() {
    return messageManager.getAllSubscriptionSettings()
  },

  getSubscriptionSetting(key) {
    return messageManager.getSubscriptionSetting(key)
  },

  setSubscriptionSetting(key, value) {
    messageManager.setSubscriptionSetting(key, value)
  },

  requestSubscribeMessage(tmplIds = []) {
    return new Promise((resolve) => {
      if (typeof wx.requestSubscribeMessage !== 'function') {
        resolve({ success: false, reason: 'unsupported' })
        return
      }
      if (tmplIds.length === 0) {
        resolve({ success: false, reason: 'no_templates' })
        return
      }
      wx.requestSubscribeMessage({
        tmplIds,
        success: (res) => resolve({ success: true, result: res }),
        fail: (err) => resolve({ success: false, reason: 'fail', error: err })
      })
    })
  },

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    userRole: 'member',
    goodsList: [],
    addresses: [],
    orders: [],
    pointsRecords: [],
    classifyRecords: [],
    quizRecords: [],
    signInRecords: [],
    wrongQuestions: [],
    dailyPoints: null,
    masteredQuestions: [],
    dailyCompletionBonus: null,
    shareRecords: null,
    inviteRecords: [],
    deviceId: '',
    systemInfo: null,
    statusBarHeight: 0,
    screenHeight: 0,
    screenWidth: 0,
    unlockedAchievements: [],
    communityPosts: [],
    communityComments: {},
    communityReports: [],
    communityDailyPoints: null,
    leaderboardData: null,
    pkRecords: [],
    currentPKSession: null,
    seasonData: null,
    antiCheatData: null,
    gameRecords: [],
    dailyGamePlays: null,
    recycleOrders: [],
    learningProgress: {},
    certificates: [],
    messageManager: null,
    childModeEnabled: false,
    childModePIN: null,
    childTimeLimitMinutes: 60,
    childAgeGroup: '6to8',
    childBirthday: null,
    childUsageTracker: null,
    childModeLocked: false,
    childPINAttempts: 0,
    childPINLockUntil: 0,
    childDailyStats: null,
    unlockedBadges: [],
    userGroups: [],
    currentGroupId: null,
    groupInviteCodes: {},
    groupPointsPool: {},
    groupTasksProgress: {},
    encyclopediaNeedsRefresh: false,
    hotWordsNeedsRefresh: false,
    leaderboardNeedsRefresh: false,
    expireCheckTimer: null,
    currentCity: 'shanghai',
    currentCityInfo: null,
    hasUpcomingStandard: false,
    activityManager: null,
    flashSaleManager: null,
    activePointsDoubles: [],
    recycleDispatchMode: 'simulate',
    recycleDispatchTimers: {}
  },

  initChildMode() {
    const childModeEnabled = wx.getStorageSync('childModeEnabled') || false
    const userRole = wx.getStorageSync('userRole') || 'member'
    const childModePIN = wx.getStorageSync('childModePIN') || ''
    const childTimeLimitMinutes = wx.getStorageSync('childTimeLimitMinutes') || 60
    const childAgeGroup = wx.getStorageSync('childAgeGroup') || '6to8'
    const childBirthday = wx.getStorageSync('childBirthday') || null

    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const storedTracker = wx.getStorageSync('childUsageTracker') || {}
    const childUsageTracker = storedTracker.date === today ? storedTracker : {
      date: today,
      totalSeconds: 0,
      lastActiveAt: Date.now(),
      sessions: []
    }
    wx.setStorageSync('childUsageTracker', childUsageTracker)

    const storedDailyStats = wx.getStorageSync('childDailyStats') || {}
    const childDailyStats = storedDailyStats.date === today ? storedDailyStats : {
      date: today,
      quizTotal: 0,
      quizCorrect: 0,
      gameCount: 0,
      classifyCount: 0,
      learnSeconds: 0,
      coinsEarned: 0,
      badgesEarned: 0,
      extendedLimitMinutes: 0,
      extendedMap: {}
    }
    wx.setStorageSync('childDailyStats', childDailyStats)

    this.globalData.childModeEnabled = childModeEnabled
    this.globalData.userRole = userRole
    this.globalData.childModePIN = childModePIN
    this.globalData.childTimeLimitMinutes = childTimeLimitMinutes
    this.globalData.childAgeGroup = childAgeGroup
    this.globalData.childBirthday = childBirthday
    this.globalData.childUsageTracker = childUsageTracker
    this.globalData.childModeLocked = false
    this.globalData.childPINAttempts = 0
    this.globalData.childPINLockUntil = 0
    this.globalData.childDailyStats = childDailyStats

    console.log('[App] 儿童模式已加载:', { childModeEnabled, userRole, childTimeLimitMinutes, childAgeGroup })

    if (childModeEnabled) {
      this.startChildUsageTracking()
    }
  },

  isChildModeEnabled() {
    return this.globalData.childModeEnabled === true
  },

  setChildModeEnabled(enabled) {
    this.globalData.childModeEnabled = enabled === true
    wx.setStorageSync('childModeEnabled', this.globalData.childModeEnabled)

    if (enabled) {
      this.startChildUsageTracking()
    } else {
      this.stopChildUsageTracking()
      this.setChildModeLocked(false)
    }

    console.log('[App] 儿童模式已设置:', this.globalData.childModeEnabled ? '开启' : '关闭')
  },

  hasChildModePIN() {
    const pin = this.globalData.childModePIN || wx.getStorageSync('childModePIN')
    return pin && pin.length >= 4 && pin.length <= 6
  },

  verifyChildModePIN(inputPIN) {
    const { CHILD_PIN_CONFIG } = require('./utils/constants')
    const storedPIN = this.globalData.childModePIN || wx.getStorageSync('childModePIN') || CHILD_PIN_CONFIG.defaultPIN
    const now = Date.now()

    if (this.globalData.childPINLockUntil > now) {
      const remainSec = Math.ceil((this.globalData.childPINLockUntil - now) / 1000)
      return { success: false, locked: true, remainSeconds: remainSec, message: `输入次数过多，请${remainSec}秒后重试` }
    }

    if (inputPIN === storedPIN) {
      this.globalData.childPINAttempts = 0
      return { success: true, message: '验证通过' }
    }

    this.globalData.childPINAttempts = (this.globalData.childPINAttempts || 0) + 1
    const remainAttempts = CHILD_PIN_CONFIG.maxAttempts - this.globalData.childPINAttempts

    if (remainAttempts <= 0) {
      this.globalData.childPINLockUntil = now + CHILD_PIN_CONFIG.lockDurationMinutes * 60 * 1000
      return { success: false, locked: true, remainSeconds: CHILD_PIN_CONFIG.lockDurationMinutes * 60, message: `密码错误次数过多，请${CHILD_PIN_CONFIG.lockDurationMinutes}分钟后重试` }
    }

    return { success: false, remainAttempts, message: `密码错误，还剩${remainAttempts}次机会` }
  },

  setChildModePIN(newPIN) {
    const { CHILD_PIN_CONFIG } = require('./utils/constants')
    if (!newPIN || newPIN.length < CHILD_PIN_CONFIG.minLength || newPIN.length > CHILD_PIN_CONFIG.maxLength) {
      return { success: false, message: `PIN长度需为${CHILD_PIN_CONFIG.minLength}-${CHILD_PIN_CONFIG.maxLength}位` }
    }
    if (!/^\d+$/.test(newPIN)) {
      return { success: false, message: 'PIN只能包含数字' }
    }
    this.globalData.childModePIN = newPIN
    wx.setStorageSync('childModePIN', newPIN)
    return { success: true, message: 'PIN设置成功' }
  },

  requestWXAuthForChildMode(action) {
    return new Promise((resolve) => {
      wx.login({
        success: (loginRes) => {
          if (loginRes.code) {
            wx.getUserProfile({
              desc: '用于验证家长身份',
              success: (profileRes) => {
                resolve({ success: true, code: loginRes.code, userInfo: profileRes.userInfo, action })
              },
              fail: () => {
                resolve({ success: true, code: loginRes.code, userInfo: null, action, fallback: true })
              }
            })
          } else {
            resolve({ success: false, message: '微信登录失败' })
          }
        },
        fail: () => {
          resolve({ success: false, message: '微信授权失败' })
        }
      })
    })
  },

  getChildTimeLimit() {
    const baseLimit = this.globalData.childTimeLimitMinutes || 60
    const stats = this.globalData.childDailyStats || wx.getStorageSync('childDailyStats') || {}
    const extended = stats.extendedLimitMinutes || 0
    return baseLimit + extended
  },

  setChildTimeLimit(minutes) {
    const validOptions = [30, 60, 90]
    if (!validOptions.includes(minutes)) {
      return { success: false, message: '时长只能选择30/60/90分钟' }
    }
    this.globalData.childTimeLimitMinutes = minutes
    wx.setStorageSync('childTimeLimitMinutes', minutes)
    return { success: true, message: `已设置每日${minutes}分钟` }
  },

  getChildAgeGroup() {
    return this.globalData.childAgeGroup || '6to8'
  },

  getChildAgeGroupInfo() {
    const { CHILD_AGE_GROUPS } = require('./utils/constants')
    const groupId = this.getChildAgeGroup()
    return CHILD_AGE_GROUPS.find(g => g.id === groupId) || CHILD_AGE_GROUPS[1]
  },

  setChildAgeGroup(ageGroupId) {
    const { CHILD_AGE_GROUPS } = require('./utils/constants')
    const valid = CHILD_AGE_GROUPS.find(g => g.id === ageGroupId)
    if (!valid) {
      return { success: false, message: '无效的年龄分组' }
    }
    this.globalData.childAgeGroup = ageGroupId
    wx.setStorageSync('childAgeGroup', ageGroupId)
    return { success: true, message: `已设置为${valid.name}` }
  },

  shouldUseImageQuestions() {
    const ageInfo = this.getChildAgeGroupInfo()
    return this.isChildModeEnabled() && ageInfo.useImageQuestions === true
  },

  startChildUsageTracking() {
    this.stopChildUsageTracking()
    this._childUsageTimer = setInterval(() => {
      this.tickChildUsage()
    }, 1000)
    console.log('[App] 儿童模式时长追踪已启动')
  },

  stopChildUsageTracking() {
    if (this._childUsageTimer) {
      clearInterval(this._childUsageTimer)
      this._childUsageTimer = null
    }
  },

  tickChildUsage() {
    if (!this.isChildModeEnabled()) return

    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const tracker = this.globalData.childUsageTracker

    if (!tracker || tracker.date !== today) {
      this.resetChildDailyStats()
      return
    }

    tracker.totalSeconds = (tracker.totalSeconds || 0) + 1
    tracker.lastActiveAt = Date.now()
    this.globalData.childUsageTracker = tracker
    wx.setStorageSync('childUsageTracker', tracker)

    const limitSec = this.getChildTimeLimit() * 60
    if (tracker.totalSeconds >= limitSec && !this.isChildModeLocked()) {
      this.setChildModeLocked(true)
      console.log('[App] 儿童模式已达时长上限，自动锁定')
    }
  },

  getChildUsageTime() {
    const tracker = this.globalData.childUsageTracker || wx.getStorageSync('childUsageTracker') || {}
    return tracker.totalSeconds || 0
  },

  getChildRemainingTime() {
    const used = this.getChildUsageTime()
    const limit = this.getChildTimeLimit() * 60
    return Math.max(0, limit - used)
  },

  getChildUsagePercent() {
    const used = this.getChildUsageTime()
    const limit = this.getChildTimeLimit() * 60
    if (limit <= 0) return 0
    return Math.min(100, Math.round((used / limit) * 100))
  },

  formatUsageTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}分${s}秒`
  },

  isChildModeLocked() {
    return this.globalData.childModeLocked === true
  },

  setChildModeLocked(locked) {
    const wasLocked = this.globalData.childModeLocked === true
    this.globalData.childModeLocked = locked === true
    console.log('[App] 儿童模式锁定状态:', this.globalData.childModeLocked)

    if (locked && !wasLocked) {
      try {
        wx.showModal({
          title: '⏰ 今日使用时长已达上限',
          content: '今日使用时长已达上限，请家长输入PIN解锁。\n\n锁定后仅「分类学习」单页可使用，其他功能均已禁用。',
          confirmText: '家长解锁',
          cancelText: '分类学习',
          confirmColor: '#5BBD72',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/child-pin-verify/child-pin-verify?unlock=true'
              })
            } else {
              wx.switchTab({
                url: '/pages/classify/classify'
              })
            }
          },
          fail: () => {
            wx.navigateTo({
              url: '/pages/child-pin-verify/child-pin-verify?unlock=true'
            })
          }
        })
      } catch (e) {
        wx.navigateTo({
          url: '/pages/child-pin-verify/child-pin-verify?unlock=true'
        })
      }
    }
  },

  unlockChildModeWithPIN(pin) {
    const result = this.verifyChildModePIN(pin)
    if (result.success) {
      this.setChildModeLocked(false)
      return { success: true, message: '已解锁' }
    }
    return result
  },

  resetChildDailyStats() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const newTracker = {
      date: today,
      totalSeconds: 0,
      lastActiveAt: Date.now(),
      sessions: []
    }
    const newStats = {
      date: today,
      quizTotal: 0,
      quizCorrect: 0,
      gameCount: 0,
      classifyCount: 0,
      learnSeconds: 0,
      coinsEarned: 0,
      badgesEarned: 0
    }
    this.globalData.childUsageTracker = newTracker
    this.globalData.childDailyStats = newStats
    wx.setStorageSync('childUsageTracker', newTracker)
    wx.setStorageSync('childDailyStats', newStats)
    this.syncChildStatsToFamilyGroup()
  },

  recordChildQuiz(correct = false) {
    if (!this.isChildModeEnabled()) return
    const stats = this.globalData.childDailyStats || wx.getStorageSync('childDailyStats') || {}
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    stats.date = today
    stats.quizTotal = (stats.quizTotal || 0) + 1
    if (correct) stats.quizCorrect = (stats.quizCorrect || 0) + 1
    stats.learnSeconds = (stats.learnSeconds || 0) + 5
    this.globalData.childDailyStats = stats
    wx.setStorageSync('childDailyStats', stats)
    this.syncChildStatsToFamilyGroup()
  },

  recordChildGame() {
    if (!this.isChildModeEnabled()) return
    const stats = this.globalData.childDailyStats || wx.getStorageSync('childDailyStats') || {}
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    stats.date = today
    stats.gameCount = (stats.gameCount || 0) + 1
    this.globalData.childDailyStats = stats
    wx.setStorageSync('childDailyStats', stats)
    this.syncChildStatsToFamilyGroup()
  },

  recordChildClassify() {
    if (!this.isChildModeEnabled()) return
    const stats = this.globalData.childDailyStats || wx.getStorageSync('childDailyStats') || {}
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    stats.date = today
    stats.classifyCount = (stats.classifyCount || 0) + 1
    this.globalData.childDailyStats = stats
    wx.setStorageSync('childDailyStats', stats)
    this.syncChildStatsToFamilyGroup()
  },

  syncChildStatsToFamilyGroup() {
    const myId = this.getUserId()
    const group = this.getCurrentGroup()
    if (!group) return
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const stats = this.globalData.childDailyStats || wx.getStorageSync('childDailyStats') || {}
    const usedSeconds = this.getChildUsageTime()

    const todayStats = {
      date: today,
      usageSeconds: usedSeconds,
      timeLimitMinutes: this.getChildTimeLimit(),
      quizTotal: stats.quizTotal || 0,
      quizCorrect: stats.quizCorrect || 0,
      gameCount: stats.gameCount || 0,
      classifyCount: stats.classifyCount || 0,
      coinsEarned: stats.coinsEarned || 0,
      badgesEarned: stats.badgesEarned || 0,
      updatedAt: Date.now()
    }

    if (!group.members) group.members = []
    let member = group.members.find(m => (m.id || m.memberId) === myId)
    if (!member) {
      const userInfo = wx.getStorageSync('userInfo') || {}
      member = {
        id: myId,
        memberId: myId,
        nickName: userInfo.nickName || '小朋友',
        nickname: userInfo.nickName || '小朋友',
        avatarUrl: userInfo.avatarUrl || '',
        role: 'child',
        memberType: 'child',
        joinTime: today,
        dailyStats: {},
        createdAt: Date.now()
      }
      group.members.push(member)
      group.memberCount = group.members.length
    }

    if (!member.dailyStats) member.dailyStats = {}
    member.dailyStats[today] = todayStats
    member.lastUsageSeconds = usedSeconds
    member.lastActiveAt = Date.now()

    this.saveFamilyGroupData()
  },

  saveFamilyGroupData() {
    this._saveUserGroups()
  },

  getFamilyGroupData() {
    return this.getCurrentGroup() || { id: 'default', name: '我的家庭组', members: [], memberCount: 0 }
  },

  getFamilyGroupMembers() {
    const group = this.getCurrentGroup()
    if (!group) return []
    const myId = this.getUserId()
    const rawMembers = this.getGroupMembers(group.id) || []

    return rawMembers.map(m => {
      const memberId = m.id || m.memberId
      return {
        ...m,
        memberId,
        id: memberId,
        nickname: m.nickName || m.nickname || '成员',
        nickName: m.nickName || m.nickname || '成员',
        isMe: memberId === myId,
        dailyStats: m.dailyStats || {},
        role: m.role || 'member',
        memberType: m.memberType || m.role || 'member',
        age: m.age || null,
        avatarUrl: m.avatarUrl || ''
      }
    })
  },

  getChildTodayStats(memberId) {
    const ownerId = memberId || this.getUserId()
    const isCurrentUser = ownerId === this.getUserId()
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const timeLimit = this.getChildTimeLimit()
    const group = this.getFamilyGroupData()
    const member = (group.members || []).find(m => (m.id || m.memberId) === ownerId)
    const memberDailyStats = member && member.dailyStats && member.dailyStats[today]
      ? member.dailyStats[today]
      : null

    let stats
    if (isCurrentUser) {
      const localStats = this.globalData.childDailyStats || wx.getStorageSync('childDailyStats') || {}
      const usageSeconds = this.getChildUsageTime()
      const quizTotal = localStats.quizTotal || 0
      const quizCorrect = localStats.quizCorrect || 0

      stats = {
        date: today,
        usageSeconds,
        timeLimitMinutes: timeLimit,
        quizTotal,
        quizCorrect,
        gameCount: localStats.gameCount || 0,
        classifyCount: localStats.classifyCount || 0,
        coinsEarned: localStats.coinsEarned || 0,
        badgesEarned: localStats.badgesEarned || 0,
        remainingSeconds: this.getChildRemainingTime(),
        accuracy: quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0
      }
    } else if (memberDailyStats) {
      const usageSeconds = memberDailyStats.usageSeconds || 0
      const quizTotal = memberDailyStats.quizTotal || 0
      const quizCorrect = memberDailyStats.quizCorrect || 0
      const limitMinutes = memberDailyStats.timeLimitMinutes || timeLimit

      stats = {
        date: today,
        usageSeconds,
        timeLimitMinutes: limitMinutes,
        quizTotal,
        quizCorrect,
        gameCount: memberDailyStats.gameCount || 0,
        classifyCount: memberDailyStats.classifyCount || 0,
        coinsEarned: memberDailyStats.coinsEarned || 0,
        badgesEarned: memberDailyStats.badgesEarned || 0,
        remainingSeconds: Math.max(0, limitMinutes * 60 - usageSeconds),
        accuracy: quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0
      }
    } else {
      stats = {
        date: today,
        usageSeconds: 0,
        timeLimitMinutes: timeLimit,
        quizTotal: 0,
        quizCorrect: 0,
        gameCount: 0,
        classifyCount: 0,
        coinsEarned: 0,
        badgesEarned: 0,
        remainingSeconds: timeLimit * 60,
        accuracy: 0
      }
    }

    return stats
  },

  getChildStatsForGroupMember(memberId) {
    return this.getChildTodayStats(memberId)
  },

  isPageBlockedInChildMode(pagePath) {
    if (!this.isChildModeEnabled()) return { blocked: false }
    const { CHILD_BLOCKED_PAGES, CHILD_ALLOWED_PAGES_WHEN_LOCKED } = require('./utils/constants')

    const normalizedPath = (pagePath || '').replace(/^\//, '')

    if (this.isChildModeLocked()) {
      const allowed = CHILD_ALLOWED_PAGES_WHEN_LOCKED.some(p => normalizedPath.indexOf(p) === 0)
      if (!allowed) {
        return { blocked: true, reason: 'locked', message: '已超时锁定，仅可使用分类学习，请家长PIN解锁' }
      }
      return { blocked: false }
    }

    const blocked = CHILD_BLOCKED_PAGES.some(p => normalizedPath.indexOf(p) === 0)
    if (blocked) {
      return { blocked: true, reason: 'childMode', message: '儿童模式下暂不支持该功能' }
    }

    return { blocked: false }
  },

  safeNavigateTo(pagePath, params) {
    const check = this.isPageBlockedInChildMode(pagePath)
    if (check.blocked) {
      wx.showToast({ title: check.message, icon: 'none', duration: 2000 })
      return false
    }
    const { navigateTo } = require('./utils/util')
    navigateTo(pagePath, params)
    return true
  },

  extendChildDailyTimeLimit(addedMinutes) {
    const minutes = Math.max(10, Math.min(120, parseInt(addedMinutes) || 0))
    const todayStr = formatDate(new Date(), 'YYYY-MM-DD')
    const stats = this.globalData.childDailyStats || wx.getStorageSync('childDailyStats') || {}

    const extendedMap = Object.assign({}, stats.extendedMap || {})
    extendedMap[todayStr] = (extendedMap[todayStr] || 0) + minutes

    const newExtendedLimit = (stats.extendedLimitMinutes || 0) + minutes

    this.globalData.childDailyStats = Object.assign({}, stats, {
      extendedLimitMinutes: newExtendedLimit,
      extendedMap: extendedMap
    })
    wx.setStorageSync('childDailyStats', this.globalData.childDailyStats)
    this.syncChildStatsToFamilyGroup()

    if (this.isChildModeLocked()) {
      this.setChildModeLocked(false)
    }
    return minutes
  },

  getChildDailyStatsByDate(dateStr, memberId) {
    if (memberId) {
      const group = this.getFamilyGroupData()
      const member = (group.members || []).find(m => (m.id || m.memberId) === memberId)
      if (member && member.dailyStats && member.dailyStats[dateStr]) {
        const raw = member.dailyStats[dateStr]
        return {
          date: dateStr,
          usageSeconds: raw.usageSeconds || 0,
          timeLimitMinutes: raw.timeLimitMinutes || this.getChildTimeLimit(),
          quizTotal: raw.quizTotal || 0,
          quizCorrect: raw.quizCorrect || 0,
          gameCount: raw.gameCount || 0,
          classifyCount: raw.classifyCount || 0,
          coinsEarned: raw.coinsEarned || 0,
          badgesEarned: raw.badgesEarned || 0
        }
      }
      return {
        date: dateStr,
        usageSeconds: 0,
        timeLimitMinutes: this.getChildTimeLimit(),
        quizTotal: 0,
        quizCorrect: 0,
        gameCount: 0,
        classifyCount: 0,
        coinsEarned: 0,
        badgesEarned: 0
      }
    }

    const allStats = wx.getStorageSync('childDailyStatsHistory') || {}
    if (allStats[dateStr]) {
      const raw = allStats[dateStr]
      return {
        date: dateStr,
        usageSeconds: raw.usageSeconds || 0,
        timeLimitMinutes: raw.timeLimitMinutes || this.getChildTimeLimit(),
        quizTotal: raw.quizTotal || 0,
        quizCorrect: raw.quizCorrect || 0,
        gameCount: raw.gameCount || 0,
        classifyCount: raw.classifyCount || 0,
        coinsEarned: raw.coinsEarned || 0,
        badgesEarned: raw.badgesEarned || 0
      }
    }

    const todayStr = formatDate(new Date(), 'YYYY-MM-DD')
    if (dateStr === todayStr) {
      return this.getChildTodayStats()
    }

    return {
      date: dateStr,
      usageSeconds: 0,
      timeLimitMinutes: this.getChildTimeLimit(),
      quizTotal: 0,
      quizCorrect: 0,
      gameCount: 0,
      classifyCount: 0,
      coinsEarned: 0,
      badgesEarned: 0
    }
  },

  getFamilyGroupMembers() {
    const group = this.getFamilyGroupData()
    const myId = this.getUserId()
    const userInfo = wx.getStorageSync('userInfo') || {}
    const myName = userInfo.nickName || '我'

    const defaultMembers = [
      { memberId: myId, nickname: myName, avatarUrl: userInfo.avatarUrl || '', role: 'parent', memberType: 'parent', isMe: true, dailyStats: {}, createdAt: Date.now() },
      { memberId: 'child_001', nickname: '小乖', avatarUrl: '', role: 'child', memberType: 'child', age: 7, dailyStats: {}, createdAt: Date.now() },
      { memberId: 'child_002', nickname: '小宝', avatarUrl: '', role: 'child', memberType: 'child', age: 5, dailyStats: {}, createdAt: Date.now() }
    ]
    return group.members && group.members.length > 0 ? group.members : defaultMembers
  },

  getFamilyGroupData() {
    const stored = wx.getStorageSync('familyGroup')
    if (stored) return stored
    return { groupId: 'default_group', members: [], createdAt: Date.now() }
  },

  getMyVirtualBadges() {
    const { VIRTUAL_BADGES, ACHIEVEMENTS } = require('./utils/constants')
    const unlockedBadgeIds = wx.getStorageSync('unlockedBadges') || []
    this.globalData.unlockedBadges = unlockedBadgeIds

    const allBadges = []

    Object.values(VIRTUAL_BADGES).forEach(badge => {
      allBadges.push({
        id: badge.id,
        name: badge.name,
        icon: badge.icon,
        color: badge.color,
        desc: badge.desc,
        condition: badge.desc,
        unlocked: unlockedBadgeIds.includes(badge.id),
        progress: unlockedBadgeIds.includes(badge.id) ? 100 : 0,
        current: unlockedBadgeIds.includes(badge.id) ? 1 : 0,
        target: 1,
        obtainedTime: unlockedBadgeIds.includes(badge.id) ? this.getBadgeObtainedTime(badge.id) : null,
        progressText: unlockedBadgeIds.includes(badge.id) ? '已获得' : '未获得'
      })
    })

    const achievements = this.getAchievements()
    achievements.forEach(ach => {
      allBadges.push({
        id: ach.id,
        name: ach.name,
        icon: ach.emoji,
        color: ach.color || '#5BBD72',
        desc: ach.description,
        condition: ach.description,
        unlocked: ach.unlocked,
        progress: ach.progress,
        current: ach.current,
        target: ach.target,
        obtainedTime: ach.unlocked ? this.getBadgeObtainedTime(ach.id) : null,
        progressText: ach.unlocked ? '已获得' : `${ach.type === 'classifyCount' ? '分类' : ach.type === 'correctQuizCount' ? '答题' : ach.type === 'continuousSignIn' ? '签到' : ach.type === 'totalPoints' ? '积分' : '邀请'} ${ach.current}/${ach.target} 次`
      })
    })

    return allBadges
  },

  getBadgeObtainedTime(badgeId) {
    const badgeTimes = wx.getStorageSync('badgeObtainedTimes') || {}
    return badgeTimes[badgeId] || null
  },

  unlockBadge(badgeId) {
    const unlockedBadgeIds = wx.getStorageSync('unlockedBadges') || []
    if (!unlockedBadgeIds.includes(badgeId)) {
      unlockedBadgeIds.push(badgeId)
      wx.setStorageSync('unlockedBadges', unlockedBadgeIds)
      this.globalData.unlockedBadges = unlockedBadgeIds

      const badgeTimes = wx.getStorageSync('badgeObtainedTimes') || {}
      badgeTimes[badgeId] = formatDate(new Date(), 'YYYY-MM-DD')
      wx.setStorageSync('badgeObtainedTimes', badgeTimes)

      console.log('[App] 获得新勋章:', badgeId)
      return true
    }
    return false
  },

  /**
   * ============ 家庭/班级组系统 ============
   */

  initUserGroups() {
    const storedGroups = wx.getStorageSync('userGroups')
    const currentGroupId = wx.getStorageSync('currentGroupId')
    const groupInviteCodes = wx.getStorageSync('groupInviteCodes') || {}
    const groupPointsPool = wx.getStorageSync('groupPointsPool') || {}
    const groupTasksProgress = wx.getStorageSync('groupTasksProgress') || {}

    let groups = storedGroups
    if (!groups || groups.length === 0) {
      groups = this._createMockGroups()
      wx.setStorageSync('userGroups', groups)
    }

    this.globalData.userGroups = groups
    this.globalData.currentGroupId = currentGroupId || (groups.length > 0 ? groups[0].id : null)
    this.globalData.groupInviteCodes = groupInviteCodes
    this.globalData.groupPointsPool = groupPointsPool
    this.globalData.groupTasksProgress = groupTasksProgress

    if (!currentGroupId && groups.length > 0) {
      wx.setStorageSync('currentGroupId', groups[0].id)
    }

    this._checkWeeklyGroupTask()
    console.log('[App] 用户组系统已初始化', groups.length, '个组')
  },

  _createMockGroups() {
    const now = new Date()
    const today = formatDate(now, 'YYYY-MM-DD')
    const userId = this.getUserId()
    const userInfo = this.globalData.userInfo || {}

    const mockMembers = [
      { id: userId, memberId: userId, nickName: userInfo.nickName || '我', nickname: userInfo.nickName || '我', avatarUrl: userInfo.avatarUrl || '', role: 'owner', memberType: 'parent', joinTime: today, dailyStats: {} }
    ]

    if (Math.random() > 0.3) {
      const familyMembers = [
        { id: 'mem_parent_001', memberId: 'mem_parent_001', nickName: '爸爸', nickname: '爸爸', avatarUrl: '', role: 'parent', memberType: 'parent', joinTime: today, dailyStats: {} },
        { id: 'mem_parent_002', memberId: 'mem_parent_002', nickName: '妈妈', nickname: '妈妈', avatarUrl: '', role: 'parent', memberType: 'parent', joinTime: today, dailyStats: {} },
        { id: 'mem_child_001', memberId: 'mem_child_001', nickName: '小明', nickname: '小明', avatarUrl: '', role: 'child', memberType: 'child', age: 7, joinTime: today, dailyStats: {} }
      ]
      return [{
        id: 'grp_family_default',
        name: '幸福一家',
        type: 'family',
        ownerId: userId,
        members: [...mockMembers, ...familyMembers],
        createTime: today,
        memberCount: 4,
        totalPoints: 3280,
        weeklyNewPoints: 420
      }]
    }
    return []
  },

  _saveUserGroups() {
    wx.setStorageSync('userGroups', this.globalData.userGroups)
  },

  _saveCurrentGroupId() {
    wx.setStorageSync('currentGroupId', this.globalData.currentGroupId)
  },

  getMyGroups() {
    return this.globalData.userGroups || []
  },

  getCurrentGroup() {
    const groups = this.getMyGroups()
    const id = this.globalData.currentGroupId
    if (!id) return groups[0] || null
    return groups.find(g => g.id === id) || groups[0] || null
  },

  setCurrentGroup(groupId) {
    this.globalData.currentGroupId = groupId
    this._saveCurrentGroupId()
    console.log('[App] 切换到组:', groupId)
    return true
  },

  createGroup({ name, type }) {
    const { GROUP_TYPES } = require('./utils/constants')
    const typeInfo = GROUP_TYPES[type] || GROUP_TYPES.family
    const userInfo = this.globalData.userInfo || {}
    const userId = this.getUserId()
    const today = formatDate(new Date(), 'YYYY-MM-DD')

    const newGroup = {
      id: 'grp_' + generateId(),
      name: name || '我的' + typeInfo.name,
      type: type,
      ownerId: userId,
      members: [
        { id: userId, nickName: userInfo.nickName || '我', avatarUrl: userInfo.avatarUrl || '', role: 'owner', joinTime: today }
      ],
      createTime: today,
      memberCount: 1,
      totalPoints: 0,
      weeklyNewPoints: 0
    }

    const groups = this.getMyGroups()
    groups.unshift(newGroup)
    this.globalData.userGroups = groups
    this._saveUserGroups()

    this.globalData.currentGroupId = newGroup.id
    this._saveCurrentGroupId()

    this.globalData.groupPointsPool[newGroup.id] = {
      totalPoints: 0,
      weeklyPoints: 0,
      history: []
    }
    wx.setStorageSync('groupPointsPool', this.globalData.groupPointsPool)

    console.log('[App] 组创建成功:', newGroup.name)
    return newGroup
  },

  dismissGroup(groupId) {
    const group = this._findGroup(groupId)
    if (!group) return { success: false, message: '组不存在' }
    if (group.ownerId !== this.getUserId()) return { success: false, message: '只有创建者可以解散组' }

    const groups = this.getMyGroups().filter(g => g.id !== groupId)
    this.globalData.userGroups = groups
    this._saveUserGroups()

    if (this.globalData.currentGroupId === groupId) {
      this.globalData.currentGroupId = groups.length > 0 ? groups[0].id : null
      this._saveCurrentGroupId()
    }

    delete this.globalData.groupPointsPool[groupId]
    wx.setStorageSync('groupPointsPool', this.globalData.groupPointsPool)

    console.log('[App] 组已解散:', group.name)
    return { success: true }
  },

  leaveGroup(groupId) {
    const group = this._findGroup(groupId)
    if (!group) return { success: false, message: '组不存在' }
    if (group.ownerId === this.getUserId()) return { success: false, message: '创建者不能退出组，请解散' }

    const userId = this.getUserId()
    group.members = group.members.filter(m => m.id !== userId)
    group.memberCount = group.members.length
    this._saveUserGroups()

    const groups = this.getMyGroups().filter(g => g.id !== groupId)
    this.globalData.userGroups = groups
    this._saveUserGroups()

    if (this.globalData.currentGroupId === groupId) {
      this.globalData.currentGroupId = groups.length > 0 ? groups[0].id : null
      this._saveCurrentGroupId()
    }

    console.log('[App] 退出组成功:', group.name)
    return { success: true }
  },

  generateInviteCode(groupId) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    const codes = this.globalData.groupInviteCodes
    codes[code] = { groupId, expireAt: Date.now() + 7 * 24 * 3600 * 1000 }
    this.globalData.groupInviteCodes = codes
    wx.setStorageSync('groupInviteCodes', codes)

    console.log('[App] 生成邀请码:', code, '组ID:', groupId)
    return code
  },

  joinGroupByCode(inviteCode) {
    const code = (inviteCode || '').toUpperCase()
    const codes = this.globalData.groupInviteCodes
    const info = codes[code]

    if (!info) return { success: false, message: '邀请码无效' }
    if (info.expireAt < Date.now()) return { success: false, message: '邀请码已过期' }

    const group = this._findGroup(info.groupId)
    if (!group) return { success: false, message: '组不存在' }

    const userId = this.getUserId()
    if (group.members.find(m => m.id === userId)) return { success: false, message: '您已在该组中' }

    const userInfo = this.globalData.userInfo || {}
    group.members.push({
      id: userId,
      nickName: userInfo.nickName || '新成员',
      avatarUrl: userInfo.avatarUrl || '',
      role: 'member',
      joinTime: formatDate(new Date(), 'YYYY-MM-DD')
    })
    group.memberCount = group.members.length
    this._saveUserGroups()

    const groups = this.getMyGroups()
    if (!groups.find(g => g.id === group.id)) {
      groups.push(group)
      this.globalData.userGroups = groups
      this._saveUserGroups()
    }

    this.globalData.currentGroupId = group.id
    this._saveCurrentGroupId()

    console.log('[App] 通过邀请码加入组:', group.name)
    return { success: true, group }
  },

  getGroupMembers(groupId) {
    const group = this._findGroup(groupId)
    if (!group) return []

    const { GROUP_ROLES } = require('./utils/constants')

    return group.members.map(member => {
      const roleInfo = GROUP_ROLES[member.role] || GROUP_ROLES.member
      const stats = this._getMemberStats(group, member.id)
      return {
        ...member,
        roleInfo,
        roleName: roleInfo.name,
        roleIcon: roleInfo.icon,
        points: stats.points,
        classifyCount: stats.classifyCount,
        correctRate: stats.correctRate
      }
    }).sort((a, b) => {
      const roleOrder = { owner: 0, teacher: 1, parent: 2, member: 3, child: 4, student: 5 }
      const aOrder = roleOrder[a.role] !== undefined ? roleOrder[a.role] : 9
      const bOrder = roleOrder[b.role] !== undefined ? roleOrder[b.role] : 9
      return aOrder - bOrder
    })
  },

  removeMember(groupId, memberId) {
    if (!this.hasPermission('remove', groupId)) return { success: false, message: '无权限' }

    const group = this._findGroup(groupId)
    if (!group) return { success: false, message: '组不存在' }

    group.members = group.members.filter(m => m.id !== memberId)
    group.memberCount = group.members.length
    this._saveUserGroups()

    console.log('[App] 移除成员:', memberId)
    return { success: true }
  },

  updateMemberRole(groupId, memberId, roleId) {
    if (!this.hasPermission('manage', groupId)) return { success: false, message: '无权限' }

    const group = this._findGroup(groupId)
    if (!group) return { success: false, message: '组不存在' }

    const member = group.members.find(m => m.id === memberId)
    if (!member) return { success: false, message: '成员不存在' }

    member.role = roleId
    this._saveUserGroups()

    console.log('[App] 更新成员角色:', memberId, roleId)
    return { success: true }
  },

  _findGroup(groupId) {
    return this.getMyGroups().find(g => g.id === groupId)
  },

  _getMemberStats(group, memberId) {
    const currentUserId = this.getUserId()
    const isCurrentUser = memberId === currentUserId

    if (isCurrentUser) {
      const classifyRecords = this.getClassifyRecords()
      const quizRecords = this.getQuizRecords()
      const userInfo = this.globalData.userInfo || {}

      const totalQ = quizRecords.reduce((s, r) => s + (r.totalQuestions || 0), 0)
      const correctQ = quizRecords.reduce((s, r) => s + (r.correctCount || 0), 0)

      return {
        points: userInfo.points || 0,
        classifyCount: classifyRecords.length,
        correctRate: totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0
      }
    }

    const lbUsers = (this.globalData.leaderboardData && this.globalData.leaderboardData.users) || []
    const lbUser = lbUsers.find(u => u.id === memberId)
    if (lbUser) {
      return {
        points: lbUser.points || 0,
        classifyCount: lbUser.classifyCount || 0,
        correctRate: lbUser.accuracy || 0
      }
    }

    const member = group && group.members && group.members.find(m => m.id === memberId)
    return {
      points: (member && member.points) || 0,
      classifyCount: (member && member.classifyCount) || 0,
      correctRate: (member && member.correctRate) || 0
    }
  },

  /**
   * ============ 组积分池 ============
   */

  getGroupPointsPool(groupId) {
    const pools = this.globalData.groupPointsPool || {}
    const group = this._findGroup(groupId)

    if (!pools[groupId]) {
      pools[groupId] = {
        totalPoints: group ? group.totalPoints : 0,
        weeklyPoints: group ? group.weeklyNewPoints : 0,
        history: group ? [
          { id: generateId(), type: 'earn', title: '成员完成组任务', points: 500, time: formatDate(new Date(), 'YYYY-MM-DD') },
          { id: generateId(), type: 'earn', title: '成员分类贡献', points: 320, time: formatDate(new Date(Date.now() - 86400000), 'YYYY-MM-DD') }
        ] : []
      }
      this.globalData.groupPointsPool = pools
      wx.setStorageSync('groupPointsPool', pools)
    }
    return pools[groupId]
  },

  getGroupPointsHistory(groupId) {
    const pool = this.getGroupPointsPool(groupId)
    return pool.history || []
  },

  _addGroupPoints(groupId, points, title) {
    const pool = this.getGroupPointsPool(groupId)
    pool.totalPoints += points
    pool.weeklyPoints += points
    pool.history.unshift({
      id: generateId(),
      type: points >= 0 ? 'earn' : 'spend',
      title: title || (points >= 0 ? '组积分获取' : '组积分消费'),
      points: Math.abs(points),
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    })

    wx.setStorageSync('groupPointsPool', this.globalData.groupPointsPool)

    const group = this._findGroup(groupId)
    if (group) {
      group.totalPoints = pool.totalPoints
      group.weeklyNewPoints = pool.weeklyPoints
      this._saveUserGroups()
    }
  },

  /**
   * ============ 组任务 ============
   */

  getGroupTasks(groupId) {
    const { GROUP_TASKS } = require('./utils/constants')
    const progresses = this.globalData.groupTasksProgress || {}

    return Object.values(GROUP_TASKS).map(task => {
      const progress = this.getGroupTaskProgress(groupId, task.id)
      const taskProgress = progresses[`${groupId}_${task.id}`] || {}
      return {
        ...task,
        progress: progress.progress,
        current: progress.current,
        target: task.target,
        completed: progress.completed,
        rewardClaimed: taskProgress.claimed || false
      }
    })
  },

  getGroupTaskProgress(groupId, taskId) {
    const { GROUP_TASKS } = require('./utils/constants')
    const task = GROUP_TASKS[taskId]
    if (!task) return { progress: 0, current: 0, completed: false, contributions: [] }

    let current = 0
    const contributions = []

    if (task.type === 'classify') {
      const group = this._findGroup(groupId)
      if (group) {
        group.members.forEach(member => {
          const cnt = this._getWeeklyClassifyCount(member.id)
          current += cnt
          contributions.push({
            memberId: member.id,
            nickName: member.nickName,
            avatarUrl: member.avatarUrl,
            role: member.role,
            count: cnt
          })
        })
      }
    }

    const progress = Math.min(100, Math.round((current / task.target) * 100))
    const completed = current >= task.target

    return { progress, current, target: task.target, completed, contributions: contributions.sort((a, b) => b.count - a.count) }
  },

  _getWeeklyClassifyCount(memberId) {
    const records = this.getClassifyRecords(memberId)
    const now = new Date()
    const weekStart = new Date(now.getTime() - now.getDay() * 86400000)
    weekStart.setHours(0, 0, 0, 0)
    const weekStartStr = formatDate(weekStart, 'YYYY-MM-DD')

    return records.filter(r => {
      const dateStr = (r.time || '').split(' ')[0]
      return dateStr >= weekStartStr
    }).length
  },

  _checkWeeklyGroupTask() {
    const { GROUP_TASKS } = require('./utils/constants')
    const groups = this.getMyGroups()

    groups.forEach(group => {
      const task = GROUP_TASKS.weekly_classify
      if (!task) return

      const progress = this.getGroupTaskProgress(group.id, task.id)
      if (progress.completed) {
        const key = `${group.id}_${task.id}`
        const progresses = this.globalData.groupTasksProgress || {}
        if (!progresses[key]) {
          progresses[key] = { completed: true, claimed: false, completedAt: formatDate(new Date(), 'YYYY-MM-DD') }
          this.globalData.groupTasksProgress = progresses
          wx.setStorageSync('groupTasksProgress', progresses)

          this._addGroupPoints(group.id, task.rewardPoints, '完成本周组任务奖励')
          this.unlockBadge(task.rewardBadge)
          console.log('[App] 组任务完成，奖励已发放:', group.name)
        }
      }
    })
  },

  claimGroupTaskReward(groupId, taskId) {
    const progresses = this.globalData.groupTasksProgress || {}
    const key = `${groupId}_${taskId}`

    if (!progresses[key] || !progresses[key].completed) return { success: false, message: '任务未完成' }
    if (progresses[key].claimed) return { success: false, message: '奖励已领取' }

    progresses[key].claimed = true
    progresses[key].claimedAt = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    this.globalData.groupTasksProgress = progresses
    wx.setStorageSync('groupTasksProgress', progresses)

    return { success: true }
  },

  /**
   * ============ 组作业 ============
   */

  initGroupHomework() {
    const storedHomework = wx.getStorageSync('groupHomework')
    const homeworkProgress = wx.getStorageSync('homeworkProgress') || {}

    let homeworkList = storedHomework
    if (!homeworkList || homeworkList.length === 0) {
      homeworkList = this._createMockHomework()
      wx.setStorageSync('groupHomework', homeworkList)
    }

    this.globalData.groupHomework = homeworkList
    this.globalData.homeworkProgress = homeworkProgress

    this._checkHomeworkDeadlines()
    console.log('[App] 组作业系统已初始化', homeworkList.length, '个作业')
  },

  _createMockHomework() {
    const now = new Date()
    const today = formatDate(now, 'YYYY-MM-DD')
    const tomorrow = formatDate(new Date(now.getTime() + 86400000), 'YYYY-MM-DD')
    const nextWeek = formatDate(new Date(now.getTime() + 7 * 86400000), 'YYYY-MM-DD')
    const group = this.getCurrentGroup()
    const groupId = group ? group.id : 'default_group'
    const userId = this.getUserId()

    return [
      {
        id: 'hw_' + generateId(),
        groupId: groupId,
        creatorId: userId,
        title: '有害垃圾专题学习',
        description: '本周完成有害垃圾章节学习 + 分类练习20题 + 每日签到5天',
        icon: '☣️',
        color: '#E85D5D',
        tasks: [
          { type: 'chapter', chapterId: 2, name: '有害垃圾章节', required: true },
          { type: 'quiz', count: 20, difficulty: 'medium', name: '分类练习', required: true },
          { type: 'signin', days: 5, name: '每日签到', required: true }
        ],
        memberIds: [],
        deadline: nextWeek,
        reward: {
          type: 'points_pool',
          points: 500,
          badgeId: '',
          badgeName: '',
          badgeIcon: '🏅'
        },
        reminder: {
          enabled: true,
          days: [3, 1],
          lastReminded: {}
        },
        status: 'in_progress',
        createTime: today,
        updateTime: today
      },
      {
        id: 'hw_' + generateId(),
        groupId: groupId,
        creatorId: userId,
        title: '开学第一周作业',
        description: '可回收垃圾 + 有害垃圾章节学习，每日签到5天，答题20道',
        icon: '🎒',
        color: '#9B59B6',
        tasks: [
          { type: 'chapter', chapterId: 1, name: '可回收垃圾章节', required: true },
          { type: 'chapter', chapterId: 2, name: '有害垃圾章节', required: true },
          { type: 'quiz', count: 20, difficulty: 'easy', name: '分类练习', required: true },
          { type: 'signin', days: 5, name: '每日签到', required: true }
        ],
        memberIds: [],
        deadline: tomorrow,
        reward: {
          type: 'group_badge',
          points: 0,
          badgeId: 'GROUP_HOMEWORK_BADGE',
          badgeName: '学习小达人',
          badgeIcon: '🏅'
        },
        reminder: {
          enabled: true,
          days: [3, 1],
          lastReminded: {}
        },
        status: 'in_progress',
        createTime: today,
        updateTime: today
      }
    ]
  },

  _saveGroupHomework() {
    wx.setStorageSync('groupHomework', this.globalData.groupHomework)
  },

  _saveHomeworkProgress() {
    wx.setStorageSync('homeworkProgress', this.globalData.homeworkProgress)
  },

  getGroupHomeworks(groupId, status = 'all') {
    const group = this._findGroup(groupId)
    if (!group) return []

    let homeworkList = (this.globalData.groupHomework || []).filter(hw => hw.groupId === groupId)

    homeworkList = homeworkList.map(hw => ({
      ...hw,
      ...this._getHomeworkStatusInfo(hw)
    }))

    if (status !== 'all') {
      homeworkList = homeworkList.filter(hw => hw.status === status)
    }

    return homeworkList.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  },

  getGroupHomeworkById(homeworkId) {
    const homework = (this.globalData.groupHomework || []).find(hw => hw.id === homeworkId)
    if (!homework) return null

    return {
      ...homework,
      ...this._getHomeworkStatusInfo(homework)
    }
  },

  createGroupHomework(homeworkData) {
    if (!this.hasPermission('task', homeworkData.groupId)) {
      return { success: false, message: '无权限创建组作业' }
    }

    const group = this._findGroup(homeworkData.groupId)
    if (!group) return { success: false, message: '组不存在' }

    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const userId = this.getUserId()

    // 兼容两种奖励字段结构：reward 对象 或 扁平字段
    let reward
    if (homeworkData.reward && typeof homeworkData.reward === 'object') {
      reward = {
        type: homeworkData.reward.type || 'points_pool',
        points: homeworkData.reward.points || 0,
        badgeId: homeworkData.reward.badgeId || '',
        badgeName: homeworkData.reward.badgeName || '',
        badgeIcon: homeworkData.reward.badgeIcon || '🏅'
      }
    } else {
      reward = {
        type: homeworkData.rewardType || 'points_pool',
        points: homeworkData.rewardPoints || 0,
        badgeId: homeworkData.rewardBadgeId || '',
        badgeName: homeworkData.rewardBadgeName || '',
        badgeIcon: '🏅'
      }
    }

    // 兼容两种提醒字段：sendReminder 或 reminderEnabled
    const reminderEnabled = homeworkData.sendReminder !== undefined
      ? homeworkData.sendReminder
      : (homeworkData.reminderEnabled !== false)

    const newHomework = {
      id: 'hw_' + generateId(),
      groupId: homeworkData.groupId,
      creatorId: userId,
      title: homeworkData.title,
      description: homeworkData.description || '',
      icon: homeworkData.icon || '📋',
      color: homeworkData.color || '#9B59B6',
      tasks: homeworkData.tasks || [],
      memberIds: homeworkData.memberIds || group.members.map(m => m.id),
      deadline: homeworkData.deadline,
      reward: reward,
      reminder: {
        enabled: reminderEnabled,
        days: homeworkData.reminderDays || [3, 1],
        lastReminded: {}
      },
      status: 'in_progress',
      createTime: today,
      updateTime: today
    }

    const homeworkList = this.globalData.groupHomework || []
    homeworkList.unshift(newHomework)
    this.globalData.groupHomework = homeworkList
    this._saveGroupHomework()

    this._sendHomeworkAssignedMessage(newHomework)

    console.log('[App] 组作业创建成功:', newHomework.title, 'reward:', reward)
    return { success: true, homework: newHomework }
  },

  _getHomeworkStatusInfo(homework) {
    const now = new Date()
    const today = formatDate(now, 'YYYY-MM-DD')
    const deadlineDate = new Date(homework.deadline)
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))

    let status = homework.status
    if (status === 'in_progress' && today > homework.deadline) {
      status = 'expired'
    }

    const memberProgress = this._getAllMemberProgress(homework)
    const completedCount = memberProgress.filter(m => m.completed).length
    const totalMembers = memberProgress.length
    const completionRate = totalMembers > 0 ? Math.round((completedCount / totalMembers) * 100) : 0

    return {
      status,
      daysLeft,
      completedCount,
      totalMembers,
      completionRate,
      memberProgress
    }
  },

  _getAllMemberProgress(homework) {
    const group = this._findGroup(homework.groupId)
    if (!group) return []

    const allGroupMemberIds = (group.members || []).map(m => m.id)
    const memberIds = homework.memberIds && homework.memberIds.length > 0
      ? homework.memberIds
      : allGroupMemberIds

    return memberIds.map(memberId => {
      const member = group.members.find(m => m.id === memberId) || {
        id: memberId,
        nickName: '未知成员',
        name: '未知成员',
        role: 'member',
        emoji: '🌱',
        avatarEmoji: '🌱',
        avatarUrl: ''
      }
      const progress = this._calculateMemberHomeworkProgress(homework, memberId)

      const memberName = member.nickName || member.name || '未知成员'
      const memberEmoji = member.emoji || member.avatarEmoji || '🌱'

      return {
        memberId,
        member: {
          id: memberId,
          name: memberName,
          nickName: memberName,
          emoji: memberEmoji,
          avatarEmoji: memberEmoji,
          avatarUrl: member.avatarUrl || member.avatar || '',
          role: member.role || 'member'
        },
        nickName: memberName,
        memberName,
        memberEmoji,
        avatarUrl: member.avatarUrl || member.avatar || '',
        role: member.role || 'member',
        ...progress
      }
    }).sort((a, b) => b.completionRate - a.completionRate)
  },

  _calculateMemberHomeworkProgress(homework, memberId) {
    const progressKey = `${homework.id}_${memberId}`
    const storedProgress = (this.globalData.homeworkProgress || {})[progressKey] || {}

    const taskProgress = homework.tasks.map(task => {
      const taskResult = this._checkTaskCompletion(homework, task, memberId)
      return {
        ...task,
        ...taskResult
      }
    })

    const requiredTasks = taskProgress.filter(t => t.required)
    const completedRequired = requiredTasks.filter(t => t.completed).length
    const completionRate = requiredTasks.length > 0
      ? Math.round((completedRequired / requiredTasks.length) * 100)
      : 0

    const allCompleted = requiredTasks.every(t => t.completed)

    const result = {
      tasks: taskProgress,
      completionRate,
      completed: allCompleted,
      completedAt: storedProgress.completedAt || (allCompleted ? formatDate(new Date(), 'YYYY-MM-DD HH:mm') : null),
      lastCheckTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }

    if (allCompleted && !storedProgress.completedAt) {
      if (!this.globalData.homeworkProgress) this.globalData.homeworkProgress = {}
      this.globalData.homeworkProgress[progressKey] = {
        ...storedProgress,
        completedAt: result.completedAt
      }
      this._saveHomeworkProgress()

      this._awardHomeworkReward(homework, memberId)
    }

    return result
  },

  _checkTaskCompletion(homework, task, memberId) {
    const { QUIZ_CHAPTERS } = require('./utils/constants')

    switch (task.type) {
      case 'chapter': {
        const learningProgress = this.globalData.learningProgress || {}
        const chapterProgress = learningProgress[`${memberId}_${task.chapterId}`] || { completed: false, progress: 0 }
        const chapter = QUIZ_CHAPTERS.find(c => c.id === task.chapterId)
        return {
          current: chapterProgress.progress || 0,
          target: 100,
          progress: chapterProgress.progress || 0,
          completed: chapterProgress.completed || false,
          chapterName: chapter ? chapter.name : '章节学习'
        }
      }

      case 'quiz': {
        const memberRecords = this.getQuizRecords(memberId)
        const totalQuestions = memberRecords.reduce((sum, r) => sum + (r.totalQuestions || 0), 0)
        const target = task.count || 20
        return {
          current: totalQuestions,
          target,
          progress: Math.min(100, Math.round((totalQuestions / target) * 100)),
          completed: totalQuestions >= target
        }
      }

      case 'signin': {
        const signInRecords = this.getSignInRecords(memberId)
        const target = task.days || 5
        const now = new Date()
        let consecutiveDays = 0
        for (let i = 0; i < target; i++) {
          const checkDate = formatDate(new Date(now.getTime() - i * 86400000), 'YYYY-MM-DD')
          if (signInRecords.includes(checkDate)) {
            consecutiveDays++
          } else {
            break
          }
        }
        return {
          current: consecutiveDays,
          target,
          progress: Math.min(100, Math.round((consecutiveDays / target) * 100)),
          completed: consecutiveDays >= target
        }
      }

      case 'classify': {
        const memberClassifyRecords = this.getClassifyRecords(memberId)
        const target = task.count || 10
        const current = memberClassifyRecords.length
        return {
          current,
          target,
          progress: Math.min(100, Math.round((current / target) * 100)),
          completed: current >= target
        }
      }

      default:
        return { current: 0, target: 1, progress: 0, completed: false }
    }
  },

  _awardHomeworkReward(homework, memberId) {
    const { MESSAGE_TYPES } = require('./utils/message')
    const { messageManager } = require('./utils/message')

    // 兼容两种结构：reward 对象 或 扁平字段
    const reward = homework.reward || {
      type: homework.rewardType || 'points_pool',
      points: homework.rewardPoints || 0,
      badgeId: homework.rewardBadgeId || '',
      badgeName: homework.rewardBadgeName || ''
    }

    if (reward.type === 'points_pool' && reward.points > 0) {
      this._addGroupPoints(homework.groupId, reward.points, '组作业完成奖励')
    }

    if (reward.type === 'group_badge' && (reward.badgeId || reward.badgeName)) {
      const badgeId = reward.badgeId || `custom_${homework.id}_badge`
      this.unlockBadge(badgeId, memberId)
    }

    const memberIds = homework.memberIds && homework.memberIds.length > 0
      ? homework.memberIds
      : (this._findGroup(homework.groupId)?.members || []).map(m => m.id)

    const allCompleted = memberIds.every(id => {
      const progress = this._calculateMemberHomeworkProgress(homework, id)
      return progress.completed
    })

    if (allCompleted && messageManager.getSubscriptionSetting('homeworkComplete')) {
      messageManager.addMessage({
        type: MESSAGE_TYPES.HOMEWORK_COMPLETED,
        title: '🎉 组作业全部完成',
        content: `「${homework.title}」已被所有成员完成，奖励已发放！`,
        emoji: '🎊',
        data: {
          homeworkId: homework.id,
          link: `/pages/group-homework-detail/group-homework-detail?id=${homework.id}`
        }
      })
    }

    console.log('[App] 作业奖励已发放:', memberId, homework.title, reward)
  },

  _sendHomeworkAssignedMessage(homework) {
    const { MESSAGE_TYPES } = require('./utils/message')
    const { messageManager } = require('./utils/message')

    if (!messageManager.getSubscriptionSetting('homeworkAssigned')) return

    const group = this._findGroup(homework.groupId)
    const memberIds = homework.memberIds && homework.memberIds.length > 0
      ? homework.memberIds
      : (group?.members || []).map(m => m.id)

    memberIds.forEach(memberId => {
      if (memberId === homework.creatorId) return

      messageManager.addMessage({
        type: MESSAGE_TYPES.HOMEWORK,
        title: '📋 新组作业发布',
        content: `老师/家长发布了新作业「${homework.title}」，截止日期：${homework.deadline}`,
        emoji: '📝',
        data: {
          homeworkId: homework.id,
          targetMemberId: memberId,
          link: `/pages/group-homework-detail/group-homework-detail?id=${homework.id}`
        }
      })
    })
  },

  _checkHomeworkDeadlines() {
    const { MESSAGE_TYPES } = require('./utils/message')
    const { messageManager } = require('./utils/message')
    const { HOMEWORK_REMINDER_CONFIG } = require('./utils/constants')

    if (!messageManager.shouldSendHomeworkReminder()) return

    const homeworkList = this.globalData.groupHomework || []
    const now = new Date()

    homeworkList.forEach(homework => {
      if (homework.status !== 'in_progress') return

      // 兼容两种提醒结构：reminder 对象 或 扁平字段
      const reminder = homework.reminder || {
        enabled: homework.reminderEnabled !== false,
        days: homework.reminderDays || [3, 1],
        lastReminded: {}
      }
      if (!reminder.enabled) return

      const deadlineDate = new Date(homework.deadline)
      const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))

      if (reminder.days && reminder.days.includes(daysLeft)) {
        const memberIds = homework.memberIds && homework.memberIds.length > 0
          ? homework.memberIds
          : (this._findGroup(homework.groupId)?.members || []).map(m => m.id)

        memberIds.forEach(memberId => {
          // 检查是否已经在这个天数节点提醒过
          const lastRemindedKey = String(daysLeft)
          if (reminder.lastReminded && reminder.lastReminded[memberId] === lastRemindedKey) return

          const progress = this._calculateMemberHomeworkProgress(homework, memberId)
          if (!progress.completed && messageManager.getSubscriptionSetting('homeworkDue')) {
            messageManager.addMessage({
              type: MESSAGE_TYPES.HOMEWORK_REMINDER,
              title: '⏰ 作业截止提醒',
              content: `「${homework.title}」还有 ${daysLeft} 天截止，当前完成度：${progress.completionRate}%`,
              emoji: '🔔',
              data: {
                homeworkId: homework.id,
                targetMemberId: memberId,
                daysLeft,
                link: `/pages/group-homework-detail/group-homework-detail?id=${homework.id}`
              }
            })
            // 记录已提醒
            if (homework.reminder && homework.reminder.lastReminded) {
              homework.reminder.lastReminded[memberId] = lastRemindedKey
            }
          }
        })
      }
    })

    // 保存更新后的提醒记录
    this._saveGroupHomework()
    messageManager.updateHomeworkReminderTime()
  },

  getHomeworkCompletionRanking(groupId) {
    const homeworkList = this.getGroupHomeworks(groupId, 'all')
    const group = this._findGroup(groupId)
    if (!group) return []
    const currentUserId = this.getUserId()

    // 和 _getAllMemberProgress 完全一致的成员集合收集逻辑：
    // 先从所有作业中合并 memberIds（每个作业如果自己有指定就用，否则 fallback 到全组）
    const allGroupMemberIds = (group.members || []).map(m => m.id)
    const mergedMemberIds = []
    homeworkList.forEach(hw => {
      const homeworkMemberIds = hw.memberIds && hw.memberIds.length > 0
        ? hw.memberIds
        : allGroupMemberIds
      homeworkMemberIds.forEach(id => {
        if (!mergedMemberIds.includes(id) && allGroupMemberIds.includes(id)) {
          mergedMemberIds.push(id)
        }
      })
    })
    // 如果没有作业，使用全组成员
    const finalMemberIds = mergedMemberIds.length > 0 ? mergedMemberIds : allGroupMemberIds

    // 统计每个成员在所有其被分配的作业上的进度（统一调用 _calculateMemberHomeworkProgress）
    const rawRanking = finalMemberIds.map(memberId => {
      const member = group.members.find(m => m.id === memberId)

      // 使用和 _getAllMemberProgress 相同的分配规则筛选作业
      const memberHomework = homeworkList.filter(hw => {
        const assigned = hw.memberIds && hw.memberIds.length > 0
          ? hw.memberIds.includes(memberId)
          : true
        return assigned
      })

      const totalCount = memberHomework.length
      const totalTasks = memberHomework.reduce((sum, hw) =>
        sum + (hw.tasks || []).filter(t => t.required).length, 0)

      // 遍历计算，避免对同一 homework 多次调用 _calculateMemberHomeworkProgress
      let completedHomework = 0
      let completedTasks = 0
      memberHomework.forEach(hw => {
        const progress = this._calculateMemberHomeworkProgress(hw, memberId)
        if (progress.completed) completedHomework++
        completedTasks += (progress.tasks || []).filter(t => t.required && t.completed).length
      })

      const completionRate = totalCount > 0 ? Math.round((completedHomework / totalCount) * 100) : 0
      const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

      const memberName = member ? (member.nickName || member.name || '成员') : '未知成员'
      const memberEmoji = member ? (member.emoji || member.avatarEmoji || '🌱') : '🌱'
      const avatarUrl = member ? (member.avatarUrl || member.avatar || '') : ''
      const role = member ? member.role : 'member'

      return {
        memberId,
        memberName,
        memberEmoji,
        avatarUrl,
        nickName: memberName,
        role,
        totalHomework: totalCount,
        completedHomework,
        totalTasks,
        completedTasks,
        completionRate,
        taskCompletionRate,
        isCurrentUser: memberId === currentUserId
      }
    }).sort((a, b) => {
      if (b.completionRate !== a.completionRate) return b.completionRate - a.completionRate
      if (b.taskCompletionRate !== a.taskCompletionRate) return b.taskCompletionRate - a.taskCompletionRate
      return b.completedTasks - a.completedTasks
    })

    return rawRanking.map((item, index) => ({
      ...item,
      rank: index + 1
    }))
  },

  updateMemberHomeworkProgress(memberId) {
    const homeworkList = this.globalData.groupHomework || []
    homeworkList.forEach(homework => {
      if (homework.status === 'in_progress') {
        this._calculateMemberHomeworkProgress(homework, memberId)
      }
    })
  },

  /**
   * ============ 组内排行榜 ============
   */

  getGroupLeaderboard(groupId, period = 'week', dimension = 'points') {
    const members = this.getGroupMembers(groupId)
    if (members.length === 0) return { list: [], myRank: 0, myData: null }

    const groups = this.globalData.userGroups || []
    const group = groups.find(g => g.id === groupId)
    const currentUserId = this.getUserId()
    const seasonInfo = this.getSeasonInfo()
    const timeRange = this.getPeriodTimeRange(period, seasonInfo ? seasonInfo.seasonId : null)

    const list = members.map((m) => {
      const isCurrentUser = m.id === currentUserId
      let stats = null

      if (isCurrentUser) {
        stats = this.getCurrentUserStats(period)
      } else {
        const seasonId = timeRange.seasonId
        if (group && group.memberSeasonStats && group.memberSeasonStats[m.id] && group.memberSeasonStats[m.id][seasonId] && period === 'month') {
          stats = {
            points: group.memberSeasonStats[m.id][seasonId].points || 0,
            accuracy: group.memberSeasonStats[m.id][seasonId].accuracy || 0,
            classifyCount: group.memberSeasonStats[m.id][seasonId].classifyCount || 0,
            streakDays: 0,
            gameScore: group.memberSeasonStats[m.id][seasonId].gameScore || 0
          }
        } else if (group && group.memberWeekStats && group.memberWeekStats[m.id] && period === 'week') {
          stats = {
            points: group.memberWeekStats[m.id].points || 0,
            accuracy: group.memberWeekStats[m.id].accuracy || 0,
            classifyCount: group.memberWeekStats[m.id].classifyCount || 0,
            streakDays: 0,
            gameScore: group.memberWeekStats[m.id].gameScore || 0
          }
        } else {
          const lbUsers = (this.globalData.leaderboardData && this.globalData.leaderboardData.users) || []
          const lbUser = lbUsers.find(u => u.id === m.id)
          if (lbUser) {
            const lbSeasonStats = lbUser.seasonStats && lbUser.seasonStats[seasonId]
            const lbWeekStats = lbUser.weekStats
            if (period === 'month' && lbSeasonStats) {
              stats = {
                points: lbSeasonStats.points || 0,
                accuracy: lbSeasonStats.accuracy || 0,
                classifyCount: lbSeasonStats.classifyCount || 0,
                streakDays: 0,
                gameScore: lbSeasonStats.gameScore || 0
              }
            } else if (period === 'week' && lbWeekStats) {
              stats = {
                points: lbWeekStats.points || 0,
                accuracy: lbWeekStats.accuracy || 0,
                classifyCount: lbWeekStats.classifyCount || 0,
                streakDays: 0,
                gameScore: lbWeekStats.gameScore || 0
              }
            } else if (period === 'total') {
              stats = {
                points: lbUser.points || 0,
                accuracy: lbUser.accuracy || 0,
                classifyCount: lbUser.classifyCount || 0,
                streakDays: lbUser.streakDays || 0,
                gameScore: lbUser.gameScore || 0
              }
            } else {
              stats = { points: 0, accuracy: 0, classifyCount: 0, streakDays: 0, gameScore: 0 }
            }
          } else {
            stats = { points: 0, accuracy: 0, classifyCount: 0, streakDays: 0, gameScore: 0 }
          }
        }
      }

      return {
        userId: m.id,
        nickName: m.nickName,
        avatarUrl: m.avatarUrl,
        avatarEmoji: m.avatarEmoji,
        roleIcon: m.roleIcon,
        role: m.role,
        points: stats.points,
        classifyCount: stats.classifyCount,
        accuracy: stats.accuracy,
        gameScore: stats.gameScore,
        isCurrentUser
      }
    }).sort((a, b) => {
      const aVal = a[dimension] || 0
      const bVal = b[dimension] || 0
      if (bVal !== aVal) return bVal - aVal
      return (b.classifyCount || 0) - (a.classifyCount || 0)
    }).map((item, index) => ({ ...item, rank: index + 1 }))

    const myRank = list.findIndex(u => u.userId === currentUserId) + 1
    const myData = list.find(u => u.userId === currentUserId) || null

    return {
      list,
      myRank,
      myData,
      period,
      dimension,
      seasonId: timeRange.seasonId,
      startDate: timeRange.startDate,
      endDate: timeRange.endDate
    }
  },

  /**
   * ============ 权限系统 ============
   */

  hasPermission(permission, groupId = null) {
    const { GROUP_ROLES } = require('./utils/constants')
    const roleId = this.globalData.userRole || 'member'
    const role = GROUP_ROLES[roleId] || GROUP_ROLES.member

    if (role.permissions.includes(permission)) return true

    if (groupId) {
      const group = this._findGroup(groupId)
      const userId = this.getUserId()
      if (group) {
        const member = group.members.find(m => m.id === userId)
        if (member) {
          const memberRole = GROUP_ROLES[member.role]
          if (memberRole && memberRole.permissions.includes(permission)) return true
        }
      }
    }

    return false
  },

  /**
   * ============ 学习报告 ============
   */

  getGroupMembersWithPermission() {
    if (!this.hasPermission('report')) {
      const group = this.getCurrentGroup()
      if (!group || !this.hasPermission('report', group.id)) {
        return []
      }
    }

    const group = this.getCurrentGroup()
    if (!group) return []
    return this.getGroupMembers(group.id)
  },

  getMemberLearningReport(memberId) {
    const targetMemberId = memberId || this.getUserId()
    const classifyRecords = this.getClassifyRecords(targetMemberId)
    const quizRecords = this.getQuizRecords(targetMemberId)

    const totalClassify = classifyRecords.length
    const totalQuiz = quizRecords.reduce((s, r) => s + (r.totalQuestions || 0), 0)
    const correctQuiz = quizRecords.reduce((s, r) => s + (r.correctCount || 0), 0)
    const overallAccuracy = totalQuiz > 0 ? Math.round((correctQuiz / totalQuiz) * 100) : 0

    const signInRecords = this.getSignInRecords(targetMemberId)
    const dailyQuizRecords = this.getDailyQuizRecords(targetMemberId)
    const mergedStudyDays = Array.from(new Set([...signInRecords, ...dailyQuizRecords]))
    const totalStudyDays = mergedStudyDays.length

    const streakDays = this.getStreakDays(targetMemberId)
    const totalPoints = this.getUserPoints(targetMemberId) || 0

    return {
      totalStudyDays,
      totalClassify,
      totalQuiz,
      correctQuiz,
      totalPoints,
      streakDays,
      overallAccuracy
    }
  },

  getMemberWeakCategories(memberId) {
    const { TRASH_TYPES } = require('./utils/constants')
    const targetMemberId = memberId || this.getUserId()
    const wrongQuestions = this.getWrongQuestions(targetMemberId)

    return TRASH_TYPES.map(type => {
      const typeWrongList = wrongQuestions.filter(q => q.chapterId === type.id)
      const wrongCount = typeWrongList.length

      let accuracy
      const typeQuizzes = this.getQuizRecords(targetMemberId)
        .filter(r => r.chapterId === type.id || r.chapterName === type.name)
      const totalQuestions = typeQuizzes.reduce((s, r) => s + (r.totalQuestions || 0), 0)
      const correctQuestions = typeQuizzes.reduce((s, r) => s + (r.correctCount || 0), 0)
      const attempted = totalQuestions > 0

      if (attempted) {
        accuracy = Math.max(0, Math.round((correctQuestions / totalQuestions) * 100))
      } else if (wrongCount > 0) {
        accuracy = Math.max(20, 60 - wrongCount * 5)
      } else {
        accuracy = 100
      }

      const recentWrongQuestions = typeWrongList
        .slice(0, 5)
        .map(q => ({
          id: q.id,
          question: q.question,
          wrongTime: q.wrongTime,
          wrongCount: q.wrongCount || 1,
          yourAnswer: q.yourAnswer || '',
          correctAnswer: q.correctAnswer || ''
        }))

      return {
        id: type.id,
        name: type.name,
        emoji: type.emoji,
        color: type.color,
        bgColor: type.bgColor,
        accuracy,
        wrongCount,
        isWeak: attempted ? accuracy < 60 : false,
        recentWrongQuestions
      }
    }).filter(c => c.isWeak).sort((a, b) => a.accuracy - b.accuracy)
  },

  getMemberBadges(memberId) {
    return this.getMyVirtualBadges()
  },

  getMemberWeeklyStats(memberId) {
    const classifyRecords = this.getClassifyRecords(memberId)
    const quizRecords = this.getQuizRecords(memberId)
    const now = new Date()
    const days = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86400000)
      const dateStr = formatDate(date, 'YYYY-MM-DD')
      const dayClassify = classifyRecords.filter(r => (r.time || '').split(' ')[0] === dateStr)
      const dayQuiz = quizRecords.filter(r => (r.time || '').split(' ')[0] === dateStr)

      days.push({
        date: formatDate(date, 'MM-DD'),
        weekday: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
        classifyCount: dayClassify.length,
        quizCount: dayQuiz.length
      })
    }

    const classifys = days.map(d => d.classifyCount)
    const quizs = days.map(d => d.quizCount)

    return {
      days,
      totalClassify: classifys.reduce((a, b) => a + b, 0),
      totalQuiz: quizs.reduce((a, b) => a + b, 0),
      avgClassify: Math.round(classifys.reduce((a, b) => a + b, 0) / 7),
      avgQuiz: Math.round(quizs.reduce((a, b) => a + b, 0) / 7),
      maxClassify: Math.max(...classifys),
      maxQuiz: Math.max(...quizs)
    }
  },

  /**
   * ============ 儿童模式菜单过滤 ============
   */

  filterMenusForChild(menuGroups) {
    if (!this.isChildModeEnabled()) return menuGroups

    const hideInChild = ['recycle', 'recycleOrders', 'address', 'orders', 'community', 'community-publish']
    return menuGroups.map(group => ({
      ...group,
      items: (group.items || []).filter(item => !hideInChild.includes(item.id))
    })).map(group => ({
      ...group,
      items: group.items.slice(0, 3)
    })).filter(group => group.items.length > 0)
  },

  getUserRole() {
    return this.globalData.userRole || 'member'
  },

  /**
   * ============ 数据看板相关方法 ============
   */

  /**
   * 获取近 N 天的分类次数统计（按天分组）
   * @param {number} days 天数，默认7天
   * @returns {Array} [{date, label, count, kitchen, recyclable, harmful, other}]
   */
  getClassifyTrend(days = 7) {
    const classifyRecords = this.getClassifyRecords()
    const now = new Date()
    const result = []

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000)
      const dateStr = formatDate(d, 'YYYY-MM-DD')
      const label = days <= 7
        ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
        : (d.getMonth() + 1) + '/' + d.getDate()

      const dayRecords = classifyRecords.filter(r => {
        const rDate = r.time ? r.time.split(' ')[0] : ''
        return rDate === dateStr
      })

      const stats = { kitchen: 0, recyclable: 0, harmful: 0, other: 0 }
      dayRecords.forEach(r => {
        if (r.typeId === 1) stats.recyclable++
        else if (r.typeId === 2) stats.harmful++
        else if (r.typeId === 3) stats.kitchen++
        else if (r.typeId === 4) stats.other++
      })

      result.push({
        date: dateStr,
        label,
        count: dayRecords.length,
        ...stats
      })
    }
    return result
  },

  /**
   * 获取四分类雷达图数据
   * @returns {Object} { categories: [], values: [], maxValue: number }
   */
  getCategoryRadarData() {
    const categoryStats = this.getCategoryStats()
    const maxValue = Math.max(...categoryStats.map(s => s.count), 10)

    return {
      categories: categoryStats.map(s => s.name),
      values: categoryStats.map(s => s.count),
      emojis: categoryStats.map(s => s.emoji),
      colors: categoryStats.map(s => s.color),
      maxValue: Math.ceil(maxValue * 1.2)
    }
  },

  /**
   * 获取答题正确率趋势（近 N 次答题）
   * @param {number} count 最近答题次数，默认10次
   * @returns {Array} [{label, accuracy, correctCount, totalQuestions, date}]
   */
  getQuizAccuracyTrend(count = 10) {
    const quizRecords = this.getQuizRecords()
    const recent = quizRecords.slice(0, count).reverse()

    return recent.map((r, idx) => ({
      label: '第' + (idx + 1) + '次',
      accuracy: r.accuracy || 0,
      correctCount: r.correctCount || 0,
      totalQuestions: r.totalQuestions || 0,
      date: r.time ? r.time.split(' ')[0] : ''
    }))
  },

  /**
   * 获取游戏最高分曲线（按游戏类型）
   * @returns {Object} { games: [{name, emoji, records: [{label, score, date}]}] }
   */
  getGameScoreTrend() {
    const gameRecords = this.getGameRecords()
    const gameTypes = [
      { type: 'catch', name: '接垃圾', emoji: '🎯' },
      { type: 'conveyor', name: '传送带', emoji: '🚂' },
      { type: 'match', name: '配对消消乐', emoji: '🧩' }
    ]

    const games = gameTypes.map(gt => {
      const records = gameRecords
        .filter(r => r.gameType === gt.type)
        .slice(0, 10)
        .reverse()
        .map((r, idx) => ({
          label: '第' + (idx + 1) + '局',
          score: r.score || r.points || 0,
          date: r.time ? r.time.split(' ')[0] : ''
        }))

      const bestScore = records.length > 0 ? Math.max(...records.map(r => r.score)) : 0

      return {
        type: gt.type,
        name: gt.name,
        emoji: gt.emoji,
        records,
        bestScore,
        playCount: records.length
      }
    })

    return { games }
  },

  /**
   * 生成周报/月报摘要
   * @param {string} period 'week' | 'month'
   * @returns {Object} 摘要数据
   */
  generateReportSummary(period = 'week') {
    const days = period === 'week' ? 7 : 30
    const trend = this.getClassifyTrend(days)
    const categoryStats = this.getCategoryStats()
    const quizRecords = this.getQuizRecords()
    const gameRecords = this.getGameRecords()

    const totalClassify = trend.reduce((sum, d) => sum + d.count, 0)
    const avgDaily = days > 0 ? (totalClassify / days).toFixed(1) : 0

    const periodQuizRecords = quizRecords.filter(r => {
      if (!r.time) return false
      const rDate = new Date(r.time.split(' ')[0])
      const diff = (Date.now() - rDate.getTime()) / 86400000
      return diff <= days
    })

    const totalQuiz = periodQuizRecords.length
    const avgAccuracy = totalQuiz > 0
      ? Math.round(periodQuizRecords.reduce((sum, r) => sum + (r.accuracy || 0), 0) / totalQuiz)
      : 0

    const periodGameRecords = gameRecords.filter(r => {
      if (!r.time) return false
      const rDate = new Date(r.time.split(' ')[0])
      const diff = (Date.now() - rDate.getTime()) / 86400000
      return diff <= days
    })
    const totalGamePlays = periodGameRecords.length
    const bestGameScore = periodGameRecords.length > 0
      ? Math.max(...periodGameRecords.map(r => r.score || r.points || 0))
      : 0

    const weakCategory = this._findWeakCategory(trend)
    const suggestions = this._generateSuggestions(weakCategory, avgAccuracy)

    return {
      period,
      periodLabel: period === 'week' ? '本周' : '本月',
      totalClassify,
      avgDaily,
      totalQuiz,
      avgAccuracy,
      totalGamePlays,
      bestGameScore,
      weakCategory,
      suggestions,
      summaryText: this._buildSummaryText(period, totalClassify, avgDaily, totalQuiz, avgAccuracy, weakCategory)
    }
  },

  _findWeakCategory(trend) {
    const totals = { kitchen: 0, recyclable: 0, harmful: 0, other: 0 }
    trend.forEach(d => {
      totals.kitchen += d.kitchen
      totals.recyclable += d.recyclable
      totals.harmful += d.harmful
      totals.other += d.other
    })

    const categoryInfo = {
      kitchen: { name: '厨余', emoji: '🍂', chapterId: 3, color: '#5BBD72' },
      recyclable: { name: '可回收', emoji: '♻️', chapterId: 1, color: '#4A90D9' },
      harmful: { name: '有害', emoji: '☣️', chapterId: 2, color: '#E85D5D' },
      other: { name: '其他', emoji: '🗑️', chapterId: 4, color: '#8E8E93' }
    }

    const sorted = Object.entries(totals).sort((a, b) => a[1] - b[1])
    const weakestKey = sorted[0][0]
    return {
      key: weakestKey,
      count: sorted[0][1],
      ...categoryInfo[weakestKey]
    }
  },

  _generateSuggestions(weakCategory, avgAccuracy) {
    const suggestions = []

    if (weakCategory && weakCategory.count < 3) {
      suggestions.push({
        type: 'category',
        icon: weakCategory.emoji,
        text: `${weakCategory.name}类分类较少，建议完成「${weakCategory.name}垃圾」章节闯关`,
        action: 'chapter',
        data: { chapterId: weakCategory.chapterId }
      })
    }

    if (avgAccuracy > 0 && avgAccuracy < 70) {
      suggestions.push({
        type: 'quiz',
        icon: '📝',
        text: '答题正确率有待提升，建议复习错题本',
        action: 'wrong',
        data: {}
      })
    }

    if (suggestions.length === 0) {
      suggestions.push({
        type: 'encourage',
        icon: '🌟',
        text: '表现不错，继续保持！可以尝试更高难度的挑战',
        action: 'none',
        data: {}
      })
    }

    return suggestions
  },

  _buildSummaryText(period, totalClassify, avgDaily, totalQuiz, avgAccuracy, weakCategory) {
    const periodLabel = period === 'week' ? '本周' : '本月'
    const parts = []

    parts.push(`${periodLabel}你完成了 ${totalClassify} 次垃圾分类`)
    parts.push(`日均约 ${avgDaily} 次`)

    if (totalQuiz > 0) {
      parts.push(`答题 ${totalQuiz} 次，平均正确率 ${avgAccuracy}%`)
    }

    if (weakCategory && weakCategory.count < 3) {
      parts.push(`${weakCategory.name}类是薄弱项，建议加强练习`)
    }

    return parts.join('，')
  },

  /**
   * 获取家庭组均值对比数据
   * @returns {Object} 对比数据
   */
  getGroupComparison() {
    const currentGroup = this.getCurrentGroup ? this.getCurrentGroup() : null
    const members = currentGroup && this.getGroupMembers ? this.getGroupMembers(currentGroup.id) : []

    if (!currentGroup || members.length === 0) {
      return {
        hasGroup: false,
        groupName: '',
        memberCount: 0,
        userRank: 0,
        percentile: 0,
        comparisonText: '加入家庭组后可查看对比数据',
        memberStats: []
      }
    }

    const stats = this.getStatistics()
    const userPoints = (this.globalData.userInfo && this.globalData.userInfo.points) || 0
    const userClassifyCount = stats.classifyCount

    const memberStats = members.map(m => ({
      id: m.id,
      name: m.name || m.nickName || '成员',
      avatar: m.avatarUrl || '',
      isCurrentUser: m.isCurrentUser || false,
      points: m.points || 0,
      classifyCount: m.classifyCount || 0
    }))

    const sortedByPoints = [...memberStats].sort((a, b) => b.points - a.points)
    const userRank = sortedByPoints.findIndex(m => m.isCurrentUser) + 1
    const percentile = memberStats.length > 1
      ? Math.round(((memberStats.length - userRank) / (memberStats.length - 1)) * 100)
      : 100

    const avgPoints = memberStats.length > 0
      ? Math.round(memberStats.reduce((s, m) => s + m.points, 0) / memberStats.length)
      : 0
    const avgClassifyCount = memberStats.length > 0
      ? Math.round(memberStats.reduce((s, m) => s + m.classifyCount, 0) / memberStats.length)
      : 0

    let comparisonText = ''
    if (percentile >= 70) {
      comparisonText = `你已超过组内 ${percentile}% 成员，继续保持！`
    } else if (percentile >= 40) {
      comparisonText = `你处于组内中等水平，再接再厉！`
    } else {
      comparisonText = `继续加油，你可以做得更好！`
    }

    return {
      hasGroup: true,
      groupName: currentGroup.name || '我的家庭组',
      memberCount: memberStats.length,
      userRank,
      percentile,
      userPoints,
      userClassifyCount,
      avgPoints,
      avgClassifyCount,
      comparisonText,
      memberStats
    }
  },

  /**
   * 获取儿童模式数据看板数据（趣味数据）
   * @returns {Object}
   */
  getChildDashboardData() {
    const stats = this.getStatistics()
    const categoryStats = this.getCategoryStats()
    const userInfo = this.globalData.userInfo || {}
    const levelInfo = getUserLevel(userInfo.points || 0)

    const totalClassify = stats.classifyCount
    const stars = Math.min(5, Math.floor(totalClassify / 10) + 1)
    const maxStars = 5

    return {
      level: levelInfo.level,
      levelName: levelInfo.name,
      levelIcon: levelInfo.icon,
      stars,
      maxStars,
      totalClassify,
      categoryStars: categoryStats.map(c => ({
        ...c,
        stars: Math.min(5, Math.floor(c.count / 5) + 1)
      })),
      encouragement: totalClassify >= 50
        ? '太棒了！你是环保小卫士！'
        : totalClassify >= 20
          ? '做得很好，继续加油哦！'
          : '多多分类，收集更多星星吧！'
    }
  },

  initActivitySystem() {
    this.globalData.activityManager = activityManager
    this.globalData.flashSaleManager = flashSaleManager
    this.refreshActivePointsDoubles()
    console.log('[App] 活动系统初始化完成')
  },

  getActivityManager() {
    return this.globalData.activityManager || activityManager
  },

  getFlashSaleManager() {
    return this.globalData.flashSaleManager || flashSaleManager
  },

  refreshActivePointsDoubles() {
    const userInfo = this.globalData.userInfo
    const userContext = {
      userInfo,
      joinDate: userInfo ? userInfo.joinDate : null,
      streakDays: this.getStreakDays()
    }
    this.globalData.activePointsDoubles = activityManager.getActivePointsDoubles(userContext)
    console.log('[App] 活动积分倍率已刷新，生效活动:', this.globalData.activePointsDoubles.length)
    return this.globalData.activePointsDoubles
  },

  getActivePointsDoubles() {
    if (!this.globalData.activePointsDoubles || this.globalData.activePointsDoubles.length === 0) {
      this.refreshActivePointsDoubles()
    }
    return this.globalData.activePointsDoubles || []
  },

  getPointsMultiplier(category) {
    const userInfo = this.globalData.userInfo
    const userContext = {
      userInfo,
      joinDate: userInfo ? userInfo.joinDate : null,
      streakDays: this.getStreakDays()
    }
    const result = activityManager.getPointsMultiplierForCategory(category, userContext)

    if (result.isDoubled) {
      console.log(`[App] 积分双倍生效 [${category}]: ${result.multiplier}x, 活动:`, result.appliedActivities)
    }

    return result
  },

  applyPointsMultiplier(points, category) {
    const { multiplier, isDoubled, appliedActivities } = this.getPointsMultiplier(category)
    if (!isDoubled || multiplier <= 1) {
      return { points, isDoubled: false, multiplier: 1, bonusPoints: 0, appliedActivities: [] }
    }
    const originalPoints = points
    const finalPoints = Math.round(points * multiplier)
    const bonusPoints = finalPoints - originalPoints

    return {
      points: finalPoints,
      isDoubled,
      multiplier,
      bonusPoints,
      appliedActivities
    }
  },

  checkActivityEndAndReports() {
    const generated = activityManager.checkActivityEndAndGenerateReport()
    if (generated.length === 0) return

    const userId = this.getUserId()

    for (const { activity, report } of generated) {
      console.log('[App] 活动结束，生成报告:', activity.title, report.id)

      const stats = activityManager.getParticipationStats(activity.id)
      const userParticipated = stats.records.some(r => r.userId === userId)

      if (messageManager.getSubscriptionSetting('activityReportNotice')) {
        let content = `「${activity.title}」活动已圆满结束！`
        if (userParticipated) {
          const userRecords = stats.records.filter(r => r.userId === userId)
          const myPoints = userRecords.reduce((sum, r) => sum + (r.points || 0), 0)
          content += `\n\n您在本活动中：\n• 参与次数：${userRecords.length}次\n• 获得积分：${myPoints}分`
        } else {
          content += '\n\n您未参与本次活动，下次记得来哦~'
        }
        content += `\n\n活动总览：\n• 参与用户：${stats.uniqueUsers}人\n• 发放积分：${stats.totalPointsDistributed}分`
        if (stats.goodsRedeemed > 0) {
          content += `\n• 商品兑换：${stats.goodsRedeemed}件`
        }

        messageManager.addMessage({
          type: MESSAGE_TYPES.ACTIVITY_REPORT,
          title: '📊 活动报告已生成',
          content,
          emoji: '📊',
          data: {
            activityId: activity.id,
            reportId: report.id,
            report,
            link: `/pages/messages/messages?tab=${MESSAGE_TYPES.ACTIVITY_REPORT}`
          }
        })
      }

      activityManager.recordParticipation(activity.id, 'report_generated', {
        userId,
        reportId: report.id,
        extra: { userParticipated }
      })
    }
  },

  checkFlashSaleReminders() {
    const userId = this.getUserId()
    const flashSaleActivities = activityManager.getActivitiesByType(ACTIVITY_TYPES.FLASH_SALE)

    for (const activity of flashSaleActivities) {
      if (messageManager.getSubscriptionSetting('flashSaleReserve')) {
        flashSaleManager.checkPendingReminders(userId, activity, messageManager, MESSAGE_TYPES)
      }
    }
  },

  getAllActivities(includeExpired = false) {
    return activityManager.getAllActivities(includeExpired)
  },

  getActivityById(activityId) {
    return activityManager.getActivityById(activityId)
  },

  checkActivityEligibility(activity) {
    const userInfo = this.globalData.userInfo
    const userContext = {
      userInfo,
      joinDate: userInfo ? userInfo.joinDate : null,
      streakDays: this.getStreakDays()
    }
    return activityManager.checkEligibility(activity, userContext)
  },

  getUserLevelDiscount() {
    return activityManager.getLevelDiscount(this.globalData.userInfo)
  },

  getActivityReports() {
    return activityManager.getReports()
  },

  recordActivityParticipation(activityId, action, data = {}) {
    const userId = this.getUserId()
    return activityManager.recordParticipation(activityId, action, {
      userId,
      ...data
    })
  },

  initCorrectionSystem() {
    correctionManager.init()
    console.log('[App] 纠错系统已初始化')
  },

  getCorrectionManager() {
    return correctionManager
  },

  getContributorTier(userId) {
    return correctionManager.getUserContributorTier(userId || 'current_user')
  },

  getContributorTiers() {
    return CONTRIBUTOR_TIERS
  },

  getCorrectionStats(userId) {
    return correctionManager.getUserCorrectionStats(userId || 'current_user')
  },

  getPendingCorrectionCount() {
    return correctionManager.getPendingCorrections().length
  },

  initCarbonRecords() {
    const stored = wx.getStorageSync('carbonRecords')
    if (stored && stored.length > 0) {
      this.globalData.carbonRecords = stored
    } else {
      const now = new Date()
      const today = formatDate(now, 'YYYY-MM-DD')
      const yesterday = formatDate(new Date(now.getTime() - 86400000), 'YYYY-MM-DD')
      const twoDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 2), 'YYYY-MM-DD')
      const threeDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 3), 'YYYY-MM-DD')
      const weekAgo = formatDate(new Date(now.getTime() - 86400000 * 6), 'YYYY-MM-DD')

      this.globalData.carbonRecords = [
        {
          id: generateId(),
          activityId: 'classifyCorrect',
          activityName: '正确分类',
          quantity: 3,
          co2e: calculateCO2e('classifyCorrect', 3),
          unit: '次',
          emoji: '✅',
          source: 'auto',
          time: today + ' 14:30'
        },
        {
          id: generateId(),
          activityId: 'recyclablePaper',
          activityName: '回收纸张',
          quantity: 1.5,
          co2e: calculateCO2e('recyclablePaper', 1.5),
          unit: 'kg',
          emoji: '📰',
          source: 'manual',
          time: today + ' 10:15'
        },
        {
          id: generateId(),
          activityId: 'useOwnBag',
          activityName: '自带购物袋',
          quantity: 2,
          co2e: calculateCO2e('useOwnBag', 2),
          unit: '次',
          emoji: '🛍️',
          source: 'manual',
          time: yesterday + ' 18:45'
        },
        {
          id: generateId(),
          activityId: 'recyclablePlastic',
          activityName: '回收塑料',
          quantity: 0.8,
          co2e: calculateCO2e('recyclablePlastic', 0.8),
          unit: 'kg',
          emoji: '🧴',
          source: 'manual',
          time: yesterday + ' 15:20'
        },
        {
          id: generateId(),
          activityId: 'reduceSingleUseBottle',
          activityName: '减少塑料瓶',
          quantity: 5,
          co2e: calculateCO2e('reduceSingleUseBottle', 5),
          unit: '个',
          emoji: '🧴',
          source: 'manual',
          time: twoDaysAgo + ' 09:00'
        },
        {
          id: generateId(),
          activityId: 'useOwnBottle',
          activityName: '自带水杯',
          quantity: 4,
          co2e: calculateCO2e('useOwnBottle', 4),
          unit: '次',
          emoji: '🍶',
          source: 'manual',
          time: threeDaysAgo + ' 12:30'
        },
        {
          id: generateId(),
          activityId: 'recyclableMetal',
          activityName: '回收金属',
          quantity: 0.5,
          co2e: calculateCO2e('recyclableMetal', 0.5),
          unit: 'kg',
          emoji: '🥫',
          source: 'order',
          orderId: 'recycle_demo_001',
          time: weekAgo + ' 16:00'
        }
      ]
      wx.setStorageSync('carbonRecords', this.globalData.carbonRecords)
    }
    console.log('[App] 碳减排记录已加载', this.globalData.carbonRecords.length, '条')
  },

  saveCarbonRecords() {
    wx.setStorageSync('carbonRecords', this.globalData.carbonRecords || [])
  },

  addCarbonRecord(record) {
    const now = new Date()
    const timeStr = formatDate(now, 'YYYY-MM-DD HH:mm')
    const { CARBON_FACTORS } = require('./utils/carbon')
    const factor = CARBON_FACTORS[record.activityId] || {}

    const newRecord = {
      id: generateId(),
      activityId: record.activityId,
      activityName: factor.name || record.activityName || '环保行动',
      quantity: Number(record.quantity) || 0,
      co2e: record.co2e || calculateCO2e(record.activityId, Number(record.quantity) || 0),
      unit: factor.unit || record.unit || '次',
      emoji: factor.emoji || record.emoji || '🌱',
      source: record.source || 'manual',
      orderId: record.orderId || '',
      note: record.note || '',
      memberId: record.memberId || this.getUserId(),
      time: timeStr
    }

    if (!this.globalData.carbonRecords) {
      this.globalData.carbonRecords = []
    }
    this.globalData.carbonRecords.unshift(newRecord)
    this.saveCarbonRecords()

    this.checkCarbonMilestones()
    this.syncCarbonToClassify(record)

    console.log('[App] 新增碳减排记录', newRecord.activityName, newRecord.co2e + 'kg CO₂e')
    return newRecord
  },

  syncCarbonToClassify(record) {
    if (record.activityId === 'classifyCorrect' && record.source === 'manual') {
      const count = Math.floor(record.quantity) || 1
      for (let i = 0; i < count; i++) {
        this.addClassifyRecord({
          trashName: '手动记录',
          typeId: 1,
          typeName: '可回收垃圾',
          emoji: '🌱',
          bgColor: 'rgba(74, 144, 217, 0.1)',
          points: 5,
          time: record.time
        })
        this.updateUserPoints(5, {
          category: 'classify',
          title: '垃圾分类',
          desc: '碳账本手动记录',
          emoji: '♻️'
        })
      }
    }
  },

  getCarbonRecords(memberId) {
    const all = this.globalData.carbonRecords || []
    if (!memberId) return all
    const targetMemberId = memberId
    const isCurrentUser = targetMemberId === this.getUserId()
    if (isCurrentUser) {
      return all.filter(r => r.memberId === targetMemberId || r.memberId === undefined)
    }
    return all.filter(r => r.memberId === targetMemberId)
  },

  deleteCarbonRecord(recordId) {
    if (!this.globalData.carbonRecords) return false
    const index = this.globalData.carbonRecords.findIndex(r => r.id === recordId)
    if (index === -1) return false
    this.globalData.carbonRecords.splice(index, 1)
    this.saveCarbonRecords()
    console.log('[App] 删除碳减排记录', recordId)
    return true
  },

  getTotalCarbon(memberId) {
    const records = this.getCarbonRecords(memberId)
    const total = records.reduce((sum, r) => sum + (r.co2e || 0), 0)
    return Number(total.toFixed(2))
  },

  getCarbonPoints(memberId) {
    const totalCO2e = this.getTotalCarbon(memberId)
    const { CARBON_POINTS_RULE } = require('./utils/carbon')
    return Math.floor(totalCO2e / CARBON_POINTS_RULE.co2ePerPoint)
  },

  initCarbonMilestones() {
    const unlocked = wx.getStorageSync('unlockedCarbonMilestones')
    this.globalData.unlockedCarbonMilestones = unlocked || []
    console.log('[App] 碳里程碑已加载，已解锁:', this.globalData.unlockedCarbonMilestones.length)
  },

  checkCarbonMilestones() {
    const totalCO2e = this.getTotalCarbon()
    const unlockedIds = this.globalData.unlockedCarbonMilestones || []
    const newlyUnlocked = []

    CARBON_MILESTONES.forEach(milestone => {
      if (!unlockedIds.includes(milestone.id) && totalCO2e >= milestone.targetCO2e) {
        this.globalData.unlockedCarbonMilestones.push(milestone.id)
        newlyUnlocked.push(milestone)
        console.log('[App] 解锁碳里程碑:', milestone.name)
      }
    })

    if (newlyUnlocked.length > 0) {
      wx.setStorageSync('unlockedCarbonMilestones', this.globalData.unlockedCarbonMilestones)

      const unlockRecords = wx.getStorageSync('carbonMilestoneUnlockRecords') || {}
      const now = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      newlyUnlocked.forEach(m => {
        unlockRecords[m.id] = now
      })
      wx.setStorageSync('carbonMilestoneUnlockRecords', unlockRecords)

      newlyUnlocked.forEach(milestone => {
        if (messageManager && MESSAGE_TYPES.ACHIEVEMENT) {
          messageManager.addMessage({
            type: MESSAGE_TYPES.ACHIEVEMENT,
            title: '碳里程碑解锁',
            content: `恭喜！你已解锁「${milestone.name}」碳减排荣誉：${milestone.desc}`,
            emoji: milestone.emoji,
            data: {
              milestoneId: milestone.id,
              link: '/pages/carbon-milestone/carbon-milestone?unlock=' + milestone.id
            }
          })
        }
      })
    }

    return newlyUnlocked
  },

  getCarbonMilestones() {
    const totalCO2e = this.getTotalCarbon()
    const unlockedIds = this.globalData.unlockedCarbonMilestones || []
    const unlockRecords = wx.getStorageSync('carbonMilestoneUnlockRecords') || {}

    return CARBON_MILESTONES.map(m => ({
      ...m,
      unlocked: unlockedIds.includes(m.id),
      unlockTime: unlockRecords[m.id] || '',
      current: Math.min(totalCO2e, m.targetCO2e),
      target: m.targetCO2e,
      progress: Math.min(100, Number(((totalCO2e / m.targetCO2e) * 100).toFixed(1)))
    }))
  },

  getCarbonMilestoneUnlockTime(milestoneId) {
    const records = wx.getStorageSync('carbonMilestoneUnlockRecords') || {}
    return records[milestoneId] || ''
  },

  syncRecycleOrdersToCarbon() {
    const orders = this.getRecycleOrders ? this.getRecycleOrders() : []
    const syncedIds = wx.getStorageSync('carbonSyncedOrders') || []
    let syncedCount = 0

    orders.forEach(order => {
      if (order.status === 'completed' && !syncedIds.includes(order.id)) {
        const weight = order.totalWeight || 0
        if (weight > 0) {
          this.addCarbonRecord({
            activityId: 'recycleOrderWeight',
            quantity: weight,
            source: 'order',
            orderId: order.id
          })
          syncedIds.push(order.id)
          syncedCount++
        }
      }
    })

    if (syncedCount > 0) {
      wx.setStorageSync('carbonSyncedOrders', syncedIds)
      console.log('[App] 已同步', syncedCount, '条回收订单到碳账本')
    }

    return syncedCount
  },

  initMissionCenter() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const keys = MISSION_CONFIG.storageKeys
    const { weekStartDay } = MISSION_CONFIG

    const weeklyInfo = this.getWeekRange(weekStartDay)
    const weekKey = weeklyInfo.weekKey

    const storedDaily = wx.getStorageSync(keys.dailyProgress) || {}
    const storedWeekly = wx.getStorageSync(keys.weeklyProgress) || {}
    const storedDailyClaimed = wx.getStorageSync(keys.dailyClaimed) || {}
    const storedWeeklyClaimed = wx.getStorageSync(keys.weeklyClaimed) || {}
    const storedTreasureClaimed = wx.getStorageSync(keys.treasureClaimed) || {}
    const storedStreak = wx.getStorageSync(keys.fullCompleteStreak) || { lastDate: '', streak: 0 }

    const dailyProgress = storedDaily.date === today ? storedDaily.data : {}
    const weeklyProgress = storedWeekly.weekKey === weekKey ? storedWeekly.data : {}
    const dailyClaimed = storedDailyClaimed.date === today ? storedDailyClaimed.data : {}
    const weeklyClaimed = storedWeeklyClaimed.weekKey === weekKey ? storedWeeklyClaimed.data : {}
    const treasureClaimed = storedTreasureClaimed.date === today ? storedTreasureClaimed.data : false
    const unlockedAchievements = wx.getStorageSync(keys.unlockedAchievements) || []

    const weeklyClassifyCount = this.initWeeklyCounter(keys.weeklyClassifyCount, weekKey)
    const weeklyQuizCorrect = this.initWeeklyCounter(keys.weeklyQuizCorrect, weekKey)
    const weeklyGamePlay = this.initWeeklyCounter(keys.weeklyGamePlay, weekKey)
    const weeklyCommunityVisit = this.initWeeklyCounter(keys.weeklyCommunityVisit, weekKey)
    const communityLikeCount = this.initDailyCounter(keys.communityLikeCount, today)
    const shareCount = this.initDailyCounter(keys.shareCount, today)

    this.globalData.missionCenter = {
      today,
      weekKey,
      dailyProgress,
      weeklyProgress,
      dailyClaimed,
      weeklyClaimed,
      treasureClaimed,
      unlockedAchievements,
      fullCompleteStreak: storedStreak.streak || 0,
      lastFullCompleteDate: storedStreak.lastDate || '',
      counters: {
        weeklyClassifyCount,
        weeklyQuizCorrect,
        weeklyGamePlay,
        weeklyCommunityVisit,
        communityLikeCount,
        shareCount
      }
    }

    console.log('[App] 任务中心已初始化，连续完成天数:', this.globalData.missionCenter.fullCompleteStreak)
  },

  initWeeklyCounter(storageKey, currentWeekKey) {
    const stored = wx.getStorageSync(storageKey)
    if (stored && stored.weekKey === currentWeekKey) {
      return stored.count || 0
    }
    wx.setStorageSync(storageKey, { weekKey: currentWeekKey, count: 0 })
    return 0
  },

  initDailyCounter(storageKey, currentDate) {
    const stored = wx.getStorageSync(storageKey)
    if (stored && stored.date === currentDate) {
      return stored.count || 0
    }
    wx.setStorageSync(storageKey, { date: currentDate, count: 0 })
    return 0
  },

  getWeekRange(startDay = 1) {
    const now = new Date()
    const day = now.getDay()
    const diff = day >= startDay ? day - startDay : day + 7 - startDay
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - diff)
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    return {
      weekKey: formatDate(weekStart, 'YYYY-MM-DD'),
      weekStart: formatDate(weekStart, 'YYYY-MM-DD'),
      weekEnd: formatDate(weekEnd, 'YYYY-MM-DD')
    }
  },

  saveMissionDailyProgress() {
    const mc = this.globalData.missionCenter
    wx.setStorageSync(MISSION_CONFIG.storageKeys.dailyProgress, {
      date: mc.today,
      data: mc.dailyProgress
    })
    wx.setStorageSync(MISSION_CONFIG.storageKeys.dailyClaimed, {
      date: mc.today,
      data: mc.dailyClaimed
    })
    wx.setStorageSync(MISSION_CONFIG.storageKeys.treasureClaimed, {
      date: mc.today,
      data: mc.treasureClaimed
    })
  },

  saveMissionWeeklyProgress() {
    const mc = this.globalData.missionCenter
    wx.setStorageSync(MISSION_CONFIG.storageKeys.weeklyProgress, {
      weekKey: mc.weekKey,
      data: mc.weeklyProgress
    })
    wx.setStorageSync(MISSION_CONFIG.storageKeys.weeklyClaimed, {
      weekKey: mc.weekKey,
      data: mc.weeklyClaimed
    })
  },

  saveMissionCounters() {
    const mc = this.globalData.missionCenter
    const keys = MISSION_CONFIG.storageKeys
    wx.setStorageSync(keys.weeklyClassifyCount, { weekKey: mc.weekKey, count: mc.counters.weeklyClassifyCount })
    wx.setStorageSync(keys.weeklyQuizCorrect, { weekKey: mc.weekKey, count: mc.counters.weeklyQuizCorrect })
    wx.setStorageSync(keys.weeklyGamePlay, { weekKey: mc.weekKey, count: mc.counters.weeklyGamePlay })
    wx.setStorageSync(keys.weeklyCommunityVisit, { weekKey: mc.weekKey, count: mc.counters.weeklyCommunityVisit })
    wx.setStorageSync(keys.communityLikeCount, { date: mc.today, count: mc.counters.communityLikeCount })
    wx.setStorageSync(keys.shareCount, { date: mc.today, count: mc.counters.shareCount })
  },

  getMissionProgress(missionId, isWeekly = false) {
    const mc = this.globalData.missionCenter
    const progress = isWeekly ? mc.weeklyProgress : mc.dailyProgress
    return progress[missionId] || 0
  },

  setMissionProgress(missionId, value, isWeekly = false) {
    const mc = this.globalData.missionCenter
    if (isWeekly) {
      mc.weeklyProgress[missionId] = value
      this.saveMissionWeeklyProgress()
    } else {
      mc.dailyProgress[missionId] = value
      this.saveMissionDailyProgress()
    }
  },

  isMissionClaimed(missionId, isWeekly = false) {
    const mc = this.globalData.missionCenter
    const claimed = isWeekly ? mc.weeklyClaimed : mc.dailyClaimed
    return claimed[missionId] === true
  },

  markMissionClaimed(missionId, isWeekly = false) {
    const mc = this.globalData.missionCenter
    if (isWeekly) {
      mc.weeklyClaimed[missionId] = true
      this.saveMissionWeeklyProgress()
    } else {
      mc.dailyClaimed[missionId] = true
      this.saveMissionDailyProgress()
    }
  },

  getVisibleDailyMissions(isChildMode = false) {
    const missions = DAILY_MISSIONS.filter(m => !isChildMode || m.forChild)
    return missions.map(m => {
      const progress = this.computeDailyMissionProgress(m)
      this.setMissionProgress(m.id, progress, false)
      const target = m.target
      const isCompleted = progress >= target
      const isClaimed = this.isMissionClaimed(m.id, false)
      const canClaim = isCompleted && !isClaimed
      return {
        ...m,
        displayName: isChildMode && m.childDescription ? m.childDescription : m.name,
        displayEmoji: isChildMode && m.childEmoji ? m.childEmoji : m.emoji,
        displayLink: isChildMode ? m.childLink : m.link,
        progress: Math.min(progress, target),
        target,
        progressPercent: Math.min(100, Math.floor((progress / target) * 100)),
        isCompleted,
        isClaimed,
        canClaim,
        statusText: isClaimed ? '已领取' : (isCompleted ? '可领取' : '进行中')
      }
    }).sort((a, b) => a.sortOrder - b.sortOrder)
  },

  getVisibleWeeklyMissions(isChildMode = false) {
    const missions = WEEKLY_MISSIONS.filter(m => !isChildMode || m.forChild)
    return missions.map(m => {
      const progress = this.computeWeeklyMissionProgress(m)
      this.setMissionProgress(m.id, progress, true)
      const target = m.target
      const isCompleted = progress >= target
      const isClaimed = this.isMissionClaimed(m.id, true)
      const canClaim = isCompleted && !isClaimed
      return {
        ...m,
        displayName: isChildMode && m.childDescription ? m.childDescription : m.name,
        displayEmoji: isChildMode && m.childEmoji ? m.childEmoji : m.emoji,
        displayLink: isChildMode ? m.childLink : m.link,
        progress: Math.min(progress, target),
        target,
        progressPercent: Math.min(100, Math.floor((progress / target) * 100)),
        isCompleted,
        isClaimed,
        canClaim,
        statusText: isClaimed ? '已领取' : (isCompleted ? '可领取' : '进行中')
      }
    }).sort((a, b) => a.sortOrder - b.sortOrder)
  },

  computeDailyMissionProgress(mission) {
    const mc = this.globalData.missionCenter
    const today = mc.today

    switch (mission.id) {
      case 'daily_signin':
        return this.isTodaySignedIn() ? 1 : 0
      case 'daily_classify':
        const classifyRecords = this.getClassifyRecords()
        return classifyRecords.filter(r => {
          const rDate = r.time ? r.time.split(' ')[0] : ''
          return rDate === today
        }).length > 0 ? 1 : 0
      case 'daily_share':
        return mc.counters.shareCount || 0
      case 'daily_game':
        return this.getTodayGamePlayCount() > 0 ? 1 : 0
      case 'daily_community_like':
        return mc.counters.communityLikeCount || 0
      default:
        return 0
    }
  },

  computeWeeklyMissionProgress(mission) {
    const mc = this.globalData.missionCenter
    switch (mission.id) {
      case 'weekly_classify_10':
        return mc.counters.weeklyClassifyCount || 0
      case 'weekly_quiz_20':
        return mc.counters.weeklyQuizCorrect || 0
      case 'weekly_game_5':
        return mc.counters.weeklyGamePlay || 0
      case 'weekly_community_5':
        return mc.counters.weeklyCommunityVisit || 0
      default:
        return 0
    }
  },

  getTodayGamePlayCount() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const dailyPlays = wx.getStorageSync('dailyGamePlays')
    if (dailyPlays && dailyPlays.date === today) {
      return dailyPlays.count || 0
    }
    return 0
  },

  claimMissionReward(missionId, isWeekly = false) {
    const missions = isWeekly ? WEEKLY_MISSIONS : DAILY_MISSIONS
    const mission = missions.find(m => m.id === missionId)
    if (!mission) return { success: false, message: '任务不存在' }

    const isClaimed = this.isMissionClaimed(missionId, isWeekly)
    if (isClaimed) return { success: false, message: '奖励已领取', alreadyClaimed: true }

    const progress = this.getMissionProgress(missionId, isWeekly)
    if (progress < mission.target) return { success: false, message: '任务未完成' }

    this.markMissionClaimed(missionId, isWeekly)
    this.updateUserPoints(mission.points, {
      category: 'mission',
      title: isWeekly ? '周任务奖励' : '日任务奖励',
      desc: mission.name,
      emoji: mission.emoji
    })

    console.log('[App] 任务奖励已领取', mission.name, '+', mission.points, '积分')
    return { success: true, points: mission.points, mission }
  },

  claimAllAvailableMissions() {
    const isChild = this.isChildModeEnabled()
    const dailyMissions = this.getVisibleDailyMissions(isChild)
    const weeklyMissions = this.getVisibleWeeklyMissions(isChild)

    let totalPoints = 0
    let dailyCount = 0
    let weeklyCount = 0

    dailyMissions.forEach(m => {
      if (m.canClaim) {
        const result = this.claimMissionReward(m.id, false)
        if (result.success) {
          totalPoints += result.points
          dailyCount++
        }
      }
    })

    weeklyMissions.forEach(m => {
      if (m.canClaim) {
        const result = this.claimMissionReward(m.id, true)
        if (result.success) {
          totalPoints += result.points
          weeklyCount++
        }
      }
    })

    return { totalPoints, dailyCount, weeklyCount }
  },

  isDailyTreasureAvailable() {
    const isChild = this.isChildModeEnabled()
    const missions = this.getVisibleDailyMissions(isChild)
    const allCompleted = missions.every(m => m.isCompleted)
    const mc = this.globalData.missionCenter
    return allCompleted && !mc.treasureClaimed
  },

  isDailyTreasureClaimed() {
    return this.globalData.missionCenter.treasureClaimed === true
  },

  getDailyMissionsSummary() {
    const isChild = this.isChildModeEnabled()
    const missions = this.getVisibleDailyMissions(isChild)
    const completed = missions.filter(m => m.isCompleted).length
    const claimed = missions.filter(m => m.isClaimed).length
    const canClaimCount = missions.filter(m => m.canClaim).length
    const total = missions.length
    const progressPercent = total > 0 ? Math.floor((completed / total) * 100) : 0
    const allCompleted = completed === total
    return { completed, claimed, canClaimCount, total, progressPercent, allCompleted }
  },

  claimDailyTreasure() {
    if (!this.isDailyTreasureAvailable()) {
      return { success: false, message: '宝箱不可领取', alreadyClaimed: this.isDailyTreasureClaimed() }
    }

    const mc = this.globalData.missionCenter
    mc.treasureClaimed = true
    this.saveMissionDailyProgress()

    const today = mc.today
    const yesterday = formatDate(new Date(Date.now() - 86400000), 'YYYY-MM-DD')

    if (mc.lastFullCompleteDate === yesterday) {
      mc.fullCompleteStreak = (mc.fullCompleteStreak || 0) + 1
    } else if (mc.lastFullCompleteDate !== today) {
      mc.fullCompleteStreak = 1
    }
    mc.lastFullCompleteDate = today

    wx.setStorageSync(MISSION_CONFIG.storageKeys.fullCompleteStreak, {
      lastDate: today,
      streak: mc.fullCompleteStreak
    })

    this.updateUserPoints(DAILY_TREASURE_BOX.points, {
      category: 'mission',
      title: DAILY_TREASURE_BOX.name,
      desc: '完成全部每日任务奖励',
      emoji: DAILY_TREASURE_BOX.emoji
    })

    const unlockedList = this.checkAndUnlockMissionAchievements()

    console.log('[App] 每日宝箱已领取，+', DAILY_TREASURE_BOX.points, '积分，连续完成天数:', mc.fullCompleteStreak)
    return {
      success: true,
      points: DAILY_TREASURE_BOX.points,
      fullCompleteStreak: mc.fullCompleteStreak,
      newlyUnlockedAchievements: unlockedList
    }
  },

  getFullCompleteStreak() {
    return this.globalData.missionCenter.fullCompleteStreak || 0
  },

  getMissionAchievements() {
    const streak = this.getFullCompleteStreak()
    const unlockedIds = this.globalData.missionCenter.unlockedAchievements || []
    const unlockRecords = wx.getStorageSync('missionAchievementUnlockRecords') || {}

    return MISSION_ACHIEVEMENTS.map(a => {
      const unlocked = unlockedIds.includes(a.id) || streak >= a.target
      return {
        ...a,
        unlocked,
        current: Math.min(streak, a.target),
        target: a.target,
        progress: Math.min(100, Math.floor((streak / a.target) * 100)),
        unlockTime: unlockRecords[a.id] || ''
      }
    })
  },

  checkAndUnlockMissionAchievements() {
    const streak = this.getFullCompleteStreak()
    const unlockedIds = this.globalData.missionCenter.unlockedAchievements || []
    const unlockRecords = wx.getStorageSync('missionAchievementUnlockRecords') || {}
    const newlyUnlocked = []
    const now = formatDate(new Date(), 'YYYY-MM-DD HH:mm')

    MISSION_ACHIEVEMENTS.forEach(a => {
      if (!unlockedIds.includes(a.id) && streak >= a.target) {
        unlockedIds.push(a.id)
        unlockRecords[a.id] = now
        newlyUnlocked.push(a)

        this.updateUserPoints(a.rewardPoints, {
          category: 'achievement',
          title: '成就解锁',
          desc: a.name,
          emoji: a.emoji
        })

        if (messageManager && MESSAGE_TYPES.ACHIEVEMENT) {
          messageManager.addMessage({
            type: MESSAGE_TYPES.ACHIEVEMENT,
            title: '成就解锁',
            content: `恭喜！你已解锁「${a.name}」成就：${a.description}`,
            emoji: a.emoji,
            data: { achievementId: a.id, link: '/pages/mission-center/mission-center' }
          })
        }

        console.log('[App] 任务成就解锁:', a.name)
      }
    })

    if (newlyUnlocked.length > 0) {
      this.globalData.missionCenter.unlockedAchievements = unlockedIds
      wx.setStorageSync(MISSION_CONFIG.storageKeys.unlockedAchievements, unlockedIds)
      wx.setStorageSync('missionAchievementUnlockRecords', unlockRecords)
    }

    return newlyUnlocked
  },

  incrementMissionCounter(counterKey, amount = 1) {
    const mc = this.globalData.missionCenter
    if (mc.counters[counterKey] !== undefined) {
      mc.counters[counterKey] += amount
      this.saveMissionCounters()
      console.log('[App] 任务计数器更新', counterKey, ':', mc.counters[counterKey])
    }
  },

  incrementClassifyForMission() {
    this.incrementMissionCounter('weeklyClassifyCount', 1)
  },

  incrementQuizCorrectForMission(amount = 1) {
    this.incrementMissionCounter('weeklyQuizCorrect', amount)
  },

  incrementGamePlayForMission() {
    this.incrementMissionCounter('weeklyGamePlay', 1)
  },

  incrementCommunityVisitForMission() {
    this.incrementMissionCounter('weeklyCommunityVisit', 1)
  },

  incrementCommunityLikeForMission() {
    this.incrementMissionCounter('communityLikeCount', 1)
  },

  incrementShareForMission() {
    this.incrementMissionCounter('shareCount', 1)
  },

  getMissionCenterBadge() {
    const isChild = this.isChildModeEnabled()
    const daily = this.getVisibleDailyMissions(isChild)
    const weekly = this.getVisibleWeeklyMissions(isChild)
    let count = 0
    daily.forEach(m => { if (m.canClaim) count++ })
    weekly.forEach(m => { if (m.canClaim) count++ })
    if (this.isDailyTreasureAvailable()) count++
    return count > 0 ? count : null
  },

  initLotterySystem() {
    this.globalData.lotterySystem = lotterySystem
    const festivalBox = lotterySystem.getCurrentFestivalBox()
    this.globalData.festivalBoxActive = festivalBox
    this.checkCouponExpiry()
    this.checkPhysicalPrizePending()
    if (festivalBox && messageManager.getSubscriptionSetting('festivalBoxReminder')) {
      messageManager.addMessage({
        type: MESSAGE_TYPES.FESTIVAL_BOX,
        title: `${festivalBox.name}上架啦！`,
        content: `${festivalBox.description}，快去盲盒中心看看吧！`,
        emoji: festivalBox.emoji,
        data: { link: '/pages/blindbox/blindbox', festivalBoxId: festivalBox.id }
      })
    }
    console.log('[App] 抽奖系统已初始化', festivalBox ? '当前节日盲盒: ' + festivalBox.name : '无节日盲盒')
  },

  getLotteryStats() {
    return lotterySystem.getLotteryStats()
  },

  getProbabilityDisclosure(festivalBoxId = null) {
    return lotterySystem.getProbabilityDisclosure(festivalBoxId)
  },

  getAvailableFestivalBoxes() {
    return lotterySystem.getAvailableFestivalBoxes()
  },

  getCurrentFestivalBox() {
    return lotterySystem.getCurrentFestivalBox()
  },

  doLotteryDraw(drawCount = 1) {
    const cost = drawCount === 10 ? LOTTERY_CONFIG.costPerTenDraw : LOTTERY_CONFIG.costPerDraw * drawCount
    const validate = lotterySystem.validateDrawForUser(this, cost, drawCount, false)
    if (!validate.success) {
      return { success: false, ...validate }
    }

    this.updateUserPoints(-cost, {
      category: 'lottery',
      title: drawCount === 1 ? '幸运转盘抽奖' : `幸运转盘x${drawCount}`,
      desc: `消耗${cost}积分`,
      emoji: '🎰'
    })

    let result
    if (drawCount === 1) {
      const draw = lotterySystem.performSingleDraw()
      result = { prizes: [draw.prize], stats: draw.stats, summary: {} }
    } else {
      result = lotterySystem.performMultiDraw(drawCount)
    }

    const deliveryResults = []
    result.prizes.forEach(prize => {
      const delivery = lotterySystem.processPrizeDelivery(this, prize, 'lottery')
      deliveryResults.push(delivery)
    })

    const rarePrizes = result.prizes.filter(p =>
      lotterySystem.isRarityOrHigher(p.rarity, LOTTERY_PRIZE_RARITY.RARE)
    )
    if (rarePrizes.length > 0 && messageManager.getSubscriptionSetting('lotteryWinNotice')) {
      const names = rarePrizes.map(p => `${p.emoji}${p.name}`).join('、')
      messageManager.addMessage({
        type: MESSAGE_TYPES.LOTTERY_WIN,
        title: `恭喜抽中${rarePrizes.length}件稀有奖品！`,
        content: `您抽中了：${names}`,
        emoji: '🎉',
        data: { link: '/pages/lottery-records/lottery-records' }
      })
    }

    if (result.stats && result.stats.triggeredGuarantee) {
      messageManager.addMessage({
        type: MESSAGE_TYPES.LOTTERY_GUARANTEE,
        title: '保底机制已触发！',
        content: '恭喜您通过保底机制获得了稀有以上品质的奖品！',
        emoji: '🎯',
        data: { link: '/pages/lottery-records/lottery-records' }
      })
    }

    const physicalPrizes = result.prizes.filter(p => p.type === LOTTERY_PRIZE_TYPES.PHYSICAL)
    if (physicalPrizes.length > 0 && messageManager.getSubscriptionSetting('physicalPrizeReminder')) {
      messageManager.addMessage({
        type: MESSAGE_TYPES.PHYSICAL_PRIZE_PENDING,
        title: '实物奖品待领取',
        content: `恭喜抽中${physicalPrizes.length}件实物奖品，请及时填写收货地址领取~`,
        emoji: '📮',
        data: { link: '/pages/address-list/address-list' }
      })
    }

    console.log('[App] 抽奖完成', drawCount, '次，奖品数:', result.prizes.length)
    return { success: true, ...result, deliveryResults }
  },

  doBlindboxDraw(boxId = 'box_normal') {
    const festivalBoxes = lotterySystem.getAvailableFestivalBoxes()
    const festivalBox = festivalBoxes.find(b => b.id === boxId)
    const normalBox = BLINDBOX_CONFIG.normalBox
    const box = festivalBox || normalBox

    const validate = lotterySystem.validateDrawForUser(this, box.cost, 1, true)
    if (!validate.success) {
      return { success: false, ...validate }
    }

    this.updateUserPoints(-box.cost, {
      category: 'blindbox',
      title: box.name,
      desc: `消耗${box.cost}积分开启盲盒`,
      emoji: box.emoji
    })

    const result = lotterySystem.performBlindboxDraw(boxId)

    result.prizes.forEach(prize => {
      lotterySystem.processPrizeDelivery(this, prize, 'blindbox')
    })

    const rarePrizes = result.prizes.filter(p =>
      lotterySystem.isRarityOrHigher(p.rarity, LOTTERY_PRIZE_RARITY.RARE)
    )
    if (rarePrizes.length > 0) {
      const names = rarePrizes.map(p => `${p.emoji}${p.name}`).join('、')
      messageManager.addMessage({
        type: result.isFestival ? MESSAGE_TYPES.FESTIVAL_BOX : MESSAGE_TYPES.BLINDBOX_OPEN,
        title: `${box.name}开启！获得${rarePrizes.length}件稀有奖品`,
        content: `获得稀有奖品：${names}`,
        emoji: box.emoji,
        data: { link: '/pages/lottery-records/lottery-records' }
      })
    }

    console.log('[App] 盲盒开启完成', box.name, '奖品数:', result.prizes.length)
    return { success: true, ...result }
  },

  getLotteryRecords() {
    return lotterySystem.getLotteryRecords()
  },

  getLotteryCoupons() {
    return lotterySystem.getLotteryCoupons()
  },

  getValidCoupons(pointsRequired = 0) {
    return lotterySystem.getValidCoupons(pointsRequired)
  },

  useCoupon(couponId, orderPoints) {
    return lotterySystem.useCoupon(couponId, orderPoints)
  },

  getPhysicalPrizeRecords() {
    return lotterySystem.getPhysicalPrizeRecords()
  },

  claimPhysicalPrize(prizeId, addressId) {
    const physicals = lotterySystem.getPhysicalPrizeRecords()
    const prize = physicals.find(p => p.id === prizeId)
    if (!prize) return { success: false, message: '奖品不存在' }
    if (prize.status !== 'pending_address') return { success: false, message: '当前状态无法领取' }

    const address = this.getAddressById(addressId)
    if (!address) return { success: false, message: '地址不存在' }

    const order = this.addOrder({
      id: generateId(),
      goodsId: prize.linkedGoodsId || 0,
      goodsName: prize.name,
      goodsImage: '',
      points: 0,
      quantity: 1,
      addressId: addressId,
      address: address,
      createTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      remark: '抽奖实物奖品',
      source: 'lottery',
      lotteryPrizeId: prizeId
    })

    lotterySystem.updatePhysicalPrizeStatus(prizeId, 'ordered', {
      addressId: addressId,
      orderId: order.id,
      claimedAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    })

    console.log('[App] 实物奖品领取成功，订单号:', order.id)
    return { success: true, order, prize }
  },

  checkCouponExpiry() {
    const coupons = lotterySystem.getLotteryCoupons()
    const today = lotterySystem.getTodayStr()
    const threeDaysLater = new Date(Date.now() + 3 * 86400000)
    const threeDaysLaterStr = formatDate(threeDaysLater, 'YYYY-MM-DD')

    const expiringSoon = coupons.filter(c =>
      !c.used &&
      c.expireAt >= today &&
      c.expireAt <= threeDaysLaterStr
    )

    expiringSoon.forEach(coupon => {
      const alreadyNotified = wx.getStorageSync('couponExpiryNotified_' + coupon.id)
      if (!alreadyNotified) {
        messageManager.addMessage({
          type: MESSAGE_TYPES.COUPON_EXPIRE,
          title: '优惠券即将过期',
          content: `您的「${coupon.name}」将在${coupon.expireAt}过期，快去兑换商城使用吧！`,
          emoji: coupon.emoji || '🎫',
          data: { link: '/pages/exchange/exchange', couponId: coupon.id }
        })
        wx.setStorageSync('couponExpiryNotified_' + coupon.id, true)
      }
    })

    if (expiringSoon.length > 0) {
      console.log('[App] 优惠券过期提醒已触发', expiringSoon.length, '张')
    }
  },

  checkPhysicalPrizePending() {
    const physicals = lotterySystem.getPhysicalPrizeRecords()
    const pending = physicals.filter(p => p.status === 'pending_address')

    pending.forEach(prize => {
      const alreadyNotified = wx.getStorageSync('physicalPendingNotified_' + prize.id)
      if (!alreadyNotified) {
        messageManager.addMessage({
          type: MESSAGE_TYPES.PHYSICAL_PRIZE_PENDING,
          title: '实物奖品待领取',
          content: `您抽中的「${prize.name}」还未填写收货地址，点击去填写~`,
          emoji: prize.emoji || '📮',
          data: { link: '/pages/address-list/address-list', prizeId: prize.id }
        })
        wx.setStorageSync('physicalPendingNotified_' + prize.id, true)
      }
    })
  }
})
