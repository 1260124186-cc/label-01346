/**
 * 碳减排计算工具模块
 * @description 基于国标系数的 CO₂ 当量减排量计算与类比换算
 */

/**
 * 国标碳排放/减排系数（参考：《省级温室气体清单编制指南》等）
 * 单位均为 kgCO₂e / 单位活动
 */
const CARBON_FACTORS = {
  classifyCorrect: {
    name: '正确分类',
    unit: '次',
    factor: 0.05,
    emoji: '✅',
    desc: '每次正确分类垃圾减少的碳排放估算值'
  },
  recyclablePaper: {
    name: '回收纸张',
    unit: 'kg',
    factor: 1.5,
    emoji: '📰',
    desc: '每回收1kg纸张减少的CO₂排放'
  },
  recyclablePlastic: {
    name: '回收塑料',
    unit: 'kg',
    factor: 2.5,
    emoji: '🧴',
    desc: '每回收1kg塑料减少的CO₂排放'
  },
  recyclableGlass: {
    name: '回收玻璃',
    unit: 'kg',
    factor: 0.3,
    emoji: '🍶',
    desc: '每回收1kg玻璃减少的CO₂排放'
  },
  recyclableMetal: {
    name: '回收金属',
    unit: 'kg',
    factor: 8.0,
    emoji: '🥫',
    desc: '每回收1kg金属（铝/铁）减少的CO₂排放'
  },
  recyclableTextile: {
    name: '回收织物',
    unit: 'kg',
    factor: 3.5,
    emoji: '👕',
    desc: '每回收1kg旧衣物减少的CO₂排放'
  },
  recyclableEwaste: {
    name: '回收电子废弃物',
    unit: 'kg',
    factor: 12.0,
    emoji: '📺',
    desc: '每回收1kg电子废弃物减少的CO₂排放'
  },
  reduceSingleUseBag: {
    name: '减少塑料袋',
    unit: '个',
    factor: 0.1,
    emoji: '🛍️',
    desc: '每减少使用1个塑料袋的CO₂减排量'
  },
  reduceSingleUseBottle: {
    name: '减少塑料瓶',
    unit: '个',
    factor: 0.08,
    emoji: '🧴',
    desc: '每减少使用1个一次性塑料瓶的CO₂减排量'
  },
  reduceSingleUseCutlery: {
    name: '减少一次性餐具',
    unit: '套',
    factor: 0.15,
    emoji: '🥢',
    desc: '每减少使用1套一次性餐具的CO₂减排量'
  },
  reduceSingleUseStraw: {
    name: '减少吸管',
    unit: '根',
    factor: 0.02,
    emoji: '🥤',
    desc: '每减少使用1根塑料吸管的CO₂减排量'
  },
  reducePaperCup: {
    name: '减少纸杯',
    unit: '个',
    factor: 0.06,
    emoji: '☕',
    desc: '每减少使用1个一次性纸杯的CO₂减排量'
  },
  useOwnBottle: {
    name: '自带水杯',
    unit: '次',
    factor: 0.08,
    emoji: '🍶',
    desc: '每次使用自带水杯替代一次性杯子的减排量'
  },
  useOwnBag: {
    name: '自带购物袋',
    unit: '次',
    factor: 0.1,
    emoji: '🛍️',
    desc: '每次使用自带购物袋的减排量'
  },
  kitchenCompost: {
    name: '厨余堆肥',
    unit: 'kg',
    factor: 0.5,
    emoji: '🍂',
    desc: '每kg厨余垃圾堆肥处理减少的碳排放（相比填埋）'
  },
  recycleOrderWeight: {
    name: '回收订单重量',
    unit: 'kg',
    factor: 3.0,
    emoji: '🚛',
    desc: '上门回收每kg物品的平均减排系数'
  }
}

/**
 * 活动分类分组
 */
const CARBON_CATEGORIES = [
  {
    id: 'classify',
    name: '正确分类',
    icon: '♻️',
    color: '#5BBD72',
    items: ['classifyCorrect']
  },
  {
    id: 'recycle',
    name: '回收物品',
    icon: '🔄',
    color: '#4A90D9',
    items: ['recyclablePaper', 'recyclablePlastic', 'recyclableGlass', 'recyclableMetal', 'recyclableTextile', 'recyclableEwaste', 'recycleOrderWeight']
  },
  {
    id: 'reduce',
    name: '减塑行动',
    icon: '🚫',
    color: '#E67E22',
    items: ['reduceSingleUseBag', 'reduceSingleUseBottle', 'reduceSingleUseCutlery', 'reduceSingleUseStraw', 'reducePaperCup', 'useOwnBottle', 'useOwnBag']
  },
  {
    id: 'compost',
    name: '厨余处理',
    icon: '🌱',
    color: '#9B59B6',
    items: ['kitchenCompost']
  }
]

