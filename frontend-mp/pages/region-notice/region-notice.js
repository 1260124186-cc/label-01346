const app = getApp()
const {
  getCityUpcomingStandards,
  getTrashTypesForCity,
  getCurrentCity,
  getCityInfo
} = require('../../utils/constants')
const { navigateBack, showToast, formatDate } = require('../../utils/util')

Page({
  data: {
    currentCity: 'shanghai',
    currentCityInfo: null,
    upcomingStandards: [],
    hasUpcoming: false,
    cityTrashTypes: []
  },

  onLoad() {
    console.log('[RegionNotice] 页面加载')
    this.loadData()
  },

  onShow() {
    console.log('[RegionNotice] 页面显示')
    this.loadData()
  },

  loadData() {
    const currentCity = app.getCurrentCity()
    const currentCityInfo = app.getCurrentCityInfo()
    const upcomingStandards = app.getCityUpcomingStandards()
    const cityTrashTypes = getTrashTypesForCity(currentCity)
    const hasUpcoming = upcomingStandards && upcomingStandards.length > 0

    const processedStandards = this.processStandards(upcomingStandards, cityTrashTypes)

    this.setData({
      currentCity,
      currentCityInfo,
      upcomingStandards: processedStandards,
      hasUpcoming,
      cityTrashTypes
    })

    wx.setNavigationBarTitle({
      title: `${currentCityInfo.name}新标准预告`
    })
  },

  processStandards(standards, trashTypes) {
    if (!standards || !standards.length) return []
    const typeMap = {}
    trashTypes.forEach(t => {
      typeMap[t.id] = t
    })
    return standards.map(std => {
      const daysLeft = this.getDaysLeft(std.effectiveDate)
      const formattedDate = this.formatDate(std.effectiveDate)
      const affectedTypeInfos = (std.affectedTypes || []).map(typeId => {
        const typeInfo = typeMap[typeId]
        return {
          id: typeId,
          name: typeInfo ? typeInfo.name : '分类' + typeId,
          emoji: typeInfo ? typeInfo.emoji : '📦',
          bgColor: typeInfo ? typeInfo.bgColor : '#E8F5E9',
          color: typeInfo ? typeInfo.color : '#5BBD72'
        }
      })
      return {
        ...std,
        daysLeft,
        formattedDate,
        affectedTypeInfos
      }
    })
  },

  formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  },

  getDaysLeft(effectiveDate) {
    if (!effectiveDate) return 0
    const today = new Date()
    const effective = new Date(effectiveDate)
    const diffTime = effective.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  },

  onTypeTap(e) {
    const { typeId } = e.currentTarget.dataset
    console.log('[RegionNotice] 点击分类类型:', typeId)
    const type = this.data.cityTrashTypes.find(t => t.id === typeId)
    if (type) {
      wx.showModal({
        title: type.name,
        content: type.description || '暂无详细说明',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: type.color || '#5BBD72'
      })
    }
  },

  onRemindMe() {
    console.log('[RegionNotice] 点击提醒我')
    showToast('已开启实施提醒')
  },

  onShareAppMessage() {
    const { currentCityInfo } = this.data
    return {
      title: `${currentCityInfo.name}垃圾分类新标准即将实施`,
      path: '/pages/region-notice/region-notice'
    }
  },

  goBack() {
    navigateBack()
  }
})
