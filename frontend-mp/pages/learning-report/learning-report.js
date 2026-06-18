const app = getApp()
const { TRASH_TYPES, ACHIEVEMENTS } = require('../../utils/constants')
const { showToast, navigateTo } = require('../../utils/util')

Page({
  data: {
    hasPermission: false,
    members: [],
    currentMemberId: '',
    overview: {
      totalDays: 0,
      classifyCount: 0,
      quizCount: 0,
      totalPoints: 0
    },
    report: {
      overallAccuracy: 0,
      correctCount: 0,
      wrongCount: 0
    },
    categoryAccuracy: [],
    weakCategories: [],
    weeklyStats: [],
    trendTab: 'classify',
    maxTrendValue: 0,
    weekTotal: 0,
    dailyAverage: 0,
    badges: [],
    unlockedBadgeCount: 0,
    homeworkRanking: [],
    hasHomeworkData: false
  },

  onLoad() {
    console.log('[LearningReport] 页面加载')
    this.initPermissionAndData()
  },

  onShow() {
    console.log('[LearningReport] 页面显示')
    if (this.data.currentMemberId) {
      this.loadMemberData(this.data.currentMemberId)
    }
  },

  onPullDownRefresh() {
    console.log('[LearningReport] 下拉刷新')
    if (this.data.currentMemberId) {
      this.loadMemberData(this.data.currentMemberId, () => {
        wx.stopPullDownRefresh()
        showToast('刷新成功')
      })
    } else {
      wx.stopPullDownRefresh()
    }
  },

  initPermissionAndData() {
    let members = []
    try {
      if (typeof app.getGroupMembersWithPermission === 'function') {
        members = app.getGroupMembersWithPermission() || []
      }
    } catch (e) {
      console.warn('[LearningReport] 获取成员列表失败，使用模拟数据', e)
    }

    if (members.length === 0) {
      members = this.getMockMembers()
    }

    const hasPermission = members.length > 0

    this.setData({
      hasPermission,
      members
    })

    if (hasPermission && members.length > 0) {
      const defaultMember = members[0]
      this.setData({
        currentMemberId: defaultMember.id
      })
      this.loadMemberData(defaultMember.id)
    }
  },

  getMockMembers() {
    return [
      {
        id: 'member_self',
        nickName: '我自己',
        avatarUrl: '',
        emoji: '🌱',
        role: 'creator'
      },
      {
        id: 'member_1',
        nickName: '小明',
        avatarUrl: '',
        emoji: '👦',
        role: 'child'
      },
      {
        id: 'member_2',
        nickName: '小红',
        avatarUrl: '',
        emoji: '👧',
        role: 'child'
      }
    ]
  },

  onMemberSelect(e) {
    const { member } = e.currentTarget.dataset
    if (member.id === this.data.currentMemberId) return

    this.setData({
      currentMemberId: member.id
    })
    this.loadMemberData(member.id)
  },

  loadMemberData(memberId, callback) {
    wx.showLoading({ title: '加载中...', mask: true })

    Promise.all([
      this.fetchLearningReport(memberId),
      this.fetchWeakCategories(memberId),
      this.fetchWeeklyStats(memberId),
      this.fetchMemberBadges(memberId),
      this.fetchHomeworkRanking()
    ]).then(() => {
      wx.hideLoading()
      if (callback) callback()
    }).catch((err) => {
      console.error('[LearningReport] 加载数据失败', err)
      wx.hideLoading()
      if (callback) callback()
    })
  },

  fetchLearningReport(memberId) {
    return new Promise((resolve) => {
      let reportData = null
      try {
        if (typeof app.getMemberLearningReport === 'function') {
          reportData = app.getMemberLearningReport(memberId)
        }
      } catch (e) {
        console.warn('[LearningReport] 获取学习报告失败', e)
      }

      if (!reportData) {
        reportData = this.getMockLearningReport()
      }

      const categoryAccuracy = TRASH_TYPES.map(type => {
        const catStats = (reportData.categoryStats || []).find(c => c.typeId === type.id)
        const accuracy = catStats ? Math.round(catStats.correct / (catStats.correct + catStats.wrong) * 100) : Math.floor(Math.random() * 40) + 55
        return {
          id: type.id,
          name: type.name.replace('垃圾', ''),
          emoji: type.emoji,
          color: type.color,
          bgColor: type.bgColor,
          accuracy: Math.min(100, Math.max(0, accuracy))
        }
      })

      this.setData({
        overview: {
          totalDays: reportData.totalDays || 0,
          classifyCount: reportData.classifyCount || 0,
          quizCount: reportData.quizCount || 0,
          totalPoints: reportData.totalPoints || 0
        },
        report: {
          overallAccuracy: reportData.overallAccuracy || 0,
          correctCount: reportData.correctCount || 0,
          wrongCount: reportData.wrongCount || 0
        },
        categoryAccuracy
      })

      resolve()
    })
  },

  getMockLearningReport() {
    const totalQuestions = 87
    const correctCount = 68
    return {
      totalDays: 23,
      classifyCount: 156,
      quizCount: totalQuestions,
      totalPoints: 2380,
      overallAccuracy: Math.round(correctCount / totalQuestions * 100),
      correctCount,
      wrongCount: totalQuestions - correctCount,
      categoryStats: [
        { typeId: 1, correct: 22, wrong: 5 },
        { typeId: 2, correct: 12, wrong: 8 },
        { typeId: 3, correct: 18, wrong: 4 },
        { typeId: 4, correct: 16, wrong: 2 }
      ]
    }
  },

  fetchWeakCategories(memberId) {
    return new Promise((resolve) => {
      let weakData = null
      try {
        if (typeof app.getMemberWeakCategories === 'function') {
          weakData = app.getMemberWeakCategories(memberId)
        }
      } catch (e) {
        console.warn('[LearningReport] 获取薄弱类别失败', e)
      }

      if (!weakData) {
        weakData = this.getMockWeakCategories()
      }

      this.setData({
        weakCategories: weakData
      })
      resolve()
    })
  },

  getMockWeakCategories() {
    const weakList = []
    const accuracyMap = {
      1: 62,
      2: 48,
      3: 78,
      4: 55
    }

    TRASH_TYPES.forEach(type => {
      const accuracy = accuracyMap[type.id] || 80
      if (accuracy < 60) {
        weakList.push({
          id: type.id,
          name: type.name,
          emoji: type.emoji,
          color: type.color,
          bgColor: type.bgColor,
          accuracy,
          recentWrong: this.getMockWrongQuestions(type.id)
        })
      }
    })

    return weakList
  },

  getMockWrongQuestions(typeId) {
    const wrongPool = {
      2: [
        { id: 'w1', question: '废电池应该投入哪个颜色的垃圾桶？', yourAnswer: '蓝色', correctAnswer: '红色' },
        { id: 'w2', question: '过期感冒药属于什么垃圾？', yourAnswer: '其他垃圾', correctAnswer: '有害垃圾' },
        { id: 'w3', question: '水银温度计破损后应如何处理？', yourAnswer: '直接丢入垃圾桶', correctAnswer: '密封后送有害垃圾收集点' },
        { id: 'w4', question: '染发剂外壳属于什么垃圾？', yourAnswer: '可回收垃圾', correctAnswer: '有害垃圾' },
        { id: 'w5', question: '杀虫剂喷雾罐属于什么垃圾？', yourAnswer: '其他垃圾', correctAnswer: '有害垃圾' }
      ],
      4: [
        { id: 'w6', question: '使用过的餐巾纸属于什么垃圾？', yourAnswer: '可回收垃圾', correctAnswer: '其他垃圾' },
        { id: 'w7', question: '破碎的陶瓷碗属于什么垃圾？', yourAnswer: '可回收垃圾', correctAnswer: '其他垃圾' },
        { id: 'w8', question: '烟蒂应该投入哪个垃圾桶？', yourAnswer: '厨余垃圾', correctAnswer: '其他垃圾' },
        { id: 'w9', question: '一次性筷子属于什么垃圾？', yourAnswer: '厨余垃圾', correctAnswer: '其他垃圾' },
        { id: 'w10', question: '大骨头属于什么垃圾？', yourAnswer: '厨余垃圾', correctAnswer: '其他垃圾' }
      ]
    }
    return wrongPool[typeId] || []
  },

  fetchWeeklyStats(memberId) {
    return new Promise((resolve) => {
      let statsData = null
      try {
        if (typeof app.getMemberWeeklyStats === 'function') {
          statsData = app.getMemberWeeklyStats(memberId)
        }
      } catch (e) {
        console.warn('[LearningReport] 获取周数据失败', e)
      }

      if (!statsData) {
        statsData = this.getMockWeeklyStats()
      }

      this.updateTrendCalculations(statsData)
      resolve()
    })
  },

  getMockWeeklyStats() {
    const now = new Date()
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const stats = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86400000)
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekday = weekdays[date.getDay()]
      const isToday = i === 0

      stats.push({
        date: `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        dateLabel: isToday ? '今天' : `${month}/${day}`,
        weekday: `周${weekday}`,
        classify: Math.floor(Math.random() * 15) + 3,
        quiz: Math.floor(Math.random() * 10) + 1
      })
    }

    return stats
  },

  updateTrendCalculations(weeklyStats) {
    const { trendTab } = this.data

    const values = weeklyStats.map(item => item[trendTab] || 0)
    const maxTrendValue = Math.max(...values, 1)
    const weekTotal = values.reduce((sum, v) => sum + v, 0)
    const dailyAverage = values.length > 0 ? Math.round(weekTotal / values.length) : 0

    this.setData({
      weeklyStats,
      maxTrendValue,
      weekTotal,
      dailyAverage
    })
  },

  switchTrendTab(e) {
    const { tab } = e.currentTarget.dataset
    if (tab === this.data.trendTab) return

    this.setData({
      trendTab: tab
    })
    this.updateTrendCalculations(this.data.weeklyStats)
  },

  fetchMemberBadges(memberId) {
    return new Promise((resolve) => {
      let badgesData = null
      try {
        if (typeof app.getMemberBadges === 'function') {
          badgesData = app.getMemberBadges(memberId)
        }
      } catch (e) {
        console.warn('[LearningReport] 获取勋章失败', e)
      }

      if (!badgesData) {
        badgesData = this.getMockBadges()
      }

      const unlockedBadgeCount = badgesData.filter(b => b.unlocked).length

      this.setData({
        badges: badgesData,
        unlockedBadgeCount
      })
      resolve()
    })
  },

  getMockBadges() {
    const unlockedIds = ['classify_master', 'signin_30', 'points_5000']
    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id)
    }))
  },

  fetchHomeworkRanking() {
    return new Promise((resolve) => {
      let rankingData = null
      try {
        if (typeof app.getHomeworkCompletionRanking === 'function') {
          const currentGroup = app.getCurrentGroup()
          if (currentGroup) {
            rankingData = app.getHomeworkCompletionRanking(currentGroup.id)
          }
        }
      } catch (e) {
        console.warn('[LearningReport] 获取作业排名失败', e)
      }

      if (!rankingData || rankingData.length === 0) {
        rankingData = this.getMockHomeworkRanking()
      }

      const hasHomeworkData = rankingData.length > 0

      this.setData({
        homeworkRanking: rankingData,
        hasHomeworkData
      })

      resolve()
    })
  },

  getMockHomeworkRanking() {
    const groupMembers = this.data.members
    return groupMembers.map((member, index) => {
      const completionRate = Math.max(0, Math.min(100, 100 - index * 25 + Math.floor(Math.random() * 15)))
      const completedHomework = Math.floor(completionRate / 20)
      const totalHomework = 4
      return {
        memberId: member.id,
        memberName: member.nickName,
        memberEmoji: member.emoji || '🌱',
        avatarUrl: member.avatarUrl,
        completionRate,
        completedHomework,
        totalHomework,
        rank: index + 1,
        isCurrentUser: member.id === this.data.currentMemberId
      }
    }).sort((a, b) => b.completionRate - a.completionRate).map((item, index) => ({
      ...item,
      rank: index + 1
    }))
  },

  goToHomeworkDetail(e) {
    navigateTo('/pages/group-homework/group-homework')
  },

  goToHomeworkList() {
    navigateTo('/pages/group-homework/group-homework')
  },

  goToPractice(e) {
    const { category } = e.currentTarget.dataset
    console.log('[LearningReport] 跳转练习类别:', category.name)

    const chapterMatch = {
      1: 'quiz-chapter',
      2: 'quiz-chapter',
      3: 'quiz-chapter',
      4: 'quiz-chapter'
    }

    const targetPage = chapterMatch[category.id] || 'sort-practice'
    const params = targetPage === 'quiz-chapter' ? `?chapterId=${category.id}` : `?typeId=${category.id}`

    navigateTo(`/pages/${targetPage}/${targetPage}${params}`)
  },

  onShareAppMessage() {
    const member = this.data.members.find(m => m.id === this.data.currentMemberId)
    return {
      title: `${member ? member.nickName + '的' : ''}学习报告 - 垃圾分类助手`,
      path: `/pages/index/index`,
      imageUrl: ''
    }
  }
})
