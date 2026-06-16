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
 * 个人中心菜单项（分组）
 */
const PROFILE_MENUS = [
  {
    groupId: 'learn',
    groupName: '学习中心',
    items: [
      {
        id: 'quiz',
        icon: 'quiz',
        emoji: '❓',
        title: '知识问答',
        desc: '答题赢取积分奖励',
        link: '/pages/quiz/quiz'
      },
      {
        id: 'daily',
        icon: 'daily',
        emoji: '📅',
        title: '每日一练',
        desc: '每日打卡答题',
        link: '/pages/quiz-daily/quiz-daily'
      },
      {
        id: 'signin',
        icon: 'signin',
        emoji: '📝',
        title: '每日签到',
        desc: '签到获取积分',
        link: '/pages/signin/signin'
      }
    ]
  },
  {
    groupId: 'record',
    groupName: '我的记录',
    items: [
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
      }
    ]
  },
  {
    groupId: 'other',
    groupName: '其他',
    items: [
      {
        id: 'about',
        icon: 'info',
        emoji: 'ℹ️',
        title: '关于我们',
        desc: '了解垃圾分类助手',
        link: ''
      }
    ]
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

/**
 * 知识问答章节数据
 */
const QUIZ_CHAPTERS = [
  {
    id: 1,
    name: '可回收垃圾',
    description: '了解可回收垃圾的分类知识',
    icon: '♻️',
    color: '#4A90D9',
    totalQuestions: 10,
    unlocked: true,
    completed: false,
    progress: 0
  },
  {
    id: 2,
    name: '有害垃圾',
    description: '了解有害垃圾的分类知识',
    icon: '☣️',
    color: '#E85D5D',
    totalQuestions: 10,
    unlocked: true,
    completed: false,
    progress: 0
  },
  {
    id: 3,
    name: '厨余垃圾',
    description: '了解厨余垃圾的分类知识',
    icon: '🍂',
    color: '#5BBD72',
    totalQuestions: 10,
    unlocked: false,
    completed: false,
    progress: 0
  },
  {
    id: 4,
    name: '其他垃圾',
    description: '了解其他垃圾的分类知识',
    icon: '🗑️',
    color: '#8E8E93',
    totalQuestions: 10,
    unlocked: false,
    completed: false,
    progress: 0
  },
  {
    id: 5,
    name: '综合知识',
    description: '垃圾分类综合知识测试',
    icon: '📚',
    color: '#9B59B6',
    totalQuestions: 15,
    unlocked: false,
    completed: false,
    progress: 0
  }
]

/**
 * 知识问答难度等级
 */
const QUIZ_DIFFICULTIES = [
  {
    id: 'easy',
    name: '简单',
    description: '适合初学者，基础题目',
    icon: '🌱',
    color: '#5BBD72',
    pointsPerQuestion: 5,
    totalQuestions: 20
  },
  {
    id: 'medium',
    name: '中等',
    description: '有一定难度，需要思考',
    icon: '🌿',
    color: '#F39C12',
    pointsPerQuestion: 10,
    totalQuestions: 30
  },
  {
    id: 'hard',
    name: '困难',
    description: '高难度题目，挑战极限',
    icon: '🌳',
    color: '#E85D5D',
    pointsPerQuestion: 20,
    totalQuestions: 20
  }
]

/**
 * 知识问答题库
 */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    chapterId: 1,
    difficulty: 'easy',
    question: '塑料瓶属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '塑料瓶属于可回收垃圾，因为塑料可以回收再利用。'
  },
  {
    id: 2,
    chapterId: 1,
    difficulty: 'easy',
    question: '旧报纸属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '旧报纸属于可回收垃圾，纸张可以回收再利用。'
  },
  {
    id: 3,
    chapterId: 1,
    difficulty: 'easy',
    question: '玻璃瓶属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '玻璃瓶属于可回收垃圾，玻璃可以回收再利用。'
  },
  {
    id: 4,
    chapterId: 1,
    difficulty: 'medium',
    question: '下列哪种垃圾不属于可回收垃圾？',
    options: ['易拉罐', '旧衣服', '用过的纸巾', '金属厨具'],
    correctIndex: 2,
    explanation: '用过的纸巾属于其他垃圾，因为纸巾吸水性强，无法回收再利用。'
  },
  {
    id: 5,
    chapterId: 1,
    difficulty: 'medium',
    question: '快递纸箱应该如何处理？',
    options: ['直接丢弃', '清空压扁后投放可回收物', '焚烧处理', '填埋处理'],
    correctIndex: 1,
    explanation: '快递纸箱属于可回收垃圾，投放前应清空内容物并压扁。'
  },
  {
    id: 6,
    chapterId: 1,
    difficulty: 'hard',
    question: '下列哪种塑料可以回收再利用？',
    options: ['PET塑料瓶', '一次性塑料餐盒', '塑料袋', '保鲜膜'],
    correctIndex: 0,
    explanation: 'PET塑料瓶（如矿泉水瓶）可以回收再利用，而一次性塑料餐盒、塑料袋、保鲜膜等由于污染严重，难以回收。'
  },
  {
    id: 7,
    chapterId: 2,
    difficulty: 'easy',
    question: '废电池属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '废电池属于有害垃圾，因为电池中含有重金属等有害物质。'
  },
  {
    id: 8,
    chapterId: 2,
    difficulty: 'easy',
    question: '过期药品属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '过期药品属于有害垃圾，因为过期药品可能对环境和人体健康造成危害。'
  },
  {
    id: 9,
    chapterId: 2,
    difficulty: 'medium',
    question: '下列哪种垃圾不属于有害垃圾？',
    options: ['废灯管', '废油漆', '废电池', '废纸箱'],
    correctIndex: 3,
    explanation: '废纸箱属于可回收垃圾，不属于有害垃圾。'
  },
  {
    id: 10,
    chapterId: 2,
    difficulty: 'medium',
    question: '水银温度计属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '水银温度计属于有害垃圾，因为水银是有毒物质。'
  },
  {
    id: 11,
    chapterId: 2,
    difficulty: 'hard',
    question: '下列关于有害垃圾的说法，错误的是？',
    options: [
      '废灯管应连带包装投放',
      '废药品应连带包装一起投放',
      '有害垃圾可以和其他垃圾混合投放',
      '投放时应轻放，避免破损'
    ],
    correctIndex: 2,
    explanation: '有害垃圾需要单独投放，不能与其他垃圾混合，以免造成污染。'
  },
  {
    id: 12,
    chapterId: 3,
    difficulty: 'easy',
    question: '剩菜剩饭属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '剩菜剩饭属于厨余垃圾，因为它们是易腐烂的生物质废弃物。'
  },
  {
    id: 13,
    chapterId: 3,
    difficulty: 'easy',
    question: '果皮果核属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '果皮果核属于厨余垃圾，因为它们是易腐烂的生物质废弃物。'
  },
  {
    id: 14,
    chapterId: 3,
    difficulty: 'medium',
    question: '下列哪种垃圾不属于厨余垃圾？',
    options: ['菜叶菜根', '蛋壳', '茶渣', '烟蒂'],
    correctIndex: 3,
    explanation: '烟蒂属于其他垃圾，不属于厨余垃圾。'
  },
  {
    id: 15,
    chapterId: 3,
    difficulty: 'medium',
    question: '大骨头属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '大骨头因为难以粉碎，会对厨余垃圾处理设备造成损坏，所以属于其他垃圾。'
  },
  {
    id: 16,
    chapterId: 3,
    difficulty: 'hard',
    question: '下列关于厨余垃圾的说法，正确的是？',
    options: [
      '厨余垃圾可以直接投放，无需沥干水分',
      '食品包装物应去除后再投放',
      '所有骨头都属于厨余垃圾',
      '厨余垃圾可以和其他垃圾混合投放'
    ],
    correctIndex: 1,
    explanation: '投放厨余垃圾前应去除食品包装物，并沥干水分。大骨头属于其他垃圾。'
  },
  {
    id: 17,
    chapterId: 4,
    difficulty: 'easy',
    question: '用过的纸巾属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '用过的纸巾属于其他垃圾，因为纸巾吸水性强，无法回收再利用。'
  },
  {
    id: 18,
    chapterId: 4,
    difficulty: 'easy',
    question: '烟蒂属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '烟蒂属于其他垃圾。'
  },
  {
    id: 19,
    chapterId: 4,
    difficulty: 'medium',
    question: '下列哪种垃圾不属于其他垃圾？',
    options: ['卫生纸', '陶瓷碎片', '一次性餐具', '玻璃瓶'],
    correctIndex: 3,
    explanation: '玻璃瓶属于可回收垃圾，不属于其他垃圾。'
  },
  {
    id: 20,
    chapterId: 4,
    difficulty: 'medium',
    question: '宠物粪便属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '宠物粪便属于其他垃圾。'
  },
  {
    id: 21,
    chapterId: 4,
    difficulty: 'hard',
    question: '难以辨识类别的生活垃圾应该投入什么垃圾容器？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '难以辨识类别的生活垃圾应投入其他垃圾容器。'
  },
  {
    id: 22,
    chapterId: 5,
    difficulty: 'easy',
    question: '垃圾分类的主要目的是什么？',
    options: ['减少垃圾量', '便于回收利用', '美化环境', '以上都是'],
    correctIndex: 3,
    explanation: '垃圾分类的主要目的是减少垃圾量、便于回收利用、美化环境等。'
  },
  {
    id: 23,
    chapterId: 5,
    difficulty: 'medium',
    question: '下列哪种垃圾可以进行堆肥处理？',
    options: ['厨余垃圾', '可回收垃圾', '有害垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '厨余垃圾可以进行堆肥处理，转化为有机肥料。'
  },
  {
    id: 24,
    chapterId: 5,
    difficulty: 'medium',
    question: '下列哪种垃圾需要特殊安全处理？',
    options: ['厨余垃圾', '可回收垃圾', '有害垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '有害垃圾需要特殊安全处理，以防止对环境和人体健康造成危害。'
  },
  {
    id: 25,
    chapterId: 5,
    difficulty: 'hard',
    question: '下列关于垃圾分类的说法，错误的是？',
    options: [
      '垃圾分类可以减少环境污染',
      '垃圾分类可以节约资源',
      '垃圾分类是政府的事，与个人无关',
      '垃圾分类可以变废为宝'
    ],
    correctIndex: 2,
    explanation: '垃圾分类是每个人的责任，需要全社会共同参与。'
  }
]

/**
 * 根据章节获取题目
 * @param {number} chapterId 章节ID
 * @returns {Array} 题目列表
 */
const getQuestionsByChapter = (chapterId) => {
  return QUIZ_QUESTIONS.filter(q => q.chapterId === chapterId)
}

/**
 * 根据难度获取题目
 * @param {string} difficulty 难度等级
 * @returns {Array} 题目列表
 */
const getQuestionsByDifficulty = (difficulty) => {
  return QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty)
}

