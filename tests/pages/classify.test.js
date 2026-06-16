require('../setup')

const { TRASH_TYPES } = require('../../frontend-mp/utils/constants')

describe('Classify Page', () => {
  let pageObj

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
    global.Page = jest.fn(obj => obj)
    jest.resetModules()
    require('../../frontend-mp/pages/classify/classify')
    pageObj = global.Page.mock.results[0].value
    pageObj.setData = jest.fn(function (data) {
      Object.assign(this.data, data)
    })
    pageObj.data.classifyId = 0
    pageObj.data.classifyData = null
    pageObj.data.isLoading = true
    pageObj.data.allTypes = TRASH_TYPES
  })

  describe('onLoad', () => {
    test('有 id 参数时调用 initClassifyData 并设置对应分类数据', () => {
      const initSpy = jest.spyOn(pageObj, 'initClassifyData')
      pageObj.onLoad({ id: '2', name: encodeURIComponent('有害垃圾') })
      expect(initSpy).toHaveBeenCalledWith(2)
      initSpy.mockRestore()
    })

    test('无 id 参数时默认调用 initClassifyData(1)', () => {
      const initSpy = jest.spyOn(pageObj, 'initClassifyData')
      pageObj.onLoad({})
      expect(initSpy).toHaveBeenCalledWith(1)
      initSpy.mockRestore()
    })
  })

  describe('initClassifyData', () => {
    test('找到匹配的分类时设置 classifyId/classifyData/isLoading 并调用导航栏 API', () => {
      pageObj.initClassifyData(1)

      expect(pageObj.setData).toHaveBeenCalledWith({
        classifyId: 1,
        classifyData: TRASH_TYPES[0],
        isLoading: false
      })
      expect(wx.setNavigationBarTitle).toHaveBeenCalledWith({ title: '可回收垃圾' })
      expect(wx.setNavigationBarColor).toHaveBeenCalledWith({
        frontColor: '#ffffff',
        backgroundColor: TRASH_TYPES[0].color,
        animation: { duration: 300, timingFunc: 'easeIn' }
      })
    })

    test('找不到匹配 id 时调用 showToast 错误提示并 navigateBack', () => {
      jest.useFakeTimers()
      pageObj.initClassifyData(999)

      expect(wx.showToast).toHaveBeenCalledWith({
        title: '分类数据加载失败',
        icon: 'none',
        duration: 2000,
        mask: false
      })
      expect(wx.navigateBack).not.toHaveBeenCalled()

      jest.advanceTimersByTime(1500)
      expect(wx.navigateBack).toHaveBeenCalledWith({ delta: 1 })

      jest.useRealTimers()
    })
  })

  describe('onSwitchType', () => {
    test('切换到不同 id 时先设置 loading 再调用 initClassifyData', () => {
      jest.useFakeTimers()
      pageObj.data.classifyId = 1
      const initSpy = jest.spyOn(pageObj, 'initClassifyData')

      pageObj.onSwitchType({ currentTarget: { dataset: { id: 2 } } })

      expect(pageObj.setData).toHaveBeenCalledWith({ isLoading: true })

      jest.advanceTimersByTime(200)
      expect(initSpy).toHaveBeenCalledWith(2)

      initSpy.mockRestore()
      jest.useRealTimers()
    })

    test('切换到相同 id 时不做任何操作', () => {
      pageObj.data.classifyId = 1
      const initSpy = jest.spyOn(pageObj, 'initClassifyData')

      pageObj.onSwitchType({ currentTarget: { dataset: { id: 1 } } })

      expect(pageObj.setData).not.toHaveBeenCalled()
      expect(initSpy).not.toHaveBeenCalled()

      initSpy.mockRestore()
    })
  })

  describe('onExampleTap', () => {
    test('调用 wx.showModal 显示 item 的 name 和 desc', () => {
      pageObj.data.classifyData = TRASH_TYPES[0]
      const item = { name: '废纸张', desc: '报纸、书本、纸箱、快递盒等' }

      pageObj.onExampleTap({ currentTarget: { dataset: { item } } })

      expect(wx.showModal).toHaveBeenCalledWith({
        title: '废纸张',
        content: '报纸、书本、纸箱、快递盒等',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: TRASH_TYPES[0].color
      })
    })
  })

  describe('goBack', () => {
    test('调用 navigateBack', () => {
      pageObj.goBack()
      expect(wx.navigateBack).toHaveBeenCalledWith({ delta: 1 })
    })
  })

  describe('onShareAppMessage', () => {
    test('返回包含 classifyData.name 的标题和含 id、name 参数的路径', () => {
      pageObj.data.classifyData = TRASH_TYPES[0]

      const result = pageObj.onShareAppMessage()

      expect(result.title).toBe('可回收垃圾 - 垃圾分类知识')
      expect(result.path).toBe(`/pages/classify/classify?id=1&name=${encodeURIComponent('可回收垃圾')}`)
      expect(result.imageUrl).toBe('')
    })
  })
})
