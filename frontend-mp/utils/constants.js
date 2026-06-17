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
 * 场景分类（厨房、办公室、校园）
 */
const QUIZ_SCENES = [
  {
    id: 'kitchen',
    name: '厨房',
    description: '家庭厨房、餐厅后厨等场景',
    icon: '🍳',
    color: '#F39C12'
  },
  {
    id: 'office',
    name: '办公室',
    description: '公司办公、写字楼等场景',
    icon: '💼',
    color: '#3498DB'
  },
  {
    id: 'campus',
    name: '校园',
    description: '学校教室、食堂、宿舍等场景',
    icon: '🎓',
    color: '#27AE60'
  }
]

/**
 * 题型分类
 */
const QUIZ_QUESTION_TYPES = [
  { id: 'single', name: '单选题', icon: '①' },
  { id: 'multiple', name: '多选题', icon: '②' },
  { id: 'judge', name: '判断题', icon: '✓✗' }
]

/**
 * 首页轮播图数据
 */
const BANNER_LIST = [
  { id: 1, image: '/images/banner/banner1.jpg', title: '新人专享 双倍积分', linkType: 'activity', linkId: '1' },
  { id: 2, image: '/images/banner/banner2.jpg', title: '知识问答 挑战赢积分', linkType: 'quiz', linkId: '' },
  { id: 3, image: '/images/banner/banner3.jpg', title: '了解厨余分类详情', linkType: 'classify', linkId: '3' }
]

/**
 * 积分兑换商品数据
 */
const EXCHANGE_GOODS = [
  { id: 1, name: '环保购物袋', description: '可重复使用的环保购物袋，减少塑料袋使用', points: 100, originalPoints: 150, image: '/images/goods/goods1.jpg', stock: 50, sales: 128, tag: '热门' },
  { id: 2, name: '便携餐具套装', description: '不锈钢材质，包含筷子、勺子、叉子', points: 200, originalPoints: 280, image: '/images/goods/goods2.jpg', stock: 30, sales: 86, tag: '推荐' },
  { id: 3, name: '保温杯', description: '316不锈钢内胆，保温12小时', points: 500, originalPoints: 680, image: '/images/goods/goods3.jpg', stock: 20, sales: 45, tag: '' },
  { id: 4, name: '竹纤维毛巾', description: '天然竹纤维，柔软亲肤，抗菌抑菌', points: 150, originalPoints: 200, image: '/images/goods/goods4.jpg', stock: 100, sales: 256, tag: '热门' },
  { id: 5, name: '可降解垃圾袋', description: '玉米淀粉材质，3个月自然降解', points: 80, originalPoints: 100, image: '/images/goods/goods5.jpg', stock: 200, sales: 512, tag: '热门' },
  { id: 6, name: '多肉植物盆栽', description: '精选多肉植物，含陶瓷花盆', points: 300, originalPoints: 400, image: '/images/goods/goods6.jpg', stock: 15, sales: 32, tag: '限量' }
]

/**
 * 积分兑换轮播广告
 */
const EXCHANGE_BANNERS = [
  { id: 1, image: '/images/banner/exchange1.jpg', title: '新人专享 双倍积分' },
  { id: 2, image: '/images/banner/exchange2.jpg', title: '限时秒杀 低至5折' },
  { id: 3, image: '/images/banner/exchange3.jpg', title: '环保达人 专属福利' }
]

/**
 * 个人中心菜单项（分组）
 */
const SHARE_CONFIG = {
  dailySharePoints: 10,
  dailyShareMaxPoints: 10,
  shareTitle: '垃圾分类助手 - 让垃圾分类更简单',
  shareImageUrl: '',
  sharePath: '/pages/index/index'
}

const INVITE_CONFIG = {
  inviterRewardPoints: 100,
  inviteeRewardPoints: 50,
  maxInviteCount: 100,
  posterTitle: '邀请好友一起学垃圾分类',
  posterSubtitle: '双方都能获得积分奖励哦',
  posterBgColor: '#5BBD72'
}

const PROFILE_MENUS = [
  {
    groupId: 'learn',
    groupName: '学习中心',
    items: [
      { id: 'quiz', icon: 'quiz', emoji: '❓', title: '知识问答', desc: '答题赢取积分奖励', link: '/pages/quiz/quiz' },
      { id: 'daily', icon: 'daily', emoji: '📅', title: '每日一练', desc: '每日打卡答题', link: '/pages/quiz-daily/quiz-daily' },
      { id: 'signin', icon: 'signin', emoji: '📝', title: '每日签到', desc: '签到获取积分', link: '/pages/signin/signin' },
      { id: 'leaderboard', icon: 'leaderboard', emoji: '🏆', title: '排行榜', desc: '查看各类排名', link: '/pages/leaderboard/leaderboard' },
      { id: 'pk', icon: 'pk', emoji: '⚔️', title: '好友PK', desc: '实时对战赢积分', link: '/pages/pk-battle/pk-battle' }
    ]
  },
  {
    groupId: 'record',
    groupName: '我的记录',
    items: [
      { id: 'records', icon: 'history', emoji: '📊', title: '分类记录', desc: '查看历史分类记录', link: '/pages/records/records' },
      { id: 'quizRecords', icon: 'quiz', emoji: '📝', title: '答题历史', desc: '查看每次答题详情', link: '/pages/quiz-records/quiz-records' },
      { id: 'points', icon: 'coin', emoji: '💰', title: '积分明细', desc: '查看积分获取与消费', link: '/pages/points/points' },
      { id: 'orders', icon: 'order', emoji: '📦', title: '兑换订单', desc: '查看商品兑换记录', link: '/pages/orders/orders' }
    ]
  },
  {
    groupId: 'service',
    groupName: '我的服务',
    items: [
      { id: 'invite', icon: 'invite', emoji: '👥', title: '我的邀请', desc: '邀请好友得积分奖励', link: '/pages/invite/invite' },
      { id: 'address', icon: 'address', emoji: '📍', title: '收货地址', desc: '管理收货地址信息', link: '/pages/address-list/address-list' }
    ]
  },
  {
    groupId: 'other',
    groupName: '其他',
    items: [
      { id: 'settings', icon: 'settings', emoji: '⚙️', title: '设置', desc: '通知、缓存、隐私等', link: '/pages/settings/settings' },
      { id: 'about', icon: 'info', emoji: 'ℹ️', title: '关于我们', desc: '了解垃圾分类助手', link: '' }
    ]
  }
]

/**
 * 用户等级配置
 */
const USER_LEVELS = [
  { level: 1, name: '环保新手', minPoints: 0, maxPoints: 500, icon: '🌱' },
  { level: 2, name: '环保学徒', minPoints: 500, maxPoints: 1200, icon: '🌿' },
  { level: 3, name: '环保达人', minPoints: 1200, maxPoints: 3500, icon: '🌳' },
  { level: 4, name: '环保专家', minPoints: 3500, maxPoints: 7000, icon: '🌲' },
  { level: 5, name: '环保大师', minPoints: 7000, maxPoints: Infinity, icon: '🏆' }
]

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
  { id: 1, name: '可回收垃圾', description: '了解可回收垃圾的分类知识', icon: '♻️', color: '#4A90D9', totalQuestions: 36, unlocked: true, completed: false, progress: 0 },
  { id: 2, name: '有害垃圾', description: '了解有害垃圾的分类知识', icon: '☣️', color: '#E85D5D', totalQuestions: 30, unlocked: true, completed: false, progress: 0 },
  { id: 3, name: '厨余垃圾', description: '了解厨余垃圾的分类知识', icon: '🍂', color: '#5BBD72', totalQuestions: 36, unlocked: false, completed: false, progress: 0 },
  { id: 4, name: '其他垃圾', description: '了解其他垃圾的分类知识', icon: '🗑️', color: '#8E8E93', totalQuestions: 28, unlocked: false, completed: false, progress: 0 },
  { id: 5, name: '综合知识', description: '垃圾分类综合知识测试', icon: '📚', color: '#9B59B6', totalQuestions: 40, unlocked: false, completed: false, progress: 0 }
]

/**
 * 知识问答难度等级
 */
const QUIZ_DIFFICULTIES = [
  { id: 'easy', name: '简单', description: '适合初学者，基础题目', icon: '🌱', color: '#5BBD72', pointsPerQuestion: 5, totalQuestions: 60 },
  { id: 'medium', name: '中等', description: '有一定难度，需要思考', icon: '🌿', color: '#F39C12', pointsPerQuestion: 10, totalQuestions: 60 },
  { id: 'hard', name: '困难', description: '高难度题目，挑战极限', icon: '🌳', color: '#E85D5D', pointsPerQuestion: 20, totalQuestions: 50 }
]

const QUIZ_TIMED_CONFIG = {
  timePerQuestion: 15,
  totalQuestions: 10,
  accuracyBonus: [
    { minAccuracy: 90, bonus: 50, name: '完美' },
    { minAccuracy: 80, bonus: 30, name: '优秀' },
    { minAccuracy: 60, bonus: 15, name: '良好' },
    { minAccuracy: 0, bonus: 5, name: '加油' }
  ]
}

const QUIZ_BOSS_CONFIG = {
  unlockAccuracy: 80,
  questionsCount: 10,
  bossIcon: '👹',
  bossName: 'Boss关',
  bonusPoints: 100
}

const QUIZ_WRONG_SORT_CONFIG = {
  sortBy: ['wrongCount', 'wrongTime'],
  sortOrder: ['desc', 'desc']
}

const QUIZ_POINTS_CONFIG = {
  dailyCompletionBonus: 30,
  dailyModeLimits: {
    daily: 100,
    chapter: 200,
    difficulty: 200,
    timed: 150,
    boss: 100,
    wrong: 50
  },
  wrongReviewFirstCorrectOnly: true
}

/**
 * 知识问答题库（170+题）
 * 题目结构扩展：
 *  - type: 'single'(单选) | 'multiple'(多选) | 'judge'(判断)
 *  - scenes: 场景标签数组 ['kitchen', 'office', 'campus']
 *  - correctIndexes: 多选题正确答案数组（单选/判断仍用 correctIndex）
 *  - explanationImage: 解析配图 URL
 *  - errorTip: 易错提示
 *  - relatedTrash: 关联垃圾条目 [{name, typeId, emoji}]
 */
