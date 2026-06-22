/**
 * 商品条码数据库模块
 * @description 维护 BARCODE_DB（条码、商品名、组合包装ID），支持扫描历史与收藏
 */

const {
  getCompositePackagingById,
  searchCompositePackaging
} = require('./packaging')

const BARCODE_DB = [
  {
    id: 'bc-001',
    barcode: '6901028180009',
    barcodeType: 'EAN13',
    productName: '蒙牛纯牛奶 250ml',
    brand: '蒙牛',
    emoji: '🥛',
    packagingId: 'pkg-003',
    materials: ['纸', '铝箔', '塑料(PE)'],
    description: '利乐包由纸、铝、塑多层复合而成，属于可回收物，有专门的回收再生工艺。',
    category: 'beverage',
    source: 'public_db',
    verified: true
  },
  {
    id: 'bc-002',
    barcode: '6925303721294',
    barcodeType: 'EAN13',
    productName: '可口可乐 330ml 罐装',
    brand: '可口可乐',
    emoji: '🥫',
    packagingId: 'pkg-007',
    materials: ['铝(罐体)', '铁(拉环)'],
    description: '金属易拉罐可100%回收再利用，回收能耗远低于原生矿冶炼。',
    category: 'beverage',
    source: 'public_db',
    verified: true
  },
  {
    id: 'bc-003',
    barcode: '6901234567890',
    barcodeType: 'EAN13',
    productName: '农夫山泉 550ml',
    brand: '农夫山泉',
    emoji: '🧴',
    packagingId: 'pkg-004',
    materials: ['PET塑料(瓶身)', 'PE塑料(瓶盖)', 'PVC标签纸'],
    description: 'PET塑料瓶可回收，标签纸属其他垃圾，瓶盖可连同瓶身一起投放。',
    category: 'beverage',
    source: 'public_db',
    verified: true
  },
  {
    id: 'bc-004',
    barcode: '6902083888015',
    barcodeType: 'EAN13',
    productName: '康师傅方便面 红烧牛肉面',
    brand: '康师傅',
    emoji: '🍜',
    packagingId: 'pkg-006',
    materials: ['塑料(面碗)', '塑料(包装袋)', '塑料(封膜)', '纸(外包装)'],
    description: '方便面包含多种包装和食材，需逐一拆解分类。塑料面碗因被食物污染属其他垃圾。',
    category: 'food_delivery',
    source: 'public_db',
    verified: true
  },
  {
    id: 'bc-005',
    barcode: '6901234567005',
    barcodeType: 'EAN13',
    productName: '布洛芬缓释胶囊 20粒',
    brand: '中美史克',
    emoji: '💊',
    packagingId: 'pkg-005',
    materials: ['铝箔(泡罩)', '纸(纸盒)', '塑料(药瓶)'],
    description: '药品包装含多种材质，需仔细拆解分类，特别注意过期药品属有害垃圾。',
    category: 'medical',
    source: 'public_db',
    verified: true
  },
  {
    id: 'bc-006',
    barcode: '6901234567012',
    barcodeType: 'EAN13',
    productName: 'iPhone 15 Pro 包装盒',
    brand: 'Apple',
    emoji: '📱',
    packagingId: 'pkg-009',
    materials: ['纸(外包装盒)', '塑料(内托)', '塑料(防静电袋)', '纸(说明书)'],
    description: '电子产品包装含多种材质，拆解后可分类回收。',
    category: 'electronics',
    source: 'public_db',
    verified: true
  },
  {
    id: 'bc-007',
    barcode: 'SF1234567890123',
    barcodeType: 'QRCODE',
    productName: '顺丰快递包裹',
    brand: '顺丰速运',
    emoji: '📦',
    packagingId: 'pkg-002',
    materials: ['纸(纸箱)', 'BOPP胶带', 'PE(气泡膜)', '塑料(封套)'],
    description: '快递包裹包含多种包装材料，拆解后可大幅提升回收效率。',
    category: 'express',
    source: 'user_contributed',
    verified: true
  },
  {
    id: 'bc-008',
    barcode: '6901234567029',
    barcodeType: 'EAN13',
    productName: '美团外卖餐盒套装',
    brand: '美团外卖',
    emoji: '🍱',
    packagingId: 'pkg-001',
    materials: ['塑料(餐盒)', '塑料(塑料袋)', '竹(筷子)'],
    description: '外卖餐盒通常由多个不同材质的部件组成，需要拆解后分别投放。',
    category: 'food_delivery',
    source: 'user_contributed',
    verified: true
  },
  {
    id: 'bc-009',
    barcode: '6901234567036',
    barcodeType: 'EAN13',
    productName: '优衣库 衣服快递袋',
    brand: '优衣库',
    emoji: '👗',
    packagingId: 'pkg-008',
    materials: ['塑料(快递袋)', '塑料(衣服包装袋)', '纸(吊牌)', '棉(衣物)'],
    description: '衣服快递包含多种包装材料，可分别回收处理。',
    category: 'express',
    source: 'user_contributed',
    verified: true
  },
  {
    id: 'bc-010',
    barcode: '6901234567043',
    barcodeType: 'EAN13',
    productName: '鲜花礼盒',
    brand: '花点时间',
    emoji: '💐',
    packagingId: 'pkg-010',
    materials: ['花材', '包装纸', '塑料(花泥)', '丝带'],
    description: '花束包含鲜花和多种包装材料，需拆解后分别投放。',
    category: 'daily',
    source: 'user_contributed',
    verified: true
  }
]