/**
 * 直观类比换算系数
 */
const ANALOGY_FACTORS = {
  carKm: {
    name: '少开车',
    unit: '公里',
    factor: 0.2,
    emoji: '🚗',
    desc: '私家车每公里约排放0.2kg CO₂'
  },
  tree: {
    name: '少种树（替代）',
    unit: '棵',
    factor: 18.0,
    emoji: '🌳',
    desc: '一棵树每年约吸收18kg CO₂'
  },
  electricity: {
    name: '省电费',
    unit: '度',
    factor: 0.785,
    emoji: '⚡',
    desc: '中国火电每度电约排放0.785kg CO₂'
  },
  water: {
    name: '节水',
    unit: '吨',
    factor: 0.91,
    emoji: '💧',
    desc: '每吨自来水处理约排放0.91kg CO₂'
  },
  plasticBag: {
    name: '减少塑料袋',
    unit: '个',
    factor: 0.1,
    emoji: '🛍️',
    desc: '每个塑料袋约0.1kg CO₂'
  }
}

/**
 * 碳积分兑换规则（1kg CO₂e = 1 碳积分）
 */
const CARBON_POINTS_RULE = {
  co2ePerPoint: 1,
  pointName: '碳积分'
}

/**
 * 碳减排里程碑配置
 */
const CARBON_MILESTONES = [
  {
    id: 'carbon_seed',
    name: '环保萌芽',
    emoji: '🌱',
    targetCO2e: 1,
    color: '#5BBD72',
    bgColor: 'rgba(91, 189, 114, 0.15)',
    desc: '累计减排 1kg CO₂，迈出环保第一步',
    reward: { type: 'title', value: '环保萌芽大使' }
  },
  {
    id: 'carbon_sprout',
    name: '绿芽初绽',
    emoji: '🌿',
    targetCO2e: 10,
    color: '#27AE60',
    bgColor: 'rgba(39, 174, 96, 0.15)',
    desc: '累计减排 10kg CO₂，环保习惯正养成',
    reward: { type: 'title', value: '绿色生活践行者' }
  },
  {
    id: 'carbon_sapling',
    name: '小树苗',
    emoji: '🌳',
    targetCO2e: 50,
    color: '#16A085',
    bgColor: 'rgba(22, 160, 133, 0.15)',
    desc: '累计减排 50kg CO₂，相当于少开250公里车',
    reward: { type: 'title', value: '低碳达人' }
  },
  {
    id: 'carbon_tree',
    name: '参天大树',
    emoji: '🌲',
    targetCO2e: 200,
    color: '#2ECC71',
    bgColor: 'rgba(46, 204, 113, 0.15)',
    desc: '累计减排 200kg CO₂，相当于种了11棵树',
    reward: { type: 'title', value: '环保先锋' }
  },
  {
    id: 'carbon_forest',
    name: '绿色森林',
    emoji: '🌴',
    targetCO2e: 500,
    color: '#3498DB',
    bgColor: 'rgba(52, 152, 219, 0.15)',
    desc: '累计减排 500kg CO₂，为地球撑起一片绿',
    reward: { type: 'title', value: '碳汇守护者' }
  },
  {
    id: 'carbon_planet',
    name: '地球卫士',
    emoji: '🌍',
    targetCO2e: 1000,
    color: '#9B59B6',
    bgColor: 'rgba(155, 89, 182, 0.15)',
    desc: '累计减排 1000kg CO₂，守护我们共同的家园',
    reward: { type: 'title', value: '地球卫士勋章' }
  },
  {
    id: 'carbon_legend',
    name: '环保传奇',
    emoji: '🏆',
    targetCO2e: 3000,
    color: '#F39C12',
    bgColor: 'rgba(243, 156, 18, 0.15)',
    desc: '累计减排 3000kg CO₂，环保传奇就是你',
    reward: { type: 'title', value: '环保传奇人物' }
  }
]

/**
 * 计算单项活动的 CO₂ 减排量
 * @param {string} activityId 活动ID
 * @param {number} quantity 数量
 * @returns {number} CO₂ 当量减排量 (kg)
 */
const calculateCO2e = (activityId, quantity) => {
  const factor = CARBON_FACTORS[activityId]
  if (!factor) return 0
  return Number((factor.factor * quantity).toFixed(4))
}

/**
 * 计算直观类比
 * @param {number} co2e CO₂ 当量 (kg)
 * @returns {Object} 各类比的换算结果
 */