const QUIZ_QUESTIONS = [
  // ========= 第1章 可回收垃圾（36题） =========
  // --- 单选 easy ---
  { id: 1, type: 'single', chapterId: 1, difficulty: 'easy', scenes: ['kitchen', 'office', 'campus'],
    question: '塑料瓶属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '塑料瓶属于可回收垃圾，因为塑料可以回收再利用。PET塑料瓶是常见的回收物，经过清洗、破碎、造粒后可制成新的塑料制品。',
    explanationImage: '',
    errorTip: '注意区分：干净的塑料瓶可回收，沾有油污的外卖塑料餐盒属其他垃圾。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}]
  },
  { id: 2, type: 'single', chapterId: 1, difficulty: 'easy', scenes: ['office', 'campus'],
    question: '旧报纸属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '旧报纸属于可回收垃圾，纸张可以回收再利用，制成再生纸浆和新的纸制品。',
    explanationImage: '',
    errorTip: '干净的报纸可回收，但被油污、食物污染的纸张属其他垃圾。',
    relatedTrash: [{name: '报纸', typeId: 1, emoji: '📰'}, {name: '书本', typeId: 1, emoji: '📚'}]
  },
  { id: 3, type: 'single', chapterId: 1, difficulty: 'easy', scenes: ['kitchen', 'office'],
    question: '玻璃瓶属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '玻璃瓶属于可回收垃圾，玻璃可以回收再利用。玻璃是可无限循环利用的材料。',
    explanationImage: '',
    errorTip: '碎玻璃请用厚纸包裹后投放，避免划伤。',
    relatedTrash: [{name: '玻璃瓶', typeId: 1, emoji: '🍶'}, {name: '玻璃杯', typeId: 1, emoji: '🥛'}]
  },
  { id: 4, type: 'single', chapterId: 1, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '易拉罐属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '易拉罐属于可回收垃圾中的废金属类，主要由铝或铁制成，回收价值高。',
    explanationImage: '',
    errorTip: '回收前请倒空罐内液体并简单冲洗。',
    relatedTrash: [{name: '易拉罐', typeId: 1, emoji: '🥫'}, {name: '金属罐头', typeId: 1, emoji: '🥫'}]
  },
  { id: 5, type: 'single', chapterId: 1, difficulty: 'easy', scenes: ['campus'],
    question: '旧书本属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '旧书本属于可回收垃圾中的废纸张类，回收后可制成再生纸。',
    explanationImage: '',
    errorTip: '建议旧书捐赠或转卖，比单纯回收更环保。',
    relatedTrash: [{name: '书本', typeId: 1, emoji: '📚'}, {name: '纸箱', typeId: 1, emoji: '📦'}]
  },
  { id: 6, type: 'single', chapterId: 1, difficulty: 'easy', scenes: ['campus', 'office'],
    question: '干净的旧衣服属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '干净的旧衣服属于可回收垃圾中的废织物类，可通过回收再加工利用。',
    explanationImage: '',
    errorTip: '建议旧衣物先捐赠，无法捐赠再作回收处理。脏污严重的旧衣物属其他垃圾。',
    relatedTrash: [{name: '旧衣服', typeId: 1, emoji: '👕'}, {name: '床单', typeId: 1, emoji: '🛏️'}]
  },

  // --- 判断 easy ---
  { id: 7, type: 'judge', chapterId: 1, difficulty: 'easy', scenes: ['office', 'campus'],
    question: '干净的快递纸箱应该拆开压扁后投放至可回收物容器。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '快递纸箱属于可回收垃圾，投放前应清空内容物、去除胶带并拆开压扁，以节省运输空间和提高回收效率。',
    explanationImage: '',
    errorTip: '纸箱上的胶带无需完全去除，但打包用的塑料膜要撕下来单独处理。',
    relatedTrash: [{name: '快递盒', typeId: 1, emoji: '📦'}, {name: '纸箱', typeId: 1, emoji: '📦'}]
  },
  { id: 8, type: 'judge', chapterId: 1, difficulty: 'easy', scenes: ['kitchen', 'office'],
    question: '矿泉水瓶是可回收垃圾，可以不清洗直接投放。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '矿泉水瓶虽属于可回收垃圾，但投放前应倒空液体并简单冲洗干净，避免污染其他可回收物。',
    explanationImage: '',
    errorTip: '带有严重油污或残留物的塑料容器属其他垃圾。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}]
  },

  // --- 多选 easy ---
  { id: 9, type: 'multiple', chapterId: 1, difficulty: 'easy', scenes: ['office', 'campus'],
    question: '以下哪些属于可回收垃圾？（多选）',
    options: ['旧报纸', '塑料瓶', '易拉罐', '烟蒂'],
    correctIndexes: [0, 1, 2],
    explanation: '旧报纸属于废纸张，塑料瓶属于废塑料，易拉罐属于废金属，三者都可回收。烟蒂属于其他垃圾。',
    explanationImage: '',
    errorTip: '多选题需选全所有正确选项，少选或错选均不得分。',
    relatedTrash: [{name: '报纸', typeId: 1, emoji: '📰'}, {name: '塑料瓶', typeId: 1, emoji: '🧴'}, {name: '易拉罐', typeId: 1, emoji: '🥫'}, {name: '烟蒂', typeId: 4, emoji: '🚬'}]
  },
  { id: 10, type: 'multiple', chapterId: 1, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '以下属于废织物可回收物的是？（多选）',
    options: ['旧床单', '干净旧毛巾', '脏污严重的校服', '完好的旧书包'],
    correctIndexes: [0, 1, 3],
    explanation: '旧床单、干净旧毛巾、旧书包属于可回收的废织物。脏污严重、无法清洗干净的织物属其他垃圾。',
    explanationImage: '',
    errorTip: '判断织物可否回收的关键是：是否干净、干燥、无污染。',
    relatedTrash: [{name: '床单', typeId: 1, emoji: '🛏️'}, {name: '毛巾', typeId: 1, emoji: '🧣'}, {name: '书包', typeId: 1, emoji: '🎒'}]
  },

  // --- 单选 medium ---
  { id: 11, type: 'single', chapterId: 1, difficulty: 'medium', scenes: ['kitchen', 'office', 'campus'],
    question: '下列哪种垃圾不属于可回收垃圾？',
    options: ['易拉罐', '旧衣服', '用过的纸巾', '金属厨具'],
    correctIndex: 2,
    explanation: '用过的纸巾属于其他垃圾，因为纸巾吸水性强，遇水即溶，无法回收再利用。',
    explanationImage: '',
    errorTip: '卫生纸、餐巾纸、湿巾纸无论使用与否，都属于其他垃圾。',
    relatedTrash: [{name: '卫生纸', typeId: 4, emoji: '🧻'}, {name: '易拉罐', typeId: 1, emoji: '🥫'}, {name: '旧衣服', typeId: 1, emoji: '👕'}]
  },
  { id: 12, type: 'single', chapterId: 1, difficulty: 'medium', scenes: ['office', 'campus'],
    question: '快递纸箱应该如何处理？',
    options: ['直接丢弃', '清空压扁后投放可回收物', '焚烧处理', '填埋处理'],
    correctIndex: 1,
    explanation: '快递纸箱属于可回收垃圾，投放前应清空内容物、去除胶带、拆开压扁后投放。',
    explanationImage: '',
    errorTip: '箱内的气泡膜、泡沫填充物属其他垃圾或专门的回收渠道，应与纸箱分开投放。',
    relatedTrash: [{name: '快递盒', typeId: 1, emoji: '📦'}, {name: '纸箱', typeId: 1, emoji: '📦'}]
  },
  { id: 13, type: 'single', chapterId: 1, difficulty: 'medium', scenes: ['kitchen', 'office'],
    question: '办公室里打印过的A4纸属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '打印过的A4纸仍属于可回收垃圾中的废纸张类，打印墨迹不影响回收。',
    explanationImage: '',
    errorTip: '但传真纸（热敏纸）因含化学涂层，属其他垃圾。',
    relatedTrash: [{name: '书本', typeId: 1, emoji: '📚'}, {name: '报纸', typeId: 1, emoji: '📰'}]
  },
  { id: 14, type: 'single', chapterId: 1, difficulty: 'medium', scenes: ['kitchen'],
    question: '洗干净的食用油塑料桶属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '洗干净的食用油塑料桶属于可回收垃圾中的废塑料类。但如果桶内残留大量油污无法清洗干净，则属其他垃圾。',
    explanationImage: '',
    errorTip: '判断关键：是否能清洗干净。油污严重的塑料容器因污染其他可回收物，归为其他垃圾。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}]
  },
  { id: 15, type: 'single', chapterId: 1, difficulty: 'medium', scenes: ['office', 'campus'],
    question: '破旧的不锈钢保温杯属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '不锈钢保温杯属于可回收垃圾中的废金属类。不锈钢是高品质回收金属。',
    explanationImage: '',
    errorTip: '如果是陶瓷内胆的保温杯碎裂了，则陶瓷部分属其他垃圾。',
    relatedTrash: [{name: '金属厨具', typeId: 1, emoji: '🍳'}]
  },

  // --- 判断 medium ---
  { id: 16, type: 'judge', chapterId: 1, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '破碎的镜子和普通玻璃瓶一样，都是可回收垃圾。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '镜子背面有金属反射层和涂层，与普通玻璃回收工艺不同。多数地区将碎镜子归为其他垃圾。但完整的玻璃镜片可参考当地规定。',
    explanationImage: '',
    errorTip: '破碎玻璃无论是否可回收，都应用厚纸或塑料包裹后投放，避免划伤。',
    relatedTrash: [{name: '镜子', typeId: 1, emoji: '🪞'}, {name: '玻璃瓶', typeId: 1, emoji: '🍶'}]
  },
  { id: 17, type: 'judge', chapterId: 1, difficulty: 'medium', scenes: ['kitchen', 'office'],
    question: '外卖的铝制餐盒洗干净后可以作为可回收物投放。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '铝制餐盒属于废金属类可回收物。清洗干净、去除油污后可投放至可回收物容器。但无法清洗干净的属其他垃圾。',
    explanationImage: '',
    errorTip: '常见外卖餐盒多为塑料材质，塑料的油污餐盒即使清洗也多为其他垃圾。注意区分材质！',
    relatedTrash: [{name: '金属罐头', typeId: 1, emoji: '🥫'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}]
  },

  // --- 多选 medium ---
  { id: 18, type: 'multiple', chapterId: 1, difficulty: 'medium', scenes: ['kitchen', 'office', 'campus'],
    question: '投放可回收物时，以下正确的做法是？（多选）',
    options: ['清空内容物', '清洁干燥', '压扁立体包装物', '与厨余垃圾混放'],
    correctIndexes: [0, 1, 2],
    explanation: '可回收物投放前应清空内容物、保持清洁干燥、立体包装物压扁后投放。严禁与厨余垃圾混放，以免污染。',
    explanationImage: '',
    errorTip: '被厨余垃圾严重污染的可回收物会被降级为其他垃圾处理。',
    relatedTrash: []
  },
  { id: 19, type: 'multiple', chapterId: 1, difficulty: 'medium', scenes: ['campus'],
    question: '以下属于废金属类可回收物的是？（多选）',
    options: ['铜制电线', '铝制易拉罐', '铁钉', '水银温度计'],
    correctIndexes: [0, 1, 2],
    explanation: '铜制电线、铝制易拉罐、铁钉都属于废金属类可回收物。水银温度计因含有毒水银，属有害垃圾。',
    explanationImage: '',
    errorTip: '注意：废电线回收时不必焚烧外皮，直接整体投放即可。',
    relatedTrash: [{name: '易拉罐', typeId: 1, emoji: '🥫'}, {name: '水银温度计', typeId: 2, emoji: '🌡️'}]
  },

  // --- 单选 hard ---
  { id: 20, type: 'single', chapterId: 1, difficulty: 'hard', scenes: ['kitchen', 'office', 'campus'],
    question: '下列哪种塑料可以回收再利用？',
    options: ['PET塑料瓶', '一次性塑料餐盒', '塑料袋', '保鲜膜'],
    correctIndex: 0,
    explanation: 'PET塑料瓶（如矿泉水瓶、饮料瓶）可以回收再利用。一次性塑料餐盒、塑料袋、保鲜膜等由于厚度薄、污染严重、回收成本高，难以回收，多归为其他垃圾。',
    explanationImage: '',
    errorTip: '塑料产品底部的三角数字标识可帮助判断：1号(PET)、2号(HDPE)、5号(PP)相对易回收。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}]
  },
  { id: 21, type: 'single', chapterId: 1, difficulty: 'hard', scenes: ['office'],
    question: '办公室里的旧电脑主机属于什么垃圾？',
    options: ['可回收垃圾（废电器类）', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '旧电脑主机属于废电器类可回收物，应投放到专门的电子废弃物回收点或可回收物容器。电器中含有金属、塑料可回收，但也含少量有害成分需专门处理。',
    explanationImage: '',
    errorTip: '不要自行拆解电器，交由专业机构处理更安全环保。',
    relatedTrash: [{name: '电脑', typeId: 1, emoji: '💻'}, {name: '电视机', typeId: 1, emoji: '📺'}]
  },
  { id: 22, type: 'single', chapterId: 1, difficulty: 'hard', scenes: ['kitchen'],
    question: '干净的玻璃酱油瓶属于什么垃圾，投放前应怎样处理？',
    options: ['可回收垃圾，清洗干净后投放', '有害垃圾，直接投放', '厨余垃圾，连剩余酱油一起投', '其他垃圾，打碎后投放'],
    correctIndex: 0,
    explanation: '干净的玻璃酱油瓶属于可回收垃圾，应清洗干净后投放。残留的酱油属于厨余垃圾，应先倒入厨余容器。',
    explanationImage: '',
    errorTip: '玻璃瓶切忌打碎投放，保持完整更利于回收和安全。',
    relatedTrash: [{name: '玻璃瓶', typeId: 1, emoji: '🍶'}, {name: '玻璃杯', typeId: 1, emoji: '🥛'}]
  },

  // --- 判断 hard ---
  { id: 23, type: 'judge', chapterId: 1, difficulty: 'hard', scenes: ['office', 'campus'],
    question: '热敏纸（如超市收银小票、传真纸）属于可回收垃圾。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '热敏纸表面涂有含双酚A等化学成分的热敏涂层，不属于普通废纸，回收会污染纸浆，应归为其他垃圾。',
    explanationImage: '',
    errorTip: '用指甲划纸面出现黑色痕迹的就是热敏纸，切记不是可回收物。',
    relatedTrash: [{name: '卫生纸', typeId: 4, emoji: '🧻'}, {name: '书本', typeId: 1, emoji: '📚'}]
  },
  { id: 24, type: 'judge', chapterId: 1, difficulty: 'hard', scenes: ['campus'],
    question: '学生用的塑料直尺和橡皮都是可回收垃圾。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '塑料直尺属于可回收的硬塑料；但橡皮（橡胶制品）成分复杂且体积小，多数地区归为其他垃圾。',
    explanationImage: '',
    errorTip: '橡胶制品与塑料制品是不同材质，注意区分。',
    relatedTrash: [{name: '塑料玩具', typeId: 1, emoji: '🧸'}]
  },

  // --- 多选 hard ---
  { id: 25, type: 'multiple', chapterId: 1, difficulty: 'hard', scenes: ['office', 'campus'],
    question: '以下哪些纸张不属于可回收物？（多选）',
    options: ['卫生纸和面巾纸', '热敏收银小票', '复印过的A4纸', '被油污污染的披萨盒'],
    correctIndexes: [0, 1, 3],
    explanation: '卫生纸和面巾纸遇水即溶，不可回收；热敏纸含化学涂层，归其他垃圾；油污严重的披萨盒污染纸浆，也归其他垃圾。复印过的A4纸仍可回收。',
    explanationImage: '',
    errorTip: '纸张可否回收，记住两个关键词："干燥"和"清洁"。',
    relatedTrash: [{name: '卫生纸', typeId: 4, emoji: '🧻'}, {name: '书本', typeId: 1, emoji: '📚'}]
  },
  { id: 26, type: 'multiple', chapterId: 1, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '以下属于废玻璃类可回收物的是？（多选）',
    options: ['玻璃瓶', '玻璃杯', '陶瓷碗', '窗户玻璃'],
    correctIndexes: [0, 1, 3],
    explanation: '玻璃瓶、玻璃杯、窗户玻璃都属于可回收的废玻璃。陶瓷与玻璃成分不同，不可一起回收，陶瓷属其他垃圾。',
    explanationImage: '',
    errorTip: '不同颜色的玻璃（白/棕/绿）最好分开投放，可提高回收价值。',
    relatedTrash: [{name: '玻璃瓶', typeId: 1, emoji: '🍶'}, {name: '陶瓷碎片', typeId: 4, emoji: '🏺'}]
  },

  // --- 第1章补充：36题的剩余部分 ---
  { id: 27, type: 'single', chapterId: 1, difficulty: 'easy', scenes: ['kitchen'],
    question: '家里的铁锅、铝锅等废弃金属厨具属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '金属厨具属于可回收垃圾中的废金属类，回收后可重新冶炼。',
    explanationImage: '',
    errorTip: '投放前尽量倒空并清理掉食物残渣。',
    relatedTrash: [{name: '金属厨具', typeId: 1, emoji: '🍳'}]
  },
  { id: 28, type: 'single', chapterId: 1, difficulty: 'easy', scenes: ['campus'],
    question: '学校里废弃的书包、文具袋属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '书包、文具袋属于废织物/废塑料类可回收物，建议保持干净干燥后投放。',
    explanationImage: '',
    errorTip: '可以捐赠的书包建议先捐赠，延长使用寿命比回收更环保。',
    relatedTrash: [{name: '书包', typeId: 1, emoji: '🎒'}, {name: '旧衣服', typeId: 1, emoji: '👕'}]
  },
  { id: 29, type: 'judge', chapterId: 1, difficulty: 'medium', scenes: ['kitchen'],
    question: '干净的牛奶纸盒（利乐包）属于可回收垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '牛奶纸盒（利乐包）由纸、铝、塑复合而成，属于可回收物，有专门的回收再生工艺。投放前请冲洗干净并压扁。',
    explanationImage: '',
    errorTip: '一定要冲洗干净，残留牛奶会污染回收链。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}]
  },
  { id: 30, type: 'judge', chapterId: 1, difficulty: 'easy', scenes: ['kitchen'],
    question: '干净的饮料铝罐和铁罐都属于可回收垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '铝罐和铁罐都属于废金属类可回收物，金属回收价值高，回收能耗远低于原生矿冶炼。',
    explanationImage: '',
    errorTip: '投放前请倒空并简单冲洗。',
    relatedTrash: [{name: '易拉罐', typeId: 1, emoji: '🥫'}, {name: '金属罐头', typeId: 1, emoji: '🥫'}]
  },
  { id: 31, type: 'multiple', chapterId: 1, difficulty: 'easy', scenes: ['kitchen', 'office'],
    question: '以下可回收物中，投放前建议压扁的是？（多选）',
    options: ['塑料瓶', '快递纸箱', '铝制易拉罐', '玻璃瓶'],
    correctIndexes: [0, 1, 2],
    explanation: '塑料瓶、纸箱、易拉罐都是立体包装物，压扁后可大幅节省运输空间。玻璃瓶一般不需要压扁，但应保持完整。',
    explanationImage: '',
    errorTip: '玻璃瓶请保持完整，破损反而危险且不易回收。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}, {name: '快递盒', typeId: 1, emoji: '📦'}, {name: '易拉罐', typeId: 1, emoji: '🥫'}]
  },
  { id: 32, type: 'single', chapterId: 1, difficulty: 'medium', scenes: ['office'],
    question: '办公室用完的中性笔芯属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '中性笔芯结构复杂，含塑料、金属、墨水残留物，难以分离回收，一般归为其他垃圾。建议选购可换芯的钢笔或按动笔以减少浪费。',
    explanationImage: '',
    errorTip: '不要因为笔芯是塑料的就误以为是可回收物！',
    relatedTrash: [{name: '塑料玩具', typeId: 1, emoji: '🧸'}, {name: '卫生纸', typeId: 4, emoji: '🧻'}]
  },
  { id: 33, type: 'single', chapterId: 1, difficulty: 'medium', scenes: ['campus'],
    question: '学生用的塑料文具盒属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '塑料文具盒属于废塑料类可回收物，由硬质塑料制成，回收价值较高。',
    explanationImage: '',
    errorTip: '注意是硬塑料才好回收，软塑料（如塑料膜）回收难度大。',
    relatedTrash: [{name: '塑料玩具', typeId: 1, emoji: '🧸'}, {name: '塑料瓶', typeId: 1, emoji: '🧴'}]
  },
  { id: 34, type: 'judge', chapterId: 1, difficulty: 'medium', scenes: ['campus'],
    question: '一次性塑料水杯（无明显污染）和塑料矿泉水瓶一样，都是可回收垃圾。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '一次性塑料水杯（如奶茶杯、咖啡杯）多为PP材质但壁薄且易沾染饮料残留物，多数地区归为其他垃圾。而矿泉水瓶（PET）是标准的可回收物。',
    explanationImage: '',
    errorTip: '杯身和杯盖要分开判断：杯盖（硬质PP）部分地区可回收，杯身多为其他垃圾。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}]
  },
  { id: 35, type: 'multiple', chapterId: 1, difficulty: 'hard', scenes: ['office', 'campus'],
    question: '关于办公垃圾的分类，下列说法正确的是？（多选）',
    options: [
      '打印墨盒和硒鼓属有害垃圾',
      '干净的信封和文件袋属可回收垃圾',
      '办公用的回形针、订书钉属可回收垃圾',
      '被茶水浸湿的打印纸属其他垃圾'
    ],
    correctIndexes: [0, 1, 2, 3],
    explanation: '墨盒/硒鼓含残留碳粉和化学物质，属有害垃圾；干净的信封、文件袋属可回收废纸；回形针、订书钉属废金属；被茶水浸湿的纸张受污染，属其他垃圾。',
    explanationImage: '',
    errorTip: '办公用品种类多，一定要逐个判断，不要一概而论。',
    relatedTrash: [{name: '书本', typeId: 1, emoji: '📚'}, {name: '废电池', typeId: 2, emoji: '🔋'}, {name: '卫生纸', typeId: 4, emoji: '🧻'}]
  },
  { id: 36, type: 'multiple', chapterId: 1, difficulty: 'hard', scenes: ['kitchen'],
    question: '以下哪些"塑料"不属于可回收垃圾？（多选）',
    options: ['沾有大量油污的塑料外卖盒', '薄塑料袋和保鲜膜', '洗干净的PET矿泉水瓶', '被呕吐物污染的塑料垃圾桶内衬'],
    correctIndexes: [0, 1, 3],
    explanation: '油污严重的塑料餐盒、薄塑料袋/保鲜膜、被污染的塑料内衬因污染或材质问题，归为其他垃圾。洗干净的PET瓶属于标准可回收物。',
    explanationImage: '',
    errorTip: '塑料回收两个关键："材质够硬"和"足够干净"。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}]
  },

  // ========= 第2章 有害垃圾（30题） =========
  { id: 37, type: 'single', chapterId: 2, difficulty: 'easy', scenes: ['kitchen', 'office', 'campus'],
    question: '废电池属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '废电池属于有害垃圾，因为电池中含有重金属（铅、汞、镉等）和有害化学物质，随意丢弃会污染土壤和水源。',
    explanationImage: '',
    errorTip: '注意：普通的一次性5号/7号干电池（无汞）部分地区归为其他垃圾，但充电电池、纽扣电池、汽车电瓶一定是有害垃圾。',
    relatedTrash: [{name: '充电电池', typeId: 2, emoji: '🔋'}, {name: '纽扣电池', typeId: 2, emoji: '🔋'}]
  },
  { id: 38, type: 'single', chapterId: 2, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '过期药品属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '过期药品属于有害垃圾，因为过期药品可能成分变化，随意丢弃可能被误食或污染环境。',
    explanationImage: '',
    errorTip: '药品和内外包装一起投放，不要拆散装。',
    relatedTrash: [{name: '过期药品', typeId: 2, emoji: '💊'}, {name: '药品包装', typeId: 2, emoji: '💊'}]
  },
  { id: 39, type: 'single', chapterId: 2, difficulty: 'easy', scenes: ['office', 'campus'],
    question: '废荧光灯管属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '废荧光灯管中含有汞蒸气（水银），如果破损会释放有毒物质，属有害垃圾。',
    explanationImage: '',
    errorTip: '投放时应连带原包装或用报纸包裹，避免破碎。',
    relatedTrash: [{name: '荧光灯管', typeId: 2, emoji: '💡'}, {name: '节能灯', typeId: 2, emoji: '💡'}]
  },
  { id: 40, type: 'single', chapterId: 2, difficulty: 'easy', scenes: ['kitchen'],
    question: '水银温度计打碎后应该怎么处理？',
    options: ['直接用扫帚扫走', '用手捡起丢垃圾桶', '密封收集后交专业机构或按有害垃圾处理', '冲进下水道'],
    correctIndex: 2,
    explanation: '水银（汞）是剧毒物质，挥发后会造成严重污染。应立即开窗通风，用湿润的小棉棒或胶带纸将散落水银珠收集起来，放入密封瓶中，送到社区有害垃圾投放点或联系环保部门。',
    explanationImage: '',
    errorTip: '千万不要用吸尘器吸，会加快水银挥发；也不要倒入下水道，会污染水源。',
    relatedTrash: [{name: '水银温度计', typeId: 2, emoji: '🌡️'}, {name: '水银血压计', typeId: 2, emoji: '🩺'}]
  },

  { id: 41, type: 'judge', chapterId: 2, difficulty: 'easy', scenes: ['kitchen'],
    question: '家用的杀虫剂空瓶属于有害垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '杀虫剂属于有害垃圾，即使是空瓶也可能残留有毒成分，应作为有害垃圾投放。',
    explanationImage: '',
    errorTip: '投放前应拧紧瓶盖，避免泄漏。',
    relatedTrash: [{name: '杀虫喷雾', typeId: 2, emoji: '🧪'}, {name: '消毒剂', typeId: 2, emoji: '🧪'}]
  },
  { id: 42, type: 'judge', chapterId: 2, difficulty: 'easy', scenes: ['campus'],
    question: '学生用的涂改液、修正带用完后属于其他垃圾。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '涂改液和修正带含有机溶剂和化学物质，属于有害垃圾。',
    explanationImage: '',
    errorTip: '建议尽量少用涂改液，改用橡皮擦或直接划一道横线更环保。',
    relatedTrash: [{name: '废油漆', typeId: 2, emoji: '🎨'}]
  },

  { id: 43, type: 'multiple', chapterId: 2, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '以下哪些属于有害垃圾？（多选）',
    options: ['废充电电池', '过期感冒药', '荧光灯管', '旧报纸'],
    correctIndexes: [0, 1, 2],
    explanation: '废充电电池、过期药品、荧光灯管都属于有害垃圾。旧报纸属于可回收垃圾。',
    explanationImage: '',
    errorTip: '有害垃圾一般都有专门的红色收集容器，投放时请注意区分。',
    relatedTrash: [{name: '充电电池', typeId: 2, emoji: '🔋'}, {name: '过期药品', typeId: 2, emoji: '💊'}, {name: '荧光灯管', typeId: 2, emoji: '💡'}, {name: '报纸', typeId: 1, emoji: '📰'}]
  },
  { id: 44, type: 'multiple', chapterId: 2, difficulty: 'easy', scenes: ['kitchen'],
    question: '以下属于废油漆类有害垃圾的是？（多选）',
    options: ['油漆桶', '染发剂壳', '指甲油瓶', '塑料洗发水瓶'],
    correctIndexes: [0, 1, 2],
    explanation: '油漆桶、染发剂、指甲油都含有有害化学物质，属有害垃圾。洗干净的塑料洗发水瓶属可回收物。',
    explanationImage: '',
    errorTip: '判断关键：是否含大量有害化学成分。',
    relatedTrash: [{name: '油漆桶', typeId: 2, emoji: '🎨'}, {name: '染发剂', typeId: 2, emoji: '🎨'}, {name: '指甲油', typeId: 2, emoji: '💅'}]
  },

  // --- medium ---
  { id: 45, type: 'single', chapterId: 2, difficulty: 'medium', scenes: ['kitchen', 'office', 'campus'],
    question: '下列哪种垃圾不属于有害垃圾？',
    options: ['废灯管', '废油漆', '废电池', '废纸箱'],
    correctIndex: 3,
    explanation: '废纸箱属于可回收垃圾，灯管/油漆/电池均属于有害垃圾。',
    explanationImage: '',
    errorTip: '可回收物和有害垃圾是两个不同分类，注意颜色区分：蓝色可回收，红色有害。',
    relatedTrash: [{name: '废灯管', typeId: 2, emoji: '💡'}, {name: '废纸箱', typeId: 1, emoji: '📦'}]
  },
  { id: 46, type: 'single', chapterId: 2, difficulty: 'medium', scenes: ['kitchen'],
    question: '水银温度计属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '水银温度计含有毒水银（汞），一旦破损会严重危害环境和人体健康，属有害垃圾。',
    explanationImage: '',
    errorTip: '建议家庭使用电子温度计，从源头避免水银污染风险。',
    relatedTrash: [{name: '水银温度计', typeId: 2, emoji: '🌡️'}, {name: '水银血压计', typeId: 2, emoji: '🩺'}]
  },
  { id: 47, type: 'single', chapterId: 2, difficulty: 'medium', scenes: ['office'],
    question: '办公室打印机用完的硒鼓和墨盒属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '打印机硒鼓和墨盒含有碳粉、墨水及多种化学物质，随意丢弃会污染环境，属有害垃圾。建议联系原厂回收或专门机构处理。',
    explanationImage: '',
    errorTip: '部分品牌提供硒鼓/墨盒以旧换新或回收服务，优先选择官方回收。',
    relatedTrash: [{name: '废油漆', typeId: 2, emoji: '🎨'}]
  },
  { id: 48, type: 'single', chapterId: 2, difficulty: 'medium', scenes: ['kitchen'],
    question: '家里剩余的消毒液、杀菌消毒剂空瓶属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '消毒液、消毒剂含氯或其他活性成分，属于有害垃圾中的废杀虫剂类。',
    explanationImage: '',
    errorTip: '投放前确认瓶盖拧紧，防止残余液体泄漏。',
    relatedTrash: [{name: '杀虫喷雾', typeId: 2, emoji: '🧪'}, {name: '消毒剂', typeId: 2, emoji: '🧪'}]
  },

  { id: 49, type: 'judge', chapterId: 2, difficulty: 'medium', scenes: ['campus'],
    question: '手机锂电池和普通5号干电池一样，都属于其他垃圾。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '手机锂电池（含镍镉、铅酸、纽扣电池）都属于有害垃圾。现在市面上的普通5号/7号一次性碱性干电池多为无汞环保电池，部分地区按其他垃圾处理，但充电电池一定是有害垃圾。',
    explanationImage: '',
    errorTip: '口诀记住：充电电池=有害，普通一次性干电池=多数地区其他垃圾（请按当地规定）。',
    relatedTrash: [{name: '充电电池', typeId: 2, emoji: '🔋'}, {name: '纽扣电池', typeId: 2, emoji: '🔋'}]
  },
  { id: 50, type: 'judge', chapterId: 2, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '水银血压计报废后，应连同外包装一起投放至有害垃圾收集点。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '水银血压计含汞，属有害垃圾，连同原包装投放可减少破损风险。',
    explanationImage: '',
    errorTip: '破损的水银血压计请立即密封处理，并开窗通风。',
    relatedTrash: [{name: '水银血压计', typeId: 2, emoji: '🩺'}, {name: '水银温度计', typeId: 2, emoji: '🌡️'}]
  },

  { id: 51, type: 'multiple', chapterId: 2, difficulty: 'medium', scenes: ['kitchen', 'office', 'campus'],
    question: '投放有害垃圾时，以下正确的做法是？（多选）',
    options: ['废灯管连带包装投放', '废药品连带包装一起投放', '与其他垃圾混合投放', '投放时轻放避免破损'],
    correctIndexes: [0, 1, 3],
    explanation: '有害垃圾需要单独投放，不能与其他垃圾混合。废灯管、废药品等易碎或易漏的物品应连带包装一起投放，投放时轻放避免破损。',
    explanationImage: '',
    errorTip: '有害垃圾如果破损泄漏，会严重污染其他垃圾和环境。',
    relatedTrash: []
  },
  { id: 52, type: 'multiple', chapterId: 2, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '以下哪些物品含有有害化学成分？（多选）',
    options: ['指甲油和洗甲水', '染发剂', '普通洗发水瓶', '家用消毒液'],
    correctIndexes: [0, 1, 3],
    explanation: '指甲油、染发剂、消毒液都含有害化学物质，属有害垃圾。洗干净的普通洗发水瓶（PET/PP材质）属可回收物。',
    explanationImage: '',
    errorTip: '洗护用品瓶只要洗干净，都是可回收物哦！',
    relatedTrash: [{name: '指甲油', typeId: 2, emoji: '💅'}, {name: '消毒剂', typeId: 2, emoji: '🧪'}, {name: '塑料瓶', typeId: 1, emoji: '🧴'}]
  },

  // --- hard ---
  { id: 53, type: 'single', chapterId: 2, difficulty: 'hard', scenes: ['kitchen', 'office', 'campus'],
    question: '下列关于有害垃圾的说法，错误的是？',
    options: [
      '废灯管应连带包装投放',
      '废药品应连带包装一起投放',
      '有害垃圾可以和其他垃圾混合投放',
      '投放时应轻放，避免破损'
    ],
    correctIndex: 2,
    explanation: '有害垃圾必须单独投放至专门的红色有害垃圾收集容器，禁止与其他垃圾混合，以免造成大面积污染和人员危害。',
    explanationImage: '',
    errorTip: '有害垃圾泄漏后处理成本极高，切勿混投。',
    relatedTrash: []
  },
  { id: 54, type: 'single', chapterId: 2, difficulty: 'hard', scenes: ['campus'],
    question: '学校实验室的废弃化学试剂瓶应该怎么处理？',
    options: ['作为可回收物投放', '作为有害垃圾单独收集并联系专业机构', '作为其他垃圾丢弃', '洗干净后做家庭装饰'],
    correctIndex: 1,
    explanation: '实验室化学试剂瓶即使看似空瓶，仍残留大量未知有害化学物质，必须作为危险废物单独收集，由有资质的专业机构处理，严禁混入普通生活垃圾。',
    explanationImage: '',
    errorTip: '学校和企业都必须建立危险废物管理制度，不能随意丢弃。',
    relatedTrash: [{name: '废油漆', typeId: 2, emoji: '🎨'}]
  },
  { id: 55, type: 'single', chapterId: 2, difficulty: 'hard', scenes: ['kitchen'],
    question: '废旧电动车蓄电池应如何处理？',
    options: ['卖给废品回收站', '扔到垃圾桶里', '交给有资质的回收机构或销售门店以旧换新', '埋入地下'],
    correctIndex: 2,
    explanation: '电动车蓄电池（铅酸电池）含大量重金属铅和硫酸电解液，是高危险有害废物。应交给有资质的危废处理机构，或到销售门店以旧换新（正规门店会转交专业回收）。',
    explanationImage: '',
    errorTip: '非法买卖和拆解铅酸电池是违法行为！',
    relatedTrash: [{name: '蓄电池', typeId: 2, emoji: '🔋'}]
  },

  { id: 56, type: 'judge', chapterId: 2, difficulty: 'hard', scenes: ['campus', 'office'],
    question: 'LED灯泡和荧光节能灯一样，都属于有害垃圾。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '荧光节能灯（CFL）含汞蒸气，属有害垃圾。LED灯虽不含汞，但含电子元件和少量重金属，部分地区也按有害垃圾处理，部分地区归为其他垃圾或电子废弃物。建议按当地标准执行，一般统一投放至有害垃圾更安全。',
    explanationImage: '',
    errorTip: '标准答案：节能灯=有害；LED灯=多数地方也按有害处理，具体看当地规定。',
    relatedTrash: [{name: '荧光灯管', typeId: 2, emoji: '💡'}, {name: '节能灯', typeId: 2, emoji: '💡'}, {name: 'LED灯', typeId: 2, emoji: '💡'}]
  },
  { id: 57, type: 'judge', chapterId: 2, difficulty: 'hard', scenes: ['kitchen'],
    question: '医用棉签、纱布、创可贴和过期药品一样，都属于有害垃圾。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '医用棉签、纱布、创可贴等如果是家庭日常使用，一般按其他垃圾处理。只有医疗机构产生的医疗废物才按危险废物处理。过期药品属有害垃圾。',
    explanationImage: '',
    errorTip: '注意区分家庭和医疗机构，判断标准不同。',
    relatedTrash: [{name: '过期药品', typeId: 2, emoji: '💊'}, {name: '卫生纸', typeId: 4, emoji: '🧻'}]
  },

  { id: 58, type: 'multiple', chapterId: 2, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '以下哪些电池一定属于有害垃圾？（多选）',
    options: ['手机锂电池', '电动车铅酸电池', '纽扣电池', '普通无汞碱性5号电池'],
    correctIndexes: [0, 1, 2],
    explanation: '锂电池、铅酸电池、纽扣电池都属于有害垃圾。普通无汞碱性5号/7号一次性干电池，在多数城市按其他垃圾处理，部分城市仍要求按有害垃圾，请按当地规定。',
    explanationImage: '',
    errorTip: '判断电池是否有害的简单标准：是否"可充电"或"纽扣式"。',
    relatedTrash: [{name: '充电电池', typeId: 2, emoji: '🔋'}, {name: '纽扣电池', typeId: 2, emoji: '🔋'}, {name: '蓄电池', typeId: 2, emoji: '🔋'}]
  },
  { id: 59, type: 'multiple', chapterId: 2, difficulty: 'hard', scenes: ['kitchen', 'office', 'campus'],
    question: '关于废弃药品处理，以下说法正确的是？（多选）',
    options: [
      '过期药品连同内外包装一起投放有害垃圾',
      '处方药过期后建议送回医院药房回收',
      '可将剩余药片倒入厕所冲走',
      '口服液空瓶洗干净后可做可回收物'
    ],
    correctIndexes: [0, 1],
    explanation: '过期药品连同包装投有害垃圾；处方药送回医院更安全；药品冲入下水道会污染水源；口服液瓶即使洗干净也建议连带药品按有害处理。',
    explanationImage: '',
    errorTip: '药品是特殊垃圾，宁可按有害处理也不要随意丢弃。',
    relatedTrash: [{name: '过期药品', typeId: 2, emoji: '💊'}, {name: '药品包装', typeId: 2, emoji: '💊'}]
  },

  // --- 第2章补充 ---
  { id: 60, type: 'single', chapterId: 2, difficulty: 'easy', scenes: ['kitchen', 'office'],
    question: '家里废弃的电蚊拍、电蚊香片属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '电蚊香片、电蚊拍含有杀虫剂或电子元件，属于有害垃圾。',
    explanationImage: '',
    errorTip: '电蚊拍若有锂电池，更是必须按有害垃圾处理。',
    relatedTrash: [{name: '杀虫喷雾', typeId: 2, emoji: '🧪'}]
  },
  { id: 61, type: 'single', chapterId: 2, difficulty: 'easy', scenes: ['kitchen'],
    question: '空的油漆桶属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 1,
    explanation: '油漆桶即使空了也残留大量有害油漆成分，必须作为有害垃圾投放。',
    explanationImage: '',
    errorTip: '不要因为是铁桶就误以为是可回收物！判断关键是"内容物"。',
    relatedTrash: [{name: '油漆桶', typeId: 2, emoji: '🎨'}]
  },
  { id: 62, type: 'judge', chapterId: 2, difficulty: 'medium', scenes: ['campus'],
    question: '废电池投放时应单独用袋子装好，避免与其他垃圾接触。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '废电池含有害物质，单独包装投放可减少破损泄漏，保护其他可回收物不被污染。',
    explanationImage: '',
    errorTip: '不要将电池与尖锐物品混放，以免刺破电池外壳。',
    relatedTrash: [{name: '充电电池', typeId: 2, emoji: '🔋'}, {name: '纽扣电池', typeId: 2, emoji: '🔋'}]
  },
  { id: 63, type: 'judge', chapterId: 2, difficulty: 'medium', scenes: ['office'],
    question: '废弃的U盘和SD卡含有电子元件，属于有害垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: 'U盘、SD卡等电子存储设备含少量重金属和电子元件，一般按有害垃圾或电子废弃物处理，部分地区归入可回收的废电器类。',
    explanationImage: '',
    errorTip: '如不确定，按有害垃圾处理更稳妥。',
    relatedTrash: [{name: '电脑', typeId: 1, emoji: '💻'}]
  },
  { id: 64, type: 'multiple', chapterId: 2, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '以下属于废水银类有害垃圾的是？（多选）',
    options: ['水银温度计', '水银血压计', '荧光灯管', 'LED灯'],
    correctIndexes: [0, 1, 2],
    explanation: '水银温度计、血压计直接含汞；荧光灯管含水银蒸气；LED灯不含汞，但多数地区仍按有害垃圾投放。',
    explanationImage: '',
    errorTip: '汞是常温下唯一液态金属，剧毒且易挥发。',
    relatedTrash: [{name: '水银温度计', typeId: 2, emoji: '🌡️'}, {name: '水银血压计', typeId: 2, emoji: '🩺'}, {name: '荧光灯管', typeId: 2, emoji: '💡'}]
  },
  { id: 65, type: 'multiple', chapterId: 2, difficulty: 'hard', scenes: ['office'],
    question: '办公室中以下哪些垃圾需要特殊处理？（多选）',
    options: ['废旧硒鼓墨盒', '废锂电池', '旧报纸', '废弃电路板'],
    correctIndexes: [0, 1, 3],
    explanation: '硒鼓墨盒、锂电池、电路板都含有害物质，需按有害垃圾或电子废弃物处理。旧报纸属可回收垃圾。',
    explanationImage: '',
    errorTip: '电子废弃物可联系品牌商或专业回收机构上门回收。',
    relatedTrash: [{name: '废电池', typeId: 2, emoji: '🔋'}, {name: '废油漆', typeId: 2, emoji: '🎨'}, {name: '报纸', typeId: 1, emoji: '📰'}]
  },
  { id: 66, type: 'single', chapterId: 2, difficulty: 'hard', scenes: ['kitchen', 'office'],
    question: '关于含汞废弃物处理，以下最安全的做法是？',
    options: [
      '直接扔进垃圾桶',
      '打碎后分散丢弃',
      '密封后送有害垃圾收集点或联系环保部门',
      '埋入土中'
    ],
    correctIndex: 2,
    explanation: '含汞废弃物（水银、荧光灯管等）必须密封收集，投到专门的有害垃圾收集点，破损的更应立即处理，避免吸入汞蒸气。',
    explanationImage: '',
    errorTip: '切勿自行处理破损的水银设备，应由专业人员处理。',
    relatedTrash: [{name: '水银温度计', typeId: 2, emoji: '🌡️'}]
  },

  // ========= 第3章 厨余垃圾（36题） =========
  { id: 67, type: 'single', chapterId: 3, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '剩菜剩饭属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '剩菜剩饭属于厨余垃圾，因为它们是易腐烂的生物质废弃物，可堆肥化处理。',
    explanationImage: '',
    errorTip: '投放前请沥干汤水，去除一次性餐具和包装。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '米饭', typeId: 3, emoji: '🍚'}]
  },
  { id: 68, type: 'single', chapterId: 3, difficulty: 'easy', scenes: ['kitchen'],
    question: '果皮果核属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '果皮果核属于厨余垃圾，是易腐烂的生物质废弃物，可用于堆肥。',
    explanationImage: '',
    errorTip: '但椰子壳、榴莲壳等超硬果壳属其他垃圾，会损坏处理设备。',
    relatedTrash: [{name: '苹果皮', typeId: 3, emoji: '🍎'}, {name: '香蕉皮', typeId: 3, emoji: '🍌'}, {name: '橘子皮', typeId: 3, emoji: '🍊'}]
  },
  { id: 69, type: 'single', chapterId: 3, difficulty: 'easy', scenes: ['kitchen'],
    question: '茶叶渣和咖啡渣属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '茶叶渣和咖啡渣属于厨余垃圾中的茶渣类，可用于堆肥或制作酵素。',
    explanationImage: '',
    errorTip: '家庭堆肥的好原料哦！',
    relatedTrash: [{name: '茶叶渣', typeId: 3, emoji: '🍵'}, {name: '咖啡渣', typeId: 3, emoji: '☕'}]
  },
  { id: 70, type: 'single', chapterId: 3, difficulty: 'easy', scenes: ['kitchen'],
    question: '鸡蛋壳属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '鸡蛋壳属于厨余垃圾中的蛋壳类，主要成分碳酸钙，可堆肥处理。',
    explanationImage: '',
    errorTip: '碾碎后投放更有利于处理。',
    relatedTrash: [{name: '鸡蛋壳', typeId: 3, emoji: '🥚'}, {name: '鸭蛋壳', typeId: 3, emoji: '🥚'}]
  },

  { id: 71, type: 'judge', chapterId: 3, difficulty: 'easy', scenes: ['kitchen'],
    question: '烂菜叶、发黄的蔬菜叶都属于厨余垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '蔬菜叶、白菜帮、萝卜缨等都属于厨余垃圾，易腐烂可堆肥。',
    explanationImage: '',
    errorTip: '去除泥土和明显的塑料捆扎带后投放。',
    relatedTrash: [{name: '白菜帮', typeId: 3, emoji: '🥬'}, {name: '萝卜缨', typeId: 3, emoji: '🥕'}]
  },
  { id: 72, type: 'judge', chapterId: 3, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '外卖的一次性餐盒和里面的剩菜可以一起扔进厨余垃圾桶。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '剩菜饭属于厨余垃圾，但一次性餐盒（塑料或纸质）属于其他垃圾，必须分开投放。',
    explanationImage: '',
    errorTip: '正确做法：先把剩菜倒入厨余桶，再把餐盒投入其他垃圾桶。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}, {name: '一次性筷子', typeId: 4, emoji: '🥢'}]
  },

  { id: 73, type: 'multiple', chapterId: 3, difficulty: 'easy', scenes: ['kitchen'],
    question: '以下哪些属于厨余垃圾？（多选）',
    options: ['鱼骨和鸡骨', '过期面包', '苹果核', '陶瓷碗'],
    correctIndexes: [0, 1, 2],
    explanation: '鱼骨、鸡骨属于小型骨头，可投厨余；过期面包和苹果核也属厨余。陶瓷碗属其他垃圾。',
    explanationImage: '',
    errorTip: '区分大小骨头：小型易碎的=厨余，大型坚硬的=其他。',
    relatedTrash: [{name: '鸡骨', typeId: 3, emoji: '🦴'}, {name: '鱼骨', typeId: 3, emoji: '🐟'}, {name: '陶瓷碎片', typeId: 4, emoji: '🏺'}]
  },
  { id: 74, type: 'multiple', chapterId: 3, difficulty: 'easy', scenes: ['kitchen'],
    question: '投放厨余垃圾前正确的做法是？（多选）',
    options: ['沥干水分', '去除食品包装', '连塑料袋一起投入', '大块骨头单独挑出'],
    correctIndexes: [0, 1, 3],
    explanation: '厨余投放前应沥干水分、去除包装、挑出大骨头。塑料袋需单独投入其他垃圾桶，不可连袋投放。',
    explanationImage: '',
    errorTip: '厨余处理设备最怕塑料袋！一定要破袋投放。',
    relatedTrash: [{name: '大骨头', typeId: 4, emoji: '🦴'}]
  },

  // --- medium ---
  { id: 75, type: 'single', chapterId: 3, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '下列哪种垃圾不属于厨余垃圾？',
    options: ['菜叶菜根', '蛋壳', '茶渣', '烟蒂'],
    correctIndex: 3,
    explanation: '烟蒂属于其他垃圾，不是厨余垃圾。',
    explanationImage: '',
    errorTip: '烟蒂难降解且含尼古丁，绝对不能进厨余。',
    relatedTrash: [{name: '烟蒂', typeId: 4, emoji: '🚬'}, {name: '茶叶渣', typeId: 3, emoji: '🍵'}, {name: '蛋壳', typeId: 3, emoji: '🥚'}]
  },
  { id: 76, type: 'single', chapterId: 3, difficulty: 'medium', scenes: ['kitchen'],
    question: '大骨头（牛骨、猪筒骨）属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '大骨头（如牛骨、猪大骨、羊骨等）质地坚硬，难以粉碎，会对厨余垃圾处理设备造成损坏，所以属于其他垃圾。',
    explanationImage: '',
    errorTip: '口诀记住：大骨硬=其他，小骨碎=厨余。',
    relatedTrash: [{name: '大骨头', typeId: 4, emoji: '🦴'}, {name: '鸡骨', typeId: 3, emoji: '🦴'}, {name: '鱼骨', typeId: 3, emoji: '🐟'}]
  },
  { id: 77, type: 'single', chapterId: 3, difficulty: 'medium', scenes: ['kitchen'],
    question: '过期的食用油属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '过期食用油属于厨余垃圾。可以用密封容器装好后破袋倒入厨余桶，或联系专业废油脂回收机构。',
    explanationImage: '',
    errorTip: '切勿直接倒入下水道！会堵塞管道并污染水源。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}]
  },
  { id: 78, type: 'single', chapterId: 3, difficulty: 'medium', scenes: ['campus'],
    question: '学校食堂的泔水（餐厨废弃物）应该如何处理？',
    options: ['倒入下水道', '与普通垃圾混合', '由有资质的餐厨垃圾收运单位专门处理', '直接喂猪'],
    correctIndex: 2,
    explanation: '学校食堂等餐饮单位的餐厨废弃物必须交给有资质的餐厨垃圾收运处置单位专门处理，严禁私自喂猪或排入下水道。',
    explanationImage: '',
    errorTip: '餐厨垃圾私自喂猪可能传播非洲猪瘟等疫病，是违法行为。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}]
  },
  { id: 79, type: 'single', chapterId: 3, difficulty: 'medium', scenes: ['kitchen'],
    question: '椰子壳和榴莲壳属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '椰子壳、榴莲壳质地极其坚硬且纤维粗长，容易缠绕损坏厨余处理设备，属于其他垃圾。',
    explanationImage: '',
    errorTip: '类似的还有菠萝蜜、核桃壳等超硬果壳，都是其他垃圾。',
    relatedTrash: [{name: '椰子壳', typeId: 4, emoji: '🥥'}, {name: '榴莲壳', typeId: 4, emoji: '🥥'}, {name: '大骨头', typeId: 4, emoji: '🦴'}]
  },

  { id: 80, type: 'judge', chapterId: 3, difficulty: 'medium', scenes: ['kitchen'],
    question: '过期牛奶、果汁等液态饮料可以直接倒入水槽下水道。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '过期牛奶、果汁虽属厨余垃圾，但大量液态食品不应直接倒入下水道，应倒入厨余桶（可少量沥干后）。家庭少量可冲马桶，但大量必须投厨余桶。',
    explanationImage: '',
    errorTip: '大量油脂或高蛋白液体倒入下水道极易堵塞管道。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}]
  },
  { id: 81, type: 'judge', chapterId: 3, difficulty: 'medium', scenes: ['kitchen'],
    question: '鱼鳃、鱼鳞、虾壳、蟹壳都属于厨余垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '鱼鳃、鱼鳞、虾壳、蟹壳都属于水产加工废弃物，是易腐烂的厨余垃圾。',
    explanationImage: '',
    errorTip: '但大型龙虾头、蟹壳建议尽量压碎后投放。',
    relatedTrash: [{name: '鱼骨', typeId: 3, emoji: '🐟'}]
  },

  { id: 82, type: 'multiple', chapterId: 3, difficulty: 'medium', scenes: ['kitchen'],
    question: '以下哪些属于其他垃圾而不是厨余垃圾？（多选）',
    options: ['猪大骨和牛骨', '椰子壳和榴莲壳', '玉米皮和玉米须', '鸡骨头和鱼骨'],
    correctIndexes: [0, 1],
    explanation: '猪大骨、牛骨、椰子壳、榴莲壳因坚硬难粉碎，属其他垃圾。鸡骨、鱼骨和玉米皮/须属于厨余。',
    explanationImage: '',
    errorTip: '硬度和尺寸是判断的关键因素。',
    relatedTrash: [{name: '大骨头', typeId: 4, emoji: '🦴'}, {name: '椰子壳', typeId: 4, emoji: '🥥'}, {name: '鸡骨', typeId: 3, emoji: '🦴'}]
  },
  { id: 83, type: 'multiple', chapterId: 3, difficulty: 'medium', scenes: ['campus'],
    question: '关于学校食堂垃圾分类，以下说法正确的是？（多选）',
    options: [
      '食堂剩菜剩饭属厨余垃圾',
      '一次性筷子、餐巾纸属其他垃圾',
      '调味瓶（洗干净）属可回收垃圾',
      '打碎的陶瓷碗碟属其他垃圾'
    ],
    correctIndexes: [0, 1, 2, 3],
    explanation: '以上说法全部正确。食堂剩菜饭=厨余，一次性餐具=其他，干净调味瓶=可回收，陶瓷=其他。',
    explanationImage: '',
    errorTip: '食堂是垃圾大户，分类到位可以大幅减量化。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '一次性筷子', typeId: 4, emoji: '🥢'}, {name: '玻璃瓶', typeId: 1, emoji: '🍶'}, {name: '陶瓷碎片', typeId: 4, emoji: '🏺'}]
  },

  // --- hard ---
  { id: 84, type: 'single', chapterId: 3, difficulty: 'hard', scenes: ['kitchen', 'office', 'campus'],
    question: '下列关于厨余垃圾的说法，正确的是？',
    options: [
      '厨余垃圾可以直接投放，无需沥干水分',
      '食品包装物应去除后再投放',
      '所有骨头都属于厨余垃圾',
      '厨余垃圾可以和其他垃圾混合投放'
    ],
    correctIndex: 1,
    explanation: '投放厨余垃圾前应去除食品包装物，并沥干水分。大骨头属于其他垃圾。严禁混投。',
    explanationImage: '',
    errorTip: '厨余垃圾越纯净，堆肥产物品质越高。',
    relatedTrash: [{name: '大骨头', typeId: 4, emoji: '🦴'}]
  },
  { id: 85, type: 'single', chapterId: 3, difficulty: 'hard', scenes: ['kitchen'],
    question: '家庭厨余垃圾堆肥时，以下哪种做法是错误的？',
    options: ['加入适量落叶和土壤', '添加肉类、油脂、乳制品加速发酵', '保持适当湿度', '定期翻动通风'],
    correctIndex: 1,
    explanation: '家庭堆肥不建议加入大量肉类、油脂、乳制品，容易产生异味、招引虫害和病菌。',
    explanationImage: '',
    errorTip: '家庭堆肥适合素食厨余，多肉多油的厨余建议交给专业处理。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '苹果皮', typeId: 3, emoji: '🍎'}]
  },
  { id: 86, type: 'single', chapterId: 3, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '以下哪类厨余垃圾最容易产生恶臭和招引蚊虫？',
    options: ['菜叶果皮', '剩肉剩鱼和高油食物', '蛋壳', '茶渣咖啡渣'],
    correctIndex: 1,
    explanation: '肉类、鱼类、高油高盐的厨余垃圾在高温下极易腐败发臭、招引蚊虫和老鼠。应密封后及时投放，夏季尤其注意。',
    explanationImage: '',
    errorTip: '夏季建议每天傍晚投一次厨余，避免隔夜。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '肉类', typeId: 3, emoji: '🥩'}]
  },

  { id: 87, type: 'judge', chapterId: 3, difficulty: 'hard', scenes: ['kitchen'],
    question: '霉变的花生、大米因为已变质，所以属于其他垃圾。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '霉变的粮食、坚果虽然变质了，但仍属于易腐烂的生物质，是厨余垃圾。但黄曲霉素污染严重的建议谨慎处理。',
    explanationImage: '',
    errorTip: '霉变粮食切勿食用，但分类上仍属厨余。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '菜叶菜根', typeId: 3, emoji: '🥬'}]
  },
  { id: 88, type: 'judge', chapterId: 3, difficulty: 'hard', scenes: ['kitchen', 'office'],
    question: '办公室泡完茶的茶包，连茶叶带纸袋都可以作为厨余垃圾投放。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '茶叶渣属厨余垃圾，但茶包袋若含塑料纤维或尼龙材质，则需拆开：茶叶投厨余，茶包袋投其他垃圾。纸袋材质的茶包可整体投厨余。',
    explanationImage: '',
    errorTip: '不确定材质时，拆开分别投放更安全。',
    relatedTrash: [{name: '茶叶渣', typeId: 3, emoji: '🍵'}, {name: '卫生纸', typeId: 4, emoji: '🧻'}]
  },

  { id: 89, type: 'multiple', chapterId: 3, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '以下关于"破袋投放"厨余垃圾，说法正确的是？（多选）',
    options: [
      '将厨余垃圾倒入厨余桶，塑料袋投入其他垃圾桶',
      '破袋可避免塑料混入厨余处理设备',
      '连塑料袋一起投入更方便',
      '专用可降解厨余垃圾袋在部分地区可整体投放'
    ],
    correctIndexes: [0, 1, 3],
    explanation: '破袋投放是标准做法，避免塑料混入。可降解厨余袋在支持的地区可整体投放，具体看当地规定。',
    explanationImage: '',
    errorTip: '普通塑料袋绝对不能进厨余，会严重影响后端堆肥质量。',
    relatedTrash: []
  },
  { id: 90, type: 'multiple', chapterId: 3, difficulty: 'hard', scenes: ['kitchen'],
    question: '以下属于厨余垃圾"小型骨头"的是？（多选）',
    options: ['鸡架骨', '鱼骨', '猪排骨（小排）', '牛大骨'],
    correctIndexes: [0, 1, 2],
    explanation: '鸡架、鱼骨、小排都易破碎，属于厨余。牛大骨、猪筒骨等超硬大型骨头属其他垃圾。',
    explanationImage: '',
    errorTip: '能用普通菜刀切断的骨头，一般就是厨余。',
    relatedTrash: [{name: '鸡骨', typeId: 3, emoji: '🦴'}, {name: '鱼骨', typeId: 3, emoji: '🐟'}, {name: '大骨头', typeId: 4, emoji: '🦴'}]
  },

  // --- 第3章补充 ---
  { id: 91, type: 'single', chapterId: 3, difficulty: 'easy', scenes: ['kitchen'],
    question: '削下来的土豆皮、萝卜皮属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '蔬菜削皮、烂菜叶都属于厨余垃圾，是优质的堆肥原料。',
    explanationImage: '',
    errorTip: '清洗后沥干水分再投放。',
    relatedTrash: [{name: '白菜帮', typeId: 3, emoji: '🥬'}, {name: '萝卜缨', typeId: 3, emoji: '🥕'}]
  },
  { id: 92, type: 'single', chapterId: 3, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '过期的饼干、蛋糕、面包属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '过期的糕点、饼干、面包主要成分为碳水和脂肪，易腐烂，属于厨余垃圾。',
    explanationImage: '',
    errorTip: '注意去掉外包装后投放，独立小包装需拆封。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}]
  },
  { id: 93, type: 'judge', chapterId: 3, difficulty: 'medium', scenes: ['kitchen'],
    question: '白糖、冰糖、蜂蜜、果酱过期后都属于厨余垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '糖类、蜂蜜、果酱等食品即使过期，也属于易腐烂的厨余垃圾。',
    explanationImage: '',
    errorTip: '玻璃罐或塑料罐包装需洗干净后投可回收物。',
    relatedTrash: [{name: '玻璃瓶', typeId: 1, emoji: '🍶'}, {name: '塑料瓶', typeId: 1, emoji: '🧴'}]
  },
  { id: 94, type: 'judge', chapterId: 3, difficulty: 'medium', scenes: ['campus', 'kitchen'],
    question: '吃剩的外卖炸鸡、汉堡连同包装纸盒一起投放至厨余垃圾桶。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '炸鸡、汉堡肉属于厨余，但外包装纸盒如沾有大量油污则属其他垃圾；若干净可回收。必须分开判断。',
    explanationImage: '',
    errorTip: '油污严重的纸张无法回收，是其他垃圾。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '卫生纸', typeId: 4, emoji: '🧻'}]
  },
  { id: 95, type: 'multiple', chapterId: 3, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '以下哪些是厨余垃圾处理后的产物？（多选）',
    options: ['有机肥料（营养土）', '沼气（生物天然气）', '发电', '塑料颗粒'],
    correctIndexes: [0, 1, 2],
    explanation: '厨余垃圾经堆肥可产有机肥，经厌氧发酵可产沼气用于发电或燃料。塑料颗粒是废塑料回收产物。',
    explanationImage: '',
    errorTip: '正确分类的厨余垃圾"变废为宝"转化率可达80%以上。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}]
  },
  { id: 96, type: 'single', chapterId: 3, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '甘蔗渣属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '甘蔗渣虽然纤维较粗，但属于易腐烂的生物质，厨余垃圾处理设备可处理。',
    explanationImage: '',
    errorTip: '类似的还有中药渣，也属于厨余垃圾。',
    relatedTrash: [{name: '茶叶渣', typeId: 3, emoji: '🍵'}]
  },
  { id: 97, type: 'single', chapterId: 3, difficulty: 'hard', scenes: ['kitchen'],
    question: '中药渣、熬汤后的药材渣属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '中药渣、药草渣属于植物性生物质废弃物，是典型的厨余垃圾，可以堆肥。',
    explanationImage: '',
    errorTip: '但请注意：中成药（药丸、药片）过期后请按有害垃圾处理！',
    relatedTrash: [{name: '茶叶渣', typeId: 3, emoji: '🍵'}, {name: '过期药品', typeId: 2, emoji: '💊'}]
  },
  { id: 98, type: 'judge', chapterId: 3, difficulty: 'hard', scenes: ['kitchen'],
    question: '果冻壳、珍珠奶茶中的珍珠、椰果都属于厨余垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '珍珠、椰果、果冻内容物都是食品，属厨余垃圾。但奶茶杯、果冻壳（塑料包装）需另外判断。',
    explanationImage: '',
    errorTip: '奶茶正确分类：珍珠/椰果/剩余饮料→厨余，杯子/吸管/杯盖→其他垃圾或可回收。',
    relatedTrash: [{name: '塑料餐盒', typeId: 4, emoji: '🥡'}]
  },
  { id: 99, type: 'multiple', chapterId: 3, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '以下哪些壳类属于"其他垃圾"而非厨余？（多选）',
    options: ['小龙虾壳', '生蚝扇贝壳', '核桃壳和碧根果壳', '瓜子壳和花生壳'],
    correctIndexes: [1, 2],
    explanation: '生蚝、扇贝等贝壳类质地坚硬，属其他垃圾；核桃、碧根果等坚果硬壳也属其他垃圾。小龙虾壳、瓜子壳、花生壳较脆易碎，属厨余。',
    explanationImage: '',
    errorTip: '硬壳类=其他垃圾，脆壳=厨余垃圾。',
    relatedTrash: [{name: '椰子壳', typeId: 4, emoji: '🥥'}, {name: '大骨头', typeId: 4, emoji: '🦴'}, {name: '鸡骨', typeId: 3, emoji: '🦴'}]
  },
  { id: 100, type: 'multiple', chapterId: 3, difficulty: 'medium', scenes: ['kitchen'],
    question: '以下哪些属于厨余垃圾？（多选）',
    options: ['落叶和修剪的花草', '宠物的饲料和干粮', '生肉和冷冻肉过期品', '竹制一次性筷子'],
    correctIndexes: [0, 1, 2],
    explanation: '落叶花草、宠物饲料、过期肉类都属于易腐烂生物质，是厨余垃圾。竹制一次性筷子属其他垃圾。',
    explanationImage: '',
    errorTip: '注意：猫砂、狗粪便等宠物排泄物不是厨余，是其他垃圾。',
    relatedTrash: [{name: '白菜帮', typeId: 3, emoji: '🥬'}, {name: '一次性筷子', typeId: 4, emoji: '🥢'}]
  },
  { id: 101, type: 'single', chapterId: 3, difficulty: 'easy', scenes: ['kitchen'],
    question: '发芽或发绿的土豆属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '发芽土豆虽含有毒的龙葵素，但在分类上仍属易腐烂的生物质厨余垃圾。后端处理可以破坏毒素。',
    explanationImage: '',
    errorTip: '切勿食用发芽土豆！但分类正常投厨余即可。',
    relatedTrash: [{name: '白菜帮', typeId: 3, emoji: '🥬'}]
  },
  { id: 102, type: 'judge', chapterId: 3, difficulty: 'easy', scenes: ['kitchen'],
    question: '鲜花、干花和插花的枝条都属于厨余垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '鲜花、花枝都是植物生物质，易腐烂，属于厨余垃圾。',
    explanationImage: '',
    errorTip: '但插花用的海绵、玻璃花瓶、包装纸等需另外分类。',
    relatedTrash: [{name: '白菜帮', typeId: 3, emoji: '🥬'}]
  },

  // ========= 第4章 其他垃圾（28题） =========
  { id: 103, type: 'single', chapterId: 4, difficulty: 'easy', scenes: ['kitchen', 'office', 'campus'],
    question: '用过的纸巾属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '用过的纸巾属于其他垃圾，因为纸巾吸水性强，遇水即溶，无法回收再利用。',
    explanationImage: '',
    errorTip: '无论是否使用过，卫生纸、餐巾纸、湿巾都是其他垃圾。',
    relatedTrash: [{name: '卫生纸', typeId: 4, emoji: '🧻'}, {name: '烟蒂', typeId: 4, emoji: '🚬'}]
  },
  { id: 104, type: 'single', chapterId: 4, difficulty: 'easy', scenes: ['kitchen', 'office'],
    question: '烟蒂属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '烟蒂属于其他垃圾。虽然含有害物质，但通常归入其他垃圾，按规定流程处理。',
    explanationImage: '',
    errorTip: '部分城市将烟蒂单独收集，可留意当地专门的烟蒂回收装置。',
    relatedTrash: [{name: '烟蒂', typeId: 4, emoji: '🚬'}, {name: '烟灰', typeId: 4, emoji: '🚬'}]
  },
  { id: 105, type: 'single', chapterId: 4, difficulty: 'easy', scenes: ['kitchen'],
    question: '碎碗碟和陶瓷碎片属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '陶瓷属于不可回收无机材料，碎片无法再利用，属其他垃圾。',
    explanationImage: '',
    errorTip: '碎片用厚纸或布包裹后投放，避免划伤清运人员。',
    relatedTrash: [{name: '陶瓷碎片', typeId: 4, emoji: '🏺'}, {name: '碎碗碟', typeId: 4, emoji: '🍽️'}]
  },
  { id: 106, type: 'single', chapterId: 4, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '一次性木筷子、竹筷子属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '一次性筷子虽为竹/木制，但表面可能有涂层、且使用后受污染，回收成本高，归为其他垃圾。',
    explanationImage: '',
    errorTip: '建议自带餐具，从源头减少一次性筷子使用。',
    relatedTrash: [{name: '一次性筷子', typeId: 4, emoji: '🥢'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}]
  },

  { id: 107, type: 'judge', chapterId: 4, difficulty: 'easy', scenes: ['kitchen', 'office'],
    question: '普通的保鲜膜、保鲜袋和塑料垃圾袋都属于其他垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '保鲜膜、保鲜袋、垃圾袋多为薄软塑料，沾染油污后难以回收，统一归为其他垃圾。',
    explanationImage: '',
    errorTip: '厚度较大、洗干净的硬质塑料盒才可能是可回收物。',
    relatedTrash: [{name: '塑料餐盒', typeId: 4, emoji: '🥡'}, {name: '塑料袋', typeId: 4, emoji: '🛍️'}]
  },
  { id: 108, type: 'judge', chapterId: 4, difficulty: 'easy', scenes: ['kitchen'],
    question: '家庭扫地产生的灰尘、毛发属于其他垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '清扫的尘土、毛发、渣土等无机物和有机物混合垃圾，属于其他垃圾。',
    explanationImage: '',
    errorTip: '不要倒入厕所冲掉，容易堵塞管道。',
    relatedTrash: [{name: '尘土', typeId: 4, emoji: '🧹'}, {name: '渣土', typeId: 4, emoji: '🧹'}]
  },

  { id: 109, type: 'multiple', chapterId: 4, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '以下哪些属于其他垃圾？（多选）',
    options: ['烟蒂', '纸尿裤和卫生巾', '旧报纸', '陶瓷碎片'],
    correctIndexes: [0, 1, 3],
    explanation: '烟蒂、纸尿裤、卫生巾、陶瓷碎片都属其他垃圾。旧报纸属于可回收物。',
    explanationImage: '',
    errorTip: '卫生用品无论是否使用过，一律是其他垃圾。',
    relatedTrash: [{name: '烟蒂', typeId: 4, emoji: '🚬'}, {name: '陶瓷碎片', typeId: 4, emoji: '🏺'}, {name: '旧报纸', typeId: 1, emoji: '📰'}]
  },
  { id: 110, type: 'multiple', chapterId: 4, difficulty: 'easy', scenes: ['kitchen', 'office'],
    question: '以下"一次性用品"中属于其他垃圾的是？（多选）',
    options: ['一次性手套', '一次性口罩', '一次性塑料餐盒（受污染）', '洗干净的不锈钢叉子'],
    correctIndexes: [0, 1, 2],
    explanation: '一次性手套、口罩、受污染的塑料餐盒都属于其他垃圾。洗干净的不锈钢餐具属可回收物。',
    explanationImage: '',
    errorTip: '防护口罩使用后请密封后再投放其他垃圾。',
    relatedTrash: [{name: '塑料餐盒', typeId: 4, emoji: '🥡'}, {name: '金属厨具', typeId: 1, emoji: '🍳'}]
  },

  // --- medium ---
  { id: 111, type: 'single', chapterId: 4, difficulty: 'medium', scenes: ['kitchen', 'office', 'campus'],
    question: '下列哪种垃圾不属于其他垃圾？',
    options: ['卫生纸', '陶瓷碎片', '一次性餐具', '玻璃瓶'],
    correctIndex: 3,
    explanation: '玻璃瓶属于可回收垃圾，不属于其他垃圾。',
    explanationImage: '',
    errorTip: '玻璃是100%可回收的材料，千万别丢错了！',
    relatedTrash: [{name: '玻璃瓶', typeId: 1, emoji: '🍶'}, {name: '卫生纸', typeId: 4, emoji: '🧻'}]
  },
  { id: 112, type: 'single', chapterId: 4, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '宠物粪便（猫砂、狗便）属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '宠物粪便不属于厨余垃圾（含有害微生物风险），应投入其他垃圾。更环保的方式是用纸包好投入马桶冲掉，猫砂等则投其他垃圾。',
    explanationImage: '',
    errorTip: '千万不要把宠物粪便投入厨余桶！',
    relatedTrash: [{name: '猫砂', typeId: 4, emoji: '🐱'}, {name: '狗粪便', typeId: 4, emoji: '💩'}]
  },
  { id: 113, type: 'single', chapterId: 4, difficulty: 'medium', scenes: ['campus'],
    question: '学生用的铅笔（木杆带橡皮）属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '铅笔由木杆、石墨芯、橡皮、金属箍等多种材料组成，难以分离回收，整体归为其他垃圾。但注意：单独的大橡皮和木制部分量少时一般也按其他垃圾处理。',
    explanationImage: '',
    errorTip: '铅笔芯是石墨，不是铅，不用担心铅中毒。',
    relatedTrash: [{name: '塑料玩具', typeId: 1, emoji: '🧸'}]
  },
  { id: 114, type: 'single', chapterId: 4, difficulty: 'medium', scenes: ['kitchen', 'office', 'campus'],
    question: '难以辨识类别的生活垃圾应该投入什么垃圾容器？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '难以辨识类别的生活垃圾应投入其他垃圾容器。不确定时宁可投其他垃圾，也不要乱投污染其他品类。',
    explanationImage: '',
    errorTip: '垃圾分类口诀：能卖钱的投蓝（可回收），会腐烂的投绿（厨余），有毒有害投红（有害），其余都投灰/黑（其他）。',
    relatedTrash: []
  },

  { id: 115, type: 'judge', chapterId: 4, difficulty: 'medium', scenes: ['kitchen'],
    question: '破旧的毛巾和抹布属于其他垃圾，不是可回收物。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '使用过的毛巾、抹布沾染大量油污和清洁剂，难以清洗干净，归为其他垃圾。干净的旧毛巾则属于可回收的废织物。',
    explanationImage: '',
    errorTip: '干净=可回收，脏污=其他垃圾。',
    relatedTrash: [{name: '旧衣服', typeId: 1, emoji: '👕'}, {name: '毛巾', typeId: 1, emoji: '🧣'}]
  },
  { id: 116, type: 'judge', chapterId: 4, difficulty: 'medium', scenes: ['campus'],
    question: '校园里学生扔掉的口香糖属于其他垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '口香糖主要成分是胶基，虽有可塑性但不可回收降解，属于其他垃圾。',
    explanationImage: '',
    errorTip: '用纸包好再投放，避免粘桶壁。',
    relatedTrash: [{name: '烟蒂', typeId: 4, emoji: '🚬'}]
  },

  { id: 117, type: 'multiple', chapterId: 4, difficulty: 'medium', scenes: ['kitchen', 'office'],
    question: '以下哪些属于"受污染后无法回收"的其他垃圾？（多选）',
    options: ['沾有油漆的刷子', '沾满油污的纸质外卖盒', '沾了咖啡的纸巾', '洗干净的塑料瓶'],
    correctIndexes: [0, 1, 2],
    explanation: '油漆刷、油污外卖盒、沾咖啡的纸巾都因严重污染无法回收，属其他垃圾。洗干净的塑料瓶属可回收物。',
    explanationImage: '',
    errorTip: '核心判断原则：被油/有害物严重污染的，一律归其他垃圾。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}]
  },
  { id: 118, type: 'multiple', chapterId: 4, difficulty: 'medium', scenes: ['kitchen'],
    question: '以下哪些属于其他垃圾而不是厨余垃圾？（多选）',
    options: ['粽子叶和玉米皮', '大骨头', '小龙虾壳', '榴莲壳椰子壳'],
    correctIndexes: [0, 1, 3],
    explanation: '粽子叶、玉米皮纤维粗长易缠绕设备，大骨头坚硬难碎，榴莲/椰子壳同理，都归其他垃圾。小龙虾壳脆易碎属厨余。',
    explanationImage: '',
    errorTip: '记住："硬的、长纤维的"=其他垃圾；"软的、易腐烂的"=厨余垃圾。',
    relatedTrash: [{name: '大骨头', typeId: 4, emoji: '🦴'}, {name: '椰子壳', typeId: 4, emoji: '🥥'}, {name: '鸡骨', typeId: 3, emoji: '🦴'}]
  },

  // --- hard ---
  { id: 119, type: 'single', chapterId: 4, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '旧的棉被、枕头、毛绒玩具属于什么垃圾？',
    options: ['可回收垃圾（干净的）', '有害垃圾', '厨余垃圾', '其他垃圾（脏污严重的）'],
    correctIndex: 0,
    explanation: '干净的棉被、枕头、毛绒玩具属于可回收的废织物类；严重脏污、潮湿发霉的则归其他垃圾。建议旧被褥先尝试捐赠。',
    explanationImage: '',
    errorTip: '捐赠 > 回收 > 其他垃圾，优先级从高到低。',
    relatedTrash: [{name: '旧衣服', typeId: 1, emoji: '👕'}, {name: '床单', typeId: 1, emoji: '🛏️'}]
  },
  { id: 120, type: 'single', chapterId: 4, difficulty: 'hard', scenes: ['kitchen', 'office'],
    question: '快递用的气泡膜、泡沫填充物属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '气泡膜、泡沫塑料（EPS）虽属塑料，但薄且易沾附灰尘，多数回收渠道不收，通常归为其他垃圾。部分城市有专门的泡沫塑料回收点，可单独投放。',
    explanationImage: '',
    errorTip: '有条件的地方，干净的泡沫可以攒起来找专门回收商。',
    relatedTrash: [{name: '塑料餐盒', typeId: 4, emoji: '🥡'}, {name: '快递盒', typeId: 1, emoji: '📦'}]
  },
  { id: 121, type: 'single', chapterId: 4, difficulty: 'hard', scenes: ['office', 'campus'],
    question: '办公用的便利贴、报事贴（背面有胶）属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '便利贴背面有不干胶涂层，会影响纸浆回收质量，一般归为其他垃圾。普通无背胶的便签纸属可回收废纸。',
    explanationImage: '',
    errorTip: '带胶的纸张是否可回收各地标准不同，不确定时投其他垃圾。',
    relatedTrash: [{name: '书本', typeId: 1, emoji: '📚'}, {name: '卫生纸', typeId: 4, emoji: '🧻'}]
  },

  { id: 122, type: 'judge', chapterId: 4, difficulty: 'hard', scenes: ['kitchen'],
    question: '破旧的铁锅手柄（木质或胶木）和铁锅本身都属于可回收物。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '铁锅属于可回收废金属，但锅柄（木质或胶木）因材质混杂或量少，一般归其他垃圾。整体无法拆分的，可整体投可回收物，由后端分拣处理。',
    explanationImage: '',
    errorTip: '能拆分的尽量拆分，不能拆分的按主体材质判断。',
    relatedTrash: [{name: '金属厨具', typeId: 1, emoji: '🍳'}]
  },
  { id: 123, type: 'judge', chapterId: 4, difficulty: 'hard', scenes: ['campus', 'office'],
    question: '荧光笔、马克笔、白板笔用完后都属于其他垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '荧光笔、马克笔等结构复杂，含塑料、墨水、纤维等多种材料，难以分离回收，属其他垃圾。',
    explanationImage: '',
    errorTip: '建议选购可加墨、可换芯的环保笔。',
    relatedTrash: [{name: '塑料玩具', typeId: 1, emoji: '🧸'}, {name: '废油漆', typeId: 2, emoji: '🎨'}]
  },

  { id: 124, type: 'multiple', chapterId: 4, difficulty: 'hard', scenes: ['kitchen', 'office', 'campus'],
    question: '关于其他垃圾的正确说法是？（多选）',
    options: [
      '其他垃圾是除三大类之外的兜底类别',
      '实在分不清的垃圾可暂归其他垃圾',
      '其他垃圾一般进行填埋或焚烧发电',
      '其他垃圾可以和厨余混放'
    ],
    correctIndexes: [0, 1, 2],
    explanation: '其他垃圾是兜底类别，无法归类的可先放这里，通常焚烧发电或卫生填埋。严禁与厨余、有害、可回收混放！',
    explanationImage: '',
    errorTip: '混放会严重降低资源回收率，增加处理成本。',
    relatedTrash: []
  },
  { id: 125, type: 'multiple', chapterId: 4, difficulty: 'hard', scenes: ['office'],
    question: '办公室的"其他垃圾"典型代表是？（多选）',
    options: ['用过的打印纸（被咖啡浸湿）', '回形针和订书钉', '便利贴和胶带纸', '干净的A4废纸'],
    correctIndexes: [0, 2],
    explanation: '被咖啡浸湿的纸、便利贴、胶带纸都属其他垃圾。回形针订书钉属废金属可回收；干净A4纸属可回收废纸。',
    explanationImage: '',
    errorTip: '小的金属件即便量少，也属可回收物，积少成多。',
    relatedTrash: [{name: '书本', typeId: 1, emoji: '📚'}, {name: '卫生纸', typeId: 4, emoji: '🧻'}]
  },

  // --- 第4章补充 ---
  { id: 126, type: 'single', chapterId: 4, difficulty: 'easy', scenes: ['kitchen'],
    question: '废旧的竹木筷子、竹菜板属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '竹木餐具和砧板使用后有油污水渍且表面可能有涂层，一般归为其他垃圾。',
    explanationImage: '',
    errorTip: '未使用的全新竹木材料可能可回收，但使用过的一律其他垃圾。',
    relatedTrash: [{name: '一次性筷子', typeId: 4, emoji: '🥢'}]
  },
  { id: 127, type: 'single', chapterId: 4, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '破旧的橡胶鞋底、篮球、瑜伽垫属于什么垃圾？',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndex: 3,
    explanation: '橡胶制品成分复杂、难以回收，且使用后有磨损污渍，一般归为其他垃圾。部分地区有专门的橡胶回收渠道。',
    explanationImage: '',
    errorTip: '塑料制品和橡胶制品是不同材料，不要混淆！',
    relatedTrash: [{name: '塑料玩具', typeId: 1, emoji: '🧸'}]
  },
  { id: 128, type: 'judge', chapterId: 4, difficulty: 'medium', scenes: ['campus'],
    question: '学生用的橡皮擦（橡皮）属于其他垃圾，而非可回收物。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '橡皮擦由橡胶、PVC、塑化剂等制成，成分复杂且体积小，无专门回收渠道，归其他垃圾。',
    explanationImage: '',
    errorTip: '体积太小的物品通常难以进入回收流程。',
    relatedTrash: [{name: '塑料玩具', typeId: 1, emoji: '🧸'}]
  },
  { id: 129, type: 'judge', chapterId: 4, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '打火机、火柴使用完毕后都属于其他垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '打火机内残留少量可燃气体和塑料件，火柴主要是木柴加红磷涂层。一般都归入其他垃圾。注意：未使用的打火机避免高温后投放。',
    explanationImage: '',
    errorTip: '打火机不要扔入火中或高温环境，防止爆炸！',
    relatedTrash: [{name: '烟蒂', typeId: 4, emoji: '🚬'}]
  },
  { id: 130, type: 'multiple', chapterId: 4, difficulty: 'medium', scenes: ['kitchen'],
    question: '以下物品中属于其他垃圾的是？（多选）',
    options: ['破旧的砂锅', '废弃的马桶圈', '破损的砧板', '完整的不锈钢碗'],
    correctIndexes: [0, 1, 2],
    explanation: '砂锅（陶瓷）、马桶圈（复合材料）、破损砧板（竹木/塑料）都属其他垃圾。不锈钢碗属可回收废金属。',
    explanationImage: '',
    errorTip: '大件家居垃圾建议预约大件垃圾上门收运。',
    relatedTrash: [{name: '陶瓷碎片', typeId: 4, emoji: '🏺'}, {name: '金属厨具', typeId: 1, emoji: '🍳'}]
  },

  // ========= 第5章 综合知识（40题） =========
  { id: 131, type: 'single', chapterId: 5, difficulty: 'easy', scenes: ['kitchen', 'office', 'campus'],
    question: '垃圾分类的主要目的是什么？',
    options: ['减少垃圾量', '便于回收利用', '美化环境', '以上都是'],
    correctIndex: 3,
    explanation: '垃圾分类的目的是减少垃圾量、便于回收利用资源、美化环境、减少环境污染，是以上所有目的的综合。',
    explanationImage: '',
    errorTip: '垃圾分类是利国利民的大事，需要每个人参与！',
    relatedTrash: []
  },
  { id: 132, type: 'single', chapterId: 5, difficulty: 'easy', scenes: ['campus'],
    question: '我国城市生活垃圾一般分为几类？',
    options: ['两类', '三类', '四类', '五类'],
    correctIndex: 2,
    explanation: '我国城市生活垃圾一般分为四类：可回收垃圾、有害垃圾、厨余垃圾（湿垃圾）、其他垃圾（干垃圾）。',
    explanationImage: '',
    errorTip: '部分城市会有更细的分类，但主流是四分法。',
    relatedTrash: []
  },
  { id: 133, type: 'single', chapterId: 5, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '下列哪种颜色通常代表可回收物收集容器？',
    options: ['红色', '绿色', '蓝色', '灰色/黑色'],
    correctIndex: 2,
    explanation: '垃圾分类标准颜色：蓝色=可回收，红色=有害，绿色=厨余（湿），灰色/黑色=其他（干）。',
    explanationImage: '',
    errorTip: '颜色口诀：蓝可收、红有害、绿厨余、灰其他。',
    relatedTrash: []
  },

  { id: 134, type: 'judge', chapterId: 5, difficulty: 'easy', scenes: ['kitchen', 'office', 'campus'],
    question: '垃圾分类主要是环卫工人的责任，普通居民随便分不分无所谓。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '垃圾分类是每个人的责任，需要全社会共同参与。居民源头分类到位，才能大幅提高回收利用率，减少末端处理压力。',
    explanationImage: '',
    errorTip: '记住：垃圾分类，从我做起！',
    relatedTrash: []
  },
  { id: 135, type: 'judge', chapterId: 5, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '可回收物应该保持干净干燥，否则会被降级处理。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '可回收物必须清洁干燥，被污染的可回收物会被当作其他垃圾处理，无法进入回收再利用流程。',
    explanationImage: '',
    errorTip: '清洗干净的可回收物才能真正"变废为宝"。',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}]
  },

  { id: 136, type: 'multiple', chapterId: 5, difficulty: 'easy', scenes: ['campus'],
    question: '垃圾分类的"四分法"通常包括哪几类？（多选）',
    options: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
    correctIndexes: [0, 1, 2, 3],
    explanation: '主流四分法：可回收（蓝）、有害（红）、厨余/湿（绿）、其他/干（灰）四大类。',
    explanationImage: '',
    errorTip: '上海等城市使用"可回收、有害、湿、干"四分类，本质一致。',
    relatedTrash: []
  },
  { id: 137, type: 'multiple', chapterId: 5, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '垃圾分类的好处包括？（多选）',
    options: ['减少占地', '减少污染', '变废为宝', '增加就业'],
    correctIndexes: [0, 1, 2, 3],
    explanation: '垃圾分类好处多多：减少占地、减少环境污染、回收资源变废为宝，同时带动相关产业创造就业。',
    explanationImage: '',
    errorTip: '正确分类是所有好处的前提。',
    relatedTrash: []
  },

  // --- medium ---
  { id: 138, type: 'single', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '下列哪种垃圾可以进行堆肥处理？',
    options: ['厨余垃圾', '可回收垃圾', '有害垃圾', '其他垃圾'],
    correctIndex: 0,
    explanation: '厨余垃圾含有丰富有机质，通过高温好氧堆肥或厌氧发酵可以转化为有机肥料，改良土壤。',
    explanationImage: '',
    errorTip: '家庭厨余堆肥是不错的业余爱好哦！',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}]
  },
  { id: 139, type: 'single', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'office', 'campus'],
    question: '下列哪种垃圾需要特殊安全处理？',
    options: ['厨余垃圾', '可回收垃圾', '有害垃圾', '其他垃圾'],
    correctIndex: 2,
    explanation: '有害垃圾含有毒有害物质，需要专门的危废处理资质机构进行特殊安全处置，防止污染扩散。',
    explanationImage: '',
    errorTip: '有害垃圾如果处理不当，危害远大于其他三类。',
    relatedTrash: [{name: '废电池', typeId: 2, emoji: '🔋'}]
  },
  { id: 140, type: 'single', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'office'],
    question: '其他垃圾的主要末端处理方式是什么？',
    options: ['回收再利用', '堆肥', '卫生填埋或焚烧发电', '直接倒入江河'],
    correctIndex: 2,
    explanation: '其他垃圾因无法回收和堆肥，主要采用卫生填埋或焚烧发电的方式处理。焚烧发电可实现减量化和能源回收。',
    explanationImage: '',
    errorTip: '分类做得越好，进入焚烧/填埋的垃圾就越少。',
    relatedTrash: []
  },
  { id: 141, type: 'single', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'office', 'campus'],
    question: '关于生活垃圾的正确投放顺序是？',
    options: [
      '随意扔入最近的垃圾桶',
      '先分类→再破袋（厨余）→对应颜色容器投放',
      '所有垃圾混装一袋',
      '有害垃圾混入其他垃圾'
    ],
    correctIndex: 1,
    explanation: '正确流程：先在家中分类→厨余垃圾破袋倒入绿色桶，袋子投入其他垃圾桶→各类分别投入对应颜色容器。',
    explanationImage: '',
    errorTip: '家里准备几个分类小桶，可以让分分类更方便。',
    relatedTrash: []
  },

  { id: 142, type: 'judge', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '将厨余垃圾进行脱水沥干，可以大幅减少后续处理成本。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '厨余垃圾含水率高达80%以上，沥干水分可以大幅降低运输成本和焚烧/堆肥能耗，提高处理效率。',
    explanationImage: '',
    errorTip: '简单的一个动作，可以产生巨大的环保效益！',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}]
  },
  { id: 143, type: 'judge', chapterId: 5, difficulty: 'medium', scenes: ['campus', 'office'],
    question: '在办公室，一张干净的打印纸打错了，应该直接扔进其他垃圾桶。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '干净的打印纸无论是否打印过墨迹，都属于可回收废纸。应投放至可回收物容器或办公室的废纸回收盒。',
    explanationImage: '',
    errorTip: '办公室废纸是优质回收资源，一吨废纸可造850公斤好纸！',
    relatedTrash: [{name: '书本', typeId: 1, emoji: '📚'}]
  },

  { id: 144, type: 'multiple', chapterId: 5, difficulty: 'medium', scenes: ['campus'],
    question: '关于校园垃圾分类，以下做法正确的是？（多选）',
    options: [
      '教室设置废纸/塑料回收盒',
      '食堂剩菜饭投入厨余桶',
      '实验室废液单独收集处理',
      '所有垃圾扔到一个大桶'
    ],
    correctIndexes: [0, 1, 2],
    explanation: '教室、食堂、实验室分别采用不同分类策略，实验室废液尤其需要单独处理。严禁混装。',
    explanationImage: '',
    errorTip: '学校是培养环保意识的重要场所，垃圾分类应从娃娃抓起。',
    relatedTrash: [{name: '书本', typeId: 1, emoji: '📚'}, {name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '废油漆', typeId: 2, emoji: '🎨'}]
  },
  { id: 145, type: 'multiple', chapterId: 5, difficulty: 'medium', scenes: ['office'],
    question: '以下哪些措施属于"办公室垃圾减量"？（多选）',
    options: [
      '双面打印电子文档',
      '自带水杯减少一次性纸杯',
      '使用可换芯的中性笔',
      '订外卖时选"无需餐具"'
    ],
    correctIndexes: [0, 1, 2, 3],
    explanation: '以上都是源头减量的好方法。垃圾减量 > 分类回收，是垃圾治理的最高优先级。',
    explanationImage: '',
    errorTip: '最好的垃圾，是不产生垃圾！',
    relatedTrash: []
  },

  // --- hard ---
  { id: 146, type: 'single', chapterId: 5, difficulty: 'hard', scenes: ['kitchen', 'office', 'campus'],
    question: '下列关于垃圾分类的说法，错误的是？',
    options: [
      '垃圾分类可以减少环境污染',
      '垃圾分类可以节约资源',
      '垃圾分类是政府的事，与个人无关',
      '垃圾分类可以变废为宝'
    ],
    correctIndex: 2,
    explanation: '垃圾分类是每个人的责任，需要全社会共同参与。只有居民源头分类到位，整个分类体系才能真正运转。',
    explanationImage: '',
    errorTip: '个人一小步，环保一大步！',
    relatedTrash: []
  },
  { id: 147, type: 'single', chapterId: 5, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '垃圾治理的"3R原则"是指？',
    options: [
      'Reduce减量化、Reuse再利用、Recycle再循环',
      'Reduce减少、Return归还、Repeat重复',
      'Read阅读、Remember记住、Respond响应',
      'Receive接收、Record记录、Report报告'
    ],
    correctIndex: 0,
    explanation: '垃圾治理国际通用3R原则：Reduce（源头减量）> Reuse（重复使用）> Recycle（回收循环）。优先级从高到低。',
    explanationImage: '',
    errorTip: '记住排序：少产生 > 反复用 > 回收。',
    relatedTrash: []
  },
  { id: 148, type: 'single', chapterId: 5, difficulty: 'hard', scenes: ['kitchen', 'office'],
    question: '关于"湿垃圾"和"干垃圾"（上海叫法），以下对应关系正确的是？',
    options: [
      '湿垃圾=厨余垃圾，干垃圾=其他垃圾',
      '湿垃圾=有害垃圾，干垃圾=可回收垃圾',
      '湿垃圾=其他垃圾，干垃圾=可回收垃圾',
      '湿垃圾=厨余垃圾，干垃圾=有害垃圾'
    ],
    correctIndex: 0,
    explanation: '上海分类标准：湿垃圾=易腐烂生物质=国家标准的厨余垃圾；干垃圾=除可回收、有害、湿垃圾以外的=其他垃圾。',
    explanationImage: '',
    errorTip: '湿/干是上海叫法，厨余/其他是国标叫法，本质相同。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '卫生纸', typeId: 4, emoji: '🧻'}]
  },

  { id: 149, type: 'judge', chapterId: 5, difficulty: 'hard', scenes: ['office', 'campus'],
    question: '一吨废塑料可以回炼约600公斤柴油，所以塑料回收意义重大。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '废塑料化学回收可提炼燃料油或化工原料，物理回收可再制成塑料制品。一吨PET瓶可再生约0.95吨瓶片。资源价值巨大！',
    explanationImage: '',
    errorTip: '前提是：塑料瓶必须洗干净！',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}]
  },
  { id: 150, type: 'judge', chapterId: 5, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '将厨余垃圾和其他垃圾混合焚烧，可以更高效发电，所以混装更好。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '厨余垃圾水分高、热值低，混入其他垃圾会降低焚烧效率、增加二噁英排放风险。分开处理才能最大化各自价值。',
    explanationImage: '',
    errorTip: '分类越精准，各类垃圾的处理效率越高。',
    relatedTrash: []
  },

  { id: 151, type: 'multiple', chapterId: 5, difficulty: 'hard', scenes: ['kitchen', 'office', 'campus'],
    question: '以下属于"源头减量"（Reduce）行为的是？（多选）',
    options: [
      '自带购物袋，拒绝塑料袋',
      '选购无包装或简包装商品',
      '按需订餐，光盘行动',
      '使用可重复的容器打包'
    ],
    correctIndexes: [0, 1, 2, 3],
    explanation: '以上都是减少垃圾产生的好做法。源头减量是垃圾治理最高优先级，比分类回收更有效。',
    explanationImage: '',
    errorTip: '3R原则第一是"减量化"！',
    relatedTrash: [{name: '塑料袋', typeId: 4, emoji: '🛍️'}]
  },
  { id: 152, type: 'multiple', chapterId: 5, difficulty: 'hard', scenes: ['kitchen', 'campus'],
    question: '关于可回收物回收，说法正确的是？（多选）',
    options: [
      '1吨废纸可造纸约850公斤',
      '1吨废钢铁可炼好钢约900公斤',
      '回收铝罐比从铝土矿提炼节省约95%能源',
      '废玻璃回收无法节能'
    ],
    correctIndexes: [0, 1, 2],
    explanation: '废纸、废钢、废铝回收都能大幅节省资源能源。废玻璃回收也能节省约30%能耗，所以D错误。',
    explanationImage: '',
    errorTip: '你丢弃的，正是别人需要的资源！',
    relatedTrash: [{name: '书本', typeId: 1, emoji: '📚'}, {name: '易拉罐', typeId: 1, emoji: '🥫'}, {name: '玻璃瓶', typeId: 1, emoji: '🍶'}]
  },

  // --- 第5章补充 ---
  { id: 153, type: 'single', chapterId: 5, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '世界环境日是哪一天？',
    options: ['3月12日', '4月22日', '6月5日', '10月4日'],
    correctIndex: 2,
    explanation: '6月5日是联合国设立的世界环境日。3月12日是中国植树节，4月22日是世界地球日，10月4日是世界动物日。',
    explanationImage: '',
    errorTip: '环保不止这一天，应该是每一天！',
    relatedTrash: []
  },
  { id: 154, type: 'single', chapterId: 5, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '以下哪个生活习惯最环保？',
    options: [
      '使用一次性餐具方便快捷',
      '出门随手关灯关水，自带购物袋水杯',
      '经常网购大包装产品',
      '随手丢弃空饮料瓶'
    ],
    correctIndex: 1,
    explanation: '节约水电、自备袋子和水杯都是环保生活的体现，属于3R原则中的源头减量和重复使用。',
    explanationImage: '',
    errorTip: '环保习惯，贵在坚持！',
    relatedTrash: []
  },
  { id: 155, type: 'judge', chapterId: 5, difficulty: 'medium', scenes: ['campus'],
    question: '购买大包装食品比小包装更有利于减少垃圾。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '相同重量/体积下，大包装产生的包装材料远少于小包装，是有效的垃圾减量方式。',
    explanationImage: '',
    errorTip: '量入为出，大包装也别买太多吃不完浪费哦！',
    relatedTrash: [{name: '塑料瓶', typeId: 1, emoji: '🧴'}]
  },
  { id: 156, type: 'judge', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'office'],
    question: '旧家电、旧家具可以联系商家或社区以旧换新、预约上门回收，比直接扔路边更环保。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '旧家电家具通过正规渠道回收，可拆解回收其中的金属、塑料等资源，同时避免大件垃圾随意丢弃造成市容和安全问题。',
    explanationImage: '',
    errorTip: '现在很多城市都有大件垃圾免费上门收运服务。',
    relatedTrash: [{name: '电脑', typeId: 1, emoji: '💻'}, {name: '电视机', typeId: 1, emoji: '📺'}]
  },
  { id: 157, type: 'multiple', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '在家里做好垃圾分类，正确的做法是？（多选）',
    options: [
      '厨房准备两个桶：厨余+其他',
      '客厅/书房设可回收物纸箱',
      '卫生间设其他垃圾桶',
      '有害电池药品统一攒起来单独投放'
    ],
    correctIndexes: [0, 1, 2, 3],
    explanation: '以上都是家庭分类的标准做法。因地制宜设置分类桶，有害垃圾集中投放。',
    explanationImage: '',
    errorTip: '分类习惯，21天就能养成！',
    relatedTrash: []
  },
  { id: 158, type: 'multiple', chapterId: 5, difficulty: 'hard', scenes: ['office', 'campus'],
    question: '一个正确的垃圾分类宣传口号可以是？（多选）',
    options: [
      '垃圾分类，从我做起',
      '今天分一分，明天美十分',
      '垃圾要分类，生活变美好',
      '混放是垃圾，分类成资源'
    ],
    correctIndexes: [0, 1, 2, 3],
    explanation: '这些都是朗朗上口、含义正确的分类宣传标语。',
    explanationImage: '',
    errorTip: '标语口号只是提醒，行动才是关键！',
    relatedTrash: []
  },
  { id: 159, type: 'single', chapterId: 5, difficulty: 'medium', scenes: ['kitchen'],
    question: '家庭中处理过期食品的正确流程是？',
    options: [
      '连包装一起扔进其他垃圾桶',
      '食品倒入厨余桶，包装按材质分类',
      '扔进有害垃圾桶',
      '直接倒进厕所冲走'
    ],
    correctIndex: 1,
    explanation: '过期食品（不论干湿）都属厨余垃圾，倒入厨余桶；外包装根据材质判断：干净的塑料/纸盒=可回收，严重污染=其他，药品特殊包装=有害。',
    explanationImage: '',
    errorTip: '过期药品是有害垃圾，和过期食品不一样！',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '过期药品', typeId: 2, emoji: '💊'}]
  },
  { id: 160, type: 'single', chapterId: 5, difficulty: 'hard', scenes: ['office'],
    question: '某办公室一天产生的垃圾中，最值得设置单独回收渠道的是？',
    options: ['废纸和废塑料瓶', '果皮果核', '烟头烟灰', '咖啡渣和茶叶渣'],
    correctIndex: 0,
    explanation: '办公室废纸和塑料瓶回收量大、品质好、价值高，最值得单独回收。其余垃圾量少价值低。',
    explanationImage: '',
    errorTip: '办公室废纸回收率每提高10%，相当于少砍一大片森林！',
    relatedTrash: [{name: '书本', typeId: 1, emoji: '📚'}, {name: '塑料瓶', typeId: 1, emoji: '🧴'}]
  },
  { id: 161, type: 'judge', chapterId: 5, difficulty: 'hard', scenes: ['kitchen'],
    question: '厨余垃圾堆肥产生的有机肥料，可以直接用于家庭种植蔬菜。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '经过充分高温腐熟的厨余堆肥是优质有机肥料，可用于家庭园艺、蔬菜种植。但要确保完全腐熟，避免烧根和虫害。',
    explanationImage: '',
    errorTip: '家庭小型堆肥桶是阳台种菜者的好伙伴。',
    relatedTrash: [{name: '苹果皮', typeId: 3, emoji: '🍎'}, {name: '茶叶渣', typeId: 3, emoji: '🍵'}]
  },
  { id: 162, type: 'judge', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'campus'],
    question: '外卖盒中的食物残渣和餐盒应该分开投放。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '食物残渣→厨余；餐盒：干净的硬塑料/铝盒=可回收，污染严重=其他。必须分开处理。',
    explanationImage: '',
    errorTip: '多花5秒钟，资源大不同！',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}, {name: '金属罐头', typeId: 1, emoji: '🥫'}]
  },
  { id: 163, type: 'multiple', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'office', 'campus'],
    question: '以下哪些说法是正确的？（多选）',
    options: [
      '可回收物=可以卖钱的废品',
      '有害垃圾=会对人和环境造成危害的垃圾',
      '厨余垃圾=会烂掉的食物类垃圾',
      '其他垃圾=分不清楚时的兜底选择'
    ],
    correctIndexes: [0, 1, 2, 3],
    explanation: '这四个说法虽然通俗，但基本概括了四大类的核心判断依据。',
    explanationImage: '',
    errorTip: '判断顺序：先有害→再可回收→再厨余→剩下的都是其他。',
    relatedTrash: []
  },
  { id: 164, type: 'multiple', chapterId: 5, difficulty: 'hard', scenes: ['campus'],
    question: '关于"白色污染"，说法正确的是？（多选）',
    options: [
      '指塑料包装物污染',
      '塑料难降解，需数百年才能自然分解',
      '少用一次性塑料可有效减少白色污染',
      '可降解塑料=可以随意丢弃'
    ],
    correctIndexes: [0, 1, 2],
    explanation: '白色污染指塑料废弃物造成的污染。塑料自然降解需200-500年。可降解塑料也需要特定工业堆肥条件才能分解，不能随意丢弃。',
    explanationImage: '',
    errorTip: '可降解≠完全不用管，还是要分类投放。',
    relatedTrash: [{name: '塑料袋', typeId: 4, emoji: '🛍️'}, {name: '塑料餐盒', typeId: 4, emoji: '🥡'}]
  },
  { id: 165, type: 'single', chapterId: 5, difficulty: 'easy', scenes: ['kitchen', 'campus'],
    question: '厨余垃圾桶的典型颜色是？',
    options: ['蓝色', '红色', '绿色', '灰色'],
    correctIndex: 2,
    explanation: '国家标准：蓝色可回收、红色有害、绿色厨余、灰色其他。',
    explanationImage: '',
    errorTip: '颜色记不住？看标识文字和图案也行。',
    relatedTrash: []
  },
  { id: 166, type: 'single', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'office', 'campus'],
    question: '下列关于"厨余垃圾"的正确说法是？',
    options: [
      '厨余垃圾就是指剩饭剩菜',
      '所有植物类垃圾都是厨余垃圾',
      '易腐烂的生物质生活废弃物属于厨余垃圾',
      '动物尸体属于厨余垃圾'
    ],
    correctIndex: 2,
    explanation: '厨余垃圾的正式定义是"易腐烂的生物质生活废弃物"，不限于剩菜饭，也不是所有植物，更不包括动物尸体。',
    explanationImage: '',
    errorTip: '核心关键词：易腐烂 + 生物质。',
    relatedTrash: [{name: '剩菜剩饭', typeId: 3, emoji: '🍚'}]
  },
  { id: 167, type: 'judge', chapterId: 5, difficulty: 'medium', scenes: ['kitchen', 'office'],
    question: '社区或单位的分类垃圾桶摆放，通常按红蓝绿灰四色从左到右顺序排列。',
    options: ['正确', '错误'],
    correctIndex: 0,
    explanation: '多数地区按照"可回收（蓝）→有害（红）→厨余（绿）→其他（灰）"的顺序排列桶组，也有其他排列方式。投放前请以桶上标识为准。',
    explanationImage: '',
    errorTip: '看标识比记顺序更重要！',
    relatedTrash: []
  },
  { id: 168, type: 'judge', chapterId: 5, difficulty: 'hard', scenes: ['office'],
    question: '废光盘（CD、DVD）含有微量金属，属于有害垃圾。',
    options: ['正确', '错误'],
    correctIndex: 1,
    explanation: '废光盘主要是聚碳酸酯塑料加铝反射层，虽含微量金属但量极微。多数地区归为其他垃圾，部分地区归可回收物。但一般不认定为有害垃圾。',
    explanationImage: '',
    errorTip: '建议光盘尽量重复使用或交由专门回收渠道。',
    relatedTrash: [{name: '电脑', typeId: 1, emoji: '💻'}]
  },
  { id: 169, type: 'multiple', chapterId: 5, difficulty: 'hard', scenes: ['kitchen', 'office', 'campus'],
    question: '以下哪些属于"源头避免产生垃圾"的正确做法？（多选）',
    options: [
      '自备餐盒到食堂打饭',
      '线上无纸化办公和电子发票',
      '快递纸箱重复利用',
      '按需买菜做饭、光盘行动'
    ],
    correctIndexes: [0, 1, 2, 3],
    explanation: '自备餐盒减少一次性餐具；无纸化办公减少废纸；纸箱重复利用；按需做饭减少食物浪费——都是源头减量的好方法！',
    explanationImage: '',
    errorTip: '减量 > 再用 > 回收，3R原则要牢记。',
    relatedTrash: []
  },
  { id: 170, type: 'multiple', chapterId: 5, difficulty: 'medium', scenes: ['campus', 'office'],
    question: '举办垃圾分类宣传活动，适合展示的内容有？（多选）',
    options: [
      '四大分类指南和常见错误案例',
      '垃圾分类前后的实物对比',
      '可回收物回收再利用流程展示',
      '积分兑换和奖励机制介绍'
    ],
    correctIndexes: [0, 1, 2, 3],
    explanation: '以上都是有效的垃圾分类宣传手段，可以从认知、视觉、利益等多维度引导用户。',
    explanationImage: '',
    errorTip: '寓教于乐的宣传活动效果最好。',
    relatedTrash: []
  }
]

