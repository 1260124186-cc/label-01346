/**
 * 用户行为追踪模块
 * @description 记录用户行为，用于快捷入口动态排序
 */

const { getStorage, setStorage, formatDate } = require('./util')

const BEHAVIOR_STORAGE_KEY = 'userBehaviorData'
const BEHAVIOR_EXPIRE_DAYS = 30
const MIN_VISIT_WEIGHT = 1
const RECENCY_BOOST_DAYS = 7
const RECENCY_BOOST_FACTOR = 1.5

const defaultBehaviorData = {
  lastUpdate: '',
  pageVisits: {}
}

const getBehaviorData = () => {
  try {
    const data = getStorage(BEHAVIOR_STORAGE_KEY, null)
    if (data && typeof data === 'object') {
      return data
    }
  } catch (e) {
    console.error('[userBehavior] 获取行为数据失败', e)
  }
  return { ...defaultBehaviorData, pageVisits: {} }
}

const saveBehaviorData = (data) => {
  try {
    data.lastUpdate = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')
    setStorage(BEHAVIOR_STORAGE_KEY, data)
  } catch (e) {
    console.error('[userBehavior] 保存行为数据失败', e)
  }
}

const recordPageVisit = (pageKey) => {
  if (!pageKey) return

  const data = getBehaviorData()
  const today = formatDate(new Date(), 'YYYY-MM-DD')

  if (!data.pageVisits[pageKey]) {
    data.pageVisits[pageKey] = {
      totalCount: 0,
      lastVisit: '',
      dailyVisits: {}
    }
  }

  const pageData = data.pageVisits[pageKey]
  pageData.totalCount += 1
  pageData.lastVisit = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')

  if (!pageData.dailyVisits[today]) {
    pageData.dailyVisits[today] = 0
  }
  pageData.dailyVisits[today] += 1

  cleanupOldData(data)

  saveBehaviorData(data)
  console.log('[userBehavior] 记录页面访问', pageKey, '总次数:', pageData.totalCount)
}

const cleanupOldData = (data) => {
  const now = Date.now()
  const expireTime = BEHAVIOR_EXPIRE_DAYS * 24 * 60 * 60 * 1000

  Object.keys(data.pageVisits).forEach(pageKey => {
    const pageData = data.pageVisits[pageKey]
    if (pageData.dailyVisits) {
      const validVisits = {}
      Object.keys(pageData.dailyVisits).forEach(date => {
        const dateTime = new Date(date).getTime()
        if (now - dateTime <= expireTime) {
          validVisits[date] = pageData.dailyVisits[date]
        }
      })
      pageData.dailyVisits = validVisits
    }
  })
}

const calculatePageScore = (pageData) => {
  if (!pageData) return 0

  let score = 0

  const totalCount = pageData.totalCount || 0
  score += totalCount * MIN_VISIT_WEIGHT

  const lastVisit = pageData.lastVisit
  if (lastVisit) {
    const lastVisitTime = new Date(lastVisit).getTime()
    const daysSinceLastVisit = (Date.now() - lastVisitTime) / (24 * 60 * 60 * 1000)
    if (daysSinceLastVisit <= RECENCY_BOOST_DAYS) {
      const recencyFactor = 1 + (RECENCY_BOOST_FACTOR - 1) * (1 - daysSinceLastVisit / RECENCY_BOOST_DAYS)
      score *= recencyFactor
    }
  }

  const today = formatDate(new Date(), 'YYYY-MM-DD')
  const todayVisits = (pageData.dailyVisits && pageData.dailyVisits[today]) || 0
  score += todayVisits * 2

  return score
}

const getSortedQuickActions = (quickActions) => {
  const behaviorData = getBehaviorData()
  const result = quickActions.map(action => {
    const pageData = behaviorData.pageVisits[action.key]
    const score = calculatePageScore(pageData)
    return {
      ...action,
      _score: score
    }
  })

  result.sort((a, b) => b._score - a._score)

  console.log('[userBehavior] 快捷入口排序结果', result.map(r => ({ key: r.key, score: r._score })))

  return result
}

const getVisitCount = (pageKey) => {
  const data = getBehaviorData()
  const pageData = data.pageVisits[pageKey]
  return pageData ? pageData.totalCount || 0 : 0
}

const getTopPages = (limit = 5) => {
  const data = getBehaviorData()
  const pages = Object.keys(data.pageVisits).map(key => ({
    key,
    ...data.pageVisits[key],
    score: calculatePageScore(data.pageVisits[key])
  }))

  pages.sort((a, b) => b.score - a.score)

  return pages.slice(0, limit)
}

const clearBehaviorData = () => {
  setStorage(BEHAVIOR_STORAGE_KEY, { ...defaultBehaviorData, pageVisits: {} })
  console.log('[userBehavior] 行为数据已清空')
}

module.exports = {
  recordPageVisit,
  getSortedQuickActions,
  getVisitCount,
  getTopPages,
  clearBehaviorData,
  getBehaviorData
}
