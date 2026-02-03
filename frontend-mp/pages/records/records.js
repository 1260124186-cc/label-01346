/**
 * 分类记录页面
 */
const { TRASH_TYPES } = require('../../utils/constants')

Page({
  data: {
    // 统计数据
    totalCount: 128,
    totalPoints: 2580,
    continuousDays: 15,
    
    // 分类统计
    categoryStats: [
      { id: 1, name: '可回收', emoji: '♻️', color: '#4A90D9', count: 45 },
      { id: 2, name: '有害', emoji: '☣️', color: '#E85D5D', count: 12 },
      { id: 3, name: '厨余', emoji: '🍂', color: '#5BBD72', count: 56 },
      { id: 4, name: '其他', emoji: '🗑️', color: '#8E8E93', count: 15 }
    ],
    
    // 记录列表
    recordList: [
      {
        id: 1,
        trashName: '塑料瓶',
        typeName: '可回收垃圾',
        emoji: '🧴',
        bgColor: 'rgba(74, 144, 217, 0.1)',
        points: 10,
        time: '今天 14:30'
      },
      {
        id: 2,
        trashName: '剩菜剩饭',
        typeName: '厨余垃圾',
        emoji: '🍚',
        bgColor: 'rgba(91, 189, 114, 0.1)',
        points: 5,
        time: '今天 12:15'
      },
      {
        id: 3,
        trashName: '废电池',
        typeName: '有害垃圾',
        emoji: '🔋',
        bgColor: 'rgba(232, 93, 93, 0.1)',
        points: 20,
        time: '今天 09:45'
      },
      {
        id: 4,
        trashName: '旧报纸',
        typeName: '可回收垃圾',
        emoji: '📰',
        bgColor: 'rgba(74, 144, 217, 0.1)',
        points: 15,
        time: '昨天 18:20'
      },
      {
        id: 5,
        trashName: '果皮',
        typeName: '厨余垃圾',
        emoji: '🍎',
        bgColor: 'rgba(91, 189, 114, 0.1)',
        points: 5,
        time: '昨天 15:30'
      },
      {
        id: 6,
        trashName: '卫生纸',
        typeName: '其他垃圾',
        emoji: '🧻',
        bgColor: 'rgba(142, 142, 147, 0.1)',
        points: 3,
        time: '昨天 10:00'
      }
    ]
  },

  onLoad() {
    console.log('[Records] 页面加载')
  },

  onPullDownRefresh() {
    console.log('[Records] 下拉刷新')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
