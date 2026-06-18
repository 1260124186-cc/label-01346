const app = getApp()
const { HOMEWORK_STATUS, HOMEWORK_TASK_TYPES } = require('../../utils/constants')
const { showToast, showSuccess, showError, navigateTo, formatDate } = require('../../utils/util')

Page({
  data: {
    currentGroup: null,
    isCurrentUserAdmin: false,
    homeworkList: [],
    filteredHomeworkList: [],
    statusFilter: 'all',
    statusOptions: [
      { id: 'all', name: '全部', color: '#5BBD72' },
      { id: 'in_progress', name: '进行中', color: '#F39C12' },
      { id: 'completed', name: '已完成', color: '#5BBD72' },
      { id: 'expired', name: '已过期', color: '#E85D5D' }
    ],
    showTemplates: false,
    loading: true
  },

  onLoad() {
    console.log('[GroupHomework] 页面加载')
    this.initData()
  },

  onShow() {
    console.log('[GroupHomework] 页面显示')
    this.loadHomeworkList()
  },

  onPullDownRefresh() {
    console.log('[GroupHomework] 下拉刷新')
    this.loadHomeworkList(() => {
      wx.stopPullDownRefresh()
      showToast('刷新成功', 'success')
    })
  },

  initData() {
    const currentGroup = app.getCurrentGroup()
    const isCurrentUserAdmin = app.hasPermission('task', currentGroup?.id)

    this.setData({
      currentGroup,
      isCurrentUserAdmin
    })

    this.loadHomeworkList()
  },

  loadHomeworkList(callback) {
    const { currentGroup, statusFilter } = this.data
    if (!currentGroup) {
      this.setData({ homeworkList: [], filteredHomeworkList: [], loading: false })
      if (callback) callback()
      return
    }

    wx.showLoading({ title: '加载中...', mask: true })

    setTimeout(() => {
      try {
        const homeworkList = app.getGroupHomeworks(currentGroup.id, 'all')

        const formattedList = homeworkList.map(hw => {
          const statusInfo = HOMEWORK_STATUS[hw.status.toUpperCase()] || HOMEWORK_STATUS.NOT_STARTED
          const taskSummary = this.getTaskSummary(hw)
          const myProgress = this.getMyProgress(hw)

          return {
            ...hw,
            statusInfo,
            taskSummary,
            myProgress,
            daysLeftText: this.getDaysLeftText(hw),
            completionText: `${hw.completedCount}/${hw.totalMembers}人完成`
          }
        })

        const filteredList = statusFilter === 'all'
          ? formattedList
          : formattedList.filter(hw => hw.status === statusFilter)

        this.setData({
          homeworkList: formattedList,
          filteredHomeworkList: filteredList,
          loading: false
        })

        wx.hideLoading()
        if (callback) callback()
      } catch (err) {
        console.error('[GroupHomework] 加载作业列表失败', err)
        wx.hideLoading()
        showError('加载失败，请重试')
        if (callback) callback()
      }
    }, 300)
  },

  getTaskSummary(homework) {
    const taskIcons = {
      chapter: '📚',
      quiz: '❓',
      signin: '📅',
      classify: '♻️'
    }

    return homework.tasks.map(task => ({
      icon: taskIcons[task.type] || '📋',
      name: task.name || HOMEWORK_TASK_TYPES[task.type.toUpperCase()]?.name || '任务',
      required: task.required
    }))
  },

  getMyProgress(homework) {
    const userId = app.getUserId()
    const memberProgress = homework.memberProgress || []
    const myProgress = memberProgress.find(m => m.memberId === userId)

    if (!myProgress) {
      return { completionRate: 0, completed: false, tasks: [] }
    }

    return myProgress
  },

  getDaysLeftText(homework) {
    if (homework.status === 'completed') return '已完成'
    if (homework.status === 'expired') return '已过期'

    const days = homework.daysLeft
    if (days < 0) return '已过期'
    if (days === 0) return '今天截止'
    if (days === 1) return '明天截止'
    return `剩余${days}天`
  },

  onFilterStatus(e) {
    const { status } = e.currentTarget.dataset
    if (status === this.data.statusFilter) return

    this.setData({ statusFilter: status })
    this.applyFilter()
  },

  applyFilter() {
    const { homeworkList, statusFilter } = this.data
    const filteredList = statusFilter === 'all'
      ? homeworkList
      : homeworkList.filter(hw => hw.status === statusFilter)

    this.setData({ filteredHomeworkList: filteredList })
  },

  onHomeworkTap(e) {
    const { id } = e.currentTarget.dataset
    if (!id) return
    navigateTo('/pages/group-homework-detail/group-homework-detail', { id })
  },

  onCreateHomework() {
    if (!this.data.isCurrentUserAdmin) {
      showError('只有老师/家长可以创建组作业')
      return
    }
    navigateTo('/pages/group-homework-create/group-homework-create')
  },

  onUseTemplate(e) {
    const { templateId } = e.currentTarget.dataset
    if (!this.data.isCurrentUserAdmin) {
      showError('只有老师/家长可以使用模板')
      return
    }
    navigateTo('/pages/group-homework-create/group-homework-create', { templateId })
  },

  onShowTemplates() {
    this.setData({ showTemplates: true })
  },

  onHideTemplates() {
    this.setData({ showTemplates: false })
  },

  stopPropagation() {},

  onShareAppMessage() {
    const group = this.data.currentGroup
    return {
      title: `${group ? group.name + '的' : ''}组作业列表 - 垃圾分类助手`,
      path: `/pages/index/index`
    }
  }
})
