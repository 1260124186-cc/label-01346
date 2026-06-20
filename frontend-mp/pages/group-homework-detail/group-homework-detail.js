const app = getApp()
const { HOMEWORK_STATUS, HOMEWORK_TASK_TYPES, HOMEWORK_REWARD_TYPES } = require('../../utils/constants')
const { showToast, showSuccess, showError, formatDate, navigateTo } = require('../../utils/util')

Page({
  data: {
    homeworkId: '',
    homework: null,
    statusInfo: null,
    myProgress: null,
    uncompletedCount: 0,
    memberProgressList: [],
    currentGroup: null,
    isCurrentUserAdmin: false,
    activeTab: 'tasks',
    tabs: [
      { id: 'tasks', name: '任务' },
      { id: 'members', name: '成员进度' }
    ],
    loading: true
  },

  onLoad(options) {
    console.log('[GroupHomeworkDetail] 页面加载', options)
    if (options.id) {
      this.setData({ homeworkId: options.id })
      this.loadHomeworkDetail()
    } else {
      showError('参数错误')
    }
  },

  onShow() {
    console.log('[GroupHomeworkDetail] 页面显示')
    if (this.data.homeworkId) {
      this.loadHomeworkDetail()
    }
  },

  loadHomeworkDetail() {
    const { homeworkId } = this.data
    if (!homeworkId) return

    wx.showLoading({ title: '加载中...', mask: true })

    setTimeout(() => {
      try {
        const homework = app.getGroupHomeworkById(homeworkId)
        if (!homework) {
          wx.hideLoading()
          showError('作业不存在')
          return
        }

        const statusInfo = HOMEWORK_STATUS[homework.status.toUpperCase()] || HOMEWORK_STATUS.NOT_STARTED
        const currentGroup = app.getCurrentGroup()
        const isCurrentUserAdmin = app.hasPermission('task', currentGroup?.id)

        const userId = app.getUserId()
        const memberProgress = homework.memberProgress || []
        const myProgress = memberProgress.find(m => m.memberId === userId) || {
          memberId: userId,
          completionRate: 0,
          completed: false,
          tasks: []
        }

        // 直接复用 app._getAllMemberProgress 返回的统一数据（成员集合与排名完全一致）
        const memberProgressList = memberProgress.map(item => {
          const member = item.member || {
            id: item.memberId,
            name: item.nickName || item.memberName || '成员',
            nickName: item.nickName || item.memberName || '成员',
            emoji: item.memberEmoji || '🌱',
            avatarEmoji: item.memberEmoji || '🌱',
            avatarUrl: item.avatarUrl || '',
            role: item.role || 'member'
          }
          const progress = {
            memberId: item.memberId,
            completionRate: item.completionRate || 0,
            completed: item.completed || false,
            completedAt: item.completedAt || null,
            tasks: item.tasks || []
          }
          return {
            member,
            progress,
            progressStatusClass: progress.completed ? 'completed' : '',
            completionText: this.getCompletionText(progress),
            statusText: this.getMemberStatusText(progress, homework.status)
          }
        })

        const daysLeftText = this.getDaysLeftText(homework)
        const deadlineText = formatDate(homework.deadline, 'YYYY-MM-DD')

        // 兼容 reward 对象或扁平字段，构造展示用的 displayReward
        const rawReward = homework.reward || {
          type: homework.rewardType || 'points_pool',
          points: homework.rewardPoints || 0,
          badgeId: homework.rewardBadgeId || '',
          badgeName: homework.rewardBadgeName || '',
          badgeIcon: '🏅'
        }
        const displayReward = {
          type: rawReward.type,
          icon: rawReward.type === 'points_pool' ? '💰' : (rawReward.badgeIcon || '🏅'),
          title: rawReward.type === 'points_pool' ? '组积分池奖励' : '组限定勋章',
          desc: rawReward.type === 'points_pool'
            ? (rawReward.points > 0 ? `${rawReward.points} 积分` : '无积分奖励')
            : (rawReward.badgeName || rawReward.badgeId || '专属勋章'),
          badgeName: rawReward.badgeName || '',
          points: rawReward.points || 0
        }

        const taskList = homework.tasks.map((task, index) => {
          const typeInfo = this.getTaskTypeInfo(task.type)
          const detail = this.getTaskDetail(task)
          const taskProgress = myProgress.tasks[index]
          return {
            ...task,
            typeInfo,
            detail,
            taskProgressPercent: (taskProgress && taskProgress.progress) ? taskProgress.progress : 0,
            statusClass: this.getTaskStatusClass(taskProgress),
            statusText: this.getTaskStatusText(taskProgress)
          }
        })

        this.setData({
          homework: {
            ...homework,
            tasks: taskList,
            daysLeftText,
            deadlineText,
            displayReward,
            completionText: `${homework.completedCount}/${homework.totalMembers}人完成`,
            overallProgress: homework.totalMembers > 0 ? Math.round(homework.completedCount / homework.totalMembers * 100) : 0
          },
          statusInfo,
          myProgress: {
            ...myProgress,
            statusText: myProgress.completed ? '🎉 已完成' : (myProgress.completionRate + '%'),
            statusClass: myProgress.completed ? 'completed' : ''
          },
          uncompletedCount: (homework.totalMembers || 0) - (homework.completedCount || 0),
          memberProgressList,
          currentGroup,
          isCurrentUserAdmin,
          loading: false
        })

        wx.hideLoading()
      } catch (err) {
        console.error('[GroupHomeworkDetail] 加载详情失败', err)
        wx.hideLoading()
        showError('加载失败，请重试')
      }
    }, 300)
  },

  getCompletionText(progress) {
    if (progress.completed) {
      return progress.completedAt ? `完成于 ${formatDate(progress.completedAt, 'MM-DD HH:mm')}` : '已完成'
    }
    return `${progress.completionRate}%`
  },

  getMemberStatusText(progress, homeworkStatus) {
    if (progress.completed) return '已完成'
    if (homeworkStatus === 'expired') return '已过期'
    if (homeworkStatus === 'completed') return '已完成'
    if (progress.completionRate > 0) return '进行中'
    return '未开始'
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

  getTaskTypeInfo(type) {
    return HOMEWORK_TASK_TYPES[type.toUpperCase()] || { name: '任务', icon: '📋' }
  },

  getTaskDetail(task) {
    switch (task.type) {
      case 'chapter':
        return task.chapterName || `第${task.chapterId}章`
      case 'quiz':
        return `${task.count}题`
      case 'signin':
        return `连续${task.days}天`
      case 'classify':
        return `${task.count}次`
      default:
        return ''
    }
  },

  getTaskStatusClass(taskProgress) {
    if (taskProgress?.completed) return 'completed'
    if (taskProgress?.progress > 0) return 'in_progress'
    return 'not_started'
  },

  getTaskStatusText(taskProgress) {
    if (taskProgress?.completed) return '已完成'
    if (taskProgress?.progress > 0) return `${taskProgress.progress}%`
    return '未开始'
  },

  onTabChange(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ activeTab: id })
  },

  onGoToTask(e) {
    const { task } = e.currentTarget.dataset
    if (!task) return

    switch (task.type) {
      case 'chapter':
        showToast('前往章节学习')
        break
      case 'quiz':
        navigateTo('/pages/quiz/quiz')
        break
      case 'signin':
        showToast('前往签到')
        break
      case 'classify':
        navigateTo('/pages/classify/classify')
        break
      default:
        showToast('任务类型不支持')
    }
  },

  onRemindMember(e) {
    const { memberId } = e.currentTarget.dataset
    if (!this.data.isCurrentUserAdmin) {
      showError('只有老师/家长可以提醒成员')
      return
    }

    wx.showModal({
      title: '发送提醒',
      content: '确定要给该成员发送作业提醒吗？',
      confirmColor: '#5BBD72',
      success: (res) => {
        if (res.confirm) {
          showSuccess('提醒已发送')
        }
      }
    })
  },

  onViewReport() {
    navigateTo('/pages/learning-report/learning-report')
  },

  onShareAppMessage() {
    const { homework } = this.data
    return {
      title: `组作业：${homework?.title || '垃圾分类学习任务'}`,
      path: `/pages/index/index`
    }
  }
})
