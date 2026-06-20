const { generateId, formatDate, getStorage, setStorage } = require('./util')
const { USER_LEVELS, getUserLevel } = require('./constants')

const ACTIVITY_STORAGE_KEY = 'activitySystem'
const ACTIVITY_REPORT_KEY = 'activityReports'
const ACTIVITY_PARTICIPATION_KEY = 'activityParticipation'

const ACTIVITY_TYPES = {
  DOUBLE_POINTS_NEW_USER: 'double_points_new_user',
  FLASH_SALE: 'flash_sale',
  LEVEL_DISCOUNT: 'level_discount',
  SIGNIN_DOUBLE_WEEK: 'signin_double_week',
  GAME_DOUBLE_WEEK: 'game_double_week',
  QUIZ_DOUBLE: 'quiz_double',
  CLASSIFY_DOUBLE: 'classify_double',
  INVITE_DOUBLE: 'invite_double'
}

const ACTIVITY_TYPE_META = {
  [ACTIVITY_TYPES.DOUBLE_POINTS_NEW_USER]: {
    id: ACTIVITY_TYPES.DOUBLE_POINTS_NEW_USER,
    name: '新人双倍积分',
    category: 'points_double',
    description: '新用户注册首周享受双倍积分',
    defaultPointsMultiplier: 2,
    affectedCategories: ['signin', 'quiz', 'classify', 'daily']
  },
  [ACTIVITY_TYPES.FLASH_SALE]: {
    id: ACTIVITY_TYPES.FLASH_SALE,
    name: '限时秒杀',
    category: 'flash_sale',
    description: '每日定时开抢，限量商品超值兑换'
  },
  [ACTIVITY_TYPES.LEVEL_DISCOUNT]: {
    id: ACTIVITY_TYPES.LEVEL_DISCOUNT,
    name: '等级折扣',
    category: 'discount',
    description: '根据用户等级享受商品兑换折扣'
  },
  [ACTIVITY_TYPES.SIGNIN_DOUBLE_WEEK]: {
    id: ACTIVITY_TYPES.SIGNIN_DOUBLE_WEEK,
    name: '签到翻倍周',
    category: 'points_double',
    description: '签到积分翻倍活动周',
    defaultPointsMultiplier: 2,
    affectedCategories: ['signin']
  },
  [ACTIVITY_TYPES.GAME_DOUBLE_WEEK]: {
    id: ACTIVITY_TYPES.GAME_DOUBLE_WEEK,
    name: '游戏积分翻倍周',
    category: 'points_double',
    description: '游戏积分翻倍活动周',
    defaultPointsMultiplier: 2,
    affectedCategories: ['game']
  },
  [ACTIVITY_TYPES.QUIZ_DOUBLE]: {
    id: ACTIVITY_TYPES.QUIZ_DOUBLE,
    name: '答题双倍',
    category: 'points_double',
    description: '知识问答积分翻倍',
    defaultPointsMultiplier: 2,
    affectedCategories: ['quiz', 'daily', 'chapter', 'difficulty', 'timed', 'boss', 'wrong']
  },
  [ACTIVITY_TYPES.CLASSIFY_DOUBLE]: {
    id: ACTIVITY_TYPES.CLASSIFY_DOUBLE,
    name: '分类双倍',
    category: 'points_double',
    description: '垃圾分类积分翻倍',
    defaultPointsMultiplier: 2,
    affectedCategories: ['classify', 'drop_point_checkin']
  },
  [ACTIVITY_TYPES.INVITE_DOUBLE]: {
    id: ACTIVITY_TYPES.INVITE_DOUBLE,
    name: '邀请双倍',
    category: 'points_double',
    description: '邀请好友积分翻倍',
    defaultPointsMultiplier: 2,
    affectedCategories: ['invite']
  }
}

const LEVEL_DISCOUNT_MAP = {
  1: 1.0,
  2: 0.95,
  3: 0.9,
  4: 0.85,
  5: 0.8
}

const LEVEL_DISCOUNT_TEXT = {
  1: '无折扣',
  2: '9.5折',
  3: '9折',
  4: '8.5折',
  5: '8折'
}

