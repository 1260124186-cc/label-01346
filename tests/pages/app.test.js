require('../setup')

const { storage } = require('../setup')

describe('App', () => {
  let appObj

  beforeEach(() => {
    Object.keys(storage).forEach(key => delete storage[key])
    jest.clearAllMocks()
    global.App = jest.fn(obj => obj)
    jest.resetModules()
    require('../../frontend-mp/app')
    appObj = global.App.mock.results[0].value
  })

  describe('initUserInfo', () => {
    test('从 storage 加载已有 userInfo', () => {
      const stored = { avatarUrl: 'a.png', nickName: '测试用户', points: 500, level: 2, joinDate: '2026-01-01' }
      storage['userInfo'] = stored
      wx.getStorageSync.mockReturnValue(stored)

      appObj.initUserInfo()

      expect(appObj.globalData.userInfo).toEqual(stored)
      expect(wx.setStorageSync).not.toHaveBeenCalledWith('userInfo', expect.anything())
    })

    test('storage 为空时创建默认 userInfo 并保存', () => {
      wx.getStorageSync.mockReturnValue('')

      appObj.initUserInfo()

      expect(appObj.globalData.userInfo).toMatchObject({
        avatarUrl: '',
        nickName: '环保达人',
        points: 1280,
        level: 3
      })
      expect(appObj.globalData.userInfo.joinDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(wx.setStorageSync).toHaveBeenCalledWith('userInfo', appObj.globalData.userInfo)
    })
  })

  describe('getSystemInfo', () => {
    test('调用 wx.getSystemInfoSync 并设置 globalData 属性', () => {
      appObj.getSystemInfo()

      expect(wx.getSystemInfoSync).toHaveBeenCalled()
      expect(appObj.globalData.systemInfo).toEqual({ statusBarHeight: 44, screenHeight: 812, screenWidth: 375, platform: 'devtools' })
      expect(appObj.globalData.statusBarHeight).toBe(44)
      expect(appObj.globalData.screenHeight).toBe(812)
      expect(appObj.globalData.screenWidth).toBe(375)
    })
  })

  describe('formatDate', () => {
    test('格式化 Date 对象为 YYYY-MM-DD', () => {
      const date = new Date(2026, 5, 16)
      const result = appObj.formatDate(date)
      expect(result).toBe('2026-06-16')
    })

    test('月份和日期补零', () => {
      const date = new Date(2026, 0, 3)
      const result = appObj.formatDate(date)
      expect(result).toBe('2026-01-03')
    })
  })

  describe('updateUserPoints', () => {
    beforeEach(() => {
      appObj.globalData.userInfo = { avatarUrl: '', nickName: '环保达人', points: 1280, level: 3, joinDate: '2026-01-01' }
    })

    test('增加正数积分', () => {
      appObj.updateUserPoints(100)
      expect(appObj.globalData.userInfo.points).toBe(1380)
      expect(wx.setStorageSync).toHaveBeenCalledWith('userInfo', expect.objectContaining({ points: 1380 }))
    })

    test('扣减积分，不低于 0', () => {
      appObj.updateUserPoints(-2000)
      expect(appObj.globalData.userInfo.points).toBe(0)
      expect(wx.setStorageSync).toHaveBeenCalledWith('userInfo', expect.objectContaining({ points: 0 }))
    })

    test('正常扣减积分', () => {
      appObj.updateUserPoints(-280)
      expect(appObj.globalData.userInfo.points).toBe(1000)
      expect(wx.setStorageSync).toHaveBeenCalledWith('userInfo', expect.objectContaining({ points: 1000 }))
    })
  })

  describe('updateUserInfo', () => {
    beforeEach(() => {
      appObj.globalData.userInfo = { avatarUrl: '', nickName: '环保达人', points: 1280, level: 3, joinDate: '2026-01-01' }
    })

    test('合并新信息到 userInfo 并保存', () => {
      appObj.updateUserInfo({ nickName: '新昵称', avatarUrl: 'new.png' })
      expect(appObj.globalData.userInfo).toMatchObject({
        nickName: '新昵称',
        avatarUrl: 'new.png',
        points: 1280,
        level: 3,
        joinDate: '2026-01-01'
      })
      expect(wx.setStorageSync).toHaveBeenCalledWith('userInfo', appObj.globalData.userInfo)
    })
  })

  describe('onLaunch', () => {
    test('调用 initUserInfo 和 getSystemInfo', () => {
      const initSpy = jest.spyOn(appObj, 'initUserInfo')
      const sysSpy = jest.spyOn(appObj, 'getSystemInfo')

      appObj.onLaunch()

      expect(initSpy).toHaveBeenCalled()
      expect(sysSpy).toHaveBeenCalled()

      initSpy.mockRestore()
      sysSpy.mockRestore()
    })
  })
})
