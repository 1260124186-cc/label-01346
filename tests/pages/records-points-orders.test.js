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
    instance = { data: JSON.parse(JSON.stringify(pointsPage.data)), setData: jest.fn(function(updates) { Object.assign(this.data, updates) }) }
    Object.keys(pointsPage).forEach(key => {
      if (typeof pointsPage[key] === 'function') {
        instance[key] = pointsPage[key].bind(instance)
      }
    })
  })

  test('data 包含 currentPoints=2580, totalEarned=3280, totalSpent=700', () => {
    expect(pointsPage.data.currentPoints).toBe(2580)
    expect(pointsPage.data.totalEarned).toBe(3280)
    expect(pointsPage.data.totalSpent).toBe(700)
  })

  test('data 包含 filterTabs 含 all/earn/spend', () => {
    const tabs = pointsPage.data.filterTabs
    expect(tabs).toEqual([
      { id: 'all', name: '全部' },
      { id: 'earn', name: '获得' },
      { id: 'spend', name: '消费' }
    ])
  })

  test('data currentFilter 为 all, allPoints 有 7 项, pointsList 为空数组', () => {
    expect(pointsPage.data.currentFilter).toBe('all')
    expect(pointsPage.data.allPoints).toHaveLength(7)
    expect(pointsPage.data.pointsList).toEqual([])
  })

  test('filterPoints 传入 all 返回全部', () => {
    instance.filterPoints('all')
    expect(instance.data.pointsList).toHaveLength(7)
    expect(instance.data.currentFilter).toBe('all')
  })

  test('filterPoints 传入 earn 筛选 type===earn', () => {
    instance.filterPoints('earn')
    expect(instance.data.pointsList).toHaveLength(5)
    instance.data.pointsList.forEach(item => {
      expect(item.type).toBe('earn')
    })
    expect(instance.data.currentFilter).toBe('earn')
  })

  test('filterPoints 传入 spend 筛选 type===spend', () => {
    instance.filterPoints('spend')
    expect(instance.data.pointsList).toHaveLength(2)
    instance.data.pointsList.forEach(item => {
      expect(item.type).toBe('spend')
    })
    expect(instance.data.currentFilter).toBe('spend')
  })

  test('onFilterChange 调用 filterPoints 传入选中的 id', () => {
    instance.filterPoints = jest.fn()
    instance.onFilterChange({ currentTarget: { dataset: { id: 'earn' } } })
    expect(instance.filterPoints).toHaveBeenCalledWith('earn')
  })
})

describe('orders', () => {
  let instance

  beforeEach(() => {
    jest.clearAllMocks()
    instance = { data: JSON.parse(JSON.stringify(ordersPage.data)), setData: jest.fn(function(updates) { Object.assign(this.data, updates) }) }
    Object.keys(ordersPage).forEach(key => {
      if (typeof ordersPage[key] === 'function') {
        instance[key] = ordersPage[key].bind(instance)
      }
    })
  })

  test('data orderList 包含 4 项', () => {
    expect(ordersPage.data.orderList).toHaveLength(4)
  })

  test('每个 order 包含 id/goodsName/goodsDesc/goodsImage/points/quantity/createTime', () => {
    ordersPage.data.orderList.forEach(order => {
      expect(order).toHaveProperty('id')
      expect(order).toHaveProperty('goodsName')
      expect(order).toHaveProperty('goodsDesc')
      expect(order).toHaveProperty('goodsImage')
      expect(order).toHaveProperty('points')
      expect(order).toHaveProperty('quantity')
      expect(order).toHaveProperty('createTime')
    })
  })

  test('onReorder 调用 wx.switchTab 跳转到 /pages/exchange/exchange', () => {
    instance.onReorder()
    expect(global.wx.switchTab).toHaveBeenCalledWith({ url: '/pages/exchange/exchange' })
  })

  test('goExchange 调用 wx.switchTab 跳转到 /pages/exchange/exchange', () => {
    instance.goExchange()
    expect(global.wx.switchTab).toHaveBeenCalledWith({ url: '/pages/exchange/exchange' })
  })
})