const ELIGIBILITY_TYPES = {
  NEW_USER_7_DAYS: 'new_user_7_days',
  LEVEL_GTE_3: 'level_gte_3',
  LEVEL_GTE_2: 'level_gte_2',
  LEVEL_GTE_4: 'level_gte_4',
  ALL_USERS: 'all_users',
  MIN_POINTS: 'min_points',
  SIGNED_IN_DAYS: 'signed_in_days'
}

const ELIGIBILITY_META = {
  [ELIGIBILITY_TYPES.NEW_USER_7_DAYS]: {
    id: ELIGIBILITY_TYPES.NEW_USER_7_DAYS,
    name: '新用户专享',
    description: '注册7天内的新用户',
    checkText: '新用户注册7天内',
    failText: '该活动仅限新用户注册7天内参与'
  },
  [ELIGIBILITY_TYPES.LEVEL_GTE_3]: {
    id: ELIGIBILITY_TYPES.LEVEL_GTE_3,
    name: 'LV.3及以上',
    description: '用户等级达到LV.3环保达人',
    checkText: '等级≥LV.3',
    failText: '该活动要求等级≥LV.3（环保达人）'
  },
  [ELIGIBILITY_TYPES.LEVEL_GTE_2]: {
    id: ELIGIBILITY_TYPES.LEVEL_GTE_2,
    name: 'LV.2及以上',
    description: '用户等级达到LV.2环保学徒',
    checkText: '等级≥LV.2',
    failText: '该活动要求等级≥LV.2（环保学徒）'
  },
  [ELIGIBILITY_TYPES.LEVEL_GTE_4]: {
    id: ELIGIBILITY_TYPES.LEVEL_GTE_4,
    name: 'LV.4及以上',
    description: '用户等级达到LV.4环保专家',
    checkText: '等级≥LV.4',
    failText: '该活动要求等级≥LV.4（环保专家）'
  },
  [ELIGIBILITY_TYPES.ALL_USERS]: {
    id: ELIGIBILITY_TYPES.ALL_USERS,
    name: '全体用户',
    description: '所有注册用户均可参与',
    checkText: '无限制',
    failText: ''
  },
  [ELIGIBILITY_TYPES.MIN_POINTS]: {
    id: ELIGIBILITY_TYPES.MIN_POINTS,
    name: '积分门槛',
    description: '达到指定积分可参与',
    checkText: '积分达标',
    failText: '积分未达到活动要求门槛'
  },
  [ELIGIBILITY_TYPES.SIGNED_IN_DAYS]: {
    id: ELIGIBILITY_TYPES.SIGNED_IN_DAYS,
    name: '连续签到',
    description: '连续签到达到指定天数',
    checkText: '签到天数达标',
    failText: '连续签到天数不足'
  }
}

