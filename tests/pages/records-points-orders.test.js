require('../setup')

let recordsPage
global.Page = jest.fn(obj => { recordsPage = obj; return obj })
require('../../frontend-mp/pages/records/records')

let pointsPage
global.Page = jest.fn(obj => { pointsPage = obj; return obj })
require('../../frontend-mp/pages/points/points')

let ordersPage
global.Page = jest.fn(obj => { ordersPage = obj; return obj })
require('../../frontend-mp/pages/orders/orders')

describe('records', () => {
  test('data 包含 totalCount=128, totalPoints=2580, continuousDays=15', () => {
    expect(recordsPage.data.totalCount).toBe(128)
    expect(recordsPage.data.totalPoints).toBe(2580)
    expect(recordsPage.data.continuousDays).toBe(15)
  })

  test('categoryStats 包含 4 项，每项有 id/name/emoji/color/count', () => {
    const stats = recordsPage.data.categoryStats
    expect(stats).toHaveLength(4)
    stats.forEach(item => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('emoji')
      expect(item).toHaveProperty('color')
      expect(item).toHaveProperty('count')
    })
  })

  test('recordList 包含 6 项，每项有 id/trashName/typeName/emoji/bgColor/points/time', () => {
    const list = recordsPage.data.recordList
    expect(list).toHaveLength(6)
    list.forEach(item => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('trashName')
      expect(item).toHaveProperty('typeName')
      expect(item).toHaveProperty('emoji')
      expect(item).toHaveProperty('bgColor')
      expect(item).toHaveProperty('points')
      expect(item).toHaveProperty('time')
    })
  })
})

describe('points', () => {
  let instance

  beforeEach(() => {
    jest.clearAllMocks()
    const app = global.getApp()
    app.globalData.pointsRecords = [
      { id: 1, type: 'earn', title: '垃圾分类', desc: '正确分类塑料瓶', emoji: '♻️', points: 10, time: '今天 14:30' },
      { id: 2, type: 'spend', title: '积分兑换', desc: '兑换环保购物袋', emoji: '🛍️', points: 100, time: '今天 10:15' },
      { id: 3, type: 'earn', title: '每日签到', desc: '连续签到第15天', emoji: '📅', points: 20, time: '今天 08:00' },
      { id: 4, type: 'earn', title: '垃圾分类', desc: '正确分类厨余垃圾', emoji: '🍂', points: 5, time: '昨天 18:45' },
      { id: 5, type: 'spend', title: '积分兑换', desc: '兑换便携餐具套装', emoji: '🍴', points: 200, time: '昨天 14:20' },
      { id: 6, type: 'earn', title: '知识问答', desc: '答题正确5道', emoji: '❓', points: 50, time: '前天 20:30' },
      { id: 7, type: 'earn', title: '邀请好友', desc: '好友注册成功', emoji: '👥', points: 100, time: '3天前' }
    ]
    app.globalData.userInfo = { avatarUrl: '', nickName: '环保达人', points: 1280, level: 3, joinDate: '2026-01-01' }

    instance = { data: JSON.parse(JSON.stringify(pointsPage.data)), setData: jest.fn(function(updates) { Object.assign(this.data, updates) }) }
    Object.keys(pointsPage).forEach(key => {
      if (typeof pointsPage[key] === 'function') {
        instance[key] = pointsPage[key].bind(instance)
      }
    })
  })

  test('loadPointsRecords 从 app 加载积分记录并计算汇总', () => {
    instance.loadPointsRecords()
    expect(instance.data.allPoints).toHaveLength(7)
    expect(instance.data.totalEarned).toBe(185)
    expect(instance.data.totalSpent).toBe(300)
    expect(instance.data.currentPoints).toBe(1280)
  })

  test('data 包含 filterTabs 含 all/earn/spend', () => {
    const tabs = pointsPage.data.filterTabs
    expect(tabs).toEqual([
      { id: 'all', name: '全部' },
      { id: 'earn', name: '获得' },
      { id: 'spend', name: '消费' }
    ])
  })

  test('data 初始 allPoints 为空数组, currentFilter 为 all', () => {
    expect(pointsPage.data.allPoints).toEqual([])
    expect(pointsPage.data.currentFilter).toBe('all')
  })

  test('filterPoints 传入 all 返回全部', () => {
    instance.loadPointsRecords()
    instance.filterPoints('all')
    expect(instance.data.pointsList).toHaveLength(7)
    expect(instance.data.currentFilter).toBe('all')
  })

  test('filterPoints 传入 earn 筛选 type===earn', () => {
    instance.loadPointsRecords()
    instance.filterPoints('earn')
    expect(instance.data.pointsList).toHaveLength(5)
    instance.data.pointsList.forEach(item => {
      expect(item.type).toBe('earn')
    })
    expect(instance.data.currentFilter).toBe('earn')
  })

  test('filterPoints 传入 spend 筛选 type===spend', () => {
    instance.loadPointsRecords()
    instance.filterPoints('spend')
    expect(instance.data.pointsList).toHaveLength(2)
    instance.data.pointsList.forEach(item => {
      expect(item.type).toBe('spend')
    })
    expect(instance.data.currentFilter).toBe('spend')
  })

  test('新增兑换记录后 loadPointsRecords 能反映变化', () => {
    const app = global.getApp()
    app.globalData.pointsRecords.unshift({
      id: 100, type: 'spend', title: '积分兑换', desc: '兑换保温杯', emoji: '🛍️', points: 500, time: '刚刚'
    })
    instance.loadPointsRecords()
    expect(instance.data.allPoints).toHaveLength(8)
    expect(instance.data.totalSpent).toBe(800)
    expect(instance.data.pointsList).toHaveLength(8)
  })

  test('onFilterChange 调用 filterPoints 传入选中的 id', () => {
    instance.loadPointsRecords()
    instance.filterPoints = jest.fn()
    instance.onFilterChange({ currentTarget: { dataset: { id: 'earn' } } })
    expect(instance.filterPoints).toHaveBeenCalledWith('earn')
  })
})

