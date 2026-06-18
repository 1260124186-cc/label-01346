const app = getApp()
const { COURSES } = require('../../data/courses')
const { QUIZ_CHAPTERS, QUIZ_QUESTIONS } = require('../../data/quiz')
const { navigateTo, getStorage, showToast } = require('../../utils/util')

const LEARNING_PATH_NODES = [
  {
    id: 'read-knowledge',
    title: '阅读分类常识',
    description: '系统学习四类垃圾的基本知识，了解分类标准和投放要求',
    emoji: '📖',
    color: '#4A90D9',
    colorDark: '#357ABD',
    unit: '篇',
    total: 4,
    reward: { points: 20, badge: '📚', badgeName: '知识先锋' },
    unlockCondition: null,
    link: '/pages/classify/classify'
  },
  {
    id: 'sort-practice',
    title: '完成分类练习',
    description: '通过实际分类练习巩固知识，提高分类准确率',
    emoji: '♻️',
    color: '#5BBD72',
    colorDark: '#4AA862',
    unit: '次',
    total: 5,
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
    total: QUIZ_CHAPTERS.length,
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
    total: 0,
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
    unit: '关',
    total: 3,
    reward: { points: 80, badge: '🎮', badgeName: '游戏王者' },
    unlockCondition: {
      nodeId: 'course-chapter',
      label: '课程章节完成率 ≥ 60%',
      check(data) { return data.courseProgress >= 60 }
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
    console.log('[LearningPath] 页面加载')
    this.loadPathData()
  },

  onShow() {
    console.log('[LearningPath] 页面显示')
    this.loadPathData()
  },

  loadPathData() {
    const metrics = this.gatherAllMetrics()
    const progressData = this.computeProgressData(metrics)
    const { pathNodes, lastCompletedIndex } = this.buildPathNodes(progressData, metrics)
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
    const classifyReadCount = this.getClassifyReadCount()
    const readProgress = Math.min(Math.floor((classifyReadCount / 4) * 100), 100)

    const sortPracticeCount = this.getSortPracticeCount()
    const sortAccuracy = this.getSortAccuracy()

    const quizProgress = this.getQuizProgress()
    const quizAccuracy = this.getQuizAccuracy()

    const courseProgress = this.getCourseProgress()
    const coursePercent = courseProgress.total > 0
      ? Math.min(Math.floor((courseProgress.completed / courseProgress.total) * 100), 100)
      : 0

    const gameProgress = this.getGameProgress()

    const categoryStats = app.getCategoryStats ? app.getCategoryStats() : []
    const wrongQuestions = app.getWrongQuestions ? app.getWrongQuestions() : []
    const wrongByChapter = {}
    wrongQuestions.forEach(q => {
      const ch = q.chapterId || 0
      wrongByChapter[ch] = (wrongByChapter[ch] || 0) + (q.wrongCount || 1)
    })

    return {
      readProgress,
      classifyReadCount,
      sortPracticeCount,
      sortAccuracy,
      quizProgress,
      quizAccuracy,
      courseProgress,
      coursePercent,
      gameProgress,
      categoryStats,
      wrongQuestions,
      wrongByChapter
    }
  },

  computeProgressData(metrics) {
    return [
      { current: metrics.classifyReadCount, total: 4 },
      { current: metrics.sortPracticeCount, total: 5 },
      { current: metrics.quizProgress.completed, total: metrics.quizProgress.total },
      { current: metrics.courseProgress.completed, total: metrics.courseProgress.total },
      { current: metrics.gameProgress, total: 3 }
    ]
  },

  buildPathNodes(progressData, metrics) {
    let lastCompletedIndex = -1
    const pathNodes = LEARNING_PATH_NODES.map((node, index) => {
      const { current, total } = progressData[index]
      const progressPercent = total > 0 ? Math.min(Math.floor((current / total) * 100), 100) : 0
      const isCompleted = progressPercent >= 100

      if (isCompleted) {
        lastCompletedIndex = index
      }

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

    return { pathNodes, lastCompletedIndex }
  },

  detectWeakAreas(metrics) {
    const weakAreas = []
    const { categoryStats, wrongByChapter, quizAccuracy, sortAccuracy, readProgress, coursePercent } = metrics

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

  getClassifyReadCount() {
    const classifyProgress = getStorage('classifyReadProgress', {})
    return Object.keys(classifyProgress).filter(k => classifyProgress[k]).length
  },

  getSortPracticeCount() {
    const practiceRecords = getStorage('sortPracticeRecords', [])
    return Array.isArray(practiceRecords) ? practiceRecords.length : 0
  },

  getSortAccuracy() {
    const practiceRecords = getStorage('sortPracticeRecords', [])
    if (!Array.isArray(practiceRecords) || practiceRecords.length === 0) return 0
    const total = practiceRecords.length
    const correct = practiceRecords.filter(r => r.isCorrect || r.correct).length
    return Math.floor((correct / total) * 100)
  },

  getQuizProgress() {
    const quizProgress = getStorage('quizChapterProgress', {})
    let completed = 0
    QUIZ_CHAPTERS.forEach(chapter => {
      const progress = quizProgress[chapter.id]
      if (progress && progress.completed) {
        completed++
      }
    })
    return { completed, total: QUIZ_CHAPTERS.length }
  },

  getQuizAccuracy() {
    const quizRecords = app.getQuizRecords ? app.getQuizRecords() : []
    if (!Array.isArray(quizRecords) || quizRecords.length === 0) return 0
    let totalQuestions = 0
    let totalCorrect = 0
    quizRecords.forEach(r => {
      totalQuestions += r.totalQuestions || 0
      totalCorrect += r.correctCount || 0
    })
    return totalQuestions > 0 ? Math.floor((totalCorrect / totalQuestions) * 100) : 0
  },

  getCourseProgress() {
    const learningProgress = getStorage('learningProgress', {})
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

  getGameProgress() {
    const gameProgress = getStorage('gameProgress', {})
    let completedLevels = 0
    if (gameProgress.catch) completedLevels++
    if (gameProgress.conveyor) completedLevels++
    if (gameProgress.match) completedLevels++
    return completedLevels
  },

  onNodeTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[LearningPath] 点击节点', item.title)

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
    console.log('[LearningPath] 点击薄弱项', item.name)
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
    console.log('[LearningPath] 下拉刷新')
    this.loadPathData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  }
})
