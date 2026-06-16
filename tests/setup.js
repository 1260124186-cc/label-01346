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

const defaultPointsRecords = [
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

const appMock = {
  globalData: {
    userInfo: {
      avatarUrl: '',
      nickName: '环保达人',
      points: 1280,
      level: 3,
      joinDate: '2026-01-01'
    },
    orders: [],
    pointsRecords: [...defaultPointsRecords],
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
  addOrder: jest.fn((order) => {
    const app = global.getApp()
    app.globalData.orders.unshift(order)
  }),
  getOrders: jest.fn(() => {
    const app = global.getApp()
    return app.globalData.orders || []
  }),
  addPointsRecord: jest.fn((record) => {
    const app = global.getApp()
    app.globalData.pointsRecords.unshift(record)
  }),
  getPointsRecords: jest.fn(() => {
    const app = global.getApp()
    return app.globalData.pointsRecords || []
  }),
  initUserInfo: jest.fn(),
  initOrders: jest.fn(),
  initPointsRecords: jest.fn(),
  getSystemInfo: jest.fn(),
  formatDate: jest.fn((date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })
}

global.getApp = jest.fn(() => appMock)

module.exports = { storage }
