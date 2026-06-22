const { generateId, formatDate } = require('./util')
const {
  LOTTERY_CONFIG,
  LOTTERY_PRIZES,
  LOTTERY_PRIZE_TYPES,
  LOTTERY_PRIZE_RARITY,
  BLINDBOX_CONFIG,
  FESTIVAL_TYPES,
  FESTIVAL_BLINDBOXES,
  LOTTERY_COUPONS_STORAGE_KEY
} = require('./constants')

const LOTTERY_STORAGE_KEY = LOTTERY_CONFIG.storageKey
const LOTTERY_RECORDS_KEY = LOTTERY_CONFIG.recordsKey

const getTodayStr = () => formatDate(new Date(), 'YYYY-MM-DD')

const getCurrentFestivalBox = () => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  for (const festivalType of Object.keys(FESTIVAL_BLINDBOXES)) {
    const box = FESTIVAL_BLINDBOXES[festivalType]
    if (dateStr >= box.startDate && dateStr <= box.endDate) {
      return box
    }
  }
  return null
}

const getAvailableFestivalBoxes = () => {
  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const result = []

  for (const festivalType of Object.keys(FESTIVAL_BLINDBOXES)) {
    const box = FESTIVAL_BLINDBOXES[festivalType]
    if (dateStr >= box.startDate && dateStr <= box.endDate) {
      result.push(box)
    }
  }
  return result
}

const getLotteryData = () => {
  const stored = wx.getStorageSync(LOTTERY_STORAGE_KEY)
  if (stored) return stored

  const today = getTodayStr()
  const initialData = {
    todayDrawCount: 0,
    todayDate: today,
    totalDrawCount: 0,
    missSinceLastRare: 0,
    missSinceLastEpic: 0,
    wonBadges: [],
    wonPhysicalPrizes: [],
    blindboxData: {}
  }
  wx.setStorageSync(LOTTERY_STORAGE_KEY, initialData)
  return initialData
}

const saveLotteryData = (data) => {
  wx.setStorageSync(LOTTERY_STORAGE_KEY, data)
}

const getLotteryRecords = () => {
  const stored = wx.getStorageSync(LOTTERY_RECORDS_KEY)
  return stored || []
}

const saveLotteryRecords = (records) => {
  wx.setStorageSync(LOTTERY_RECORDS_KEY, records)
}

const addLotteryRecord = (record) => {
  const records = getLotteryRecords()
  const newRecord = {
    id: generateId(),
    time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
    ...record
  }
  records.unshift(newRecord)
  saveLotteryRecords(records)
  return newRecord
}

const checkDailyReset = (data) => {
  const today = getTodayStr()
  if (data.todayDate !== today) {
    data.todayDate = today
    data.todayDrawCount = 0
    saveLotteryData(data)
  }
  return data
}

const getRemainingDrawsToday = () => {
  const data = checkDailyReset(getLotteryData())
  return Math.max(0, LOTTERY_CONFIG.dailyDrawLimit - data.todayDrawCount)
}

const getLotteryStats = () => {
  const data = checkDailyReset(getLotteryData())
  return {
    remainingToday: Math.max(0, LOTTERY_CONFIG.dailyDrawLimit - data.todayDrawCount),
    dailyLimit: LOTTERY_CONFIG.dailyDrawLimit,
    totalDrawCount: data.totalDrawCount,
    missSinceLastRare: data.missSinceLastRare,
    missSinceLastEpic: data.missSinceLastEpic,
    costPerDraw: LOTTERY_CONFIG.costPerDraw,
    costPerTenDraw: LOTTERY_CONFIG.costPerTenDraw,
    guaranteeCount: LOTTERY_CONFIG.guaranteeCount,
    guaranteeRareCount: LOTTERY_CONFIG.guaranteeRareCount,
    wonBadgeCount: data.wonBadges.length,
    wonPhysicalCount: data.wonPhysicalPrizes.length
  }
}

