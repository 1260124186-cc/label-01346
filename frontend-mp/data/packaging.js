/**
 * 组合包装拆解向导数据
 * @description 组合包装物品、部件拆解信息、审核队列
 */

const COMPOSITE_PACKAGING = [
  {
    id: 'pkg-001',
    name: '外卖餐盒',
    emoji: '🍱',
    description: '外卖餐盒通常由多个不同材质的部件组成，需要拆解后分别投放',
    category: 'food_delivery',
    components: [
      {
        id: 'comp-001-1',
        name: '塑料餐盒',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '倒出残余食物后，用清水冲洗餐盒，压扁后投放至可回收物容器',
        isRequired: true,
        order: 1,
        tip: '如餐盒油污严重无法清洗，则作为其他垃圾投放'
      },
      {
        id: 'comp-001-2',
        name: '剩菜剩饭',
        typeId: 3,
        typeName: '厨余垃圾',
        typeColor: '#5BBD72',
        typeBgColor: 'rgba(91, 189, 114, 0.1)',
        typeEmoji: '🍂',
        instruction: '将残余食物沥干水分后，投放至厨余垃圾容器',
        isRequired: true,
        order: 2,
        tip: '大块骨头需单独取出作为其他垃圾投放'
      },
      {
        id: 'comp-001-3',
        name: '一次性筷子',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '一次性筷子属于其他垃圾，直接投放至其他垃圾容器',
        isRequired: false,
        order: 3,
        tip: '竹筷和木筷均属于其他垃圾'
      },
      {
        id: 'comp-001-4',
        name: '塑料袋',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '被食物污染的塑料袋属于其他垃圾，直接投放',
        isRequired: false,
        order: 4,
        tip: '干净无污染的塑料袋可回收'
      }
    ],
    relatedItemIds: ['pkg-002', 'pkg-005']
  },
  {
    id: 'pkg-002',
    name: '快递包裹',
    emoji: '📦',
    description: '快递包裹包含多种包装材料，拆解后可大幅提升回收效率',
    category: 'express',
    components: [
      {
        id: 'comp-002-1',
        name: '纸箱',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '拆除胶带和标签后，压扁纸箱投放至可回收物容器',
        isRequired: true,
        order: 1,
        tip: '保持纸箱干燥清洁，回收价值更高'
      },
      {
        id: 'comp-002-2',
        name: '胶带',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '撕下的胶带属于其他垃圾，单独投放至其他垃圾容器',
        isRequired: true,
        order: 2,
        tip: '尽量将胶带从纸箱上完全撕除'
      },
      {
        id: 'comp-002-3',
        name: '气泡膜',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '气泡膜属于其他垃圾，揉成团后投放至其他垃圾容器',
        isRequired: false,
        order: 3,
        tip: '气泡膜难以回收利用，建议重复使用后再丢弃'
      },
      {
        id: 'comp-002-4',
        name: '塑料封套',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '快递文件袋的塑料封套，清洗干净后可投放至可回收物容器',
        isRequired: false,
        order: 4,
        tip: '含金属条的封套需拆除金属条后再投放'
      }
    ],
    relatedItemIds: ['pkg-001']
  },
  {
    id: 'pkg-003',
    name: '牛奶利乐包',
    emoji: '🥛',
    description: '利乐包由纸、铝、塑多层复合而成，需专门处理才能回收',
    category: 'beverage',
    components: [
      {
        id: 'comp-003-1',
        name: '利乐包装整体',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '喝完后冲洗包装内壁，压扁后投放至可回收物容器',
        isRequired: true,
        order: 1,
        tip: '利乐包可以整体回收，工厂会统一分解纸、铝、塑'
      },
      {
        id: 'comp-003-2',
        name: '吸管',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '塑料吸管属于其他垃圾，直接投放至其他垃圾容器',
        isRequired: false,
        order: 2,
        tip: '纸吸管同样属于其他垃圾'
      },
      {
        id: 'comp-003-3',
        name: '瓶盖',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '塑料瓶盖属于可回收垃圾，可连同利乐包一起投放',
        isRequired: false,
        order: 3,
        tip: '瓶盖和包装不必分离，一起投放即可'
      }
    ],
    relatedItemIds: ['pkg-004']
  },
  {
    id: 'pkg-004',
    name: '饮料瓶组合',
    emoji: '🧃',
    description: '饮料瓶常配有标签纸和瓶盖，需拆解后分别投放',
    category: 'beverage',
    components: [
      {
        id: 'comp-004-1',
        name: 'PET塑料瓶身',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '倒空饮料、冲洗瓶身、压扁后投放至可回收物容器',
        isRequired: true,
        order: 1,
        tip: '压扁可以节省垃圾桶空间'
      },
      {
        id: 'comp-004-2',
        name: '塑料标签纸',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '撕下瓶身的塑料标签纸，投放至其他垃圾容器',
        isRequired: true,
        order: 2,
        tip: '标签纸的胶和油墨使其难以回收'
      },
      {
        id: 'comp-004-3',
        name: '瓶盖',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '塑料瓶盖属于可回收垃圾，与瓶身一起投放',
        isRequired: false,
        order: 3,
        tip: '瓶盖可不分离，连同瓶身一起投放'
      }
    ],
    relatedItemIds: ['pkg-003']
  },
  {
    id: 'pkg-005',
    name: '药品包装组合',
    emoji: '💊',
    description: '药品包装含多种材质，需仔细拆解分类，特别注意有害成分',
    category: 'medical',
    components: [
      {
        id: 'comp-005-1',
        name: '过期药品',
        typeId: 2,
        typeName: '有害垃圾',
        typeColor: '#E85D5D',
        typeBgColor: 'rgba(232, 93, 93, 0.1)',
        typeEmoji: '☣️',
        instruction: '过期药品属于有害垃圾，连同包装一起投放至有害垃圾容器',
        isRequired: true,
        order: 1,
        tip: '药品与包装一起投放，防止药品泄漏污染'
      },
      {
        id: 'comp-005-2',
        name: '铝箔包装',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '药品的铝箔泡罩包装（已清空药品）属于其他垃圾',
        isRequired: true,
        order: 2,
        tip: '如铝箔内仍有药品残留，则整体作为有害垃圾投放'
      },
      {
        id: 'comp-005-3',
        name: '纸盒说明书',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '药品外包装纸盒和纸质说明书属于可回收垃圾',
        isRequired: false,
        order: 3,
        tip: '确保纸盒未被药品污染'
      }
    ],
    relatedItemIds: ['pkg-001']
  },
  {
    id: 'pkg-006',
    name: '方便面组合',
    emoji: '🍜',
    description: '方便面包含多种包装和食材，需逐一拆解分类',
    category: 'food_delivery',
    components: [
      {
        id: 'comp-006-1',
        name: '塑料面碗',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '吃完后的塑料面碗属于其他垃圾，倒掉残余后投放',
        isRequired: true,
        order: 1,
        tip: '面碗因被食物污染，通常无法回收'
      },
      {
        id: 'comp-006-2',
        name: '残余面汤',
        typeId: 3,
        typeName: '厨余垃圾',
        typeColor: '#5BBD72',
        typeBgColor: 'rgba(91, 189, 114, 0.1)',
        typeEmoji: '🍂',
        instruction: '将残余面汤和面渣沥干水分后投放至厨余垃圾容器',
        isRequired: true,
        order: 2,
        tip: '大量汤水先倒入下水道，固体残渣再投放'
      },
      {
        id: 'comp-006-3',
        name: '调料包装袋',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '调料塑料包装袋属于其他垃圾，直接投放',
        isRequired: true,
        order: 3,
        tip: '被调料污染的塑料袋无法回收'
      },
      {
        id: 'comp-006-4',
        name: '塑料封膜',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '面碗上的塑料封膜属于其他垃圾，撕下后投放',
        isRequired: false,
        order: 4,
        tip: '封膜沾有油渍，属于其他垃圾'
      }
    ],
    relatedItemIds: ['pkg-001']
  },
  {
    id: 'pkg-007',
    name: '罐头组合',
    emoji: '🥫',
    description: '金属罐头含食品和金属罐体，需分离后分别投放',
    category: 'food',
    components: [
      {
        id: 'comp-007-1',
        name: '金属罐体',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '倒出内容物后，冲洗干净金属罐体，投放至可回收物容器',
        isRequired: true,
        order: 1,
        tip: '金属罐可100%回收再利用，请务必洗净投放'
      },
      {
        id: 'comp-007-2',
        name: '罐内残余食品',
        typeId: 3,
        typeName: '厨余垃圾',
        typeColor: '#5BBD72',
        typeBgColor: 'rgba(91, 189, 114, 0.1)',
        typeEmoji: '🍂',
        instruction: '将罐内残余食品沥干水分后投放至厨余垃圾容器',
        isRequired: true,
        order: 2,
        tip: '注意沥干汁水再投放'
      },
      {
        id: 'comp-007-3',
        name: '金属盖/拉环',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '金属盖和拉环属于可回收垃圾，可连同罐体一起投放',
        isRequired: false,
        order: 3,
        tip: '金属盖不必与罐体分离'
      }
    ],
    relatedItemIds: ['pkg-004']
  },
  {
    id: 'pkg-008',
    name: '网购衣服包裹',
    emoji: '👗',
    description: '衣服快递包含多种包装材料，可分别回收处理',
    category: 'express',
    components: [
      {
        id: 'comp-008-1',
        name: '快递袋',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '塑料快递袋属于其他垃圾，直接投放',
        isRequired: true,
        order: 1,
        tip: '快递袋因含胶和标签纸，通常无法回收'
      },
      {
        id: 'comp-008-2',
        name: '衣服塑料袋',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '包裹衣服的透明塑料袋属于其他垃圾，直接投放',
        isRequired: true,
        order: 2,
        tip: '如塑料袋干净且较大，可留作他用'
      },
      {
        id: 'comp-008-3',
        name: '纸制吊牌',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '衣服的纸质吊牌属于可回收垃圾，投放至可回收物容器',
        isRequired: false,
        order: 3,
        tip: '塑料挂扣属于其他垃圾'
      },
      {
        id: 'comp-008-4',
        name: '衣物',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '旧衣物属于可回收垃圾，可捐赠或投放至旧衣回收箱',
        isRequired: false,
        order: 4,
        tip: '衣物完好建议捐赠或二手转让'
      }
    ],
    relatedItemIds: ['pkg-002']
  },
  {
    id: 'pkg-009',
    name: '电子产品包装',
    emoji: '📱',
    description: '电子产品包装含多种材质，拆解后可分类回收',
    category: 'electronics',
    components: [
      {
        id: 'comp-009-1',
        name: '外包装纸盒',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '电子产品外包装纸盒属于可回收垃圾，压扁后投放',
        isRequired: true,
        order: 1,
        tip: '精装礼盒也可回收'
      },
      {
        id: 'comp-009-2',
        name: '塑料内托',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '内部塑料成型托盘属于其他垃圾，直接投放',
        isRequired: true,
        order: 2,
        tip: '此类塑料为混合材质，无法回收'
      },
      {
        id: 'comp-009-3',
        name: '防静电袋',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '电子产品的防静电包装袋属于其他垃圾',
        isRequired: false,
        order: 3,
        tip: '防静电涂层使其无法回收'
      },
      {
        id: 'comp-009-4',
        name: '说明书/保修卡',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '纸质说明书和保修卡属于可回收垃圾',
        isRequired: false,
        order: 4,
        tip: '建议先拍照留档后再投放'
      }
    ],
    relatedItemIds: ['pkg-002']
  },
  {
    id: 'pkg-010',
    name: '花束组合',
    emoji: '💐',
    description: '花束包含鲜花和多种包装材料，需拆解后分别投放',
    category: 'daily',
    components: [
      {
        id: 'comp-010-1',
        name: '枯萎花朵',
        typeId: 3,
        typeName: '厨余垃圾',
        typeColor: '#5BBD72',
        typeBgColor: 'rgba(91, 189, 114, 0.1)',
        typeEmoji: '🍂',
        instruction: '枯萎的花朵属于厨余垃圾，沥干水分后投放',
        isRequired: true,
        order: 1,
        tip: '去除包装材料后投放'
      },
      {
        id: 'comp-010-2',
        name: '包装纸',
        typeId: 1,
        typeName: '可回收垃圾',
        typeColor: '#4A90D9',
        typeBgColor: 'rgba(74, 144, 217, 0.1)',
        typeEmoji: '♻️',
        instruction: '花束包装纸（无污染）属于可回收垃圾，压平后投放',
        isRequired: true,
        order: 2,
        tip: '被水浸湿的包装纸作为其他垃圾投放'
      },
      {
        id: 'comp-010-3',
        name: '塑料花泥',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '花泥属于其他垃圾，沥干水分后投放',
        isRequired: true,
        order: 3,
        tip: '花泥为酚醛树脂制成，不可回收'
      },
      {
        id: 'comp-010-4',
        name: '丝带/橡皮筋',
        typeId: 4,
        typeName: '其他垃圾',
        typeColor: '#8E8E93',
        typeBgColor: 'rgba(142, 142, 147, 0.1)',
        typeEmoji: '🗑️',
        instruction: '装饰丝带和橡皮筋属于其他垃圾',
        isRequired: false,
        order: 4,
        tip: '丝带可留作手工材料重复使用'
      }
    ],
    relatedItemIds: []
  }
]

