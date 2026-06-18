/**
 * 难度分层页面
 * @description 按难度选择题目进行练习
 */
const app = getApp()
const { QUIZ_DIFFICULTIES, getQuestionsByDifficulty } = require('../../utils/constants')
const { navigateTo, showToast, getStorage, setStorage } = require('../../utils/util')

Page({
  data: {
    difficulties: [],
    userPoints: 0
  },

  onLoad() {
    console.log('[QuizDifficulty] 页面加载')
    this.initPageData()
  },

  onShow() {
    console.log('[QuizDifficulty] 页面显示')
    this.refreshData()
  },

  initPageData() {
    this.refreshData()
  },

  refreshData() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userPoints: userInfo.points || 0
      })
    }

    this.loadDifficulties()
  },

  loadDifficulties() {
    const tagTextMap = { easy: '入门推荐', medium: '进阶挑战', hard: '高手专属' }
    const difficulties = QUIZ_DIFFICULTIES.map(diff => {
      const questions = getQuestionsByDifficulty(diff.id)
      const questionCount = questions.length

      const bestScore = getStorage(`difficultyBest_${diff.id}`, 0)
      const totalAttempts = getStorage(`difficultyAttempts_${diff.id}`, 0)

      return {
        ...diff,
        questionCount,
        bestScore,
        totalAttempts,
        tagText: tagTextMap[diff.id] || '入门推荐'
      }
    })

    this.setData({ difficulties })
  },

  onDifficultyTap(e) {
    const { difficulty } = e.currentTarget.dataset
    console.log('[QuizDifficulty] 点击难度', difficulty.name)

    if (difficulty.questionCount === 0) {
      showToast('该难度暂无题目')
      return
    }

    navigateTo('/pages/quiz-play/quiz-play', {
      type: 'difficulty',
      difficulty: difficulty.id,
      difficultyName: difficulty.name
    })
  },

  onPullDownRefresh() {
    console.log('[QuizDifficulty] 下拉刷新')
    this.refreshData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
