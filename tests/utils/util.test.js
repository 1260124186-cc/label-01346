require('../setup')

const {
  formatDate,
  formatNumber,
  showToast,
  showSuccess,
  showError,
  showLoading,
  hideLoading,
  showModal,
  navigateTo,
  navigateBack,
  switchTab,
  debounce,
  throttle,
  deepClone,
  getStorage,
  setStorage,
  removeStorage,
  generateId,
  isEmpty
} = require('../../frontend-mp/utils/util')

describe('formatDate', () => {
  test('null 返回空字符串', () => {
    expect(formatDate(null)).toBe('')
  })

  test('undefined 返回空字符串', () => {
    expect(formatDate(undefined)).toBe('')
  })

  test('无效日期返回空字符串', () => {
    expect(formatDate('invalid-date')).toBe('')
  })

  test('有效日期默认格式 YYYY-MM-DD', () => {
    const date = new Date(2026, 5, 16)
    const result = formatDate(date)
    expect(result).toBe('2026-06-16')
  })

  test('格式 YYYY-MM-DD HH:mm:ss', () => {
    const date = new Date(2026, 5, 16, 10, 30, 45)
    const result = formatDate(date, 'YYYY-MM-DD HH:mm:ss')
    expect(result).toBe('2026-06-16 10:30:45')
  })

  test('时间戳输入', () => {
    const timestamp = new Date(2026, 0, 1).getTime()
    const result = formatDate(timestamp)
    expect(result).toBe('2026-01-01')
  })

  test('字符串输入', () => {
    const result = formatDate('2026-06-16')
    expect(result).toBe('2026-06-16')
  })
})

describe('formatNumber', () => {
  test('非数字返回 0', () => {
    expect(formatNumber('abc')).toBe('0')
  })

  test('null 返回 0', () => {
    expect(formatNumber(null)).toBe('0')
  })

  test('undefined 返回 0', () => {
    expect(formatNumber(undefined)).toBe('0')
  })

  test('普通数字', () => {
    expect(formatNumber(123)).toBe('123')
  })

  test('千分位分隔 12345', () => {
    expect(formatNumber(12345)).toBe('12,345')
  })

  test('千分位分隔 1234567', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })
})

describe('showToast', () => {
  beforeEach(() => {
    wx.showToast.mockClear()
  })

  test('调用 wx.showToast 传入正确参数', () => {
    showToast('提示内容', 'none', 3000)
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '提示内容',
      icon: 'none',
      duration: 3000,
      mask: false
    })
  })

  test('默认参数', () => {
    showToast('提示')
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '提示',
      icon: 'none',
      duration: 2000,
      mask: false
    })
  })
})

describe('showSuccess', () => {
  beforeEach(() => {
    wx.showToast.mockClear()
  })

  test('调用 showToast 传入 success icon', () => {
    showSuccess('操作成功')
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '操作成功',
      icon: 'success',
      duration: 2000,
      mask: false
    })
  })
})

describe('showError', () => {
  beforeEach(() => {
    wx.showToast.mockClear()
  })

  test('调用 showToast 传入 error icon', () => {
    showError('操作失败')
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '操作失败',
      icon: 'error',
      duration: 2000,
      mask: false
    })
  })
})

describe('showLoading', () => {
  beforeEach(() => {
    wx.showLoading.mockClear()
  })

  test('默认提示文字', () => {
    showLoading()
    expect(wx.showLoading).toHaveBeenCalledWith({
      title: '加载中...',
      mask: true
    })
  })

  test('自定义提示文字', () => {
    showLoading('请稍候')
    expect(wx.showLoading).toHaveBeenCalledWith({
      title: '请稍候',
      mask: true
    })
  })
})

describe('hideLoading', () => {
  beforeEach(() => {
    wx.hideLoading.mockClear()
  })

  test('调用 wx.hideLoading', () => {
    hideLoading()
    expect(wx.hideLoading).toHaveBeenCalled()
  })
})

describe('showModal', () => {
  beforeEach(() => {
    wx.showModal.mockClear()
  })

  test('返回 Promise', () => {
    const result = showModal({ title: '提示', content: '内容' })
    expect(result).toBeInstanceOf(Promise)
  })

  test('确认时 resolve true', async () => {
    wx.showModal.mockImplementation((options) => {
      options.success({ confirm: true })
    })
    const result = await showModal({ title: '提示', content: '内容' })
    expect(result).toBe(true)
  })

  test('取消时 resolve false', async () => {
    wx.showModal.mockImplementation((options) => {
      options.success({ confirm: false })
    })
    const result = await showModal({ title: '提示', content: '内容' })
    expect(result).toBe(false)
  })

  test('fail 时 resolve false', async () => {
    wx.showModal.mockImplementation((options) => {
      options.fail()
    })
    const result = await showModal({ title: '提示', content: '内容' })
    expect(result).toBe(false)
  })

  test('传入默认参数', () => {
    wx.showModal.mockImplementation((options) => {
      options.success({ confirm: true })
    })
    showModal({ title: '标题', content: '内容' })
    expect(wx.showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '标题',
        content: '内容',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        confirmColor: '#5BBD72'
      })
    )
  })
})

