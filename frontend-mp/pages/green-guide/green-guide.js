/**
 * 绿色消费指南 - 主页面
 * @description 按品类展示环保选购建议、产品评级、对比入口、投票入口
 */

const app = getApp()
const {
  navigateTo,
  showToast
} = require('../../utils/util')
const {
  GREEN_CATEGORIES,
  getProductsByCategory,
  getProductById,
  getCertificationById,
  getPlasticReductionLevel,
  getEcoLevelColor,
  getComparisonsByCategory,
  searchEcoProducts
} = require('../../data/green-guide')

Page({
  data: {
    categories: [],
    activeCategoryId: 'all',
    productList: [],
    comparisonList: [],
    searchText: '',
    showSearch: false,
    searchResults: [],
    disclaimerVisible: false,
    experienceClasses: ''
  },

  onLoad() {
    console.log('[GreenGuide] 页面加载')
    this.setData({ experienceClasses: app.getExperienceClasses() })
    this.initCategories()
    this.loadProductList()
    this.loadComparisonList()
  },

  onShow() {
    console.log('[GreenGuide] 页面显示')
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  initCategories() {
    const categories = [
      { id: 'all', name: '全部', icon: '🌍', color: '#5BBD72', desc: '全部品类环保建议' },
      ...GREEN_CATEGORIES
    ]
    this.setData({ categories })
  },

  loadProductList() {
    const { activeCategoryId } = this.data
    let products = activeCategoryId === 'all'
      ? require('../../data/green-guide').ECO_PRODUCTS
      : getProductsByCategory(activeCategoryId)

    const productList = products.map(p => {
      const certDetails = (p.certifications || []).map(cid => getCertificationById(cid)).filter(Boolean)
      const plasticLevel = getPlasticReductionLevel(p.plasticReduction)
      return {
        ...p,
        ecoLevelColor: getEcoLevelColor(p.ecoLevel),
        certDetails,
        plasticLevelName: plasticLevel.name,
        plasticLevelIcon: plasticLevel.icon,
        plasticLevelColor: plasticLevel.color,
        scorePercent: p.ecoScore
      }
    })

    this.setData({ productList })
  },

  loadComparisonList() {
    const { activeCategoryId } = this.data
    let comparisons = activeCategoryId === 'all'
      ? require('../../data/green-guide').PRODUCT_COMPARISONS
      : getComparisonsByCategory(activeCategoryId)
    this.setData({ comparisonList: comparisons })
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    console.log('[GreenGuide] 切换分类', id)
    this.setData({ activeCategoryId: id }, () => {
      this.loadProductList()
      this.loadComparisonList()
    })
  },

  onProductTap(e) {
    const { id } = e.currentTarget.dataset
    console.log('[GreenGuide] 点击产品', id)
    navigateTo('/pages/green-product/green-product', { productId: id })
  },

  onComparisonTap(e) {
    const { id } = e.currentTarget.dataset
    console.log('[GreenGuide] 点击对比', id)
    navigateTo('/pages/green-compare/green-compare', { comparisonId: id })
  },

  onGoToVote() {
    console.log('[GreenGuide] 跳转到投票页')
    navigateTo('/pages/green-vote/green-vote')
  },

  onGoToCourse() {
    console.log('[GreenGuide] 跳转到课程中心')
    navigateTo('/pages/learning-center/learning-center')
  },

  onShowSearch() {
    this.setData({ showSearch: true })
  },

  onHideSearch() {
    this.setData({ showSearch: false, searchText: '', searchResults: [] })
  },

  onSearchInput(e) {
    const searchText = e.detail.value
    this.setData({ searchText })
    if (searchText.length > 0) {
      const results = searchEcoProducts(searchText).map(p => ({
        ...p,
        ecoLevelColor: getEcoLevelColor(p.ecoLevel)
      }))
      this.setData({ searchResults: results })
    } else {
      this.setData({ searchResults: [] })
    }
  },

  onSearchProductTap(e) {
    const { id } = e.currentTarget.dataset
    this.onHideSearch()
    navigateTo('/pages/green-product/green-product', { productId: id })
  },

  onShowDisclaimer() {
    this.setData({ disclaimerVisible: true })
  },

  onCloseDisclaimer() {
    this.setData({ disclaimerVisible: false })
  },

  onThemeChange() {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onFontChange() {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onShareAppMessage() {
    return {
      title: '绿色消费指南 - 环保产品评级',
      path: '/pages/green-guide/green-guide'
    }
  }
})
