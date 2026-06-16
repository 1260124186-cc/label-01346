/**
 * 积分明细页面
 */
Page({
  data: {
    // 积分数据
    currentPoints: 2580,
    totalEarned: 3280,
    totalSpent: 700,
    
    // 筛选标签
    filterTabs: [
      { id: 'all', name: '全部' },
      { id: 'earn', name: '获得' },
      { id: 'spend', name: '消费' }
    ],
    currentFilter: 'all',
    
    // 积分记录
    allPoints: [
      {
        id: 1,
        type: 'earn',
        title: '垃圾分类',
        desc: '正确分类塑料瓶',
        emoji: '♻️',
        points: 10,
        time: '今天 14:30'
      },
      {
        id: 2,
        type: 'spend',
        title: '积分兑换',
        desc: '兑换环保购物袋',
        emoji: '🛍️',
        points: 100,
        time: '今天 10:15'
      },
      {
        id: 3,
        type: 'earn',
        title: '每日签到',
        desc: '连续签到第15天',
        emoji: '📅',
        points: 20,
        time: '今天 08:00'
      },
      {
        id: 4,
        type: 'earn',
        title: '垃圾分类',
        desc: '正确分类厨余垃圾',
        emoji: '🍂',
        points: 5,
        time: '昨天 18:45'
      },
      {
        id: 5,
        type: 'spend',
        title: '积分兑换',
        desc: '兑换便携餐具套装',
        emoji: '🍴',
        points: 200,
        time: '昨天 14:20'
      },
      {
        id: 6,
        type: 'earn',
        title: '知识问答',
        desc: '答题正确5道',
        emoji: '❓',
        points: 50,
        time: '前天 20:30'
      },
      {
        id: 7,
        type: 'earn',
        title: '邀请好友',
        desc: '好友注册成功',
        emoji: '👥',
        points: 100,
        time: '3天前'
      }
    ],
    pointsList: []
  },

  onLoad() {
    console.log('[Points] 页面加载')
    this.filterPoints('all')
  },

  /**
   * 筛选积分记录
   */
  filterPoints(type) {
    let list = this.data.allPoints
    if (type === 'earn') {
      list = this.data.allPoints.filter(item => item.type === 'earn')
    } else if (type === 'spend') {
      list = this.data.allPoints.filter(item => item.type === 'spend')
    }
    
    this.setData({
      pointsList: list,
      currentFilter: type
    })
  },

  /**
   * 切换筛选
   */
  onFilterChange(e) {
    const { id } = e.currentTarget.dataset
    this.filterPoints(id)
  },

  onPullDownRefresh() {
    console.log('[Points] 下拉刷新')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
