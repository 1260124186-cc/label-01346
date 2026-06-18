const app = getApp()
const { COURSES } = require('../../data/courses')
const { QUIZ_CHAPTERS } = require('../../data/quiz')
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
    reward: 20,
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
    reward: 30,
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
    reward: 50,
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
    reward: 100,
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
    reward: 80,
    link: '/pages/game-hall/game-hall'
  }
]

const STATUS_CONFIG = {
  completed: {
    statusBg: 'rgba(91, 189, 114, 0.12)',
    statusColor: '#5BBD72'
  },
  'in-progress': {
    statusBg: 'rgba(243, 156, 18, 0.12)',
    statusColor: '#F39C12'
  },
  pending: {
    statusBg: 'rgba(142, 142, 147, 0.12)',
    statusColor: '#8E8E93'
  },
  locked: {
    statusBg: 'rgba(142, 142, 147, 0.08)',
    statusColor: '#B2BEC3'
  }
}

Page({
  data: {
    pathNodes: [],
    overallProgress: 0,
    completedCount: 0,
    totalCount: 5,
    earnedPoints: 0
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
    const classifyReadCount = this.getClassifyReadCount()
    const sortPracticeCount = this.getSortPracticeCount()
    const quizProgress = this.getQuizProgress()
    const courseProgress = this.getCourseProgress()
    const gameProgress = this.getGameProgress()

    const progressData = [
      { current: classifyReadCount, total: 4 },
      { current: sortPracticeCount, total: 5 },
      { current: quizProgress.completed, total: quizProgress.total },
      { current: courseProgress.completed, total: courseProgress.total },
      { current: gameProgress, total: 3 }
    ]

    let lastCompletedIndex = -1
    const pathNodes = LEARNING_PATH_NODES.map((node, index) => {
      const { current, total } = progressData[index]
      const progressPercent = total > 0 ? Math.min(Math.floor((current / total) * 100), 100) : 0
      const isCompleted = progressPercent >= 100

      if (isCompleted) {
        lastCompletedIndex = index
      }

      let status = 'pending'
      if (isCompleted) {
        status = 'completed'
      } else if (index === 0 || lastCompletedIndex >= index - 1) {
        status = progressPercent > 0 ? 'in-progress' : 'pending'
      } else {
        status = 'locked'
      }

      return {
        ...node,
        current: Math.min(current, total),
        total,
        progressPercent,
        status,
        ...STATUS_CONFIG[status]
      }
    })

    const completedCount = pathNodes.filter(n => n.status === 'completed').length
    const overallProgress = Math.floor((completedCount / pathNodes.length) * 100)
    const earnedPoints = pathNodes
      .filter(n => n.status === 'completed')
      .reduce((sum, n) => sum + (n.reward || 0), 0)

    this.setData({
      pathNodes,
      overallProgress,
      completedCount,
      totalCount: pathNodes.length,
      earnedPoints
    })
  },

  getClassifyReadCount() {
    const classifyProgress = getStorage('classifyReadProgress', {})
    return Object.keys(classifyProgress).filter(k => classifyProgress[k]).length
  },

  getSortPracticeCount() {
    const practiceRecords = getStorage('sortPracticeRecords', [])
    return Array.isArray(practiceRecords) ? practiceRecords.length : 0
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
    return {
      completed,
      total: QUIZ_CHAPTERS.length
    }
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

    return {
      completed: completedChapters,
      total: totalChapters
    }
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
      showToast('请先完成前序学习节点')
      return
    }

    if (item.link) {
      navigateTo(item.link)
    } else {
      showToast('功能开发中')
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
