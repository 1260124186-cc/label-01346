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

const defaultClassifyRecords = [
  { id: 'c1', trashName: '塑料瓶', typeId: 1, typeName: '可回收垃圾', emoji: '🧴', bgColor: 'rgba(74, 144, 217, 0.1)', points: 10, time: '2026-06-16 14:30' },
  { id: 'c2', trashName: '剩菜剩饭', typeId: 3, typeName: '厨余垃圾', emoji: '🍚', bgColor: 'rgba(91, 189, 114, 0.1)', points: 5, time: '2026-06-16 12:15' },
  { id: 'c3', trashName: '废电池', typeId: 2, typeName: '有害垃圾', emoji: '🔋', bgColor: 'rgba(232, 93, 93, 0.1)', points: 20, time: '2026-06-16 09:45' },
  { id: 'c4', trashName: '旧报纸', typeId: 1, typeName: '可回收垃圾', emoji: '📰', bgColor: 'rgba(74, 144, 217, 0.1)', points: 15, time: '2026-06-15 18:20' },
  { id: 'c5', trashName: '果皮', typeId: 3, typeName: '厨余垃圾', emoji: '🍎', bgColor: 'rgba(91, 189, 114, 0.1)', points: 5, time: '2026-06-15 15:30' },
  { id: 'c6', trashName: '卫生纸', typeId: 4, typeName: '其他垃圾', emoji: '🧻', bgColor: 'rgba(142, 142, 147, 0.1)', points: 3, time: '2026-06-15 10:00' }
]

const defaultQuizRecords = [
  { id: 'q1', quizType: 'chapter', chapterName: '综合知识', totalQuestions: 5, correctCount: 5, wrongCount: 0, accuracy: 100, points: 50, time: '2026-06-14 20:30' }
]

const defaultSignInRecords = (() => {
  const records = []
  const now = new Date('2026-06-16T12:00:00')
  const yesterday = new Date(now.getTime() - 86400000)
  for (let i = 0; i < 15; i++) {
    const date = new Date(yesterday.getTime() - 86400000 * i)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    records.push(`${y}-${m}-${d}`)
  }
  records.reverse()
  return records
})()

const defaultPointsRecords = [
  {
    id: 'p1',
    type: 'earn',
    category: 'classify',
    title: '垃圾分类',
    desc: '正确分类塑料瓶',
    emoji: '♻️',
    points: 10,
    time: '2026-06-16 14:30'
  },
  {
    id: 'p2',
    type: 'spend',
    category: 'exchange',
    title: '积分兑换',
    desc: '兑换环保购物袋',
    emoji: '🛍️',
    points: 100,
    time: '2026-06-16 10:15'
  },
  {
    id: 'p3',
    type: 'earn',
    category: 'signin',
    title: '每日签到',
    desc: '签到奖励',
    emoji: '📅',
    points: 20,
    time: '2026-06-15 08:00'
  },
  {
    id: 'p4',
    type: 'earn',
    category: 'classify',
    title: '垃圾分类',
    desc: '正确分类厨余垃圾',
    emoji: '🍂',
    points: 5,
    time: '2026-06-15 18:45'
  },
  {
    id: 'p5',
    type: 'spend',
    category: 'exchange',
    title: '积分兑换',
    desc: '兑换便携餐具套装',
    emoji: '🍴',
    points: 200,
    time: '2026-06-15 14:20'
  },
  {
    id: 'p6',
    type: 'earn',
    category: 'quiz',
    title: '知识问答',
    desc: '答题正确5道',
    emoji: '❓',
    points: 50,
    time: '2026-06-14 20:30'
  },
  {
    id: 'p7',
    type: 'earn',
    category: 'invite',
    title: '邀请好友',
    desc: '好友注册成功',
    emoji: '👥',
    points: 100,
    time: '2026-06-13'
  }
]

const { TRASH_TYPES } = require('../frontend-mp/utils/constants')

