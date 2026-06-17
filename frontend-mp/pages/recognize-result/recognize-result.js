/**
 * 识别结果页面
 * @description 展示识别结果、置信度、投放提示、百科链接、确认操作、失败反馈
 */
const app = getApp()
const { 
  navigateTo, 
  navigateBack, 
  showToast, 
  showSuccess, 
  showError,
  showModal,
  switchTab,
  formatDate,
  generateId
} = require('../../utils/util')
const { FEEDBACK_TYPES } = require('../../data/recognize')
const { TRASH_ENCYCLOPEDIA, TRASH_TYPES } = require('../../utils/constants')

Page({
  data: {
    recognizeSuccess: true,
    errorMessage: '',
    capturedImage: '',
    resultData: null,
    confidencePercent: 0,
    confidenceLevel: 'high',
    confidenceText: '',
    relatedItems: [],
    confirmed: false,
    showFeedback: false,
    feedbackTypes: FEEDBACK_TYPES,
    selectedFeedback: '',
    feedbackContent: ''
  },

  onLoad(options) {
    console.log('[RecognizeResult] 页面加载', options)
    
    if (options.data) {
      try {
        const data = JSON.parse(decodeURIComponent(options.data))
        console.log('[RecognizeResult] 解析数据:', data)
        
        if (data.success === false) {
          this.setData({
            recognizeSuccess: false,
            errorMessage: data.error,
            capturedImage: data.imagePath || ''
          })
        } else {
          this.processResultData(data)
        }
      } catch (e) {
        console.error('[RecognizeResult] 数据解析失败', e)
        showError('数据解析失败，请重试')
      }
    }
  },

  processResultData(data) {
    const type = TRASH_TYPES.find(t => t.id === data.typeId)
    const typeColor = type ? type.color : '#5BBD72'
    const typeBgColor = type ? type.bgColor : 'rgba(91, 189, 114, 0.1)'
    
    const confidence = data.confidence || 0
    const confidencePercent = Math.round(confidence * 100)
    
    let confidenceLevel = 'high'
    let confidenceText = '识别结果较为准确，请确认分类'
    
    if (confidence < 0.7) {
      confidenceLevel = 'low'
      confidenceText = '识别置信度较低，建议手动搜索确认'
    } else if (confidence < 0.85) {
      confidenceLevel = 'medium'
      confidenceText = '识别结果仅供参考，请仔细确认'
    }
    
    const relatedItems = this.getRelatedItems(data.name, data.typeId)
    
    this.setData({
      recognizeSuccess: true,
      resultData: {
        ...data,
        typeColor,
        typeBgColor
      },
      confidencePercent,
      confidenceLevel,
      confidenceText,
      relatedItems,
      capturedImage: data.imagePath || ''
    })
  },

  getRelatedItems(name, typeId) {
    try {
      const allItems = TRASH_ENCYCLOPEDIA.filter(item =>
        item.typeId === typeId && item.name !== name
      )
      
      const shuffled = allItems.sort(() => Math.random() - 0.5)
      return shuffled.slice(0, 4).map(item => ({
        id: item.id,
        name: item.name,
        typeId: item.typeId,
        typeName: item.typeName,
        emoji: item.emoji
      }))
    } catch (e) {
      console.error('[RecognizeResult] 获取相关推荐失败', e)
      return []
    }
  },

  confirmCorrect() {
    console.log('[RecognizeResult] 用户确认分类正确')
    
    const { resultData } = this.data
    if (!resultData) return

    showModal({
      title: '确认分类',
      content: `确认"${resultData.name}"属于${resultData.typeName}吗？确认后将获得10积分。`,
      confirmText: '确认',
      confirmColor: '#5BBD72'
    }).then((confirmed) => {
      if (confirmed) {
        this.doConfirm()
      }
    })
  },

  doConfirm() {
    const { resultData } = this.data
    const now = new Date()
    const timeStr = formatDate(now, 'YYYY-MM-DD HH:mm')
    
    const classifyRecord = {
      id: generateId(),
      trashName: resultData.name,
      typeId: resultData.typeId,
      typeName: resultData.typeName,
      emoji: resultData.emoji,
      bgColor: resultData.typeBgColor,
      points: 10,
      time: timeStr,
      source: 'photo',
      confidence: resultData.confidence
    }
    
    app.addClassifyRecord(classifyRecord)
    console.log('[RecognizeResult] 分类记录已添加', classifyRecord)
    
    app.updateUserPoints(10, {
      category: 'classify',
      title: '拍照识别',
      desc: `正确识别${resultData.name}`,
      emoji: resultData.emoji
    })
    console.log('[RecognizeResult] 积分已更新')
    
    this.setData({
      confirmed: true
    })
    
    showSuccess('分类成功 +10积分')
  },

  showFeedbackOptions() {
    console.log('[RecognizeResult] 显示反馈选项')
    this.setData({
      showFeedback: true,
      selectedFeedback: '',
      feedbackContent: ''
    })
  },

  hideFeedback() {
    console.log('[RecognizeResult] 隐藏反馈选项')
    this.setData({
      showFeedback: false
    })
  },

  selectFeedback(e) {
    const { id } = e.currentTarget.dataset
    console.log('[RecognizeResult] 选择反馈类型:', id)
    this.setData({
      selectedFeedback: id
    })
  },

  onFeedbackInput(e) {
    this.setData({
      feedbackContent: e.detail.value
    })
  },

  submitFeedback() {
    const { selectedFeedback, feedbackContent, resultData } = this.data
    
    if (!selectedFeedback) {
      showToast('请选择反馈类型')
      return
    }
    
    const feedbackType = FEEDBACK_TYPES.find(t => t.id === selectedFeedback)
    console.log('[RecognizeResult] 提交反馈:', {
      type: selectedFeedback,
      typeName: feedbackType?.name,
      content: feedbackContent,
      trashName: resultData?.name
    })
    
    const feedbackRecords = wx.getStorageSync('feedbackRecords') || []
    feedbackRecords.unshift({
      id: generateId(),
      type: selectedFeedback,
      typeName: feedbackType?.name,
      content: feedbackContent,
      trashName: resultData?.name,
      imagePath: this.data.capturedImage,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      source: 'recognize'
    })
    wx.setStorageSync('feedbackRecords', feedbackRecords)
    
    showSuccess('反馈提交成功，感谢您的帮助！')
    
    this.setData({
      showFeedback: false,
      selectedFeedback: '',
      feedbackContent: ''
    })
    
    setTimeout(() => {
      this.goToSearch()
    }, 1500)
  },

  goToSearch() {
    console.log('[RecognizeResult] 跳转到搜索页')
    navigateTo('/pages/search/search')
  },

  retakePhoto() {
    console.log('[RecognizeResult] 重新拍摄')
    navigateTo('/pages/photo-recognize/photo-recognize')
  },

  onRelatedItemTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[RecognizeResult] 点击相关推荐:', item.name)
    
    const fullItem = TRASH_ENCYCLOPEDIA.find(t => t.id === item.id)
    if (fullItem) {
      const resultData = encodeURIComponent(JSON.stringify({
        ...fullItem,
        imagePath: this.data.capturedImage
      }))
      navigateTo('/pages/recognize-result/recognize-result', {
        data: resultData
      })
    }
  },

  openWiki() {
    const { resultData } = this.data
    if (!resultData || !resultData.wikiUrl) return
    
    console.log('[RecognizeResult] 打开百科链接:', resultData.wikiUrl)
    
    wx.setClipboardData({
      data: resultData.wikiUrl,
      success: () => {
        showToast('链接已复制，请在浏览器中打开')
      }
    })
  },

  goToRecords() {
    console.log('[RecognizeResult] 跳转到分类记录')
    navigateTo('/pages/records/records')
  },

  continueRecognize() {
    console.log('[RecognizeResult] 继续识别')
    navigateTo('/pages/photo-recognize/photo-recognize')
  },

  onShareAppMessage() {
    return {
      title: '拍照识垃圾 - 智能垃圾分类助手',
      path: '/pages/index/index'
    }
  }
})
