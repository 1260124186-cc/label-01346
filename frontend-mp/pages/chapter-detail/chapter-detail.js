const app = getApp()
const { getCourseById } = require('../../data/courses')
const { navigateTo, navigateBack, showToast, showSuccess, getStorage, setStorage } = require('../../utils/util')

Page({
  data: {
    courseId: '',
    chapterId: '',
    course: null,
    chapter: null,
    chapterIndex: 0,
    totalChapters: 0,
    isFirstChapter: true,
    isLastChapter: false,
    isCompleted: false,
    completedCount: 0,
    themeColor: '#5BBD72',
    nextBtnIcon: '→',
    nextBtnText: '标记完成并下一章'
  },

  onLoad(options) {
    console.log('[ChapterDetail] 页面加载', options)
    const { courseId, chapterId } = options
    if (!courseId || !chapterId) {
      showToast('参数错误')
      setTimeout(() => navigateBack(), 1500)
      return
    }
    this.setData({ courseId, chapterId })
    this.initPageData()
  },

  onShow() {
    console.log('[ChapterDetail] 页面显示')
    this.refreshProgress()
  },

  initPageData() {
    const { courseId, chapterId } = this.data
    const course = getCourseById(courseId)

    if (!course) {
      showToast('课程不存在')
      setTimeout(() => navigateBack(), 1500)
      return
    }

    const chapters = course.chapters || []
    const chapterIndex = chapters.findIndex(ch => ch.id === chapterId)
    const chapter = chapters[chapterIndex]

    if (!chapter) {
      showToast('章节不存在')
      setTimeout(() => navigateBack(), 1500)
      return
    }

    const isFirstChapter = chapterIndex === 0
    const isLastChapter = chapterIndex === chapters.length - 1
    const themeColor = course.color || '#5BBD72'

    this.setData({
      course,
      chapter,
      chapterIndex,
      totalChapters: chapters.length,
      isFirstChapter,
      isLastChapter,
      themeColor
    })

    wx.setNavigationBarTitle({
      title: chapter.title || '章节详情'
    })

    this.refreshProgress()
  },

  updateNextButtonState() {
    const { isLastChapter, isCompleted } = this.data
    let nextBtnIcon = '→'
    let nextBtnText = '标记完成并下一章'

    if (isLastChapter) {
      nextBtnIcon = '🎉'
      nextBtnText = '完成课程，返回详情'
    } else if (isCompleted) {
      nextBtnIcon = '✓'
      nextBtnText = '已完成，下一章'
    }

    this.setData({ nextBtnIcon, nextBtnText })
  },

  refreshProgress() {
    const { courseId, chapterId, totalChapters } = this.data
    const learningProgress = getStorage('learningProgress', {})
    const courseProgress = learningProgress[courseId] || { completedChapters: [] }
    const completedChapters = courseProgress.completedChapters || []
    const isCompleted = completedChapters.includes(chapterId)

    this.setData({
      isCompleted,
      completedCount: completedChapters.length
    }, () => {
      this.updateNextButtonState()
    })

    if (!app.globalData.learningProgress) {
      app.globalData.learningProgress = {}
    }
    app.globalData.learningProgress[courseId] = courseProgress
  },

  onPrevChapter() {
    const { course, chapterIndex } = this.data
    if (chapterIndex <= 0) return

    const prevChapter = course.chapters[chapterIndex - 1]
    this.setData({
      chapterId: prevChapter.id,
      chapter: prevChapter,
      chapterIndex: chapterIndex - 1,
      isFirstChapter: chapterIndex - 1 === 0,
      isLastChapter: false
    }, () => {
      this.updateNextButtonState()
    })

    wx.pageScrollTo({ scrollTop: 0, duration: 300 })
    wx.setNavigationBarTitle({ title: prevChapter.title || '章节详情' })
    this.refreshProgress()
  },

  onMarkCompleteAndNext() {
    const { courseId, chapterId, course, chapterIndex, isLastChapter, isCompleted } = this.data

    const learningProgress = getStorage('learningProgress', {})
    if (!learningProgress[courseId]) {
      learningProgress[courseId] = { completedChapters: [] }
    }
    const courseProgress = learningProgress[courseId]
    const completedChapters = courseProgress.completedChapters || []

    if (!completedChapters.includes(chapterId)) {
      completedChapters.push(chapterId)
      courseProgress.completedChapters = completedChapters
      learningProgress[courseId] = courseProgress
      setStorage('learningProgress', learningProgress)

      if (!app.globalData.learningProgress) {
        app.globalData.learningProgress = {}
      }
      app.globalData.learningProgress[courseId] = courseProgress
    }

    if (!isCompleted) {
      const chapterPoints = Math.floor((course.pointsReward || 200) / (course.totalChapters || 1))
      if (chapterPoints > 0) {
        app.updateUserPoints(chapterPoints, {
          category: 'course',
          title: '课程学习',
          desc: `完成《${course.title}》-${this.data.chapter.title}`,
          emoji: '📚'
        })
      }
      showSuccess(`章节完成 +${chapterPoints}分`)
    }

    if (isLastChapter) {
      setTimeout(() => {
        navigateBack()
      }, 800)
    } else {
      const nextChapter = course.chapters[chapterIndex + 1]
      const nextIndex = chapterIndex + 1
      setTimeout(() => {
        this.setData({
          chapterId: nextChapter.id,
          chapter: nextChapter,
          chapterIndex: nextIndex,
          isFirstChapter: false,
          isLastChapter: nextIndex === course.chapters.length - 1,
          isCompleted: false,
          completedCount: completedChapters.length
        }, () => {
          this.updateNextButtonState()
        })
        wx.pageScrollTo({ scrollTop: 0, duration: 300 })
        wx.setNavigationBarTitle({ title: nextChapter.title || '章节详情' })
      }, 800)
    }
  },

  onBackToCourse() {
    navigateBack()
  }
})
