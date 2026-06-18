/**
 * 分类记录页面 + 个人环保数据看板
 */
const app = getApp()
const { TRASH_TYPES } = require('../../utils/constants')
const { navigateTo, showLoading, hideLoading, showSuccess, showToast, showError } = require('../../utils/util')

Page({
  data: {
    // 儿童模式
    isChildMode: false,
    childData: {},

    // 原有统计数据
    totalCount: 0,
    totalPoints: 0,
    continuousDays: 0,
    categoryStats: [],
    recordList: [],

    // 折线图：分类次数趋势
    trendDays: 7,
    classifyTrend: [],
    trendMaxCount: 10,
    trendLinePoints: '',
    trendAreaPoints: '',

    // 雷达图：四分类能力
    radarGridPoints: {},
    radarAxisLines: [],
    radarDataPoints: '',
    radarDataPointList: [],
    radarLabelList: [],

    // 答题正确率趋势
    quizTrend: [],

    // 游戏最高分
    gameTrend: { games: [] },
    hasGameData: false,

    // 周报/月报
    reportPeriod: 'week',
    reportData: {},

    // 家庭组对比
    groupData: {},

    // 导出画布尺寸
    canvasWidth: 375,
    canvasHeight: 1200
  },

  onLoad() {
    console.log('[Records] 页面加载')
    this.checkChildMode()
    this.loadAllData()
  },

  onShow() {
    this.checkChildMode()
    this.loadAllData()
  },

  checkChildMode() {
    const isChild = app.isChildModeEnabled ? app.isChildModeEnabled() : false
    this.setData({ isChildMode: isChild })
    if (isChild) {
      this.loadChildData()
    }
  },

  loadChildData() {
    const childData = app.getChildDashboardData ? app.getChildDashboardData() : {
      level: 1,
      levelName: '环保新手',
      levelIcon: '🌱',
      stars: 1,
      maxStars: 5,
      totalClassify: 0,
      categoryStars: [],
      encouragement: '多多分类，收集更多星星吧！'
    }
    this.setData({ childData })
  },

  loadAllData() {
    if (this.data.isChildMode) {
      this.loadChildData()
      return
    }

    const stats = app.getStatistics()
    const categoryStats = app.getCategoryStats()
    const classifyRecords = app.getClassifyRecords()
    const quizRecords = app.getQuizRecords()

    const totalClassifyPoints = classifyRecords.reduce((sum, r) => sum + r.points, 0)
    const totalQuizPoints = quizRecords.reduce((sum, r) => sum + r.points, 0)

    const mixedRecords = this.mixRecords(classifyRecords, quizRecords)

    this.setData({
      totalCount: stats.classifyCount,
      totalPoints: totalClassifyPoints + totalQuizPoints,
      continuousDays: stats.continuousDays,
      categoryStats,
      recordList: mixedRecords
    })

    this.loadTrendChart()
    this.loadRadarChart()
    this.loadQuizTrend()
    this.loadGameTrend()
    this.loadReport()
    this.loadGroupComparison()

    console.log('[Records] 所有数据已加载')
  },

  mixRecords(classifyRecords, quizRecords) {
    const formattedClassify = classifyRecords.map(r => ({
      ...r,
      recordType: 'classify',
      displayTitle: r.trashName,
      displaySubtitle: r.typeName,
      points: r.points,
      pointsPrefix: '+',
      time: r.time
    }))

    const formattedQuiz = quizRecords.map(r => ({
      id: r.id,
      recordType: 'quiz',
      displayTitle: r.chapterName || '知识问答',
      displaySubtitle: `正确${r.correctCount}/${r.totalQuestions}题 正确率${r.accuracy}%`,
      emoji: '❓',
      bgColor: 'rgba(155, 89, 182, 0.1)',
      points: r.points,
      pointsPrefix: '+',
      time: r.time
    }))

    const all = [...formattedClassify, ...formattedQuiz]
    all.sort((a, b) => {
      const timeA = new Date(a.time.replace(' ', 'T')).getTime()
      const timeB = new Date(b.time.replace(' ', 'T')).getTime()
      return timeB - timeA
    })

    return all
  },

  /**
   * 加载分类趋势折线图数据
   */
  loadTrendChart() {
    const trend = app.getClassifyTrend(this.data.trendDays)
    const maxCount = Math.max(...trend.map(d => d.count), 5)

    const len = trend.length
    const linePoints = trend.map((d, i) => {
      const x = (i / (len - 1 || 1)) * 100
      const y = maxCount > 0 ? 100 - (d.count / maxCount * 100) : 100
      return `${x},${y}`
    }).join(' ')

    const areaPoints = [
      `0,100`,
      ...trend.map((d, i) => {
        const x = (i / (len - 1 || 1)) * 100
        const y = maxCount > 0 ? 100 - (d.count / maxCount * 100) : 100
        return `${x},${y}`
      }),
      `100,100`
    ].join(' ')

    this.setData({
      classifyTrend: trend,
      trendMaxCount: maxCount,
      trendLinePoints: linePoints,
      trendAreaPoints: areaPoints
    })
  },

  onSwitchTrendDays(e) {
    const days = parseInt(e.currentTarget.dataset.days)
    this.setData({ trendDays: days }, () => {
      this.loadTrendChart()
    })
  },

  /**
   * 加载四分类雷达图数据
   */
  loadRadarChart() {
    const radarData = app.getCategoryRadarData()
    const centerX = 100
    const centerY = 100
    const maxRadius = 80
    const categories = radarData.categories
    const count = categories.length

    const getPolygonPoints = (level) => {
      const radius = maxRadius * (level / 4)
      return categories.map((_, i) => {
        const angle = (Math.PI * 2 * i / count) - Math.PI / 2
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        return `${x.toFixed(1)},${y.toFixed(1)}`
      }).join(' ')
    }

    const radarGridPoints = {
      level1: getPolygonPoints(1),
      level2: getPolygonPoints(2),
      level3: getPolygonPoints(3),
      level4: getPolygonPoints(4)
    }

    const radarAxisLines = categories.map((_, i) => {
      const angle = (Math.PI * 2 * i / count) - Math.PI / 2
      return {
        x: (centerX + maxRadius * Math.cos(angle)).toFixed(1),
        y: (centerY + maxRadius * Math.sin(angle)).toFixed(1)
      }
    })

    const radarDataPointList = radarData.values.map((v, i) => {
      const angle = (Math.PI * 2 * i / count) - Math.PI / 2
      const ratio = radarData.maxValue > 0 ? Math.min(v / radarData.maxValue, 1) : 0
      const radius = maxRadius * ratio
      return {
        x: (centerX + radius * Math.cos(angle)).toFixed(1),
        y: (centerY + radius * Math.sin(angle)).toFixed(1),
        color: radarData.colors[i]
      }
    })

    const radarDataPoints = radarDataPointList.map(p => `${p.x},${p.y}`).join(' ')

    const labelRadius = maxRadius + 20
    const radarLabelList = categories.map((name, i) => {
      const angle = (Math.PI * 2 * i / count) - Math.PI / 2
      const x = 50 + (labelRadius / 200) * 100 * Math.cos(angle)
      const y = 50 + (labelRadius / 200) * 100 * Math.sin(angle)
      return {
        name,
        emoji: radarData.emojis[i],
        value: radarData.values[i],
        left: x.toFixed(1),
        top: y.toFixed(1)
      }
    })

    this.setData({
      radarGridPoints,
      radarAxisLines,
      radarDataPoints,
      radarDataPointList,
      radarLabelList
    })
  },

  /**
   * 加载答题正确率趋势
   */
  loadQuizTrend() {
    const trend = app.getQuizAccuracyTrend(8)
    this.setData({ quizTrend: trend })
  },

  /**
   * 加载游戏最高分曲线
   */
  loadGameTrend() {
    const gameTrend = app.getGameScoreTrend()
    const hasGameData = gameTrend.games.some(g => g.records.length > 0 || g.bestScore > 0)
    this.setData({ gameTrend, hasGameData })
  },

  /**
   * 加载周报/月报
   */
  loadReport() {
    const reportData = app.generateReportSummary(this.data.reportPeriod)
    this.setData({ reportData })
  },

  onSwitchReportPeriod(e) {
    const period = e.currentTarget.dataset.period
    this.setData({ reportPeriod: period }, () => {
      this.loadReport()
    })
  },

  onSuggestionTap(e) {
    const { action, data } = e.currentTarget.dataset
    if (action === 'chapter') {
      navigateTo('/pages/quiz-chapter/quiz-chapter')
    } else if (action === 'wrong') {
      navigateTo('/pages/quiz-wrong/quiz-wrong')
    }
  },

  /**
   * 加载家庭组对比
   */
  loadGroupComparison() {
    const groupData = app.getGroupComparison ? app.getGroupComparison() : {
      hasGroup: false,
      comparisonText: '加入家庭组后可查看对比数据',
      memberStats: []
    }
    this.setData({ groupData })
  },

  onGoToFamilyGroup() {
    navigateTo('/pages/family-group/family-group')
  },

  /**
   * 导出 PNG 长图
   */
  onExportImage() {
    showLoading('正在生成图片...')
    const ctx = wx.createCanvasContext('exportCanvas', this)
    const dpr = wx.getSystemInfoSync().pixelRatio || 2
    const width = 375
    const height = 1400

    this.setData({
      canvasWidth: width,
      canvasHeight: height
    })

    setTimeout(() => {
      this._drawExportImage(ctx, width, height)
    }, 100)
  },

  _drawExportImage(ctx, width, height) {
    const data = this.data

    ctx.setFillStyle('#F7FAF8')
    ctx.fillRect(0, 0, width, height)

    let y = 20

    ctx.setFillStyle('#1A1A1A')
    ctx.setFontSize(20)
    ctx.setTextAlign('left')
    ctx.fillText('🌱 我的环保数据看板', 20, y + 15)
    y += 40

    ctx.setFillStyle('#5BBD72')
    ctx.fillRect(20, y, width - 40, 1)
    y += 15

    const summaryCardY = y
    ctx.setFillStyle('#5BBD72')
    this._roundRect(ctx, 20, y, width - 40, 80, 12)
    ctx.fill()

    ctx.setFillStyle('#FFFFFF')
    ctx.setFontSize(14)
    ctx.setTextAlign('center')
    ctx.fillText(String(data.totalCount), 70, y + 30)
    ctx.setFontSize(11)
    ctx.fillText('总分类次数', 70, y + 50)

    ctx.fillText(String(data.totalPoints), width / 2, y + 30)
    ctx.setFontSize(11)
    ctx.fillText('获得积分', width / 2, y + 50)

    ctx.fillText(String(data.continuousDays), width - 70, y + 30)
    ctx.setFontSize(11)
    ctx.fillText('连续天数', width - 70, y + 50)

    y = summaryCardY + 100

    ctx.setFillStyle('#1A1A1A')
    ctx.setFontSize(15)
    ctx.setTextAlign('left')
    ctx.fillText('📊 ' + (data.reportData.periodLabel || '本周') + '报告', 20, y)
    y += 25

    if (data.reportData.summaryText) {
      ctx.setFillStyle('#666666')
      ctx.setFontSize(12)
      this._wrapText(ctx, '💡 ' + data.reportData.summaryText, 20, y, width - 40, 18)
      y += 60
    }

    ctx.setFillStyle('#FFFFFF')
    this._roundRect(ctx, 20, y, width - 40, 70, 10)
    ctx.fill()

    ctx.setFillStyle('#1A1A1A')
    ctx.setFontSize(14)
    ctx.setTextAlign('center')
    ctx.fillText(String(data.reportData.totalClassify || 0), width / 4, y + 25)
    ctx.setFontSize(10)
    ctx.setFillStyle('#999999')
    ctx.fillText((data.reportData.periodLabel || '本周') + '分类', width / 4, y + 45)

    ctx.setFillStyle('#1A1A1A')
    ctx.setFontSize(14)
    ctx.fillText(String(data.reportData.avgDaily || 0), width / 2, y + 25)
    ctx.setFontSize(10)
    ctx.setFillStyle('#999999')
    ctx.fillText('日均分类', width / 2, y + 45)

    ctx.setFillStyle('#1A1A1A')
    ctx.setFontSize(14)
    ctx.fillText((data.reportData.avgAccuracy || '-') + (data.reportData.avgAccuracy ? '%' : ''), width * 3 / 4, y + 25)
    ctx.setFontSize(10)
    ctx.setFillStyle('#999999')
    ctx.fillText('平均正确率', width * 3 / 4, y + 45)

    y += 90

    if (data.groupData.hasGroup) {
      ctx.setFillStyle('#1A1A1A')
      ctx.setFontSize(15)
      ctx.setTextAlign('left')
      ctx.fillText('👨‍👩‍👧 家庭组排名', 20, y)
      y += 25

      ctx.setFillStyle('#FFFFFF')
      this._roundRect(ctx, 20, y, width - 40, 80, 10)
      ctx.fill()

      ctx.setFillStyle('#5BBD72')
      ctx.setFontSize(24)
      ctx.setTextAlign('center')
      ctx.fillText(data.groupData.percentile + '%', width / 2, y + 30)
      ctx.setFontSize(11)
      ctx.setFillStyle('#666666')
      ctx.fillText('超过组内成员比例', width / 2, y + 50)
      ctx.setFontSize(12)
      ctx.setFillStyle('#999999')
      ctx.fillText('第' + (data.groupData.userRank || 1) + '名 / 共' + (data.groupData.memberCount || 0) + '人', width / 2, y + 68)

      y += 100
    }

    ctx.setFillStyle('#1A1A1A')
    ctx.setFontSize(15)
    ctx.setTextAlign('left')
    ctx.fillText('📈 四分类能力', 20, y)
    y += 25

    const stats = data.categoryStats || []
    stats.forEach((cat, i) => {
      ctx.setFillStyle('#FFFFFF')
      this._roundRect(ctx, 20, y + i * 35, width - 40, 28, 8)
      ctx.fill()

      ctx.setFontSize(14)
      ctx.setTextAlign('left')
      ctx.fillText(cat.emoji + ' ' + cat.name, 30, y + i * 35 + 20)

      const maxVal = Math.max(...stats.map(s => s.count), 1)
      const barWidth = ((width - 140) * (cat.count / maxVal))
      ctx.setFillStyle(cat.color || '#5BBD72')
      this._roundRect(ctx, 100, y + i * 35 + 8, barWidth, 12, 6)
      ctx.fill()

      ctx.setFillStyle('#1A1A1A')
      ctx.setFontSize(12)
      ctx.setTextAlign('right')
      ctx.fillText(cat.count + '次', width - 30, y + i * 35 + 20)
    })
    y += stats.length * 35 + 20

    ctx.setFillStyle('#999999')
    ctx.setFontSize(10)
    ctx.setTextAlign('center')
    const dateStr = new Date().toLocaleDateString()
    ctx.fillText('生成于 ' + dateStr + ' · 垃圾分类助手', width / 2, height - 30)
    ctx.fillText('扫码一起学垃圾分类，争做环保达人 🌍', width / 2, height - 15)

    ctx.draw(false, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'exportCanvas',
          width: width,
          height: height,
          destWidth: width * 2,
          destHeight: height * 2,
          success: (res) => {
            hideLoading()
            this._showSharePreview(res.tempFilePath)
          },
          fail: (err) => {
            console.error('[Export] 生成图片失败', err)
            hideLoading()
            showError('生成图片失败，请重试')
          }
        }, this)
      }, 300)
    })
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h - r)
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
    ctx.lineTo(x + r, y + h)
    ctx.arcTo(x, y + h, x, y + h - r, r)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
  },

  _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let line = ''
    let lines = 0
    const maxLines = 3

    for (let i = 0; i < text.length; i++) {
      const testLine = line + text[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, y + lines * lineHeight)
        line = text[i]
        lines++
        if (lines >= maxLines) break
      } else {
        line = testLine
      }
    }
    if (lines < maxLines) {
      ctx.fillText(line, x, y + lines * lineHeight)
    }
  },

  _showSharePreview(filePath) {
    wx.previewImage({
      urls: [filePath],
      current: filePath,
      success: () => {
        showSuccess('长按图片可保存或分享')
      }
    })
  },

  onPullDownRefresh() {
    console.log('[Records] 下拉刷新')
    this.loadAllData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  onShareAppMessage() {
    return {
      title: '快来看看我的环保数据看板！一起垃圾分类吧',
      path: '/pages/index/index'
    }
  }
})
