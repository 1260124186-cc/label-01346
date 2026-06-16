require('../setup')

const { EXCHANGE_GOODS, EXCHANGE_BANNERS } = require('../../frontend-mp/utils/constants')
const util = require('../../frontend-mp/utils/util')

jest.spyOn(util, 'showToast')
jest.spyOn(util, 'showModal')

global.Page = jest.fn(obj => obj)

require('../../frontend-mp/pages/exchange/exchange')

const pageDef = global.Page.mock.calls[0][0]
const moduleApp = getApp.mock.results[0].value

let pageInstance

beforeEach(() => {
  pageInstance = Object.create(pageDef)
  pageInstance.data = JSON.parse(JSON.stringify(pageDef.data))
  pageInstance.setData = jest.fn(function (updates) {
    Object.assign(this.data, updates)
  })
  jest.useFakeTimers()
  wx.showToast.mockClear()
  wx.showModal.mockClear()
  wx.showLoading.mockClear()
  wx.hideLoading.mockClear()
  util.showToast.mockClear()
  util.showModal.mockClear()
  moduleApp.updateUserPoints.mockClear()
  moduleApp.addOrder.mockClear()
  moduleApp.addPointsRecord.mockClear()
  moduleApp.globalData.userInfo.points = 1280
})

afterEach(() => {
  jest.useRealTimers()
})

describe('exchange page data', () => {
  test('has correct initial data', () => {
    expect(pageInstance.data.userPoints).toBe(0)
    expect(pageInstance.data.bannerList).toStrictEqual(EXCHANGE_BANNERS)
    expect(pageInstance.data.goodsList).toStrictEqual(EXCHANGE_GOODS)
    expect(pageInstance.data.currentCategory).toBe('all')
    expect(pageInstance.data.showBackTop).toBe(false)
  })
})

describe('refreshUserPoints', () => {
  test('reads from app.globalData.userInfo.points and sets userPoints', () => {
    pageInstance.refreshUserPoints()
    expect(pageInstance.setData).toHaveBeenCalledWith({ userPoints: 1280 })
  })

  test('sets userPoints to 0 when points is falsy', () => {
    moduleApp.globalData.userInfo.points = 0
    pageInstance.refreshUserPoints()
    expect(pageInstance.setData).toHaveBeenCalledWith({ userPoints: 0 })
  })
})

describe('showPointsRules / hidePointsRules', () => {
  test('showPointsRules sets showRulesModal to true', () => {
    pageInstance.showPointsRules()
    expect(pageInstance.setData).toHaveBeenCalledWith({ showRulesModal: true })
  })

  test('hidePointsRules sets showRulesModal to false', () => {
    pageInstance.hidePointsRules()
    expect(pageInstance.setData).toHaveBeenCalledWith({ showRulesModal: false })
  })
})

describe('onBannerChange', () => {
  test('updates currentBannerIndex', () => {
    pageInstance.onBannerChange({ detail: { current: 2 } })
    expect(pageInstance.setData).toHaveBeenCalledWith({ currentBannerIndex: 2 })
  })
})

describe('onBannerTap', () => {
  test('calls showToast', () => {
    pageInstance.onBannerTap({ currentTarget: { dataset: { item: { id: 1 } } } })
    expect(util.showToast).toHaveBeenCalledWith('活动详情开发中')
  })
})

describe('onCategoryChange', () => {
  test('sets currentCategory and calls filterGoods', () => {
    pageInstance.filterGoods = jest.fn()
    pageInstance.onCategoryChange({ currentTarget: { dataset: { id: 'hot' } } })
    expect(pageInstance.setData).toHaveBeenCalledWith({ currentCategory: 'hot' })
    expect(pageInstance.filterGoods).toHaveBeenCalledWith('hot')
  })
})

describe('filterGoods', () => {
  test('all returns all goods', () => {
    pageInstance.filterGoods('all')
    expect(pageInstance.setData).toHaveBeenCalledWith({ goodsList: EXCHANGE_GOODS })
  })

  test('hot filters tag===热门', () => {
    pageInstance.filterGoods('hot')
    const expected = EXCHANGE_GOODS.filter(item => item.tag === '热门')
    expect(pageInstance.setData).toHaveBeenCalledWith({ goodsList: expected })
  })

  test('new filters tag===推荐', () => {
    pageInstance.filterGoods('new')
    const expected = EXCHANGE_GOODS.filter(item => item.tag === '推荐')
    expect(pageInstance.setData).toHaveBeenCalledWith({ goodsList: expected })
  })

  test('limit filters tag===限量', () => {
    pageInstance.filterGoods('limit')
    const expected = EXCHANGE_GOODS.filter(item => item.tag === '限量')
    expect(pageInstance.setData).toHaveBeenCalledWith({ goodsList: expected })
  })
})

