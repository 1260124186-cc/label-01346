/**
 * 游戏大厅页面
 * @description 展示三款垃圾分类小游戏入口，显示每日游戏次数、最高分等
 */
const app = getApp()
const { GAME_CONFIG, GAME_POWERUPS } = require('../../utils/constants')
const { navigateTo, showToast, showModal, formatNumber } = require('../../utils/util')

const GAMES = [
  {
    id: 'catch',
    name: '接垃圾',
    englishName: 'Catch Trash',
    emoji: '🎯',
    description: '物品从天而降，滑动到对应垃圾桶',
    gradientStart: '#FF6B6B',
    gradientEnd: '#EE5A6F',
    icon: '🎯'
  },
  {
    id: 'conveyor',
    name: '分拣流水线',
    englishName: 'Sorting Line',
    emoji: '🏭',
    description: '传送带物品飞速而来，快速投入正确桶',
    gradientStart: '#4ECDC4',
    gradientEnd: '#44A08D',
    icon: '🏭'
  },
  {
    id: 'match',
    name: '记忆配对',
    englishName: 'Memory Match',
    emoji: '🧠',
    description: '翻开卡片，配对垃圾与类别',
    gradientStart: '#A78BFA',
    gradientEnd: '#7C3AED',
    icon: '🧠'
  }
]

Page({
  data: {
    games: GAMES,
    dailyLimit: GAME_CONFIG.dailyPlayLimit,
    todayPlayCount: 0,
    remainingPlays: 0,
    userPoints: 0,
    bestScores: {
      catch: 0,
      conveyor: 0,
      match: 0
    },
    powerups: GAME_POWERUPS
  },

  onLoad() {
    console.log('[GameHall] 页面加载')
    this.refreshData()
  },

  onShow() {
    console.log('[GameHall] 页面显示')
    this.refreshData()
  },

  refreshData() {
    const userInfo = app.globalData.userInfo
    const todayPlayCount = app.getTodayGamePlayCount()
    const remainingPlays = Math.max(0, GAME_CONFIG.dailyPlayLimit - todayPlayCount)

    this.setData({
      userPoints: userInfo ? userInfo.points : 0,
      todayPlayCount: todayPlayCount,
      remainingPlays: remainingPlays,
      bestScores: {
        catch: app.getGameBestScore('catch'),
        conveyor: app.getGameBestScore('conveyor'),
        match: app.getGameBestScore('match')
      }
    })
  },

  async onGameTap(e) {
    const { game } = e.currentTarget.dataset
    console.log('[GameHall] 点击游戏', game.id, game.name)

    const playCheck = app.canPlayGame(game.id)
    if (!playCheck.canPlay) {
      if (playCheck.reason === 'daily_limit') {
        const confirmed = await showModal({
          title: '今日次数已用完',
          content: `每日最多可游玩 ${GAME_CONFIG.dailyPlayLimit} 次小游戏，明天再来吧！`,
          confirmText: '我知道了',
          showCancel: false
        })
      }
      return
    }

    const pathMap = {
      catch: '/pages/game-catch/game-catch',
      conveyor: '/pages/game-conveyor/game-conveyor',
      match: '/pages/game-match/game-match'
    }

    if (pathMap[game.id]) {
      navigateTo(pathMap[game.id], { gameId: game.id })
    } else {
      showToast('游戏正在开发中')
    }
  },

  onPowerupTap(e) {
    const { powerup } = e.currentTarget.dataset
    console.log('[GameHall] 点击道具', powerup.id)

    const userInfo = app.globalData.userInfo
    if (!userInfo || userInfo.points < powerup.cost) {
      showToast(`积分不足，需要${powerup.cost}积分`)
      return
    }

    showToast(`${powerup.name} 道具将在游戏中自动使用`)
  },

  onShareAppMessage() {
    return {
      title: '垃圾分类小游戏超好玩，快来一起挑战吧！',
      path: '/pages/game-hall/game-hall'
    }
  }
})
