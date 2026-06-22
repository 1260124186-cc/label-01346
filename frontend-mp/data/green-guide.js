/**
 * 绿色消费指南数据模块
 * @description 环保产品评级、品类建议、产品对比、用户投票
 */

const GREEN_CATEGORIES = [
  { id: 'tissue', name: '纸巾', icon: '🧻', color: '#4A90D9', desc: '原生木浆 vs 再生纤维' },
  { id: 'detergent', name: '洗涤剂', icon: '🧴', color: '#5BBD72', desc: '含磷 vs 无磷环保配方' },
  { id: 'packaging', name: '外卖包装', icon: '🥡', color: '#F39C12', desc: '一次性塑料 vs 可降解材料' },
  { id: 'bag', name: '购物袋', icon: '🛍️', color: '#9B59B6', desc: '塑料袋 vs 可降解/布袋' },
  { id: 'bottle', name: '饮用水瓶', icon: '🧊', color: '#1ABC9C', desc: 'PET瓶 vs 玻璃/铝罐' },
  { id: 'tableware', name: '餐具', icon: '🍴', color: '#E67E22', desc: '一次性 vs 可重复使用' }
]

const ECO_CERTIFICATIONS = [
  { id: 'cert_fsc', name: 'FSC森林认证', icon: '🌲', level: 'A', desc: '木材/纸品来源可持续经营森林', color: '#27AE60' },
  { id: 'cert_blue_angel', name: '蓝色天使', icon: '💙', level: 'A', desc: '德国环保标志，严苛的环保标准', color: '#2980B9' },
  { id: 'cert_green_seal', name: 'Green Seal', icon: '✅', level: 'A', desc: '美国环保认证，产品全生命周期评估', color: '#27AE60' },
  { id: 'cert_ok_compost', name: 'OK Compost', icon: '♻️', level: 'A', desc: '工业堆肥条件下可完全降解认证', color: '#16A085' },
  { id: 'cert_bpi', name: 'BPI认证', icon: '🌿', level: 'A', desc: '北美生物降解产品认证', color: '#27AE60' },
  { id: 'cert_eco_label', name: '中国环境标志', icon: '🇨🇳', level: 'B+', desc: '十环认证，国家环保标准', color: '#E74C3C' },
  { id: 'cert_china_recycle', name: '中国节能认证', icon: '⚡', level: 'B', desc: '产品符合国家节能环保标准', color: '#F39C12' },
  { id: 'cert_degradable', name: '双J降解标识', icon: '🔄', level: 'B', desc: '中国可降解塑料标识体系', color: '#3498DB' }
]

const PLASTIC_REDUCTION_LEVELS = [
  { level: 0, name: '无减塑', icon: '🔴', color: '#E74C3C', desc: '使用传统石化塑料，无替代方案' },
  { level: 1, name: '轻度减塑', icon: '🟠', color: '#F39C12', desc: '部分减量或掺入少量再生料' },
  { level: 2, name: '中度减塑', icon: '🟡', color: '#F1C40F', desc: '使用50%以上再生料或减量设计' },
  { level: 3, name: '深度减塑', icon: '🟢', color: '#2ECC71', desc: '完全无塑或100%可降解替代' }
]

