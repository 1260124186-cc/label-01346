require('../setup')

const { LEADERBOARD_CONFIG, LEADERBOARD_USERS } = require('../../frontend-mp/utils/constants')

describe('Leaderboard Page', () => {
  let pageObj

  beforeEach(() => {
    jest.clearAllMocks()
    global.Page = jest.fn(obj => obj)
    jest.resetModules()
    require('../../frontend-mp/pages/leaderboard/leaderboard')
    pageObj = global.Page.mock.results[0].value
    pageObj.setData = jest.fn(function (data) {
      Object.assign(this.data, data)
    })
  })

  describe('data', () => {
    test('包含 periods 来自 LEADERBOARD_CONFIG', () => {
      expect(pageObj.data.periods).toStrictEqual(LEADERBOARD_CONFIG.periods)
    })

    test('包含 dimensions 来自 LEADERBOARD_CONFIG', () => {
      expect(pageObj.data.dimensions).toStrictEqual(LEADERBOARD_CONFIG.dimensions)
    })

    test('初始 currentPeriod 为 week', () => {
      expect(pageObj.data.currentPeriod).toBe('week')
    })

    test('初始 currentDimension 为 points', () => {
      expect(pageObj.data.currentDimension).toBe('points')
    })

    test('初始 leaderboardList 为空数组', () => {
      expect(pageObj.data.leaderboardList).toEqual([])
    })

    test('初始 myRank 为 0', () => {
      expect(pageObj.data.myRank).toBe(0)
    })

    test('初始 myData 为 null', () => {
      expect(pageObj.data.myData).toBeNull()
    })

    test('初始 seasonInfo 为 null', () => {
      expect(pageObj.data.seasonInfo).toBeNull()
    })
  })

  describe('onLoad', () => {
    test('调用 loadSeasonInfo 和 loadLeaderboard', () => {
      const app = getApp()
      pageObj.onLoad()
      expect(app.getSeasonInfo).toHaveBeenCalled()
      expect(app.getLeaderboard).toHaveBeenCalled()
    })
  })

  describe('onShow', () => {
    test('刷新排行榜和赛季信息', () => {
      const app = getApp()
      pageObj.onShow()
      expect(app.getSeasonInfo).toHaveBeenCalled()
      expect(app.getLeaderboard).toHaveBeenCalled()
    })
  })

  describe('onPeriodTap', () => {
    test('切换周期并重新加载排行榜', () => {
      pageObj.onPeriodTap({ currentTarget: { dataset: { id: 'month' } } })
      expect(pageObj.setData).toHaveBeenCalledWith({ currentPeriod: 'month' })
    })

    test('点击当前周期不做操作', () => {
      pageObj.onPeriodTap({ currentTarget: { dataset: { id: 'week' } } })
      expect(pageObj.setData).not.toHaveBeenCalled()
    })
  })

  describe('onDimensionTap', () => {
    test('切换维度并重新加载排行榜', () => {
      pageObj.onDimensionTap({ currentTarget: { dataset: { id: 'accuracy' } } })
      expect(pageObj.setData).toHaveBeenCalledWith({ currentDimension: 'accuracy' })
    })

    test('点击当前维度不做操作', () => {
      pageObj.onDimensionTap({ currentTarget: { dataset: { id: 'points' } } })
      expect(pageObj.setData).not.toHaveBeenCalled()
    })
  })

  describe('loadLeaderboard', () => {
    test('调用 app.getLeaderboard 传入当前周期和维度', () => {
      const app = getApp()
      pageObj.loadLeaderboard()
      expect(app.getLeaderboard).toHaveBeenCalledWith('week', 'points')
    })

    test('设置 leaderboardList 和 myRank', () => {
      pageObj.loadLeaderboard()
      const setDataCalls = pageObj.setData.mock.calls
      const lastCall = setDataCalls[setDataCalls.length - 1]
      expect(lastCall[0]).toHaveProperty('leaderboardList')
      expect(lastCall[0]).toHaveProperty('myRank')
    })
  })

  describe('loadSeasonInfo', () => {
    test('调用 app.getSeasonInfo 并设置 seasonInfo', () => {
      const app = getApp()
      pageObj.loadSeasonInfo()
      expect(app.getSeasonInfo).toHaveBeenCalled()
      expect(pageObj.setData).toHaveBeenCalledWith({ seasonInfo: expect.any(Object) })
    })
  })

  describe('formatValue', () => {
    test('正确率维度显示百分比', () => {
      const dim = LEADERBOARD_CONFIG.dimensions.find(d => d.id === 'accuracy')
      const result = pageObj.formatValue(85, dim)
      expect(result).toBe('85%')
    })

    test('积分维度显示数字加单位', () => {
      const dim = LEADERBOARD_CONFIG.dimensions.find(d => d.id === 'points')
      const result = pageObj.formatValue(1000, dim)
      expect(result).toContain('1,000')
      expect(result).toContain('分')
    })

    test('空维度直接返回值', () => {
      const result = pageObj.formatValue(42, null)
      expect(result).toBe(42)
    })
  })

  describe('onPKTap', () => {
    test('跳转到 PK 对战页面', () => {
      pageObj.onPKTap()
      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/pk-battle/pk-battle',
        fail: expect.any(Function)
      })
    })
  })

  describe('onPullDownRefresh', () => {
    test('刷新数据并停止下拉刷新', () => {
      jest.useFakeTimers()
      pageObj.onPullDownRefresh()
      expect(wx.stopPullDownRefresh).not.toHaveBeenCalled()
      jest.advanceTimersByTime(800)
      expect(wx.stopPullDownRefresh).toHaveBeenCalled()
      jest.useRealTimers()
    })
  })
})

describe('Leaderboard Config & Data', () => {
  test('LEADERBOARD_CONFIG 包含3个周期', () => {
    expect(LEADERBOARD_CONFIG.periods).toHaveLength(3)
    expect(LEADERBOARD_CONFIG.periods.map(p => p.id)).toEqual(['week', 'month', 'total'])
  })

  test('LEADERBOARD_CONFIG 包含4个维度', () => {
    expect(LEADERBOARD_CONFIG.dimensions).toHaveLength(4)
    expect(LEADERBOARD_CONFIG.dimensions.map(d => d.id)).toEqual(['points', 'accuracy', 'classifyCount', 'streakDays'])
  })

  test('LEADERBOARD_USERS 包含15个用户', () => {
    expect(LEADERBOARD_USERS).toHaveLength(15)
  })

  test('LEADERBOARD_USERS 排名按积分降序', () => {
    for (let i = 0; i < LEADERBOARD_USERS.length - 1; i++) {
      expect(LEADERBOARD_USERS[i].points).toBeGreaterThanOrEqual(LEADERBOARD_USERS[i + 1].points)
    }
  })

  test('LEADERBOARD_USERS 每个用户都有必要字段', () => {
    LEADERBOARD_USERS.forEach(user => {
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('nickName')
      expect(user).toHaveProperty('avatarEmoji')
      expect(user).toHaveProperty('points')
      expect(user).toHaveProperty('accuracy')
      expect(user).toHaveProperty('classifyCount')
      expect(user).toHaveProperty('streakDays')
    })
  })
})
