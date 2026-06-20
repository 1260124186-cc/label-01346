/**
 * 记忆配对游戏页面
 * @description 翻牌配对垃圾卡片与对应垃圾类别卡片
 * 支持关卡制、连击加分、道具系统
 */
const app = getApp()
const { TRASH_TYPES, GAME_CONFIG, GAME_LEVELS, getRandomSortItems } = require('../../utils/constants')
const { navigateBack, showToast, showSuccess, showModal } = require('../../utils/util')

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

    cards: [],
    firstCard: null,
    secondCard: null,
    isProcessing: false,

    score: 0,
    combo: 0,
    maxCombo: 0,
    matchedPairs: 0,
    totalPairs: 0,
    wrongAttempts: 0,
    timeLeft: 90,
    matchedFlashId: null,

    hintRemaining: 0,
    timeRemaining: 0,
    comboRemaining: 0,
    shieldRemaining: 0,
    shieldActive: false,

    showFeedback: false,
    feedbackText: '',
    feedbackType: '',

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
  _gameStartTime: 0,

  onLoad(options) {
    console.log('[GameMatch] 页面加载', options)
    const level = parseInt(options.level) || 1
    const levelInfo = GAME_LEVELS.match[Math.min(level - 1, GAME_LEVELS.match.length - 1)]
    const powerups = app.getPowerups()

    this.setData({
      currentLevel: level,
      levelInfo,
      timeLeft: levelInfo.timeLimit,
      hintRemaining: powerups.hint,
      timeRemaining: powerups.time,
      comboRemaining: powerups.combo,
      shieldRemaining: powerups.shield
    })

    wx.setNavigationBarTitle({ title: `记忆配对 · 第${level}关` })
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
  },

  shuffleArray(array) {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  },

  generateCards() {
    const levelInfo = this.data.levelInfo
    const pairCount = levelInfo.pairCount
    const items = getRandomSortItems(pairCount)

    const cards = []
    items.forEach((item, idx) => {
      const trashType = TRASH_TYPES.find(t => t.id === item.typeId)

      cards.push({
        id: `item_${idx}_${Date.now()}`,
        type: 'item',
        displayEmoji: item.emoji,
        displayText: item.name,
        matchKey: item.typeId,
        typeId: item.typeId,
        isFlipped: false,
        isMatched: false,
        color: trashType ? trashType.color : '#95A5A6'
      })

      cards.push({
        id: `type_${idx}_${Date.now()}`,
        type: 'type',
        displayEmoji: trashType ? trashType.emoji : '🗑️',
        displayText: trashType ? trashType.name : '未知',
        matchKey: item.typeId,
        typeId: item.typeId,
        isFlipped: false,
        isMatched: false,
        color: trashType ? trashType.color : '#95A5A6'
      })
    })

    return this.shuffleArray(cards)
  },

  startGame() {
    const checkResult = app.canPlayGame('match')
    if (!checkResult.canPlay) {
      showModal({
        title: '今日次数已用完',
        content: `每日最多可游玩 ${GAME_CONFIG.dailyPlayLimit} 次小游戏，明天再来吧！`,
        showCancel: false
      })
      return
    }

    app.recordGamePlay('match')

    this._gameStartTime = Date.now()
    const powerups = app.getPowerups()
    const cards = this.generateCards()
    const totalPairs = cards.length / 2

    this.setData({
      gameState: GAME_STATE.PLAYING,
      cards,
      totalPairs,
      score: 0,
      combo: 0,
      maxCombo: 0,
      matchedPairs: 0,
      wrongAttempts: 0,
      timeLeft: this.data.levelInfo.timeLimit,
      firstCard: null,
      secondCard: null,
      isProcessing: false,
      hintRemaining: powerups.hint,
      timeRemaining: powerups.time,
      comboRemaining: powerups.combo,
      shieldRemaining: powerups.shield,
      shieldActive: false
    })

    this._timer = setInterval(() => {
      const newTimeLeft = this.data.timeLeft - 1
      if (newTimeLeft <= 0) {
        this.setData({ timeLeft: 0 })
        this.endGame()
        return
      }
      this.setData({ timeLeft: newTimeLeft })
    }, 1000)
  },

  onCardTap(e) {
    if (this.data.gameState !== GAME_STATE.PLAYING || this.data.isProcessing) return

    app.recordAntiCheatGameTap('match')

    const { cardid } = e.currentTarget.dataset
    const cardIndex = this.data.cards.findIndex(c => c.id === cardid)
    if (cardIndex === -1) return

    const card = this.data.cards[cardIndex]
    if (card.isFlipped || card.isMatched) return

    const newCards = [...this.data.cards]
    newCards[cardIndex] = { ...card, isFlipped: true }
    this.setData({ cards: newCards })

    if (!this.data.firstCard) {
      this.setData({ firstCard: { id: card.id, index: cardIndex } })
      return
    }

    this.setData({
      secondCard: { id: card.id, index: cardIndex },
      isProcessing: true
    })

    setTimeout(() => this.checkMatch(), 500)
  },

  checkMatch() {
    const { firstCard, secondCard, cards } = this.data
    if (!firstCard || !secondCard) return

    const card1 = cards[firstCard.index]
    const card2 = cards[secondCard.index]

    const newCards = [...cards]

    if (card1.matchKey === card2.matchKey && card1.type !== card2.type) {
      newCards[firstCard.index] = { ...card1, isMatched: true }
      newCards[secondCard.index] = { ...card2, isMatched: true }

      let newCombo = this.data.combo + 1
      if (newCombo > this.data.maxCombo) {
        this.setData({ maxCombo: newCombo })
      }

      const comboIndex = Math.min(newCombo - 1, GAME_CONFIG.comboMultiplier.length - 1)
      const multiplier = GAME_CONFIG.comboMultiplier[comboIndex]
      let points = Math.floor(GAME_CONFIG.basePoints * 2 * multiplier)
      if (this.data.comboBoostActive) {
        points *= 2
        this.setData({ comboBoostActive: false })
      }

      const newMatchedPairs = this.data.matchedPairs + 1

      this.setData({
        cards: newCards,
        matchedPairs: newMatchedPairs,
        combo: newCombo,
        score: this.data.score + points,
        matchedFlashId: card1.id,
        showFeedback: true,
        feedbackText: `+${points}`,
        feedbackType: 'correct'
      })

      setTimeout(() => {
        this.setData({
          firstCard: null,
          secondCard: null,
          isProcessing: false,
          matchedFlashId: null,
          showFeedback: false
        })

        if (newMatchedPairs >= this.data.totalPairs) {
          setTimeout(() => this.endGame(), 300)
        }
      }, 600)
    } else {
      newCards[firstCard.index] = { ...card1, isFlipped: false }
      newCards[secondCard.index] = { ...card2, isFlipped: false }

      if (this.data.shieldActive) {
        this.setData({
          cards: newCards,
          shieldActive: false,
          showFeedback: true,
          feedbackText: '护盾已抵消',
          feedbackType: 'correct'
        })
      } else {
        const wrongCard = card1.type === 'item' ? card1 : (card2.type === 'item' ? card2 : card1)
        const correctType = TRASH_TYPES.find(t => t.id === wrongCard.typeId)
        if (correctType) {
          this.showTrashKnowledge(wrongCard, correctType)
        }

        this.setData({
          cards: newCards,
          combo: 0,
          wrongAttempts: this.data.wrongAttempts + 1,
          showFeedback: true,
          feedbackText: '不匹配',
          feedbackType: 'wrong'
        })
      }

      setTimeout(() => {
        this.setData({
          firstCard: null,
          secondCard: null,
          isProcessing: false,
          showFeedback: false
        })
      }, 400)
    }
  },

  showTrashKnowledge(card, correctType, wrongMsg) {
    const examplesText = (correctType.examples || []).slice(0, 3).map(e => `${e.icon}${e.name}`).join('、')
    showModal({
      title: `📚 垃圾分类小知识 · ${correctType.name}`,
      content: `【${card.displayEmoji} ${card.displayText || card.name || ''}】\n\n正确分类：${correctType.emoji} ${correctType.name}\n\n📖 ${correctType.description}\n\n✨ 同类示例：${examplesText}\n\n💡 ${correctType.tips && correctType.tips[0] ? correctType.tips[0] : ''}`,
      showCancel: false,
      confirmText: '我记住了'
    })
  },

  useHint() {
    if (this.data.hintRemaining <= 0) {
      showToast('道具不足，请先购买')
      return
    }

    const result = app.usePowerup('hint')
    if (!result.success) {
      showToast(result.message || '使用失败')
      return
    }

    const cards = this.data.cards
    const unmatchedCards = cards.filter(c => !c.isMatched && !c.isFlipped)

    let hintedPair = null
    for (let i = 0; i < unmatchedCards.length; i++) {
      for (let j = i + 1; j < unmatchedCards.length; j++) {
        if (unmatchedCards[i].matchKey === unmatchedCards[j].matchKey &&
            unmatchedCards[i].type !== unmatchedCards[j].type) {
          hintedPair = [unmatchedCards[i], unmatchedCards[j]]
          break
        }
      }
      if (hintedPair) break
    }

    if (hintedPair) {
      const [a, b] = hintedPair
      const newCards = cards.map(c => {
        if (c.id === a.id || c.id === b.id) {
          return { ...c, isHinted: true }
        }
        return c
      })
      this.setData({
        cards: newCards,
        hintRemaining: result.remaining
      })
      showSuccess('已标记一对匹配卡片')

      setTimeout(() => {
        const resetCards = this.data.cards.map(c => ({ ...c, isHinted: false }))
        this.setData({ cards: resetCards })
      }, 2000)
    } else {
      showToast('暂无可提示的配对')
    }
  },

  useTimeBoost() {
    if (this.data.timeRemaining <= 0) {
      showToast('道具不足，请先购买')
      return
    }

    const result = app.usePowerup('time')
    if (!result.success) {
      showToast(result.message || '使用失败')
      return
    }

    this.setData({
      timeLeft: this.data.timeLeft + 15,
      timeRemaining: result.remaining
    })
    showSuccess('+15秒')
  },

  useComboBoost() {
    if (this.data.comboBoostActive) {
      showToast('连击道具已激活')
      return
    }

    if (this.data.comboRemaining <= 0) {
      showToast('道具不足，请先购买')
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
    showSuccess('下次配对得分翻倍')
  },

  useShield() {
    if (this.data.shieldActive) {
      showToast('护盾已激活')
      return
    }

    if (this.data.shieldRemaining <= 0) {
      showToast('道具不足，请先购买')
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
    this._timer = setInterval(() => {
      const newTimeLeft = this.data.timeLeft - 1
      if (newTimeLeft <= 0) {
        this.setData({ timeLeft: 0 })
        this.endGame()
        return
      }
      this.setData({ timeLeft: newTimeLeft })
    }, 1000)
  },

  endGame() {
    this.clearTimers()

    const durationSeconds = Math.floor((Date.now() - this._gameStartTime) / 1000)
    const correct = this.data.matchedPairs
    const total = this.data.totalPairs
    const wrong = this.data.wrongAttempts
    const correctCount = correct
    const totalCount = correct + wrong
    const totalAttempts = totalCount
    const accuracy = totalAttempts > 0 ? Math.round((correct / totalAttempts) * 100) : 0

    const basePoints = this.data.score
    let bonusPoints = 0

    for (const bonus of GAME_CONFIG.passAccuracyBonus) {
      if (accuracy >= bonus.minAccuracy) {
        bonusPoints = bonus.bonus
        break
      }
    }

    const allMatched = correct >= total
    const clearBonusIndex = Math.min(this.data.currentLevel - 1, GAME_CONFIG.clearBonus.length - 1)
    const clearBonus = allMatched ? (GAME_CONFIG.clearBonus[clearBonusIndex] || 0) : 0
    bonusPoints += clearBonus

    const totalPoints = basePoints + bonusPoints
    const passed = correct >= Math.ceil(total * 0.6)

    let resultTitle = '再接再厉！'
    let resultEmoji = '💪'
    if (allMatched && wrong === 0) {
      resultTitle = '完美通关！'
      resultEmoji = '🏆'
    } else if (allMatched) {
      resultTitle = '全部配对！'
      resultEmoji = '🎉'
    } else if (accuracy >= 60) {
      resultTitle = '顺利通关！'
      resultEmoji = '👍'
    }

    let flagged = false
    if (totalPoints > 0) {
      const addResult = app.addGamePoints(totalPoints, 'match', '记忆配对', { durationSeconds, correctCount, totalCount })
      if (addResult && addResult.flagged) {
        flagged = true
      }
    }

    if (flagged) {
      resultTitle = '成绩已审核'
      resultEmoji = '⚠️'
      showToast('检测到异常操作，成绩已审核')
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
      resultFlagged: flagged
    })
  },

  onRestart() {
    this.setData({
      gameState: GAME_STATE.READY,
      showResult: false
    })
  },

  onNextLevel() {
    const nextLevel = this.data.currentLevel + 1
    if (nextLevel > GAME_LEVELS.match.length) {
      showToast('已通关所有关卡！')
      this.onBack()
      return
    }
    const levelInfo = GAME_LEVELS.match[nextLevel - 1]
    this.setData({
      currentLevel: nextLevel,
      levelInfo,
      gameState: GAME_STATE.READY,
      showResult: false,
      timeLeft: levelInfo.timeLimit
    })
    wx.setNavigationBarTitle({ title: `记忆配对 · 第${nextLevel}关` })
  },

  onBack() {
    navigateBack()
  }
})