const pickPrizeByProbability = (prizeList, useBoosted = false) => {
  const field = useBoosted ? 'boostedProbability' : 'probability'
  const totalProb = prizeList.reduce((sum, p) => sum + (p[field] || p.probability || 0), 0)

  let random = Math.random() * totalProb
  for (const prize of prizeList) {
    const prob = prize[field] || prize.probability || 0
    random -= prob
    if (random <= 0) {
      return prize
    }
  }
  return prizeList[prizeList.length - 1]
}

const isRarityOrHigher = (rarity, threshold) => {
  const order = {
    [LOTTERY_PRIZE_RARITY.COMMON]: 0,
    [LOTTERY_PRIZE_RARITY.RARE]: 1,
    [LOTTERY_PRIZE_RARITY.EPIC]: 2,
    [LOTTERY_PRIZE_RARITY.LEGENDARY]: 3
  }
  return order[rarity] >= order[threshold]
}

const getProbabilityDisclosure = (festivalBoxId = null) => {
  const basePrizes = [...LOTTERY_PRIZES]
  let extraPrizes = []

  if (festivalBoxId) {
    for (const fType of Object.keys(FESTIVAL_BLINDBOXES)) {
      if (FESTIVAL_BLINDBOXES[fType].id === festivalBoxId) {
        extraPrizes = FESTIVAL_BLINDBOXES[fType].exclusivePrizes || []
        break
      }
    }
  }

  const allPrizes = [...extraPrizes, ...basePrizes]

  const grouped = {
    [LOTTERY_PRIZE_RARITY.COMMON]: { name: '普通', prizes: [], totalProb: 0, boostedProb: 0 },
    [LOTTERY_PRIZE_RARITY.RARE]: { name: '稀有', prizes: [], totalProb: 0, boostedProb: 0 },
    [LOTTERY_PRIZE_RARITY.EPIC]: { name: '史诗', prizes: [], totalProb: 0, boostedProb: 0 },
    [LOTTERY_PRIZE_RARITY.LEGENDARY]: { name: '传说', prizes: [], totalProb: 0, boostedProb: 0 }
  }

  allPrizes.forEach(prize => {
    const rarity = prize.rarity || LOTTERY_PRIZE_RARITY.COMMON
    if (!grouped[rarity]) {
      grouped[rarity] = { name: rarity, prizes: [], totalProb: 0, boostedProb: 0 }
    }
    grouped[rarity].prizes.push(prize)
    grouped[rarity].totalProb += prize.probability || 0
    grouped[rarity].boostedProb += prize.boostedProbability || prize.probability || 0
  })

  return {
    groups: grouped,
    guaranteeCount: LOTTERY_CONFIG.guaranteeCount,
    guaranteeRareCount: LOTTERY_CONFIG.guaranteeRareCount,
    note: '保底机制：连续10次未获得稀有及以上奖品时，第10次必得稀有或更高；连续30次未获得史诗及以上时，第30次必得史诗或更高'
  }
}

