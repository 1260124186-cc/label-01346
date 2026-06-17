const app = getApp()
const { getCourseById } = require('../../data/courses')
const { navigateTo, showToast } = require('../../utils/util')

Page({
  data: {
    courseId: null,
    course: null,
    progress: {
      completedChapters: [],
      lastChapter: null,
      lastTime: null
    },
    chaptersWithStatus: [],
    completedCount: 0,
    totalCount: 0,
    progressPercent: 0,
    nextChapterId: null,
    allCompleted: false,
    typeMap: {
      article: { icon: '📖', name: '图文' },
      video: { icon: '🎬', name: '视频' }
    }
  },

  onLoad(options) {
    if (options.courseId) {
      this.setData({ courseId: options.courseId })
      this.loadCourseDetail()
    }
  },

  onShow() {
    if (this.data.courseId) {
      this.loadCourseDetail()
    }
  },

  loadCourseDetail() {
    const course = getCourseById(this.data.courseId)
    if (!course) {
      showToast('课程不存在')
      return
    }

    wx.setNavigationBarTitle({ title: course.title })

    const progress = this.getLearningProgress(course.id)
    const chaptersWithStatus = this.computeChaptersStatus(course.chapters, progress)
    const completedCount = progress.completedChapters.length
    const totalCount = course.chapters.length
    const progressPercent = totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0
    const allCompleted = completedCount === totalCount

    let nextChapterId = null
    const nextChapter = chaptersWithStatus.find(c => !c.isCompleted && !c.isLocked)
    if (nextChapter) {
      nextChapterId = nextChapter.id
    } else if (!allCompleted) {
      const firstIncomplete = chaptersWithStatus.find(c => !c.isCompleted)
      if (firstIncomplete) {
        nextChapterId = firstIncomplete.id
      }
    }

    this.setData({
      course,
      progress,
      chaptersWithStatus,
      completedCount,
      totalCount,
      progressPercent,
      nextChapterId,
      allCompleted
    })
  },

  getLearningProgress(courseId) {
    const allProgress = wx.getStorageSync('learningProgress') || {}
    return allProgress[courseId] || {
      completedChapters: [],
      lastChapter: null,
      lastTime: null
    }
  },

  saveLearningProgress(courseId, progress) {
    const allProgress = wx.getStorageSync('learningProgress') || {}
    allProgress[courseId] = progress
    wx.setStorageSync('learningProgress', allProgress)
  },

  computeChaptersStatus(chapters, progress) {
    const completedSet = new Set(progress.completedChapters)
    
    return chapters.map((chapter, index) => {
      const isCompleted = completedSet.has(chapter.id)
      let isLocked = false
      if (index > 0) {
        const prevChapter = chapters[index - 1]
        if (!completedSet.has(prevChapter.id)) {
          isLocked = true
        }
      }

      return {
        ...chapter,
        orderNum: index + 1,
        isCompleted,
        isLocked
      }
    })
  },

  onChapterTap(e) {
    const { chapterid, islocked } = e.currentTarget.dataset

    if (islocked) {
      showToast('请先完成上一章节')
      return
    }

    navigateTo(`/pages/chapter-detail/chapter-detail?courseId=${this.data.courseId}&chapterId=${chapterid}`)
  },

  onContinueLearn() {
    const { progress, chaptersWithStatus, courseId, nextChapterId, allCompleted } = this.data

    if (allCompleted) {
      this.onGoQuiz()
      return
    }

    let targetChapterId = nextChapterId

    if (!targetChapterId && progress.lastChapter) {
      const lastChapter = chaptersWithStatus.find(c => c.id === progress.lastChapter)
      if (lastChapter && !lastChapter.isLocked) {
        targetChapterId = progress.lastChapter
      }
    }

    if (!targetChapterId) {
      const firstAvailable = chaptersWithStatus.find(c => !c.isLocked)
      if (firstAvailable) {
        targetChapterId = firstAvailable.id
      }
    }

    if (targetChapterId) {
      navigateTo(`/pages/chapter-detail/chapter-detail?courseId=${courseId}&chapterId=${targetChapterId}`)
    }
  },

  onGoQuiz() {
    const { course } = this.data
    if (!course || !course.quizChapterId) {
      showToast('暂未关联测验')
      return
    }
    navigateTo(`/pages/quiz-play/quiz-play?type=chapter&chapterId=${course.quizChapterId}`)
  },

  onShareAppMessage() {
    const { course } = this.data
    return {
      title: course ? `${course.title} - 环保学习课程` : '环保学习课程',
      path: course.id ? `/pages/course-detail/course-detail?courseId=${course.id}` : '/pages/index/index'
    }
  }
})
