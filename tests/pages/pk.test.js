require('../setup')

const { PK_CONFIG, SEASON_CONFIG, ANTI_CHEAT_CONFIG } = require('../../frontend-mp/utils/constants')

describe('PK Battle Page', () => {
  let pageObj

  beforeEach(() => {
    jest.clearAllMocks()
    global.Page = jest.fn(obj => obj)
    jest.resetModules()
    require('../../frontend-mp/pages/pk-battle/pk-battle')
    pageObj = global.Page.mock.results[0].value
    pageObj.setData = jest.fn(function (data) {
      Object.assign(this.data, data)
    })
  })

  describe('data', () => {
    test('初始 phase 为 matching', () => {
      expect(pageObj.data.phase).toBe('matching')
    })

    test('初始 session 为 null', () => {
      expect(pageObj.data.session).toBeNull()
    })

    test('初始 currentQuestionIndex 为 0', () => {
      expect(pageObj.data.currentQuestionIndex).toBe(0)
    })

    test('初始 timeLeft 为 10', () => {
      expect(pageObj.data.timeLeft).toBe(10)
    })

    test('初始 totalQuestions 为 5', () => {
      expect(pageObj.data.totalQuestions).toBe(5)
    })

    test('初始 correctCount 为 0', () => {
      expect(pageObj.data.correctCount).toBe(0)
    })

    test('初始 isAnswered 为 false', () => {
      expect(pageObj.data.isAnswered).toBe(false)
    })

    test('初始 selectedIndex 为 -1', () => {
      expect(pageObj.data.selectedIndex).toBe(-1)
    })
  })

  describe('initPK', () => {
    test('调用 app.startPK', () => {
      const app = getApp()
      pageObj.initPK()
      expect(app.startPK).toHaveBeenCalled()
    })

    test('匹配成功时设置 session 和 opponent', () => {
      const app = getApp()
      pageObj.initPK()
      expect(pageObj.setData).toHaveBeenCalledWith(
        expect.objectContaining({
          session: expect.any(Object),
          opponent: expect.any(Object)
        })
      )
    })
  })

  describe('startBattle', () => {
    test('设置 phase 为 battle 并加载第一题', () => {
      const app = getApp()
      pageObj.initPK()

      const session = app.globalData.currentPKSession
      pageObj.data.session = session
      pageObj.startBattle()

      expect(pageObj.setData).toHaveBeenCalledWith(
        expect.objectContaining({
          phase: 'battle',
          currentQuestionIndex: 0
        })
      )
    })
  })

  describe('onSelectOption', () => {
    test('答题后调用 app.submitPKAnswer', () => {
      const app = getApp()
      pageObj.initPK()

      const session = app.globalData.currentPKSession
      pageObj.data.session = session
      pageObj.data.currentQuestion = session.questions[0]
      pageObj.data.phase = 'battle'
      pageObj.data.isAnswered = false
      pageObj.data.questionStartTime = Date.now()

      pageObj.onSelectOption({ currentTarget: { dataset: { index: 0 } } })

      expect(app.submitPKAnswer).toHaveBeenCalled()
    })

    test('已答题后不再处理', () => {
      const app = getApp()
      pageObj.data.isAnswered = true
      pageObj.onSelectOption({ currentTarget: { dataset: { index: 0 } } })
      expect(app.submitPKAnswer).not.toHaveBeenCalled()
    })
  })

  describe('stopTimer', () => {
    test('清除计时器', () => {
      const mockTimer = 123
      pageObj.data.timer = mockTimer
      pageObj.stopTimer()
      expect(pageObj.setData).toHaveBeenCalledWith({ timer: null })
    })

    test('没有计时器时不报错', () => {
      pageObj.data.timer = null
      expect(() => pageObj.stopTimer()).not.toThrow()
    })
  })

  describe('onUnload', () => {
    test('停止计时器', () => {
      pageObj.data.timer = 999
      pageObj.onUnload()
      expect(pageObj.setData).toHaveBeenCalledWith({ timer: null })
    })
  })
})

