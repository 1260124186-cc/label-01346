/**
 * 统一路由解析器
 * @description 支持多种 linkType 的统一跳转解析
 * 支持类型：page / activity / course / webview / miniProgram
 */

const { showToast, navigateTo, switchTab } = require('./util')

const LINK_TYPES = {
  PAGE: 'page',
  ACTIVITY: 'activity',
  COURSE: 'course',
  WEBVIEW: 'webview',
  MINI_PROGRAM: 'miniProgram'
}

const TAB_PAGES = [
  '/pages/index/index',
  '/pages/exchange/exchange',
  '/pages/profile/profile'
]

/**
 * 解析并跳转路由
 * @param {Object} options 跳转配置
 * @param {string} options.linkType 跳转类型
 * @param {string} options.linkId 跳转ID
 * @param {string} options.linkUrl 跳转URL（page/webview 类型用）
 * @param {Object} options.params 额外参数
 * @param {string} options.appId 小程序 appId（miniProgram 类型用）
 * @param {string} options.path 小程序路径（miniProgram 类型用）
 * @param {Object} options.extraData 小程序额外数据（miniProgram 类型用）
 * @param {string} options.envVersion 小程序版本（miniProgram 类型用）
 * @returns {boolean} 是否成功跳转
 */
const navigateByLinkType = (options = {}) => {
  const { linkType, linkId, linkUrl, params = {}, appId, path, extraData, envVersion } = options

  if (!linkType) {
    console.warn('[router] 缺少 linkType')
    return false
  }

  console.log('[router] 路由跳转', linkType, options)

  switch (linkType) {
    case LINK_TYPES.PAGE:
      return navigateToPage(linkUrl, params)
    case LINK_TYPES.ACTIVITY:
      return navigateToActivity(linkId, params)
    case LINK_TYPES.COURSE:
      return navigateToCourse(linkId, params)
    case LINK_TYPES.WEBVIEW:
      return navigateToWebview(linkUrl, params)
    case LINK_TYPES.MINI_PROGRAM:
      return navigateToMiniProgram({ appId, path, extraData, envVersion })
    default:
      console.warn('[router] 不支持的 linkType:', linkType)
      return false
  }
}

/**
 * 跳转到内部页面
 * @param {string} url 页面路径
 * @param {Object} params 参数
 */
const navigateToPage = (url, params = {}) => {
  if (!url) {
    console.warn('[router] 页面路径为空')
    return false
  }

  const isTabPage = TAB_PAGES.some(tab => url.startsWith(tab) || url === tab.split('?')[0])

  if (isTabPage) {
    switchTab(url.split('?')[0])
  } else {
    navigateTo(url, params)
  }
  return true
}

/**
 * 跳转到活动页面
 * @param {string} activityId 活动ID
 * @param {Object} params 参数
 */
const navigateToActivity = (activityId, params = {}) => {
  const url = '/pages/activity/activity'
  const query = { id: activityId || '1', ...params }
  navigateTo(url, query)
  return true
}

/**
 * 跳转到课程页面
 * @param {string} courseId 课程ID
 * @param {Object} params 参数
 */
const navigateToCourse = (courseId, params = {}) => {
  if (courseId) {
    const url = '/pages/course-detail/course-detail'
    navigateTo(url, { id: courseId, ...params })
  } else {
    navigateTo('/pages/learning-center/learning-center', params)
  }
  return true
}

/**
 * 跳转到 webview 页面
 * @param {string} url webview URL
 * @param {Object} params 参数
 */
const navigateToWebview = (url, params = {}) => {
  if (!url) {
    showToast('链接地址无效')
    return false
  }

  const encodedUrl = encodeURIComponent(url)
  const webviewPage = '/pages/webview/webview'
  navigateTo(webviewPage, { url: encodedUrl, ...params })
  return true
}

/**
 * 跳转到其他小程序
 * @param {Object} options 配置
 * @param {string} options.appId 小程序 appId
 * @param {string} options.path 小程序路径
 * @param {Object} options.extraData 额外数据
 * @param {string} options.envVersion 版本类型：develop / trial / release
 */
const navigateToMiniProgram = (options = {}) => {
  const { appId, path = '', extraData = {}, envVersion = 'release' } = options

  if (!appId) {
    console.warn('[router] 缺少小程序 appId')
    showToast('跳转失败')
    return false
  }

  wx.navigateToMiniProgram({
    appId,
    path,
    extraData,
    envVersion,
    success: () => {
      console.log('[router] 跳转小程序成功', appId)
    },
    fail: (err) => {
      console.error('[router] 跳转小程序失败', err)
      showToast('跳转失败')
    }
  })
  return true
}

/**
 * 处理轮播图点击跳转
 * @param {Object} banner 轮播图数据
 */
const handleBannerTap = (banner) => {
  if (!banner || !banner.linkType) {
    return false
  }
  return navigateByLinkType({
    linkType: banner.linkType,
    linkId: banner.linkId,
    linkUrl: banner.linkUrl,
    appId: banner.appId,
    path: banner.miniPath,
    extraData: banner.extraData
  })
}

module.exports = {
  LINK_TYPES,
  navigateByLinkType,
  navigateToPage,
  navigateToActivity,
  navigateToCourse,
  navigateToWebview,
  navigateToMiniProgram,
  handleBannerTap
}
