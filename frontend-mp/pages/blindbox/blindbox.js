/**
 * 盲盒专区页面
 * @description 常规盲盒 + 节日限定盲盒，开盒动画
 */
const app = getApp()
const { BLINDBOX_CONFIG, LOTTERY_PRIZES } = require('../../utils/constants')
const { navigateTo, showToast, showModal, formatDate } = require('../../utils/util')

Page({
  data: {
    currentPoints: 0,
    festivalBox: null,
    festivalDaysLeft: 0,
    regularConfig: {
      cost: 100,
      costPerFive: 450,
      minPrizes: 3,
      maxPrizes: 5,
      guaranteeCount: 5
    },
    regularPreviewPrizes: [],
    stats: {
      blindboxMissSinceRare: 0
    },
    recentRecords: [],
    showOpenModal: false,
    isOpening: false,
    currentBoxColor: '#9B59B6',
    currentBoxEmoji: '🎁',
    currentBoxName: '经典环保盲盒',
    currentBoxId: 'regular',
    revealedPrizes: [],
    revealRareCount: 0,
    canOpenAgain: true,
    showPINModal: false,
    experienceClasses: '',
    lotterySystem: null
  },

  onLoad() {
    console.log('[Blindbox] 页面加载')
    const lotterySystem = app.globalData.lotterySystem || require('../../utils/lottery').lotterySystem
    this.setData({
      lotterySystem,
      experienceClasses: app.globalData.darkMode ? 'dark-mode' : ''
    })
    this.loadRegularPreview()
    this.refreshAllData()
  },

  onShow() {
    console.log('[Blindbox] 页面显示')
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

  loadRegularPreview() {
    const preview = LOTTERY_PRIZES.filter(p => ['points_50', 'badge_eco', 'coupon_20', 'thanks'].indexOf(p.id) >= 0)
    this.setData({ regularPreviewPrizes: preview })
  },

  refreshAllData() {
    const userInfo = app.globalData.userInfo
    const lotteryStats = app.getLotteryStats()
    const festivalBox = app.globalData.festivalBoxActive
    let festivalDaysLeft = 0
    if (festivalBox) {
      const now = new Date()
      const endParts = festivalBox.endDate.split('-')
      const endDate = new Date(now.getFullYear(), parseInt(endParts[0]) - 1, parseInt(endParts[1]))
      if (endDate < now) {
        endDate.setFullYear(now.getFullYear() + 1)
      }
      const diffMs = endDate.getTime() - now.getTime()
      festivalDaysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
    }
    this.setData({
      currentPoints: userInfo ? userInfo.points || 0 : 0,
      festivalBox: festivalBox || null,
      festivalDaysLeft,
      stats: {
        blindboxMissSinceRare: lotteryStats.blindboxMissSinceRare || 0
      }
    })
    this.loadRecentRecords()
  },

  loadRecentRecords() {
    const allRecords = app.getLotteryRecords()
    const blindboxRecords = (allRecords || []).filter(r => r.sourceType === 'blindbox' || r.drawType === 'blindbox').slice(0, 5)
    const recentRecords = blindboxRecords.map(r => {
      const festivalBoxList = this.data.lotterySystem && this.data.lotterySystem.getFestivalBoxes ? this.data.lotterySystem.getFestivalBoxes() : []
      const isFestival = r.boxId && r.boxId !== 'regular'
      const boxConfig = isFestival ? festivalBoxList.find(b => b.id === r.boxId) : null
      const emoji = isFestival ? (boxConfig ? boxConfig.emoji : '🎁') : '🎁'
      const name = isFestival ? (boxConfig ? boxConfig.name : '节日限定盲盒') : '经典环保盲盒'
      const color = isFestival ? (boxConfig ? boxConfig.gradientStart : '#9B59B6') : '#9B59B6'
      return {
        id: r.id,
        emoji,
        boxName: name,
        boxColor: color,
        timeAgo: this.formatTimeAgo(r.timestamp),
        prizes: (r.prizes || [r.prize]).map(p => ({
          id: p.id,
          emoji: p.emoji,
          name: p.name
        }))
      }
    })
    this.setData({ recentRecords })
  },

  formatTimeAgo(timestamp) {
    if (!timestamp) return ''
    const diff = Date.now() - timestamp
    const min = 60 * 1000
    const hour = 60 * min
    const day = 24 * hour
    if (diff < min) return '刚刚'
    if (diff < hour) return Math.floor(diff / min) + '分钟前'
    if (diff < day) return Math.floor(diff / hour) + '小时前'
    if (diff < 7 * day) return Math.floor(diff / day) + '天前'
    return formatDate(new Date(timestamp), 'MM-DD')
  },

  async openRegularBox() {
    if (this.data.currentPoints < this.data.regularConfig.cost) {
      showToast('积分不足')
      return
    }
    await this.doOpenBox('regular')
  },

  async openFestivalBox() {
    if (!this.data.festivalBox) return
    if (this.data.currentPoints < this.data.festivalBox.cost) {
      showToast('积分不足')
      return
    }
    await this.doOpenBox(this.data.festivalBox.id)
  },

  async doOpenBox(boxId) {
    if (app.isChildModeEnabled()) {
      showModal('儿童模式', '儿童模式下禁止参与开盲盒', false)
      return
    }
    const userProfile = app.getUserProfile()
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

    const isFestival = boxId !== 'regular'
    const boxConfig = isFestival ? this.data.festivalBox : this.data.regularConfig
    const emoji = isFestival ? this.data.festivalBox.emoji : '🎁'
    const name = isFestival ? this.data.festivalBox.name : '经典环保盲盒'
    const color = isFestival ? this.data.festivalBox.gradientStart : '#9B59B6'

    this.setData({
      showOpenModal: true,
      isOpening: true,
      currentBoxId: boxId,
      currentBoxEmoji: emoji,
      currentBoxName: name,
      currentBoxColor: color
    })

    try {
      const result = await app.doBlindboxDraw(boxId)
      if (!result.success) {
        this.setData({ showOpenModal: false, isOpening: false })
        if (result.needPIN) {
          this.setData({ showPINModal: true })
        } else {
          showToast(result.message || '开盒失败')
        }
        return
      }

      setTimeout(() => {
        const isRarityOrHigher = this.data.lotterySystem && this.data.lotterySystem.isRarityOrHigher
          ? (r, t) => this.data.lotterySystem.isRarityOrHigher(r, t)
          : (rarity, threshold) => {
              const order = { common: 0, rare: 1, epic: 2, legendary: 3 }
              return (order[rarity] || 0) >= (order[threshold] || 0)
            }
        const revealedPrizes = (result.prizes || []).map(p => ({
          ...p,
          bgColor: this.getPrizeBgColor(p.rarity),
          isRare: isRarityOrHigher(p.rarity, 'rare'),
          isEpic: isRarityOrHigher(p.rarity, 'epic')
        }))
        const revealRareCount = revealedPrizes.filter(p => p.isRare).length
        const userInfo = app.globalData.userInfo
        const leftPoints = userInfo ? userInfo.points || 0 : 0
        this.setData({
          isOpening: false,
          revealedPrizes,
          revealRareCount,
          canOpenAgain: leftPoints >= (isFestival ? this.data.festivalBox.cost : this.data.regularConfig.cost)
        })
      }, 1800)

    } catch (err) {
      console.error('[Blindbox] 开盒异常:', err)
      this.setData({ showOpenModal: false, isOpening: false })
      showToast('系统繁忙')
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
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
    return age
  },

  openAgain() {
    this.setData({ showOpenModal: false, isOpening: false })
    setTimeout(() => {
      if (this.data.currentBoxId === 'regular') {
        this.openRegularBox()
      } else {
        this.openFestivalBox()
      }
    }, 300)
  },

  hideOpenModal() {
    this.setData({ showOpenModal: false, isOpening: false })
    this.refreshAllData()
  },

  hidePINModal() {
    this.setData({ showPINModal: false })
  },

  goToPINVerify() {
    this.setData({ showPINModal: false })
    navigateTo('/pages/parent-control/parent-control')
  },

  goToActivity(e) {
    const activityId = (e && e.currentTarget && e.currentTarget.dataset.id) || (this.data.festivalBox && this.data.festivalBox.activityId)
    if (activityId) {
      navigateTo('/pages/activity/activity', { id: activityId })
    }
  },

  goToRecords() {
    navigateTo('/pages/lottery-records/lottery-records')
  },

  preventClose() {},

  onShareAppMessage() {
    const title = this.data.festivalBox
      ? `🎁 ${this.data.festivalBox.name}盲盒限时开启！限定勋章等你拿`
      : '📦 惊喜盲盒来啦！开盒必出多件奖品，稀有勋章等你拿'
    return { title, path: '/pages/blindbox/blindbox' }
  }
})