const performSingleDraw = (options = {}) => {
  const { festivalBoxId = null } = options
  const data = checkDailyReset(getLotteryData())

  let prizePool = [...LOTTERY_PRIZES]
  let exclusivePrizes = []

  if (festivalBoxId) {
    for (const fType of Object.keys(FESTIVAL_BLINDBOXES)) {
      if (FESTIVAL_BLINDBOXES[fType].id === festivalBoxId) {
        exclusivePrizes = FESTIVAL_BLINDBOXES[fType].exclusivePrizes || []
        break
      }
    }
    prizePool = [...exclusivePrizes, ...prizePool]
  }

  const needGuaranteeRare = data.missSinceLastRare + 1 >= LOTTERY_CONFIG.guaranteeCount
  const needGuaranteeEpic = data.missSinceLastEpic + 1 >= LOTTERY_CONFIG.guaranteeRareCount

  let prize
  let useBoosted = data.missSinceLastRare >= 5 || data.missSinceLastEpic >= 15

  if (needGuaranteeEpic) {
    const epicOrHigher = prizePool.filter(p =>
      isRarityOrHigher(p.rarity, LOTTERY_PRIZE_RARITY.EPIC)
    )
    prize = pickPrizeByProbability(epicOrHigher, useBoosted)
    console.log('[Lottery] 触发史诗保底')
  } else if (needGuaranteeRare) {
    const rareOrHigher = prizePool.filter(p =>
      isRarityOrHigher(p.rarity, LOTTERY_PRIZE_RARITY.RARE)
    )
    prize = pickPrizeByProbability(rareOrHigher, useBoosted)
    console.log('[Lottery] 触发稀有保底')
  } else {
    prize = pickPrizeByProbability(prizePool, useBoosted)
  }

  const wonPrize = { ...prize, drawId: generateId() }
  const isRarePlus = isRarityOrHigher(prize.rarity, LOTTERY_PRIZE_RARITY.RARE)
  const isEpicPlus = isRarityOrHigher(prize.rarity, LOTTERY_PRIZE_RARITY.EPIC)

  if (isRarePlus) {
    data.missSinceLastRare = 0
  } else {
    data.missSinceLastRare += 1
  }

  if (isEpicPlus) {
    data.missSinceLastEpic = 0
  } else {
    data.missSinceLastEpic += 1
  }

  data.todayDrawCount += 1
  data.totalDrawCount += 1
  saveLotteryData(data)

  return {
    prize: wonPrize,
    stats: {
      missSinceLastRare: data.missSinceLastRare,
      missSinceLastEpic: data.missSinceLastEpic,
      triggeredGuarantee: needGuaranteeRare || needGuaranteeEpic,
      usedBoostedProb: useBoosted
    }
  }
}

const performMultiDraw = (count, options = {}) => {
  const results = []
  for (let i = 0; i < count; i++) {
    const result = performSingleDraw(options)
    results.push(result)
  }
  const prizes = results.map(r => r.prize)
  const hasRarePlus = prizes.some(p => isRarityOrHigher(p.rarity, LOTTERY_PRIZE_RARITY.RARE))
  const hasEpicPlus = prizes.some(p => isRarityOrHigher(p.rarity, LOTTERY_PRIZE_RARITY.EPIC))

  return {
    draws: results,
    prizes,
    summary: { hasRarePlus, hasEpicPlus, totalRare: prizes.filter(p => isRarityOrHigher(p.rarity, LOTTERY_PRIZE_RARITY.RARE)).length }
  }
}

const performBlindboxDraw = (boxId = 'box_normal') => {
  const festivalBoxes = getAvailableFestivalBoxes()
  const festivalBox = festivalBoxes.find(b => b.id === boxId)
  const normalBox = BLINDBOX_CONFIG.normalBox
  const box = festivalBox || normalBox

  const itemMin = box.itemCount[0]
  const itemMax = box.itemCount[1]
  const itemCount = Math.floor(Math.random() * (itemMax - itemMin + 1)) + itemMin

  const results = []
  for (let i = 0; i < itemCount; i++) {
    const result = performSingleDraw({ festivalBoxId: festivalBox ? festivalBox.id : null })
    results.push(result)
  }

  const prizes = results.map(r => r.prize)
  const rareCount = prizes.filter(p => isRarityOrHigher(p.rarity, LOTTERY_PRIZE_RARITY.RARE)).length
  let finalPrizes = prizes

  if (rareCount === 0) {
    const guaranteeCount = box.guaranteeCount || 3
    const data = getLotteryData()
    if (data.missSinceLastRare >= guaranteeCount - 1) {
      let prizePool = [...LOTTERY_PRIZES]
      if (festivalBox) {
        prizePool = [...(festivalBox.exclusivePrizes || []), ...prizePool]
      }
      const rareOrHigher = prizePool.filter(p => isRarityOrHigher(p.rarity, LOTTERY_PRIZE_RARITY.RARE))
      const guaranteedPrize = pickPrizeByProbability(rareOrHigher)
      guaranteedPrize.drawId = generateId()
      finalPrizes = [...finalPrizes.slice(0, -1), guaranteedPrize]
      data.missSinceLastRare = 0
      saveLotteryData(data)
    }
  }

  return {
    box,
    boxId: box.id,
    isFestival: !!festivalBox,
    prizes: finalPrizes,
    totalValue: finalPrizes.reduce((sum, p) => {
      if (p.type === LOTTERY_PRIZE_TYPES.POINTS) return sum + p.value
      return sum
    }, 0)
  }
}

