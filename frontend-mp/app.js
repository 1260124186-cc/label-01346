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
    
    // 初始化用户信息
    this.initUserInfo()
    
    // 获取系统信息
    this.getSystemInfo()
  },

  /**
   * 初始化用户信息
   */
  initUserInfo() {
    // 从本地存储获取用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
      console.log('[App] 用户信息已加载', userInfo)
    } else {
      // 设置默认用户信息
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
    systemInfo: null,
    statusBarHeight: 0,
    screenHeight: 0,
    screenWidth: 0
  }
})
