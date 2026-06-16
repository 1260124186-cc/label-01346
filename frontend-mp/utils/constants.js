/**
 * 常量配置模块
 * @description 存放全局常量和配置数据
 */

/**
 * 垃圾分类类型数据
 */
const TRASH_TYPES = [
  {
    id: 1,
    name: '可回收垃圾',
    englishName: 'Recyclable',
    icon: '/images/trash/recyclable.png',
    emoji: '♻️',
    color: '#4A90D9',
    bgColor: 'rgba(74, 144, 217, 0.1)',
    gradientStart: '#5DA3E8',
    gradientEnd: '#4A90D9',
    description: '可回收垃圾是指适宜回收利用和资源化利用的生活废弃物，包括废纸张、废塑料、废玻璃制品、废金属、废织物等。',
    examples: [
      { name: '废纸张', desc: '报纸、书本、纸箱、快递盒等', icon: '📰' },
      { name: '废塑料', desc: '塑料瓶、塑料盆、塑料玩具等', icon: '🧴' },
      { name: '废玻璃', desc: '玻璃瓶、玻璃杯、镜子等', icon: '🍶' },
      { name: '废金属', desc: '易拉罐、金属罐头、金属厨具等', icon: '🥫' },
      { name: '废织物', desc: '旧衣服、床单、毛巾、书包等', icon: '👕' },
      { name: '废电器', desc: '电视机、洗衣机、电脑等', icon: '📺' }
    ],
    tips: [
      '投放前请清空内容物，保持清洁干燥',
      '立体包装请清空压扁后投放',
      '易破损或有尖锐边角的请包裹后投放'
    ]
  },
  {
    id: 2,
    name: '有害垃圾',
    englishName: 'Harmful',
    icon: '/images/trash/harmful.png',
    emoji: '☣️',
    color: '#E85D5D',
    bgColor: 'rgba(232, 93, 93, 0.1)',
    gradientStart: '#F06E6E',
    gradientEnd: '#E85D5D',
    description: '有害垃圾是指对人体健康或者自然环境造成直接或者潜在危害的生活废弃物，需要特殊安全处理。',
    examples: [
      { name: '废电池', desc: '充电电池、纽扣电池、蓄电池等', icon: '🔋' },
      { name: '废灯管', desc: '荧光灯管、节能灯、LED灯等', icon: '💡' },
      { name: '废药品', desc: '过期药品、药品包装等', icon: '💊' },
      { name: '废油漆', desc: '油漆桶、染发剂、指甲油等', icon: '🎨' },
      { name: '废杀虫剂', desc: '杀虫喷雾、消毒剂等', icon: '🧪' },
      { name: '废水银', desc: '水银温度计、水银血压计等', icon: '🌡️' }
    ],
    tips: [
      '投放时请注意轻放，避免破损',
      '废灯管等易碎物品请连带包装投放',
      '废药品请连带包装一起投放'
    ]
  },
  {
    id: 3,
    name: '厨余垃圾',
    englishName: 'Kitchen',
    icon: '/images/trash/kitchen.png',
    emoji: '🍂',
    color: '#5BBD72',
    bgColor: 'rgba(91, 189, 114, 0.1)',
    gradientStart: '#6ECC84',
    gradientEnd: '#5BBD72',
    description: '厨余垃圾是指居民日常生活及食品加工、饮食服务、单位供餐等活动中产生的垃圾，包括丢弃不用的菜叶、剩菜、剩饭、果皮、蛋壳、茶渣、骨头等。',
    examples: [
      { name: '剩菜剩饭', desc: '米饭、面条、蔬菜、肉类等', icon: '🍚' },
      { name: '果皮果核', desc: '苹果皮、香蕉皮、橘子皮等', icon: '🍎' },
      { name: '蛋壳', desc: '鸡蛋壳、鸭蛋壳等', icon: '🥚' },
      { name: '茶渣', desc: '茶叶渣、咖啡渣等', icon: '🍵' },
      { name: '菜叶菜根', desc: '白菜帮、萝卜缨等', icon: '🥬' },
      { name: '骨头', desc: '鸡骨、鱼骨、猪骨等小型骨头', icon: '🦴' }
    ],
    tips: [
      '投放前请沥干水分',
      '去除食品包装物后投放',
      '大块骨头请敲碎后投放'
    ]
  },
  {
    id: 4,
    name: '其他垃圾',
    englishName: 'Other',
    icon: '/images/trash/other.png',
    emoji: '🗑️',
    color: '#8E8E93',
    bgColor: 'rgba(142, 142, 147, 0.1)',
    gradientStart: '#A0A0A5',
    gradientEnd: '#8E8E93',
    description: '其他垃圾是指除可回收垃圾、有害垃圾、厨余垃圾以外的其他生活废弃物，即除去可回收垃圾、有害垃圾、厨余垃圾之外的所有垃圾的总称。',
    examples: [
      { name: '卫生纸', desc: '用过的纸巾、卫生纸等', icon: '🧻' },
      { name: '烟蒂', desc: '烟头、烟灰等', icon: '🚬' },
      { name: '陶瓷碎片', desc: '碎花盆、碎碗碟等', icon: '🏺' },
      { name: '一次性餐具', desc: '一次性筷子、塑料餐盒等', icon: '🥢' },
      { name: '尘土', desc: '清扫的灰尘、渣土等', icon: '🧹' },
      { name: '宠物粪便', desc: '猫砂、狗粪便等', icon: '💩' }
    ],
    tips: [
      '尽量沥干水分后投放',
      '难以辨识类别的生活垃圾投入其他垃圾容器',
      '大件垃圾请预约上门回收'
    ]
  }
]

