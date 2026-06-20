const app = getApp()
const { LEADERBOARD_CONFIG } = require('../../utils/constants')
const { formatNumber } = require('../../utils/util')

Page({
  data: {
    currentMainTab: 'leaderboard',
    periods: LEADERBOARD_CONFIG.periods,
    dimensions: [
      { id: 'points', name: '积分', icon: '💰', unit: '分' },
      { id: 'accuracy', name: '正确率', icon: '🎯', unit: '%' },
      { id: 'classifyCount', name: '分类次数', icon: '♻️', unit: '次' },
      { id: 'gameScore', name: '游戏最高分', icon: '🎮', unit: '分' }
    ],
    currentPeriod: 'week',
    currentDimension: 'gameScore',
    groupGameLeaderboard: null,
    leaderboardList: [],
    myRank: 0,
    myData: null,
    groupTasks: [],
    pointsPool: {
      totalPoints: 0,
      earnedPoints: 0,
      usedPoints: 0,
      memberCount: 0
    },
    pointsHistoryTab: 'earn',
    pointsHistory: {
      earn: [],
      exchange: []
    },
    groupId: ''
  },

  onLoad(options) {
    const groupId = options.groupId || 'default-group'
    this.setData({ groupId })
    this.loadLeaderboard()
    this.refreshGameLeaderboard()
    this.loadGroupTasks()
    this.loadPointsPool()
    this.loadPointsHistory()
  },

  onShow() {
    this.loadLeaderboard()
    this.refreshGameLeaderboard()
    this.loadGroupTasks()
    this.loadPointsPool()
    this.loadPointsHistory()
  },

  onMainTabTap(e) {
    const { tab } = e.currentTarget.dataset
    if (tab === this.data.currentMainTab) return
    this.setData({ currentMainTab: tab })
  },

  onPeriodTap(e) {
    const { id } = e.currentTarget.dataset
    if (id === this.data.currentPeriod) return
    this.setData({ currentPeriod: id })
    this.loadLeaderboard()
  },

  onDimensionChange(e) {
    const { id } = e.currentTarget.dataset
    if (id === this.data.currentDimension) return
    this.setData({ currentDimension: id })
    if (id === 'gameScore') {
      this.refreshGameLeaderboard()
    } else {
      this.loadLeaderboard()
    }
  },

  refreshGameLeaderboard() {
    const currentGroup = app.getCurrentGroup()
    if (!currentGroup) return
    const gameLB = app.getGroupGameLeaderboard(currentGroup.id, this.data.currentDimension)
    this.setData({ groupGameLeaderboard: gameLB })
  },

  onPointsHistoryTabTap(e) {
    const { tab } = e.currentTarget.dataset
    if (tab === this.data.pointsHistoryTab) return
    this.setData({ pointsHistoryTab: tab })
  },

  loadLeaderboard() {
    const { groupId, currentPeriod, currentDimension } = this.data
    const result = app.getGroupLeaderboard(groupId, currentPeriod, currentDimension)
    if (!result) return

    const currentDim = this.data.dimensions.find(d => d.id === currentDimension)
    const list = result.list.map(user => ({
      ...user,
      displayValue: this.formatValue(user[currentDimension], currentDim)
    }))

    let myData = null
    let myRank = result.myRank || 0
    const myRecord = list.find(u => u.isCurrentUser)
    if (myRecord) {
      myData = myRecord
    } else if (result.myData) {
      myData = {
        ...result.myData,
        displayValue: this.formatValue(result.myData[currentDimension], currentDim)
      }
    }

    const othersList = list.filter(u => !u.isCurrentUser)

    this.setData({
      leaderboardList: othersList,
      myRank,
      myData
    })
  },

  loadGroupTasks() {
    const { groupId } = this.data
    const tasks = app.getGroupTasks(groupId)
    if (!tasks || tasks.length === 0) {
      this.setData({
        groupTasks: [this.getDefaultTask()]
      })
      return
    }

    const processedTasks = tasks.map(task => {
      const progress = app.getGroupTaskProgress(groupId, task.id) || task.progress || this.getDefaultProgress()
      const percent = progress.targetCount > 0
        ? Math.min(100, Math.round((progress.currentCount / progress.targetCount) * 100))
        : 0

      return {
        ...task,
        isCompleted: percent >= 100,
        progress: {
          currentCount: progress.currentCount || 0,
          targetCount: progress.targetCount || 100,
          percent
        },
        reward: task.reward || this.getDefaultReward(),
        contributions: task.contributions || progress.contributions || this.getDefaultContributions()
      }
    })

    this.setData({ groupTasks: processedTasks })
  },

  loadPointsPool() {
    const { groupId } = this.data
    const pool = app.getGroupPointsPool(groupId)
    if (!pool) {
      this.setData({
        pointsPool: this.getDefaultPointsPool()
      })
      return
    }

    this.setData({
      pointsPool: {
        totalPoints: pool.totalPoints || 0,
        earnedPoints: pool.earnedPoints || 0,
        usedPoints: pool.usedPoints || 0,
        memberCount: pool.memberCount || 0
      }
    })
  },

  loadPointsHistory() {
    const { groupId } = this.data
    const history = app.getGroupPointsHistory(groupId)
    if (!history) {
      this.setData({
        pointsHistory: {
          earn: this.getDefaultEarnHistory(),
          exchange: this.getDefaultExchangeHistory()
        }
      })
      return
    }

    this.setData({
      pointsHistory: {
        earn: history.earn || this.getDefaultEarnHistory(),
        exchange: history.exchange || this.getDefaultExchangeHistory()
      }
    })
  },

  formatValue(value, dimension) {
    if (!dimension) return value
    if (dimension.id === 'accuracy') {
      return (value || 0) + '%'
    }
    return formatNumber(value || 0) + (dimension.unit || '')
  },

  getDefaultTask() {
    return {
      id: 'week-classify-100',
      icon: '♻️',
      title: '本周分类任务',
      description: '本周完成分类100次',
      isCompleted: false,
      progress: this.getDefaultProgress(),
      reward: this.getDefaultReward(),
      contributions: this.getDefaultContributions()
    }
  },

  getDefaultProgress() {
    return {
      currentCount: 68,
      targetCount: 100,
      percent: 68
    }
  },

  getDefaultReward() {
    return {
      points: 500,
      badge: '团队之星勋章'
    }
  },

  getDefaultContributions() {
    return [
      { id: 1, rank: 1, nickName: '环保达人小王', avatarEmoji: '🌟', count: 28 },
      { id: 2, rank: 2, nickName: '绿色生活家', avatarEmoji: '🌿', count: 18 },
      { id: 3, rank: 3, nickName: '分类小能手', avatarEmoji: '🌱', count: 12 },
      { id: 4, rank: 4, nickName: '低碳先锋', avatarEmoji: '♻️', count: 6 },
      { id: 5, rank: 5, nickName: '地球卫士', avatarEmoji: '🌍', count: 4 }
    ]
  },

  getDefaultPointsPool() {
    return {
      totalPoints: 3280,
      earnedPoints: 4280,
      usedPoints: 1000,
      memberCount: 12
    }
  },

  getDefaultEarnHistory() {
    return [
      { id: 1, icon: '🎯', event: '完成「本周分类100次」任务', points: 500, time: '2024-06-16 18:30' },
      { id: 2, icon: '👥', event: '成员「环保达人小王」贡献积分', points: 120, time: '2024-06-15 14:22' },
      { id: 3, icon: '🏆', event: '组内周排行第一名奖励', points: 300, time: '2024-06-10 09:00' },
      { id: 4, icon: '✅', event: '完成「垃圾分类答题」挑战', points: 80, time: '2024-06-08 20:15' },
      { id: 5, icon: '♻️', event: '成员集体分类贡献积分', points: 280, time: '2024-06-05 16:40' }
    ]
  },

  getDefaultExchangeHistory() {
    return [
      { id: 1, icon: '🎁', event: '兑换「环保购物袋」×5', points: 500, time: '2024-06-14 10:20' },
      { id: 2, icon: '🥤', event: '兑换「便携餐具套装」×2', points: 400, time: '2024-06-12 15:30' },
      { id: 3, icon: '🌱', event: '兑换「多肉植物盆栽」×1', points: 100, time: '2024-06-06 11:45' }
    ]
  },

  onPullDownRefresh() {
    this.loadLeaderboard()
    this.refreshGameLeaderboard()
    this.loadGroupTasks()
    this.loadPointsPool()
    this.loadPointsHistory()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  }
})
