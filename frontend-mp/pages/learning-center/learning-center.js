/**
 * 学习中心页面
 * @description 展示用户学习统计、分类Tab、课程卡片列表
 */
const app = getApp()
const { COURSE_CATEGORIES, COURSES, COURSE_DIFFICULTIES, COURSE_SCENES } = require('../../data/courses')
const { navigateTo, getStorage, formatNumber } = require('../../utils/util')

Page({
  data: {
    userStats: {
      completedCourses: 0,
      certificates: 0,
      totalMinutes: 0,
      points: 0
    },
    categories: [],
    activeCategoryId: 'all',
    difficulties: COURSE_DIFFICULTIES,
    scenes: COURSE_SCENES,
    courseList: []
  },

  onLoad() {
    console.log('[LearningCenter] 页面加载')
    this.initCategories()
    this.loadCourseList()
  },

  onShow() {
    console.log('[LearningCenter] 页面显示')
    this.loadUserStats()
    this.loadCourseList()
  },

  initCategories() {
    const categories = [
      { id: 'all', name: '全部', icon: '📚', color: '#5BBD72' },
      ...COURSE_CATEGORIES
    ]
    this.setData({ categories })
  },

  loadUserStats() {
    const userInfo = app.globalData.userInfo || {}
    const learningProgress = getStorage('learningProgress', {})

    let completedCourses = 0
    let totalMinutes = 0
    let certificates = 0

    COURSES.forEach(course => {
      const progress = learningProgress[course.id]
      if (progress) {
        const completedChapters = progress.completedChapters || []
        const progressPercent = course.totalChapters > 0
          ? Math.floor((completedChapters.length / course.totalChapters) * 100)
          : 0

        if (progressPercent >= 100) {
          completedCourses++
          if (course.certificateName) {
            certificates++
          }
        }

        completedChapters.forEach(chapId => {
          const chapters = course.chapters || []
          const chapter = chapters.find(c => c.id === chapId)
          if (chapter && chapter.duration) {
            totalMinutes += chapter.duration
          }
        })
      }
    })

    this.setData({
      userStats: {
        completedCourses,
        certificates,
        totalMinutes,
        points: userInfo.points || 0
      }
    })
  },

  loadCourseList() {
    const { activeCategoryId } = this.data
    const learningProgress = getStorage('learningProgress', {})
    const difficultyMap = {}
    COURSE_DIFFICULTIES.forEach(d => {
      difficultyMap[d.id] = d
    })

    let filteredCourses = COURSES
    if (activeCategoryId !== 'all') {
      filteredCourses = COURSES.filter(c => c.categoryId === activeCategoryId)
    }

    const courseList = filteredCourses.map(course => {
      const progress = learningProgress[course.id] || {}
      const completedChapters = progress.completedChapters || []
      const progressPercent = course.totalChapters > 0
        ? Math.floor((completedChapters.length / course.totalChapters) * 100)
        : 0
      const difficulty = difficultyMap[course.difficulty] || {}

      return {
        ...course,
        difficultyName: difficulty.name || '',
        difficultyColor: difficulty.color || '#8E8E93',
        progressPercent,
        completedChaptersCount: completedChapters.length,
        studentCountText: formatNumber(course.studentCount || 0)
      }
    })

    this.setData({ courseList })
  },

  onCategoryTap(e) {
    const { id } = e.currentTarget.dataset
    console.log('[LearningCenter] 切换分类', id)
    this.setData({ activeCategoryId: id }, () => {
      this.loadCourseList()
    })
  },

  onCourseTap(e) {
    const { courseId } = e.currentTarget.dataset
    console.log('[LearningCenter] 点击课程', courseId)
    navigateTo('/pages/course-detail/course-detail', { courseId })
  },

  onPullDownRefresh() {
    console.log('[LearningCenter] 下拉刷新')
    this.loadUserStats()
    this.loadCourseList()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  }
})