const ECO_PRODUCTS = [
  {
    id: 'ep_001',
    categoryId: 'tissue',
    name: '原生木浆抽纸',
    brand: '示例品牌A',
    emoji: '🧻',
    ecoScore: 45,
    ecoLevel: 'C',
    certifications: [],
    plasticReduction: 0,
    materials: ['原生木浆'],
    pros: ['柔软亲肤'],
    cons: ['砍伐森林', '水耗高', '不可降解漂白剂'],
    greenAlternative: 'ep_002',
    priceRange: '8-12元',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_002',
    categoryId: 'tissue',
    name: '竹纤维环保抽纸',
    brand: '示例品牌B',
    emoji: '🎋',
    ecoScore: 82,
    ecoLevel: 'A',
    certifications: ['cert_fsc', 'cert_eco_label'],
    plasticReduction: 3,
    materials: ['竹纤维', '无漂白'],
    pros: ['竹子生长快', 'FSC认证', '无氯漂白', '可降解'],
    cons: ['手感略粗', '价格略高'],
    greenAlternative: null,
    priceRange: '12-18元',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_003',
    categoryId: 'tissue',
    name: '再生纸环保纸巾',
    brand: '示例品牌C',
    emoji: '♻️',
    ecoScore: 75,
    ecoLevel: 'B+',
    certifications: ['cert_blue_angel'],
    plasticReduction: 2,
    materials: ['再生纸浆'],
    pros: ['减少森林砍伐', '蓝色天使认证'],
    cons: ['质地较粗糙', '白度偏低'],
    greenAlternative: null,
    priceRange: '10-15元',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_004',
    categoryId: 'detergent',
    name: '含磷洗衣液',
    brand: '示例品牌D',
    emoji: '🧴',
    ecoScore: 30,
    ecoLevel: 'D',
    certifications: [],
    plasticReduction: 0,
    materials: ['含磷表面活性剂', '石化塑料瓶'],
    pros: ['去污力强', '价格低'],
    cons: ['磷排放致水体富营养化', '塑料包装', '含荧光剂'],
    greenAlternative: 'ep_005',
    priceRange: '15-25元',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_005',
    categoryId: 'detergent',
    name: '植物基无磷洗衣液',
    brand: '示例品牌E',
    emoji: '🌿',
    ecoScore: 85,
    ecoLevel: 'A',
    certifications: ['cert_eco_label', 'cert_china_recycle'],
    plasticReduction: 2,
    materials: ['植物基表面活性剂', '再生塑料瓶'],
    pros: ['无磷配方', '植物基', '可生物降解', '再生包装'],
    cons: ['价格偏高', '去顽固污渍稍弱'],
    greenAlternative: null,
    priceRange: '30-50元',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_006',
    categoryId: 'detergent',
    name: '浓缩洗衣片',
    brand: '示例品牌F',
    emoji: '📄',
    ecoScore: 78,
    ecoLevel: 'B+',
    certifications: ['cert_green_seal'],
    plasticReduction: 3,
    materials: ['水溶性膜', '浓缩配方'],
    pros: ['零塑料包装', '轻量运输减碳', '用量精准'],
    cons: ['需温水溶解', '不宜洗羽绒服'],
    greenAlternative: null,
    priceRange: '35-55元',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_007',
    categoryId: 'packaging',
    name: 'PP塑料餐盒',
    brand: '通用外卖',
    emoji: '🥡',
    ecoScore: 25,
    ecoLevel: 'D',
    certifications: [],
    plasticReduction: 0,
    materials: ['PP塑料(聚丙烯)', 'PS塑料盖'],
    pros: ['耐热', '成本低'],
    cons: ['不可降解', '微塑料风险', '回收率极低', '焚烧有污染'],
    greenAlternative: 'ep_008',
    priceRange: '0.5-1元/个',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_008',
    categoryId: 'packaging',
    name: 'PLA可降解餐盒',
    brand: '示例品牌G',
    emoji: '🌿',
    ecoScore: 72,
    ecoLevel: 'B',
    certifications: ['cert_ok_compost', 'cert_bpi'],
    plasticReduction: 3,
    materials: ['PLA(聚乳酸)', '甘蔗渣纤维'],
    pros: ['工业堆肥可降解', 'BPI认证', '植物基原料'],
    cons: ['需工业堆肥条件', '自然环境中降解慢', '价格偏高'],
    greenAlternative: null,
    priceRange: '1.5-3元/个',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_009',
    categoryId: 'packaging',
    name: '纸浆模塑餐盒',
    brand: '示例品牌H',
    emoji: '📦',
    ecoScore: 80,
    ecoLevel: 'A',
    certifications: ['cert_fsc', 'cert_ok_compost'],
    plasticReduction: 3,
    materials: ['甘蔗渣浆', '麦秸秆浆'],
    pros: ['FSC认证', '完全可降解', '农业废弃物再利用'],
    cons: ['耐热性略低', '成本较高', '需防水涂层工艺'],
    greenAlternative: null,
    priceRange: '2-4元/个',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_010',
    categoryId: 'bag',
    name: 'PE塑料购物袋',
    brand: '通用',
    emoji: '🛍️',
    ecoScore: 20,
    ecoLevel: 'D',
    certifications: [],
    plasticReduction: 0,
    materials: ['PE(聚乙烯)'],
    pros: ['便宜', '防水'],
    cons: ['不可降解', '微塑料', '海洋生物危害', '需数百年降解'],
    greenAlternative: 'ep_011',
    priceRange: '0.2-0.5元/个',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_011',
    categoryId: 'bag',
    name: 'PBAT+PLA可降解袋',
    brand: '示例品牌I',
    emoji: '🌱',
    ecoScore: 70,
    ecoLevel: 'B',
    certifications: ['cert_degradable', 'cert_ok_compost'],
    plasticReduction: 3,
    materials: ['PBAT', 'PLA', '玉米淀粉'],
    pros: ['双J降解标识', '工业堆肥可降解', '手感接近传统塑料袋'],
    cons: ['需工业堆肥条件', '自然降解有限', '价格高3-5倍'],
    greenAlternative: 'ep_012',
    priceRange: '0.8-2元/个',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_012',
    categoryId: 'bag',
    name: '有机棉布袋',
    brand: '示例品牌J',
    emoji: '👜',
    ecoScore: 88,
    ecoLevel: 'A',
    certifications: ['cert_fsc', 'cert_eco_label'],
    plasticReduction: 3,
    materials: ['有机棉'],
    pros: ['可重复使用数百次', '天然材料', '可降解', '可定制'],
    cons: ['初始成本高', '需清洗维护', '重物承重有限'],
    greenAlternative: null,
    priceRange: '8-25元/个',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_013',
    categoryId: 'bottle',
    name: 'PET一次性水瓶',
    brand: '通用',
    emoji: '🧊',
    ecoScore: 35,
    ecoLevel: 'C',
    certifications: [],
    plasticReduction: 0,
    materials: ['PET塑料'],
    pros: ['轻便', '可回收', '成本低'],
    cons: ['实际回收率低', '生产碳排放高', '微塑料风险'],
    greenAlternative: 'ep_014',
    priceRange: '1-3元',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_014',
    categoryId: 'bottle',
    name: 'rPET再生水瓶',
    brand: '示例品牌K',
    emoji: '♻️',
    ecoScore: 68,
    ecoLevel: 'B',
    certifications: ['cert_china_recycle'],
    plasticReduction: 2,
    materials: ['rPET(再生聚酯)'],
    pros: ['100%再生料', '减少原生塑料', '碳排降低60%'],
    cons: ['仍为塑料', '回收体系依赖', '多次回收后品质下降'],
    greenAlternative: 'ep_015',
    priceRange: '2-4元',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_015',
    categoryId: 'bottle',
    name: '可重复使用玻璃瓶',
    brand: '示例品牌L',
    emoji: '🫙',
    ecoScore: 85,
    ecoLevel: 'A',
    certifications: ['cert_eco_label'],
    plasticReduction: 3,
    materials: ['钠钙玻璃', '不锈钢盖'],
    pros: ['无限次重复使用', '零塑料', '100%可回收', '无化学溶出'],
    cons: ['重量大运输碳排高', '易碎', '初始成本高'],
    greenAlternative: null,
    priceRange: '15-40元',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_016',
    categoryId: 'tableware',
    name: '一次性塑料餐具',
    brand: '通用',
    emoji: '🍴',
    ecoScore: 22,
    ecoLevel: 'D',
    certifications: [],
    plasticReduction: 0,
    materials: ['PS塑料'],
    pros: ['便宜', '方便'],
    cons: ['不可降解', '热变形', '微塑料', '限塑令禁用'],
    greenAlternative: 'ep_017',
    priceRange: '0.1-0.3元/套',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_017',
    categoryId: 'tableware',
    name: '竹纤维可降解餐具',
    brand: '示例品牌M',
    emoji: '🎋',
    ecoScore: 76,
    ecoLevel: 'B+',
    certifications: ['cert_ok_compost', 'cert_bpi'],
    plasticReduction: 3,
    materials: ['竹纤维', '玉米淀粉'],
    pros: ['天然材质', '可堆肥降解', '耐热100°C'],
    cons: ['一次性使用', '需工业堆肥', '涂层需注意'],
    greenAlternative: 'ep_018',
    priceRange: '0.8-1.5元/套',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  },
  {
    id: 'ep_018',
    categoryId: 'tableware',
    name: '便携不锈钢餐具套装',
    brand: '示例品牌N',
    emoji: '🥢',
    ecoScore: 90,
    ecoLevel: 'A+',
    certifications: ['cert_eco_label'],
    plasticReduction: 3,
    materials: ['304不锈钢', '食品级硅胶套'],
    pros: ['可重复使用数千次', '零废弃', '高温消毒安全', '携带方便'],
    cons: ['初始成本高', '需清洗', '出行携带稍有不便'],
    greenAlternative: null,
    priceRange: '25-80元/套',
    disclaimer: '品牌示例仅供参考，不构成购买建议'
  }
]

