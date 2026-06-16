require('../setup')

const { storage } = require('../setup')

global.Page = jest.fn(obj => obj)

require('../../frontend-mp/pages/quiz-chapter/quiz-chapter.js')
const pageObj = global.Page.mock.calls[0][0]
const { QUIZ_CHAPTERS, getQuestionsByChapter } = require('../../frontend-mp/utils/constants')

describe('quiz-chapter page', () => {
  let page

  beforeEach(() => {
    Object.keys(storage).forEach(key => delete storage[key])
    jest.clearAllMocks()
    page = Object.create(pageObj)
    page.setData = jest.fn(function (data) {
      Object.assign(this.data, data)
    })
    page.data = {
      chapters: [],
      userPoints: 0
    }
  })

  describe('data', () => {
    test('初始数据包含 chapters=[]', () => {
      expect(pageObj.data.chapters).toEqual([])
    })

    test('初始数据包含 userPoints=0', () => {
      expect(pageObj.data.userPoints).toBe(0)
    })
  })

  describe('loadChapters', () => {
    test('映射 QUIZ_CHAPTERS 并添加 progress', () => {
      storage.chaptersProgress = { 1: 50 }
      page.loadChapters()
      expect(page.data.chapters[0].progress).toBe(50)
      expect(page.data.chapters[1].progress).toBe(0)
    })

    test('progress >= 80 时 completed 为 true', () => {
      storage.chaptersProgress = { 1: 85 }
      page.loadChapters()
      expect(page.data.chapters[0].completed).toBe(true)
    })

    test('progress < 80 时 completed 为 false', () => {
      storage.chaptersProgress = { 1: 50 }
      page.loadChapters()
      expect(page.data.chapters[0].completed).toBe(false)
    })

    test('在 unlockedChapters 中的章节 unlocked 为 true', () => {
      storage.unlockedChapters = [1, 2]
      page.loadChapters()
      expect(page.data.chapters[0].unlocked).toBe(true)
      expect(page.data.chapters[1].unlocked).toBe(true)
    })

    test('不在 unlockedChapters 中的章节 unlocked 为 false', () => {
      storage.unlockedChapters = [1, 2]
      page.loadChapters()
      expect(page.data.chapters[2].unlocked).toBe(false)
    })

    test('默认前两个章节 unlocked', () => {
      page.loadChapters()
      expect(page.data.chapters[0].unlocked).toBe(true)
      expect(page.data.chapters[1].unlocked).toBe(true)
    })

    test('调用 getQuestionsByChapter 获取 questionCount', () => {
      page.loadChapters()
      QUIZ_CHAPTERS.forEach(ch => {
        expect(page.data.chapters.find(c => c.id === ch.id).questionCount).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('onChapterTap', () => {
    test('unlocked 为 true 时导航到 quiz-play', () => {
      page.onChapterTap({ currentTarget: { dataset: { chapter: { id: 1, name: '可回收垃圾', unlocked: true } } } })
      expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
        url: expect.stringContaining('/pages/quiz-play/quiz-play?type=chapter')
      }))
    })

    test('unlocked 为 false 时显示 toast', () => {
      page.onChapterTap({ currentTarget: { dataset: { chapter: { id: 3, name: '厨余垃圾', unlocked: false } } } })
      expect(wx.showToast).toHaveBeenCalledWith(expect.objectContaining({
        title: '请先完成前面的章节'
      }))
    })
  })
})
