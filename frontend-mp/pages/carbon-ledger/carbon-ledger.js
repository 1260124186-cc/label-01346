const app = getApp()
const {
  calculateAnalogies,
  summarizeByCategory,
  summarizeByDateRange,
  getNextMilestone,
  getCityAverage,
  getGroupAverage,
  CARBON_CATEGORIES
} = require('../../utils/carbon')
const { showToast, navigateTo, formatNumber } = require('../../utils/util')

Page({
  data: {
    totalCO2e: 0,
    carbonPoints: 0,
    analogies: {},
    chartType: 'week',
    chartData: [],
    maxChartValue: 0,
    categorySummary: {},
    categoryList: [],
    nextMilestone: null,
    cityAvg: null,
    groupAvg: null,
    userWeekly: 0,
    userMonthly: 0,
    cityName: '',
    recentRecords: [],
    experienceClasses: ''
  },

  onLoad() {
    this.loadAllData()
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onShow() {
    this.loadAllData()
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onPullDownRefresh() {
    this.loadAllData()
    wx.stopPullDownRefresh()
  },

  loadAllData() {
    const records = app.getCarbonRecords()
    const totalCO2e = app.getTotalCarbon()
    const carbonPoints = app.getCarbonPoints()
    const analogies = calculateAnalogies(totalCO2e)

    const { chartData, maxChartValue } = this.getChartData(records, this.data.chartType)
    const categorySummary = summarizeByCategory(records)
    const categoryList = CARBON_CATEGORIES.map(cat => {
      const sum = categorySummary[cat.id] || { co2e: 0, count: 0 }
      return {
        ...cat,
        co2e: sum.co2e || 0,
        count: sum.count || 0,
        percentage: totalCO2e > 0 ? Number((((sum.co2e || 0) / totalCO2e) * 100).toFixed(1)) : 0
      }
    }).sort((a, b) => b.co2e - a.co2e)

    const nextMilestone = getNextMilestone(totalCO2e)

    const currentCity = app.getCurrentCity()
    const cityInfo = app.getCurrentCityInfo() || {}
    const cityAvg = getCityAverage(currentCity)
    const groupAvg = getGroupAverage()

    const weeklyRecords = summarizeByDateRange(records, 'week')
    const monthlyRecords = summarizeByDateRange(records, 'month')
    const userWeekly = Number(weeklyRecords.reduce((s, d) => s + d.co2e, 0).toFixed(2))
    const userMonthly = Number(monthlyRecords.reduce((s, d) => s + d.co2e, 0).toFixed(2))

    const recentRecords = records.slice(0, 5)

    this.setData({
      totalCO2e,
      carbonPoints,
      analogies,
      chartData,
      maxChartValue,
      categorySummary,
      categoryList,
      nextMilestone,
      cityAvg,
      groupAvg,
      userWeekly,
      userMonthly,
      cityName: cityInfo.name || '本地',
      recentRecords
    })
  },

  getChartData(records, type) {
    const chartData = summarizeByDateRange(records, type)
    const maxChartValue = Math.max(...chartData.map(d => d.co2e), 1)
    return { chartData, maxChartValue }
  },

  switchChartType(e) {
    const type = e.currentTarget.dataset.type
    if (type === this.data.chartType) return
    const records = app.getCarbonRecords()
    const { chartData, maxChartValue } = this.getChartData(records, type)
    this.setData({ chartType: type, chartData, maxChartValue })
  },

  goToRecord() {
    navigateTo('/pages/carbon-record/carbon-record')
  },

  goToMilestone() {
    navigateTo('/pages/carbon-milestone/carbon-milestone')
  },

  goToCertificate() {
    navigateTo('/pages/carbon-certificate/carbon-certificate')
  },

  goToRecordList() {
    navigateTo('/pages/carbon-record/carbon-record?tab=records')
  },

  onRecordTap(e) {
    const { item } = e.currentTarget.dataset
    showToast(`${item.activityName} +${item.co2e}kg CO₂e`)
  },

  onShareAppMessage() {
    const totalCO2e = this.data.totalCO2e
    return {
      title: `我已累计减排 ${totalCO2e}kg CO₂，一起来守护地球吧！`,
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