const SCAN_HISTORY_KEY = 'barcode_scan_history'
const FAVORITE_BARCODES_KEY = 'favorite_barcodes'
const MAX_SCAN_HISTORY = 50
const USER_BARCODES_KEY = 'user_contributed_barcodes'

const BARCODE_CATEGORIES = [
  { id: 'beverage', name: '饮料瓶罐', emoji: '🥛' },
  { id: 'food_delivery', name: '外卖餐食', emoji: '🍱' },
  { id: 'express', name: '快递包裹', emoji: '📦' },
  { id: 'medical', name: '药品医疗', emoji: '💊' },
  { id: 'food', name: '食品罐头', emoji: '🥫' },
  { id: 'electronics', name: '电子产品', emoji: '📱' },
  { id: 'daily', name: '日常生活', emoji: '💐' },
  { id: 'other', name: '其他物品', emoji: '📦' }
]

function getAllBarcodeDb() {
  return BARCODE_DB
}

function getBarcodeByCode(barcode) {
  if (!barcode) return null
  const code = String(barcode).trim()
  return BARCODE_DB.find(b => b.barcode === code) || null
}

function searchBarcodeDb(keyword) {
  if (!keyword || !keyword.trim()) return []
  const kw = keyword.trim().toLowerCase()
  return BARCODE_DB.filter(b =>
    b.productName.toLowerCase().includes(kw) ||
    b.brand.toLowerCase().includes(kw) ||
    b.barcode.includes(kw) ||
    b.materials.some(m => m.toLowerCase().includes(kw))
  )
}

function getBarcodeProductDetail(barcode) {
  const entry = getBarcodeByCode(barcode)
  if (!entry) return null

  const packaging = entry.packagingId ? getCompositePackagingById(entry.packagingId) : null
  return {
    ...entry,
    packaging: packaging
  }
}

function getScanHistory() {
  try {
    const history = wx.getStorageSync(SCAN_HISTORY_KEY)
    return Array.isArray(history) ? history : []
  } catch (e) {
    console.error('[Barcode] 获取扫描历史失败', e)
    return []
  }
}

