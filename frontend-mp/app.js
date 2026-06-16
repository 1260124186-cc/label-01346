/**
 * 垃圾分类小程序 - 入口文件
 * @description 小程序全局逻辑
 */
const { generateId, formatDate } = require('./utils/util')

App({
  /**
   * 小程序启动时触发
   */
  onLaunch() {
    console.log('[App] 小程序启动')
    
    this.initUserInfo()
    this.initOrders()
    this.initPointsRecords()
    this.initClassifyRecords()
    this.initQuizRecords()
    this.initSignInRecords()
    this.getSystemInfo()
  },

  /**
   * 初始化用户信息
   */
  initUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      console.log('[App] 用户信息已加载', userInfo)
    } else {
      const defaultUserInfo = {
        avatarUrl: '',
        nickName: '环保达人',
        points: 1280,
        level: 3,
        joinDate: this.formatDate(new Date())
      }
      this.globalData.userInfo = defaultUserInfo
      wx.setStorageSync('userInfo', defaultUserInfo)
      console.log('[App] 已创建默认用户信息')
    }
  },

  initOrders() {
    const orders = wx.getStorageSync('orders')
    this.globalData.orders = orders || []
    console.log('[App] 订单数据已加载', this.globalData.orders.length, '条')
  },

  addOrder(order) {
    this.globalData.orders.unshift(order)
    wx.setStorageSync('orders', this.globalData.orders)
    console.log('[App] 新增订单', order.goodsName)
  },

  getOrders() {
    return this.globalData.orders || []
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
   * 获取统计数据
   * @returns {Object} 统计数据对象
   */
  getStatistics() {
    const classifyRecords = this.getClassifyRecords()
    const pointsRecords = this.getPointsRecords()
    const signInRecords = this.getSignInRecords()

    const classifyCount = classifyRecords.length

    const totalEarnedPoints = pointsRecords
      .filter(item => item.type === 'earn')
      .reduce((sum, item) => sum + item.points, 0)

    const continuousDays = this.calculateContinuousDays(signInRecords)

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
   * 更新用户积分并同时添加积分明细记录
   * @param {number} points 积分变化值（正数增加，负数减少）
   * @param {Object} recordInfo 积分记录信息 { title, desc, emoji, category }
   */
  updateUserPoints(points, recordInfo = null) {
    const userInfo = this.globalData.userInfo
    userInfo.points = Math.max(0, userInfo.points + points)
    this.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
    console.log('[App] 用户积分已更新', userInfo.points)

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

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    orders: [],
    pointsRecords: [],
    classifyRecords: [],
    quizRecords: [],
    signInRecords: [],
    systemInfo: null,
    statusBarHeight: 0,
    screenHeight: 0,
    screenWidth: 0
  }
})