const validateDrawForUser = (app, drawCost, drawCount = 1, isBlindbox = false) => {
  const userInfo = app.globalData.userInfo
  if (!userInfo) {
    return { success: false, message: '用户信息未加载，请稍后重试' }
  }

  if (app.isChildModeEnabled()) {
    return { success: false, message: '儿童模式下无法使用抽奖功能', blocked: true, requireParentPIN: true }
  }

  const userAge = userInfo.age || 18
  if (userAge < LOTTERY_CONFIG.minorAgeLimit && LOTTERY_CONFIG.parentPinRequiredForMinor) {
    return { success: false, message: '未成年人抽奖需家长验证', requireParentPIN: true, minorBlocked: true }
  }

  if (!isBlindbox) {
    const data = checkDailyReset(getLotteryData())
    if (data.todayDrawCount + drawCount > LOTTERY_CONFIG.dailyDrawLimit) {
      const remaining = Math.max(0, LOTTERY_CONFIG.dailyDrawLimit - data.todayDrawCount)
      return {
        success: false,
        message: `今日抽奖次数已达上限（剩余${remaining}次）`,
        dailyLimitReached: true,
        remaining
      }
    }
  }

  if ((userInfo.points || 0) < drawCost) {
    return {
      success: false,
      message: `积分不足，需要${drawCost}积分`,
      insufficientPoints: true,
      required: drawCost,
      current: userInfo.points || 0
    }
  }

  return { success: true }
}

const processPrizeDelivery = (app, prize, sourceType = 'lottery') => {
  const data = getLotteryData()
  const userInfo = app.globalData.userInfo
  let deliveryResult = { delivered: false, actions: [] }

  switch (prize.type) {
    case LOTTERY_PRIZE_TYPES.POINTS: {
      const points = prize.value || 0
      if (points > 0) {
        app.updateUserPoints(points, {
          category: 'lottery',
          title: `${sourceType === 'blindbox' ? '盲盒' : '抽奖'}奖励`,
          desc: prize.name,
          emoji: prize.emoji || '🎁'
        })
        deliveryResult.delivered = true
        deliveryResult.actions.push({ type: 'points', value: points })
      }
      break
    }

    case LOTTERY_PRIZE_TYPES.BADGE: {
      if (!data.wonBadges.includes(prize.value)) {
        data.wonBadges.push(prize.value)
        saveLotteryData(data)
      }
      app.addVirtualBadge(prize.value, {
        name: prize.name,
        emoji: prize.emoji,
        description: prize.description,
        color: prize.color,
        source: sourceType
      })
      deliveryResult.delivered = true
      deliveryResult.actions.push({ type: 'badge', value: prize.value, name: prize.name })
      break
    }

    case LOTTERY_PRIZE_TYPES.COUPON: {
      const coupons = getLotteryCoupons()
      const couponData = prize.value || {}
      const expireDate = new Date()
      expireDate.setDate(expireDate.getDate() + (couponData.validDays || 30))

      const newCoupon = {
        id: generateId(),
        prizeId: prize.id,
        name: prize.name,
        emoji: prize.emoji,
        description: prize.description,
        discount: couponData.discount,
        minPoints: couponData.minPoints || 0,
        isPercent: couponData.isPercent || false,
        maxDiscount: couponData.isPercent ? 500 : null,
        expireAt: formatDate(expireDate, 'YYYY-MM-DD'),
        createdAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
        used: false,
        source: sourceType
      }
      coupons.unshift(newCoupon)
      saveLotteryCoupons(coupons)
      deliveryResult.delivered = true
      deliveryResult.actions.push({ type: 'coupon', coupon: newCoupon })
      break
    }

    case LOTTERY_PRIZE_TYPES.PHYSICAL: {
      const physicalRecord = {
        id: generateId(),
        prizeId: prize.id,
        name: prize.name,
        emoji: prize.emoji,
        description: prize.description,
        linkedGoodsId: prize.linkedGoodsId,
        status: 'pending_address',
        createdAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      }
      data.wonPhysicalPrizes.push(physicalRecord)
      saveLotteryData(data)
      deliveryResult.delivered = true
      deliveryResult.actions.push({ type: 'physical', record: physicalRecord, requireAddress: true })
      break
    }

    case LOTTERY_PRIZE_TYPES.THANK_YOU:
    default: {
      deliveryResult.delivered = true
      deliveryResult.actions.push({ type: 'none', message: '谢谢参与' })
      break
    }
  }

  addLotteryRecord({
    sourceType,
    prizeName: prize.name,
    prizeType: prize.type,
    rarity: prize.rarity,
    emoji: prize.emoji,
    color: prize.color,
    deliveryStatus: deliveryResult.delivered ? 'delivered' : 'failed',
    prizeValue: prize.value,
    actions: deliveryResult.actions
  })

  return deliveryResult
}