const PRODUCT_COMPARISONS = [
  {
    id: 'cmp_001',
    title: '购物袋环境影响对比',
    subtitle: '普通塑料袋 vs 可降解袋 vs 布袋',
    categoryId: 'bag',
    conventional: {
      name: 'PE塑料袋',
      emoji: '🛍️',
      metrics: {
        decomposeYears: '200-1000年',
        co2PerUnit: '33g CO₂',
        oceanImpact: '高危 · 海洋生物误食',
        recycleRate: '< 10%',
        microplasticRisk: '高',
        resourceUse: '石油基原料'
      }
    },
    green: {
      name: 'PBAT+PLA可降解袋',
      emoji: '🌱',
      metrics: {
        decomposeYears: '3-6个月(工业堆肥)',
        co2PerUnit: '45g CO₂',
        oceanImpact: '低 · 堆肥条件可完全降解',
        recycleRate: '需专项堆肥',
        microplasticRisk: '低',
        resourceUse: '玉米淀粉+石油基(PBAT)'
      }
    },
    best: {
      name: '有机棉布袋',
      emoji: '👜',
      metrics: {
        decomposeYears: '1-5个月(自然降解)',
        co2PerUnit: '首用约150g，重复131次后均摊<2g',
        oceanImpact: '极低 · 无微塑料',
        recycleRate: '可重复数百次',
        microplasticRisk: '无',
        resourceUse: '有机棉(可再生)'
      }
    }
  },
  {
    id: 'cmp_002',
    title: '外卖包装环境影响对比',
    subtitle: 'PP塑料盒 vs PLA可降解盒 vs 纸浆模塑盒',
    categoryId: 'packaging',
    conventional: {
      name: 'PP塑料餐盒',
      emoji: '🥡',
      metrics: {
        decomposeYears: '400-500年',
        co2PerUnit: '50g CO₂',
        oceanImpact: '高危 · 不降解碎片化',
        recycleRate: '< 5%',
        microplasticRisk: '高',
        resourceUse: '石油基原料'
      }
    },
    green: {
      name: 'PLA可降解餐盒',
      emoji: '🌿',
      metrics: {
        decomposeYears: '3-6个月(工业堆肥)',
        co2PerUnit: '35g CO₂',
        oceanImpact: '低 · 需工业堆肥条件',
        recycleRate: '需专项堆肥',
        microplasticRisk: '低',
        resourceUse: '玉米淀粉(部分可再生)'
      }
    },
    best: {
      name: '纸浆模塑餐盒',
      emoji: '📦',
      metrics: {
        decomposeYears: '1-3个月(自然降解)',
        co2PerUnit: '25g CO₂',
        oceanImpact: '极低 · 天然纤维',
        recycleRate: '可自然降解或堆肥',
        microplasticRisk: '无',
        resourceUse: '农业废弃物(甘蔗渣/秸秆)'
      }
    }
  },
  {
    id: 'cmp_003',
    title: '纸巾环境影响对比',
    subtitle: '原生木浆 vs 竹纤维 vs 再生纸',
    categoryId: 'tissue',
    conventional: {
      name: '原生木浆抽纸',
      emoji: '🧻',
      metrics: {
        decomposeYears: '2-4周',
        co2PerUnit: '约30g CO₂/包',
        oceanImpact: '低',
        recycleRate: '不可回收(污染后)',
        microplasticRisk: '无(含漂白剂)',
        resourceUse: '砍伐天然林/人工林'
      }
    },
    green: {
      name: '竹纤维抽纸',
      emoji: '🎋',
      metrics: {
        decomposeYears: '2-4周',
        co2PerUnit: '约20g CO₂/包',
        oceanImpact: '极低',
        recycleRate: '不可回收(可堆肥)',
        microplasticRisk: '无',
        resourceUse: '竹子(可再生·生长快)'
      }
    },
    best: {
      name: '再生纸抽纸',
      emoji: '♻️',
      metrics: {
        decomposeYears: '2-4周',
        co2PerUnit: '约15g CO₂/包',
        oceanImpact: '极低',
        recycleRate: '回收纸循环利用',
        microplasticRisk: '无',
        resourceUse: '废纸再生(零砍伐)'
      }
    }
  },
  {
    id: 'cmp_004',
    title: '洗涤剂环境影响对比',
    subtitle: '含磷洗衣液 vs 植物基洗衣液 vs 浓缩洗衣片',
    categoryId: 'detergent',
    conventional: {
      name: '含磷洗衣液',
      emoji: '🧴',
      metrics: {
        decomposeYears: '包装400年',
        co2PerUnit: '约200g CO₂/瓶',
        oceanImpact: '高危 · 水体富营养化',
        recycleRate: '瓶身<30%',
        microplasticRisk: '中',
        resourceUse: '石化原料+磷'
      }
    },
    green: {
      name: '植物基无磷洗衣液',
      emoji: '🌿',
      metrics: {
        decomposeYears: '再生瓶可回收',
        co2PerUnit: '约150g CO₂/瓶',
        oceanImpact: '低 · 无磷配方',
        recycleRate: '再生瓶>50%',
        microplasticRisk: '低',
        resourceUse: '植物基表面活性剂'
      }
    },
    best: {
      name: '浓缩洗衣片',
      emoji: '📄',
      metrics: {
        decomposeYears: '水溶膜完全溶解',
        co2PerUnit: '约80g CO₂/盒',
        oceanImpact: '极低 · 无水配方',
        recycleRate: '纸盒100%可回收',
        microplasticRisk: '无',
        resourceUse: '浓缩配方·减量94%'
      }
    }
  }
]

