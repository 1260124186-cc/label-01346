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

module.exports = {
  TRASH_TYPES
}