const getLotteryCoupons = () => {
  const stored = wx.getStorageSync(LOTTERY_COUPONS_STORAGE_KEY)
  return stored || []
}

const saveLotteryCoupons = (coupons) => {
  wx.setStorageSync(LOTTERY_COUPONS_STORAGE_KEY, coupons)
}

const getValidCoupons = (pointsRequired = 0) => {
  const coupons = getLotteryCoupons()
  const today = getTodayStr()
  return coupons.filter(c =>
    !c.used &&
    c.expireAt >= today &&
    (c.minPoints || 0) <= pointsRequired
  )
}

const useCoupon = (couponId, orderPoints) => {
  const coupons = getLotteryCoupons()
  const index = coupons.findIndex(c => c.id === couponId)
  if (index === -1) return { success: false, message: '优惠券不存在' }

  const coupon = coupons[index]
  if (coupon.used) return { success: false, message: '优惠券已使用' }

  const today = getTodayStr()
  if (coupon.expireAt < today) return { success: false, message: '优惠券已过期' }

  if ((coupon.minPoints || 0) > orderPoints) {
    return { success: false, message: `需满${coupon.minPoints}积分才能使用` }
  }

  let discountValue = coupon.discount
  if (coupon.isPercent) {
    discountValue = Math.floor(orderPoints * coupon.discount / 100)
    if (coupon.maxDiscount) {
      discountValue = Math.min(discountValue, coupon.maxDiscount)
    }
  }

  coupons[index].used = true
  coupons[index].usedAt = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
  coupons[index].appliedOrderPoints = orderPoints
  saveLotteryCoupons(coupons)

  return {
    success: true,
    discount: discountValue,
    finalPoints: Math.max(0, orderPoints - discountValue),
    coupon
  }
}

const getPhysicalPrizeRecords = () => {
  const data = getLotteryData()
  return data.wonPhysicalPrizes || []
}

const updatePhysicalPrizeStatus = (prizeId, status, extra = {}) => {
  const data = getLotteryData()
  const prize = data.wonPhysicalPrizes.find(p => p.id === prizeId)
  if (!prize) return false

  prize.status = status
  if (extra.addressId) prize.addressId = extra.addressId
  if (extra.orderId) prize.orderId = extra.orderId
  if (extra.claimedAt) prize.claimedAt = extra.claimedAt

  saveLotteryData(data)
  return true
}

module.exports = {
  LOTTERY_STORAGE_KEY,
  LOTTERY_RECORDS_KEY,
  getLotteryData,
  saveLotteryData,
  getLotteryRecords,
  saveLotteryRecords,
  addLotteryRecord,
  checkDailyReset,
  getRemainingDrawsToday,
  getLotteryStats,
  pickPrizeByProbability,
  isRarityOrHigher,
  getProbabilityDisclosure,
  performSingleDraw,
  performMultiDraw,
  performBlindboxDraw,
  validateDrawForUser,
  processPrizeDelivery,
  getLotteryCoupons,
  saveLotteryCoupons,
  getValidCoupons,
  useCoupon,
  getPhysicalPrizeRecords,
  updatePhysicalPrizeStatus,
  getCurrentFestivalBox,
  getAvailableFestivalBoxes,
  getTodayStr
}
