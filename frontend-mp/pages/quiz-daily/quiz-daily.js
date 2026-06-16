/**
 * 每日一练页面
 * @description 每日答题入口页面
 */
const app = getApp()
const { getDailyQuestions } = require('../../utils/constants')
const { navigateTo, showToast, getStorage, setStorage, formatDate } = require('../../utils/util')

Page({
  data: {
    dailyCompleted: false,
    todayQuestions: [],
    userPoints: 0,
    streakDays: 0
  },

  onLoad() {
    console.log('[QuizDaily] 页面加载')
    this.initPageData()
  },

  onShow() {
    console.log('[QuizDaily] 页面显示')
    this.refreshData()
  },

  initPageData() {
    this.refreshData()
  },

  refreshData() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userPoints: userInfo.points || 0
      })
    }

    this.checkDailyCompleted()
    this.loadStreakDays()
    this.loadTodayQuestions()
  },

  checkDailyCompleted() {
    const today = formatDate(new Date(), 'YYYY-MM-DD')
    const signInRecords = app.getSignInRecords()
    const dailyCompleted = signInRecords.includes(today)

    this.setData({
      dailyCompleted
    })
  },

  loadStreakDays() {
    const streakDays = app.getStreakDays()
    this.setData({
      streakDays
    })
  },

  loadTodayQuestions() {
    const questions = getDailyQuestions()
    this.setData({
      todayQuestions: questions
    })
  },

  onStartQuiz() {
    if (this.data.dailyCompleted) {
      showToast('今日已完成，明天再来吧')
      return
    }

    navigateTo('/pages/quiz-play/quiz-play', {
      type: 'daily'
    })
  },

  onPullDownRefresh() {
    console.log('[QuizDaily] 下拉刷新')
    this.refreshData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