/**
 * 首页轮播图数据
 * 使用本地图片资源
 */
const BANNER_LIST = [
  {
    id: 1,
    image: '/images/banner/banner1.jpg',
    title: '垃圾分类，从我做起',
    link: ''
  },
  {
    id: 2,
    image: '/images/banner/banner2.jpg',
    title: '保护环境，人人有责',
    link: ''
  },
  {
    id: 3,
    image: '/images/banner/banner3.jpg',
    title: '绿色生活，美好未来',
    link: ''
  }
]

/**
 * 积分兑换商品数据
 */
const EXCHANGE_GOODS = [
  {
    id: 1,
    name: '环保购物袋',
    description: '可重复使用的环保购物袋，减少塑料袋使用',
    points: 100,
    originalPoints: 150,
    image: '/images/goods/goods1.jpg',
    stock: 50,
    sales: 128,
    tag: '热门'
  },
  {
    id: 2,
    name: '便携餐具套装',
    description: '不锈钢材质，包含筷子、勺子、叉子',
    points: 200,
    originalPoints: 280,
    image: '/images/goods/goods2.jpg',
    stock: 30,
    sales: 86,
    tag: '推荐'
  },
  {
    id: 3,
    name: '保温杯',
    description: '316不锈钢内胆，保温12小时',
    points: 500,
    originalPoints: 680,
    image: '/images/goods/goods3.jpg',
    stock: 20,
    sales: 45,
    tag: ''
  },
  {
    id: 4,
    name: '竹纤维毛巾',
    description: '天然竹纤维，柔软亲肤，抗菌抑菌',
    points: 150,
    originalPoints: 200,
    image: '/images/goods/goods4.jpg',
    stock: 100,
    sales: 256,
    tag: '热门'
  },
  {
    id: 5,
    name: '可降解垃圾袋',
    description: '玉米淀粉材质，3个月自然降解',
    points: 80,
    originalPoints: 100,
    image: '/images/goods/goods5.jpg',
    stock: 200,
    sales: 512,
    tag: '热门'
  },
  {
    id: 6,
    name: '多肉植物盆栽',
    description: '精选多肉植物，含陶瓷花盆',
    points: 300,
    originalPoints: 400,
    image: '/images/goods/goods6.jpg',
    stock: 15,
    sales: 32,
    tag: '限量'
  }
]

/**
 * 积分兑换轮播广告
 */
const EXCHANGE_BANNERS = [
  {
    id: 1,
    image: '/images/banner/exchange1.jpg',
    title: '新人专享 双倍积分'
  },
  {
    id: 2,
    image: '/images/banner/exchange2.jpg',
    title: '限时秒杀 低至5折'
  },
  {
    id: 3,
    image: '/images/banner/exchange3.jpg',
    title: '环保达人 专属福利'
  }
]

/**
 * 个人中心菜单项
 */
const PROFILE_MENUS = [
  {
    id: 'records',
    icon: 'history',
    emoji: '📊',
    title: '分类记录',
    desc: '查看历史分类记录',
    link: '/pages/records/records'
  },
  {
    id: 'points',
    icon: 'coin',
    emoji: '💰',
    title: '积分明细',
    desc: '查看积分获取与消费',
    link: '/pages/points/points'
  },
  {
    id: 'orders',
    icon: 'order',
    emoji: '📦',
    title: '兑换订单',
    desc: '查看商品兑换记录',
    link: '/pages/orders/orders'
  },
  {
    id: 'about',
    icon: 'info',
    emoji: 'ℹ️',
    title: '关于我们',
    desc: '了解垃圾分类助手',
    link: ''
  }
]

/**
 * 用户等级配置
 */
const USER_LEVELS = [
  { level: 1, name: '环保新手', minPoints: 0, maxPoints: 500, icon: '🌱' },
  { level: 2, name: '环保学徒', minPoints: 500, maxPoints: 1500, icon: '🌿' },
  { level: 3, name: '环保达人', minPoints: 1500, maxPoints: 3500, icon: '🌳' },
  { level: 4, name: '环保专家', minPoints: 3500, maxPoints: 7000, icon: '🌲' },
  { level: 5, name: '环保大师', minPoints: 7000, maxPoints: Infinity, icon: '🏆' }
]

/**
 * 获取用户等级信息
 * @param {number} points 用户积分
 * @returns {Object} 等级信息
 */
const getUserLevel = (points) => {
  for (const level of USER_LEVELS) {
    if (points >= level.minPoints && points < level.maxPoints) {
      return {
        ...level,
        progress: (points - level.minPoints) / (level.maxPoints - level.minPoints) * 100
      }
    }
  }
  return USER_LEVELS[0]
}

module.exports = {
  TRASH_TYPES,
  BANNER_LIST,
  EXCHANGE_GOODS,
  EXCHANGE_BANNERS,
  PROFILE_MENUS,
  USER_LEVELS,
  getUserLevel
}
