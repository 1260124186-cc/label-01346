/**
 * 运营配置模块
 * @description 支持远程拉取运营配置、本地缓存、生效时间、A/B 测试
 */

const { getStorage, setStorage, formatDate, generateId } = require('./util')

const OPERATION_CONFIG_KEY = 'operationConfigData'
const CONFIG_CACHE_TIME = 30 * 60 * 1000
const AB_TEST_BUCKET_KEY = 'abTestBucket'

const defaultConfig = {
  banners: [],
  ecoTips: [],
  hotNews: [],
  quickActions: [],
  lastFetchTime: 0,
  version: '0'
}

let configCache = null

const getRemoteConfigUrl = () => {
  return 'https://example.com/api/operation/config.json'
}

const fetchRemoteConfig = () => {
  return new Promise((resolve, reject) => {
    const url = getRemoteConfigUrl()

    console.log('[operationConfig] 开始拉取远程配置')

    wx.request({
      url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          const config = res.data.data
          config.lastFetchTime = Date.now()
          saveConfig(config)
          console.log('[operationConfig] 远程配置拉取成功', config.version)
          resolve(config)
        } else {
          console.warn('[operationConfig] 远程配置拉取失败', res)
          reject(new Error('配置拉取失败'))
        }
      },
      fail: (err) => {
        console.error('[operationConfig] 远程配置请求失败', err)
        reject(err)
      }
    })
  })
}

const saveConfig = (config) => {
  try {
    configCache = { ...config }
    setStorage(OPERATION_CONFIG_KEY, config)
  } catch (e) {
    console.error('[operationConfig] 保存配置失败', e)
  }
}

const loadCachedConfig = () => {
  try {
    const cached = getStorage(OPERATION_CONFIG_KEY, null)
    if (cached && typeof cached === 'object') {
      configCache = { ...cached }
      return cached
    }
  } catch (e) {
    console.error('[operationConfig] 加载缓存配置失败', e)
  }
  return null
}

const getConfig = (forceRefresh = false) => {
  return new Promise((resolve) => {
    const cachedConfig = configCache || loadCachedConfig()
    const now = Date.now()

    if (!forceRefresh && cachedConfig && (now - (cachedConfig.lastFetchTime || 0) < CONFIG_CACHE_TIME)) {
      console.log('[operationConfig] 使用缓存配置')
      resolve(cachedConfig)
      return
    }

    fetchRemoteConfig()
      .then(config => resolve(config))
      .catch(() => {
        console.warn('[operationConfig] 使用本地配置兜底')
        resolve(cachedConfig || defaultConfig)
      })
  })
}

const isTimeEffective = (item) => {
  if (!item) return false

  const now = Date.now()

  if (item.startTime) {
    const startTime = new Date(item.startTime).getTime()
    if (now < startTime) {
      return false
    }
  }

  if (item.endTime) {
    const endTime = new Date(item.endTime).getTime()
    if (now > endTime) {
      return false
    }
  }

  return true
}

const filterEffectiveItems = (items = []) => {
  return items.filter(item => isTimeEffective(item))
}

const getAbTestBucket = () => {
  try {
    let bucket = getStorage(AB_TEST_BUCKET_KEY, null)
    if (!bucket) {
      bucket = Math.random() < 0.5 ? 'A' : 'B'
      setStorage(AB_TEST_BUCKET_KEY, bucket)
      console.log('[operationConfig] 分配 A/B 测试分组:', bucket)
    }
    return bucket
  } catch (e) {
    console.error('[operationConfig] 获取 A/B 分组失败', e)
    return 'A'
  }
}

const resolveAbTestContent = (item) => {
  if (!item) return null

  if (!item.abTest || !item.variants) {
    return item
  }

  const bucket = getAbTestBucket()
  const variant = item.variants.find(v => v.group === bucket)

  if (variant) {
    console.log('[operationConfig] A/B 测试命中分组:', bucket, variant)
    return {
      ...item,
      ...variant,
      abGroup: bucket,
      variants: undefined
    }
  }

  return item
}

const getBanners = async () => {
  const config = await getConfig()
  const banners = filterEffectiveItems(config.banners || [])
  return banners.map(banner => resolveAbTestContent(banner))
}

const getEcoTips = async () => {
  const config = await getConfig()
  const tips = filterEffectiveItems(config.ecoTips || [])
  return tips.map(tip => resolveAbTestContent(tip))
}

const getHotNews = async () => {
  const config = await getConfig()
  const news = filterEffectiveItems(config.hotNews || [])
  return news.map(item => resolveAbTestContent(item))
}

const getQuickActions = async () => {
  const config = await getConfig()
  const actions = filterEffectiveItems(config.quickActions || [])
  return actions.map(action => resolveAbTestContent(action))
}

const refreshConfig = () => {
  return getConfig(true)
}

const getLocalConfig = () => {
  return configCache || loadCachedConfig() || defaultConfig
}

const setMockConfig = (config) => {
  config.lastFetchTime = Date.now()
  saveConfig(config)
  console.log('[operationConfig] 已设置 Mock 配置')
}

module.exports = {
  getConfig,
  refreshConfig,
  getBanners,
  getEcoTips,
  getHotNews,
  getQuickActions,
  getLocalConfig,
  isTimeEffective,
  filterEffectiveItems,
  getAbTestBucket,
  resolveAbTestContent,
  setMockConfig,
  defaultConfig
}
