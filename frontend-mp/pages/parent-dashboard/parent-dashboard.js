const app = getApp()
const { showToast, showSuccess, showError, showConfirm, navigateTo, navigateBack } = require('../../utils/util')
const { CHILD_TIME_LIMIT_OPTIONS } = require('../../utils/constants')

Page({
  data: {
    isLoading: true,
    currentMemberId: null,
    familyMembers: [],
    memberNickname: '小朋友',
    memberAvatar: '',
    todayStats: {
      usageSeconds: 0,
      timeLimitMinutes: 60,
      quizTotal: 0,
      quizCorrect: 0,
      gameCount: 0,
      classifyCount: 0,
      coinsEarned: 0,
      badgesEarned: 0
    },
    usagePercent: 0,
    usageText: '0分钟 / 60分钟',
    remainingText: '剩余60分钟',
    accuracyText: '--',
    weekData: [],
    weekLabels: [],
    timeLimitOptions: CHILD_TIME_LIMIT_OPTIONS,
    showTimeLimitPicker: false,
    showExtendDialog: false,
    extendMinutes: 30,
    isLocked: false
  },

  onLoad(options) {
    const memberId = options.memberId || null
    this.setData({ currentMemberId: memberId })
    this.initPage()
  },

  async initPage() {
    this.setData({ isLoading: true })
    try {
      await this.loadFamilyMembers()
      await this.loadTodayStats()
      this.loadWeekTrend()
    } catch (e) {
      console.error('家长看板加载失败:', e)
    }
    this.setData({ isLoading: false })
  },

  async loadFamilyMembers() {
    const members = app.getFamilyGroupMembers()
    const childMembers = members.filter(m =>
      (m.role === 'child' || m.memberType === 'child' || (m.role && m.role.includes('child')))
    )

    if (childMembers.length === 0 && !this.data.currentMemberId) {
      this.setData({
        familyMembers: [],
        memberNickname: '我的孩子',
        memberAvatar: '/assets/icons/avatar-default.png'
      })
      return
    }

    if (!this.data.currentMemberId && childMembers.length > 0) {
      this.setData({ currentMemberId: childMembers[0].memberId || childMembers[0].id })
    }

    this.setData({
      familyMembers: childMembers.length > 0 ? childMembers : []
    })

    if (childMembers.length > 0) {
      const current = childMembers.find(m => (m.memberId || m.id) === this.data.currentMemberId) || childMembers[0]
      this.setData({
        memberNickname: current.nickname || current.nickName || '小朋友',
        memberAvatar: current.avatarUrl || '/assets/icons/avatar-default.png'
      })
    }
  },

  async loadTodayStats() {
    const stats = app.getChildTodayStats(this.data.currentMemberId)
    const timeLimit = app.getChildTimeLimit()

    const limitSeconds = timeLimit * 60
    const usageSeconds = stats.usageSeconds || 0
    const percent = Math.min(100, Math.round((usageSeconds / limitSeconds) * 100))

    const usedMin = Math.floor(usageSeconds / 60)
    const remainSeconds = Math.max(0, limitSeconds - usageSeconds)
    const remainMin = Math.floor(remainSeconds / 60)
    const remainSec = remainSeconds % 60

    const quizTotal = stats.quizTotal || 0
    const quizCorrect = stats.quizCorrect || 0
    const accuracy = quizTotal > 0 ? Math.round((quizCorrect / quizTotal) * 100) : 0

    this.setData({
      todayStats: Object.assign({
        timeLimitMinutes: timeLimit
      }, stats),
      usagePercent: percent,
      usageText: `${usedMin}分钟 / ${timeLimit}分钟`,
      remainingText: remainSeconds > 0
        ? `剩余${remainMin}分${remainSec}秒`
        : `今日已达时长上限`,
      accuracyText: quizTotal > 0 ? `${accuracy}%` : '--',
      isLocked: app.isChildModeLocked()
    })
  },

  loadWeekTrend() {
    const labels = []
    const data = []
    const now = new Date()
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const stats = app.getChildDailyStatsByDate(dateStr, this.data.currentMemberId)

      labels.push(i === 0 ? '今天' : weekDays[d.getDay()])
      data.push(Math.round((stats.usageSeconds || 0) / 60))
    }

    const maxVal = Math.max(...data, 60)
    this.setData({
      weekLabels: labels,
      weekData: data.map((v, i) => ({
        value: v,
        height: Math.max(8, Math.round((v / maxVal) * 200)),
        isToday: i === data.length - 1
      }))
    })
  },

  onSwitchMember(e) {
    const memberId = e.currentTarget.dataset.memberId
    if (memberId === this.data.currentMemberId) return
    this.setData({ currentMemberId: memberId })
    this.initPage()
  },

  onTapTimeLimit() {
    this.setData({ showTimeLimitPicker: true })
  },

  onSelectTimeLimit(e) {
    const minutes = e.currentTarget.dataset.minutes
    app.setChildTimeLimit(minutes)
    showSuccess(`已设置${minutes}分钟`)
    this.setData({ showTimeLimitPicker: false })
    this.loadTodayStats()
  },

  onExtendTime() {
    this.setData({ showExtendDialog: true })
  },

  onExtendMinus() {
    const val = Math.max(10, this.data.extendMinutes - 10)
    this.setData({ extendMinutes: val })
  },

  onExtendPlus() {
    const val = Math.min(120, this.data.extendMinutes + 10)
    this.setData({ extendMinutes: val })
  },

  onConfirmExtend() {
    const added = app.extendChildDailyTimeLimit(this.data.extendMinutes)
    showSuccess(`已延长${added}分钟`)
    this.setData({ showExtendDialog: false })
    this.loadTodayStats()
  },

  onToggleLock() {
    const willLock = !this.data.isLocked
    const msg = willLock ? '确定立即锁定儿童模式？仅可使用分类学习' : '确定解锁儿童模式？'

    showConfirm('', msg).then(confirm => {
      if (!confirm) return
      app.setChildModeLocked(willLock)
      showSuccess(willLock ? '已锁定' : '已解锁')
      this.setData({ isLocked: willLock })
    })
  },

  onRefresh() {
    this.initPage()
    showToast('已刷新', 'none')
  },

  onGoSettings() {
    navigateTo('/pages/settings/settings')
  },

  onBack() {
    navigateBack()
  },

  onClosePicker() {
    this.setData({ showTimeLimitPicker: false })
  },

  onCloseExtendDialog() {
    this.setData({ showExtendDialog: false })
  },

  preventMaskClose() {}
})