const DEFAULT_ACTIVITIES = () => {
  const now = new Date()
  const today = formatDate(now, 'YYYY-MM-DD')
  const nextWeek = formatDate(new Date(now.getTime() + 7 * 86400000), 'YYYY-MM-DD')
  const lastWeek = formatDate(new Date(now.getTime() - 7 * 86400000), 'YYYY-MM-DD')

  return [
    {
      id: 'act_double_new',
      type: ACTIVITY_TYPES.DOUBLE_POINTS_NEW_USER,
      title: '新人专享 双倍积分',
      subtitle: '新用户首周签到答题双倍积分',
      bannerImage: '/images/banner/exchange1.jpg',
      bgColor: 'linear-gradient(135deg, #667eea, #764ba2)',
      description: '新用户注册首周内，完成每日签到、知识问答、垃圾分类等任务可获得双倍积分奖励！',
      rules: [
        '活动仅限新用户注册后7天内参与',
        '每日签到、知识问答、垃圾分类均享受双倍积分',
        '活动解释权归垃圾分类助手所有'
      ],
      eligibility: [ELIGIBILITY_TYPES.NEW_USER_7_DAYS],
      startTime: lastWeek,
      endTime: '长期有效',
      pointsMultiplier: 2,
      status: 'active',
      sortOrder: 1,
      featured: true
    },
    {
      id: 'act_flash_daily',
      type: ACTIVITY_TYPES.FLASH_SALE,
      title: '限时秒杀 低至5折',
      subtitle: '每日10点、20点开抢，限量商品超值兑换',
      bannerImage: '/images/banner/exchange2.jpg',
      bgColor: 'linear-gradient(135deg, #f093fb, #f5576c)',
      description: '精选热门商品限时秒杀，最低5折兑换！每天10点、20点准时开抢，数量有限，先到先得！',
      rules: [
        '秒杀时间：每日 10:00-10:30、20:00-20:30',
        '每款商品每人限兑1件',
        '秒杀商品数量有限，兑完即止',
        '秒杀订单不支持退换，请谨慎兑换'
      ],
      eligibility: [ELIGIBILITY_TYPES.ALL_USERS],
      flashSchedule: [
        { hour: 10, minute: 0, durationMin: 30 },
        { hour: 20, minute: 0, durationMin: 30 }
      ],
      flashGoodsIds: [1, 5, 4],
      flashGoodsOverride: {
        1: { salePoints: 50, limitPerUser: 1 },
        5: { salePoints: 40, limitPerUser: 1 },
        4: { salePoints: 75, limitPerUser: 1 }
      },
      reminderMinutesBefore: 5,
      status: 'active',
      sortOrder: 2,
      featured: true
    },
    {
      id: 'act_level_discount',
      type: ACTIVITY_TYPES.LEVEL_DISCOUNT,
      title: '环保达人 专属福利',
      subtitle: '等级越高，折扣越大，最高享8折优惠',
      bannerImage: '/images/banner/exchange3.jpg',
      bgColor: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      description: '环保达人专属福利来袭！根据用户等级享受不同折扣优惠，等级越高折扣越大，最高可享8折！',
      rules: [
        'LV.2 环保学徒：9.5折优惠',
        'LV.3 环保达人：9折优惠',
        'LV.4 环保专家：8.5折优惠',
        'LV.5 环保大师：8折优惠',
        '折扣商品不与其他优惠叠加',
        '活动解释权归垃圾分类助手所有'
      ],
      eligibility: [ELIGIBILITY_TYPES.LEVEL_GTE_2],
      discountGoodsIds: [3, 6, 2],
      status: 'active',
      sortOrder: 3,
      featured: true
    },
    {
      id: 'act_signin_double_week',
      type: ACTIVITY_TYPES.SIGNIN_DOUBLE_WEEK,
      title: '签到翻倍周',
      subtitle: '本周签到积分翻倍，最高连续7天额外奖励',
      bannerImage: '',
      bgColor: 'linear-gradient(135deg, #fa709a, #fee140)',
      description: '签到翻倍周来啦！活动期间每日签到积分翻倍，连续签到更有额外奖励哦~',
      rules: [
        '活动期间签到积分翻倍',
        '连续签到7天额外获得100积分',
        '活动时间为指定一周内',
        '活动解释权归垃圾分类助手所有'
      ],
      eligibility: [ELIGIBILITY_TYPES.ALL_USERS],
      startTime: today,
      endTime: nextWeek,
      pointsMultiplier: 2,
      status: 'active',
      sortOrder: 4,
      featured: false
    },
    {
      id: 'act_game_double_week',
      type: ACTIVITY_TYPES.GAME_DOUBLE_WEEK,
      title: '游戏积分翻倍周',
      subtitle: '玩小游戏赚双倍积分，欢乐不停歇',
      bannerImage: '',
      bgColor: 'linear-gradient(135deg, #a8edea, #fed6e3)',
      description: '游戏积分翻倍周开启！参与垃圾分类小游戏获得双倍积分，边玩边学，乐趣多多~',
      rules: [
        '活动期间游戏积分翻倍',
        '每日游戏积分上限同步翻倍',
        '活动时间为指定一周内',
        '活动解释权归垃圾分类助手所有'
      ],
      eligibility: [ELIGIBILITY_TYPES.LEVEL_GTE_3],
      startTime: today,
      endTime: nextWeek,
      pointsMultiplier: 2,
      status: 'active',
      sortOrder: 5,
      featured: false
    }
  ]
}

