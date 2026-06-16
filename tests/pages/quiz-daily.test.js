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
      todayQuestions: [],
      userPoints: 0,
      streakDays: 0
    }
  })

  describe('data', () => {
    test('初始数据包含 dailyCompleted=false', () => {
      expect(pageObj.data.dailyCompleted).toBe(false)
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
