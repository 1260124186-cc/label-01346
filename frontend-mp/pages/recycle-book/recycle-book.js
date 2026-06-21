const app = getApp()
const { RECYCLE_CATEGORIES, RECYCLE_TIME_PERIODS, RECYCLE_TIME_SLOTS, RECYCLE_PHOTO_CONFIG, RECYCLE_DISPATCH_MODE, RECYCLE_DISPATCH_CONFIG } = require('../../utils/constants')
const { showToast, showSuccess, navigateTo, formatDate, showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    categories: RECYCLE_CATEGORIES,
    timePeriods: RECYCLE_TIME_PERIODS,
    allTimeSlots: RECYCLE_TIME_SLOTS,
    photoConfig: RECYCLE_PHOTO_CONFIG,
    selectedCategoryId: '',
    selectedCategory: null,
    quantity: 1,
    minQuantity: 1,
    maxQuantity: 99,
    appointmentDate: '',
    minDate: '',
    selectedPeriodId: '',
    selectedPeriodName: '',
    selectedTimeSlotId: '',
    selectedTimeSlotName: '',
    timeSlots: [],
    address: '',
    contactName: '',
    contactPhone: '',
    remark: '',
    photos: [],
    maxPhotos: RECYCLE_PHOTO_CONFIG.maxPhotos,
    estimatedPoints: 0,
    estimatedPointsBreakdown: [],
    submitting: false,
    requirePhoto: false,
    dispatchModes: Object.values(RECYCLE_DISPATCH_MODE),
    selectedDispatchMode: RECYCLE_DISPATCH_CONFIG.defaultMode
  },

  onLoad() {
    console.log('[RecycleBook] 页面加载')
    this.initDefaultData()
    this.loadDefaultAddress()
    this.calculatePoints()
    
    const currentMode = app.getRecycleDispatchMode()
    if (currentMode) {
      this.setData({ selectedDispatchMode: currentMode })
    }
  },

  initDefaultData() {
    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const minDateStr = formatDate(today)

    this.setData({
      appointmentDate: formatDate(tomorrow),
      minDate: minDateStr,
      timeSlots: RECYCLE_TIME_SLOTS.morning || []
    })
  },

  loadDefaultAddress() {
    const defaultAddress = app.getDefaultAddress()
    if (defaultAddress) {
      this.setData({
        address: (defaultAddress.province || '') + (defaultAddress.city || '') + (defaultAddress.district || '') + (defaultAddress.detail || ''),
        contactName: defaultAddress.name || '',
        contactPhone: defaultAddress.phone || ''
      })
    }
  },

  onCategorySelect(e) {
    const { id } = e.currentTarget.dataset
    console.log('[RecycleBook] 选择品类', id)

    const category = RECYCLE_CATEGORIES.find(c => c.id === id)

    this.setData({
      selectedCategoryId: id,
      selectedCategory: category,
      requirePhoto: category ? category.requirePhoto : false
    })

    this.calculatePoints()
  },

  onQuantityMinus() {
    const { quantity, minQuantity } = this.data
    if (quantity <= minQuantity) {
      showToast('数量不能少于' + minQuantity + '件')
      return
    }

    this.setData({
      quantity: quantity - 1
    })

    this.calculatePoints()
  },

  onQuantityPlus() {
    const { quantity, maxQuantity } = this.data
    if (quantity >= maxQuantity) {
      showToast('数量不能超过' + maxQuantity + '件')
      return
    }

    this.setData({
      quantity: quantity + 1
    })

    this.calculatePoints()
  },

  onQuantityInput(e) {
    let value = parseInt(e.detail.value) || 1
    const { minQuantity, maxQuantity } = this.data

    value = Math.max(minQuantity, Math.min(maxQuantity, value))

    this.setData({
      quantity: value
    })

    this.calculatePoints()
  },

  onDateChange(e) {
    const date = e.detail.value
    console.log('[RecycleBook] 选择日期', date)

    this.setData({
      appointmentDate: date
    })
  },

  onPeriodSelect(e) {
    const { id } = e.currentTarget.dataset
    const period = RECYCLE_TIME_PERIODS.find(p => p.id === id)
    const slots = RECYCLE_TIME_SLOTS[id] || []

    this.setData({
      selectedPeriodId: id,
      selectedPeriodName: period ? period.name : '',
      selectedTimeSlotId: '',
      selectedTimeSlotName: '',
      timeSlots: slots
    })
  },

  onTimeSlotSelect(e) {
    const { id } = e.currentTarget.dataset
    const period = this.data.timePeriods.find(p => p.id === this.data.selectedPeriodId)
    const slot = this.data.timeSlots.find(s => s.id === id)

    this.setData({
      selectedTimeSlotId: id,
      selectedTimeSlotName: slot ? slot.name : ''
    })
  },

  onChoosePhoto() {
    const { photos, maxPhotos } = this.data
    const remainCount = maxPhotos - photos.length
    if (remainCount <= 0) {
      showToast(`最多上传${maxPhotos}张照片`)
      return
    }

    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const newPhotos = res.tempFiles.map(f => f.tempFilePath)
        const updatedPhotos = [...photos, ...newPhotos].slice(0, maxPhotos)
        this.setData({
          photos: updatedPhotos
        })
        this.calculatePoints()
        console.log('[RecycleBook] 上传照片成功', updatedPhotos.length, '张')
      },
      fail: (err) => {
        console.warn('[RecycleBook] 上传照片失败', err)
      }
    })
  },

  onRemovePhoto(e) {
    const { index } = e.currentTarget.dataset
    const photos = [...this.data.photos]
    photos.splice(index, 1)
    this.setData({ photos })
    this.calculatePoints()
  },

  onPreviewPhoto(e) {
    const { index } = e.currentTarget.dataset
    wx.previewImage({
      urls: this.data.photos,
      current: this.data.photos[index]
    })
  },

  onAddressInput(e) {
    this.setData({
      address: e.detail.value
    })
  },

  onContactNameInput(e) {
    this.setData({
      contactName: e.detail.value
    })
  },

  onContactPhoneInput(e) {
    this.setData({
      contactPhone: e.detail.value
    })
  },

  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  onDispatchModeSelect(e) {
    const { id } = e.currentTarget.dataset
    console.log('[RecycleBook] 选择派单模式', id)
    
    const mode = RECYCLE_DISPATCH_MODE[id.toUpperCase()]
    if (!mode) return
    
    this.setData({ selectedDispatchMode: id })
    app.setRecycleDispatchMode(id)
    
    showToast(`已选择${mode.name}`)
  },

  onChooseAddress() {
    navigateTo('/pages/address-list/address-list', { selectMode: '1' })
  },

  calculatePoints() {
    const { selectedCategoryId, quantity, photos } = this.data

    if (!selectedCategoryId) {
      this.setData({ estimatedPoints: 0, estimatedPointsBreakdown: [] })
      return
    }

    const hasPhoto = photos && photos.length > 0
    const points = app.calculateRecyclePoints(selectedCategoryId, quantity, { hasPhoto })
    const breakdown = app.getPointsBreakdown(selectedCategoryId, quantity, { hasPhoto })

    this.setData({
      estimatedPoints: points,
      estimatedPointsBreakdown: breakdown
    })
  },

  validateForm() {
    const { selectedCategoryId, quantity, appointmentDate, selectedTimeSlotId, address, contactName, contactPhone, photos, requirePhoto } = this.data

    if (!selectedCategoryId) {
      showToast('请选择回收品类')
      return false
    }

    if (!quantity || quantity < 1) {
      showToast('请输入正确的数量')
      return false
    }

    if (!appointmentDate) {
      showToast('请选择上门日期')
      return false
    }

    if (!selectedTimeSlotId) {
      showToast('请选择具体上门时段')
      return false
    }

    if (requirePhoto && (!photos || photos.length === 0)) {
      showToast('该品类需要上传物品照片')
      return false
    }

    if (!address.trim()) {
      showToast('请填写回收地址')
      return false
    }

    if (!contactName.trim()) {
      showToast('请填写联系人姓名')
      return false
    }

    if (!contactPhone.trim()) {
      showToast('请填写联系电话')
      return false
    }

    if (!/^1[3-9]\d{9}$/.test(contactPhone.trim())) {
      showToast('请输入正确的手机号码')
      return false
    }

    return true
  },

  onSubmit() {
    if (!this.validateForm()) return

    const {
      selectedCategoryId, selectedCategory, quantity,
      appointmentDate, selectedPeriodId, selectedPeriodName,
      selectedTimeSlotId, selectedTimeSlotName,
      address, contactName, contactPhone, remark,
      photos, submitting
    } = this.data

    if (submitting) return

    this.setData({ submitting: true })
    showLoading('提交中...')

    const category = selectedCategory || RECYCLE_CATEGORIES.find(c => c.id === selectedCategoryId)

    const orderData = {
      categoryId: selectedCategoryId,
      categoryName: category ? category.name : '',
      categoryEmoji: category ? category.emoji : '',
      quantity: quantity,
      appointmentDate: appointmentDate,
      appointmentPeriodId: selectedPeriodId,
      appointmentPeriodName: selectedPeriodName,
      appointmentTimeSlot: selectedTimeSlotId,
      appointmentTimeName: selectedTimeSlotName,
      address: address,
      contactName: contactName,
      contactPhone: contactPhone,
      remark: remark,
      photos: photos,
      dispatchMode: selectedDispatchMode
    }

    setTimeout(() => {
      const newOrder = app.addRecycleOrder(orderData)
      hideLoading()

      if (newOrder) {
        showSuccess('预约提交成功')

        setTimeout(() => {
          navigateTo('/pages/recycle-order-detail/recycle-order-detail', { id: newOrder.id })
        }, 1500)
      } else {
        showToast('预约提交失败，请重试')
        this.setData({ submitting: false })
      }
    }, 500)
  }
})
