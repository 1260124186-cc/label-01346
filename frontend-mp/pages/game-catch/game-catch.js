/**
 * 接垃圾游戏页面
 * @description 物品从屏幕顶部下落，玩家左右滑动控制篮子接住并分类到对应垃圾桶
 * 支持关卡制、连击加分、道具系统
 */
const app = getApp()
const { TRASH_TYPES, GAME_CONFIG, GAME_LEVELS, getRandomSortItems } = require('../../utils/constants')
const { navigateBack, showToast, showSuccess, showModal, formatNumber } = require('../../utils/util')

const BASKET_ZONES = [0, 1, 2, 3]
const GAME_STATE = {
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  RESULT: 'result'
}

Page({
  data: {
    gameState: GAME_STATE.READY,
    currentLevel: 1,
    levelInfo: null,
    trashTypes: TRASH_TYPES,

    fallingItems: [],
    basketZone: 1,
    basketX: 0,

    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    wrongCount: 0,
    missedCount: 0,
    timeLeft: 60,
    totalItems: 0,
    processedItems: 0,

    hintRemaining: 0,
    timeRemaining: 0,
    comboRemaining: 0,
    shieldRemaining: 0,
    comboBoostActive: false,
    shieldActive: false,
    showFeedback: false,
    feedbackText: '',
    feedbackType: '',
    feedbackX: 0,
    feedbackY: 0,

    screenWidth: 375,
    screenHeight: 667,
    basketWidth: 120,
    zoneWidth: 0,

    showResult: false,
    resultTitle: '',
    resultEmoji: '',
    resultScore: 0,
    resultBasePoints: 0,
    resultBonusPoints: 0,
    resultTotalPoints: 0,
    resultAccuracy: 0,
    resultPassed: false,
    resultFlagged: false
  },

  _timer: null,
  _spawnTimer: null,
  _animationFrame: null,
  _startTouchX: 0,
  _lastTime: 0,
  _gameStartTime: 0,

  onLoad(options) {
    console.log('[GameCatch] 页面加载', options)
    const systemInfo = wx.getSystemInfoSync()
    const screenWidth = systemInfo.windowWidth
    const screenHeight = systemInfo.windowHeight
    const basketWidth = Math.floor(screenWidth / 4 - 10)
    const zoneWidth = Math.floor(screenWidth / 4)

    const level = parseInt(options.level) || 1
    const levelInfo = GAME_LEVELS.catch[Math.min(level - 1, GAME_LEVELS.catch.length - 1)]

    const powerups = app.getPowerups()

    this.setData({
      screenWidth,
      screenHeight,
      basketWidth,
      zoneWidth,
      currentLevel: level,
      levelInfo,
      basketZone: 1,
      basketX: zoneWidth * 1 + zoneWidth / 2 - basketWidth / 2,
      timeLeft: levelInfo.timeLimit,
      totalItems: levelInfo.itemCount,
      hintRemaining: powerups.hint,
      timeRemaining: powerups.time,
      comboRemaining: powerups.combo,
      shieldRemaining: powerups.shield
    })

    wx.setNavigationBarTitle({ title: `接垃圾 · 第${level}关` })
  },

  onUnload() {
    this.clearTimers()
  },

  onHide() {
    if (this.data.gameState === GAME_STATE.PLAYING) {
      this.pauseGame()
    }
  },

  clearTimers() {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
    if (this._spawnTimer) {
      clearInterval(this._spawnTimer)
      this._spawnTimer = null
    }
    if (this._animationFrame) {
      cancelAnimationFrame(this._animationFrame)
      this._animationFrame = null
    }
  },

  startGame() {
    const checkResult = app.canPlayGame('catch')
    if (!checkResult.canPlay) {
      showModal({
        title: '今日次数已用完',
        content: `每日最多可游玩 ${GAME_CONFIG.dailyPlayLimit} 次小游戏，明天再来吧！`,
        showCancel: false
      })
      return
    }

    app.recordGamePlay('catch')
    this._gameStartTime = Date.now()

    const powerups = app.getPowerups()

    this.setData({
      gameState: GAME_STATE.PLAYING,
      fallingItems: [],
      score: 0,
      combo: 0,
      maxCombo: 0,
      correctCount: 0,
      wrongCount: 0,
      missedCount: 0,
      timeLeft: this.data.levelInfo.timeLimit,
      processedItems: 0,
      comboBoostActive: false,
      shieldActive: false,
      hintRemaining: powerups.hint,
      timeRemaining: powerups.time,
      comboRemaining: powerups.combo,
      shieldRemaining: powerups.shield
    })

    this.startTimers()
  },

  startTimers() {
    const levelInfo = this.data.levelInfo

    this._timer = setInterval(() => {
      const newTimeLeft = this.data.timeLeft - 1
      if (newTimeLeft <= 0) {
        this.setData({ timeLeft: 0 })
        this.endGame()
        return
      }
      this.setData({ timeLeft: newTimeLeft })
    }, 1000)

    this._spawnTimer = setInterval(() => {
      this.spawnItem()
    }, levelInfo.spawnInterval)

    this._lastTime = Date.now()
    this.gameLoop()
  },

  gameLoop() {
    const now = Date.now()
    const delta = (now - this._lastTime) / 16.67
    this._lastTime = now

    const fallSpeed = this.data.levelInfo.fallSpeed
    const screenHeight = this.data.screenHeight
    const zoneWidth = this.data.zoneWidth

    const updatedItems = []
    let missedThisFrame = 0

    this.data.fallingItems.forEach(item => {
      const newY = item.y + fallSpeed * delta

      if (newY > screenHeight - 180) {
        if (!item.caught) {
          missedThisFrame++
        }
        return
      }

      updatedItems.push({
        ...item,
        y: newY
      })
    })

    if (missedThisFrame > 0) {
      this.setData({
        missedCount: this.data.missedCount + missedThisFrame,
        combo: 0,
        processedItems: this.data.processedItems + missedThisFrame
      })
    }

    this.setData({ fallingItems: updatedItems })

    if (this.data.gameState === GAME_STATE.PLAYING) {
      this._animationFrame = requestAnimationFrame(() => this.gameLoop())
    }
  },

  spawnItem() {
    if (this.data.processedItems >= this.data.totalItems) {
      return
    }

    const items = getRandomSortItems(1)
    if (items.length === 0) return

    const item = items[0]
    const zoneWidth = this.data.zoneWidth
    const screenWidth = this.data.screenWidth
    const randomZone = Math.floor(Math.random() * 4)
    const startX = randomZone * zoneWidth + (zoneWidth - 80) / 2

    const newItem = {
      id: Date.now() + '_' + Math.random(),
      name: item.name,
      emoji: item.emoji,
      typeId: item.typeId,
      zone: randomZone,
      x: startX,
      y: -80,
      caught: false,
      isHinted: false
    }

    this.setData({
      fallingItems: [...this.data.fallingItems, newItem]
    })
  },

  onTouchStart(e) {
    if (this.data.gameState !== GAME_STATE.PLAYING) return
    this._startTouchX = e.touches[0].clientX
  },

  onTouchMove(e) {
    if (this.data.gameState !== GAME_STATE.PLAYING) return

    const currentX = e.touches[0].clientX
    const deltaX = currentX - this._startTouchX
    const threshold = 40

    if (Math.abs(deltaX) >= threshold) {
      const direction = deltaX > 0 ? 1 : -1
      const newZone = Math.max(0, Math.min(3, this.data.basketZone + direction))
      if (newZone !== this.data.basketZone) {
        this.moveBasket(newZone)
      }
      this._startTouchX = currentX
    }
  },

  onZoneTap(e) {
    if (this.data.gameState !== GAME_STATE.PLAYING) return
    const { zone } = e.currentTarget.dataset
    this.moveBasket(parseInt(zone))
  },

  moveBasket(zone) {
    const zoneWidth = this.data.zoneWidth
    const basketWidth = this.data.basketWidth
    const basketX = zone * zoneWidth + zoneWidth / 2 - basketWidth / 2

    this.setData({
      basketZone: zone,
      basketX
    })

    app.recordAntiCheatGameTap('catch')
    this.checkCatch(zone)
  },

  checkCatch(basketZone) {
    const screenHeight = this.data.screenHeight
    const catchZoneTop = screenHeight - 260
    const catchZoneBottom = screenHeight - 120

    let caughtItem = null
    let caughtIndex = -1

    const items = this.data.fallingItems
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item.caught && item.zone === basketZone && item.y >= catchZoneTop && item.y <= catchZoneBottom) {
        caughtItem = item
        caughtIndex = i
        break
      }
    }

    if (caughtItem) {
      this.handleCatch(caughtItem, caughtIndex)
    }
  },

  handleCatch(item, index) {
    const basketType = TRASH_TYPES[this.data.basketZone]
    const isCorrect = item.typeId === basketType.id

    const newItems = [...this.data.fallingItems]
    newItems.splice(index, 1)

    let shieldUsed = false
    let actualCorrect = isCorrect
    let actualWrongCount = this.data.wrongCount
    let actualCorrectCount = this.data.correctCount
    let actualScoreDelta = 0

    if (!isCorrect && this.data.shieldActive) {
      shieldUsed = true
      actualCorrect = true
      this.setData({ shieldActive: false, shieldRemaining: this.data.shieldRemaining })
    }

    let newCombo = actualCorrect ? this.data.combo + 1 : 0
    if (newCombo > this.data.maxCombo) {
      this.setData({ maxCombo: newCombo })
    }

    let points = 0
    if (actualCorrect) {
      const comboIndex = Math.min(newCombo - 1, GAME_CONFIG.comboMultiplier.length - 1)
      const multiplier = GAME_CONFIG.comboMultiplier[comboIndex]
      points = Math.floor(GAME_CONFIG.basePoints * multiplier)
      if (this.data.comboBoostActive) {
        points *= 2
        this.setData({ comboBoostActive: false })
      }
      actualCorrectCount = this.data.correctCount + 1
      actualScoreDelta = points
    } else {
      actualWrongCount = this.data.wrongCount + 1
    }

    this.setData({
      fallingItems: newItems,
      combo: newCombo,
      correctCount: actualCorrectCount,
      wrongCount: actualWrongCount,
      score: this.data.score + actualScoreDelta,
      processedItems: this.data.processedItems + 1,
      showFeedback: true,
      feedbackText: shieldUsed ? '🛡️护盾抵消' : (actualCorrect ? `+${points}` : '错误'),
      feedbackType: shieldUsed ? 'shield' : (actualCorrect ? 'correct' : 'wrong'),
      feedbackX: item.x,
      feedbackY: item.y
    })

    setTimeout(() => {
      this.setData({ showFeedback: false })
    }, 600)

    if (!isCorrect && !shieldUsed) {
      const correctType = TRASH_TYPES.find(t => t.id === item.typeId)
      const wrongType = basketType
      this.showTrashKnowledge(item, correctType, wrongType)
    }

    if (this.data.processedItems >= this.data.totalItems) {
      setTimeout(() => this.endGame(), 500)
    }
  },

  showTrashKnowledge(item, correctType, wrongType) {
    if (!correctType) return
    const examplesText = (correctType.examples || []).slice(0, 3).map(e => `${e.icon}${e.name}`).join('、')
    showModal({
      title: `📚 垃圾分类小知识 · ${correctType.name}`,
      content: `【${item.emoji} ${item.name}】\n\n正确分类：${correctType.emoji} ${correctType.name}\n你选的是：${wrongType ? wrongType.emoji + ' ' + wrongType.name : '未知'}\n\n📖 ${correctType.description}\n\n✨ 同类示例：${examplesText}\n\n💡 投放提示：${correctType.tips && correctType.tips[0] ? correctType.tips[0] : ''}`,
      showCancel: false,
      confirmText: '我记住了'
    })
  },

  useHint() {
    if (this.data.hintRemaining <= 0) {
      showToast('提示道具不足，请先购买')
      return
    }
    const result = app.usePowerup('hint')
    if (!result.success) {
      showToast(result.message || '使用失败')
      return
    }

    const items = this.data.fallingItems
    if (items.length > 0) {
      const targetItem = items[0]
      const correctZone = TRASH_TYPES.findIndex(t => t.id === targetItem.typeId)
      const updatedItems = items.map((it, idx) => 
        idx === 0 ? { ...it, isHinted: true, hintedZone: correctZone } : it
      )
      this.setData({
        fallingItems: updatedItems,
        hintRemaining: result.remaining
      })
      showToast(`请投到第${correctZone + 1}个桶`)
    } else {
      showToast('暂无可提示物品')
    }
  },

  useTimeBoost() {
    if (this.data.timeRemaining <= 0) {
      showToast('加时道具不足，请先购买')
      return
    }
    const result = app.usePowerup('time')
    if (!result.success) {
      showToast(result.message || '使用失败')
      return
    }
    this.setData({
      timeLeft: this.data.timeLeft + 10,
      timeRemaining: result.remaining
    })
    showSuccess('+10秒')
  },

  useComboBoost() {
    if (this.data.comboBoostActive) {
      showToast('连击道具已激活')
      return
    }
    if (this.data.comboRemaining <= 0) {
      showToast('连击道具不足，请先购买')
      return
    }
    const result = app.usePowerup('combo')
    if (!result.success) {
      showToast(result.message || '使用失败')
      return
    }
    this.setData({ 
      comboBoostActive: true,
      comboRemaining: result.remaining
    })
    showSuccess('下次得分翻倍')
  },

  useShield() {
    if (this.data.shieldActive) {
      showToast('护盾已激活')
      return
    }
    if (this.data.shieldRemaining <= 0) {
      showToast('护盾道具不足，请先购买')
      return
    }
    const result = app.usePowerup('shield')
    if (!result.success) {
      showToast(result.message || '使用失败')
      return
    }
    this.setData({
      shieldActive: true,
      shieldRemaining: result.remaining
    })
    showSuccess('护盾已激活，下次错误不扣分')
  },

  pauseGame() {
    this.clearTimers()
    this.setData({ gameState: GAME_STATE.PAUSED })
  },

  resumeGame() {
    this.setData({ gameState: GAME_STATE.PLAYING })
    this.startTimers()
  },

  endGame() {
    this.clearTimers()

    const correct = this.data.correctCount
    const wrong = this.data.wrongCount
    const missed = this.data.missedCount
    const total = correct + wrong + missed
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
    const durationSeconds = this._gameStartTime
      ? Math.max(1, Math.floor((Date.now() - this._gameStartTime) / 1000))
      : this.data.levelInfo.timeLimit

    const basePoints = this.data.score
    let bonusPoints = 0

    for (const bonus of GAME_CONFIG.passAccuracyBonus) {
      if (accuracy >= bonus.minAccuracy) {
        bonusPoints = bonus.bonus
        break
      }
    }

    const clearBonusIndex = Math.min(this.data.currentLevel - 1, GAME_CONFIG.clearBonus.length - 1)
    const clearBonus = accuracy >= 60 ? (GAME_CONFIG.clearBonus[clearBonusIndex] || 0) : 0
    bonusPoints += clearBonus

    const totalPoints = basePoints + bonusPoints
    const passed = accuracy >= 60 && correct >= Math.floor(total * 0.5)

    let resultTitle = '再接再厉！'
    let resultEmoji = '💪'
    if (accuracy >= 90) {
      resultTitle = '完美通关！'
      resultEmoji = '🏆'
    } else if (accuracy >= 80) {
      resultTitle = '表现优秀！'
      resultEmoji = '🎉'
    } else if (accuracy >= 60) {
      resultTitle = '顺利通关！'
      resultEmoji = '👍'
    }

    let resultFlagged = false
    if (totalPoints > 0) {
      const addResult = app.addGamePoints(totalPoints, 'catch', '接垃圾', {
        durationSeconds,
        correctCount: correct,
        totalCount: total
      })
      resultFlagged = !!addResult.flagged
      if (resultFlagged) {
        resultTitle = '成绩已审核'
        resultEmoji = '⚠️'
      }
    }

    this.setData({
      gameState: GAME_STATE.RESULT,
      showResult: true,
      resultTitle,
      resultEmoji,
      resultScore: this.data.score,
      resultBasePoints: basePoints,
      resultBonusPoints: bonusPoints,
      resultTotalPoints: totalPoints,
      resultAccuracy: accuracy,
      resultPassed: passed,
      resultFlagged
    })

    if (resultFlagged) {
      showToast({ title: '检测到异常操作，成绩已审核', icon: 'none' })
    }
  },

  onRestart() {
    this.setData({
      gameState: GAME_STATE.READY,
      showResult: false
    })
  },

  onNextLevel() {
    const nextLevel = this.data.currentLevel + 1
    if (nextLevel > GAME_LEVELS.catch.length) {
      showToast('已通关所有关卡！')
      this.onBack()
      return
    }
    const levelInfo = GAME_LEVELS.catch[nextLevel - 1]
    this.setData({
      currentLevel: nextLevel,
      levelInfo,
      gameState: GAME_STATE.READY,
      showResult: false,
      timeLeft: levelInfo.timeLimit,
      totalItems: levelInfo.itemCount
    })
    wx.setNavigationBarTitle({ title: `接垃圾 · 第${nextLevel}关` })
  },

  onBack() {
    navigateBack()
  }
})
