/**
 * 闲置二手环保市集数据
 */

const MARKET_CATEGORIES = [
  { id: 'all', name: '全部', icon: '🛍️', color: '#5BBD72' },
  { id: 'book', name: '书籍', icon: '📚', color: '#4A90D9' },
  { id: 'toy', name: '玩具', icon: '🧸', color: '#F39C12' },
  { id: 'appliance', name: '小家电', icon: '🔌', color: '#9B59B6' }
]

const CONDITION_LEVELS = [
  { id: 'new', name: '全新', desc: '未拆封或仅拆封未使用' },
  { id: 'like_new', name: '几乎全新', desc: '使用次数极少，无磨损' },
  { id: 'good', name: '良好', desc: '有轻微使用痕迹，功能完好' },
  { id: 'fair', name: '一般', desc: '有明显使用痕迹，功能正常' }
]

const TRADE_TYPES = [
  { id: 'points', name: '积分交易', icon: '🪙', desc: '用户使用平台积分交易' },
  { id: 'barter', name: '以物易物', icon: '🔄', desc: '双方协商交换物品' },
  { id: 'pickup', name: '线下自提', icon: '📍', desc: '当面交易，支持验货' }
]

const DELIVERY_TYPES = [
  { id: 'pickup', name: '自取', icon: '🏠' },
  { id: 'mail', name: '邮寄', icon: '📦' },
  { id: 'both', name: '自取/邮寄均可', icon: '🚚' }
]

const TRASH_DISPOSAL_TIPS = {
  book: {
    type: 1,
    typeName: '可回收垃圾',
    emoji: '♻️',
    color: '#4A90D9',
    tips: [
      '书籍属于可回收垃圾中的废纸类',
      '投放前请去除塑料书皮、胶带等非纸类配件',
      '保持干燥，避免被油污污染',
      '可捆扎后投放至可回收物收集容器'
    ]
  },
  toy: {
    type: 1,
    typeName: '可回收垃圾',
    emoji: '♻️',
    color: '#4A90D9',
    tips: [
      '塑料/金属玩具属于可回收垃圾',
      '毛绒玩具请拆除电池后投放',
      '电动玩具需先取出电池（电池属有害垃圾）',
      '有尖锐边角的请包裹后投放，避免划伤'
    ]
  },
  appliance: {
    type: 1,
    typeName: '可回收垃圾',
    emoji: '♻️',
    color: '#4A90D9',
    tips: [
      '小家电属于可回收垃圾中的废电器类',
      '请拆除电池后投放（电池属有害垃圾）',
      '保持外观完整，避免液体泄漏',
      '大件电器建议预约专业回收上门处理'
    ]
  }
}

const MARKET_REPORT_REASONS = [
  { id: 'fake', name: '物品描述不实' },
  { id: 'broken', name: '物品损坏未说明' },
  { id: 'fraud', name: '疑似诈骗' },
  { id: 'inappropriate', name: '内容不当' },
  { id: 'other', name: '其他原因' }
]

