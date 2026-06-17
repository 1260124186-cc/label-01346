const app = getApp()
const { showToast, showModal, navigateTo, navigateBack } = require('../../utils/util')

Page({
  data: {
    addressList: [],
    selectMode: false,
    selectedId: ''
  },

  onLoad(options) {
    if (options.selectMode === '1') {
      this.setData({ 
        selectMode: true,
        selectedId: options.selectedId || ''
      })
      wx.setNavigationBarTitle({ title: '选择收货地址' })
    }
  },

  onShow() {
    this.loadAddresses()
  },

  loadAddresses() {
    const addressList = app.getAddresses()
    this.setData({ addressList })
  },

  onAddAddress() {
    navigateTo('/pages/address-edit/address-edit')
  },

  onEditAddress(e) {
    const { id } = e.currentTarget.dataset
    navigateTo('/pages/address-edit/address-edit', { id })
  },

  onSetDefault(e) {
    const { id } = e.currentTarget.dataset
    app.setDefaultAddress(id)
    this.loadAddresses()
    showToast('已设为默认地址')
  },

  async onDeleteAddress(e) {
    const { id } = e.currentTarget.dataset
    const confirmed = await showModal({
      title: '确认删除',
      content: '确定要删除这个收货地址吗？',
      confirmText: '删除',
      confirmColor: '#E85D5D'
    })
    
    if (!confirmed) return
    
    app.deleteAddress(id)
    this.loadAddresses()
    showToast('删除成功')
  },

  onSelectAddress(e) {
    if (!this.data.selectMode) return
    
    const { item } = e.currentTarget.dataset
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    
    if (prevPage && prevPage.onAddressSelected) {
      prevPage.onAddressSelected(item)
    }
    
    navigateBack()
  }
})
