require('../setup')

const { storage } = require('../setup')

global.Page = jest.fn(obj => obj)

require('../../frontend-mp/pages/quiz/quiz.js')
const pageObj = global.Page.mock.calls[0][0]
const { QUIZ_CHAPTERS, QUIZ_DIFFICULTIES } = require('../../frontend-mp/utils/constants')

describe('quiz page', () => {
  let page

  beforeEach(() => {
    Object.keys(storage).forEach(key => delete storage[key])
    jest.clearAllMocks()
    page = Object.create(pageObj)
    page.setData = jest.fn(function (data) {
      Object.assign(this.data, data)
    })
    page.data = {
      userPoints: 0,
      dailyCompleted: false,
      wrongCount: 0,
      chapters: QUIZ_CHAPTERS,
      difficulties: QUIZ_DIFFICULTIES,
      quickEntries: [
        { id: 'daily', name: '每日一练', icon: '📅', color: '#5BBD72', description: '每天5题，轻松学习', badge: '' },
        { id: 'chapter', name: '章节闯关', icon: '🎯', color: '#4A90D9', description: '按章节系统学习', badge: '' },
        { id: 'wrong', name: '错题本', icon: '📝', color: '#E85D5D', description: '复习做错的题目', badge: '' },
        { id: 'difficulty', name: '难度分层', icon: '⭐', color: '#F39C12', description: '选择适合的难度', badge: '' }
      ]
    }
  })

  describe('data', () => {
    test('初始数据包含 dailyCompleted=false', () => {
      expect(pageObj.data.dailyCompleted).toBe(false)
    })

    test('初始数据包含 wrongCount=0', () => {
      expect(pageObj.data.wrongCount).toBe(0)
    })

    test('初始数据包含 chapters', () => {
      expect(pageObj.data.chapters).toBeDefined()
    })

    test('初始数据包含 difficulties', () => {
      expect(pageObj.data.difficulties).toBeDefined()
    })

    test('quickEntries 包含4个入口', () => {
      expect(pageObj.data.quickEntries).toHaveLength(4)
    })

    test('quickEntries 包含 daily/chapter/wrong/difficulty', () => {
      const ids = pageObj.data.quickEntries.map(e => e.id)
      expect(ids).toEqual(['daily', 'chapter', 'wrong', 'difficulty'])
    })
  })

  describe('checkDailyCompleted', () => {
    test('storage中无日期时 dailyCompleted 为 false', () => {
      page.checkDailyCompleted()
      expect(page.data.dailyCompleted).toBe(false)
    })

    test('storage中日期为今天时 dailyCompleted 为 true', () => {
      const today = new Date().toDateString()
      storage.lastDailyQuizDate = today
      page.checkDailyCompleted()
      expect(page.data.dailyCompleted).toBe(true)
    })

    test('storage中日期非今天时 dailyCompleted 为 false', () => {
      storage.lastDailyQuizDate = 'Mon Jan 01 2024'
      page.checkDailyCompleted()
      expect(page.data.dailyCompleted).toBe(false)
    })

    test('dailyCompleted 为 true 时 daily 入口 badge 为 已完成', () => {
      const today = new Date().toDateString()
      storage.lastDailyQuizDate = today
      page.checkDailyCompleted()
      const setDataCalls = page.setData.mock.calls
      const lastQuickEntriesCall = setDataCalls.find(c => c[0].quickEntries)
      expect(lastQuickEntriesCall[0].quickEntries.find(e => e.id === 'daily').badge).toBe('已完成')
    })

    test('dailyCompleted 为 false 时 daily 入口 badge 为空', () => {
      page.checkDailyCompleted()
      const setDataCalls = page.setData.mock.calls
      const lastQuickEntriesCall = setDataCalls.find(c => c[0].quickEntries)
      expect(lastQuickEntriesCall[0].quickEntries.find(e => e.id === 'daily').badge).toBe('')
    })
  })

  describe('loadWrongCount', () => {
    test('无错题时 wrongCount 为 0', () => {
      page.loadWrongCount()
      expect(page.data.wrongCount).toBe(0)
    })

    test('有错题时 wrongCount 为错题数量', () => {
      storage.wrongQuestions = [{ id: 1 }, { id: 2 }, { id: 3 }]
      page.loadWrongCount()
      expect(page.data.wrongCount).toBe(3)
    })

    test('有错题时 wrong 入口 badge 显示数量', () => {
      storage.wrongQuestions = [{ id: 1 }, { id: 2 }]
      page.loadWrongCount()
      const setDataCalls = page.setData.mock.calls
      const lastQuickEntriesCall = setDataCalls.find(c => c[0].quickEntries)
      expect(lastQuickEntriesCall[0].quickEntries.find(e => e.id === 'wrong').badge).toBe('2题')
    })

    test('无错题时 wrong 入口 badge 为空', () => {
      page.loadWrongCount()
      const setDataCalls = page.setData.mock.calls
      const lastQuickEntriesCall = setDataCalls.find(c => c[0].quickEntries)
      expect(lastQuickEntriesCall[0].quickEntries.find(e => e.id === 'wrong').badge).toBe('')
    })
  })

  describe('loadChaptersProgress', () => {
    test('无进度时各章节 progress 为 0', () => {
      page.loadChaptersProgress()
      expect(page.data.chapters[0].progress).toBe(0)
      expect(page.data.chapters[1].progress).toBe(0)
    })

    test('有进度时设置章节的 progress', () => {
      storage.chaptersProgress = { 1: 50, 2: 80 }
      page.loadChaptersProgress()
      expect(page.data.chapters[0].progress).toBe(50)
      expect(page.data.chapters[1].progress).toBe(80)
    })

    test('progress >= 100 时 completed 为 true', () => {
      storage.chaptersProgress = { 1: 100 }
      page.loadChaptersProgress()
      expect(page.data.chapters[0].completed).toBe(true)
    })

    test('progress < 100 时 completed 为 false', () => {
      storage.chaptersProgress = { 1: 50 }
      page.loadChaptersProgress()
      expect(page.data.chapters[0].completed).toBe(false)
    })
  })

  describe('onQuickEntryTap', () => {
    test('id 为 daily 时调用 goToDailyQuiz', () => {
      page.goToDailyQuiz = jest.fn()
      page.onQuickEntryTap({ currentTarget: { dataset: { id: 'daily' } } })
      expect(page.goToDailyQuiz).toHaveBeenCalled()
    })

    test('id 为 chapter 时调用 goToChapterQuiz', () => {
      page.goToChapterQuiz = jest.fn()
      page.onQuickEntryTap({ currentTarget: { dataset: { id: 'chapter' } } })
      expect(page.goToChapterQuiz).toHaveBeenCalled()
    })

    test('id 为 wrong 时调用 goToWrongQuestions', () => {
      page.goToWrongQuestions = jest.fn()
      page.onQuickEntryTap({ currentTarget: { dataset: { id: 'wrong' } } })
      expect(page.goToWrongQuestions).toHaveBeenCalled()
    })

    test('id 为 difficulty 时调用 goToDifficultyQuiz', () => {
      page.goToDifficultyQuiz = jest.fn()
      page.onQuickEntryTap({ currentTarget: { dataset: { id: 'difficulty' } } })
      expect(page.goToDifficultyQuiz).toHaveBeenCalled()
    })
  })

  describe('goToDailyQuiz', () => {
    test('dailyCompleted 为 true 时显示 toast', () => {
      page.data.dailyCompleted = true
      page.goToDailyQuiz()
      expect(wx.showToast).toHaveBeenCalledWith(expect.objectContaining({
        title: '今日已完成，明天再来吧'
      }))
      expect(wx.navigateTo).not.toHaveBeenCalled()
    })

    test('dailyCompleted 为 false 时导航到 quiz-daily', () => {
      page.data.dailyCompleted = false
      page.goToDailyQuiz()
      expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
        url: '/pages/quiz-daily/quiz-daily'
      }))
    })
  })

  describe('goToChapterQuiz', () => {
    test('导航到 quiz-chapter', () => {
      page.goToChapterQuiz()
      expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
        url: '/pages/quiz-chapter/quiz-chapter'
      }))
    })
  })

  describe('goToWrongQuestions', () => {
    test('wrongCount 为 0 时显示 toast', () => {
      page.data.wrongCount = 0
      page.goToWrongQuestions()
      expect(wx.showToast).toHaveBeenCalledWith(expect.objectContaining({
        title: '暂无错题，继续加油'
      }))
    })

    test('wrongCount > 0 时导航到 quiz-wrong', () => {
      page.data.wrongCount = 5
      page.goToWrongQuestions()
      expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
        url: '/pages/quiz-wrong/quiz-wrong'
      }))
    })
  })

  describe('goToDifficultyQuiz', () => {
    test('导航到 quiz-difficulty', () => {
      page.goToDifficultyQuiz()
      expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
        url: '/pages/quiz-difficulty/quiz-difficulty'
      }))
    })
  })

  describe('onChapterTap', () => {
    test('chapter.unlocked 为 false 时显示 toast', () => {
      page.onChapterTap({ currentTarget: { dataset: { chapter: { id: 3, name: '厨余垃圾', unlocked: false } } } })
      expect(wx.showToast).toHaveBeenCalledWith(expect.objectContaining({
        title: '请先完成前面的章节'
      }))
    })

    test('chapter.unlocked 为 true 时导航到 quiz-play 并传 type=chapter', () => {
      page.onChapterTap({ currentTarget: { dataset: { chapter: { id: 1, name: '可回收垃圾', unlocked: true } } } })
      expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
        url: expect.stringContaining('/pages/quiz-play/quiz-play?type=chapter')
      }))
    })
  })

  describe('onDifficultyTap', () => {
    test('导航到 quiz-play 并传 type=difficulty', () => {
      page.onDifficultyTap({ currentTarget: { dataset: { difficulty: { id: 'easy', name: '简单' } } } })
      expect(wx.navigateTo).toHaveBeenCalledWith(expect.objectContaining({
        url: expect.stringContaining('/pages/quiz-play/quiz-play?type=difficulty')
      }))
    })
  })
})
