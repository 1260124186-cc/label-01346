/**
 * 章节闯关页面
 * @description 按章节学习垃圾分类知识
 */
const app = getApp()
const { QUIZ_CHAPTERS, QUIZ_BOSS_CONFIG, getQuestionsByChapter } = require('../../utils/constants')
const { navigateTo, showToast, getStorage, setStorage } = require('../../utils/util')

Page({
  data: {
    chapters: [],
    userPoints: 0
  },

  onLoad() {
    console.log('[QuizChapter] 页面加载')
    this.initPageData()
  },

  onShow() {
    console.log('[QuizChapter] 页面显示')
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

    this.loadChapters()
  },

  loadChapters() {
    const chaptersProgress = getStorage('chaptersProgress', {})
    const unlockedChapters = getStorage('unlockedChapters', [1, 2])
    const bossCompleted = getStorage('bossCompleted', {})

    const chapters = QUIZ_CHAPTERS.map((chapter, index) => {
      const progress = chaptersProgress[chapter.id] || 0
      const completed = progress >= 80
      const unlocked = unlockedChapters.includes(chapter.id) || index < 2

      const questions = getQuestionsByChapter(chapter.id)
      const questionCount = questions.length

      const bossUnlocked = completed
      const isBossCompleted = bossCompleted[chapter.id] || false

      return {
        ...chapter,
        progress,
        completed,
        unlocked,
        questionCount,
        bossUnlocked,
        isBossCompleted,
        bossConfig: QUIZ_BOSS_CONFIG
      }
    })

    const completedCount = chapters.filter(c => c.completed).length
    const totalCount = chapters.length

    this.setData({
      chapters,
      completedCount,
      totalCount
    })
  },

  onChapterTap(e) {
    const { chapter } = e.currentTarget.dataset
    console.log('[QuizChapter] 点击章节', chapter.name)

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

  onBossTap(e) {
    const { chapter } = e.currentTarget.dataset
    console.log('[QuizChapter] 点击Boss关', chapter.name)

    if (!chapter.bossUnlocked) {
      showToast('请先完成章节学习（正确率≥80%）')
      return
    }

    navigateTo('/pages/quiz-play/quiz-play', {
      type: 'chapter',
      chapterId: chapter.id,
      chapterName: chapter.name,
      isBoss: 'true'
    })
  },

  onPullDownRefresh() {
    console.log('[QuizChapter] 下拉刷新')
    this.refreshData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
