const app = getApp()
const { COURSES } = require('../../data/courses')
const { QUIZ_CHAPTERS } = require('../../data/quiz')
const { TRASH_TYPES } = require('../../utils/constants')
const { navigateTo, showToast, getStorage } = require('../../utils/util')

const GAME_TYPES = ['catch', 'conveyor', 'match']

const LEARNING_PATH_NODES = [
  {
    id: 'read-knowledge',
    title: '阅读分类常识',
    description: '系统学习四类垃圾的基本知识，了解分类标准和投放要求',
    emoji: '📖',
    color: '#4A90D9',
    colorDark: '#357ABD',
    unit: '类',
    reward: { points: 20, badge: '📚', badgeName: '知识先锋' },
    unlockCondition: null,
    link: '/pages/classify/classify'
  },
  {
    id: 'sort-practice',
    title: '完成分类练习',
    description: '通过实际分类操作巩固知识，提高分类准确率',
    emoji: '♻️',
    color: '#5BBD72',
    colorDark: '#4AA862',
    unit: '次',
    reward: { points: 30, badge: '♻️', badgeName: '分类能手' },
    unlockCondition: {
      nodeId: 'read-knowledge',
      label: '阅读分类常识完成率 ≥ 80%',
      check(data) { return data.readProgress >= 80 }
    },
    link: '/pages/sort-practice/sort-practice'
  },
  {
    id: 'quiz-chapter',
    title: '章节闯关',
    description: '挑战各分类知识问答章节，检验学习成果',
    emoji: '🎯',
    color: '#F39C12',
    colorDark: '#D68910',
    unit: '章',
    reward: { points: 50, badge: '🏆', badgeName: '闯关达人' },
    unlockCondition: {
      nodeId: 'sort-practice',
      label: '分类练习正确率 ≥ 80%',
      check(data) { return data.sortAccuracy >= 80 }
    },
    link: '/pages/quiz-chapter/quiz-chapter'
  },
  {
    id: 'course-chapter',
    title: '课程章节',
    description: '深入学习结构化环保课程，掌握专业知识技能',
    emoji: '🎓',
    color: '#9B59B6',
    colorDark: '#7D3C98',
    unit: '章',
    reward: { points: 100, badge: '🎓', badgeName: '学识渊博' },
    unlockCondition: {
      nodeId: 'quiz-chapter',
      label: '章节闯关正确率 ≥ 80%',
      check(data) { return data.quizAccuracy >= 80 }
    },
    link: '/pages/learning-center/learning-center'
  },
  {
    id: 'game-pass',
    title: '游戏通关',
    description: '通过趣味游戏巩固垃圾分类知识，寓教于乐',
    emoji: '🎮',
    color: '#E85D5D',
    colorDark: '#C0392B',
    unit: '款',
    reward: { points: 80, badge: '🎮', badgeName: '游戏王者' },
    unlockCondition: {
      nodeId: 'course-chapter',
      label: '课程章节完成率 ≥ 60%',
      check(data) { return data.coursePercent >= 60 }
    },
    link: '/pages/game-hall/game-hall'
  }
]

const STATUS_CONFIG = {
  completed: { statusBg: 'rgba(91, 189, 114, 0.12)', statusColor: '#5BBD72' },
  'in-progress': { statusBg: 'rgba(243, 156, 18, 0.12)', statusColor: '#F39C12' },
  pending: { statusBg: 'rgba(142, 142, 147, 0.12)', statusColor: '#8E8E93' },
  locked: { statusBg: 'rgba(142, 142, 147, 0.08)', statusColor: '#B2BEC3' }
}

