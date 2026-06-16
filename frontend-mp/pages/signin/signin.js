/**
 * 每日签到页面
 * @description 展示当月日历，支持每日签到
 */
const app = getApp()
const { formatDate, showToast, showSuccess } = require('../../utils/util')

Page({
  data: {
    currentYear: 0,
    currentMonth: 0,
    calendarDays: [],
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    today: '',
    isSignedToday: false,
    streakDays: 0,
    userPoints: 0,
    showSignResult: false,
    signResult: null
  },

  onLoad() {
    console.log('[SignIn] 页面加载')
    this.initCalendar()
  },

  onShow() {
    console.log('[SignIn] 页面显示')
    this.refreshData()
  },

  initCalendar() {
    const now = new Date()
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth(),
      today: formatDate(now, 'YYYY-MM-DD')
    })
    this.generateCalendar()
  },

  generateCalendar() {
    const { currentYear, currentMonth } = this.data
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const firstDayOfWeek = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const signInRecords = app.getSignInRecords()
    const days = []

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ day: '', isEmpty: true })
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isSigned = signInRecords.includes(dateStr)
      const isToday = dateStr === this.data.today
      const isFuture = new Date(dateStr) > new Date(this.data.today)

      days.push({
        day,
        dateStr,
        isSigned,
        isToday,
        isFuture,
        isEmpty: false
      })
    }

    this.setData({
      calendarDays: days
    })
  },

  refreshData() {
    const userInfo = app.globalData.userInfo
    this.setData({
      isSignedToday: app.isTodaySignedIn(),
      streakDays: app.getStreakDays(),
      userPoints: userInfo ? userInfo.points || 0 : 0
    })
    this.generateCalendar()
  },

  onPrevMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth--
    if (currentMonth < 0) {
      currentMonth = 11
      currentYear--
    }
    this.setData({ currentYear, currentMonth })
    this.generateCalendar()
  },

  onNextMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth++
    if (currentMonth > 11) {
      currentMonth = 0
      currentYear++
    }
    this.setData({ currentYear, currentMonth })
    this.generateCalendar()
  },

  onSignIn() {
    if (this.data.isSignedToday) {
      showToast('今日已签到')
      return
    }

    const result = app.doSignIn()

    if (result.success) {
      this.setData({
        showSignResult: true,
        signResult: result
      })
      this.refreshData()

      if (result.bonus > 0) {
        showSuccess(`签到成功！+${result.points}积分 连续${result.streakDays}天奖励+${result.bonus}积分`)
      } else {
        showSuccess(`签到成功！+${result.points}积分`)
      }
    } else {
      showToast('签到失败')
    }
  },

  onCloseResult() {
    this.setData({
      showSignResult: false,
      signResult: null
    })
  },

  onDayTap(e) {
    const { item } = e.currentTarget.dataset
    if (item.isToday && !item.isSigned) {
      this.onSignIn()
    }
  },

  onPullDownRefresh() {
    console.log('[SignIn] 下拉刷新')
    this.refreshData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
