const {
  HOT_SEARCH_WORDS,
  fuzzySearchTrash,
  TRASH_ENCYCLOPEDIA
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

Page({
  data: {
    searchKeyword: '',
    inputFocus: true,
    searchResults: [],
    searchHistory: [],
    hotSearchWords: HOT_SEARCH_WORDS,
    hasSearched: false,
    showDetail: false,
    currentDetail: null
  },

  onLoad(options) {
    console.log('[Search] 页面加载')
    this.loadSearchHistory()

    if (options.keyword) {
      const keyword = decodeURIComponent(options.keyword)
      this.setData({ searchKeyword: keyword })
      this.performSearch(keyword)
    }
  },

  onShow() {
    console.log('[Search] 页面显示')
    this.loadSearchHistory()
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

    const results = fuzzySearchTrash(trimmedKeyword)
    
    this.setData({
      searchResults: results,
      hasSearched: true
    })

    if (results.length > 0) {
      addSearchHistory(trimmedKeyword)
      this.loadSearchHistory()
    }

    console.log('[Search] 搜索结果:', results.length, '条')
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
    
    const fullItem = TRASH_ENCYCLOPEDIA.find(t => t.id === item.id) || item
    
    addSearchHistory(item.name)
    this.loadSearchHistory()
    
    this.setData({
      showDetail: true,
      currentDetail: fullItem
    })
  },

  onCloseDetail() {
    this.setData({
      showDetail: false,
      currentDetail: null
    })
  },

  onRelatedItemTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Search] 点击相关项:', item.name)
    
    const fullItem = TRASH_ENCYCLOPEDIA.find(t => t.id === item.id)
    if (fullItem) {
      this.setData({
        currentDetail: fullItem,
        searchKeyword: fullItem.name
      })
      this.performSearch(fullItem.name)
    }
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

  goBack() {
    console.log('[Search] 返回上一页')
    navigateBack()
  },

  onShareAppMessage() {
    return {
      title: '垃圾百科 - 垃圾分类查询助手',
      path: '/pages/search/search'
    }
  }
})
