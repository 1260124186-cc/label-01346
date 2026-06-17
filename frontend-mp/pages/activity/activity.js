const app = getApp()
const { showToast, navigateTo, formatDate } = require('../../utils/util')

const ACTIVITY_TYPES = {
  '1': {
    id: '1',
    type: 'double',
    title: '新人专享 双倍积分',
    subtitle: '新用户首周签到答题双倍积分',
    bannerImage: '/images/banner/exchange1.jpg',
    bgColor: 'linear-gradient(135deg, #667eea, #764ba2)',
    description: '新用户注册首周内，完成每日签到、知识问答等任务可获得双倍积分奖励！',
    rules: [
      '活动仅限新用户注册后7天内参与',
      '每日签到、知识问答、垃圾分类均享受双倍积分',
      '每日签到奖励上限翻倍至10积分',
      '活动解释权归垃圾分类助手所有'
    ],
    startTime: '2024-01-01 00:00',
    endTime: '长期有效',
    status: 'active'
  },
  '2': {
    id: '2',
    type: 'flashsale',
    title: '限时秒杀 低至5折',
    subtitle: '每日10点、20点开抢，限量商品超值兑换',
    bannerImage: '/images/banner/exchange2.jpg',
    bgColor: 'linear-gradient(135deg, #f093fb, #f5576c)',
    description: '精选热门商品限时秒杀，最低5折兑换！每天10点、20点准时开抢，数量有限，先到先得！',
    rules: [
      '秒杀时间：每日 10:00-10:30、20:00-20:30',
      '每款商品每人限兑1件',
      '秒杀商品数量有限，兑完即止',
      '秒杀订单不支持退换，请谨慎兑换'
    ],
    flashGoods: [
      { id: 1, name: '环保购物袋', originalPoints: 100, salePoints: 50, stock: 20, sold: 15, image: '/images/goods/goods1.jpg' },
      { id: 5, name: '可降解垃圾袋', originalPoints: 80, salePoints: 40, stock: 50, sold: 32, image: '/images/goods/goods5.jpg' },
      { id: 4, name: '竹纤维毛巾', originalPoints: 150, salePoints: 75, stock: 10, sold: 8, image: '/images/goods/goods4.jpg' }
    ],
    nextFlashTime: '20:00',
    status: 'active'
  },
  '3': {
    id: '3',
    type: 'discount',
    title: '环保达人 专属福利',
    subtitle: '等级越高，折扣越大，最高享8折优惠',
    bannerImage: '/images/banner/exchange3.jpg',
    bgColor: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    description: '环保达人专属福利来袭！根据用户等级享受不同折扣优惠，等级越高折扣越大，最高可享8折！',
    rules: [
      'LV.2 环保学徒：9.5折优惠',
      'LV.3 环保达人：9折优惠',
      'LV.4 环保专家：8.5折优惠',
      'LV.5 环保大师：8折优惠',
      '折扣商品不与其他优惠叠加',
      '活动解释权归垃圾分类助手所有'
    ],
    discountGoods: [
      { id: 3, name: '保温杯', originalPoints: 500, discountPoints: 450, discount: '9折', image: '/images/goods/goods3.jpg' },
      { id: 6, name: '多肉植物盆栽', originalPoints: 300, discountPoints: 270, discount: '9折', image: '/images/goods/goods6.jpg' },
      { id: 2, name: '便携餐具套装', originalPoints: 200, discountPoints: 180, discount: '9折', image: '/images/goods/goods2.jpg' }
    ],
    userDiscount: '9折',
    userLevel: 'LV.3 环保达人',
    status: 'active'
  }
}

Page({
  data: {
    activityId: '',
    activity: null,
    userPoints: 0,
    userLevel: '',
    countdown: {
      hours: '00',
      minutes: '00',
      seconds: '00'
    },
    timer: null
  },

  onLoad(options) {
    const id = options.id || '1'
    this.setData({ activityId: id })
    this.loadActivity(id)
    this.refreshUserInfo()
  },

  onShow() {
    this.refreshUserInfo()
    if (this.data.activity && this.data.activity.type === 'flashsale') {
      this.startCountdown()
    }
  },

  onHide() {
    this.stopCountdown()
  },

  onUnload() {
    this.stopCountdown()
  },

  loadActivity(id) {
    const activity = ACTIVITY_TYPES[id]
    if (activity) {
      this.setData({ activity })
      wx.setNavigationBarTitle({ title: activity.title })
      
      if (activity.type === 'flashsale') {
        this.startCountdown()
      }
    }
  },

  refreshUserInfo() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      const { USER_LEVELS } = require('../../utils/constants')
      let levelInfo = USER_LEVELS[0]
      for (const level of USER_LEVELS) {
        if (userInfo.points >= level.minPoints) {
          levelInfo = level
        }
      }
      
      this.setData({
        userPoints: userInfo.points || 0,
        userLevel: 'LV.' + levelInfo.level + ' ' + levelInfo.name
      })
    }
  },

  startCountdown() {
    this.stopCountdown()
    this.updateCountdown()
    const timer = setInterval(() => {
      this.updateCountdown()
    }, 1000)
    this.setData({ timer })
  },

  stopCountdown() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  },

  updateCountdown() {
    const now = new Date()
    const hours = now.getHours()
    let targetHour = 20
    
    if (hours < 10) {
      targetHour = 10
    } else if (hours < 20) {
      targetHour = 20
    } else {
      targetHour = 10
    }
    
    const target = new Date()
    if (hours >= 20) {
      target.setDate(target.getDate() + 1)
    }
    target.setHours(targetHour, 0, 0, 0)
    
    const diff = target.getTime() - now.getTime()
    const h = Math.floor(diff / (1000 * 60 * 60))
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const s = Math.floor((diff % (1000 * 60)) / 1000)
    
    this.setData({
      countdown: {
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      }
    })
  },

  onGoodsTap(e) {
    const { id } = e.currentTarget.dataset
    navigateTo('/pages/goods-detail/goods-detail', { id })
  },

  onGoExchange() {
    wx.switchTab({ url: '/pages/exchange/exchange' })
  },

  onShareAppMessage() {
    const { activity } = this.data
    return {
      title: activity ? activity.title : '积分商城活动',
      path: activity ? `/pages/activity/activity?id=${activity.id}` : '/pages/exchange/exchange'
    }
  }
})
