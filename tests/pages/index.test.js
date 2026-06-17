require('../setup')

const { TRASH_TYPES, BANNER_LIST } = require('../../frontend-mp/utils/constants')

describe('Index Page', () => {
  let pageObj

  beforeEach(() => {
    jest.clearAllMocks()
    global.Page = jest.fn(obj => obj)
    jest.resetModules()
    require('../../frontend-mp/pages/index/index')
    pageObj = global.Page.mock.results[0].value
    pageObj.setData = jest.fn(function (data) {
      Object.assign(this.data, data)
    })
  })

  describe('data', () => {
    test('包含 bannerList、trashTypes、currentBannerIndex=0、isLoading=false', () => {
      expect(pageObj.data.bannerList).toStrictEqual(BANNER_LIST)
      expect(pageObj.data.trashTypes).toStrictEqual(TRASH_TYPES)
      expect(pageObj.data.currentBannerIndex).toBe(0)
      expect(pageObj.data.isLoading).toBe(false)
    })

    test('初始 isSignedToday 为 false，今天未签到', () => {
      expect(pageObj.data.isSignedToday).toBe(false)
    })

    test('初始 streakDays 为 0', () => {
      expect(pageObj.data.streakDays).toBe(0)
    })
  })

  describe('refreshSignInStatus', () => {
    test('默认数据下 isSignedToday 为 false（今天未签到）', () => {
      pageObj.refreshSignInStatus()
      expect(pageObj.data.isSignedToday).toBe(false)
    })

    test('默认数据下签到记录不含今天，每日一练记录也不含今天', () => {
      const app = getApp()
      expect(app.globalData.signInRecords).not.toContain('2026-06-16')
      expect(app.globalData.dailyQuizRecords).not.toContain('2026-06-16')
    })
  })

  describe('onBannerChange', () => {
    test('根据 e.detail.current 更新 currentBannerIndex', () => {
      pageObj.onBannerChange({ detail: { current: 2 } })
      expect(pageObj.setData).toHaveBeenCalledWith({ currentBannerIndex: 2 })
    })
  })

  describe('onBannerTap', () => {
    test('item.link 存在时调用 navigateTo', () => {
      const item = { link: '/pages/classify/classify' }
      pageObj.onBannerTap({ currentTarget: { dataset: { item } } })
      expect(wx.navigateTo).toHaveBeenCalled()
    })

    test('item.link 为空时不跳转', () => {
      const item = { link: '' }
      pageObj.onBannerTap({ currentTarget: { dataset: { item } } })
      expect(wx.navigateTo).not.toHaveBeenCalled()
    })
  })

  describe('goToClassify', () => {
    test('调用 navigateTo 传递 /pages/classify/classify 及 id、name 参数', () => {
      const item = { id: 2, name: '有害垃圾' }
      pageObj.goToClassify({ currentTarget: { dataset: { item } } })
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/classify/classify?id=2&name=%E6%9C%89%E5%AE%B3%E5%9E%83%E5%9C%BE',
        fail: expect.any(Function)
      })
    })
  })

  describe('goToFirstClassify', () => {
    test('导航到第一个垃圾分类', () => {
      pageObj.goToFirstClassify()
      const firstType = TRASH_TYPES[0]
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: `/pages/classify/classify?id=${firstType.id}&name=${encodeURIComponent(firstType.name)}`,
        fail: expect.any(Function)
      })
    })
  })

  describe('goToQuiz', () => {
    test('导航到 /pages/quiz/quiz', () => {
      pageObj.goToQuiz()
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/quiz/quiz',
        fail: expect.any(Function)
      })
    })
  })

  describe('goToDailyQuiz', () => {
    test('导航到 /pages/quiz-daily/quiz-daily', () => {
      pageObj.goToDailyQuiz()
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/quiz-daily/quiz-daily',
        fail: expect.any(Function)
      })
    })
  })

  describe('goToExchange', () => {
    test('调用 switchTab 到 /pages/exchange/exchange', () => {
      pageObj.goToExchange()
      expect(wx.switchTab).toHaveBeenCalledWith({ url: '/pages/exchange/exchange' })
    })
  })

  describe('goToProfile', () => {
    test('调用 switchTab 到 /pages/profile/profile', () => {
      pageObj.goToProfile()
      expect(wx.switchTab).toHaveBeenCalledWith({ url: '/pages/profile/profile' })
    })
  })

  describe('onShareAppMessage', () => {
    test('返回正确的 title 和 path (含 inviterId)', () => {
      const result = pageObj.onShareAppMessage()
      expect(result).toHaveProperty('title')
      expect(result).toHaveProperty('path')
      expect(result.path).toContain('inviterId=')
    })
  })
})