const PACKAGING_CATEGORIES = [
  { id: 'food_delivery', name: '外卖餐食', emoji: '🍱' },
  { id: 'express', name: '快递包裹', emoji: '📦' },
  { id: 'beverage', name: '饮料瓶罐', emoji: '🥛' },
  { id: 'medical', name: '药品医疗', emoji: '💊' },
  { id: 'food', name: '食品罐头', emoji: '🥫' },
  { id: 'electronics', name: '电子产品', emoji: '📱' },
  { id: 'daily', name: '日常生活', emoji: '💐' }
]

const PACKAGING_QUIZ_POINTS = 15

function getCompositePackagingById(id) {
  return COMPOSITE_PACKAGING.find(p => p.id === id) || null
}

function searchCompositePackaging(keyword) {
  if (!keyword || !keyword.trim()) return []
  const kw = keyword.trim().toLowerCase()
  return COMPOSITE_PACKAGING.filter(p =>
    p.name.toLowerCase().includes(kw) ||
    p.description.toLowerCase().includes(kw) ||
    p.components.some(c => c.name.toLowerCase().includes(kw))
  )
}

function getAllCompositePackaging() {
  return COMPOSITE_PACKAGING
}

function getPackagingByCategory(category) {
  return COMPOSITE_PACKAGING.filter(p => p.category === category)
}

function generateQuizFromPackaging(pkg) {
  if (!pkg || !pkg.components || pkg.components.length === 0) return []
  return pkg.components.map(comp => ({
    id: 'quiz-' + comp.id,
    componentId: comp.id,
    componentname: comp.name,
    typeId: comp.typeId,
    typeName: comp.typeName,
    typeColor: comp.typeColor,
    typeBgColor: comp.typeBgColor,
    typeEmoji: comp.typeEmoji,
    correctTypeId: comp.typeId,
    correctTypeName: comp.typeName,
    instruction: comp.instruction
  }))
}

module.exports = {
  COMPOSITE_PACKAGING,
  PACKAGING_CATEGORIES,
  PACKAGING_QUIZ_POINTS,
  getCompositePackagingById,
  searchCompositePackaging,
  getAllCompositePackaging,
  getPackagingByCategory,
  generateQuizFromPackaging
}
