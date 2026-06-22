/**
 * 扫码识物页面
 * @description 扫描商品条形码/二维码，获取商品百科信息
 */

const app = getApp()
const {
  navigateTo,
  showToast,
  showModal,
  showError,
  formatDate
} = require('../../utils/util')
const {
  getBarcodeProductDetail,
  getScanHistory,
  addScanHistory,
  clearScanHistory,
  getFavoriteBarcodes,
  isFavoriteBarcode,
  toggleFavoriteBarcode
} = require('../../data/barcode')
const {
  getAllCompositePackaging
} = require('../../data/packaging')

Page({
  data: {
    currentTab: 'scan',
    scanHistory: [],
    favoriteItems: [],
    experienceClasses: ''
  },

  onLoad(options) {
    console.log('[BarcodeScan] 页面加载')
    this.setData({ experienceClasses: app.getExperienceClasses() })
    if (options && options.tab) {
      this.switchTab(options.tab)
    }
  },

  onShow() {
    console.log('[BarcodeScan] 页面显示')
    this.setData({ experienceClasses: app.getExperienceClasses() })
    this.loadScanHistory()
    this.loadFavoriteItems()
  },

  loadScanHistory() {
    const rawHistory = getScanHistory()
    const favorites = getFavoriteBarcodes()
    const favoriteBarcodes = new Set(favorites.map(f => f.barcode))

    const history = rawHistory.map(item => ({
      ...item,
      isFavorite: favoriteBarcodes.has(item.barcode),
      scanTimeLabel: item.scanTime ? formatDate(item.scanTime, 'MM-DD HH:mm') : ''
    }))

    this.setData({ scanHistory: history })
  },

  loadFavoriteItems() {
    const items = getFavoriteBarcodes()
    this.setData({ favoriteItems: items })
  },

  switchToScanTab() {
    this.setData({ currentTab: 'scan' })
  },

  switchToHistoryTab() {
    this.loadScanHistory()
    this.setData({ currentTab: 'history' })
  },

  switchToFavoritesTab() {
    this.loadFavoriteItems()
    this.setData({ currentTab: 'favorites' })
  },

  onStartScan() {
    console.log('[BarcodeScan] 开始扫码')

    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['barCode', 'qrCode'],
      success: (res) => {
        console.log('[BarcodeScan] 扫码成功', res)
        this.handleScanResult(res)
      },
      fail: (err) => {
        console.error('[BarcodeScan] 扫码失败', err)
        if (err.errMsg && err.errMsg.includes('cancel')) {
          console.log('[BarcodeScan] 用户取消扫码')
        } else {
          showError('扫码失败，请重试')
        }
      }
    })
  },

  handleScanResult(scanResult) {
    const { result, scanType, charSet, path } = scanResult
    console.log('[BarcodeScan] 处理扫码结果', { result, scanType })

    const barcodeDetail = getBarcodeProductDetail(result)
    addScanHistory({
      barcode: result,
      barcodeType: scanType,
      productName: barcodeDetail ? barcodeDetail.productName : '',
      brand: barcodeDetail ? barcodeDetail.brand : '',
      emoji: barcodeDetail ? barcodeDetail.emoji : '',
      packagingId: barcodeDetail ? barcodeDetail.packagingId : '',
      materials: barcodeDetail ? barcodeDetail.materials : [],
      description: barcodeDetail ? barcodeDetail.description : ''
    })

    this.loadScanHistory()

    if (barcodeDetail) {
      console.log('[BarcodeScan] 找到商品百科信息')
      this.goToResultPage(result)
    } else {
      console.log('[BarcodeScan] 未知条码，引导录入')
      this.goToSubmitPage(result, scanType)
    }
  },

  goToResultPage(barcode) {
    navigateTo('/pages/barcode-result/barcode-result', {
      barcode: barcode
    })
  },

  goToSubmitPage(barcode, barcodeType) {
    navigateTo('/pages/barcode-submit/barcode-submit', {
      barcode: barcode,
      barcodeType: barcodeType || 'barCode'
    })
  },

  onHistoryItemTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[BarcodeScan] 点击历史记录', item)
    if (item.packagingId || item.productName) {
      this.goToResultPage(item.barcode)
    } else {
      this.goToSubmitPage(item.barcode, item.barcodeType)
    }
  },

  onFavoriteItemTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[BarcodeScan] 点击收藏项', item)
    this.goToResultPage(item.barcode)
  },

  onGoToResult(e) {
    const { item } = e.currentTarget.dataset
    this.goToResultPage(item.barcode)
  },

  onToggleFavorite(e) {
    const { item } = e.currentTarget.dataset
    console.log('[BarcodeScan] 切换收藏状态', item)

    const isFavorite = toggleFavoriteBarcode({
      barcode: item.barcode,
      barcodeType: item.barcodeType,
      productName: item.productName,
      brand: item.brand,
      emoji: item.emoji,
      packagingId: item.packagingId,
      materials: item.materials,
      description: item.description
    })

    if (isFavorite) {
      showToast('已加入常购商品', 'success')
    } else {
      showToast('已取消收藏')
    }

    this.loadScanHistory()
    this.loadFavoriteItems()
  },

  onClearHistory() {
    console.log('[BarcodeScan] 清空扫描历史')
    showModal({
      title: '清空扫描历史',
      content: '确定要清空所有扫描历史吗？',
      confirmText: '清空',
      confirmColor: '#E85D5D'
    }).then(confirmed => {
      if (confirmed) {
        clearScanHistory()
        this.loadScanHistory()
        showToast('已清空扫描历史')
      }
    })
  },

  onGoToSearch() {
    console.log('[BarcodeScan] 跳转到搜索')
    navigateTo('/pages/search/search')
  },

  onGoToPhotoRecognize() {
    console.log('[BarcodeScan] 跳转到拍照识别')
    navigateTo('/pages/photo-recognize/photo-recognize')
  },

  onGoToPackagingList() {
    console.log('[BarcodeScan] 跳转到拆解向导列表')
    const allPackaging = getAllCompositePackaging()
    if (allPackaging && allPackaging.length > 0) {
      navigateTo('/pages/packaging-wizard/packaging-wizard', {
        id: allPackaging[0].id
      })
    } else {
      showToast('暂无拆解向导')
    }
  },

  onThemeChange(isDark) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onFontChange(isLarge) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onShareAppMessage() {
    return {
      title: '扫码识物百科 - 垃圾分类助手',
      path: '/pages/barcode-scan/barcode-scan'
    }
  }
})
