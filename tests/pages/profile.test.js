require('../setup')

const { PROFILE_MENUS, getUserLevel } = require('../../frontend-mp/utils/constants')
const util = require('../../frontend-mp/utils/util')

jest.spyOn(util, 'showToast')
jest.spyOn(util, 'showModal')
jest.spyOn(util, 'navigateTo')

global.Page = jest.fn(obj => obj)

require('../../frontend-mp/pages/profile/profile')

const pageDef = global.Page.mock.calls[global.Page.mock.calls.length - 1][0]
const moduleApp = getApp.mock.results[getApp.mock.results.length - 1].value

let pageInstance

beforeEach(() => {
  pageInstance = Object.create(pageDef)
  pageInstance.data = JSON.parse(JSON.stringify(pageDef.data))
  pageInstance.setData = jest.fn(function (updates) {
    Object.assign(this.data, updates)
  })
  wx.showToast.mockClear()
  wx.showModal.mockClear()
  wx.showActionSheet.mockClear()
  wx.chooseImage.mockClear()
  wx.navigateTo.mockClear()
  util.showToast.mockClear()
  util.showModal.mockClear()
  util.navigateTo.mockClear()
  moduleApp.updateUserInfo.mockClear()
  moduleApp.globalData.userInfo = {
    avatarUrl: '',
    nickName: '环保达人',
    points: 1280,
    level: 3,
    joinDate: '2026-01-01'
  }
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('profile page data', () => {
  test('has correct initial data', () => {
    expect(pageInstance.data.userInfo).toEqual({
      avatarUrl: '',
      nickName: '环保达人',
      points: 0,
      level: 1,
      joinDate: ''
    })
    expect(pageInstance.data.menuList).toStrictEqual(PROFILE_MENUS)
    expect(pageInstance.data.statistics).toEqual([
      { id: 'classify', label: '分类次数', value: 128 },
      { id: 'points', label: '累计积分', value: 2580 },
      { id: 'days', label: '连续打卡', value: 15 }
    ])
    expect(pageInstance.data.isUploading).toBe(false)
  })
})

describe('initUserInfo / refreshUserInfo', () => {
  test('refreshUserInfo loads from app.globalData.userInfo and calls getUserLevel for levelInfo', () => {
    const userInfo = moduleApp.globalData.userInfo
    pageInstance.refreshUserInfo()
    expect(pageInstance.setData).toHaveBeenCalledWith({
      userInfo: { ...userInfo, points: 1280 },
      levelInfo: getUserLevel(1280)
    })
  })
})

describe('onAvatarTap', () => {
  test('calls wx.showActionSheet then chooseAvatar based on selection', () => {
    pageInstance.chooseAvatar = jest.fn()
    wx.showActionSheet.mockImplementationOnce((options) => {
      options.success({ tapIndex: 0 })
    })
    pageInstance.onAvatarTap()
    expect(wx.showActionSheet).toHaveBeenCalledWith(
      expect.objectContaining({ itemList: ['从相册选择', '拍照'] })
    )
    expect(pageInstance.chooseAvatar).toHaveBeenCalledWith(['album'])
  })
})

describe('chooseAvatar', () => {
  test('calls wx.chooseImage with correct params, on success calls uploadAvatar', () => {
    pageInstance.uploadAvatar = jest.fn()
    wx.chooseImage.mockImplementationOnce((options) => {
      options.success({ tempFilePaths: ['/tmp/test.jpg'] })
    })
    pageInstance.chooseAvatar(['album'])
    expect(wx.chooseImage).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album']
      })
    )
    expect(pageInstance.uploadAvatar).toHaveBeenCalledWith('/tmp/test.jpg')
  })
})

describe('uploadAvatar', () => {
  test('sets isUploading=true, after timeout sets avatarUrl, calls app.updateUserInfo, sets isUploading=false', () => {
    pageInstance.uploadAvatar('/tmp/avatar.jpg')

    expect(pageInstance.setData).toHaveBeenCalledWith({ isUploading: true })

    jest.advanceTimersByTime(1000)

    expect(moduleApp.updateUserInfo).toHaveBeenCalledWith({ avatarUrl: '/tmp/avatar.jpg' })
    expect(pageInstance.setData).toHaveBeenCalledWith(
      expect.objectContaining({
        isUploading: false
      })
    )
    const lastCall = pageInstance.setData.mock.calls[pageInstance.setData.mock.calls.length - 1][0]
    expect(lastCall.userInfo.avatarUrl).toBe('/tmp/avatar.jpg')
    expect(util.showToast).toHaveBeenCalledWith('头像更新成功')
  })
})

describe('onNickNameTap', () => {
  test('calls wx.showModal with editable:true, on confirm with valid content calls app.updateUserInfo and refreshUserInfo', () => {
    pageInstance.refreshUserInfo = jest.fn()
    wx.showModal.mockImplementationOnce((options) => {
      options.success({ confirm: true, content: '新昵称' })
    })
    pageInstance.onNickNameTap()
    expect(wx.showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '修改昵称',
        editable: true,
        placeholderText: '请输入新昵称'
      })
    )
    expect(moduleApp.updateUserInfo).toHaveBeenCalledWith({ nickName: '新昵称' })
    expect(pageInstance.refreshUserInfo).toHaveBeenCalled()
    expect(util.showToast).toHaveBeenCalledWith('昵称修改成功')
  })
})

describe('onMenuTap', () => {
  test('when item.link exists calls navigateTo', () => {
    pageInstance.onMenuTap({ currentTarget: { dataset: { item: { id: 'quiz', link: '/pages/quiz/quiz' } } } })
    expect(util.navigateTo).toHaveBeenCalledWith('/pages/quiz/quiz')
  })

  test('when no link calls showAbout for about id', () => {
    pageInstance.showAbout = jest.fn()
    pageInstance.onMenuTap({ currentTarget: { dataset: { item: { id: 'about', link: '' } } } })
    expect(pageInstance.showAbout).toHaveBeenCalled()
  })
})

describe('showAbout', () => {
  test('calls wx.showModal', () => {
    pageInstance.showAbout()
    expect(wx.showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '关于我们',
        showCancel: false,
        confirmText: '知道了'
      })
    )
  })
})

describe('onStatTap', () => {
  test('calls showToast with label and value', () => {
    pageInstance.onStatTap({ currentTarget: { dataset: { item: { label: '分类次数', value: 128 } } } })
    expect(util.showToast).toHaveBeenCalledWith('分类次数：128')
  })
})

describe('onShareAppMessage', () => {
  test('returns correct title and path', () => {
    const result = pageInstance.onShareAppMessage()
    expect(result).toEqual({
      title: '垃圾分类助手 - 一起来保护环境吧',
      path: '/pages/index/index',
      imageUrl: ''
    })
  })
})