describe('PK Result Page', () => {
  let pageObj

  beforeEach(() => {
    jest.clearAllMocks()
    global.Page = jest.fn(obj => obj)
    jest.resetModules()
    require('../../frontend-mp/pages/pk-result/pk-result')
    pageObj = global.Page.mock.results[0].value
    pageObj.setData = jest.fn(function (data) {
      Object.assign(this.data, data)
    })
  })

  describe('data', () => {
    test('初始 result 为 win', () => {
      expect(pageObj.data.result).toBe('win')
    })

    test('初始 pointsEarned 为 0', () => {
      expect(pageObj.data.pointsEarned).toBe(0)
    })

    test('初始 myCorrectCount 为 0', () => {
      expect(pageObj.data.myCorrectCount).toBe(0)
    })

    test('初始 totalQuestions 为 5', () => {
      expect(pageObj.data.totalQuestions).toBe(5)
    })
  })

  describe('onLoad', () => {
    test('胜利时设置正确的结果配置', () => {
      pageObj.onLoad({
        result: 'win',
        pointsEarned: '30',
        myCorrectCount: '4',
        opponentCorrectCount: '2',
        totalQuestions: '5',
        myTotalTime: '15000',
        opponentTotalTime: '25000',
        opponentName: '环保大师',
        opponentAvatarEmoji: '🏆'
      })

      expect(pageObj.setData).toHaveBeenCalledWith(
        expect.objectContaining({
          result: 'win',
          resultEmoji: '🏆',
          resultTitle: '胜利',
          resultColor: '#5BBD72'
        })
      )
    })

    test('失败时设置正确的结果配置', () => {
      pageObj.onLoad({
        result: 'lose',
        pointsEarned: '5',
        myCorrectCount: '1',
        opponentCorrectCount: '4',
        totalQuestions: '5'
      })

      expect(pageObj.setData).toHaveBeenCalledWith(
        expect.objectContaining({
          result: 'lose',
          resultEmoji: '💪',
          resultTitle: '失败'
        })
      )
    })

    test('平局时设置正确的结果配置', () => {
      pageObj.onLoad({
        result: 'draw',
        pointsEarned: '15',
        myCorrectCount: '3',
        opponentCorrectCount: '3',
        totalQuestions: '5'
      })

      expect(pageObj.setData).toHaveBeenCalledWith(
        expect.objectContaining({
          result: 'draw',
          resultEmoji: '🤝',
          resultTitle: '平局',
          resultColor: '#4A90D9'
        })
      )
    })

    test('计算正确率', () => {
      pageObj.onLoad({
        result: 'win',
        pointsEarned: '30',
        myCorrectCount: '4',
        opponentCorrectCount: '2',
        totalQuestions: '5'
      })

      expect(pageObj.setData).toHaveBeenCalledWith(
        expect.objectContaining({
          myAccuracy: '80%',
          opponentAccuracy: '40%'
        })
      )
    })
  })

  describe('awardPoints', () => {
    test('有积分时调用 app.updateUserPoints', () => {
      const app = getApp()
      pageObj.data.pointsEarned = 30
      pageObj.data.result = 'win'
      pageObj.data.resultTitle = '胜利'
      pageObj.awardPoints()
      expect(app.updateUserPoints).toHaveBeenCalledWith(30, expect.objectContaining({
        category: 'pk'
      }))
    })

    test('积分为0时不调用 app.updateUserPoints', () => {
      const app = getApp()
      pageObj.data.pointsEarned = 0
      pageObj.awardPoints()
      expect(app.updateUserPoints).not.toHaveBeenCalled()
    })
  })

  describe('onPlayAgain', () => {
    test('跳转到 PK 对战页面', () => {
      pageObj.onPlayAgain()
      expect(wx.redirectTo).toHaveBeenCalledWith({
        url: '/pages/pk-battle/pk-battle'
      })
    })
  })

  describe('onViewLeaderboard', () => {
    test('跳转到排行榜页面', () => {
      pageObj.onViewLeaderboard()
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/leaderboard/leaderboard'
      })
    })
  })

  describe('onShareAppMessage', () => {
    test('返回分享信息', () => {
      pageObj.data.result = 'win'
      pageObj.data.resultTitle = '胜利'
      pageObj.data.opponentName = '环保大师'
      const shareInfo = pageObj.onShareAppMessage()
      expect(shareInfo.title).toContain('胜利')
      expect(shareInfo.path).toBe('/pages/index/index')
    })
  })

  describe('formatTime', () => {
    test('小于60秒显示秒', () => {
      expect(pageObj.formatTime(45)).toBe('45秒')
    })

    test('0秒显示0秒', () => {
      expect(pageObj.formatTime(0)).toBe('0秒')
    })

    test('大于60秒显示分秒', () => {
      expect(pageObj.formatTime(125)).toBe('2分5秒')
    })

    test('整数分钟不显示秒', () => {
      expect(pageObj.formatTime(120)).toBe('2分')
    })
  })
})

describe('PK Config', () => {
  test('PK_CONFIG.questionCount 为 5', () => {
    expect(PK_CONFIG.questionCount).toBe(5)
  })

  test('PK_CONFIG.timePerQuestion 为 10', () => {
    expect(PK_CONFIG.timePerQuestion).toBe(10)
  })

  test('PK_CONFIG.winPoints 大于 drawPoints 大于 losePoints', () => {
    expect(PK_CONFIG.winPoints).toBeGreaterThan(PK_CONFIG.drawPoints)
    expect(PK_CONFIG.drawPoints).toBeGreaterThan(PK_CONFIG.losePoints)
  })

  test('PK_CONFIG.maxDailyPK 为 10', () => {
    expect(PK_CONFIG.maxDailyPK).toBe(10)
  })

  test('PK_CONFIG.sameOpponentMaxPerDay 为 2', () => {
    expect(PK_CONFIG.sameOpponentMaxPerDay).toBe(2)
  })
})