describe('navigateTo', () => {
  beforeEach(() => {
    wx.navigateTo.mockClear()
    wx.switchTab.mockClear()
    wx.showToast.mockClear()
  })

  test('无参数构建正确 URL', () => {
    navigateTo('/pages/index/index')
    expect(wx.navigateTo).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/pages/index/index' })
    )
  })

  test('带参数构建正确 URL', () => {
    navigateTo('/pages/detail/detail', { id: '1', name: 'test' })
    expect(wx.navigateTo).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/pages/detail/detail?id=1&name=test'
      })
    )
  })

  test('跳转失败时回退到 switchTab', () => {
    wx.navigateTo.mockImplementation((options) => {
      options.fail({ errMsg: 'navigateTo fail' })
    })
    navigateTo('/pages/index/index')
    expect(wx.switchTab).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/pages/index/index' })
    )
  })
})

describe('navigateBack', () => {
  beforeEach(() => {
    wx.navigateBack.mockClear()
  })

  test('默认返回一页', () => {
    navigateBack()
    expect(wx.navigateBack).toHaveBeenCalledWith({ delta: 1 })
  })

  test('指定返回页数', () => {
    navigateBack(2)
    expect(wx.navigateBack).toHaveBeenCalledWith({ delta: 2 })
  })
})

describe('switchTab', () => {
  beforeEach(() => {
    wx.switchTab.mockClear()
  })

  test('调用 wx.switchTab', () => {
    switchTab('/pages/index/index')
    expect(wx.switchTab).toHaveBeenCalledWith({ url: '/pages/index/index' })
  })
})

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('函数被延迟执行', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 300)
    debounced()
    expect(fn).not.toHaveBeenCalled()
    jest.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('只执行最后一次调用', () => {
    const fn = jest.fn()
    const debounced = debounce(fn, 300)
    debounced('a')
    debounced('b')
    debounced('c')
    jest.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('c')
  })
})

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  test('时间间隔内只执行一次', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 300)
    throttled()
    throttled()
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('间隔过后可以再次执行', () => {
    const fn = jest.fn()
    const throttled = throttle(fn, 300)
    throttled()
    jest.advanceTimersByTime(300)
    throttled()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('deepClone', () => {
  test('null 返回 null', () => {
    expect(deepClone(null)).toBe(null)
  })

  test('原始类型直接返回', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('hello')).toBe('hello')
    expect(deepClone(true)).toBe(true)
  })

  test('数组深拷贝', () => {
    const arr = [1, 2, 3]
    const cloned = deepClone(arr)
    expect(cloned).toEqual(arr)
    expect(cloned).not.toBe(arr)
  })

  test('嵌套对象深拷贝', () => {
    const obj = { a: { b: { c: 1 } }, d: [1, 2] }
    const cloned = deepClone(obj)
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj)
    expect(cloned.a).not.toBe(obj.a)
    expect(cloned.d).not.toBe(obj.d)
  })

  test('Date 深拷贝', () => {
    const date = new Date(2026, 5, 16)
    const cloned = deepClone(date)
    expect(cloned).toEqual(date)
    expect(cloned).not.toBe(date)
  })
})

describe('getStorage', () => {
  beforeEach(() => {
    const { storage } = require('../setup')
    Object.keys(storage).forEach(key => delete storage[key])
    wx.getStorageSync.mockClear()
  })

  test('存在时返回值', () => {
    wx.getStorageSync.mockReturnValue('value1')
    expect(getStorage('key1')).toBe('value1')
  })

  test('不存在时返回默认值', () => {
    wx.getStorageSync.mockReturnValue('')
    expect(getStorage('key2', 'default')).toBe('default')
  })

  test('出错时返回默认值', () => {
    wx.getStorageSync.mockImplementation(() => {
      throw new Error('read error')
    })
    expect(getStorage('key3', 'fallback')).toBe('fallback')
  })
})

describe('setStorage', () => {
  beforeEach(() => {
    wx.setStorageSync.mockClear()
  })

  test('调用 wx.setStorageSync', () => {
    setStorage('key', 'value')
    expect(wx.setStorageSync).toHaveBeenCalledWith('key', 'value')
  })
})

describe('removeStorage', () => {
  beforeEach(() => {
    wx.removeStorageSync.mockClear()
  })

  test('调用 wx.removeStorageSync', () => {
    removeStorage('key')
    expect(wx.removeStorageSync).toHaveBeenCalledWith('key')
  })
})

describe('generateId', () => {
  test('返回字符串', () => {
    expect(typeof generateId()).toBe('string')
  })

  test('UUID 格式', () => {
    const id = generateId()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  test('每次生成不同 ID', () => {
    const id1 = generateId()
    const id2 = generateId()
    expect(id1).not.toBe(id2)
  })
})

describe('isEmpty', () => {
  test('null 返回 true', () => {
    expect(isEmpty(null)).toBe(true)
  })

  test('undefined 返回 true', () => {
    expect(isEmpty(undefined)).toBe(true)
  })

  test('空字符串返回 true', () => {
    expect(isEmpty('')).toBe(true)
  })

  test('空白字符串返回 true', () => {
    expect(isEmpty('   ')).toBe(true)
  })

  test('空数组返回 true', () => {
    expect(isEmpty([])).toBe(true)
  })

  test('空对象返回 true', () => {
    expect(isEmpty({})).toBe(true)
  })

  test('非空字符串返回 false', () => {
    expect(isEmpty('hello')).toBe(false)
  })

  test('非空数组返回 false', () => {
    expect(isEmpty([1])).toBe(false)
  })

  test('非空对象返回 false', () => {
    expect(isEmpty({ a: 1 })).toBe(false)
  })

  test('数字返回 false', () => {
    expect(isEmpty(0)).toBe(false)
  })

  test('布尔值返回 false', () => {
    expect(isEmpty(false)).toBe(false)
  })
})