const BARCODE_ECO_MAP = {
  '6901028180009': { ecoScore: 55, ecoLevel: 'C+', tip: '利乐包可回收，但需专门产线处理', greenSuggestion: '选择大容量装减少包装比例' },
  '6925303721294': { ecoScore: 62, ecoLevel: 'B', tip: '铝罐可无限次回收，回收能耗仅原生铝5%', greenSuggestion: '优先选择铝罐装，回收率最高' },
  '6901234567890': { ecoScore: 42, ecoLevel: 'C', tip: 'PET瓶可回收但实际回收率不足30%', greenSuggestion: '自带水杯，或选择rPET再生瓶装' },
  '6902083888015': { ecoScore: 28, ecoLevel: 'D', tip: '多材质复合包装，回收难度大', greenSuggestion: '减少外卖频次，选择自带餐具堂食' },
  '6901234567005': { ecoScore: 35, ecoLevel: 'C', tip: '药品包装含多种材质需逐一分类', greenSuggestion: '购买大包装减少小包装浪费' }
}

const DEFAULT_VOTE_PRODUCTS = [
  { id: 'vp_001', productId: 'ep_002', name: '竹纤维环保抽纸', emoji: '🎋', votes: 2847, hasVoted: false },
  { id: 'vp_002', productId: 'ep_005', name: '植物基无磷洗衣液', emoji: '🌿', votes: 2135, hasVoted: false },
  { id: 'vp_003', productId: 'ep_012', name: '有机棉布袋', emoji: '👜', votes: 1892, hasVoted: false },
  { id: 'vp_004', productId: 'ep_018', name: '便携不锈钢餐具套装', emoji: '🥢', votes: 1656, hasVoted: false },
  { id: 'vp_005', productId: 'ep_009', name: '纸浆模塑餐盒', emoji: '📦', votes: 1423, hasVoted: false },
  { id: 'vp_006', productId: 'ep_015', name: '可重复使用玻璃瓶', emoji: '🫙', votes: 1187, hasVoted: false },
  { id: 'vp_007', productId: 'ep_011', name: 'PBAT+PLA可降解袋', emoji: '🌱', votes: 956, hasVoted: false },
  { id: 'vp_008', productId: 'ep_006', name: '浓缩洗衣片', emoji: '📄', votes: 834, hasVoted: false }
]