class ActivityManager {
  constructor() {
    this.activities = []
    this.participationRecords = []
    this.reports = []
    this.init()
  }

  init() {
    const stored = getStorage(ACTIVITY_STORAGE_KEY)
    if (stored && Array.isArray(stored) && stored.length > 0) {
      this.activities = stored
    } else {
      this.activities = DEFAULT_ACTIVITIES()
      this.saveActivities()
    }

    const participation = getStorage(ACTIVITY_PARTICIPATION_KEY)
    this.participationRecords = participation || []

    const reports = getStorage(ACTIVITY_REPORT_KEY)
    this.reports = reports || []

    console.log('[ActivityManager] 初始化完成，活动数量:', this.activities.length)
  }

  saveActivities() {
    setStorage(ACTIVITY_STORAGE_KEY, this.activities)
  }

  saveParticipation() {
    setStorage(ACTIVITY_PARTICIPATION_KEY, this.participationRecords)
  }

  saveReports() {
    setStorage(ACTIVITY_REPORT_KEY, this.reports)
  }

  getAllActivities(includeExpired = false) {
    let activities = [...this.activities].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    if (!includeExpired) {
      activities = activities.filter(a => a.status === 'active')
    }
    return activities
  }

  getFeaturedActivities() {
    return this.getAllActivities().filter(a => a.featured)
  }

  getActivityById(activityId) {
    return this.activities.find(a => a.id === activityId)
  }

  getActivitiesByType(type) {
    return this.getAllActivities().filter(a => a.type === type)
  }

  addActivity(activity) {
    const newActivity = {
      id: activity.id || 'act_' + generateId(),
      status: 'active',
      sortOrder: this.activities.length + 1,
      createdAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      ...activity
    }
    this.activities.push(newActivity)
    this.saveActivities()
    console.log('[ActivityManager] 新增活动:', newActivity.title)
    return newActivity
  }

  updateActivity(activityId, updates) {
    const index = this.activities.findIndex(a => a.id === activityId)
    if (index === -1) return false
    this.activities[index] = { ...this.activities[index], ...updates }
    this.saveActivities()
    return true
  }

  removeActivity(activityId) {
    const index = this.activities.findIndex(a => a.id === activityId)
    if (index === -1) return false
    this.activities.splice(index, 1)
    this.saveActivities()
    return true
  }

  checkEligibility(activity, userContext = {}) {
    const { userInfo = null, joinDate = null, streakDays = 0 } = userContext
    const activityEligibility = activity.eligibility || [ELIGIBILITY_TYPES.ALL_USERS]
    const results = []

    for (const eligibilityType of activityEligibility) {
      const meta = ELIGIBILITY_META[eligibilityType] || ELIGIBILITY_META[ELIGIBILITY_TYPES.ALL_USERS]
      let passed = true

      switch (eligibilityType) {
        case ELIGIBILITY_TYPES.NEW_USER_7_DAYS: {
          if (joinDate) {
            const join = new Date(joinDate).getTime()
            const sevenDaysAgo = Date.now() - 7 * 86400000
            passed = join >= sevenDaysAgo
          } else {
            passed = false
          }
          break
        }
        case ELIGIBILITY_TYPES.LEVEL_GTE_3: {
          const level = userInfo ? this._extractLevel(userInfo) : 1
          passed = level >= 3
          break
        }
        case ELIGIBILITY_TYPES.LEVEL_GTE_2: {
          const level = userInfo ? this._extractLevel(userInfo) : 1
          passed = level >= 2
          break
        }
        case ELIGIBILITY_TYPES.LEVEL_GTE_4: {
          const level = userInfo ? this._extractLevel(userInfo) : 1
          passed = level >= 4
          break
        }
        case ELIGIBILITY_TYPES.MIN_POINTS: {
          const minPoints = activity.minPoints || 0
          const points = userInfo ? (userInfo.points || 0) : 0
          passed = points >= minPoints
          break
        }
        case ELIGIBILITY_TYPES.SIGNED_IN_DAYS: {
          const minDays = activity.minSignedInDays || 7
          passed = streakDays >= minDays
          break
        }
        case ELIGIBILITY_TYPES.ALL_USERS:
        default:
          passed = true
          break
      }

      results.push({
        type: eligibilityType,
        meta,
        passed,
        failText: passed ? '' : meta.failText
      })
    }

    const allPassed = results.every(r => r.passed)
    const failedItems = results.filter(r => !r.passed)

    return {
      eligible: allPassed,
      details: results,
      failedItems,
      failSummary: failedItems.map(f => f.failText).filter(Boolean).join('；')
    }
  }