const calculateAnalogies = (co2e) => {
  const result = {}
  Object.keys(ANALOGY_FACTORS).forEach(key => {
    const a = ANALOGY_FACTORS[key]
    result[key] = {
      ...a,
      value: Number((co2e / a.factor).toFixed(2)),
      displayValue: co2e / a.factor >= 100 
        ? Math.round(co2e / a.factor).toLocaleString()
        : (co2e / a.factor).toFixed(co2e / a.factor >= 10 ? 0 : 1)
    }
  })
  return result
}

/**
 * 根据记录列表统计各分类的减排量
 * @param {Array} records 碳减排记录
 * @returns {Object} 分类统计结果
 */
const summarizeByCategory = (records) => {
  const summary = {}
  CARBON_CATEGORIES.forEach(cat => {
    summary[cat.id] = {
      ...cat,
      co2e: 0,
      count: 0,
      activities: {}
    }
    cat.items.forEach(itemId => {
      summary[cat.id].activities[itemId] = {
        ...CARBON_FACTORS[itemId],
        co2e: 0,
        count: 0
      }
    })
  })

  records.forEach(record => {
    const category = CARBON_CATEGORIES.find(c => c.items.includes(record.activityId))
    if (category && summary[category.id]) {
      summary[category.id].co2e += record.co2e
      summary[category.id].count += record.quantity
      if (summary[category.id].activities[record.activityId]) {
        summary[category.id].activities[record.activityId].co2e += record.co2e
        summary[category.id].activities[record.activityId].count += record.quantity
      }
    }
  })

  Object.keys(summary).forEach(key => {
    summary[key].co2e = Number(summary[key].co2e.toFixed(2))
  })

  return summary
}

/**
 * 按日期范围汇总（生成图表数据）
 * @param {Array} records 碳减排记录
 * @param {string} type 'week' | 'month'
 * @returns {Array} 日期数组和对应减排量
 */
const summarizeByDateRange = (records, type = 'week') => {
  const now = new Date()
  const result = []
  let days = type === 'week' ? 7 : 30

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = formatDate(date, 'YYYY-MM-DD')
    const label = type === 'week' 
      ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
      : `${date.getMonth() + 1}/${date.getDate()}`
    
    result.push({
      date: dateStr,
      label,
      co2e: 0,
      count: 0
    })
  }

  records.forEach(record => {
    const recordDate = record.time ? record.time.split(' ')[0] : ''
    const dayData = result.find(d => d.date === recordDate)
    if (dayData) {
      dayData.co2e += record.co2e
      dayData.count += record.quantity
    }
  })

  result.forEach(d => {
    d.co2e = Number(d.co2e.toFixed(2))
  })

  return result
}

/**
 * 获取用户已解锁的里程碑
 * @param {number} totalCO2e 累计减排总量
 * @returns {Array} 已解锁里程碑列表
 */
const getUnlockedMilestones = (totalCO2e) => {
  return CARBON_MILESTONES.filter(m => totalCO2e >= m.targetCO2e)
}

/**
 * 获取下一个里程碑
 * @param {number} totalCO2e 累计减排总量
 * @returns {Object|null} 下一个里程碑信息
 */
const getNextMilestone = (totalCO2e) => {
  const next = CARBON_MILESTONES.find(m => totalCO2e < m.targetCO2e)
  if (!next) return null
  const progress = Math.min(100, (totalCO2e / next.targetCO2e) * 100)
  return {
    ...next,
    progress: Number(progress.toFixed(1)),
    remaining: Number((next.targetCO2e - totalCO2e).toFixed(2))
  }
}

/**
 * 格式化日期
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
}

/**
 * 获取城市碳减排均值（模拟数据）
 * @param {string} cityId 城市ID
 * @returns {Object} 城市均值数据
 */
const getCityAverage = (cityId) => {
  const cityAverages = {
    shanghai: { weekly: 3.5, monthly: 15.2 },
    beijing: { weekly: 3.2, monthly: 14.0 },
    guangzhou: { weekly: 3.8, monthly: 16.5 },
    shenzhen: { weekly: 3.6, monthly: 15.8 },
    hangzhou: { weekly: 3.3, monthly: 14.5 },
    default: { weekly: 3.0, monthly: 13.0 }
  }
  return cityAverages[cityId] || cityAverages.default
}

/**
 * 获取组内碳减排均值（模拟数据）
 * @returns {Object} 组均值数据
 */
const getGroupAverage = () => {
  return { weekly: 4.2, monthly: 18.5 }
}

module.exports = {
  CARBON_FACTORS,
  CARBON_CATEGORIES,
  ANALOGY_FACTORS,
  CARBON_POINTS_RULE,
  CARBON_MILESTONES,
  calculateCO2e,
  calculateAnalogies,
  summarizeByCategory,
  summarizeByDateRange,
  getUnlockedMilestones,
  getNextMilestone,
  formatDate,
  getCityAverage,
  getGroupAverage
}
