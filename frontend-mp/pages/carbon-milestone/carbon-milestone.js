const app = getApp()
const { showToast, formatDate } = require('../../utils/util')
const {
  getNextMilestone,
  calculateAnalogies
} = require('../../utils/carbon')

Page({
  data: {
    totalCO2e: 0,
    carbonPoints: 0,
    milestones: [],
    unlockedCount: 0,
    nextMilestone: null,
    analogies: {},
    currentTitle: '',
    experienceClasses: '',
    showUnlockModal: false,
    unlockedMilestone: null
  },

  onLoad(options) {
    this.loadData()
    this.setData({ experienceClasses: app.getExperienceClasses() })

    if (options && options.unlock) {
      const milestone = app.getCarbonMilestones().find(m => m.id === options.unlock)
      if (milestone && milestone.unlocked) {
        setTimeout(() => {
          this.setData({
            showUnlockModal: true,
            unlockedMilestone: milestone
          })
        }, 300)
      }
    }
  },

  onShow() {
    this.loadData()
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  loadData() {
    const totalCO2e = app.getTotalCarbon()
    const carbonPoints = app.getCarbonPoints()
    const milestones = app.getCarbonMilestones()
    const unlockedCount = milestones.filter(m => m.unlocked).length
    const nextMilestone = getNextMilestone(totalCO2e)
    const analogies = calculateAnalogies(totalCO2e)

    let currentTitle = '环保新手'
    const unlockedSorted = milestones.filter(m => m.unlocked).sort((a, b) => b.targetCO2e - a.targetCO2e)
    if (unlockedSorted.length > 0) {
      currentTitle = unlockedSorted[0].reward && unlockedSorted[0].reward.value ? unlockedSorted[0].reward.value : unlockedSorted[0].name
    }

    this.setData({
      totalCO2e,
      carbonPoints,
      milestones,
      unlockedCount,
      nextMilestone,
      analogies,
      currentTitle
    })
  },

  onMilestoneTap(e) {
    const { item } = e.currentTarget.dataset
    if (item.unlocked) {
      showToast(`已解锁：${item.reward ? item.reward.value : item.name}`)
    } else {
      showToast(`还差 ${(item.targetCO2e - this.data.totalCO2e).toFixed(2)}kg CO₂e`)
    }
  },

  closeUnlockModal() {
    this.setData({ showUnlockModal: false, unlockedMilestone: null })
  },

  shareMilestone() {
    if (this.data.unlockedMilestone) {
      showToast('已复制荣誉信息')
      wx.setClipboardData({
        data: `我在垃圾分类助手中解锁了「${this.data.unlockedMilestone.name}」碳减排荣誉！累计减排 ${this.data.totalCO2e}kg CO₂e，一起来守护地球吧！`
      })
    }
  },

  onShareAppMessage() {
    const totalCO2e = this.data.totalCO2e
    return {
      title: `我已解锁${this.data.unlockedCount}项碳减排荣誉，累计减排${totalCO2e}kg CO₂！`,
      path: `/pages/index/index?inviterId=${app.getUserId()}`
    }
  },

  onThemeChange(isDark) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onFontChange(isLarge) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  }
})
