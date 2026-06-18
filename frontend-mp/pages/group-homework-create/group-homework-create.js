const app = getApp()
const {
  HOMEWORK_TASK_TYPES,
  HOMEWORK_TEMPLATES,
  HOMEWORK_REWARD_TYPES
} = require('../../utils/constants')
const {
  showToast,
  showSuccess,
  showError,
  navigateBack,
  formatDate
} = require('../../utils/util')

Page({
  data: {
    currentGroup: null,
    currentTemplate: null,
    formData: {
      title: '',
      description: '',
      tasks: [],
      deadline: '',
      memberIds: [],
      rewardType: 'points_pool',
      rewardPoints: 100,
      rewardBadgeName: '',
      sendReminder: true
    },
    taskTypes: [],
    availableMembers: [],
    selectedMemberIds: [],
    rewardTypes: [],
    displayTasks: [],
    showTaskEditor: false,
    editingTask: null,
    editingTaskIndex: -1,
    showMemberPicker: false,
    minDate: '',
    maxDate: '',
    submitting: false
  },

  onLoad(options) {
    console.log('[GroupHomeworkCreate] 页面加载', options)
    this.initData(options)
  },

  initData(options) {
    const currentGroup = app.getCurrentGroup()
    if (!currentGroup) {
      showError('请先选择组')
      navigateBack()
      return
    }

    if (!app.hasPermission('task', currentGroup.id)) {
      showError('只有老师/家长可以创建组作业')
      navigateBack()
      return
    }

    const taskTypes = Object.values(HOMEWORK_TASK_TYPES).map(type => ({
      ...type,
      selected: false
    }))

    const rewardTypes = Object.values(HOMEWORK_REWARD_TYPES).map(type => ({
      ...type
    }))

    const availableMembers = currentGroup.members
      .filter(m => m.role === 'child' || m.role === 'student' || m.role === 'member')
      .map(m => ({
        ...m,
        selected: true
      }))

    const selectedMemberIds = availableMembers.map(m => m.id)

    const now = new Date()
    const minDate = formatDate(now, 'YYYY-MM-DD')
    const maxDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    const maxDateStr = formatDate(maxDate, 'YYYY-MM-DD')

    const defaultDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const defaultDeadlineStr = formatDate(defaultDeadline, 'YYYY-MM-DD')

    this.setData({
      currentGroup,
      taskTypes,
      rewardTypes,
      availableMembers,
      selectedMemberIds,
      minDate: minDateStr,
      maxDate: maxDateStr,
      'formData.deadline': defaultDeadlineStr,
      'formData.memberIds': selectedMemberIds
    })

    if (options.templateId) {
      this.applyTemplate(options.templateId)
    } else {
      this.updateDisplayTasks()
    }
  },

  applyTemplate(templateId) {
    const template = HOMEWORK_TEMPLATES.find(t => t.id === templateId)
    if (!template) return

    const tasks = template.tasks.map(t => {
      const typeInfo = HOMEWORK_TASK_TYPES[t.type.toUpperCase()]
      return {
        type: t.type,
        name: typeInfo?.name || '任务',
        icon: typeInfo?.icon || '📋',
        required: t.required !== false,
        chapterId: t.chapterId,
        chapterName: t.chapterId ? `第${t.chapterId}章` : '',
        count: t.count,
        days: t.days,
        difficulty: t.difficulty
      }
    })

    const deadline = new Date(Date.now() + (template.defaultDeadlineDays || 7) * 24 * 60 * 60 * 1000)
    const deadlineStr = formatDate(deadline, 'YYYY-MM-DD')

    this.setData({
      currentTemplate: template,
      'formData.title': template.name,
      'formData.description': template.description,
      'formData.tasks': tasks,
      'formData.deadline': deadlineStr
    }, () => {
      this.updateDisplayTasks()
    })

    showToast(`已应用模板：${template.name}`, 'success')
  },

  onTitleInput(e) {
    this.setData({ 'formData.title': e.detail.value })
  },

  onDescriptionInput(e) {
    this.setData({ 'formData.description': e.detail.value })
  },

  onDeadlineChange(e) {
    this.setData({ 'formData.deadline': e.detail.value })
  },

  onRewardTypeChange(e) {
    const { value } = e.detail
    this.setData({ 'formData.rewardType': value })
  },

  onRewardPointsInput(e) {
    const points = parseInt(e.detail.value) || 0
    this.setData({ 'formData.rewardPoints': Math.max(0, points) })
  },

  onRewardBadgeInput(e) {
    this.setData({ 'formData.rewardBadgeName': e.detail.value })
  },

  onReminderChange(e) {
    this.setData({ 'formData.sendReminder': e.detail.value })
  },

  onAddTask() {
    this.setData({
      showTaskEditor: true,
      editingTask: {
        type: 'chapter',
        name: '',
        required: true,
        chapterId: 1,
        chapterName: '第1章',
        count: 10,
        days: 5,
        difficulty: 'medium'
      },
      editingTaskIndex: -1
    })
  },

  onEditTask(e) {
    const { index } = e.currentTarget.dataset
    const task = this.data.formData.tasks[index]
    this.setData({
      showTaskEditor: true,
      editingTask: { ...task },
      editingTaskIndex: index
    })
  },

  onDeleteTask(e) {
    const { index } = e.currentTarget.dataset
    const tasks = [...this.data.formData.tasks]
    tasks.splice(index, 1)
    this.setData({ 'formData.tasks': tasks })
    showToast('已删除任务', 'success')
  },

  onCloseTaskEditor() {
    this.setData({ showTaskEditor: false, editingTask: null, editingTaskIndex: -1 })
  },

  onTaskTypeSelect(e) {
    const { type } = e.currentTarget.dataset
    const typeInfo = HOMEWORK_TASK_TYPES[type.toUpperCase()]
    this.setData({
      'editingTask.type': type,
      'editingTask.name': typeInfo?.name || '任务',
      'editingTask.icon': typeInfo?.icon || '📋'
    })
  },

  onTaskNameInput(e) {
    this.setData({ 'editingTask.name': e.detail.value })
  },

  onTaskRequiredChange(e) {
    this.setData({ 'editingTask.required': e.detail.value })
  },

  onTaskChapterChange(e) {
    const chapterId = parseInt(e.detail.value) || 1
    this.setData({
      'editingTask.chapterId': chapterId,
      'editingTask.chapterName': `第${chapterId}章`
    })
  },

  onTaskCountInput(e) {
    const count = parseInt(e.detail.value) || 1
    this.setData({ 'editingTask.count': Math.max(1, count) })
  },

  onTaskDaysInput(e) {
    const days = parseInt(e.detail.value) || 1
    this.setData({ 'editingTask.days': Math.max(1, days) })
  },

  onTaskDifficultyChange(e) {
    this.setData({ 'editingTask.difficulty': e.detail.value })
  },

  onSaveTask() {
    const { editingTask, editingTaskIndex, formData } = this.data

    if (!editingTask.name) {
      showError('请输入任务名称')
      return
    }

    const tasks = [...formData.tasks]
    if (editingTaskIndex >= 0) {
      tasks[editingTaskIndex] = { ...editingTask }
    } else {
      tasks.push({ ...editingTask })
    }

    this.setData({
      'formData.tasks': tasks,
      showTaskEditor: false,
      editingTask: null,
      editingTaskIndex: -1
    }, () => {
      this.updateDisplayTasks()
    })

    showToast('任务已保存', 'success')
  },

  onDeleteTask(e) {
    const { index } = e.currentTarget.dataset
    const tasks = [...this.data.formData.tasks]
    tasks.splice(index, 1)
    this.setData({ 'formData.tasks': tasks }, () => {
      this.updateDisplayTasks()
    })
    showToast('已删除任务', 'success')
  },

  updateDisplayTasks() {
    const tasks = this.data.formData.tasks.map(task => ({
      ...task,
      typeLabel: this.getTaskTypeLabel(task.type),
      detail: this.getTaskDetail(task)
    }))
    this.setData({ displayTasks: tasks })
  },

  onOpenMemberPicker() {
    this.setData({ showMemberPicker: true })
  },

  onCloseMemberPicker() {
    this.setData({ showMemberPicker: false })
  },

  onMemberToggle(e) {
    const { id } = e.currentTarget.dataset
    const { availableMembers, selectedMemberIds } = this.data

    const newSelectedIds = selectedMemberIds.includes(id)
      ? selectedMemberIds.filter(mid => mid !== id)
      : [...selectedMemberIds, id]

    const newMembers = availableMembers.map(m => ({
      ...m,
      selected: newSelectedIds.includes(m.id)
    }))

    this.setData({
      availableMembers: newMembers,
      selectedMemberIds: newSelectedIds,
      'formData.memberIds': newSelectedIds
    })
  },

  onSelectAllMembers() {
    const { availableMembers } = this.data
    const allIds = availableMembers.map(m => m.id)
    const newMembers = availableMembers.map(m => ({ ...m, selected: true }))

    this.setData({
      availableMembers: newMembers,
      selectedMemberIds: allIds,
      'formData.memberIds': allIds
    })
  },

  onClearMembers() {
    const { availableMembers } = this.data
    const newMembers = availableMembers.map(m => ({ ...m, selected: false }))

    this.setData({
      availableMembers: newMembers,
      selectedMemberIds: [],
      'formData.memberIds': []
    })
  },

  onSubmit() {
    if (this.data.submitting) return

    const { formData, currentGroup } = this.data

    if (!formData.title.trim()) {
      showError('请输入作业标题')
      return
    }

    if (formData.tasks.length === 0) {
      showError('请至少添加一个任务')
      return
    }

    if (formData.memberIds.length === 0) {
      showError('请至少选择一个成员')
      return
    }

    if (!formData.deadline) {
      showError('请选择截止时间')
      return
    }

    if (formData.rewardType === 'group_badge' && !formData.rewardBadgeName.trim()) {
      showError('请输入勋章名称')
      return
    }

    this.setData({ submitting: true })
    wx.showLoading({ title: '创建中...', mask: true })

    setTimeout(() => {
      try {
        const result = app.createGroupHomework({
          groupId: currentGroup.id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          tasks: formData.tasks,
          deadline: new Date(formData.deadline + ' 23:59:59').getTime(),
          memberIds: formData.memberIds,
          reward: {
            type: formData.rewardType,
            points: formData.rewardType === 'points_pool' ? formData.rewardPoints : 0,
            badgeName: formData.rewardType === 'group_badge' ? formData.rewardBadgeName.trim() : ''
          },
          sendReminder: formData.sendReminder,
          icon: this.data.currentTemplate?.icon || '📋',
          color: this.data.currentTemplate?.color || '#5BBD72'
        })

        wx.hideLoading()

        if (result.success) {
          showSuccess('组作业创建成功')
          setTimeout(() => {
            navigateBack()
          }, 1000)
        } else {
          this.setData({ submitting: false })
          showError(result.message || '创建失败')
        }
      } catch (err) {
        console.error('[GroupHomeworkCreate] 创建失败', err)
        wx.hideLoading()
        this.setData({ submitting: false })
        showError('创建失败，请重试')
      }
    }, 500)
  },

  stopPropagation() {},

  getTaskTypeLabel(type) {
    const typeInfo = HOMEWORK_TASK_TYPES[type.toUpperCase()]
    return typeInfo ? `${typeInfo.icon} ${typeInfo.name}` : '📋 任务'
  },

  getTaskDetail(task) {
    switch (task.type) {
      case 'chapter':
        return task.chapterName || `第${task.chapterId}章`
      case 'quiz':
        return `${task.count}题 ${task.difficulty === 'easy' ? '简单' : task.difficulty === 'hard' ? '困难' : '中等'}`
      case 'signin':
        return `连续${task.days}天`
      case 'classify':
        return `${task.count}次分类`
      default:
        return ''
    }
  }
})