const GREEN_COURSE_IDS = ['course_green_01', 'course_green_02', 'course_green_03']

function getProductsByCategory(categoryId) {
  return ECO_PRODUCTS.filter(p => p.categoryId === categoryId)
}

function getProductById(productId) {
  return ECO_PRODUCTS.find(p => p.id === productId) || null
}

function getComparisonById(compId) {
  return PRODUCT_COMPARISONS.find(c => c.id === compId) || null
}

function getComparisonsByCategory(categoryId) {
  return PRODUCT_COMPARISONS.filter(c => c.categoryId === categoryId)
}

function getCertificationById(certId) {
  return ECO_CERTIFICATIONS.find(c => c.id === certId) || null
}

function getEcoScoreByBarcode(barcode) {
  return BARCODE_ECO_MAP[barcode] || null
}

function getPlasticReductionLevel(level) {
  return PLASTIC_REDUCTION_LEVELS.find(l => l.level === level) || PLASTIC_REDUCTION_LEVELS[0]
}

function getEcoLevelColor(level) {
  const map = {
    'A+': '#27AE60', 'A': '#27AE60',
    'B+': '#2ECC71', 'B': '#2ECC71',
    'C+': '#F39C12', 'C': '#F39C12',
    'D': '#E74C3C'
  }
  return map[level] || '#8E8E93'
}

