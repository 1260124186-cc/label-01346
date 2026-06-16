/**
 * 垃圾分类小程序 - 入口文件
 * @description 小程序全局逻辑
 */
App({
  /**
   * 小程序启动时触发
   */
  onLaunch() {
    console.log('[App] 小程序启动')
    
    this.initUserInfo()
    this.initOrders()
    this.initPointsRecords()
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
      this.globalData.pointsRecords = [
        {
          id: 1,
          type: 'earn',
          title: '垃圾分类',
          desc: '正确分类塑料瓶',
          emoji: '♻️',
          points: 10,
          time: '今天 14:30'
        },
        {
          id: 2,
          type: 'spend',
          title: '积分兑换',
          desc: '兑换环保购物袋',
          emoji: '🛍️',
          points: 100,
          time: '今天 10:15'
        },
        {
          id: 3,
          type: 'earn',
          title: '每日签到',
          desc: '连续签到第15天',
          emoji: '📅',
          points: 20,
          time: '今天 08:00'
        },
        {
          id: 4,
          type: 'earn',
          title: '垃圾分类',
          desc: '正确分类厨余垃圾',
          emoji: '🍂',
          points: 5,
          time: '昨天 18:45'
        },
        {
          id: 5,
          type: 'spend',
          title: '积分兑换',
          desc: '兑换便携餐具套装',
          emoji: '🍴',
          points: 200,
          time: '昨天 14:20'
        },
        {
          id: 6,
          type: 'earn',
          title: '知识问答',
          desc: '答题正确5道',
          emoji: '❓',
          points: 50,
          time: '前天 20:30'
        },
        {
          id: 7,
          type: 'earn',
          title: '邀请好友',
          desc: '好友注册成功',
          emoji: '👥',
          points: 100,
          time: '3天前'
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
   * 更新用户积分
   * @param {number} points 积分变化值（正数增加，负数减少）
   */
  updateUserPoints(points) {
    const userInfo = this.globalData.userInfo
    userInfo.points = Math.max(0, userInfo.points + points)
    this.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
    console.log('[App] 用户积分已更新', userInfo.points)
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
    systemInfo: null,
    statusBarHeight: 0,
    screenHeight: 0,
    screenWidth: 0
  }
})
