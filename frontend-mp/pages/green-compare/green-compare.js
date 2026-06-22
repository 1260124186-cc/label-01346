const app = getApp()
const { navigateTo, showToast } = require('../../utils/util')
const {
  PRODUCT_COMPARISONS,
  getComparisonById,
  getEcoLevelColor
} = require('../../data/green-guide')

Page({
  data: {
    comparisonId: '',
    comparison: null,
    allComparisons: [],
    showAllList: false,
    activeMetric: 'decomposeYears',
    metrics: [
      { key: 'decomposeYears', name: '降解时间', icon: '⏳' },
      { key: 'co2PerUnit', name: '碳排放', icon: '🏭' },
      { key: 'oceanImpact', name: '海洋影响', icon: '🌊' },
      { key: 'recycleRate', name: '回收率', icon: '♻️' },
      { key: 'microplasticRisk', name: '微塑料', icon: '🔬' },
      { key: 'resourceUse', name: '原料来源', icon: '🪵' }
    ],
    experienceClasses: ''
  },

  onLoad(options) {
    console.log('[GreenCompare] 页面加载', options)
    this.setData({ experienceClasses: app.getExperienceClasses() })

    if (options && options.comparisonId) {
      this.loadComparison(options.comparisonId)
    } else {
      this.setData({ showAllList: true, allComparisons: PRODUCT_COMPARISONS })
    }
  },

  onShow() {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  loadComparison(comparisonId) {
    const comparison = getComparisonById(comparisonId)
    if (comparison) {
      this.setData({
        comparisonId,
        comparison,
        showAllList: false
      })
    } else {
      this.setData({ showAllList: true, allComparisons: PRODUCT_COMPARISONS })
    }
  },

  onMetricTap(e) {
    const { key } = e.currentTarget.dataset
    this.setData({ activeMetric: key })
  },

  onAllComparisonTap(e) {
    const { id } = e.currentTarget.dataset
    this.loadComparison(id)
  },

  onGoBack() {
    this.setData({ showAllList: true, comparison: null })
  },

  onGoToGuide() {
    navigateTo('/pages/green-guide/green-guide')
  },

  onShareAppMessage() {
    return {
      title: '环境影响对比 - 绿色消费指南',
      path: '/pages/green-compare/green-compare'
    }
  }
})
