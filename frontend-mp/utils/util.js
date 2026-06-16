/**
 * 工具函数模块
 * @description 提供通用的工具函数
 */

/**
 * 格式化日期
 * @param {Date|string|number} date 日期对象、时间戳或日期字符串
 * @param {string} format 格式化模板，默认 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化数字（添加千分位）
 * @param {number} num 数字
 * @returns {string} 格式化后的字符串
 */
const formatNumber = (num) => {
  if (typeof num !== 'number') return '0'
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 显示 Toast 提示
 * @param {string} title 提示内容
 * @param {string} icon 图标类型 'success' | 'error' | 'loading' | 'none'
 * @param {number} duration 显示时长，默认 2000ms
 */
const showToast = (title, icon = 'none', duration = 2000) => {
  wx.showToast({
    title,
    icon,
    duration,
    mask: false
  })
}

/**
 * 显示成功提示
 * @param {string} title 提示内容
 */
const showSuccess = (title) => {
  showToast(title, 'success')
}

/**
 * 显示错误提示
 * @param {string} title 提示内容
 */
const showError = (title) => {
  showToast(title, 'error')
}

/**
 * 显示加载中
 * @param {string} title 提示内容
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载中
 */
const hideLoading = () => {
  wx.hideLoading()
}

/**
 * 显示模态框
 * @param {Object} options 配置项
 * @returns {Promise<boolean>} 用户点击确认返回 true，取消返回 false
 */
const showModal = (options) => {
  return new Promise((resolve) => {
    wx.showModal({
      title: options.title || '提示',
      content: options.content || '',
      showCancel: options.showCancel !== false,
      cancelText: options.cancelText || '取消',
      confirmText: options.confirmText || '确定',
      confirmColor: options.confirmColor || '#5BBD72',
      success: (res) => {
        resolve(res.confirm)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

/**
 * 页面跳转
 * @param {string} url 页面路径
 * @param {Object} params 参数对象
 */
const navigateTo = (url, params = {}) => {
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  
  const fullUrl = queryString ? `${url}?${queryString}` : url
  
  wx.navigateTo({
    url: fullUrl,
    fail: (err) => {
      console.error('[navigateTo] 跳转失败', err)
      // 如果是 tabBar 页面，使用 switchTab
      wx.switchTab({
        url: fullUrl.split('?')[0],
        fail: () => {
          showError('页面跳转失败')
        }
      })
    }
  })
}

/**
 * 返回上一页
 * @param {number} delta 返回的页面数，默认 1
 */
const navigateBack = (delta = 1) => {
  wx.navigateBack({ delta })
}

/**
 * 切换 Tab
 * @param {string} url Tab 页面路径
 */
const switchTab = (url) => {
  wx.switchTab({ url })
}

/**
 * 防抖函数
 * @param {Function} fn 要执行的函数
 * @param {number} delay 延迟时间，默认 300ms
 * @returns {Function} 防抖后的函数
 */
const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn 要执行的函数
 * @param {number} interval 间隔时间，默认 300ms
 * @returns {Function} 节流后的函数
 */
const throttle = (fn, interval = 300) => {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * 深拷贝
 * @param {any} obj 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  
  const cloned = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

/**
 * 获取存储数据
 * @param {string} key 键名
 * @param {any} defaultValue 默认值
 * @returns {any} 存储的数据
 */
const getStorage = (key, defaultValue = null) => {
  try {
    const value = wx.getStorageSync(key)
    return value !== '' ? value : defaultValue
  } catch (e) {
    console.error('[getStorage] 获取存储失败', e)
    return defaultValue
  }
}

/**
 * 设置存储数据
 * @param {string} key 键名
 * @param {any} value 值
 */
const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
  } catch (e) {
    console.error('[setStorage] 设置存储失败', e)
  }
}

/**
 * 移除存储数据
 * @param {string} key 键名
 */
const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch (e) {
    console.error('[removeStorage] 移除存储失败', e)
  }
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 检查是否为空
 * @param {any} value 要检查的值
 * @returns {boolean} 是否为空
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

const { SEARCH_HISTORY_KEY, MAX_SEARCH_HISTORY } = require('./constants')

const getSearchHistory = () => {
  try {
    const history = getStorage(SEARCH_HISTORY_KEY, [])
    return Array.isArray(history) ? history : []
  } catch (e) {
    console.error('[getSearchHistory] 获取搜索历史失败', e)
    return []
  }
}

const addSearchHistory = (keyword) => {
  if (!keyword || keyword.trim() === '') return
  
  try {
    let history = getSearchHistory()
    
    history = history.filter(item => item !== keyword.trim())
    
    history.unshift(keyword.trim())
    
    if (history.length > MAX_SEARCH_HISTORY) {
      history = history.slice(0, MAX_SEARCH_HISTORY)
    }
    
    setStorage(SEARCH_HISTORY_KEY, history)
  } catch (e) {
    console.error('[addSearchHistory] 添加搜索历史失败', e)
  }
}

const removeSearchHistoryItem = (keyword) => {
  if (!keyword) return
  
  try {
    let history = getSearchHistory()
    history = history.filter(item => item !== keyword)
    setStorage(SEARCH_HISTORY_KEY, history)
  } catch (e) {
    console.error('[removeSearchHistoryItem] 删除搜索历史失败', e)
  }
}

const clearSearchHistory = () => {
  try {
    setStorage(SEARCH_HISTORY_KEY, [])
  } catch (e) {
    console.error('[clearSearchHistory] 清空搜索历史失败', e)
  }
}

module.exports = {
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
  isEmpty,
  getSearchHistory,
  addSearchHistory,
  removeSearchHistoryItem,
  clearSearchHistory
}
