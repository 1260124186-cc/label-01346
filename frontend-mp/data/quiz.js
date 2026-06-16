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

module.exports = {
  QUIZ_CHAPTERS,
  QUIZ_DIFFICULTIES,
  QUIZ_QUESTIONS
}