describe('onScroll', () => {
  test('shows backTop when scrollTop > 500', () => {
    pageInstance.data.showBackTop = false
    pageInstance.onScroll({ detail: { scrollTop: 600 } })
    expect(pageInstance.setData).toHaveBeenCalledWith({ showBackTop: true })
  })

  test('hides backTop when scrollTop <= 500', () => {
    pageInstance.data.showBackTop = true
    pageInstance.onScroll({ detail: { scrollTop: 300 } })
    expect(pageInstance.setData).toHaveBeenCalledWith({ showBackTop: false })
  })
})

describe('scrollToTop', () => {
  test('sets scrollTop to 0', () => {
    pageInstance.scrollToTop()
    expect(pageInstance.setData).toHaveBeenCalledWith({ scrollTop: 0 })
  })
})

describe('onGoodsTap', () => {
  test('calls wx.showModal with item details', () => {
    const item = { name: '环保购物袋', description: '可重复使用', points: 100, stock: 50 }
    pageInstance.onGoodsTap({ currentTarget: { dataset: { item } } })
    expect(wx.showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '环保购物袋',
        content: '可重复使用\n\n所需积分：100\n库存：50件',
        showCancel: true,
        confirmText: '立即兑换'
      })
    )
  })
})

describe('handleExchange', () => {
  test('prevents duplicate when exchangingId is set', async () => {
    pageInstance.data.exchangingId = 1
    pageInstance.data.userPoints = 2000
    await pageInstance.handleExchange({ id: 2, name: 'test', points: 100, stock: 10 })
    expect(util.showToast).not.toHaveBeenCalled()
    expect(pageInstance.setData).not.toHaveBeenCalled()
  })

  test('shows toast when points insufficient', async () => {
    pageInstance.data.userPoints = 50
    await pageInstance.handleExchange({ id: 1, name: 'test', points: 100, stock: 10 })
    expect(util.showToast).toHaveBeenCalledWith('积分不足，无法兑换')
  })

  test('shows toast when stock <= 0', async () => {
    pageInstance.data.userPoints = 2000
    await pageInstance.handleExchange({ id: 1, name: 'test', points: 100, stock: 0 })
    expect(util.showToast).toHaveBeenCalledWith('商品已售罄')
  })

  test('confirms with showModal then deducts points and updates stock', async () => {
    pageInstance.data.userPoints = 2000
    pageInstance.data.goodsList = JSON.parse(JSON.stringify(EXCHANGE_GOODS))
    const item = { id: 1, name: '环保购物袋', description: '可重复使用', image: '/images/goods/goods1.jpg', points: 100, stock: 50, sales: 128 }

    util.showModal.mockResolvedValueOnce(true)

    await pageInstance.handleExchange(item)

    expect(util.showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '确认兑换',
        content: '确定使用 100 积分兑换「环保购物袋」吗？'
      })
    )

    expect(pageInstance.setData).toHaveBeenCalledWith({ exchangingId: 1 })
    expect(wx.showLoading).toHaveBeenCalledWith({ title: '兑换中...', mask: true })

    jest.advanceTimersByTime(1500)

    expect(moduleApp.updateUserPoints).toHaveBeenCalledWith(-100)
    expect(moduleApp.addOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        goodsName: '环保购物袋',
        goodsDesc: '可重复使用',
        goodsImage: '/images/goods/goods1.jpg',
        points: 100,
        quantity: 1
      })
    )
    expect(moduleApp.addPointsRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'spend',
        title: '积分兑换',
        desc: '兑换环保购物袋',
        points: 100
      })
    )
    expect(wx.hideLoading).toHaveBeenCalled()
  })
})

describe('onShareAppMessage', () => {
  test('returns title and path', () => {
    const result = pageInstance.onShareAppMessage()
    expect(result).toEqual({
      title: '积分商城 - 用积分兑换环保好礼',
      path: '/pages/exchange/exchange',
      imageUrl: ''
    })
  })
})
