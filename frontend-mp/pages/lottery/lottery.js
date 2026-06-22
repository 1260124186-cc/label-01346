/**
 * 积分抽奖页面
 * @description 幸运转盘、单次/十连抽、概率公示、保底机制
 */
const app = getApp()
const { navigateTo, showToast, showModal } = require('../../utils/util')

Page({
  data: {
    currentPoints: 0,
    stats: {
      remainingToday: 0,
      totalDrawCount: 0,
      wonBadgeCount: 0,
      missSinceLastRare: 0,
      guaranteeCount: 10,
      costPerDraw: 50,
      costPerTenDraw: 450,
      dailyLimit: 10
    },
    festivalBox: null,
    isSpinning: false,
    wheelRotation: 0,
    showProbability: false,
    probabilityGroups: [],
    showPrizeModal: false,
    wonPrizes: [],
    isMultiDraw: false,
    rareCount: 0,
    showPINModal: false,
    experienceClasses: '',
    lotterySystem: null
  },

  onLoad() {
    console.log('[Lottery] 页面加载')
    const lotterySystem = app.globalData.lotterySystem || require('../../utils/lottery').lotterySystem
    this.setData({
      lotterySystem,
      experienceClasses: app.globalData.darkMode ? 'dark-mode' : ''
    })
    this.refreshAllData()
    this.loadProbability()
  },

  onShow() {
    console.log('[Lottery] 页面显示')
    this.refreshAllData()
    this.setData({
      experienceClasses: app.globalData.darkMode ? 'dark-mode' : ''
    })
  },

  onPullDownRefresh() {
    this.refreshAllData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 300)
  },

  refreshAllData() {
    const userInfo = app.globalData.userInfo
    const lotteryStats = app.getLotteryStats()
    const festivalBox = app.globalData.festivalBoxActive
    this.setData({
      currentPoints: userInfo ? userInfo.points || 0 : 0,
      stats: {
        remainingToday: lotteryStats.remainingToday,
        totalDrawCount: lotteryStats.totalDrawCount,
        wonBadgeCount: lotteryStats.wonBadgeCount || 0,
        missSinceLastRare: lotteryStats.missSinceLastRare || 0,
        guaranteeCount: lotteryStats.guaranteeCount || 10,
        costPerDraw: lotteryStats.costPerDraw,
        costPerTenDraw: lotteryStats.costPerTenDraw,
        dailyLimit: lotteryStats.dailyLimit
      },
      festivalBox: festivalBox || null
    })
  },

  loadProbability() {
    const disclosure = app.getProbabilityDisclosure()
    this.setData({
      probabilityGroups: disclosure.groups || []
    })
  },

  toggleProbability() {
    this.setData({
      showProbability: !this.data.showProbability
    })
  },

  async onDrawSingle() {
    if (this.data.isSpinning) return
    if (this.data.stats.remainingToday < 1) {
      showToast('今日抽奖次数已用完')
      return
    }
    if (this.data.currentPoints < this.data.stats.costPerDraw) {
      showToast('积分不足，无法抽奖')
      return
    }
    await this.executeDraw(1)
  },

  async onDrawTen() {
    if (this.data.isSpinning) return
    if (this.data.stats.remainingToday < 10) {
      showToast(`今日剩余仅${this.data.stats.remainingToday}次`)
      return
    }
    if (this.data.currentPoints < this.data.stats.costPerTenDraw) {
      showToast('积分不足，无法十连抽')
      return
    }
    await this.executeDraw(10)
  },

  async executeDraw(count) {
    if (app.isChildModeEnabled()) {
      showModal('儿童模式', '儿童模式下禁止参与抽奖，请在家长监护下使用', false)
      return
    }
    const userProfile = app.getUserProfile()
    const minAge = this.data.stats.minorsAgeLimit || 14
    if (userProfile && userProfile.birthday) {
      const age = this.calculateAge(userProfile.birthday)
      if (age < 18 && age >= 14) {
        const pinVerified = app.isPINVerifiedToday()
        if (!pinVerified) {
          this.setData({ showPINModal: true })
          return
        }
      }
    }

    this.setData({ isSpinning: true })

    const targetRotation = 360 * (6 + Math.random() * 4) + (this.data.wheelRotation % 360)
    this.setData({
      wheelRotation: targetRotation
    })

    await new Promise(resolve => setTimeout(resolve, count > 1 ? 4500 : 4000))

    try {
      const result = await app.doLotteryDraw(count)
      if (result.success) {
        const isRarityOrHigher = this.data.lotterySystem && this.data.lotterySystem.isRarityOrHigher
          ? (r, t) => this.data.lotterySystem.isRarityOrHigher(r, t)
          : (rarity, threshold) => {
              const order = { common: 0, rare: 1, epic: 2, legendary: 3 }
              return (order[rarity] || 0) >= (order[threshold] || 0)
            }
        const wonPrizes = result.prizes.map(p => ({
          ...p,
          bgColor: this.getPrizeBgColor(p.rarity),
          isRare: isRarityOrHigher(p.rarity, 'rare'),
          isEpic: isRarityOrHigher(p.rarity, 'epic')
        }))
        const rareCount = wonPrizes.filter(p => p.isRare).length
        this.setData({
          wonPrizes,
          isMultiDraw: count > 1,
          rareCount,
          showPrizeModal: true
        })
      } else if (result.needPIN) {
        this.setData({ showPINModal: true })
      } else {
        showToast(result.message || '抽奖失败')
      }
    } catch (err) {
      console.error('[Lottery] 抽奖执行失败:', err)
      showToast('系统繁忙，请重试')
    } finally {
      this.setData({ isSpinning: false })
      this.refreshAllData()
    }
  },

  getPrizeBgColor(rarity) {
    const colors = {
      common: '#F7FAF8',
      uncommon: '#E8F8EC',
      rare: '#FFF5E6',
      epic: '#FFE8E8',
      legendary: '#F0E6FF'
    }
    return colors[rarity] || colors.common
  },

  calculateAge(birthday) {
    if (!birthday) return 20
    const birth = new Date(birthday)
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    const m = now.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
      age--
    }
    return age
  },

  drawAgain() {
    this.setData({ showPrizeModal: false })
    setTimeout(() => {
      this.onDrawSingle()
    }, 300)
  },

  hidePrizeModal() {
    this.setData({ showPrizeModal: false })
  },

  hidePINModal() {
    this.setData({ showPINModal: false })
  },

  goToPINVerify() {
    this.setData({ showPINModal: false })
    navigateTo('/pages/parent-control/parent-control')
  },

  goToBlindbox() {
    navigateTo('/pages/blindbox/blindbox')
  },

  goToRecords() {
    navigateTo('/pages/lottery-records/lottery-records')
  },

  preventClose() {},

  onShareAppMessage() {
    return {
      title: '🎰 积分抽奖来啦！限定勋章、限量实物等你拿',
      path: '/pages/lottery/lottery'
    }
  }
})