describe('Season Config', () => {
  test('赛季持续30天', () => {
    expect(SEASON_CONFIG.seasonDurationDays).toBe(30)
  })

  test('赛季重置维度包含 points、accuracy、classifyCount', () => {
    expect(SEASON_CONFIG.resetDimensions).toContain('points')
    expect(SEASON_CONFIG.resetDimensions).toContain('accuracy')
    expect(SEASON_CONFIG.resetDimensions).toContain('classifyCount')
  })

  test('赛季保留维度包含 streakDays', () => {
    expect(SEASON_CONFIG.keepDimensions).toContain('streakDays')
  })

  test('赛季前三名奖励配置', () => {
    expect(SEASON_CONFIG.seasonTopReward[1]).toBe(500)
    expect(SEASON_CONFIG.seasonTopReward[2]).toBe(300)
    expect(SEASON_CONFIG.seasonTopReward[3]).toBe(200)
  })
})

describe('Anti-Cheat Config', () => {
  test('每小时最大积分限制', () => {
    expect(ANTI_CHEAT_CONFIG.maxScorePerHour).toBe(500)
  })

  test('每小时最大PK次数限制', () => {
    expect(ANTI_CHEAT_CONFIG.maxPKPerHour).toBe(6)
  })

  test('最短答题时间限制', () => {
    expect(ANTI_CHEAT_CONFIG.minAnswerTime).toBe(1500)
  })

  test('异常正确率阈值', () => {
    expect(ANTI_CHEAT_CONFIG.abnormalAccuracyThreshold).toBe(98)
  })

  test('同一对手冷却时间', () => {
    expect(ANTI_CHEAT_CONFIG.sameOpponentCooldown).toBe(300000)
  })
})

describe('App Leaderboard & PK Methods', () => {
  let app

  beforeEach(() => {
    app = getApp()
  })

  describe('getLeaderboard', () => {
    test('返回包含 list、myRank、myData 的结果', () => {
      const result = app.getLeaderboard('week', 'points')
      expect(result).toHaveProperty('list')
      expect(result).toHaveProperty('myRank')
      expect(result).toHaveProperty('myData')
    })

    test('排行榜按指定维度降序排列', () => {
      const result = app.getLeaderboard('total', 'points')
      const list = result.list
      for (let i = 0; i < list.length - 1; i++) {
        expect(list[i].points).toBeGreaterThanOrEqual(list[i + 1].points)
      }
    })

    test('每个用户都有 rank 属性', () => {
      const result = app.getLeaderboard('week', 'points')
      result.list.forEach((user, index) => {
        expect(user.rank).toBe(index + 1)
      })
    })

    test('当前用户在列表中标记为 isCurrentUser', () => {
      const result = app.getLeaderboard('total', 'points')
      const currentUser = result.list.find(u => u.isCurrentUser)
      expect(currentUser).toBeDefined()
    })
  })

  describe('getCurrentUserStats', () => {
    test('返回包含 points、accuracy、classifyCount、streakDays 的统计', () => {
      const stats = app.getCurrentUserStats()
      expect(stats).toHaveProperty('points')
      expect(stats).toHaveProperty('accuracy')
      expect(stats).toHaveProperty('classifyCount')
      expect(stats).toHaveProperty('streakDays')
    })
  })

  describe('PK flow', () => {
    test('startPK 返回成功和会话信息', () => {
      const result = app.startPK()
      expect(result.success).toBe(true)
      expect(result.session).toBeDefined()
      expect(result.opponent).toBeDefined()
    })

    test('submitPKAnswer 返回答题结果', () => {
      app.startPK()
      const session = app.globalData.currentPKSession
      const result = app.submitPKAnswer(0, 0, 3000)
      expect(result).toHaveProperty('success')
      expect(result).toHaveProperty('isCorrect')
    })

    test('finishPK 返回 PK 结果', () => {
      app.startPK()
      const session = app.globalData.currentPKSession
      for (let i = 0; i < 5; i++) {
        app.submitPKAnswer(i, 0, 3000)
      }
      const result = app.finishPK()
      expect(result.success).toBe(true)
      expect(result.pkResult).toHaveProperty('result')
      expect(result.pkResult).toHaveProperty('pointsEarned')
    })

    test('finishPK 记录 PK 记录', () => {
      app.startPK()
      for (let i = 0; i < 5; i++) {
        app.submitPKAnswer(i, 0, 3000)
      }
      app.finishPK()
      expect(app.addPKRecord).toHaveBeenCalled()
    })
  })

  describe('getSeasonInfo', () => {
    test('返回赛季信息', () => {
      const info = app.getSeasonInfo()
      expect(info).toHaveProperty('seasonId')
      expect(info).toHaveProperty('seasonName')
      expect(info).toHaveProperty('daysRemaining')
      expect(info).toHaveProperty('medals')
      expect(info).toHaveProperty('vouchers')
    })
  })

  describe('checkAntiCheat', () => {
    test('正常情况下通过检查', () => {
      const result = app.checkAntiCheat()
      expect(result.passed).toBe(true)
    })
  })

  describe('getDailyPKCount', () => {
    test('返回今日PK次数', () => {
      const count = app.getDailyPKCount()
      expect(typeof count).toBe('number')
    })
  })

  describe('getSameOpponentCountToday', () => {
    test('返回今日与某对手PK次数', () => {
      const count = app.getSameOpponentCountToday('lb_u1')
      expect(typeof count).toBe('number')
    })
  })
})
