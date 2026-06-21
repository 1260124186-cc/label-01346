const app = getApp()
const { TRASH_TYPES } = require('../../utils/constants')
const { showToast, showSuccess, showError, showLoading, hideLoading, showModal, formatDate, navigateTo } = require('../../utils/util')

Page({
  data: {
    periodType: 'week',
    periodLabel: '',
    customStartDate: '',
    customEndDate: '',
    members: [],
    currentMemberId: '',
    isTeacher: false,
    isBatchMode: false,
    selectedMemberIds: [],
    reportMemberName: '',
    reportGeneratedAt: '',
    reportData: {
      totalDays: 0,
      classifyCount: 0,
      quizCount: 0,
      accuracy: 0,
      categoryStats: [],
      courseProgress: [],
      homeworkCompleted: 0,
      homeworkTotal: 0,
      homeworkRate: 0,
      weakTop3: [],
      nextWeekPlan: []
    },
    canvasWidth: 750,
    canvasHeight: 2000
  },

  onLoad(options) {
    const now = new Date()
    this.setData({
      reportGeneratedAt: formatDate(now, 'YYYY-MM-DD HH:mm')
    })
    this.initMembers(options)
    this.updatePeriodLabel()
    this.loadReportData()
  },

  initMembers(options) {
    let members = []
    let isTeacher = false
    try {
      if (typeof app.getGroupMembersWithPermission === 'function') {
        members = app.getGroupMembersWithPermission() || []
      }
    } catch (e) {
      console.warn('[ReportExport] 获取成员列表失败', e)
    }

    if (members.length === 0) {
      members = this.getMockMembers()
    }

    try {
      const userRole = app.globalData && app.globalData.userRole
      isTeacher = userRole === 'teacher'
    } catch (e) {}

    const currentMemberId = options.memberId || (members.length > 0 ? members[0].id : '')

    this.setData({
      members,
      isTeacher,
      currentMemberId,
      selectedMemberIds: [],
      isBatchMode: false
    })

    if (currentMemberId) {
      const member = members.find(m => m.id === currentMemberId)
      this.setData({
        reportMemberName: member ? member.nickName : '我'
      })
    }
  },

  getMockMembers() {
    return [
      { id: 'member_self', nickName: '我自己', avatarUrl: '', emoji: '🌱', role: 'creator' },
      { id: 'member_1', nickName: '小明', avatarUrl: '', emoji: '👦', role: 'child' },
      { id: 'member_2', nickName: '小红', avatarUrl: '', emoji: '👧', role: 'child' },
      { id: 'member_3', nickName: '小华', avatarUrl: '', emoji: '🧒', role: 'child' },
      { id: 'member_4', nickName: '小丽', avatarUrl: '', emoji: '👧', role: 'child' }
    ]
  },

  onSelectPeriod(e) {
    const { period } = e.currentTarget.dataset
    if (period === this.data.periodType) return
    this.setData({ periodType: period })
    this.updatePeriodLabel()
    this.loadReportData()
  },

  onStartDateChange(e) {
    this.setData({ customStartDate: e.detail.value })
    this.updatePeriodLabel()
    if (this.data.customStartDate && this.data.customEndDate) {
      this.loadReportData()
    }
  },

  onEndDateChange(e) {
    this.setData({ customEndDate: e.detail.value })
    this.updatePeriodLabel()
    if (this.data.customStartDate && this.data.customEndDate) {
      this.loadReportData()
    }
  },

  updatePeriodLabel() {
    const { periodType, customStartDate, customEndDate } = this.data
    const now = new Date()
    let label = ''

    if (periodType === 'week') {
      const dayOfWeek = now.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      const monday = new Date(now.getTime() + mondayOffset * 86400000)
      const sunday = new Date(monday.getTime() + 6 * 86400000)
      label = `${formatDate(monday, 'MM/DD')} - ${formatDate(sunday, 'MM/DD')} 本周`
    } else if (periodType === 'month') {
      const year = now.getFullYear()
      const month = now.getMonth() + 1
      label = `${year}年${month}月 本月`
    } else {
      if (customStartDate && customEndDate) {
        label = `${customStartDate.replace(/-/g, '/')} - ${customEndDate.replace(/-/g, '/')}`
      } else {
        label = '请选择日期范围'
      }
    }

    this.setData({ periodLabel: label })
  },

  getPeriodRange() {
    const { periodType, customStartDate, customEndDate } = this.data
    const now = new Date()
    let start, end

    if (periodType === 'week') {
      const dayOfWeek = now.getDay()
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      start = new Date(now.getTime() + mondayOffset * 86400000)
      start.setHours(0, 0, 0, 0)
      end = new Date(start.getTime() + 6 * 86400000)
      end.setHours(23, 59, 59, 999)
    } else if (periodType === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    } else {
      start = customStartDate ? new Date(customStartDate) : new Date(now.getFullYear(), now.getMonth(), 1)
      end = customEndDate ? new Date(customEndDate + 'T23:59:59') : now
    }

    return { start, end }
  },

  onMemberSelect(e) {
    const { member } = e.currentTarget.dataset
    if (member.id === this.data.currentMemberId) return
    this.setData({
      currentMemberId: member.id,
      reportMemberName: member.nickName
    })
    this.loadReportData()
  },

  onToggleBatch() {
    this.setData({
      isBatchMode: !this.data.isBatchMode,
      selectedMemberIds: []
    })
  },

  onToggleMember(e) {
    const { id } = e.currentTarget.dataset
    const { selectedMemberIds } = this.data
    const idx = selectedMemberIds.indexOf(id)
    if (idx > -1) {
      selectedMemberIds.splice(idx, 1)
    } else {
      selectedMemberIds.push(id)
    }
    this.setData({ selectedMemberIds: [...selectedMemberIds] })
  },

  loadReportData() {
    const memberId = this.data.currentMemberId
    if (!memberId) return

    showLoading('生成报告中...')

    Promise.all([
      this.fetchOverview(memberId),
      this.fetchCategoryStats(memberId),
      this.fetchCourseProgress(memberId),
      this.fetchHomeworkCompletion(memberId),
      this.fetchWeakTop3(memberId)
    ]).then(() => {
      const plan = this.generateNextWeekPlan()
      this.setData({
        'reportData.nextWeekPlan': plan,
        reportGeneratedAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      })
      hideLoading()
    }).catch(() => {
      hideLoading()
    })
  },

  fetchOverview(memberId) {
    return new Promise((resolve) => {
      let rawData = null
      try {
        if (typeof app.getMemberLearningReport === 'function') {
          rawData = app.getMemberLearningReport(memberId)
        }
      } catch (e) {}

      if (!rawData) {
        rawData = {
          totalDays: 23,
          classifyCount: 156,
          quizCount: 87,
          correctCount: 68,
          overallAccuracy: 78
        }
      }

      const totalDays = rawData.totalStudyDays || rawData.totalDays || 0
      const totalClassify = rawData.totalClassify || rawData.classifyCount || 0
      const totalQuiz = rawData.totalQuiz || rawData.quizCount || 0
      const accuracy = rawData.overallAccuracy || (totalQuiz > 0 ? Math.round((rawData.correctCount || 0) / totalQuiz * 100) : 0)

      this.setData({
        'reportData.totalDays': totalDays,
        'reportData.classifyCount': totalClassify,
        'reportData.quizCount': totalQuiz,
        'reportData.accuracy': accuracy
      })
      resolve()
    })
  },

  fetchCategoryStats(memberId) {
    return new Promise((resolve) => {
      const classifyRecords = app.getClassifyRecords ? app.getClassifyRecords(memberId) : []
      const { start, end } = this.getPeriodRange()

      const filtered = classifyRecords.filter(r => {
        if (!r.time) return true
        const t = new Date(r.time)
        return t >= start && t <= end
      })

      const countMap = {}
      filtered.forEach(r => {
        countMap[r.typeId] = (countMap[r.typeId] || 0) + 1
      })

      const total = filtered.length || 1
      const categoryStats = TRASH_TYPES.map(type => ({
        id: type.id,
        name: type.name.replace('垃圾', ''),
        emoji: type.emoji,
        color: type.color,
        bgColor: type.bgColor,
        count: countMap[type.id] || 0,
        percent: Math.round((countMap[type.id] || 0) / total * 100)
      }))

      this.setData({ 'reportData.categoryStats': categoryStats })
      resolve()
    })
  },

  fetchCourseProgress(memberId) {
    return new Promise((resolve) => {
      let progress = []
      try {
        if (typeof app.getMemberCourseProgress === 'function') {
          progress = app.getMemberCourseProgress(memberId) || []
        }
      } catch (e) {}

      if (progress.length === 0) {
        progress = [
          { id: 1, name: '可回收物', progress: 82 },
          { id: 2, name: '有害垃圾', progress: 45 },
          { id: 3, name: '厨余垃圾', progress: 73 },
          { id: 4, name: '其他垃圾', progress: 61 }
        ]
      }

      this.setData({ 'reportData.courseProgress': progress })
      resolve()
    })
  },

  fetchHomeworkCompletion(memberId) {
    return new Promise((resolve) => {
      let completed = 0
      let total = 0
      try {
        const currentGroup = app.getCurrentGroup ? app.getCurrentGroup() : null
        if (currentGroup && typeof app.getHomeworkCompletionRanking === 'function') {
          const ranking = app.getHomeworkCompletionRanking(currentGroup.id) || []
          const memberRank = ranking.find(r => r.memberId === memberId)
          if (memberRank) {
            completed = memberRank.completedHomework || 0
            total = memberRank.totalHomework || 0
          }
        }
      } catch (e) {}

      if (total === 0) {
        completed = 3
        total = 5
      }

      const rate = total > 0 ? Math.round(completed / total * 100) : 0

      this.setData({
        'reportData.homeworkCompleted': completed,
        'reportData.homeworkTotal': total,
        'reportData.homeworkRate': rate
      })
      resolve()
    })
  },

  fetchWeakTop3(memberId) {
    return new Promise((resolve) => {
      let weakData = []
      try {
        if (typeof app.getMemberWeakCategories === 'function') {
          weakData = app.getMemberWeakCategories(memberId) || []
        }
      } catch (e) {}

      if (weakData.length === 0) {
        weakData = [
          { id: 2, name: '有害垃圾', emoji: '☣️', color: '#E85D5D', bgColor: 'rgba(232,93,93,0.1)', accuracy: 48 },
          { id: 4, name: '其他垃圾', emoji: '🗑️', color: '#8E8E93', bgColor: 'rgba(142,142,147,0.1)', accuracy: 55 },
          { id: 1, name: '可回收物', emoji: '♻️', color: '#4A90D9', bgColor: 'rgba(74,144,217,0.1)', accuracy: 62 }
        ]
      }

      const sorted = weakData
        .sort((a, b) => (a.accuracy || 0) - (b.accuracy || 0))
        .slice(0, 3)

      this.setData({ 'reportData.weakTop3': sorted })
      resolve()
    })
  },

  generateNextWeekPlan() {
    const { weakTop3, accuracy, totalDays } = this.data.reportData
    const plans = []
    const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

    const weakNames = weakTop3.map(w => w.name)
    const hasWeak = weakNames.length > 0

    const baseTasks = [
      { task: '每日签到 + 每日一练', goal: '保持学习连续性' },
      { task: hasWeak ? `薄弱分类专项练习: ${weakNames[0] || '综合'}` : '分类知识巩固练习', goal: hasWeak ? `提升${weakNames[0] || ''}正确率` : '稳固基础知识' },
      { task: '答题闯关模式', goal: '提升答题速度和准确度' },
      { task: hasWeak && weakNames[1] ? `薄弱分类专项练习: ${weakNames[1]}` : '垃圾分类实操练习', goal: hasWeak && weakNames[1] ? `提升${weakNames[1]}正确率` : '增强分类实操能力' },
      { task: '组作业完成', goal: '完成老师/家长布置的任务' },
      { task: hasWeak && weakNames[2] ? `薄弱分类专项练习: ${weakNames[2]}` : '知识竞赛PK', goal: hasWeak && weakNames[2] ? `提升${weakNames[2]}正确率` : '在PK中检验学习成果' },
      { task: '本周学习回顾与总结', goal: '复盘本周薄弱项，制定下周计划' }
    ]

    weekDays.forEach((day, i) => {
      plans.push({
        id: i + 1,
        day,
        task: baseTasks[i].task,
        goal: baseTasks[i].goal
      })
    })

    if (accuracy < 60) {
      plans[1].goal = '重点攻克薄弱项，每天额外练习10道'
      plans[3].goal = '建议配合错题本复习'
    }

    return plans
  },

  onExportImage() {
    showLoading('生成长图中...')
    this.drawReportCanvas().then(() => {
      return this.saveCanvasToImage()
    }).then(filePath => {
      hideLoading()
      wx.saveImageToPhotosAlbum({
        filePath,
        success: () => {
          showSuccess('长图已保存到相册')
        },
        fail: (err) => {
          if (err.errMsg && err.errMsg.indexOf('auth deny') > -1) {
            showModal({
              title: '需要相册权限',
              content: '请在设置中允许访问相册，以便保存学习报告'
            })
          } else {
            showError('保存失败，请重试')
          }
        }
      })
    }).catch(err => {
      hideLoading()
      console.error('[ReportExport] 导出长图失败', err)
      showError('导出失败，请重试')
    })
  },

  drawReportCanvas() {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select('#reportCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res[0]) {
            reject(new Error('Canvas node not found'))
            return
          }

          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio

          const canvasW = 750
          const padding = 40
          const contentW = canvasW - padding * 2
          let y = 0

          const totalHeight = this.calculateCanvasHeight()
          canvas.width = canvasW * dpr
          canvas.height = totalHeight * dpr
          ctx.scale(dpr, dpr)

          this.setData({
            canvasWidth: canvasW,
            canvasHeight: totalHeight
          })

          ctx.fillStyle = '#F7FAF8'
          ctx.fillRect(0, 0, canvasW, totalHeight)

          y = this.drawCanvasHeader(ctx, canvasW, y, padding)
          y = this.drawCanvasOverview(ctx, contentW, y, padding)
          y = this.drawCanvasCategoryStats(ctx, contentW, y, padding)
          y = this.drawCanvasCourseProgress(ctx, contentW, y, padding)
          y = this.drawCanvasHomework(ctx, contentW, y, padding)
          y = this.drawCanvasWeakTop3(ctx, contentW, y, padding)
          y = this.drawCanvasNextWeekPlan(ctx, contentW, y, padding)
          this.drawCanvasFooter(ctx, canvasW, y, padding)

          setTimeout(() => resolve(), 300)
        })
    })
  },

  calculateCanvasHeight() {
    const { reportData } = this.data
    let h = 0
    h += 140
    h += 180
    h += 60
    h += reportData.categoryStats.length * 50 + 80
    h += 60
    h += reportData.courseProgress.length * 50 + 80
    h += 60
    h += 120
    h += 60
    h += Math.max(reportData.weakTop3.length, 1) * 50 + 80
    h += 60
    h += reportData.nextWeekPlan.length * 60 + 80
    h += 80
    return h + 60
  },

  drawCanvasHeader(ctx, w, y, pad) {
    ctx.fillStyle = '#5BBD72'
    ctx.fillRect(0, 0, w, 140)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 40px sans-serif'
    ctx.fillText('📊 学习报告', pad, 60)

    ctx.font = '26px sans-serif'
    ctx.fillText(`${this.data.reportMemberName} · ${this.data.periodLabel}`, pad, 100)

    ctx.textAlign = 'right'
    ctx.font = '22px sans-serif'
    ctx.fillText(this.data.reportGeneratedAt, w - pad, 100)
    ctx.textAlign = 'left'

    return 160
  },

  drawCanvasOverview(ctx, cw, y, pad) {
    const data = this.data.reportData
    ctx.fillStyle = '#2D3436'
    ctx.font = 'bold 30px sans-serif'
    ctx.fillText('📋 数据概览', pad, y + 36)
    y += 56

    const items = [
      { label: '学习天数', value: data.totalDays, unit: '天' },
      { label: '分类次数', value: data.classifyCount, unit: '次' },
      { label: '答题数', value: data.quizCount, unit: '道' },
      { label: '正确率', value: data.accuracy, unit: '%' }
    ]

    const itemW = cw / 4
    items.forEach((item, i) => {
      const x = pad + i * itemW + itemW / 2
      ctx.textAlign = 'center'
      ctx.fillStyle = '#5BBD72'
      ctx.font = 'bold 44px sans-serif'
      ctx.fillText(String(item.value), x, y + 36)
      ctx.font = '22px sans-serif'
      ctx.fillText(item.unit, x + String(item.value).length * 14 + 4, y + 36)
      ctx.fillStyle = '#B2BEC3'
      ctx.font = '22px sans-serif'
      ctx.fillText(item.label, x, y + 68)
    })
    ctx.textAlign = 'left'

    return y + 100
  },

  drawCanvasSectionTitle(ctx, title, y, pad) {
    ctx.fillStyle = '#2D3436'
    ctx.font = 'bold 30px sans-serif'
    ctx.fillText(title, pad, y + 36)
    return y + 56
  },

  drawCanvasCategoryStats(ctx, cw, y, pad) {
    y = this.drawCanvasSectionTitle(ctx, '📂 分类次数统计', y, pad)

    const data = this.data.reportData
    data.categoryStats.forEach(item => {
      ctx.fillStyle = '#2D3436'
      ctx.font = '26px sans-serif'
      ctx.fillText(`${item.emoji} ${item.name}`, pad, y + 30)

      const barX = pad + 180
      const barW = cw - 280
      ctx.fillStyle = 'rgba(0,0,0,0.06)'
      ctx.fillRect(barX, y + 14, barW, 16)
      ctx.fillStyle = item.color
      ctx.fillRect(barX, y + 14, barW * item.percent / 100, 16)

      ctx.fillStyle = '#636E72'
      ctx.font = '24px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${item.count}次`, pad + cw, y + 30)
      ctx.textAlign = 'left'

      y += 50
    })

    return y + 10
  },

  drawCanvasCourseProgress(ctx, cw, y, pad) {
    y = this.drawCanvasSectionTitle(ctx, '📚 课程进度', y, pad)

    const data = this.data.reportData
    data.courseProgress.forEach(item => {
      ctx.fillStyle = '#2D3436'
      ctx.font = '26px sans-serif'
      ctx.fillText(item.name, pad, y + 30)

      const barX = pad + 160
      const barW = cw - 260
      ctx.fillStyle = 'rgba(0,0,0,0.06)'
      ctx.fillRect(barX, y + 14, barW, 16)
      const color = item.progress >= 80 ? '#5BBD72' : item.progress >= 50 ? '#F39C12' : '#E85D5D'
      ctx.fillStyle = color
      ctx.fillRect(barX, y + 14, barW * item.progress / 100, 16)

      ctx.fillStyle = '#636E72'
      ctx.font = '24px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${item.progress}%`, pad + cw, y + 30)
      ctx.textAlign = 'left'

      y += 50
    })

    return y + 10
  },

  drawCanvasHomework(ctx, cw, y, pad) {
    y = this.drawCanvasSectionTitle(ctx, '📝 组任务完成情况', y, pad)

    const data = this.data.reportData
    const items = [
      { label: '已完成', value: data.homeworkCompleted },
      { label: '总任务', value: data.homeworkTotal },
      { label: '完成率', value: data.homeworkRate + '%' }
    ]

    const itemW = cw / 3
    items.forEach((item, i) => {
      const x = pad + i * itemW + itemW / 2
      ctx.textAlign = 'center'
      ctx.fillStyle = i === 2 ? '#5BBD72' : '#2D3436'
      ctx.font = 'bold 40px sans-serif'
      ctx.fillText(String(item.value), x, y + 36)
      ctx.fillStyle = '#B2BEC3'
      ctx.font = '22px sans-serif'
      ctx.fillText(item.label, x, y + 64)
    })
    ctx.textAlign = 'left'

    return y + 90
  },

  drawCanvasWeakTop3(ctx, cw, y, pad) {
    y = this.drawCanvasSectionTitle(ctx, '⚠️ 薄弱分类 TOP3', y, pad)

    const data = this.data.reportData
    if (data.weakTop3.length === 0) {
      ctx.fillStyle = '#5BBD72'
      ctx.font = '26px sans-serif'
      ctx.fillText('🎉 暂无薄弱分类，表现优秀！', pad, y + 30)
      return y + 60
    }

    data.weakTop3.forEach((item, idx) => {
      ctx.fillStyle = '#E85D5D'
      ctx.font = 'bold 24px sans-serif'
      ctx.fillText(String(idx + 1), pad + 14, y + 30)

      ctx.fillStyle = '#2D3436'
      ctx.font = '26px sans-serif'
      ctx.fillText(`${item.emoji} ${item.name}`, pad + 48, y + 30)

      const barX = pad + 220
      const barW = cw - 340
      ctx.fillStyle = 'rgba(0,0,0,0.06)'
      ctx.fillRect(barX, y + 14, barW, 16)
      const color = item.accuracy >= 50 ? '#F39C12' : '#E85D5D'
      ctx.fillStyle = color
      ctx.fillRect(barX, y + 14, barW * item.accuracy / 100, 16)

      ctx.fillStyle = color
      ctx.font = '24px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(`${item.accuracy}%`, pad + cw, y + 30)
      ctx.textAlign = 'left'

      y += 50
    })

    return y + 10
  },

  drawCanvasNextWeekPlan(ctx, cw, y, pad) {
    y = this.drawCanvasSectionTitle(ctx, '🎯 下周建议学习计划', y, pad)

    this.data.reportData.nextWeekPlan.forEach(item => {
      ctx.fillStyle = '#5BBD72'
      ctx.font = '22px sans-serif'
      const tagW = ctx.measureText(item.day).width + 20
      const tagX = pad
      const tagY = y + 8
      const tagH = 36

      ctx.beginPath()
      ctx.moveTo(tagX + 6, tagY)
      ctx.lineTo(tagX + tagW - 6, tagY)
      ctx.quadraticCurveTo(tagX + tagW, tagY, tagX + tagW, tagY + 6)
      ctx.lineTo(tagX + tagW, tagY + tagH - 6)
      ctx.quadraticCurveTo(tagX + tagW, tagY + tagH, tagX + tagW - 6, tagY + tagH)
      ctx.lineTo(tagX + 6, tagY + tagH)
      ctx.quadraticCurveTo(tagX, tagY + tagH, tagX, tagY + tagH - 6)
      ctx.lineTo(tagX, tagY + 6)
      ctx.quadraticCurveTo(tagX, tagY, tagX + 6, tagY)
      ctx.fill()

      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(item.day, tagX + 10, tagY + 26)

      ctx.fillStyle = '#2D3436'
      ctx.font = '26px sans-serif'
      ctx.fillText(item.task, tagX + tagW + 16, y + 32)

      ctx.fillStyle = '#B2BEC3'
      ctx.font = '22px sans-serif'
      ctx.fillText(item.goal, tagX + tagW + 16, y + 56)

      y += 68
    })

    return y + 10
  },

  drawCanvasFooter(ctx, w, y, pad) {
    ctx.fillStyle = '#B2BEC3'
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('由垃圾分类助手自动生成', w / 2, y + 30)
    ctx.fillText(this.data.reportGeneratedAt, w / 2, y + 56)
    ctx.textAlign = 'left'
  },

  saveCanvasToImage() {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select('#reportCanvas')
        .fields({ node: true })
        .exec((res) => {
          if (!res[0]) {
            reject(new Error('Canvas node not found'))
            return
          }
          const canvas = res[0].node
          wx.canvasToTempFilePath({
            canvas,
            success: (imgRes) => {
              resolve(imgRes.tempFilePath)
            },
            fail: (err) => {
              reject(err)
            }
          })
        })
    })
  },

  onShareToWeChat() {
    showLoading('生成分享图片...')
    this.drawReportCanvas().then(() => {
      return this.saveCanvasToImage()
    }).then(filePath => {
      hideLoading()
      wx.shareFileMessage({
        filePath,
        fileName: `学习报告_${this.data.reportMemberName}_${formatDate(new Date(), 'YYYY-MM-DD')}.png`,
        success: () => {
          showSuccess('已分享到聊天')
        },
        fail: (err) => {
          if (err.errMsg && err.errMsg.indexOf('cancel') > -1) return
          this.fallbackShareImage(filePath)
        }
      })
    }).catch(() => {
      hideLoading()
      this.fallbackShareMiniProgram()
    })
  },

  fallbackShareImage(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        showModal({
          title: '分享提示',
          content: '报告图片已保存到相册，您可以在微信群中发送该图片分享给家长。'
        })
      },
      fail: () => {
        showError('保存失败，请重试')
      }
    })
  },

  fallbackShareMiniProgram() {
    this.setData({
      showShareHint: true
    })
    showModal({
      title: '分享学习报告',
      content: '请点击右上角"..."按钮，选择"发送给朋友"或"分享到朋友圈"，将学习报告分享给家长群。'
    })
  },

  onBatchExport() {
    const { selectedMemberIds, members } = this.data
    if (selectedMemberIds.length === 0) {
      showError('请至少选择一名成员')
      return
    }

    showModal({
      title: '批量导出确认',
      content: `将为 ${selectedMemberIds.length} 名成员分别生成学习报告长图，是否继续？`
    }).then(confirmed => {
      if (!confirmed) return

      showLoading('批量导出中...')
      this.batchExportQueue(selectedMemberIds, members, 0, [])
    })
  },

  batchExportQueue(memberIds, members, index, filePaths) {
    if (index >= memberIds.length) {
      hideLoading()
      const count = filePaths.length
      showSuccess(`已成功导出 ${count} 份报告`)
      this.showBatchResult(filePaths, members)
      return
    }

    const memberId = memberIds[index]
    const member = members.find(m => m.id === memberId)

    this.setData({
      currentMemberId: memberId,
      reportMemberName: member ? member.nickName : '未知'
    })

    this.loadReportDataAsync(memberId).then(() => {
      return this.drawReportCanvas()
    }).then(() => {
      return this.saveCanvasToImage()
    }).then(filePath => {
      filePaths.push({ memberId, name: member ? member.nickName : '未知', filePath })
      this.batchExportQueue(memberIds, members, index + 1, filePaths)
    }).catch(() => {
      this.batchExportQueue(memberIds, members, index + 1, filePaths)
    })
  },

  loadReportDataAsync(memberId) {
    return new Promise((resolve) => {
      this.setData({ currentMemberId: memberId })
      const member = this.data.members.find(m => m.id === memberId)
      if (member) {
        this.setData({ reportMemberName: member.nickName })
      }

      Promise.all([
        this.fetchOverview(memberId),
        this.fetchCategoryStats(memberId),
        this.fetchCourseProgress(memberId),
        this.fetchHomeworkCompletion(memberId),
        this.fetchWeakTop3(memberId)
      ]).then(() => {
        const plan = this.generateNextWeekPlan()
        this.setData({
          'reportData.nextWeekPlan': plan,
          reportGeneratedAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
        })
        setTimeout(resolve, 200)
      })
    })
  },

  showBatchResult(filePaths, members) {
    if (filePaths.length === 0) return

    wx.saveImageToPhotosAlbum({
      filePath: filePaths[0].filePath,
      success: () => {
        if (filePaths.length > 1) {
          showModal({
            title: '批量导出完成',
            content: `${filePaths.length} 份报告已生成，第1份已保存到相册。其余报告可在相册中逐一保存。`
          })
        } else {
          showSuccess('报告已保存到相册')
        }
      },
      fail: () => {
        showModal({
          title: '批量导出完成',
          content: `${filePaths.length} 份报告已生成，请前往相册手动保存。`
        })
      }
    })
  },

  onShareAppMessage() {
    const member = this.data.members.find(m => m.id === this.data.currentMemberId)
    return {
      title: `${member ? member.nickName + '的' : ''}学习报告 - 垃圾分类助手`,
      path: '/pages/index/index',
      imageUrl: ''
    }
  }
})