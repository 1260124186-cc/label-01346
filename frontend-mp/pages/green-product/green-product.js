const app = getApp()
const { navigateTo, showToast } = require('../../utils/util')
const {
  getProductById,
  getCertificationById,
  getPlasticReductionLevel,
  getEcoLevelColor
} = require('../../data/green-guide')

Page({
  data: {
    productId: '',
    product: null,
    certDetails: [],
    plasticLevel: null,
    ecoLevelColor: '',
    greenAltProduct: null,
    experienceClasses: ''
  },

  onLoad(options) {
    console.log('[GreenProduct] 页面加载', options)
    this.setData({ experienceClasses: app.getExperienceClasses() })
    if (options && options.productId) {
      this.loadProduct(options.productId)
    }
  },

  onShow() {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  loadProduct(productId) {
    const product = getProductById(productId)
    if (!product) {
      showToast('产品不存在')
      return
    }

    const certDetails = (product.certifications || []).map(cid => getCertificationById(cid)).filter(Boolean)
    const plasticLevel = getPlasticReductionLevel(product.plasticReduction)
    const ecoLevelColor = getEcoLevelColor(product.ecoLevel)

    let greenAltProduct = null
    if (product.greenAlternative) {
      greenAltProduct = getProductById(product.greenAlternative)
    }

    this.setData({
      productId,
      product,
      certDetails,
      plasticLevel,
      ecoLevelColor,
      greenAltProduct
    })
  },

  onGoToGreenAlt() {
    const { greenAltProduct } = this.data
    if (greenAltProduct) {
      this.loadProduct(greenAltProduct.id)
    }
  },

  onGoToCompare() {
    const { product } = this.data
    if (!product) return
    navigateTo('/pages/green-compare/green-compare')
  },

  onShareAppMessage() {
    const { product } = this.data
    return {
      title: `${product.name} - 环保评级${product.ecoLevel}`,
      path: `/pages/green-product/green-product?productId=${product.id}`
    }
  }
})