/**
 * 随机获取指定数量的题目
 * @param {number} count 题目数量
 * @param {string} difficulty 难度等级（可选）
 * @returns {Array} 题目列表
 */
const getRandomQuestions = (count, difficulty = null) => {
  let questions = difficulty ? getQuestionsByDifficulty(difficulty) : [...QUIZ_QUESTIONS]
  const shuffled = questions.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

/**
 * 获取每日一练题目（每天5题）
 * @returns {Array} 题目列表
 */
const getDailyQuestions = () => {
  const today = new Date().toDateString()
  const seed = today.split(' ').reduce((acc, val) => acc + val.charCodeAt(0), 0)

  const questions = [...QUIZ_QUESTIONS]
  const shuffled = questions.sort((a, b) => {
    const hashA = (a.id * seed) % questions.length
    const hashB = (b.id * seed) % questions.length
    return hashA - hashB
  })

  return shuffled.slice(0, 5)
}

/**
 * 垃圾分类练习题库
 * 基于常见垃圾示例生成具体的练习条目
 */
const SORT_PRACTICE_ITEMS = [
  { id: 1, name: '报纸', typeId: 1, emoji: '📰', desc: '废纸张类' },
  { id: 2, name: '书本', typeId: 1, emoji: '📚', desc: '废纸张类' },
  { id: 3, name: '纸箱', typeId: 1, emoji: '📦', desc: '废纸张类' },
  { id: 4, name: '快递盒', typeId: 1, emoji: '📦', desc: '废纸张类' },
  { id: 5, name: '塑料瓶', typeId: 1, emoji: '🧴', desc: '废塑料类' },
  { id: 6, name: '塑料盆', typeId: 1, emoji: '🪣', desc: '废塑料类' },
  { id: 7, name: '塑料玩具', typeId: 1, emoji: '🧸', desc: '废塑料类' },
  { id: 8, name: '玻璃瓶', typeId: 1, emoji: '🍶', desc: '废玻璃类' },
  { id: 9, name: '玻璃杯', typeId: 1, emoji: '🥛', desc: '废玻璃类' },
  { id: 10, name: '镜子', typeId: 1, emoji: '🪞', desc: '废玻璃类' },
  { id: 11, name: '易拉罐', typeId: 1, emoji: '🥫', desc: '废金属类' },
  { id: 12, name: '金属罐头', typeId: 1, emoji: '🥫', desc: '废金属类' },
  { id: 13, name: '金属厨具', typeId: 1, emoji: '🍳', desc: '废金属类' },
  { id: 14, name: '旧衣服', typeId: 1, emoji: '👕', desc: '废织物类' },
  { id: 15, name: '床单', typeId: 1, emoji: '🛏️', desc: '废织物类' },
  { id: 16, name: '毛巾', typeId: 1, emoji: '🧣', desc: '废织物类' },
  { id: 17, name: '书包', typeId: 1, emoji: '🎒', desc: '废织物类' },
  { id: 18, name: '电视机', typeId: 1, emoji: '📺', desc: '废电器类' },
  { id: 19, name: '洗衣机', typeId: 1, emoji: '🧺', desc: '废电器类' },
  { id: 20, name: '电脑', typeId: 1, emoji: '💻', desc: '废电器类' },

  { id: 21, name: '充电电池', typeId: 2, emoji: '🔋', desc: '废电池类' },
  { id: 22, name: '纽扣电池', typeId: 2, emoji: '🔋', desc: '废电池类' },
  { id: 23, name: '蓄电池', typeId: 2, emoji: '🔋', desc: '废电池类' },
  { id: 24, name: '荧光灯管', typeId: 2, emoji: '💡', desc: '废灯管类' },
  { id: 25, name: '节能灯', typeId: 2, emoji: '💡', desc: '废灯管类' },
  { id: 26, name: 'LED灯', typeId: 2, emoji: '💡', desc: '废灯管类' },
  { id: 27, name: '过期药品', typeId: 2, emoji: '💊', desc: '废药品类' },
  { id: 28, name: '药品包装', typeId: 2, emoji: '💊', desc: '废药品类' },
  { id: 29, name: '油漆桶', typeId: 2, emoji: '🎨', desc: '废油漆类' },
  { id: 30, name: '染发剂', typeId: 2, emoji: '🎨', desc: '废油漆类' },
  { id: 31, name: '指甲油', typeId: 2, emoji: '💅', desc: '废油漆类' },
  { id: 32, name: '杀虫喷雾', typeId: 2, emoji: '🧪', desc: '废杀虫剂类' },
  { id: 33, name: '消毒剂', typeId: 2, emoji: '🧪', desc: '废杀虫剂类' },
  { id: 34, name: '水银温度计', typeId: 2, emoji: '🌡️', desc: '废水银类' },
  { id: 35, name: '水银血压计', typeId: 2, emoji: '🩺', desc: '废水银类' },

  { id: 36, name: '剩菜剩饭', typeId: 3, emoji: '🍚', desc: '食物残渣类' },
  { id: 37, name: '米饭', typeId: 3, emoji: '🍚', desc: '食物残渣类' },
  { id: 38, name: '面条', typeId: 3, emoji: '🍜', desc: '食物残渣类' },
  { id: 39, name: '蔬菜', typeId: 3, emoji: '🥬', desc: '食物残渣类' },
  { id: 40, name: '肉类', typeId: 3, emoji: '🥩', desc: '食物残渣类' },
  { id: 41, name: '苹果皮', typeId: 3, emoji: '🍎', desc: '果皮果核类' },
  { id: 42, name: '香蕉皮', typeId: 3, emoji: '🍌', desc: '果皮果核类' },
  { id: 43, name: '橘子皮', typeId: 3, emoji: '🍊', desc: '果皮果核类' },
  { id: 44, name: '鸡蛋壳', typeId: 3, emoji: '🥚', desc: '蛋壳类' },
  { id: 45, name: '鸭蛋壳', typeId: 3, emoji: '🥚', desc: '蛋壳类' },
  { id: 46, name: '茶叶渣', typeId: 3, emoji: '🍵', desc: '茶渣类' },
  { id: 47, name: '咖啡渣', typeId: 3, emoji: '☕', desc: '茶渣类' },
  { id: 48, name: '白菜帮', typeId: 3, emoji: '🥬', desc: '菜叶菜根类' },
  { id: 49, name: '萝卜缨', typeId: 3, emoji: '🥕', desc: '菜叶菜根类' },
  { id: 50, name: '鸡骨', typeId: 3, emoji: '🦴', desc: '骨头类' },
  { id: 51, name: '鱼骨', typeId: 3, emoji: '🐟', desc: '骨头类' },
  { id: 52, name: '小排骨', typeId: 3, emoji: '🦴', desc: '骨头类' },

  { id: 53, name: '用过的纸巾', typeId: 4, emoji: '🧻', desc: '卫生纸类' },
  { id: 54, name: '卫生纸', typeId: 4, emoji: '🧻', desc: '卫生纸类' },
  { id: 55, name: '烟蒂', typeId: 4, emoji: '🚬', desc: '烟蒂类' },
  { id: 56, name: '烟灰', typeId: 4, emoji: '🚬', desc: '烟蒂类' },
  { id: 57, name: '陶瓷碎片', typeId: 4, emoji: '🏺', desc: '陶瓷类' },
  { id: 58, name: '碎花盆', typeId: 4, emoji: '🪴', desc: '陶瓷类' },
  { id: 59, name: '碎碗碟', typeId: 4, emoji: '🍽️', desc: '陶瓷类' },
  { id: 60, name: '一次性筷子', typeId: 4, emoji: '🥢', desc: '一次性餐具类' },
  { id: 61, name: '塑料餐盒', typeId: 4, emoji: '🥡', desc: '一次性餐具类' },
  { id: 62, name: '尘土', typeId: 4, emoji: '🧹', desc: '尘土类' },
  { id: 63, name: '渣土', typeId: 4, emoji: '🧹', desc: '尘土类' },
  { id: 64, name: '猫砂', typeId: 4, emoji: '🐱', desc: '宠物粪便类' },
  { id: 65, name: '狗粪便', typeId: 4, emoji: '💩', desc: '宠物粪便类' },
  { id: 66, name: '大骨头', typeId: 4, emoji: '🦴', desc: '其他类' },
  { id: 67, name: '椰子壳', typeId: 4, emoji: '🥥', desc: '其他类' },
  { id: 68, name: '榴莲壳', typeId: 4, emoji: '🥥', desc: '其他类' }
]

/**
 * 根据类别获取垃圾分类练习题目
 * @param {number} typeId 分类ID
 * @returns {Array} 练习题目列表
 */
const getSortItemsByType = (typeId) => {
  return SORT_PRACTICE_ITEMS.filter(item => item.typeId === typeId)
}

/**
 * 随机获取指定数量的垃圾分类练习题目
 * @param {number} count 题目数量
 * @param {number} typeId 分类ID（可选，不传则全部类别随机）
 * @returns {Array} 练习题目列表
 */
const getRandomSortItems = (count, typeId = null) => {
  let items = typeId ? getSortItemsByType(typeId) : [...SORT_PRACTICE_ITEMS]
  const shuffled = items.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

module.exports = {
  TRASH_TYPES,
  BANNER_LIST,
  EXCHANGE_GOODS,
  EXCHANGE_BANNERS,
  PROFILE_MENUS,
  USER_LEVELS,
  getUserLevel,
  QUIZ_CHAPTERS,
  QUIZ_DIFFICULTIES,
  QUIZ_QUESTIONS,
  getQuestionsByChapter,
  getQuestionsByDifficulty,
  getRandomQuestions,
  getDailyQuestions,
  SORT_PRACTICE_ITEMS,
  getSortItemsByType,
  getRandomSortItems
}