const MARKET_ITEMS_MOCK = [
  {
    id: 'm001',
    title: '《三体》全集三部曲',
    category: 'book',
    images: [
      'https://picsum.photos/id/24/400/400',
      'https://picsum.photos/id/25/400/400'
    ],
    condition: 'good',
    description: '刘慈欣科幻巨著，已读过一遍，书脊有轻微折痕，内页干净无笔记。希望找个爱读书的朋友继续它的旅程。',
    tradeType: 'points',
    price: 150,
    barterWish: '可换其他科幻小说或历史类书籍',
    delivery: 'both',
    location: '上海市浦东新区',
    userId: 'u1001',
    userNickName: '书虫小李',
    userAvatarEmoji: '📖',
    userRating: 4.8,
    userTradeCount: 23,
    status: 'available',
    viewCount: 156,
    favoriteCount: 12,
    createTime: '2024-06-18 14:30',
    tags: ['科幻', '经典', '刘慈欣']
  },
  {
    id: 'm002',
    title: '乐高城市系列 消防车',
    category: 'toy',
    images: [
      'https://picsum.photos/id/30/400/400'
    ],
    condition: 'like_new',
    description: '孩子玩了几次就不感兴趣了，零件齐全，说明书也在。盒子有些旧但积木本身几乎全新。',
    tradeType: 'barter',
    price: 200,
    barterWish: '希望换同等价值的拼图或益智玩具',
    delivery: 'pickup',
    location: '上海市徐汇区',
    userId: 'u1002',
    userNickName: '宝妈阿芳',
    userAvatarEmoji: '👩',
    userRating: 4.9,
    userTradeCount: 45,
    status: 'available',
    viewCount: 89,
    favoriteCount: 8,
    createTime: '2024-06-19 10:15',
    tags: ['乐高', '益智', '儿童']
  },
  {
    id: 'm003',
    title: '小米空气净化器Pro H',
    category: 'appliance',
    images: [
      'https://picsum.photos/id/180/400/400',
      'https://picsum.photos/id/181/400/400'
    ],
    condition: 'good',
    description: '使用一年多，滤芯刚换过一个月，功能一切正常。因为搬家空间不够，便宜出了。',
    tradeType: 'points',
    price: 350,
    barterWish: '',
    delivery: 'pickup',
    location: '上海市静安区',
    userId: 'u1003',
    userNickName: '极简老王',
    userAvatarEmoji: '🧑',
    userRating: 4.7,
    userTradeCount: 12,
    status: 'available',
    viewCount: 234,
    favoriteCount: 31,
    createTime: '2024-06-17 09:45',
    tags: ['小米', '空气净化', '家电']
  },
  {
    id: 'm004',
    title: '《人类简史》+《未来简史》套装',
    category: 'book',
    images: [
      'https://picsum.photos/id/28/400/400'
    ],
    condition: 'good',
    description: '尤瓦尔·赫拉利两部曲，书况良好，扉页有购书日期签名，内页无笔记。',
    tradeType: 'points',
    price: 120,
    barterWish: '',
    delivery: 'mail',
    location: '上海市杨浦区',
    userId: 'u1004',
    userNickName: '历史爱好者',
    userAvatarEmoji: '🧔',
    userRating: 5.0,
    userTradeCount: 8,
    status: 'available',
    viewCount: 67,
    favoriteCount: 5,
    createTime: '2024-06-20 16:20',
    tags: ['历史', '赫拉利', '人文社科']
  },
  {
    id: 'm005',
    title: '费雪多功能学习桌',
    category: 'toy',
    images: [
      'https://picsum.photos/id/325/400/400'
    ],
    condition: 'fair',
    description: '宝宝大了用不上了，功能全部正常，有明显使用痕迹但不影响使用。',
    tradeType: 'barter',
    price: 80,
    barterWish: '可换绘本或其他幼儿玩具',
    delivery: 'pickup',
    location: '上海市闵行区',
    userId: 'u1005',
    userNickName: '二胎妈妈',
    userAvatarEmoji: '👩‍👧',
    userRating: 4.6,
    userTradeCount: 67,
    status: 'available',
    viewCount: 45,
    favoriteCount: 3,
    createTime: '2024-06-16 11:30',
    tags: ['费雪', '早教', '婴幼儿']
  },
  {
    id: 'm006',
    title: '飞利浦电动剃须刀 S5000',
    category: 'appliance',
    images: [
      'https://picsum.photos/id/96/400/400'
    ],
    condition: 'like_new',
    description: '朋友送的，自己已经有了，拆开看过一次没用过。包装盒配件齐全。',
    tradeType: 'points',
    price: 280,
    barterWish: '',
    delivery: 'both',
    location: '上海市长宁区',
    userId: 'u1006',
    userNickName: '数码达人',
    userAvatarEmoji: '🧑‍💻',
    userRating: 4.9,
    userTradeCount: 34,
    status: 'available',
    viewCount: 178,
    favoriteCount: 22,
    createTime: '2024-06-20 08:50',
    tags: ['飞利浦', '剃须刀', '个人护理']
  },
  {
    id: 'm007',
    title: '《活着》余华签名版',
    category: 'book',
    images: [
      'https://picsum.photos/id/107/400/400'
    ],
    condition: 'new',
    description: '余华亲笔签名版，珍藏多年未翻阅。想转给真正喜欢的人。',
    tradeType: 'barter',
    price: 500,
    barterWish: '希望换同等价值的文学经典或作家签名本',
    delivery: 'mail',
    location: '上海市黄浦区',
    userId: 'u1007',
    userNickName: '藏书爱好者',
    userAvatarEmoji: '📚',
    userRating: 5.0,
    userTradeCount: 15,
    status: 'available',
    viewCount: 421,
    favoriteCount: 56,
    createTime: '2024-06-15 20:00',
    tags: ['余华', '签名', '文学经典']
  },
  {
    id: 'm008',
    title: '任天堂Switch游戏机',
    category: 'appliance',
    images: [
      'https://picsum.photos/id/96/400/400',
      'https://picsum.photos/id/119/400/400'
    ],
    condition: 'good',
    description: '日版Switch，红蓝配色，配件齐全，带3款游戏卡带。屏幕有轻微划痕但不影响使用。',
    tradeType: 'points',
    price: 800,
    barterWish: '',
    delivery: 'pickup',
    location: '上海市普陀区',
    userId: 'u1008',
    userNickName: '游戏玩家',
    userAvatarEmoji: '🎮',
    userRating: 4.8,
    userTradeCount: 19,
    status: 'available',
    viewCount: 567,
    favoriteCount: 78,
    createTime: '2024-06-14 15:40',
    tags: ['任天堂', 'Switch', '游戏机']
  }
]

module.exports = {
  MARKET_CATEGORIES,
  CONDITION_LEVELS,
  TRADE_TYPES,
  DELIVERY_TYPES,
  TRASH_DISPOSAL_TIPS,
  MARKET_REPORT_REASONS,
  MARKET_ITEMS_MOCK
}