// ========= 题目相关工具函数 =========
const getQuestionsByChapter = (chapterId) => {
  return QUIZ_QUESTIONS.filter(q => q.chapterId === chapterId)
}

const getQuestionsByDifficulty = (difficulty) => {
  return QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty)
}

const getQuestionsByScene = (scene) => {
  return QUIZ_QUESTIONS.filter(q => q.scenes && q.scenes.includes(scene))
}

const getQuestionsByType = (type) => {
  return QUIZ_QUESTIONS.filter(q => q.type === type)
}

const getRandomQuestions = (count, difficulty = null) => {
  let questions = difficulty ? getQuestionsByDifficulty(difficulty) : [...QUIZ_QUESTIONS]
  const shuffled = questions.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

const getQuestionById = (id) => {
  return QUIZ_QUESTIONS.find(q => q.id === id) || null
}

const getDailyQuestions = () => {
  const today = new Date().toDateString()
  const seed = today.split('').reduce((acc, val) => acc + val.charCodeAt(0), 0)

  const questions = [...QUIZ_QUESTIONS]
  const shuffled = questions.sort((a, b) => {
    const hashA = (a.id * seed) % questions.length
    const hashB = (b.id * seed) % questions.length
    return hashA - hashB
  })

  return shuffled.slice(0, 5)
}

// 判断题目是否正确（支持单选/判断/多选）
const isQuestionCorrect = (question, userAnswer) => {
  if (!question || typeof userAnswer === 'undefined' || userAnswer === null) return false

  const { type } = question

  if (type === 'multiple') {
    if (!Array.isArray(userAnswer)) return false
    const corrects = question.correctIndexes || []
    if (userAnswer.length !== corrects.length) return false
    const sortedA = [...userAnswer].sort((a, b) => a - b)
    const sortedB = [...corrects].sort((a, b) => a - b)
    return sortedA.every((v, i) => v === sortedB[i])
  } else {
    return Number(userAnswer) === Number(question.correctIndex)
  }
}

// ========= 垃圾分类练习题库 =========
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

const getSortItemsByType = (typeId) => {
  return SORT_PRACTICE_ITEMS.filter(item => item.typeId === typeId)
}

const getRandomSortItems = (count, typeId = null) => {
  let items = typeId ? getSortItemsByType(typeId) : [...SORT_PRACTICE_ITEMS]
  const shuffled = items.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

const TRASH_ENCYCLOPEDIA_BASE = SORT_PRACTICE_ITEMS

function getTrashDescription(name) {
  const descriptions = {
    '报纸': '报纸属于可回收垃圾中的废纸张类，是指已经阅读过、废弃的报纸刊物。',
    '书本': '书本属于可回收垃圾中的废纸张类，包括各种书籍、杂志、教材等印刷品。',
    '纸箱': '纸箱属于可回收垃圾中的废纸张类，常用于包装运输的纸质容器。',
    '快递盒': '快递盒属于可回收垃圾中的废纸张类，是快递行业常用的包装材料。',
    '塑料瓶': '塑料瓶属于可回收垃圾中的废塑料类，主要由PET等塑料材质制成。',
    '塑料盆': '塑料盆属于可回收垃圾中的废塑料类，包括各种塑料容器和塑料制品。',
    '塑料玩具': '塑料玩具属于可回收垃圾中的废塑料类，由塑料制成的儿童玩具。',
    '玻璃瓶': '玻璃瓶属于可回收垃圾中的废玻璃类，包括各种玻璃容器。',
    '玻璃杯': '玻璃杯属于可回收垃圾中的废玻璃类，包括各种玻璃餐具和容器。',
    '镜子': '镜子属于可回收垃圾中的废玻璃类，背面镀有金属反射层的玻璃制品。',
    '易拉罐': '易拉罐属于可回收垃圾中的废金属类，主要由铝或铁制成。',
    '金属罐头': '金属罐头属于可回收垃圾中的废金属类，用于食品包装的金属容器。',
    '金属厨具': '金属厨具属于可回收垃圾中的废金属类，包括各种金属炊具和餐具。',
    '旧衣服': '旧衣服属于可回收垃圾中的废织物类，包括各种穿旧的衣物。',
    '床单': '床单属于可回收垃圾中的废织物类，包括各种床上纺织用品。',
    '毛巾': '毛巾属于可回收垃圾中的废织物类，包括各种清洁用纺织用品。',
    '书包': '书包属于可回收垃圾中的废织物类，包括各种背包和手提包。',
    '电视机': '电视机属于可回收垃圾中的废电器类，是常见的家用电器。',
    '洗衣机': '洗衣机属于可回收垃圾中的废电器类，用于清洗衣物的家用电器。',
    '电脑': '电脑属于可回收垃圾中的废电器类，包括台式机和笔记本电脑。',
    '充电电池': '充电电池属于有害垃圾中的废电池类，含有重金属等有害物质。',
    '纽扣电池': '纽扣电池属于有害垃圾中的废电池类，体积小但含有毒物质。',
    '蓄电池': '蓄电池属于有害垃圾中的废电池类，常用于汽车和储能设备。',
    '荧光灯管': '荧光灯管属于有害垃圾中的废灯管类，含有汞等有毒物质。',
    '节能灯': '节能灯属于有害垃圾中的废灯管类，比普通灯管更节能但含汞。',
    'LED灯': 'LED灯属于有害垃圾中的废灯管类，含少量电子元件和有害物质。',
    '过期药品': '过期药品属于有害垃圾中的废药品类，可能对环境造成污染。',
    '药品包装': '药品包装属于有害垃圾中的废药品类，可能残留药品成分。',
    '油漆桶': '油漆桶属于有害垃圾中的废油漆类，残留的油漆含有毒物质。',
    '染发剂': '染发剂属于有害垃圾中的废油漆类，含有多种化学成分。',
    '指甲油': '指甲油属于有害垃圾中的废油漆类，含有机溶剂和色素。',
    '杀虫喷雾': '杀虫喷雾属于有害垃圾中的废杀虫剂类，含有毒杀虫成分。',
    '消毒剂': '消毒剂属于有害垃圾中的废杀虫剂类，含有的化学成分可能有害。',
    '水银温度计': '水银温度计属于有害垃圾中的废水银类，破损后会释放汞蒸气。',
    '水银血压计': '水银血压计属于有害垃圾中的废水银类，医疗常用的血压测量设备。',
    '剩菜剩饭': '剩菜剩饭属于厨余垃圾中的食物残渣类，容易腐烂变质。',
    '米饭': '米饭属于厨余垃圾中的食物残渣类，主要成分为碳水化合物。',
    '面条': '面条属于厨余垃圾中的食物残渣类，由面粉制成的主食。',
    '蔬菜': '蔬菜属于厨余垃圾中的食物残渣类，包括各种新鲜或烹饪过的蔬菜。',
    '肉类': '肉类属于厨余垃圾中的食物残渣类，包括各种畜禽鱼肉。',
    '苹果皮': '苹果皮属于厨余垃圾中的果皮果核类，水果削皮产生的废弃物。',
    '香蕉皮': '香蕉皮属于厨余垃圾中的果皮果核类，香蕉的外皮。',
    '橘子皮': '橘子皮属于厨余垃圾中的果皮果核类，柑橘类水果的外皮。',
    '鸡蛋壳': '鸡蛋壳属于厨余垃圾中的蛋壳类，主要成分为碳酸钙。',
    '鸭蛋壳': '鸭蛋壳属于厨余垃圾中的蛋壳类，鸭蛋的外壳。',
    '茶叶渣': '茶叶渣属于厨余垃圾中的茶渣类，泡茶后剩余的茶叶。',
    '咖啡渣': '咖啡渣属于厨余垃圾中的茶渣类，冲泡咖啡后剩余的咖啡粉。',
    '白菜帮': '白菜帮属于厨余垃圾中的菜叶菜根类，白菜的外层老叶。',
    '萝卜缨': '萝卜缨属于厨余垃圾中的菜叶菜根类，萝卜的叶子部分。',
    '鸡骨': '鸡骨属于厨余垃圾中的骨头类，体积小、易粉碎。',
    '鱼骨': '鱼骨属于厨余垃圾中的骨头类，鱼类的骨头。',
    '小排骨': '小排骨属于厨余垃圾中的骨头类，猪牛羊的小骨头。',
    '用过的纸巾': '用过的纸巾属于其他垃圾中的卫生纸类，吸水性强无法回收。',
    '卫生纸': '卫生纸属于其他垃圾中的卫生纸类，遇水即溶无法回收。',
    '烟蒂': '烟蒂属于其他垃圾中的烟蒂类，烟头过滤嘴难降解。',
    '烟灰': '烟灰属于其他垃圾中的烟蒂类，烟草燃烧后的灰烬。',
    '陶瓷碎片': '陶瓷碎片属于其他垃圾中的陶瓷类，破损的陶瓷制品。',
    '碎花盆': '碎花盆属于其他垃圾中的陶瓷类，破损的陶瓷或塑料花盆。',
    '碎碗碟': '碎碗碟属于其他垃圾中的陶瓷类，破损的餐具。',
    '一次性筷子': '一次性筷子属于其他垃圾中的一次性餐具类，受污染无法回收。',
    '塑料餐盒': '塑料餐盒属于其他垃圾中的一次性餐具类，受油污污染难以回收。',
    '尘土': '尘土属于其他垃圾中的尘土类，清扫产生的灰尘和渣土。',
    '渣土': '渣土属于其他垃圾中的尘土类，建筑或装修产生的渣土。',
    '猫砂': '猫砂属于其他垃圾中的宠物粪便类，宠物使用的垫料。',
    '狗粪便': '狗粪便属于其他垃圾中的宠物粪便类，宠物的排泄物。',
    '大骨头': '大骨头属于其他垃圾中的其他类，难以粉碎会损坏处理设备。',
    '椰子壳': '椰子壳属于其他垃圾中的其他类，质地坚硬难以降解处理。',
    '榴莲壳': '榴莲壳属于其他垃圾中的其他类，质地坚硬难以降解处理。'
  }
  return descriptions[name] || `${name}是日常生活中常见的垃圾物品。`
}

function getDisposalTips(name, typeId) {
  const type = TRASH_TYPES.find(t => t.id === typeId)
  if (!type) return []

  const tips = [...type.tips]

  const specificTips = {
    '塑料瓶': ['投放前请清空并清洗瓶内残留物', '压扁后投放可节省空间'],
    '纸箱': ['请去除胶带和打包带', '拆开压平后投放'],
    '玻璃瓶': ['请清洗干净后投放', '破损的玻璃请包裹后投放'],
    '充电电池': ['请单独投放至有害垃圾收集点', '不要拆解电池'],
    '水银温度计': ['如破损请密封后投放', '避免直接接触水银'],
    '剩菜剩饭': ['请沥干水分后投放', '去除一次性餐具和包装'],
    '大骨头': ['请勿投入厨余垃圾桶', '可联系环卫部门专门处理']
  }

  if (specificTips[name]) {
    return specificTips[name]
  }

  return tips
}

function getRelatedItems(name, typeId) {
  const allItems = TRASH_ENCYCLOPEDIA_BASE.filter(item =>
    item.typeId === typeId && item.name !== name
  )
  return allItems.slice(0, 4)
}

const TRASH_ENCYCLOPEDIA = TRASH_ENCYCLOPEDIA_BASE.map(item => {
  const type = TRASH_TYPES.find(t => t.id === item.typeId)
  return {
    ...item,
    typeName: type ? type.name : '',
    typeColor: type ? type.color : '',
    typeBgColor: type ? type.bgColor : '',
    description: getTrashDescription(item.name),
    disposalTips: getDisposalTips(item.name, item.typeId),
    relatedItems: getRelatedItems(item.name, item.typeId)
  }
})

const HOT_SEARCH_WORDS = [
  { name: '塑料瓶', emoji: '🧴', hot: true },
  { name: '废电池', emoji: '🔋', hot: true },
  { name: '剩菜剩饭', emoji: '🍚', hot: true },
  { name: '用过的纸巾', emoji: '🧻', hot: false },
  { name: '快递盒', emoji: '📦', hot: false },
  { name: '过期药品', emoji: '💊', hot: true },
  { name: '玻璃瓶', emoji: '🍶', hot: false },
  { name: '烟蒂', emoji: '🚬', hot: false }
]

const SEARCH_HISTORY_KEY = 'search_history'
const MAX_SEARCH_HISTORY = 10

const fuzzySearchTrash = (keyword) => {
  if (!keyword || keyword.trim() === '') return []

  const lowerKeyword = keyword.trim().toLowerCase()

  return TRASH_ENCYCLOPEDIA.filter(item => {
    const nameMatch = item.name.toLowerCase().includes(lowerKeyword)
    const descMatch = item.description.toLowerCase().includes(lowerKeyword)
    const typeMatch = item.typeName.toLowerCase().includes(lowerKeyword)
    return nameMatch || descMatch || typeMatch
  })
}

const ACHIEVEMENTS = [
  {
    id: 'classify_master',
    name: '分类达人',
    emoji: '🏅',
    description: '累计完成50次垃圾分类',
    type: 'classify',
    condition: { type: 'classifyCount', value: 50 },
    color: '#5BBD72',
    bgColor: 'rgba(91, 189, 114, 0.15)'
  },
  {
    id: 'quiz_king',
    name: '答题王者',
    emoji: '👑',
    description: '累计正确答题100道',
    type: 'quiz',
    condition: { type: 'correctQuizCount', value: 100 },
    color: '#9B59B6',
    bgColor: 'rgba(155, 89, 182, 0.15)'
  },
  {
    id: 'signin_30',
    name: '连续签到30天',
    emoji: '🔥',
    description: '连续签到打卡30天',
    type: 'signin',
    condition: { type: 'continuousSignIn', value: 30 },
    color: '#E74C3C',
    bgColor: 'rgba(231, 76, 60, 0.15)'
  },
  {
    id: 'classify_100',
    name: '分类专家',
    emoji: '🌟',
    description: '累计完成100次垃圾分类',
    type: 'classify',
    condition: { type: 'classifyCount', value: 100 },
    color: '#F39C12',
    bgColor: 'rgba(243, 156, 18, 0.15)'
  },
  {
    id: 'points_5000',
    name: '积分大户',
    emoji: '💰',
    description: '累计获得5000积分',
    type: 'points',
    condition: { type: 'totalPoints', value: 5000 },
    color: '#3498DB',
    bgColor: 'rgba(52, 152, 219, 0.15)'
  },
  {
    id: 'invite_10',
    name: '社交达人',
    emoji: '👥',
    description: '邀请10位好友加入',
    type: 'invite',
    condition: { type: 'inviteCount', value: 10 },
    color: '#1ABC9C',
    bgColor: 'rgba(26, 188, 156, 0.15)'
  }
]

const ECO_TIPS = [
  { id: 1, title: '减少一次性塑料使用', content: '自带购物袋、水杯和餐具，减少一次性塑料制品的使用。每少用一个塑料袋，就为地球减少一份负担。', icon: '🛍️', tag: '减塑' },
  { id: 2, title: '厨余垃圾变废为宝', content: '厨余垃圾经过堆肥处理可以变成有机肥料，用于家庭种植花草蔬菜，实现资源循环利用。', icon: '🌱', tag: '堆肥' },
  { id: 3, title: '正确分类废电池', content: '废电池属于有害垃圾，切勿随意丢弃。一粒纽扣电池可以污染60万升水，请投放至有害垃圾收集点。', icon: '🔋', tag: '有害' },
  { id: 4, title: '快递包装回收再利用', content: '拆完快递的纸箱和塑料包装，请分类投放。纸箱属于可回收物，塑料气泡膜属于其他垃圾。', icon: '📦', tag: '回收' },
  { id: 5, title: '旧衣物捐赠比回收更环保', content: '完好的旧衣物建议优先捐赠，比回收再加工更节能环保。脏污严重的旧衣物才属于其他垃圾。', icon: '👕', tag: '捐赠' },
  { id: 6, title: '厨余垃圾投放前沥干水分', content: '投放厨余垃圾前请沥干水分，去除包装物。含水量过高的厨余垃圾会增加运输和处理成本。', icon: '💧', tag: '厨余' },
  { id: 7, title: '过期药品切勿随意丢弃', content: '过期药品可能产生有毒有害物质，务必投放至有害垃圾容器。连同包装一起投放更安全。', icon: '💊', tag: '有害' }
]

const HOT_WASTE_NEWS = [
  { id: 1, title: '上海垃圾分类实施5周年，居民分类准确率达95%', source: '环保日报', time: '2小时前', tag: '政策', tagColor: '#4A90D9' },
  { id: 2, title: '北京新增3000个智能垃圾分类投放点', source: '首都环保', time: '5小时前', tag: '设施', tagColor: '#5BBD72' },
  { id: 3, title: '深圳推出垃圾分类积分兑换地铁票活动', source: '南方都市报', time: '8小时前', tag: '活动', tagColor: '#F39C12' },
  { id: 4, title: '可回收物价格持续上涨，废纸回收价创新高', source: '循环经济报', time: '1天前', tag: '市场', tagColor: '#9B59B6' },
  { id: 5, title: '全国多地推进厨余垃圾就地处理设施建设', source: '住建部', time: '1天前', tag: '建设', tagColor: '#E85D5D' },
  { id: 6, title: '快递包装绿色治理新规出台，减量包装成趋势', source: '新华网', time: '2天前', tag: '政策', tagColor: '#4A90D9' }
]

const CITY_STANDARDS = [
  {
    id: 'shanghai',
    name: '上海',
    emoji: '🏙️',
    color: '#4A90D9',
    standards: {
      recyclable: '废纸张、废塑料、废玻璃制品、废金属、废织物等',
      harmful: '废电池、废灯管、废药品、废油漆及其容器等',
      kitchen: '剩菜剩饭、瓜皮果核、花卉绿植、过期食品等（上海称"湿垃圾"）',
      other: '除以上三类之外的其他生活废弃物（上海称"干垃圾"）'
    },
    specialRules: [
      '上海使用"湿垃圾"和"干垃圾"的独特称呼',
      '大骨头归干垃圾，小骨头归湿垃圾',
      '蛤蜊壳、蟹壳归干垃圾',
      '外卖餐盒清洗后归可回收物，未清洗归干垃圾',
      '奶茶杯清洗后杯身归干垃圾，杯盖归可回收物'
    ]
  },
  {
    id: 'beijing',
    name: '北京',
    emoji: '🏯',
    color: '#E85D5D',
    standards: {
      recyclable: '废纸张、废塑料、废玻璃制品、废金属、废织物等',
      harmful: '废电池、废灯管、废药品、废油漆及其容器等',
      kitchen: '菜帮菜叶、剩菜剩饭、瓜果皮核、茶叶渣等',
      other: '除以上三类之外的其他生活废弃物'
    },
    specialRules: [
      '北京使用标准的四分类名称',
      '核桃壳归其他垃圾',
      '大棒骨归其他垃圾',
      '玉米核归其他垃圾',
      '卫生纸、纸巾归其他垃圾'
    ]
  },
  {
    id: 'shenzhen',
    name: '深圳',
    emoji: '🌆',
    color: '#5BBD72',
    standards: {
      recyclable: '废纸张、废塑料、废玻璃制品、废金属、废织物等',
      harmful: '废电池、废灯管、废药品、废油漆及其容器等',
      kitchen: '剩菜剩饭、骨头内脏、菜根菜叶、果皮等',
      other: '除以上三类之外的其他生活废弃物'
    },
    specialRules: [
      '深圳推行"集中分类投放+定时定点督导"模式',
      '椰子壳归其他垃圾',
      '榴莲壳归其他垃圾',
      '使用智慧垃圾分类管理系统',
      '违规投放个人最高罚200元'
    ]
  }
]

const DROP_POINT_TYPES = {
  GARBAGE_STATION: {
    id: 'garbage_station',
    name: '垃圾分类站',
    emoji: '🏠',
    color: '#5BBD72',
    bgColor: 'rgba(91, 189, 114, 0.1)',
    description: '综合垃圾分类投放点，通常设有四分类垃圾桶'
  },
  RECYCLABLE: {
    id: 'recyclable',
    name: '可回收物回收点',
    emoji: '♻️',
    color: '#4A90D9',
    bgColor: 'rgba(74, 144, 217, 0.1)',
    description: '专门回收可回收物的站点，部分提供上门回收服务'
  },
  HARMFUL: {
    id: 'harmful',
    name: '有害垃圾收集点',
    emoji: '☣️',
    color: '#E85D5D',
    bgColor: 'rgba(232, 93, 93, 0.1)',
    description: '专门收集有害垃圾的站点，需单独投放'
  }
}

const SUPPORTED_CATEGORIES = [
  { id: 'kitchen', name: '厨余垃圾', emoji: '🍂', color: '#5BBD72' },
  { id: 'recyclable', name: '可回收物', emoji: '♻️', color: '#4A90D9' },
  { id: 'harmful', name: '有害垃圾', emoji: '☣️', color: '#E85D5D' },
  { id: 'other', name: '其他垃圾', emoji: '🗑️', color: '#8E8E93' },
  { id: 'bulky', name: '大件垃圾', emoji: '🛋️', color: '#9B59B6' },
  { id: 'electronic', name: '电子废弃物', emoji: '💻', color: '#F39C12' }
]

const DROP_POINTS = [
  {
    id: 'dp001',
    type: 'garbage_station',
    name: '东长安街垃圾分类站',
    address: '北京市东城区东长安街1号',
    latitude: 39.9087,
    longitude: 116.4074,
    distance: 120,
    businessHours: {
      weekdays: '06:00-22:00',
      weekends: '07:00-21:00'
    },
    isOpenNow: true,
    supportedCategories: ['kitchen', 'recyclable', 'harmful', 'other'],
    facilities: ['智能分类柜', '洗手池', '照明设备', '语音提示'],
    rating: 4.8,
    checkinCount: 256,
    description: '示范级垃圾分类站，配备智能分类设备，专人值守指导分类',
    contactPhone: '010-12345678',
    createTime: '2024-01-15'
  },
  {
    id: 'dp002',
    type: 'recyclable',
    name: '王府井可回收物回收中心',
    address: '北京市东城区王府井大街88号',
    latitude: 39.9139,
    longitude: 116.4103,
    distance: 580,
    businessHours: {
      weekdays: '09:00-18:00',
      weekends: '09:00-17:00'
    },
    isOpenNow: true,
    supportedCategories: ['recyclable', 'electronic', 'bulky'],
    facilities: ['称重设备', '积分兑换', '上门回收', '打包服务'],
    rating: 4.6,
    checkinCount: 189,
    description: '专业可回收物处理中心，提供上门回收服务，累计积分可兑换礼品',
    contactPhone: '010-87654321',
    createTime: '2024-02-20'
  },
  {
    id: 'dp003',
    type: 'harmful',
    name: '北京站有害垃圾定点收集站',
    address: '北京市东城区北京站东街1号',
    latitude: 39.9042,
    longitude: 116.4271,
    distance: 1200,
    businessHours: {
      weekdays: '08:30-17:30',
      weekends: '09:00-16:00'
    },
    isOpenNow: false,
    supportedCategories: ['harmful'],
    facilities: ['防泄漏容器', '专业存储', '安全防护', '溯源系统'],
    rating: 4.9,
    checkinCount: 78,
    description: '官方指定有害垃圾收集站，配备专业存储设备，确保有害垃圾安全处理',
    contactPhone: '010-11112222',
    createTime: '2023-11-10'
  },
  {
    id: 'dp004',
    type: 'garbage_station',
    name: '前门大街智能分类站',
    address: '北京市东城区前门大街12号',
    latitude: 39.8983,
    longitude: 116.3974,
    distance: 1500,
    businessHours: {
      weekdays: '24小时',
      weekends: '24小时'
    },
    isOpenNow: true,
    supportedCategories: ['kitchen', 'recyclable', 'harmful', 'other'],
    facilities: ['24小时投放', '智能识别', '自动称重', '积分系统'],
    rating: 4.7,
    checkinCount: 423,
    description: '24小时智能垃圾分类站，AI智能识别垃圾类型，投放即可获得积分',
    contactPhone: '010-33334444',
    createTime: '2024-03-01'
  },
  {
    id: 'dp005',
    type: 'garbage_station',
    name: '故宫社区分类投放点',
    address: '北京市东城区景山前街4号',
    latitude: 39.9163,
    longitude: 116.3972,
    distance: 950,
    businessHours: {
      weekdays: '06:30-21:30',
      weekends: '07:00-21:00'
    },
    isOpenNow: true,
    supportedCategories: ['kitchen', 'recyclable', 'harmful', 'other', 'bulky'],
    facilities: ['分类指导', '志愿者服务', '宣传展板', '休息区'],
    rating: 4.5,
    checkinCount: 312,
    description: '社区示范投放点，常年有志愿者提供分类指导，定期开展环保宣传活动',
    contactPhone: '010-55556666',
    createTime: '2023-08-15'
  },
  {
    id: 'dp006',
    type: 'recyclable',
    name: '崇文门旧物回收点',
    address: '北京市东城区崇文门外大街3号',
    latitude: 39.8994,
    longitude: 116.4158,
    distance: 1800,
    businessHours: {
      weekdays: '08:00-19:00',
      weekends: '09:00-18:00'
    },
    isOpenNow: true,
    supportedCategories: ['recyclable', 'electronic'],
    facilities: ['高价回收', '现场结算', '上门服务', '以旧换新'],
    rating: 4.4,
    checkinCount: 156,
    description: '专业旧物回收点，回收价格透明，支持以旧换新，现场结算',
    contactPhone: '010-77778888',
    createTime: '2023-09-20'
  },
  {
    id: 'dp007',
    type: 'garbage_station',
    name: '建国门社区分类站',
    address: '北京市东城区建国门内大街22号',
    latitude: 39.9091,
    longitude: 116.4350,
    distance: 2100,
    businessHours: {
      weekdays: '06:00-22:00',
      weekends: '06:00-22:00'
    },
    isOpenNow: true,
    supportedCategories: ['kitchen', 'recyclable', 'harmful', 'other'],
    facilities: ['四色垃圾桶', '洗手池', '照明', '监控设备'],
    rating: 4.3,
    checkinCount: 198,
    description: '标准化社区垃圾分类站，设备齐全，环境整洁',
    contactPhone: '010-99990000',
    createTime: '2023-07-10'
  },
  {
    id: 'dp008',
    type: 'harmful',
    name: '东城区环保驿站',
    address: '北京市东城区和平里西街15号',
    latitude: 39.9421,
    longitude: 116.4186,
    distance: 3500,
    businessHours: {
      weekdays: '09:00-17:00',
      weekends: '休息'
    },
    isOpenNow: false,
    supportedCategories: ['harmful', 'electronic'],
    facilities: ['专业存储', '分类处理', '环保宣传', '咨询服务'],
    rating: 4.8,
    checkinCount: 67,
    description: '集有害垃圾收集、环保宣传、咨询服务于一体的综合性环保驿站',
    contactPhone: '010-12121212',
    createTime: '2023-12-01'
  },
  {
    id: 'dp009',
    type: 'recyclable',
    name: '朝阳门再生资源回收点',
    address: '北京市东城区朝阳门内大街199号',
    latitude: 39.9248,
    longitude: 116.4294,
    distance: 2800,
    businessHours: {
      weekdays: '07:30-18:30',
      weekends: '08:00-17:30'
    },
    isOpenNow: true,
    supportedCategories: ['recyclable', 'bulky', 'electronic'],
    facilities: ['大型回收设备', '货车装卸', '分类打包', '仓储服务'],
    rating: 4.6,
    checkinCount: 234,
    description: '大型再生资源回收点，支持大批量可回收物回收，配备专业设备',
    contactPhone: '010-34343434',
    createTime: '2023-06-15'
  },
  {
    id: 'dp010',
    type: 'garbage_station',
    name: '东直门交通枢纽分类站',
    address: '北京市东城区东直门外大街48号',
    latitude: 39.9416,
    longitude: 116.4349,
    distance: 4200,
    businessHours: {
      weekdays: '05:00-23:00',
      weekends: '05:00-23:00'
    },
    isOpenNow: true,
    supportedCategories: ['kitchen', 'recyclable', 'harmful', 'other'],
    facilities: ['大容量垃圾桶', '频繁清运', '保洁服务', '指示标识'],
    rating: 4.2,
    checkinCount: 567,
    description: '交通枢纽配套分类站，容量大，清运频率高，满足大流量需求',
    contactPhone: '010-56565656',
    createTime: '2023-05-20'
  }
]

const DROP_POINT_STORAGE_KEYS = {
  FAVORITES: 'drop_point_favorites',
  CHECKINS: 'drop_point_checkins'
}

const COMMUNITY_POST_TYPES = [
  { id: 'experience', name: '环保心得', icon: '💚', color: '#5BBD72', desc: '分享你的环保感悟和心得体会' },
  { id: 'skill', name: '分类技巧', icon: '📝', color: '#4A90D9', desc: '实用的垃圾分类小技巧' },
  { id: 'photo', name: '晒图', icon: '📷', color: '#9B59B6', desc: '晒出你的环保生活瞬间' }
]

const COMMUNITY_TOPICS = [
  { id: 'kitchen_sort', name: '厨余垃圾分类', icon: '🍂', count: 1286, hot: true },
  { id: 'recycle_diy', name: '旧物改造', icon: '♻️', count: 892, hot: true },
  { id: 'zero_waste', name: '零废弃生活', icon: '🌱', count: 654, hot: false },
  { id: 'plastic_free', name: '减塑行动', icon: '🥤', count: 521, hot: false },
  { id: 'green_travel', name: '绿色出行', icon: '🚲', count: 438, hot: false },
  { id: 'energy_save', name: '节约能源', icon: '💡', count: 376, hot: false }
]

const OFFICIAL_ACCOUNT = {
  id: 'official',
  nickName: '环保小助手',
  avatarUrl: '',
  avatarEmoji: '🌿',
  isOfficial: true,
  verified: true
}

const COMMUNITY_POSTS = [
  {
    id: 'p1',
    type: 'experience',
    userId: 'u1',
    userNickName: '绿色生活家',
    userAvatar: '',
    userAvatarEmoji: '🌳',
    isOfficial: false,
    content: '坚持垃圾分类已经3年了，从最开始分不清四色垃圾桶，到现在随手就能准确投放。最大的收获是孩子也跟着养成了好习惯，每次出门都会主动找分类垃圾桶。环保真的要从娃娃抓起！💪',
    images: [],
    topics: ['kitchen_sort', 'zero_waste'],
    topicNames: ['厨余垃圾分类', '零废弃生活'],
    likes: 328,
    comments: 45,
    shares: 12,
    liked: false,
    createTime: '2024-06-16 18:30',
    status: 'normal'
  },
  {
    id: 'p2',
    type: 'skill',
    userId: 'u2',
    userNickName: '分类达人小王',
    userAvatar: '',
    userAvatarEmoji: '📚',
    isOfficial: false,
    content: '分享一个厨余垃圾沥干小技巧：用家里的旧丝袜做一个简易滤网，放在水槽出水口，饭菜残渣直接过滤，既不会堵下水道，又能轻松收集厨余垃圾沥干水分！亲测好用～',
    images: ['/images/banner/banner1.jpg'],
    topics: ['kitchen_sort'],
    topicNames: ['厨余垃圾分类'],
    likes: 567,
    comments: 89,
    shares: 156,
    liked: true,
    createTime: '2024-06-16 14:20',
    status: 'normal'
  },
  {
    id: 'p3',
    type: 'official_article',
    userId: 'official',
    userNickName: '环保小助手',
    userAvatar: '',
    userAvatarEmoji: '🌿',
    isOfficial: true,
    title: '【科普】可回收物投放指南：这些细节你注意到了吗？',
    content: '很多朋友以为可回收物就是"扔进去就行"，其实不然。正确的投放方式能大幅提高回收利用率：\n\n1️⃣ 清空内容物：塑料瓶、易拉罐要倒空残留液体\n2️⃣ 简单清洁：有油污的容器要冲洗干净\n3️⃣ 压扁投放：纸箱、塑料瓶压扁后能节省大量空间\n4️⃣ 分开投放：不同材质不要混装在一起\n\n下一期我们讲讲有害垃圾的正确投放方式，记得关注哦！',
    images: ['/images/banner/banner2.jpg'],
    topics: [],
    topicNames: [],
    likes: 1256,
    comments: 234,
    shares: 489,
    liked: false,
    createTime: '2024-06-16 10:00',
    category: '科普',
    status: 'normal'
  },
  {
    id: 'p4',
    type: 'photo',
    userId: 'u3',
    userNickName: '手工爱好者',
    userAvatar: '',
    userAvatarEmoji: '🎨',
    isOfficial: false,
    content: '用快递纸箱+旧布料做的收纳盒，好看又实用！旧物改造真的会上瘾，家里的废旧物品都变成宝贝了～',
    images: ['/images/banner/banner3.jpg', '/images/banner/exchange1.jpg'],
    topics: ['recycle_diy', 'zero_waste'],
    topicNames: ['旧物改造', '零废弃生活'],
    likes: 892,
    comments: 156,
    shares: 78,
    liked: false,
    createTime: '2024-06-15 20:15',
    status: 'normal'
  },
  {
    id: 'p5',
    type: 'official_activity',
    userId: 'official',
    userNickName: '环保小助手',
    userAvatar: '',
    userAvatarEmoji: '🌿',
    isOfficial: true,
    title: '【活动】"最美环保瞬间"摄影大赛开始啦！',
    content: '📢 社区首届环保摄影大赛正式启动！\n\n📅 活动时间：6月15日-6月30日\n🎁 奖品设置：\n· 一等奖（3名）：500积分+环保大礼包\n· 二等奖（10名）：200积分+定制水杯\n· 三等奖（30名）：100积分\n· 参与奖：发布即得20积分\n\n📸 参与方式：在社区发布带#最美环保瞬间 话题的晒图即可参与，快来记录你的环保时刻吧！',
    images: ['/images/banner/exchange2.jpg'],
    topics: [],
    topicNames: [],
    likes: 2341,
    comments: 567,
    shares: 892,
    liked: true,
    createTime: '2024-06-15 09:00',
    category: '活动',
    status: 'normal'
  },
  {
    id: 'p6',
    type: 'skill',
    userId: 'u4',
    userNickName: '环保妈妈',
    userAvatar: '',
    userAvatarEmoji: '👩',
    isOfficial: false,
    content: '家里废电池太多？教你一个简单的临时储存方法：用一个密封的塑料盒，底部铺一层小苏打，然后放入废电池，盖好盖子放在阴凉处。等到攒够一定数量，再送到社区有害垃圾回收点统一处理，安全又卫生！',
    images: [],
    topics: ['kitchen_sort'],
    topicNames: ['厨余垃圾分类'],
    likes: 445,
    comments: 67,
    shares: 34,
    liked: false,
    createTime: '2024-06-14 16:40',
    status: 'normal'
  }
]

const COMMUNITY_COMMENTS = {
  'p1': [
    {
      id: 'c1',
      postId: 'p1',
      userId: 'u2',
      userNickName: '分类达人小王',
      userAvatarEmoji: '📚',
      content: '同感！我家孩子现在比我分得还清楚😂',
      likes: 23,
      liked: false,
      createTime: '2024-06-16 18:45'
    },
    {
      id: 'c2',
      postId: 'p1',
      userId: 'u3',
      userNickName: '手工爱好者',
      userAvatarEmoji: '🎨',
      content: '3年太厉害了！我才坚持了半年，一起加油～',
      likes: 12,
      liked: false,
      createTime: '2024-06-16 19:10'
    }
  ],
  'p2': [
    {
      id: 'c3',
      postId: 'p2',
      userId: 'u1',
      userNickName: '绿色生活家',
      userAvatarEmoji: '🌳',
      content: '这个妙招好！明天就试试！',
      likes: 45,
      liked: true,
      createTime: '2024-06-16 14:35'
    }
  ]
}

const COMMUNITY_REPORT_REASONS = [
  { id: 'spam', name: '垃圾广告或营销信息' },
  { id: 'porn', name: '色情低俗内容' },
  { id: 'violence', name: '暴力或血腥内容' },
  { id: 'rumor', name: '谣言或不实信息' },
  { id: 'harass', name: '骚扰或人身攻击' },
  { id: 'plagiarism', name: '抄袭或盗用内容' },
  { id: 'violate', name: '其他违法违规内容' }
]

const COMMUNITY_POINTS_CONFIG = {
  publishPost: 20,
  dailyPublishMax: 60,
  likePost: 1,
  dailyLikeMax: 10,
  commentPost: 2,
  dailyCommentMax: 20,
  sharePost: 5,
  dailyShareMax: 25,
  qualityBonus: {
    likes50: 30,
    likes200: 100,
    likes500: 300,
    comments30: 50,
    shares50: 80
  }
}

const LEADERBOARD_CONFIG = {
  periods: [
    { id: 'week', name: '周榜', icon: '📅', days: 7 },
    { id: 'month', name: '月榜', icon: '🗓️', days: 30 },
    { id: 'total', name: '总榜', icon: '🏆', days: 0 }
  ],
  dimensions: [
    { id: 'points', name: '积分', icon: '💰', unit: '分' },
    { id: 'accuracy', name: '正确率', icon: '🎯', unit: '%' },
    { id: 'classifyCount', name: '分类次数', icon: '♻️', unit: '次' },
    { id: 'streakDays', name: '连续签到', icon: '📅', unit: '天' }
  ],
  topDisplayCount: 3,
  pageSize: 20
}

const LEADERBOARD_USERS = [
  { id: 'lb_u1', nickName: '环保大师', avatarEmoji: '🏆', points: 8500, accuracy: 96, classifyCount: 320, streakDays: 60 },
  { id: 'lb_u2', nickName: '绿色先锋', avatarEmoji: '🌲', points: 7200, accuracy: 93, classifyCount: 280, streakDays: 45 },
  { id: 'lb_u3', nickName: '分类达人', avatarEmoji: '🌿', points: 6500, accuracy: 91, classifyCount: 250, streakDays: 38 },
  { id: 'lb_u4', nickName: '环保小能手', avatarEmoji: '🌱', points: 5800, accuracy: 88, classifyCount: 220, streakDays: 30 },
  { id: 'lb_u5', nickName: '垃圾克星', avatarEmoji: '⚡', points: 5200, accuracy: 85, classifyCount: 200, streakDays: 28 },
  { id: 'lb_u6', nickName: '地球卫士', avatarEmoji: '🌍', points: 4600, accuracy: 82, classifyCount: 180, streakDays: 25 },
  { id: 'lb_u7', nickName: '分类新星', avatarEmoji: '⭐', points: 4000, accuracy: 80, classifyCount: 160, streakDays: 20 },
  { id: 'lb_u8', nickName: '环保志愿者', avatarEmoji: '🤝', points: 3500, accuracy: 78, classifyCount: 140, streakDays: 18 },
  { id: 'lb_u9', nickName: '绿色出行者', avatarEmoji: '🚲', points: 3000, accuracy: 75, classifyCount: 120, streakDays: 15 },
  { id: 'lb_u10', nickName: '分类新手', avatarEmoji: '🍀', points: 2500, accuracy: 72, classifyCount: 100, streakDays: 12 },
  { id: 'lb_u11', nickName: '环保学徒', avatarEmoji: '📖', points: 2000, accuracy: 70, classifyCount: 80, streakDays: 10 },
  { id: 'lb_u12', nickName: '小绿叶', avatarEmoji: '🍃', points: 1600, accuracy: 68, classifyCount: 60, streakDays: 8 },
  { id: 'lb_u13', nickName: '分类小白', avatarEmoji: '🐣', points: 1200, accuracy: 65, classifyCount: 45, streakDays: 6 },
  { id: 'lb_u14', nickName: '环保起步', avatarEmoji: '🚶', points: 800, accuracy: 60, classifyCount: 30, streakDays: 4 },
  { id: 'lb_u15', nickName: '初学者', avatarEmoji: '🎒', points: 500, accuracy: 55, classifyCount: 15, streakDays: 2 }
]

const PK_CONFIG = {
  questionCount: 5,
  timePerQuestion: 10,
  winPoints: 30,
  losePoints: 5,
  drawPoints: 15,
  maxDailyPK: 10,
  matchTimeout: 30000,
  rematchCooldown: 60000,
  sameOpponentMaxPerDay: 2
}

const SEASON_CONFIG = {
  seasonDurationDays: 30,
  resetDimensions: ['points', 'accuracy', 'classifyCount'],
  keepDimensions: ['streakDays'],
  seasonMedalPrefix: '赛季勋章',
  seasonVoucherPoints: 200,
  seasonTopReward: { 1: 500, 2: 300, 3: 200 },
  seasonResetDay: 1
}

const ANTI_CHEAT_CONFIG = {
  maxScorePerHour: 500,
  maxPKPerHour: 6,
  minAnswerTime: 1500,
  abnormalAccuracyThreshold: 98,
  abnormalSpeedThreshold: 2000,
  sameOpponentCooldown: 300000,
  suspiciousScoreMultiplier: 3
}

module.exports = {
  TRASH_TYPES,
  QUIZ_SCENES,
  QUIZ_QUESTION_TYPES,
  BANNER_LIST,
  EXCHANGE_GOODS,
  EXCHANGE_BANNERS,
  PROFILE_MENUS,
  USER_LEVELS,
  getUserLevel,
  QUIZ_CHAPTERS,
  QUIZ_DIFFICULTIES,
  QUIZ_QUESTIONS,
  QUIZ_TIMED_CONFIG,
  QUIZ_BOSS_CONFIG,
  QUIZ_WRONG_SORT_CONFIG,
  QUIZ_POINTS_CONFIG,
  SHARE_CONFIG,
  INVITE_CONFIG,
  ACHIEVEMENTS,
  getQuestionsByChapter,
  getQuestionsByDifficulty,
  getQuestionsByScene,
  getQuestionsByType,
  getRandomQuestions,
  getQuestionById,
  getDailyQuestions,
  isQuestionCorrect,
  SORT_PRACTICE_ITEMS,
  getSortItemsByType,
  getRandomSortItems,
  TRASH_ENCYCLOPEDIA,
  HOT_SEARCH_WORDS,
  SEARCH_HISTORY_KEY,
  MAX_SEARCH_HISTORY,
  fuzzySearchTrash,
  ECO_TIPS,
  HOT_WASTE_NEWS,
  CITY_STANDARDS,
  DROP_POINT_TYPES,
  SUPPORTED_CATEGORIES,
  DROP_POINTS,
  DROP_POINT_STORAGE_KEYS,
  COMMUNITY_POST_TYPES,
  COMMUNITY_TOPICS,
  OFFICIAL_ACCOUNT,
  COMMUNITY_POSTS,
  COMMUNITY_COMMENTS,
  COMMUNITY_REPORT_REASONS,
  COMMUNITY_POINTS_CONFIG,
  LEADERBOARD_CONFIG,
  LEADERBOARD_USERS,
  PK_CONFIG,
  SEASON_CONFIG,
  ANTI_CHEAT_CONFIG
}