describe('orders', () => {
  let instance

  beforeEach(() => {
    jest.clearAllMocks()
    const app = global.getApp()
    app.globalData.orders = []

    instance = { data: JSON.parse(JSON.stringify(ordersPage.data)), setData: jest.fn(function(updates) { Object.assign(this.data, updates) }) }
    Object.keys(ordersPage).forEach(key => {
      if (typeof ordersPage[key] === 'function') {
        instance[key] = ordersPage[key].bind(instance)
      }
    })
  })

  test('data 初始 orderList 为空数组', () => {
    expect(ordersPage.data.orderList).toEqual([])
  })

  test('loadOrders 从 app 加载订单数据', () => {
    const app = global.getApp()
    const mockOrder = { id: 'order-1', goodsName: '环保购物袋', goodsDesc: '可重复使用', goodsImage: '/images/goods/goods1.jpg', points: 100, quantity: 1, createTime: '2026-06-16 14:30' }
    app.globalData.orders = [mockOrder]
    instance.loadOrders()
    expect(instance.data.orderList).toHaveLength(1)
    expect(instance.data.orderList[0].goodsName).toBe('环保购物袋')
  })

  test('兑换后新增的订单可通过 loadOrders 加载', () => {
    const app = global.getApp()
    const newOrder = { id: 'order-2', goodsName: '保温杯', goodsDesc: '316不锈钢', goodsImage: '/images/goods/goods3.jpg', points: 500, quantity: 1, createTime: '2026-06-16 15:00' }
    app.addOrder(newOrder)
    instance.loadOrders()
    expect(instance.data.orderList).toHaveLength(1)
    expect(instance.data.orderList[0].goodsName).toBe('保温杯')
  })

  test('每个 order 包含 id/goodsName/goodsDesc/goodsImage/points/quantity/createTime', () => {
    const app = global.getApp()
    app.globalData.orders = [
      { id: 'order-1', goodsName: '环保购物袋', goodsDesc: '可重复使用', goodsImage: '/images/goods/goods1.jpg', points: 100, quantity: 1, createTime: '2026-06-16 14:30' }
    ]
    instance.loadOrders()
    const order = instance.data.orderList[0]
    expect(order).toHaveProperty('id')
    expect(order).toHaveProperty('goodsName')
    expect(order).toHaveProperty('goodsDesc')
    expect(order).toHaveProperty('goodsImage')
    expect(order).toHaveProperty('points')
    expect(order).toHaveProperty('quantity')
    expect(order).toHaveProperty('createTime')
  })

  test('onReorder 调用 wx.switchTab 跳转到 /pages/exchange/exchange', () => {
    instance.onReorder()
    expect(global.wx.switchTab).toHaveBeenCalledWith({ url: '/pages/exchange/exchange' })
  })

  test('goExchange 调用 wx.switchTab 跳转到 /pages/exchange/exchange', () => {
    instance.goExchange()
    expect(global.wx.switchTab).toHaveBeenCalledWith({ url: '/pages/exchange/exchange' })
  })

  test('onPullDownRefresh 调用 loadOrders 刷新订单', () => {
    instance.loadOrders = jest.fn()
    instance.onPullDownRefresh()
    expect(instance.loadOrders).toHaveBeenCalled()
  })
})
