const app = getApp()
const { RECYCLE_CATEGORIES, RECYCLE_TIME_SLOTS } = require('../../utils/constants')
const { showToast, showSuccess, navigateTo, formatDate } = require('../../utils/util')

Page({
  data: {
    categories: RECYCLE_CATEGORIES,
    timeSlots: RECYCLE_TIME_SLOTS,
    selectedCategoryId: '',
    quantity: 1,
    minQuantity: 1,
    maxQuantity: 99,
    appointmentDate: '',
    minDate: '',
    selectedTimeSlotId: '',
    address: '',
    contactName: '',
    contactPhone: '',
    remark: '',
    estimatedPoints: 0,
    submitting: false
  },

  onLoad() {
    console.log('[RecycleBook] 页面加载')
    this.initDefaultData()
    this.loadDefaultAddress()
    this.calculatePoints()
  },

  initDefaultData() {
    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    const minDateStr = formatDate(today)

    this.setData({
      appointmentDate: formatDate(tomorrow),
      minDate: minDateStr
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

    this.setData({
      selectedCategoryId: id
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

  onTimeSlotSelect(e) {
    const { id } = e.currentTarget.dataset
    console.log('[RecycleBook] 选择时间段', id)

    this.setData({
      selectedTimeSlotId: id
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

  onChooseAddress() {
    navigateTo('/pages/address-list/address-list', { selectMode: '1' })
  },

  calculatePoints() {
    const { selectedCategoryId, quantity } = this.data

    if (!selectedCategoryId) {
      this.setData({ estimatedPoints: 0 })
      return
    }

    const points = app.calculateRecyclePoints(selectedCategoryId, quantity)
    this.setData({ estimatedPoints: points })
  },

  validateForm() {
    const { selectedCategoryId, quantity, appointmentDate, selectedTimeSlotId, address, contactName, contactPhone } = this.data

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
      showToast('请选择上门时间段')
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

    const { selectedCategoryId, quantity, appointmentDate, selectedTimeSlotId, address, contactName, contactPhone, remark, submitting } = this.data

    if (submitting) return

    this.setData({ submitting: true })

    const category = RECYCLE_CATEGORIES.find(c => c.id === selectedCategoryId)
    const timeSlot = RECYCLE_TIME_SLOTS.find(t => t.id === selectedTimeSlotId)

    const orderData = {
      categoryId: selectedCategoryId,
      categoryName: category ? category.name : '',
      categoryEmoji: category ? category.emoji : '',
      quantity: quantity,
      appointmentDate: appointmentDate,
      appointmentTimeSlot: selectedTimeSlotId,
      appointmentTimeName: timeSlot ? timeSlot.name : '',
      address: address,
      contactName: contactName,
      contactPhone: contactPhone,
      remark: remark
    }

    const newOrder = app.addRecycleOrder(orderData)

    if (newOrder) {
      showSuccess('预约提交成功')

      setTimeout(() => {
        navigateTo('/pages/recycle-order-detail/recycle-order-detail', { id: newOrder.id })
      }, 1500)
    } else {
      showToast('预约提交失败，请重试')
      this.setData({ submitting: false })
    }
  }
})
