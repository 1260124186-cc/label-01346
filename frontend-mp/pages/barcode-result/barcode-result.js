/**
 * 扫码结果页面
 * @description 展示商品的包装材质、各部件分类、拆解建议
 */

const app = getApp()
const {
  navigateTo,
  navigateBack,
  showToast,
  showSuccess,
  showError
} = require('../../utils/util')
const {
  getBarcodeProductDetail,
  isFavoriteBarcode,
  toggleFavoriteBarcode,
  addScanHistory
} = require('../../data/barcode')

Page({
  data: {
    barcode: '',
    product: null,
    packaging: null,
    isFavorite: false,
    experienceClasses: ''
  },

  onLoad(options) {
    console.log('[BarcodeResult] 页面加载', options)
    this.setData({ experienceClasses: app.getExperienceClasses() })
    
    if (options && options.barcode) {
      this.loadProductDetail(options.barcode)
    }
  },

  onShow() {
    console.log('[BarcodeResult] 页面显示')
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  loadProductDetail(barcode) {
    console.log('[BarcodeResult] 加载商品详情', barcode)
    const detail = getBarcodeProductDetail(barcode)
    
    if (detail) {
      this.setData({
        barcode: barcode,
        product: detail,
        packaging: detail.packaging || null,
        isFavorite: isFavoriteBarcode(barcode)
      })

      addScanHistory({
        barcode: barcode,
        barcodeType: detail.barcodeType,
        productName: detail.productName,
        brand: detail.brand,
        emoji: detail.emoji,
        packagingId: detail.packagingId,
        materials: detail.materials,
        description: detail.description
      })
    } else {
      this.setData({
      barcode: barcode,
        product: null,
        packaging: null,
        isFavorite: false
      })
    }
  },

  onToggleFavorite(e) {
    const { product } = this.data
    if (!product) return

    console.log('[BarcodeResult] 切换收藏状态', product.barcode)

    const isFavorite = toggleFavoriteBarcode({
      barcode: product.barcode,
      barcodeType: product.barcodeType,
      productName: product.productName,
      brand: product.brand,
      emoji: product.emoji,
      packagingId: product.packagingId,
      materials: product.materials,
      description: product.description
    })

    this.setData({ isFavorite })

    if (isFavorite) {
      showSuccess('已加入常购商品')
    } else {
      showToast('已取消收藏')
    }
  },

  goToPackagingWizard() {
    const { product } = this.data
    if (!product || !product.packagingId) return

    console.log('[BarcodeResult] 跳转到拆解向导')
    navigateTo('/pages/packaging-wizard/packaging-wizard', {
      id: product.packagingId
    })
  },

  goToSearch() {
    const { product } = this.data
    const keyword = product ? product.productName : ''
    console.log('[BarcodeResult] 跳转到搜索', keyword)
    navigateTo('/pages/search/search', {
      keyword: encodeURIComponent(keyword)
    })
  },

  goToCorrection() {
    const { product } = this.data
    console.log('[BarcodeResult] 跳转到纠错')
    
    if (!product) {
      showError('商品信息加载失败，请重试')
      return
    }

    const params = encodeURIComponent(JSON.stringify({
      itemId: product.id || 'barcode-' + product.barcode,
      itemName: product.productName,
      itemEmoji: product.emoji,
      originalTypeId: 0,
      originalTypeName: '条码商品纠错',
      barcode: product.barcode
    }))
    navigateTo('/pages/correction-submit/correction-submit', { data: params })
  },

  rescan() {
    console.log('[BarcodeResult] 重新扫码')
    navigateTo('/pages/barcode-scan/barcode-scan')
  },

  goToSubmit() {
    const { barcode } = this.data
    console.log('[BarcodeResult] 跳转到录入页面')
    navigateTo('/pages/barcode-submit/barcode-submit', {
      barcode: barcode
    })
  },

  onThemeChange(isDark) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onFontChange(isLarge) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onShareAppMessage() {
    const { product } = this.data
    return {
      title: (product ? product.productName : '商品') + ' - 垃圾分类百科',
      path: '/pages/barcode-result/barcode-result?barcode=' + (product ? product.barcode : '')
    }
  }
})
