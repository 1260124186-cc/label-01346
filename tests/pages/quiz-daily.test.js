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
    test('storage中无日期时 dailyCompleted 为 false', () => {
      page.checkDailyCompleted()
      expect(page.data.dailyCompleted).toBe(false)
    })

    test('storage中日期为今天时 dailyCompleted 为 true', () => {
      const today = new Date().toDateString()
      storage.lastDailyQuizDate = today
      page.checkDailyCompleted()
      expect(page.data.dailyCompleted).toBe(true)
    })

    test('storage中日期非今天时 dailyCompleted 为 false', () => {
      storage.lastDailyQuizDate = 'Mon Jan 01 2024'
      page.checkDailyCompleted()
      expect(page.data.dailyCompleted).toBe(false)
    })
  })

  describe('loadStreakDays', () => {
    test('storage中无数据时 streakDays 为 0', () => {
      page.loadStreakDays()
      expect(page.data.streakDays).toBe(0)
    })

    test('从 storage 读取 quizStreakDays', () => {
      storage.quizStreakDays = 7
      page.loadStreakDays()
      expect(page.data.streakDays).toBe(7)
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
