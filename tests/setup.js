const storage = {}

global.wx = {
  getStorageSync: jest.fn((key) => {
    return storage[key] !== undefined ? storage[key] : ''
  }),
  setStorageSync: jest.fn((key, value) => {
    storage[key] = value
  }),
  removeStorageSync: jest.fn((key) => {
    delete storage[key]
  }),
  clearStorageSync: jest.fn(() => {
    Object.keys(storage).forEach(key => delete storage[key])
  }),
  showToast: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showModal: jest.fn((options) => {
    if (options.success) {
      options.success({ confirm: true, cancel: false })
    }
  }),
  showActionSheet: jest.fn((options) => {
    if (options.success) {
      options.success({ tapIndex: 0 })
    }
  }),
  chooseImage: jest.fn((options) => {
    if (options.success) {
      options.success({ tempFilePaths: ['/tmp/test-avatar.jpg'] })
    }
  }),
  navigateTo: jest.fn(),
  navigateBack: jest.fn(),
  switchTab: jest.fn(),
  setNavigationBarTitle: jest.fn(),
  setNavigationBarColor: jest.fn(),
  stopPullDownRefresh: jest.fn(),
  getSystemInfoSync: jest.fn(() => ({
    statusBarHeight: 44,
    screenHeight: 812,
    screenWidth: 375,
    platform: 'devtools'
  }))
}

global.getApp = jest.fn(() => ({
  globalData: {
    userInfo: {
      avatarUrl: '',
      nickName: '环保达人',
      points: 1280,
      level: 3,
      joinDate: '2026-01-01'
    },
    systemInfo: null,
    statusBarHeight: 44,
    screenHeight: 812,
    screenWidth: 375
  },
  updateUserPoints: jest.fn((points) => {
    const app = global.getApp()
    app.globalData.userInfo.points = Math.max(0, app.globalData.userInfo.points + points)
  }),
  updateUserInfo: jest.fn((info) => {
    const app = global.getApp()
    app.globalData.userInfo = { ...app.globalData.userInfo, ...info }
  }),
  initUserInfo: jest.fn(),
  getSystemInfo: jest.fn(),
  formatDate: jest.fn((date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })
}))

module.exports = { storage }
