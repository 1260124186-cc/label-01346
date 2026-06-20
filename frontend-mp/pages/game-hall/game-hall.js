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
    powerups: GAME_POWERUPS,
    userPowerups: { hint: 0, time: 0, combo: 0, shield: 0 },
    showShopModal: false,
    currentPowerup: null,
    purchaseQuantity: 1
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
    const userPowerups = app.getPowerups()

    this.setData({
      userPoints: userInfo ? userInfo.points : 0,
      todayPlayCount: todayPlayCount,
      remainingPlays: remainingPlays,
      bestScores: {
        catch: app.getGameBestScore('catch'),
        conveyor: app.getGameBestScore('conveyor'),
        match: app.getGameBestScore('match')
      },
      userPowerups
    })
  },

  async onGameTap(e) {
    const { game } = e.currentTarget.dataset
    console.log('[GameHall] 点击游戏', game.id, game.name)

    const playCheck = app.canPlayGame(game.id)
    if (!playCheck.canPlay) {
      if (playCheck.reason === 'daily_limit') {
        await showModal({
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
    this.setData({
      showShopModal: true,
      currentPowerup: powerup,
      purchaseQuantity: 1
    })
  },

  onCloseShop() {
    this.setData({ showShopModal: false, currentPowerup: null })
  },

  onQuantityChange(e) {
    const { delta } = e.currentTarget.dataset
    let qty = this.data.purchaseQuantity + parseInt(delta)
    qty = Math.max(1, Math.min(10, qty))
    this.setData({ purchaseQuantity: qty })
  },

  async onConfirmPurchase() {
    const { currentPowerup, purchaseQuantity } = this.data
    if (!currentPowerup) return

    const totalCost = currentPowerup.cost * purchaseQuantity
    const userInfo = app.globalData.userInfo
    if (!userInfo || userInfo.points < totalCost) {
      showToast(`积分不足，需要${totalCost}积分`)
      return
    }

    const confirmResult = await showModal({
      title: '确认购买',
      content: `花费 ${totalCost} 积分购买 ${currentPowerup.name} x ${purchaseQuantity} ？`,
      confirmText: '确认购买',
      cancelText: '再想想'
    })
    if (!confirmResult) return

    const result = app.buyPowerup(currentPowerup.id, purchaseQuantity)
    if (result.success) {
      this.refreshData()
      showToast(`购买成功！当前持有 ${result.count} 个`)
      this.setData({ showShopModal: false, currentPowerup: null })
    } else {
      showToast(result.message || '购买失败')
    }
  },

  onShareAppMessage() {
    return {
      title: '垃圾分类小游戏超好玩，快来一起挑战吧！',
      path: '/pages/game-hall/game-hall'
    }
  }
})