  _extractLevel(userInfo) {
    if (typeof userInfo.level === 'number') return userInfo.level
    if (typeof userInfo.level === 'string') {
      const match = userInfo.level.match(/LV\.?\s*(\d+)/i)
      if (match) return parseInt(match[1], 10)
    }
    const levelInfo = getUserLevel(userInfo.points || 0)
    return levelInfo.level
  }

  isActivityInDateRange(activity) {
    if (!activity.startTime || !activity.endTime || activity.endTime === '长期有效') {
      return true
    }
    const now = Date.now()
    const start = new Date(activity.startTime).getTime()
    const end = new Date(activity.endTime + ' 23:59:59').getTime()
    return now >= start && now <= end
  }

  getActivePointsDoubles(userContext = {}) {
    const activeActivities = this.getAllActivities()
    const pointDoubles = []

    for (const activity of activeActivities) {
      const typeMeta = ACTIVITY_TYPE_META[activity.type]
      if (!typeMeta || typeMeta.category !== 'points_double') continue
      if (!this.isActivityInDateRange(activity)) continue

      const eligibility = this.checkEligibility(activity, userContext)
      if (!eligibility.eligible) continue

      const multiplier = activity.pointsMultiplier || typeMeta.defaultPointsMultiplier || 2

      pointDoubles.push({
        activityId: activity.id,
        activityTitle: activity.title,
        activityType: activity.type,
        multiplier,
        affectedCategories: typeMeta.affectedCategories || [],
        startTime: activity.startTime,
        endTime: activity.endTime
      })
    }

    return pointDoubles
  }

  getPointsMultiplierForCategory(category, userContext = {}) {
    const doubles = this.getActivePointsDoubles(userContext)
    let multiplier = 1
    const appliedActivities = []

    for (const d of doubles) {
      if (d.affectedCategories.includes(category) || d.affectedCategories.includes('*')) {
        if (d.multiplier > multiplier) {
          multiplier = d.multiplier
        }
        appliedActivities.push({
          activityId: d.activityId,
          activityTitle: d.activityTitle,
          multiplier: d.multiplier
        })
      }
    }

    return {
      multiplier,
      isDoubled: multiplier > 1,
      appliedActivities
    }
  }

  getLevelDiscount(userInfo = null) {
    const level = userInfo ? this._extractLevel(userInfo) : 1
    const discountRate = LEVEL_DISCOUNT_MAP[level] || 1.0
    const discountText = LEVEL_DISCOUNT_TEXT[level] || '无折扣'
    return {
      level,
      discountRate,
      discountText,
      hasDiscount: discountRate < 1.0
    }
  }

  getDiscountForGoods(goods, userInfo = null, activity = null) {
    if (!activity || activity.type !== ACTIVITY_TYPES.LEVEL_DISCOUNT) {
      return { originalPoints: goods.points, finalPoints: goods.points, discount: null }
    }

    const eligibility = this.checkEligibility(activity, { userInfo })
    if (!eligibility.eligible) {
      return { originalPoints: goods.points, finalPoints: goods.points, discount: null, reason: eligibility.failSummary }
    }

    const { discountRate, discountText } = this.getLevelDiscount(userInfo)
    const finalPoints = Math.round(goods.points * discountRate)

    return {
      originalPoints: goods.points,
      finalPoints,
      discount: {
        rate: discountRate,
        text: discountText,
        saved: goods.points - finalPoints
      },
      eligible: true
    }
  }

