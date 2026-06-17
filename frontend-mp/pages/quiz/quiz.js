/**
 * 知识问答主页面
 * @description 包含每日一练、章节闯关、错题本、难度分层入口
 */
const app = getApp()
const { QUIZ_CHAPTERS, QUIZ_DIFFICULTIES, QUIZ_TIMED_CONFIG, getDailyQuestions } = require('../../utils/constants')
const { navigateTo, showToast, getStorage, setStorage } = require('../../utils/util')

Page({
  data: {
    userPoints: 0,
    dailyCompleted: false,
    isSignedToday: false,
    streakDays: 0,
    wrongCount: 0,
    chapters: QUIZ_CHAPTERS,
    difficulties: QUIZ_DIFFICULTIES,
    quickEntries: [
      {
        id: 'daily',
        name: '每日一练',
        icon: '📅',
        color: '#5BBD72',
        description: '每天5题，轻松学习',
        badge: ''
      },
      {
        id: 'chapter',
        name: '章节闯关',
        icon: '🎯',
        color: '#4A90D9',
        description: '按章节系统学习',
        badge: ''
      },
      {
        id: 'wrong',
        name: '错题本',
        icon: '📝',
        color: '#E85D5D',
        description: '复习做错的题目',
        badge: ''
      },
      {
        id: 'difficulty',
        name: '难度分层',
        icon: '⭐',
        color: '#F39C12',
        description: '选择适合的难度',
        badge: ''
      },
      {
        id: 'timed',
        name: '限时挑战',
        icon: '⏱️',
        color: '#9B59B6',
        description: '15秒每题，正确率加成',
        badge: '',
        timePerQuestion: QUIZ_TIMED_CONFIG.timePerQuestion,
        totalQuestions: QUIZ_TIMED_CONFIG.totalQuestions
      }
    ]
  },

  onLoad() {
    console.log('[Quiz] 页面加载')
    this.initPageData()
  },

  onShow() {
    console.log('[Quiz] 页面显示')
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

    this.checkDailyCompleted()
    this.loadWrongCount()
    this.loadChaptersProgress()
  },

  checkDailyCompleted() {
    const dailyCompleted = app.isTodayDailyQuizDone()
    const isSignedToday = app.isTodaySignedIn()
    const streakDays = app.getStreakDays()

    this.setData({
      dailyCompleted,
      isSignedToday,
      streakDays
    })

    const quickEntries = this.data.quickEntries.map(item => {
      if (item.id === 'daily') {
        return {
          ...item,
          badge: dailyCompleted ? '已完成' : ''
        }
      }
      return item
    })

    this.setData({ quickEntries })
  },

  loadWrongCount() {
    const wrongQuestions = getStorage('wrongQuestions', [])
    const wrongCount = wrongQuestions.length

    this.setData({
      wrongCount
    })

    const quickEntries = this.data.quickEntries.map(item => {
      if (item.id === 'wrong') {
        return {
          ...item,
          badge: wrongCount > 0 ? `${wrongCount}题` : ''
        }
      }
      return item
    })

    this.setData({ quickEntries })
  },

  loadChaptersProgress() {
    const chaptersProgress = getStorage('chaptersProgress', {})
    const chapters = this.data.chapters.map(chapter => {
      const progress = chaptersProgress[chapter.id] || 0
      const completed = progress >= 100
      return {
        ...chapter,
        progress,
        completed
      }
    })

    this.setData({ chapters })
  },

  onQuickEntryTap(e) {
    const { id } = e.currentTarget.dataset
    console.log('[Quiz] 点击快捷入口', id)

    switch (id) {
      case 'daily':
        this.goToDailyQuiz()
        break
      case 'chapter':
        this.goToChapterQuiz()
        break
      case 'wrong':
        this.goToWrongQuestions()
        break
      case 'difficulty':
        this.goToDifficultyQuiz()
        break
      case 'timed':
        this.goToTimedQuiz()
        break
    }
  },

  goToDailyQuiz() {
    if (this.data.dailyCompleted) {
      showToast('今日已完成，明天再来吧')
      return
    }
    navigateTo('/pages/quiz-daily/quiz-daily')
  },

  goToSignIn() {
    navigateTo('/pages/signin/signin')
  },

  goToChapterQuiz() {
    navigateTo('/pages/quiz-chapter/quiz-chapter')
  },

  goToWrongQuestions() {
    if (this.data.wrongCount === 0) {
      showToast('暂无错题，继续加油')
      return
    }
    navigateTo('/pages/quiz-wrong/quiz-wrong')
  },

  goToDifficultyQuiz() {
    navigateTo('/pages/quiz-difficulty/quiz-difficulty')
  },

  goToTimedQuiz() {
    navigateTo('/pages/quiz-play/quiz-play', {
      type: 'timed',
      isTimed: 'true'
    })
  },

  onChapterTap(e) {
    const { chapter } = e.currentTarget.dataset
    console.log('[Quiz] 点击章节', chapter.name)

    if (!chapter.unlocked) {
      showToast('请先完成前面的章节')
      return
    }

    navigateTo('/pages/quiz-play/quiz-play', {
      type: 'chapter',
      chapterId: chapter.id,
      chapterName: chapter.name
    })
  },

  onDifficultyTap(e) {
    const { difficulty } = e.currentTarget.dataset
    console.log('[Quiz] 点击难度', difficulty.name)

    navigateTo('/pages/quiz-play/quiz-play', {
      type: 'difficulty',
      difficulty: difficulty.id,
      difficultyName: difficulty.name
    })
  },

  onPullDownRefresh() {
    console.log('[Quiz] 下拉刷新')
    this.refreshData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
