/**
 * 拍照识别模拟数据
 * @description 模拟AI识别结果的mock数据
 */

const RECOGNIZE_MOCK_RESULTS = [
  {
    id: 1,
    name: '塑料瓶',
    typeId: 1,
    typeName: '可回收垃圾',
    emoji: '🧴',
    confidence: 0.96,
    description: '塑料瓶属于可回收垃圾中的废塑料类，主要由PET等塑料材质制成。',
    disposalTips: [
      '投放前请倒空瓶内液体并简单冲洗',
      '请压扁后投放以节省空间',
      '如瓶身沾有油污无法清洗干净，请投入其他垃圾'
    ],
    wikiUrl: 'https://baike.baidu.com/item/%E5%A1%91%E6%96%99%E7%93%B6'
  },
  {
    id: 2,
    name: '苹果',
    typeId: 3,
    typeName: '厨余垃圾',
    emoji: '🍎',
    confidence: 0.92,
    description: '苹果及苹果皮属于厨余垃圾，是易腐烂的生物质生活废弃物。',
    disposalTips: [
      '投放前请沥干水分',
      '去除食品包装后投放',
      '大块果核请敲碎后投放'
    ],
    wikiUrl: 'https://baike.baidu.com/item/%E8%8B%B9%E6%9E%9C'
  },
  {
    id: 3,
    name: '废电池',
    typeId: 2,
    typeName: '有害垃圾',
    emoji: '🔋',
    confidence: 0.98,
    description: '废电池属于有害垃圾，含有重金属和有害化学物质，需特殊安全处理。',
    disposalTips: [
      '投放时请注意轻放，避免破损',
      '请投放至专门的有害垃圾收集点',
      '不要与其他垃圾混合投放'
    ],
    wikiUrl: 'https://baike.baidu.com/item/%E5%BA%9F%E7%94%B5%E6%B1%A0'
  },
  {
    id: 4,
    name: '用过的纸巾',
    typeId: 4,
    typeName: '其他垃圾',
    emoji: '🧻',
    confidence: 0.89,
    description: '用过的纸巾属于其他垃圾，遇水即溶，无法回收再利用。',
    disposalTips: [
      '尽量沥干水分后投放',
      '请投入其他垃圾容器',
      '不要投入可回收物容器'
    ],
    wikiUrl: 'https://baike.baidu.com/item/%E7%BA%B8%E5%B7%BE'
  },
  {
    id: 5,
    name: '易拉罐',
    typeId: 1,
    typeName: '可回收垃圾',
    emoji: '🥫',
    confidence: 0.95,
    description: '易拉罐属于可回收垃圾中的废金属类，主要由铝或铁制成。',
    disposalTips: [
      '请倒空罐内液体并简单冲洗',
      '压扁后投放',
      '请投入可回收物容器'
    ],
    wikiUrl: 'https://baike.baidu.com/item/%E6%98%93%E6%8B%89%E7%BD%90'
  },
  {
    id: 6,
    name: '剩菜剩饭',
    typeId: 3,
    typeName: '厨余垃圾',
    emoji: '🍚',
    confidence: 0.91,
    description: '剩菜剩饭属于厨余垃圾，包括米饭、面条、蔬菜、肉类等。',
    disposalTips: [
      '投放前请沥干水分',
      '去除一次性餐具和食品包装',
      '请投入厨余垃圾容器'
    ],
    wikiUrl: 'https://baike.baidu.com/item/%E5%89%A9%E8%8F%9C'
  },
  {
    id: 7,
    name: '玻璃瓶',
    typeId: 1,
    typeName: '可回收垃圾',
    emoji: '🍶',
    confidence: 0.94,
    description: '玻璃瓶属于可回收垃圾中的废玻璃类，包括各种玻璃容器。',
    disposalTips: [
      '请清洗干净后投放',
      '碎玻璃请用厚纸包裹后投放',
      '不同颜色的玻璃最好分开投放'
    ],
    wikiUrl: 'https://baike.baidu.com/item/%E7%8E%BB%E7%92%83%E7%93%B6'
  },
  {
    id: 8,
    name: '过期药品',
    typeId: 2,
    typeName: '有害垃圾',
    emoji: '💊',
    confidence: 0.97,
    description: '过期药品属于有害垃圾，可能成分变化，随意丢弃会污染环境。',
    disposalTips: [
      '药品和内外包装一起投放',
      '请投放至专门的有害垃圾收集点',
      '不要随意丢弃'
    ],
    wikiUrl: 'https://baike.baidu.com/item/%E8%8D%AF%E5%93%81'
  },
  {
    id: 9,
    name: '旧报纸',
    typeId: 1,
    typeName: '可回收垃圾',
    emoji: '📰',
    confidence: 0.93,
    description: '旧报纸属于可回收垃圾中的废纸张类，可以回收再利用。',
    disposalTips: [
      '请保持干燥，避免被油污污染',
      '捆扎整齐后投放',
      '被严重污染的纸张请投入其他垃圾'
    ],
    wikiUrl: 'https://baike.baidu.com/item/%E6%8A%A5%E7%BA%B8'
  },
  {
    id: 10,
    name: '烟蒂',
    typeId: 4,
    typeName: '其他垃圾',
    emoji: '🚬',
    confidence: 0.90,
    description: '烟蒂属于其他垃圾，含有有害物质且难以回收利用。',
    disposalTips: [
      '请确保完全熄灭后投放',
      '不要随地丢弃',
      '请投入其他垃圾容器'
    ],
    wikiUrl: 'https://baike.baidu.com/item/%E7%83%9F%E8%8A%92'
  }
]

const LOW_CONFIDENCE_KEYWORDS = ['这不是垃圾', '无法识别', '识别失败']

const mockRecognize = (imagePath) => {
  console.log('[Recognize] 模拟识别图片:', imagePath)
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * RECOGNIZE_MOCK_RESULTS.length)
      const result = RECOGNIZE_MOCK_RESULTS[randomIndex]
      
      const randomConfidenceVariation = (Math.random() - 0.5) * 0.1
      const finalConfidence = Math.max(0.6, Math.min(0.99, result.confidence + randomConfidenceVariation))
      
      resolve({
        success: true,
        data: {
          ...result,
          confidence: finalConfidence
        }
      })
    }, 2000)
  })
}

const mockRecognizeFail = (imagePath) => {
  console.log('[Recognize] 模拟识别失败:', imagePath)
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: false,
        error: '无法识别该图片，请尝试手动搜索或重新拍摄'
      })
    }, 2000)
  })
}

const FEEDBACK_TYPES = [
  { id: 'not_garbage', name: '这不是垃圾', emoji: '❌' },
  { id: 'wrong_recognition', name: '识别不准', emoji: '⚠️' },
  { id: 'blurry', name: '图片模糊', emoji: '🌫️' },
  { id: 'other', name: '其他问题', emoji: '💬' }
]

module.exports = {
  RECOGNIZE_MOCK_RESULTS,
  LOW_CONFIDENCE_KEYWORDS,
  mockRecognize,
  mockRecognizeFail,
  FEEDBACK_TYPES
}
