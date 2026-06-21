const app = getApp()
const { CORRECTION_REASONS, getCorrectionCategoryOptions, CORRECTION_POINTS_REWARD } = require('../../data/correction')
const { correctionManager } = require('../../utils/correction')
const { showToast, showModal, navigateBack } = require('../../utils/util')

Page({
  data: {
    itemData: {},
    reasons: CORRECTION_REASONS,
    categoryOptions: [],
    selectedReason: '',
    selectedCategoryId: 0,
    description: '',
    images: [],
    pointsReward: CORRECTION_POINTS_REWARD,
    canSubmit: false,
    showCategorySelect: false
  },

  onLoad(options) {
    const categoryOptions = getCorrectionCategoryOptions()
    let itemData = {}

    if (options.data) {
      try {
        itemData = JSON.parse(decodeURIComponent(options.data))
      } catch (e) {
        console.error('[CorrectionSubmit] 解析参数失败', e)
      }
    }

    this.setData({
      itemData,
      categoryOptions
    })

    wx.setNavigationBarTitle({ title: '纠错 - ' + (itemData.itemName || '百科条目') })
  },

  onReasonTap(e) {
    const { id } = e.currentTarget.dataset
    const showCategorySelect = (id === 'wrong_category' || id === 'missing_item')
    this.setData({
      selectedReason: id,
      showCategorySelect,
      selectedCategoryId: showCategorySelect ? 0 : this.data.itemData.originalTypeId
    })
    this.checkCanSubmit()
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ selectedCategoryId: id })
    this.checkCanSubmit()
  },

  onDescriptionInput(e) {
    this.setData({ description: e.detail.value })
    this.checkCanSubmit()
  },

  onChooseImage() {
    const remaining = 3 - this.data.images.length
    wx.chooseImage({
      count: remaining,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = [...this.data.images, ...res.tempFilePaths]
        this.setData({ images: newImages })
      }
    })
  },

  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },

  checkCanSubmit() {
    const { selectedReason, description, showCategorySelect, selectedCategoryId, itemData } = this.data
    let valid = false
    if (selectedReason && description.trim().length >= 5) {
      if (showCategorySelect) {
        valid = selectedCategoryId > 0 && selectedCategoryId !== itemData.originalTypeId
      } else {
        valid = true
      }
    }
    this.setData({ canSubmit: valid })
  },

  onSubmit() {
    if (!this.data.canSubmit) return

    const { itemData, selectedReason, selectedCategoryId, description, images, categoryOptions, reasons } = this.data
    const reasonObj = reasons.find(r => r.id === selectedReason)
    const categoryObj = categoryOptions.find(c => c.id === selectedCategoryId)

    showModal({
      title: '确认提交',
      content: `确认纠错"${itemData.itemName}"的分类信息？提交后进入审核池，采纳后奖励${CORRECTION_POINTS_REWARD}积分。`,
      confirmText: '确认提交',
      confirmColor: '#5BBD72'
    }).then(confirmed => {
      if (!confirmed) return

      const userInfo = app.globalData.userInfo || {}
      const result = correctionManager.submitCorrection({
        itemId: itemData.itemId,
        itemName: itemData.itemName,
        itemEmoji: itemData.itemEmoji,
        originalTypeId: itemData.originalTypeId,
        originalTypeName: itemData.originalTypeName,
        reason: selectedReason,
        reasonName: reasonObj ? reasonObj.name : '',
        correctTypeId: selectedCategoryId,
        correctTypeName: categoryObj ? categoryObj.name : '',
        description: description.trim(),
        images,
        submitterId: 'current_user',
        submitterName: userInfo.nickName || '环保达人'
      })

      if (result) {
        showToast('纠错已提交，感谢您的贡献！', 'success')
        setTimeout(() => {
          navigateBack()
        }, 1500)
      }
    })
  }
})
