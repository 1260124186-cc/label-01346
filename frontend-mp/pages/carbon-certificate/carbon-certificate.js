const app = getApp()
const {
  summarizeByCategory,
  summarizeByDateRange,
  calculateAnalogies,
  CARBON_MILESTONES
} = require('../../utils/carbon')
const {
  showToast,
  showSuccess,
  showModal,
  formatNumber
} = require('../../utils/util')

Page({
  data: {
    period: 'all',
    periodOptions: [
      { id: 'all', name: '全部记录' },
      { id: 'week', name: '本周' },
      { id: 'month', name: '本月' },
      { id: 'year', name: '本年' }
    ],
    totalCO2e: 0,
    carbonPoints: 0,
    recordCount: 0,
    analogies: {},
    categorySummary: [],
    periodRecords: [],
    userName: '环保达人',
    certNumber: '',
    certDate: '',
    unlockedMilestones: [],
    experienceClasses: ''
  },

  onLoad() {
    this.generateCertNumber()
    this.loadData()
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onShow() {
    this.loadData()
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  generateCertNumber() {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 90000 + 10000)
    this.setData({
      certNumber: `CZ-${y}${m}${d}-${random}`,
      certDate: `${y}-${m}-${d}`
    })
  },

  loadData() {
    const allRecords = app.getCarbonRecords()
    const period = this.data.period

    const now = Date.now()
    let periodRecords = allRecords

    if (period === 'week') {
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000
      periodRecords = allRecords.filter(r => r.timestamp >= weekAgo)
    } else if (period === 'month') {
      const d = new Date()
      d.setDate(1)
      d.setHours(0, 0, 0, 0)
      periodRecords = allRecords.filter(r => r.timestamp >= d.getTime())
    } else if (period === 'year') {
      const d = new Date()
      d.setMonth(0, 1)
      d.setHours(0, 0, 0, 0)
      periodRecords = allRecords.filter(r => r.timestamp >= d.getTime())
    }

    const totalCO2e = periodRecords.reduce((sum, r) => sum + r.co2e, 0)
    const carbonPoints = Math.floor(totalCO2e * 10)
    const analogies = calculateAnalogies(totalCO2e)
    const categorySummaryObj = summarizeByCategory(periodRecords)
    const categorySummary = Object.keys(categorySummaryObj).map(key => ({
      category: key,
      ...categorySummaryObj[key]
    })).sort((a, b) => b.co2e - a.co2e)

    const unlockedMilestones = CARBON_MILESTONES.filter(m => m.targetCO2e <= totalCO2e)

    const userInfo = wx.getStorageSync('userInfo') || {}
    const userName = userInfo.nickName || '环保达人'

    this.setData({
      totalCO2e,
      carbonPoints,
      recordCount: periodRecords.length,
      analogies,
      categorySummary,
      periodRecords,
      userName,
      unlockedMilestones
    })
  },

  changePeriod(e) {
    const period = e.currentTarget.dataset.id
    this.setData({ period })
    this.generateCertNumber()
    this.loadData()
  },

  async exportCertificate() {
    if (this.data.recordCount === 0) {
      showToast('暂无记录可导出')
      return
    }

    const content = this.buildCertText()
    wx.setClipboardData({
      data: content,
      success: () => {
        showToast('证明文本已复制')
      }
    })
  },

  buildCertText() {
    const d = this.data
    const categoryStr = d.categorySummary.map(c => `  · ${c.icon}${c.name}：${c.count}次（${c.co2e}kg）`).join('\n')
    const milestoneStr = d.unlockedMilestones.length > 0
      ? d.unlockedMilestones.map(m => `  · ${m.emoji} ${m.name}`).join('\n')
      : '  暂无'

    return `
╔════════════════════════════════════╗
║        碳 减 排 证 明               ║
╚════════════════════════════════════╝

证书编号：${d.certNumber}
开具日期：${d.certDate}

持证人：${d.userName}

────────────────────────────
【减排成果】
────────────────────────────
累计减排量：${d.totalCO2e.toFixed(2)} kg CO₂e
减排记录数：${d.recordCount} 次
获得碳积分：${d.carbonPoints} 分

────────────────────────────
【直观对比】
────────────────────────────
🚗 相当于少开车：${d.analogies.carKm} 公里
🌳 相当于种植：${d.analogies.trees} 棵树
💡 相当于节省：${d.analogies.electricityKwh} 度电

────────────────────────────
【分类统计】
────────────────────────────
${categoryStr}

────────────────────────────
【已达成里程碑】
────────────────────────────
${milestoneStr}

────────────────────────────
此证明由「垃圾分类助手」根据用户
减排记录自动生成，计算依据参考
国家发改委《碳排放权交易管理办法》
及《省级温室气体清单编制指南》。

数据仅供个人环保记录参考。
────────────────────────────
`.trim()
  },

  async exportJSON() {
    if (this.data.recordCount === 0) {
      showToast('暂无记录可导出')
      return
    }

    const exportData = {
      certificate: {
        number: this.data.certNumber,
        date: this.data.certDate,
        holder: this.data.userName
      },
      period: this.data.period,
      summary: {
        totalCO2e: this.data.totalCO2e,
        carbonPoints: this.data.carbonPoints,
        recordCount: this.data.recordCount,
        analogies: this.data.analogies
      },
      categorySummary: this.data.categorySummary,
      milestones: this.data.unlockedMilestones.map(m => ({
        id: m.id,
        name: m.name,
        targetCO2e: m.targetCO2e
      })),
      records: this.data.periodRecords.map(r => ({
        date: r.date,
        time: r.time,
        activity: r.activityName,
        quantity: r.quantity,
        unit: r.unit,
        co2e: r.co2e,
        note: r.note || ''
      }))
    }

    try {
      const jsonStr = JSON.stringify(exportData, null, 2)
      const filePath = `${wx.env.USER_DATA_PATH}/carbon-cert-${this.data.certNumber}.json`
      const fs = wx.getFileSystemManager()
      fs.writeFileSync(filePath, jsonStr, 'utf8')

      await wx.showModal({
        title: '导出成功',
        content: 'JSON 数据已保存。请点击「打开文档」后分享或收藏文件。',
        confirmText: '打开文档',
        cancelText: '好的'
      }).then(res => {
        if (res.confirm) {
          wx.openDocument({
            filePath,
            showMenu: true
          })
        }
      })
    } catch (err) {
      showToast('导出失败，请重试')
      console.error('Export JSON failed:', err)
    }
  },

  onShareAppMessage() {
    const d = this.data
    return {
      title: `我已累计减排${d.totalCO2e}kg CO₂，获得${d.carbonPoints}碳积分！`,
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