function addScanHistory(item) {
  if (!item) return
  
  try {
    let history = getScanHistory()
    history = history.filter(h => h.barcode !== item.barcode)
    history.unshift({
      ...item,
      scanTime: Date.now()
    })
    if (history.length > MAX_SCAN_HISTORY) {
      history = history.slice(0, MAX_SCAN_HISTORY)
    }
    wx.setStorageSync(SCAN_HISTORY_KEY, history)
  } catch (e) {
    console.error('[Barcode] 保存扫描历史失败', e)
  }
}

function clearScanHistory() {
  try {
    wx.setStorageSync(SCAN_HISTORY_KEY, [])
  } catch (e) {
    console.error('[Barcode] 清空扫描历史失败', e)
  }
}

function getFavoriteBarcodes() {
  try {
    const favorites = wx.getStorageSync(FAVORITE_BARCODES_KEY)
    return Array.isArray(favorites) ? favorites : []
  } catch (e) {
    console.error('[Barcode] 获取收藏商品失败', e)
    return []
  }
}

function isFavoriteBarcode(barcode) {
  const favorites = getFavoriteBarcodes()
  return favorites.some(f => f.barcode === barcode)
}

function addFavoriteBarcode(item) {
  if (!item) return false
  if (isFavoriteBarcode(item.barcode)) return false

  try {
    let favorites = getFavoriteBarcodes()
    favorites.unshift({
      ...item,
      addedAt: Date.now()
    })
    wx.setStorageSync(FAVORITE_BARCODES_KEY, favorites)
    return true
  } catch (e) {
    console.error('[Barcode] 收藏商品失败', e)
    return false
  }
}

function removeFavoriteBarcode(barcode) {
  if (!barcode) return false

  try {
    let favorites = getFavoriteBarcodes()
    favorites = favorites.filter(f => f.barcode !== barcode)
    wx.setStorageSync(FAVORITE_BARCODES_KEY, favorites)
    return true
  } catch (e) {
    console.error('[Barcode] 取消收藏失败', e)
    return false
  }
}

function toggleFavoriteBarcode(item) {
  if (!item) return false
  if (isFavoriteBarcode(item.barcode)) {
    removeFavoriteBarcode(item.barcode)
    return false
  } else {
    addFavoriteBarcode(item)
    return true
  }
}

function getUserContributedBarcodes() {
  try {
    const userBarcodes = wx.getStorageSync(USER_BARCODES_KEY)
    return Array.isArray(userBarcodes) ? userBarcodes : []
  } catch (e) {
    console.error('[Barcode] 获取用户贡献条码失败', e)
    return []
  }
}

function addUserContributedBarcode(item) {
  if (!item || !item.barcode) return null

  try {
    let userBarcodes = getUserContributedBarcodes()
    const newEntry = {
      ...item,
      id: 'user-' + Date.now(),
      source: 'user_contributed',
      verified: false,
      createdAt: Date.now()
    }
    userBarcodes.unshift(newEntry)
    wx.setStorageSync(USER_BARCODES_KEY, userBarcodes)

    if (BARCODE_DB.every(b => b.barcode !== newEntry.barcode)) {
      BARCODE_DB.unshift(newEntry)
    }

    return newEntry
  } catch (e) {
    console.error('[Barcode] 保存用户贡献条码失败', e)
    return null
  }
}

function getBarcodesByPackagingId(packagingId) {
  if (!packagingId) return []
  return BARCODE_DB.filter(b => b.packagingId === packagingId)
}

module.exports = {
  BARCODE_DB,
  BARCODE_CATEGORIES,
  SCAN_HISTORY_KEY,
  FAVORITE_BARCODES_KEY,
  MAX_SCAN_HISTORY,
  getAllBarcodeDb,
  getBarcodeByCode,
  searchBarcodeDb,
  getBarcodeProductDetail,
  getScanHistory,
  addScanHistory,
  clearScanHistory,
  getFavoriteBarcodes,
  isFavoriteBarcode,
  addFavoriteBarcode,
  removeFavoriteBarcode,
  toggleFavoriteBarcode,
  getUserContributedBarcodes,
  addUserContributedBarcode,
  getBarcodesByPackagingId
}