function getVoteProducts() {
  const stored = wx.getStorageSync('greenVoteProducts')
  if (stored && stored.length > 0) {
    return stored
  }
  return DEFAULT_VOTE_PRODUCTS
}

function saveVoteProducts(products) {
  wx.setStorageSync('greenVoteProducts', products)
}

function castVote(voteProductId) {
  const products = getVoteProducts()
  const product = products.find(p => p.id === voteProductId)
  if (!product) return { success: false, message: '产品不存在' }
  if (product.hasVoted) return { success: false, message: '你已经投过票了' }
  product.votes += 1
  product.hasVoted = true
  saveVoteProducts(products)
  return { success: true, votes: product.votes }
}

function getUserVotedProducts() {
  const products = getVoteProducts()
  return products.filter(p => p.hasVoted)
}

function getSortedVoteProducts() {
  const products = getVoteProducts()
  return [...products].sort((a, b) => b.votes - a.votes)
}

function searchEcoProducts(keyword) {
  if (!keyword) return ECO_PRODUCTS
  const kw = keyword.toLowerCase()
  return ECO_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(kw) ||
    p.brand.toLowerCase().includes(kw) ||
    p.categoryId.toLowerCase().includes(kw) ||
    p.materials.some(m => m.toLowerCase().includes(kw)) ||
    p.pros.some(pr => pr.toLowerCase().includes(kw))
  )
}

module.exports = {
  GREEN_CATEGORIES,
  ECO_CERTIFICATIONS,
  PLASTIC_REDUCTION_LEVELS,
  ECO_PRODUCTS,
  PRODUCT_COMPARISONS,
  BARCODE_ECO_MAP,
  DEFAULT_VOTE_PRODUCTS,
  GREEN_COURSE_IDS,
  getProductsByCategory,
  getProductById,
  getComparisonById,
  getComparisonsByCategory,
  getCertificationById,
  getEcoScoreByBarcode,
  getPlasticReductionLevel,
  getEcoLevelColor,
  getVoteProducts,
  saveVoteProducts,
  castVote,
  getUserVotedProducts,
  getSortedVoteProducts,
  searchEcoProducts
}
