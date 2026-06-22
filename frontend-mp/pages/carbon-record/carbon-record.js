const app = getApp()
const {
  CARBON_CATEGORIES,
  CARBON_FACTORS,
  calculateCO2e
} = require('../../utils/carbon')
const { showToast, showSuccess, showModal, navigateTo, formatNumber } = require('../../utils/util')

Page({
  data: {
    currentTab: 'record',
    categories: [],
    selectedCategoryId: 'classify',
    activities: [],
    selectedActivityId: '',
    selectedActivity: null,
    quantity: '',
    note: '',
    previewCO2e: 0,
    allRecords: [],
    displayRecords: [],
    filterCategoryId: 'all',
    experienceClasses: ''
  },

  onLoad(options) {
    const categories = CARBON_CATEGORIES.map(cat => ({
      ...cat,
      activities: cat.items.map(id => ({
        id,
        ...CARBON_FACTORS[id]
      }))
    }))

    this.setData({
      categories,
      activities: categories[0].activities,
      selectedActivityId: categories[0].activities[0].id,
      selectedActivity: categories[0].activities[0],
      experienceClasses: app.getExperienceClasses()
    })

    if (options && options.tab) {
      this.setData({ currentTab: options.tab })
    }
  },

  onShow() {
    this.loadRecords()
    this.updatePreview()
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  loadRecords() {
    const allRecords = app.getCarbonRecords()
    let displayRecords = allRecords
    if (this.data.filterCategoryId !== 'all') {
      const cat = CARBON_CATEGORIES.find(c => c.id === this.data.filterCategoryId)
      if (cat) {
        displayRecords = allRecords.filter(r => cat.items.includes(r.activityId))
      }
    }
    this.setData({ allRecords, displayRecords })
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab })
    if (tab === 'records') {
      this.loadRecords()
    }
  },

  selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id
    const category = this.data.categories.find(c => c.id === categoryId)
    this.setData({
      selectedCategoryId: categoryId,
      activities: category.activities,
      selectedActivityId: category.activities[0].id,
      selectedActivity: category.activities[0]
    })
    this.updatePreview()
  },

  selectActivity(e) {
    const activityId = e.currentTarget.dataset.id
    const activity = CARBON_FACTORS[activityId]
    this.setData({
      selectedActivityId: activityId,
      selectedActivity: activity
    })
    this.updatePreview()
  },

  onQuantityInput(e) {
    const value = e.detail.value
    this.setData({ quantity: value })
    this.updatePreview()
  },

  onNoteInput(e) {
    this.setData({ note: e.detail.value })
  },

  updatePreview() {
    const quantity = parseFloat(this.data.quantity) || 0
    const co2e = calculateCO2e(this.data.selectedActivityId, quantity)
    this.setData({ previewCO2e: co2e })
  },

  adjustQuantity(e) {
    const delta = parseFloat(e.currentTarget.dataset.delta)
    const current = parseFloat(this.data.quantity) || 0
    const newValue = Math.max(0, Number((current + delta).toFixed(2)))
    this.setData({ quantity: newValue.toString() })
    this.updatePreview()
  },

  quickSetQuantity(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ quantity: value.toString() })
    this.updatePreview()
  },

  submitRecord() {
    const quantity = parseFloat(this.data.quantity)
    if (!quantity || quantity <= 0) {
      showToast('请输入有效数量')
      return
    }
    if (!this.data.selectedActivityId) {
      showToast('请选择活动类型')
      return
    }

    const record = app.addCarbonRecord({
      activityId: this.data.selectedActivityId,
      quantity,
      note: this.data.note,
      source: 'manual'
    })

    showSuccess(`记录成功 +${record.co2e}kg CO₂e`)
    this.setData({ quantity: '', note: '' })
    this.updatePreview()

    setTimeout(() => {
      wx.navigateBack()
    }, 800)
  },

  filterRecords(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({ filterCategoryId: categoryId })
    this.loadRecords()
  },

  async deleteRecord(e) {
    const { id } = e.currentTarget.dataset
    const confirmed = await showModal({
      title: '删除记录',
      content: '确定要删除这条减排记录吗？',
      confirmColor: '#E85D5D'
    })
    if (confirmed) {
      app.deleteCarbonRecord(id)
      showToast('已删除')
      this.loadRecords()
    }
  },

  onRecordLongPress(e) {
    const { id } = e.currentTarget.dataset
    wx.showActionSheet({
      itemList: ['删除记录'],
      itemColor: '#E85D5D',
      success: (res) => {
        if (res.tapIndex === 0) {
          this.deleteRecord(e)
        }
      }
    })
  },

  onThemeChange(isDark) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onFontChange(isLarge) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  }
})
