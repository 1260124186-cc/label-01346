const app = getApp()
const { showToast, showModal, showLoading, hideLoading, navigateTo, formatDate, generateId } = require('../../utils/util')

Page({
  data: {
    goodsId: null,
    goods: null,
    userPoints: 0,
    currentImageIndex: 0,
    showAddressPicker: false,
    selectedAddress: null,
    exchanging: false,
    specs: [
      { name: '规格', value: '标准版' },
      { name: '材质', value: '环保材质' },
      { name: '尺寸', value: '标准尺寸' },
      { name: '产地', value: '中国' }
    ],
    exchangeNotes: [
      '商品兑换后将在1-3个工作日内安排发货',
      '兑换成功后积分将立即扣除，不予退还',
      '如遇商品质量问题，可联系客服进行退换',
      '商品图片仅供参考，请以实物为准',
      '最终解释权归垃圾分类助手所有'
    ],
    reviews: [
      {
        id: 1,
        avatar: '',
        nickname: '环保达人小明',
        rating: 5,
        content: '质量很好，用积分兑换很划算！环保又实用，推荐大家都来换。',
        time: '2024-01-15',
        images: []
      },
      {
        id: 2,
        avatar: '',
        nickname: '垃圾分类志愿者',
        rating: 5,
        content: '物流很快，包装也很用心。商品和描述一致，下次还会再来兑换。',
        time: '2024-01-10',
        images: []
      },
      {
        id: 3,
        avatar: '',
        nickname: '绿色生活家',
        rating: 4,
        content: '整体不错，就是希望能有更多款式可选。用积分换的就是香！',
        time: '2024-01-05',
        images: []
      }
    ]
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ goodsId: parseInt(options.id) })
      this.loadGoodsDetail()
    }
  },

  onShow() {
    this.refreshUserPoints()
    this.refreshSelectedAddress()
  },

  loadGoodsDetail() {
    const goods = app.getGoodsById(this.data.goodsId)
    if (goods) {
      const goodsWithImages = {
        ...goods,
        images: [goods.image, goods.image, goods.image]
      }
      this.setData({ goods: goodsWithImages })
      wx.setNavigationBarTitle({ title: goods.name })
    }
  },

  refreshUserPoints() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userPoints: userInfo.points || 0
      })
    }
  },

  refreshSelectedAddress() {
    const defaultAddr = app.getDefaultAddress()
    if (defaultAddr) {
      this.setData({ selectedAddress: defaultAddr })
    }
  },

  onImageChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    })
  },

  onChooseAddress() {
    navigateTo('/pages/address-list/address-list', { selectMode: '1' })
  },

  onAddressSelected(address) {
    this.setData({ selectedAddress: address })
  },

  async onExchange() {
    const { goods, userPoints, selectedAddress, exchanging } = this.data
    
    if (exchanging) return
    
    if (!goods) {
      showToast('商品信息加载失败')
      return
    }
    
    if (userPoints < goods.points) {
      showToast('积分不足，无法兑换')
      return
    }
    
    if (goods.stock <= 0) {
      showToast('商品已售罄')
      return
    }
    
    if (!selectedAddress) {
      showToast('请先选择收货地址')
      this.onChooseAddress()
      return
    }
    
    const confirmed = await showModal({
      title: '确认兑换',
      content: `确定使用 ${goods.points} 积分兑换「${goods.name}」吗？`,
      confirmText: '确认兑换'
    })
    
    if (!confirmed) return
    
    this.setData({ exchanging: true })
    showLoading('兑换中...')
    
    setTimeout(() => {
      hideLoading()
      
      const success = app.updateGoodsStock(goods.id, -1, 1)
      if (!success) {
        this.setData({ exchanging: false })
        showToast('库存不足')
        return
      }
      
      app.updateUserPoints(-goods.points, {
        category: 'exchange',
        title: '积分兑换',
        desc: '兑换' + goods.name,
        emoji: '🛍️'
      })
      
      const now = new Date()
      const order = {
        id: generateId(),
        goodsId: goods.id,
        goodsName: goods.name,
        goodsDesc: goods.description,
        goodsImage: goods.image,
        points: goods.points,
        quantity: 1,
        addressId: selectedAddress.id,
        addressInfo: {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          province: selectedAddress.province,
          city: selectedAddress.city,
          district: selectedAddress.district,
          detail: selectedAddress.detail
        },
        createTime: formatDate(now, 'YYYY-MM-DD HH:mm')
      }
      app.addOrder(order)
      
      this.refreshUserPoints()
      this.loadGoodsDetail()
      this.setData({ exchanging: false })
      
      showToast('兑换成功', 'success')
      
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/order-detail/order-detail?id=' + order.id
        })
      }, 1500)
    }, 1500)
  },

  onGoOrders() {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },

  onShareAppMessage() {
    const { goods } = this.data
    return {
      title: goods ? `${goods.name} - 积分兑换环保好礼` : '积分商城 - 用积分兑换环保好礼',
      path: goods.id ? `/pages/goods-detail/goods-detail?id=${goods.id}` : '/pages/exchange/exchange'
    }
  }
})