const defaultDailyQuizRecords = [
  '2026-06-02', '2026-06-03', '2026-06-04', '2026-06-05', '2026-06-06',
  '2026-06-07', '2026-06-08', '2026-06-09', '2026-06-10', '2026-06-11'
]

const { QUIZ_POINTS_CONFIG } = require('../frontend-mp/utils/constants')

const createAppMock = () => {
  const mockToday = '2026-06-16'
  const mockDailyPoints = {
    date: mockToday,
    pointsByMode: {}
  }
  Object.keys(QUIZ_POINTS_CONFIG.dailyModeLimits).forEach(mode => {
    mockDailyPoints.pointsByMode[mode] = 0
  })

  return {
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
    classifyRecords: [...defaultClassifyRecords],
    quizRecords: [...defaultQuizRecords],
    signInRecords: [...defaultSignInRecords],
    dailyQuizRecords: [...defaultDailyQuizRecords],
    wrongQuestions: [],
    dailyPoints: mockDailyPoints,
    masteredQuestions: [],
    dailyCompletionBonus: { date: mockToday, claimed: false },
    systemInfo: null,
    statusBarHeight: 44,
    screenHeight: 812,
    screenWidth: 375
  },
  updateUserPoints: jest.fn(function(points, recordInfo = null) {
    const app = global.getApp()
    app.globalData.userInfo.points = Math.max(0, app.globalData.userInfo.points + points)
    if (recordInfo) {
      const record = {
        id: 'mock-' + Date.now(),
        type: points >= 0 ? 'earn' : 'spend',
        category: recordInfo.category || 'other',
        title: recordInfo.title || '积分变动',
        desc: recordInfo.desc || '',
        emoji: recordInfo.emoji || '💰',
        points: Math.abs(points),
        time: '2026-06-16 12:00'
      }
      app.addPointsRecord(record)
    }
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
  addClassifyRecord: jest.fn((record) => {
    const app = global.getApp()
    app.globalData.classifyRecords.unshift(record)
  }),
  getClassifyRecords: jest.fn(() => {
    const app = global.getApp()
    return app.globalData.classifyRecords || []
  }),
  addQuizRecord: jest.fn((record) => {
    const app = global.getApp()
    app.globalData.quizRecords.unshift(record)
  }),
  getQuizRecords: jest.fn(() => {
    const app = global.getApp()
    return app.globalData.quizRecords || []
  }),
  addSignInRecord: jest.fn((dateStr) => {
    const app = global.getApp()
    if (!app.globalData.signInRecords.includes(dateStr)) {
      app.globalData.signInRecords.push(dateStr)
    }
  }),
  getSignInRecords: jest.fn(() => {
    const app = global.getApp()
    return app.globalData.signInRecords || []
  }),
  addDailyQuizRecord: jest.fn((dateStr) => {
    const app = global.getApp()
    if (!app.globalData.dailyQuizRecords.includes(dateStr)) {
      app.globalData.dailyQuizRecords.push(dateStr)
    }
  }),
  getDailyQuizRecords: jest.fn(() => {
    const app = global.getApp()
    return app.globalData.dailyQuizRecords || []
  }),
  isTodayDailyQuizDone: jest.fn(() => {
    const app = global.getApp()
    const today = '2026-06-16'
    return (app.globalData.dailyQuizRecords || []).includes(today)
  }),
  isTodaySignedIn: jest.fn(() => {
    const app = global.getApp()
    const today = '2026-06-16'
    return (app.globalData.signInRecords || []).includes(today)
  }),
  getStreakDays: jest.fn(() => {
    const app = global.getApp()
    const signInRecords = app.globalData.signInRecords || []
    const dailyQuizRecords = app.globalData.dailyQuizRecords || []
    const mergedRecords = Array.from(new Set([...signInRecords, ...dailyQuizRecords]))
    if (!mergedRecords || mergedRecords.length === 0) return 0
    const sorted = [...mergedRecords].sort((a, b) => new Date(b) - new Date(a))
    const today = '2026-06-16'
    const yesterday = '2026-06-15'
    if (sorted[0] !== today && sorted[0] !== yesterday) return 0
    let days = 1
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1])
      const curr = new Date(sorted[i])
      const diff = Math.round((prev - curr) / 86400000)
      if (diff === 1) days++
      else break
    }
    return days
  }),
  doSignIn: jest.fn(() => {
    const app = global.getApp()
    const today = '2026-06-16'
    if (app.isTodaySignedIn()) {
      return { success: false, alreadySigned: true, points: 0, bonus: 0, streakDays: app.getStreakDays() }
    }
    app.addSignInRecord(today)
    const basePoints = 5
    app.updateUserPoints(basePoints, { category: 'signin', title: '每日签到', desc: '每日签到奖励', emoji: '📅' })
    const streakDays = app.getStreakDays()
    let bonus = 0
    if (streakDays > 0 && streakDays % 7 === 0) {
      bonus = 50
      app.updateUserPoints(bonus, { category: 'signin', title: '连续签到奖励', desc: `连续签到${streakDays}天`, emoji: '🎁' })
    }
    return { success: true, alreadySigned: false, points: basePoints, bonus, streakDays }
  }),
  getStatistics: jest.fn(() => {
    const app = global.getApp()
    const classifyCount = (app.globalData.classifyRecords || []).length
    const totalEarnedPoints = (app.globalData.pointsRecords || [])
      .filter(r => r.type === 'earn')
      .reduce((sum, r) => sum + r.points, 0)

    const signInRecords = app.globalData.signInRecords || []
    const dailyQuizRecords = app.globalData.dailyQuizRecords || []
    const mergedRecords = Array.from(new Set([...signInRecords, ...dailyQuizRecords]))
    const sortedDates = [...mergedRecords].sort((a, b) => new Date(b) - new Date(a))
    let continuousDays = 0
    if (sortedDates.length > 0) {
      const today = '2026-06-16'
      const yesterday = '2026-06-15'
      const last = sortedDates[0]
      if (last === today || last === yesterday) {
        continuousDays = 1
        for (let i = 1; i < sortedDates.length; i++) {
          const prev = new Date(sortedDates[i - 1])
          const curr = new Date(sortedDates[i])
          const diff = Math.round((prev - curr) / 86400000)
          if (diff === 1) continuousDays++
          else break
        }
      }
    }

    return { classifyCount, totalEarnedPoints, continuousDays }
  }),
  calculateContinuousDays: jest.fn((records) => {
    if (!records || records.length === 0) return 0
    const sorted = [...records].sort((a, b) => new Date(b) - new Date(a))
    let days = 1
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1])
      const curr = new Date(sorted[i])
      const diff = Math.round((prev - curr) / 86400000)
      if (diff === 1) days++
      else break
    }
    return days
  }),
  getCategoryStats: jest.fn(() => {
    const app = global.getApp()
    const countMap = {}
    ;(app.globalData.classifyRecords || []).forEach(r => {
      countMap[r.typeId] = (countMap[r.typeId] || 0) + 1
    })
    return TRASH_TYPES.map(t => ({
      id: t.id,
      name: t.name.replace('垃圾', ''),
      emoji: t.emoji,
      color: t.color,
      count: countMap[t.id] || 0
    }))
  }),
  addWrongQuestion: jest.fn((question) => {
    const app = global.getApp()
    let wrongQuestions = app.globalData.wrongQuestions || []
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
    app.globalData.wrongQuestions = wrongQuestions
    wx.setStorageSync('wrongQuestions', wrongQuestions)
  }),
  removeWrongQuestion: jest.fn((questionId) => {
    const app = global.getApp()
    let wrongQuestions = app.globalData.wrongQuestions || []
    wrongQuestions = wrongQuestions.filter(q => q.id !== questionId)
    app.globalData.wrongQuestions = wrongQuestions
    wx.setStorageSync('wrongQuestions', wrongQuestions)
  }),
  getWrongQuestions: jest.fn(() => {
    const app = global.getApp()
    return app.globalData.wrongQuestions || []
  }),
  clearWrongQuestions: jest.fn(() => {
    const app = global.getApp()
    app.globalData.wrongQuestions = []
    wx.setStorageSync('wrongQuestions', [])
  }),
  initDailyPoints: jest.fn(),
  getDailyPointsByMode: jest.fn((mode) => {
    const app = global.getApp()
    const dailyPoints = app.globalData.dailyPoints
    if (!dailyPoints) return 0
    return dailyPoints.pointsByMode[mode] || 0
  }),
  addDailyPoints: jest.fn((mode, points) => {
    const app = global.getApp()
    const dailyPoints = app.globalData.dailyPoints
    if (!dailyPoints) return 0
    const currentPoints = dailyPoints.pointsByMode[mode] || 0
    const maxPoints = QUIZ_POINTS_CONFIG.dailyModeLimits[mode] || Infinity
    const actualPoints = Math.min(points, Math.max(0, maxPoints - currentPoints))
    if (actualPoints > 0) {
      dailyPoints.pointsByMode[mode] = currentPoints + actualPoints
      app.globalData.dailyPoints = dailyPoints
    }
    return actualPoints
  }),
  isDailyLimitReached: jest.fn((mode) => {
    const app = global.getApp()
    const dailyPoints = app.globalData.dailyPoints
    if (!dailyPoints) return false
    const currentPoints = dailyPoints.pointsByMode[mode] || 0
    const maxPoints = QUIZ_POINTS_CONFIG.dailyModeLimits[mode] || Infinity
    return currentPoints >= maxPoints
  }),
  getRemainingDailyPoints: jest.fn((mode) => {
    const app = global.getApp()
    const dailyPoints = app.globalData.dailyPoints
    if (!dailyPoints) return 0
    const currentPoints = dailyPoints.pointsByMode[mode] || 0
    const maxPoints = QUIZ_POINTS_CONFIG.dailyModeLimits[mode] || Infinity
    return Math.max(0, maxPoints - currentPoints)
  }),
  initMasteredQuestions: jest.fn(),
  isQuestionMastered: jest.fn((questionId) => {
    const app = global.getApp()
    const mastered = app.globalData.masteredQuestions || []
    return mastered.includes(questionId)
  }),
  markQuestionMastered: jest.fn((questionId) => {
    const app = global.getApp()
    let mastered = app.globalData.masteredQuestions || []
    if (!mastered.includes(questionId)) {
      mastered.push(questionId)
      app.globalData.masteredQuestions = mastered
    }
  }),
  getMasteredQuestions: jest.fn(() => {
    const app = global.getApp()
    return app.globalData.masteredQuestions || []
  }),
  initDailyCompletionBonus: jest.fn(),
  isDailyCompletionBonusClaimed: jest.fn(() => {
    const app = global.getApp()
    const bonus = app.globalData.dailyCompletionBonus
    return bonus ? bonus.claimed : false
  }),
  markDailyCompletionBonusClaimed: jest.fn(() => {
    const app = global.getApp()
    if (app.globalData.dailyCompletionBonus) {
      app.globalData.dailyCompletionBonus.claimed = true
    }
  }),
  initUserInfo: jest.fn(),
  initOrders: jest.fn(),
  initPointsRecords: jest.fn(),
  initClassifyRecords: jest.fn(),
  initQuizRecords: jest.fn(),
  initSignInRecords: jest.fn(),
  getSystemInfo: jest.fn(),
  formatDate: jest.fn((date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })
  }
}

const appMock = createAppMock()

global.getApp = jest.fn(() => appMock)

module.exports = { storage, defaultClassifyRecords, defaultQuizRecords, defaultSignInRecords, defaultPointsRecords, createAppMock }
