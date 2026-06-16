require('../setup')

const { storage } = require('../setup')

global.Page = jest.fn(obj => obj)

require('../../frontend-mp/pages/quiz-daily/quiz-daily.js')
const pageObj = global.Page.mock.calls[0][0]
const { getDailyQuestions } = require('../../frontend-mp/utils/constants')

describe('quiz-daily page', () => {
  let page

  beforeEach(() => {
    Object.keys(storage).forEach(key => delete storage[key])
    jest.clearAllMocks()
    page = Object.create(pageObj)
    page.setData = jest.fn(function (data) {
      Object.assign(this.data, data)
    })
    page.data = {
      dailyCompleted: false,
      isSignedToday: false,
      todayQuestions: [],
      userPoints: 0,
      streakDays: 0
    }
  })

  describe('data', () => {
    test('初始数据包含 dailyCompleted=false', () => {
      expect(pageObj.data.dailyCompleted).toBe(false)
    })

    test('初始数据包含 isSignedToday=false', () => {
      expect(pageObj.data.isSignedToday).toBe(false)
    })

    test('初始数据包含 todayQuestions=[]', () => {
      expect(pageObj.data.todayQuestions).toEqual([])
    })

    test('初始数据包含 userPoints=0', () => {
      expect(pageObj.data.userPoints).toBe(0)
    })

    test('初始数据包含 streakDays=0', () => {
      expect(pageObj.data.streakDays).toBe(0)
    })
  })

  describe('初始态验证', () => {
    test('默认数据下 checkDailyCompleted 后 dailyCompleted 为 false（今天未答题）', () => {
      const app = global.getApp()
      expect(app.globalData.dailyQuizRecords).not.toContain('2026-06-16')
      page.checkDailyCompleted()
      expect(page.data.dailyCompleted).toBe(false)
    })

    test('默认数据下 checkDailyCompleted 后 isSignedToday 为 false（今天未签到）', () => {
      const app = global.getApp()
      expect(app.globalData.signInRecords).not.toContain('2026-06-16')
      page.checkDailyCompleted()
      expect(page.data.isSignedToday).toBe(false)
    })

    test('签到与每日一练状态互相独立：签到不影响 dailyCompleted', () => {
      const app = global.getApp()
      app.globalData.signInRecords = ['2026-06-16']
      app.globalData.dailyQuizRecords = ['2026-06-15']
      page.checkDailyCompleted()
      expect(page.data.isSignedToday).toBe(true)
      expect(page.data.dailyCompleted).toBe(false)
    })

    test('签到与每日一练状态互相独立：答题不影响 isSignedToday', () => {
      const app = global.getApp()
      app.globalData.signInRecords = ['2026-06-15']
      app.globalData.dailyQuizRecords = ['2026-06-16']
      page.checkDailyCompleted()
      expect(page.data.isSignedToday).toBe(false)
      expect(page.data.dailyCompleted).toBe(true)
    })
  })

  describe('checkDailyCompleted', () => {
    test('每日一练记录中无今日时 dailyCompleted 为 false', () => {
      const app = global.getApp()
      app.globalData.dailyQuizRecords = ['2026-06-15']
      page.checkDailyCompleted()
      expect(page.data.dailyCompleted).toBe(false)
    })

    test('每日一练记录中有今日时 dailyCompleted 为 true', () => {
      const app = global.getApp()
      app.globalData.dailyQuizRecords = ['2026-06-16', '2026-06-15']
      page.checkDailyCompleted()
      expect(page.data.dailyCompleted).toBe(true)
    })
  })

  describe('loadStreakDays', () => {
    test('无记录时 streakDays 为 0', () => {
      const app = global.getApp()
      app.globalData.signInRecords = []
      app.globalData.dailyQuizRecords = []
      page.loadStreakDays()
      expect(app.getStreakDays).toHaveBeenCalled()
    })

    test('从 app.getStreakDays 获取连续天数（合并签到与每日一练）', () => {
      const app = global.getApp()
      app.globalData.signInRecords = ['2026-06-16']
      app.globalData.dailyQuizRecords = ['2026-06-15', '2026-06-14']
      page.loadStreakDays()
      expect(app.getStreakDays).toHaveBeenCalled()
    })
  })

  describe('loadTodayQuestions', () => {
    test('调用 getDailyQuestions 并设置 todayQuestions', () => {
      page.loadTodayQuestions()
      expect(page.data.todayQuestions.length).toBeGreaterThan(0)
    })
  })

  describe('onStartQuiz', () => {
    test('dailyCompleted 为 true 时显示 toast', () => {
      page.data.dailyCompleted = true
      page.onStartQuiz()
      expect(wx.showToast).toHaveBeenCalledWith(expect.objectContaining({
        title: '今日已完成，明天再来吧'
      }))
    })

    test('dailyCompleted 为 false 时导航到 quiz-play 并传 type=daily', () => {
      page.data.dailyCompleted = false
      page.onStartQuiz()
      expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
        url: expect.stringContaining('/pages/quiz-play/quiz-play?type=daily')
      }))
    })
  })
})
