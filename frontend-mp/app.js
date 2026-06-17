/**
 * 垃圾分类小程序 - 入口文件
 * @description 小程序全局逻辑
 */
const { generateId, formatDate } = require('./utils/util')
const { getUserLevel, ACHIEVEMENTS } = require('./utils/constants')

App({
  /**
   * 小程序启动时触发
   */
  onLaunch(options = {}) {
    console.log('[App] 小程序启动')

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
    this.checkAndExpirePoints()
    this.getSystemInfo()
    this.simulateAutoShipping()
    this.processInviterOnLaunch(options)
  },

  onShow() {
    console.log('[App] 小程序显示')
    this.simulateAutoShipping()
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
        joinDate: this.formatDate(new Date())
      }
      this.globalData.userInfo = defaultUserInfo
      wx.setStorageSync('userInfo', defaultUserInfo)
      console.log('[App] 已创建默认用户信息')
    }
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
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    const oneYearAgoStr = formatDate(oneYearAgo, 'YYYY-MM-DD')

    const records = this.getPointsRecords()
    let totalExpired = 0
    const expiredIds = []

    records.forEach(record => {
      if (record.type === 'earn' && !record.expired) {
        const recordDate = record.time ? record.time.split(' ')[0] : ''
        if (recordDate < oneYearAgoStr) {
          record.expired = true
          record.expireTime = formatDate(now, 'YYYY-MM-DD HH:mm')
          expiredIds.push(record.id)
          totalExpired += record.points
        }
      }
    })

    if (totalExpired > 0) {
      wx.setStorageSync('pointsRecords', records)
      this.globalData.pointsRecords = records

      const userInfo = this.globalData.userInfo
      userInfo.points = Math.max(0, userInfo.points - totalExpired)
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
        time: formatDate(now, 'YYYY-MM-DD HH:mm')
      }
      this.addPointsRecord(expireRecord)

      console.log('[App] 积分过期扣减', totalExpired, '分')
    }

    return totalExpired
  },

  getExpiringPoints() {
    const now = new Date()
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const thirtyDaysLaterStr = formatDate(thirtyDaysLater, 'YYYY-MM-DD')
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

    const records = this.getPointsRecords()
    let expiringPoints = 0
    let expireDate = ''

    records.forEach(record => {
      if (record.type === 'earn' && !record.expired && record.time) {
        const recordDateStr = record.time.split(' ')[0]
        const recordDate = new Date(recordDateStr)
        const expireTime = new Date(recordDate.getTime() + 365 * 24 * 60 * 60 * 1000)
        const expireTimeStr = formatDate(expireTime, 'YYYY-MM-DD')

        if (expireTimeStr <= thirtyDaysLaterStr && expireTime > now) {
          expiringPoints += record.points
          if (!expireDate || expireTimeStr < expireDate) {
            expireDate = expireTimeStr
          }
        }
      }
    })

    return {
      points: expiringPoints,
      expireDate: expireDate || '—'
    }
  },

  getPointsValidityInfo() {
    const expiring = this.getExpiringPoints()
    const totalEarned = this.getPointsRecords()
      .filter(r => r.type === 'earn' && !r.expired)
      .reduce((sum, r) => sum + r.points, 0)

    return {
      totalValid: totalEarned,
      expiringPoints: expiring.points,
      nearestExpireDate: expiring.expireDate,
      validityPeriod: '自获取之日起1年内有效'
    }
  },

  initPointsRecords() {
    const records = wx.getStorageSync('pointsRecords')
    if (records) {
      this.globalData.pointsRecords = records
    } else {
      const now = new Date()
      const today = formatDate(now, 'YYYY-MM-DD')
      const yesterday = formatDate(new Date(now.getTime() - 86400000), 'YYYY-MM-DD')
      const twoDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 2), 'YYYY-MM-DD')
      const threeDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 3), 'YYYY-MM-DD')

      this.globalData.pointsRecords = [
        {
          id: generateId(),
          type: 'earn',
          category: 'classify',
          title: '垃圾分类',
          desc: '正确分类塑料瓶',
          emoji: '♻️',
          points: 10,
          time: today + ' 14:30'
        },
        {
          id: generateId(),
          type: 'spend',
          category: 'exchange',
          title: '积分兑换',
          desc: '兑换环保购物袋',
          emoji: '🛍️',
          points: 100,
          time: today + ' 10:15'
        },
        {
          id: generateId(),
          type: 'earn',
          category: 'signin',
          title: '每日签到',
          desc: '连续签到第15天',
          emoji: '📅',
          points: 20,
          time: today + ' 08:00'
        },
        {
          id: generateId(),
          type: 'earn',
          category: 'classify',
          title: '垃圾分类',
          desc: '正确分类厨余垃圾',
          emoji: '🍂',
          points: 5,
          time: yesterday + ' 18:45'
        },
        {
          id: generateId(),
          type: 'spend',
          category: 'exchange',
          title: '积分兑换',
          desc: '兑换便携餐具套装',
          emoji: '🍴',
          points: 200,
          time: yesterday + ' 14:20'
        },
        {
          id: generateId(),
          type: 'earn',
          category: 'quiz',
          title: '知识问答',
          desc: '答题正确5道',
          emoji: '❓',
          points: 50,
          time: twoDaysAgo + ' 20:30'
        },
        {
          id: generateId(),
          type: 'earn',
          category: 'invite',
          title: '邀请好友',
          desc: '好友注册成功',
          emoji: '👥',
          points: 100,
          time: threeDaysAgo
        }
      ]
      wx.setStorageSync('pointsRecords', this.globalData.pointsRecords)
    }
    console.log('[App] 积分记录已加载', this.globalData.pointsRecords.length, '条')
  },

  addPointsRecord(record) {
    this.globalData.pointsRecords.unshift(record)
    wx.setStorageSync('pointsRecords', this.globalData.pointsRecords)
    console.log('[App] 新增积分记录', record.title)
  },

  getPointsRecords() {
    return this.globalData.pointsRecords || []
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
    this.globalData.classifyRecords.unshift(record)
    wx.setStorageSync('classifyRecords', this.globalData.classifyRecords)
    console.log('[App] 新增分类记录', record.trashName)
  },

  getClassifyRecords() {
    return this.globalData.classifyRecords || []
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
          time: twoDaysAgo + ' 20:30'
        }
      ]
      wx.setStorageSync('quizRecords', this.globalData.quizRecords)
    }
    console.log('[App] 答题记录已加载', this.globalData.quizRecords.length, '条')
  },

  addQuizRecord(record) {
    this.globalData.quizRecords.unshift(record)
    wx.setStorageSync('quizRecords', this.globalData.quizRecords)
    console.log('[App] 新增答题记录', record.points + '分')
  },

  getQuizRecords() {
    return this.globalData.quizRecords || []
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

  addSignInRecord(dateStr) {
    const records = this.globalData.signInRecords || []
    if (!records.includes(dateStr)) {
      records.push(dateStr)
      this.globalData.signInRecords = records
      wx.setStorageSync('signInRecords', records)
      console.log('[App] 新增签到记录', dateStr)
    }
  },

  getSignInRecords() {
    return this.globalData.signInRecords || []
  },

  /**
   * 初始化每日一练完成记录（独立于签到记录）
   */
  initDailyQuizRecords() {
    const records = wx.getStorageSync('dailyQuizRecords')
    if (records) {
      this.globalData.dailyQuizRecords = records
    } else {
      const now = new Date()
      const records = []
      for (let i = 0; i < 10; i++) {
        const date = new Date(now.getTime() - 86400000 * i)
        records.push(formatDate(date, 'YYYY-MM-DD'))
      }
      records.reverse()
      this.globalData.dailyQuizRecords = records
      wx.setStorageSync('dailyQuizRecords', records)
    }
    console.log('[App] 每日一练记录已加载', this.globalData.dailyQuizRecords.length, '条')
  },

  /**
   * 添加每日一练完成记录
   * @param {string} dateStr 日期字符串 YYYY-MM-DD
   */
  addDailyQuizRecord(dateStr) {
    const records = this.globalData.dailyQuizRecords || []
    if (!records.includes(dateStr)) {
      records.push(dateStr)
      this.globalData.dailyQuizRecords = records
      wx.setStorageSync('dailyQuizRecords', records)
      console.log('[App] 新增每日一练记录', dateStr)
    }
  },

  /**
   * 获取每日一练完成记录
   * @returns {Array} 日期数组
   */
  getDailyQuizRecords() {
    return this.globalData.dailyQuizRecords || []
  },

  initWrongQuestions() {
    const wrongQuestions = wx.getStorageSync('wrongQuestions')
    this.globalData.wrongQuestions = wrongQuestions || []
    console.log('[App] 错题数据已加载', this.globalData.wrongQuestions.length, '条')
  },

  addWrongQuestion(question) {
    let wrongQuestions = this.globalData.wrongQuestions || []
    const existingIndex = wrongQuestions.findIndex(q => q.id === question.id)

    if (existingIndex > -1) {
      wrongQuestions[existingIndex] = {
        ...wrongQuestions[existingIndex],
        wrongCount: (wrongQuestions[existingIndex].wrongCount || 1) + 1,
        wrongTime: new Date().toISOString()
      }
    } else {
      wrongQuestions.push({
        ...question,
        wrongCount: 1,
        wrongTime: new Date().toISOString()
      })
    }

    this.globalData.wrongQuestions = wrongQuestions
    wx.setStorageSync('wrongQuestions', wrongQuestions)
    console.log('[App] 错题已更新', question.question, '错误次数:', wrongQuestions.find(q => q.id === question.id)?.wrongCount || 1)
  },

  removeWrongQuestion(questionId) {
    let wrongQuestions = this.globalData.wrongQuestions || []
    wrongQuestions = wrongQuestions.filter(q => q.id !== questionId)
    this.globalData.wrongQuestions = wrongQuestions
    wx.setStorageSync('wrongQuestions', wrongQuestions)
    console.log('[App] 错题已移除', questionId)
  },

  getWrongQuestions() {
    return this.globalData.wrongQuestions || []
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
  isTodaySignedIn() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const records = this.getSignInRecords()
    return records.includes(today)
  },

  /**
   * 获取连续打卡天数（统一逻辑：签到 + 每日一练合并计算）
   * 一天内任意完成签到或答题都算当天打卡
   * @returns {number} 连续天数
   */
  getStreakDays() {
    const signInRecords = this.getSignInRecords()
    const dailyQuizRecords = this.getDailyQuizRecords()
    const mergedRecords = Array.from(new Set([...signInRecords, ...dailyQuizRecords]))
    return this.calculateContinuousDays(mergedRecords)
  },

  /**
   * 执行签到
   * @returns {Object} { success, points, bonus, streakDays, alreadySigned }
   */
  doSignIn() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')

    if (this.isTodaySignedIn()) {
      return {
        success: false,
        alreadySigned: true,
        points: 0,
        bonus: 0,
        streakDays: this.getStreakDays()
      }
    }

    this.addSignInRecord(today)

    const basePoints = 5
    this.updateUserPoints(basePoints, {
      category: 'signin',
      title: '每日签到',
      desc: '每日签到奖励',
      emoji: '📅'
    })

    const streakDays = this.getStreakDays()
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
  updateUserPoints(points, recordInfo = null) {
    const userInfo = this.globalData.userInfo
    userInfo.points = Math.max(0, userInfo.points + points)
    const levelInfo = getUserLevel(userInfo.points)
    userInfo.level = levelInfo.level
    this.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
    console.log('[App] 用户积分已更新', userInfo.points, '等级:', userInfo.level)

    if (recordInfo) {
      const now = new Date()
      const timeStr = formatDate(now, 'YYYY-MM-DD HH:mm')
      const record = {
        id: generateId(),
        type: points >= 0 ? 'earn' : 'spend',
        category: recordInfo.category || 'other',
        title: recordInfo.title || (points >= 0 ? '积分获取' : '积分消费'),
        desc: recordInfo.desc || '',
        emoji: recordInfo.emoji || (points >= 0 ? '💰' : '💸'),
        points: Math.abs(points),
        time: timeStr
      }
      this.addPointsRecord(record)
    }

    this.checkAchievements()
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
      }

      if (unlocked) {
        this.globalData.unlockedAchievements.push(achievement.id)
        newlyUnlocked.push(achievement)
        console.log('[App] 解锁成就:', achievement.name)
      }
    })

    if (newlyUnlocked.length > 0) {
      wx.setStorageSync('unlockedAchievements', this.globalData.unlockedAchievements)
    }

    return newlyUnlocked
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
   * 全局数据
   */
  globalData: {
    userInfo: null,
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
    unlockedAchievements: []
  }
})