Page({
  data: {
    pathNodes: [],
    overallProgress: 0,
    completedCount: 0,
    totalCount: 5,
    earnedPoints: 0,
    earnedBadges: [],
    weakAreas: [],
    recommendedAction: null
  },

  onLoad() {
    this.loadPathData()
  },

  onShow() {
    this.loadPathData()
  },

  loadPathData() {
    const metrics = this.gatherAllMetrics()
    const progressData = this.computeProgressData(metrics)
    const { pathNodes } = this.buildPathNodes(progressData, metrics)
    const { weakAreas, recommendedAction } = this.detectWeakAreas(metrics)
    const earnedBadges = pathNodes
      .filter(n => n.status === 'completed' && n.reward.badge)
      .map(n => ({ badge: n.reward.badge, name: n.reward.badgeName, color: n.color }))

    const completedCount = pathNodes.filter(n => n.status === 'completed').length
    const overallProgress = Math.floor((completedCount / pathNodes.length) * 100)
    const earnedPoints = pathNodes
      .filter(n => n.status === 'completed')
      .reduce((sum, n) => sum + (n.reward.points || 0), 0)

    this.setData({
      pathNodes,
      overallProgress,
      completedCount,
      totalCount: pathNodes.length,
      earnedPoints,
      earnedBadges,
      weakAreas,
      recommendedAction
    })
  },

  gatherAllMetrics() {
    const classifyReadInfo = this.getClassifyReadInfo()
    const readProgress = classifyReadInfo.percent

    const sortPracticeInfo = this.getSortPracticeInfo()
    const sortAccuracy = sortPracticeInfo.accuracy

    const quizInfo = this.getQuizInfo()
    const quizAccuracy = quizInfo.accuracy

    const courseInfo = this.getCourseInfo()
    const coursePercent = courseInfo.total > 0
      ? Math.min(Math.floor((courseInfo.completed / courseInfo.total) * 100), 100)
      : 0

    const gameInfo = this.getGameInfo()

    const categoryStats = app.getCategoryStats ? app.getCategoryStats() : []
    const wrongQuestions = app.getWrongQuestions ? app.getWrongQuestions() : []
    const wrongByChapter = {}
    wrongQuestions.forEach(q => {
      const ch = q.chapterId || 0
      wrongByChapter[ch] = (wrongByChapter[ch] || 0) + (q.wrongCount || 1)
    })

    return {
      readProgress,
      classifyReadInfo,
      sortPracticeInfo,
      sortAccuracy,
      quizInfo,
      quizAccuracy,
      courseInfo,
      coursePercent,
      gameInfo,
      categoryStats,
      wrongByChapter
    }
  },

  computeProgressData(metrics) {
    return [
      { current: metrics.classifyReadInfo.read, total: metrics.classifyReadInfo.total },
      { current: metrics.sortPracticeInfo.count, total: metrics.sortPracticeInfo.target },
      { current: metrics.quizInfo.completed, total: metrics.quizInfo.total },
      { current: metrics.courseInfo.completed, total: metrics.courseInfo.total },
      { current: metrics.gameInfo.played, total: metrics.gameInfo.total }
    ]
  },

  buildPathNodes(progressData, metrics) {
    const pathNodes = LEARNING_PATH_NODES.map((node, index) => {
      const { current, total } = progressData[index]
      const progressPercent = total > 0 ? Math.min(Math.floor((current / total) * 100), 100) : 0
      const isCompleted = progressPercent >= 100

      let status = 'pending'
      let unlockMet = true
      let unlockLabel = ''

      if (isCompleted) {
        status = 'completed'
      } else if (index === 0) {
        status = progressPercent > 0 ? 'in-progress' : 'pending'
      } else {
        const cond = node.unlockCondition
        if (cond) {
          unlockMet = cond.check(metrics)
          if (!unlockMet) {
            status = 'locked'
            unlockLabel = cond.label
          } else {
            status = progressPercent > 0 ? 'in-progress' : 'pending'
          }
        } else {
          status = progressPercent > 0 ? 'in-progress' : 'pending'
        }
      }

      return {
        ...node,
        current: Math.min(current, total),
        total,
        progressPercent,
        status,
        unlockMet,
        unlockLabel,
        ...STATUS_CONFIG[status]
      }
    })

    return { pathNodes }
  },

  getClassifyReadInfo() {
    const classifyRecords = app.getClassifyRecords ? app.getClassifyRecords() : []
    const readTypeIds = new Set()
    classifyRecords.forEach(r => {
      if (r.typeId) readTypeIds.add(r.typeId)
    })
    const total = TRASH_TYPES.length
    const read = readTypeIds.size
    const percent = Math.min(Math.floor((read / total) * 100), 100)
    return { read, total, percent }
  },

  getSortPracticeInfo() {
    const classifyRecords = app.getClassifyRecords ? app.getClassifyRecords() : []
    const wrongSortItems = getStorage('wrongSortItems', [])

    const correctCount = classifyRecords.length
    let wrongCount = 0
    if (Array.isArray(wrongSortItems)) {
      wrongCount = wrongSortItems.reduce((sum, item) => sum + (item.wrongCount || 1), 0)
    }

    const count = correctCount + wrongCount
    const target = 10
    const accuracy = count > 0 ? Math.floor((correctCount / count) * 100) : 0
    return { count, target, accuracy, correctCount, wrongCount }
  },

  getQuizInfo() {
    const chaptersProgress = getStorage('chaptersProgress', {})
    let completed = 0
    QUIZ_CHAPTERS.forEach(chapter => {
      const progress = chaptersProgress[chapter.id] || 0
      if (progress >= 80) {
        completed++
      }
    })

    const quizRecords = app.getQuizRecords ? app.getQuizRecords() : []
    const chapterRecords = quizRecords.filter(r => r.quizType === 'chapter')
    let totalQuestions = 0
    let totalCorrect = 0
    chapterRecords.forEach(r => {
      totalQuestions += r.totalQuestions || 0
      totalCorrect += r.correctCount || 0
    })
    const accuracy = totalQuestions > 0 ? Math.floor((totalCorrect / totalQuestions) * 100) : 0

    return {
      completed,
      total: QUIZ_CHAPTERS.length,
      accuracy
    }
  },

  getCourseInfo() {
    const learningProgress = app.getLearningProgress ? app.getLearningProgress() : {}
    let completedChapters = 0
    let totalChapters = 0

    COURSES.forEach(course => {
      totalChapters += course.totalChapters || 0
      const progress = learningProgress[course.id]
      if (progress && progress.completedChapters) {
        completedChapters += progress.completedChapters.length
      }
    })

    return { completed: completedChapters, total: totalChapters }
  },

  getGameInfo() {
    const gameRecords = app.getGameRecords ? app.getGameRecords() : []
    const playedTypes = new Set()
    gameRecords.forEach(r => {
      if (r.gameType) playedTypes.add(r.gameType)
    })
    return {
      played: playedTypes.size,
      total: GAME_TYPES.length
    }
  },

  detectWeakAreas(metrics) {
    const weakAreas = []
    const { categoryStats, wrongByChapter, quizAccuracy, sortAccuracy } = metrics

    const CHAPTER_NAMES = { 1: '可回收物', 2: '有害垃圾', 3: '厨余垃圾', 4: '其他垃圾', 5: '综合知识' }
    const CHAPTER_COLORS = { 1: '#4A90D9', 2: '#E85D5D', 3: '#5BBD72', 4: '#8E8E93', 5: '#9B59B6' }

    Object.keys(wrongByChapter).forEach(chId => {
      const count = wrongByChapter[chId]
      if (count >= 3) {
        weakAreas.push({
          type: 'wrong-chapter',
          chapterId: Number(chId),
          name: CHAPTER_NAMES[chId] || '未知章节',
          color: CHAPTER_COLORS[chId] || '#8E8E93',
          count,
          message: `${CHAPTER_NAMES[chId] || '该章节'}错题${count}道，建议复习`,
          link: '/pages/quiz-wrong/quiz-wrong'
        })
      }
    })

    if (categoryStats && categoryStats.length > 0) {
      const totalClassify = categoryStats.reduce((s, c) => s + c.count, 0)
      const avgPerCategory = totalClassify / categoryStats.length
      categoryStats.forEach(cat => {
        if (cat.count < avgPerCategory * 0.5 && totalClassify > 0) {
          const exists = weakAreas.find(w => w.name === cat.name.replace('垃圾', ''))
          if (!exists) {
            weakAreas.push({
              type: 'low-classify',
              name: cat.name.replace('垃圾', ''),
              color: cat.color,
              count: cat.count,
              message: `${cat.name.replace('垃圾', '')}分类次数偏少（${cat.count}次），建议多练习`,
              link: '/pages/sort-practice/sort-practice'
            })
          }
        }
      })
    }

    if (sortAccuracy > 0 && sortAccuracy < 80) {
      weakAreas.push({
        type: 'low-accuracy',
        name: '分类练习',
        color: '#E85D5D',
        count: 0,
        message: `分类练习正确率仅${sortAccuracy}%，低于80%达标线`,
        link: '/pages/sort-practice/sort-practice'
      })
    }

    if (quizAccuracy > 0 && quizAccuracy < 80) {
      weakAreas.push({
        type: 'low-accuracy',
        name: '章节闯关',
        color: '#F39C12',
        count: 0,
        message: `闯关正确率仅${quizAccuracy}%，低于80%达标线`,
        link: '/pages/quiz-chapter/quiz-chapter'
      })
    }

    let recommendedAction = null
    if (weakAreas.length > 0) {
      const priority = weakAreas.find(w => w.type === 'wrong-chapter') || weakAreas[0]
      recommendedAction = {
        title: '推荐下一步',
        message: priority.message,
        link: priority.link,
        emoji: priority.type === 'wrong-chapter' ? '📝' : '💪'
      }
    } else {
      const inProgressNode = LEARNING_PATH_NODES.find((node, idx) => {
        const pd = this.computeProgressData(metrics)[idx]
        const pct = pd.total > 0 ? Math.floor((pd.current / pd.total) * 100) : 0
        return pct > 0 && pct < 100
      })
      if (inProgressNode) {
        recommendedAction = {
          title: '推荐下一步',
          message: `继续完成「${inProgressNode.title}」，当前进度领先`,
          link: inProgressNode.link,
          emoji: '🚀'
        }
      } else {
        const nextNode = LEARNING_PATH_NODES.find((node, idx) => {
          const pd = this.computeProgressData(metrics)[idx]
          return pd.current === 0
        })
        if (nextNode) {
          recommendedAction = {
            title: '推荐下一步',
            message: `开始「${nextNode.title}」，开启新的学习旅程`,
            link: nextNode.link,
            emoji: '🌟'
          }
        }
      }
    }

    return { weakAreas, recommendedAction }
  },

  onNodeTap(e) {
    const { item } = e.currentTarget.dataset
    if (item.status === 'locked') {
      if (item.unlockLabel) {
        showToast(`解锁条件：${item.unlockLabel}`)
      } else {
        showToast('请先完成前序学习节点')
      }
      return
    }
    if (item.link) {
      navigateTo(item.link)
    } else {
      showToast('功能开发中')
    }
  },

  onWeakAreaTap(e) {
    const { item } = e.currentTarget.dataset
    if (item.link) {
      navigateTo(item.link)
    }
  },

  onRecommendedTap() {
    const { recommendedAction } = this.data
    if (recommendedAction && recommendedAction.link) {
      navigateTo(recommendedAction.link)
    }
  },

  onPullDownRefresh() {
    this.loadPathData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  }
})
