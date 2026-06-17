const app = getApp()
const { formatDate, generateId } = require('../../utils/util')

const RESULT_CONFIG = {
  win: { emoji: '🏆', title: '胜利', color: '#5BBD72', points: 30 },
  draw: { emoji: '🤝', title: '平局', color: '#4A90D9', points: 15 },
  lose: { emoji: '💪', title: '失败', color: '#F39C12', points: 5 }
}

Page({
  data: {
    result: 'win',
    pointsEarned: 0,
    myCorrectCount: 0,
    opponentCorrectCount: 0,
    myTotalTime: 0,
    opponentTotalTime: 0,
    totalQuestions: 5,
    opponentName: '',
    opponentAvatarEmoji: '',
    resultEmoji: '🏆',
    resultTitle: '胜利',
    resultColor: '#5BBD72',
    myAccuracy: '0%',
    opponentAccuracy: '0%',
    showContent: false
  },

  onLoad(options) {
    let data = {}
    if (options.data) {
      try {
        data = JSON.parse(decodeURIComponent(options.data))
      } catch (e) {
        data = {}
      }
    } else {
      data = options
    }

    const result = data.result || 'win'
    const config = RESULT_CONFIG[result] || RESULT_CONFIG.win

    const totalQuestions = parseInt(data.totalQuestions, 10) || 5
    const myCorrectCount = parseInt(data.myCorrectCount, 10) || 0
    const opponentCorrectCount = parseInt(data.opponentCorrectCount, 10) || 0

    const myAccuracy = totalQuestions > 0 ? Math.round((myCorrectCount / totalQuestions) * 100) : 0
    const opponentAccuracy = totalQuestions > 0 ? Math.round((opponentCorrectCount / totalQuestions) * 100) : 0

    this.setData({
      result,
      pointsEarned: parseInt(data.pointsEarned, 10) || config.points,
      myCorrectCount,
      opponentCorrectCount,
      myTotalTime: parseInt(data.myTotalTime, 10) || 0,
      opponentTotalTime: parseInt(data.opponentTotalTime, 10) || 0,
      totalQuestions,
      opponentName: data.opponentName || '对手',
      opponentAvatarEmoji: data.opponentAvatarEmoji || '🤖',
      resultEmoji: config.emoji,
      resultTitle: config.title,
      resultColor: config.color,
      myAccuracy: myAccuracy + '%',
      opponentAccuracy: opponentAccuracy + '%'
    })

    this.awardPoints()

    setTimeout(() => {
      this.setData({ showContent: true })
    }, 100)
  },

  awardPoints() {
    const { pointsEarned, result, resultTitle } = this.data
    if (pointsEarned > 0) {
      app.updateUserPoints(pointsEarned, {
        category: 'pk',
        title: 'PK对战',
        desc: `PK对战${resultTitle}，获得${pointsEarned}积分`,
        emoji: RESULT_CONFIG[result].emoji
      })
    }
  },

  formatTime(seconds) {
    const s = seconds || 0
    if (s < 60) return s + '秒'
    const min = Math.floor(s / 60)
    const sec = s % 60
    return min + '分' + (sec > 0 ? sec + '秒' : '')
  },

  onPlayAgain() {
    wx.redirectTo({
      url: '/pages/pk-battle/pk-battle'
    })
  },

  onViewLeaderboard() {
    wx.navigateTo({
      url: '/pages/leaderboard/leaderboard'
    })
  },

  onShareAppMessage() {
    const { result, resultTitle, opponentName } = this.data
    return {
      title: `我在PK对战中${resultTitle}了${opponentName}，快来挑战我吧！`,
      path: '/pages/index/index'
    }
  }
})