  recordParticipation(activityId, action, data = {}) {
    const record = {
      id: generateId(),
      activityId,
      action,
      userId: data.userId || 'anonymous',
      points: data.points || 0,
      goodsId: data.goodsId || null,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      timestamp: Date.now(),
      extra: data.extra || {}
    }
    this.participationRecords.push(record)
    this.saveParticipation()
    return record
  }

  getParticipationStats(activityId) {
    const records = this.participationRecords.filter(r => r.activityId === activityId)
    const uniqueUsers = new Set(records.map(r => r.userId)).size
    const totalPoints = records.reduce((sum, r) => sum + (r.points || 0), 0)
    const goodsRedeemed = records.filter(r => r.action === 'redeem').length

    const actionBreakdown = {}
    records.forEach(r => {
      if (!actionBreakdown[r.action]) actionBreakdown[r.action] = 0
      actionBreakdown[r.action]++
    })

    return {
      activityId,
      totalParticipations: records.length,
      uniqueUsers,
      totalPointsDistributed: totalPoints,
      goodsRedeemed,
      actionBreakdown,
      records: records.slice(-50)
    }
  }

  generateActivityReport(activityId) {
    const activity = this.getActivityById(activityId)
    if (!activity) return null

    const stats = this.getParticipationStats(activityId)
    const now = formatDate(new Date(), 'YYYY-MM-DD HH:mm')

    const report = {
      id: 'report_' + generateId(),
      activityId,
      activityTitle: activity.title,
      activityType: activity.type,
      generatedAt: now,
      startDate: activity.startTime,
      endDate: activity.endTime || now,
      summary: {
        totalParticipations: stats.totalParticipations,
        uniqueUsers: stats.uniqueUsers,
        totalPointsDistributed: stats.totalPointsDistributed,
        goodsRedeemed: stats.goodsRedeemed
      },
      actionBreakdown: stats.actionBreakdown,
      highlights: this._generateHighlights(activity, stats)
    }

    this.reports.unshift(report)
    this.saveReports()
    console.log('[ActivityManager] 活动报告已生成:', report.id)
    return report
  }

  _generateHighlights(activity, stats) {
    const highlights = []
    if (stats.totalPointsDistributed > 1000) {
      highlights.push(`活动共发放 ${stats.totalPointsDistributed} 积分奖励`)
    }
    if (stats.uniqueUsers > 10) {
      highlights.push(`共有 ${stats.uniqueUsers} 位用户参与`)
    }
    if (stats.goodsRedeemed > 0) {
      highlights.push(`累计兑换商品 ${stats.goodsRedeemed} 件`)
    }
    if (highlights.length === 0) {
      highlights.push('活动圆满结束，感谢参与！')
    }
    return highlights
  }

  getReports() {
    return [...this.reports].sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))
  }

  getReportById(reportId) {
    return this.reports.find(r => r.id === reportId)
  }

  checkActivityEndAndGenerateReport() {
    const generatedReports = []
    const now = Date.now()

    for (const activity of this.activities) {
      if (activity.status !== 'active') continue
      if (!activity.endTime || activity.endTime === '长期有效') continue
      if (activity.reportGenerated) continue

      const endTime = new Date(activity.endTime + ' 23:59:59').getTime()
      if (now > endTime) {
        const report = this.generateActivityReport(activity.id)
        if (report) {
          this.updateActivity(activity.id, { reportGenerated: true, reportId: report.id })
          generatedReports.push({ activity, report })
        }
      }
    }

    return generatedReports
  }
}

const activityManager = new ActivityManager()

module.exports = {
  ACTIVITY_TYPES,
  ACTIVITY_TYPE_META,
  ELIGIBILITY_TYPES,
  ELIGIBILITY_META,
  LEVEL_DISCOUNT_MAP,
  LEVEL_DISCOUNT_TEXT,
  activityManager
}
