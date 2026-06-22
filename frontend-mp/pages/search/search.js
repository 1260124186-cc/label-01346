const app = getApp()
const {
  HOT_SEARCH_WORDS,
  fuzzySearchTrashForCity,
  getTrashEncyclopediaForCity,
  getTypeNameForCity,
  getCurrentCity
} = require('../../utils/constants')
const {
  navigateTo,
  navigateBack,
  showToast,
  showModal,
  getSearchHistory,
  addSearchHistory,
  removeSearchHistoryItem,
  clearSearchHistory,
  debounce
} = require('../../utils/util')
const {
  searchCompositePackaging,
  getCompositePackagingById
} = require('../../data/packaging')
const { searchBarcodeDb, getBarcodeProductDetail } = require('../../data/barcode')
const { correctionManager } = require('../../utils/correction')

Page({
  data: {
    searchKeyword: '',
    inputFocus: true,
    searchResults: [],
    searchHistory: [],
    hotSearchWords: HOT_SEARCH_WORDS,
    hasSearched: false,
    showDetail: false,
    currentDetail: null,
    currentPackaging: null,
    currentCity: 'shanghai',
    currentCityInfo: null,
    experienceClasses: ''
  },

  onLoad(options) {
    console.log('[Search] 页面加载')
    const currentCity = app.getCurrentCity()
    const currentCityInfo = app.getCurrentCityInfo()
    this.setData({ currentCity, currentCityInfo })
    this.loadSearchHistory()
    this.loadMergedHotWords()
    this.setData({ experienceClasses: app.getExperienceClasses() })

    if (options.keyword) {
      const keyword = decodeURIComponent(options.keyword)
      this.setData({ searchKeyword: keyword })
      this.performSearch(keyword)
    }
  },

  onShow() {
    console.log('[Search] 页面显示')
    const currentCity = app.getCurrentCity()
    const currentCityInfo = app.getCurrentCityInfo()
    this.setData({ currentCity, currentCityInfo })
    this.loadSearchHistory()
    this.setData({ experienceClasses: app.getExperienceClasses() })

    if (app.globalData.hotWordsNeedsRefresh) {
      app.globalData.hotWordsNeedsRefresh = false
      this.loadMergedHotWords()
    }

    if (app.globalData.encyclopediaNeedsRefresh) {
      app.globalData.encyclopediaNeedsRefresh = false
      const { searchKeyword } = this.data
      if (searchKeyword && searchKeyword.trim()) {
        this.performSearch(searchKeyword)
      }
    }
  },

  loadSearchHistory() {
    const history = getSearchHistory()
    this.setData({ searchHistory: history })
  },

  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })

    if (keyword.trim()) {
      this.debouncedSearch(keyword)
    } else {
      this.setData({ searchResults: [], hasSearched: false })
    }
  },

  debouncedSearch: debounce(function(keyword) {
    this.performSearch(keyword)
  }, 300),

  onSearchConfirm(e) {
    const keyword = e.detail.value
    if (keyword.trim()) {
      this.performSearch(keyword)
    }
  },

  performSearch(keyword) {
    console.log('[Search] 执行搜索:', keyword)
    
    const trimmedKeyword = keyword.trim()
    if (!trimmedKeyword) {
      this.setData({ searchResults: [], hasSearched: false })
      return
    }

    const currentCity = this.data.currentCity
    const trashResults = fuzzySearchTrashForCity(trimmedKeyword, currentCity)
    const barcodeResults = searchBarcodeDb(trimmedKeyword)
    
    const mergedBarcodeResults = barcodeResults.map(b => ({
      id: 'barcode-' + b.barcode,
      name: b.productName,
      emoji: b.emoji || '📦',
      typeId: 0,
      typeName: '扫码商品',
      typeColor: '#5BBD72',
      typeBgColor: 'rgba(91, 189, 114, 0.1)',
      description: b.description || b.materials ? '包装材质：' + b.materials.join('、') : '',
      disposalTips: b.description ? [b.description] : [],
      isBarcode: true,
      barcode: b.barcode,
      packagingId: b.packagingId
    }))

    const allResults = [...mergedBarcodeResults, ...trashResults]
    
    this.setData({
      searchResults: allResults,
      hasSearched: true
    })

    if (allResults.length > 0) {
      addSearchHistory(trimmedKeyword)
      this.loadSearchHistory()
    }

    console.log('[Search] 搜索结果:', allResults.length, '条（条码商品', mergedBarcodeResults.length, '+ 垃圾百科', trashResults.length, '），城市:', currentCity)
  },

  onClearInput() {
    this.setData({
      searchKeyword: '',
      searchResults: [],
      hasSearched: false,
      inputFocus: true
    })
  },

  onResultTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Search] 点击搜索结果:', item.name)
    
    if (item.isBarcode && item.barcode) {
      console.log('[Search] 条码商品，跳转到条码结果页')
      navigateTo('/pages/barcode-result/barcode-result', {
        barcode: item.barcode
      })
      return
    }
    
    const currentCity = this.data.currentCity
    const encyclopedia = getTrashEncyclopediaForCity(currentCity)
    const fullItem = encyclopedia.find(t => t.id === item.id) || item
    
    addSearchHistory(item.name)
    this.loadSearchHistory()

    const packagingResults = searchCompositePackaging(item.name)
    const matchedPackaging = packagingResults.length > 0 ? packagingResults[0] : null
    
    this.setData({
      showDetail: true,
      currentDetail: fullItem,
      currentPackaging: matchedPackaging
    })
  },

  onCloseDetail() {
    this.setData({
      showDetail: false,
      currentDetail: null,
      currentPackaging: null
    })
  },

  onRelatedItemTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Search] 点击相关项:', item.name)
    
    const currentCity = this.data.currentCity
    const encyclopedia = getTrashEncyclopediaForCity(currentCity)
    const fullItem = encyclopedia.find(t => t.id === item.id)
    if (fullItem) {
      const packagingResults = searchCompositePackaging(fullItem.name)
      const matchedPackaging = packagingResults.length > 0 ? packagingResults[0] : null

      this.setData({
        currentDetail: fullItem,
        currentPackaging: matchedPackaging,
        searchKeyword: fullItem.name
      })
      this.performSearch(fullItem.name)
    }
  },

  goToPackagingWizard(e) {
    const { pkg } = e.currentTarget.dataset
    if (!pkg) return
    console.log('[Search] 跳转到拆解向导:', pkg.name)
    this.onCloseDetail()
    navigateTo('/pages/packaging-wizard/packaging-wizard', {
      id: pkg.id
    })
  },

  goToClassify() {
    const { currentDetail } = this.data
    if (!currentDetail) return

    console.log('[Search] 跳转到分类详情:', currentDetail.typeName)
    this.onCloseDetail()
    
    navigateTo('/pages/classify/classify', {
      id: currentDetail.typeId,
      name: currentDetail.typeName
    })
  },

  onHistoryTap(e) {
    const { keyword } = e.currentTarget.dataset
    console.log('[Search] 点击历史记录:', keyword)
    
    this.setData({
      searchKeyword: keyword,
      inputFocus: false
    })
    
    this.performSearch(keyword)
  },

  onDeleteHistory(e) {
    const { keyword } = e.currentTarget.dataset
    console.log('[Search] 删除历史记录:', keyword)
    
    removeSearchHistoryItem(keyword)
    this.loadSearchHistory()
  },

  onClearHistory() {
    console.log('[Search] 清空历史记录')
    
    showModal({
      title: '清空搜索历史',
      content: '确定要清空所有搜索历史吗？',
      confirmText: '清空',
      confirmColor: '#E85D5D'
    }).then(confirmed => {
      if (confirmed) {
        clearSearchHistory()
        this.loadSearchHistory()
        showToast('已清空搜索历史')
      }
    })
  },

  onHotWordTap(e) {
    const { word } = e.currentTarget.dataset
    console.log('[Search] 点击热门搜索:', word.name)
    
    this.setData({
      searchKeyword: word.name,
      inputFocus: false
    })
    
    this.performSearch(word.name)
  },

  onFeedback() {
    const { searchKeyword } = this.data
    console.log('[Search] 反馈垃圾:', searchKeyword)

    showModal({
      title: '感谢反馈',
      content: `您反馈的"${searchKeyword}"我们已记录，将尽快完善数据库。`,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#5BBD72'
    }).then(() => {
      showToast('反馈成功，感谢您的帮助！', 'success')
    })
  },

  loadMergedHotWords() {
    const merged = correctionManager.getMergedHotSearchWords(HOT_SEARCH_WORDS)
    this.setData({ hotSearchWords: merged })
  },

  onCorrectionTap() {
    const { currentDetail } = this.data
    if (!currentDetail) return
    console.log('[Search] 点击纠错:', currentDetail.name)
    this.onCloseDetail()

    this.navigateToCorrection(currentDetail)
  },

  onListCorrectionTap(e) {
    const { item } = e.currentTarget.dataset
    if (!item) return
    console.log('[Search] 列表点击纠错:', item.name)

    const currentCity = this.data.currentCity
    const encyclopedia = getTrashEncyclopediaForCity(currentCity)
    const fullItem = encyclopedia.find(t => t.id === item.id) || item

    this.navigateToCorrection(fullItem)
  },

  navigateToCorrection(item) {
    const params = encodeURIComponent(JSON.stringify({
      itemId: item.id,
      itemName: item.name,
      itemEmoji: item.emoji,
      originalTypeId: item.typeId,
      originalTypeName: item.typeName
    }))
    navigateTo('/pages/correction-submit/correction-submit', { data: params })
  },

  goBack() {
    console.log('[Search] 返回上一页')
    navigateBack()
  },

  onThemeChange(isDark) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onFontChange(isLarge) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onShareAppMessage() {
    return {
      title: '垃圾百科 - 垃圾分类查询助手',
      path: '/pages/search/search'
    }
  },

  goToBarcodeScan() {
    console.log('[Search] 跳转到扫码识物')
    navigateTo('/pages/barcode-scan/barcode-scan')
  }
})
