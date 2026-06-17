require('../setup')

const { storage } = require('../setup')

global.Page = jest.fn(obj => obj)

require('../../frontend-mp/pages/quiz-play/quiz-play.js')
const pageObj = global.Page.mock.calls[0][0]
const capturedApp = global.getApp.mock.results[0].value
const { QUIZ_DIFFICULTIES, QUIZ_POINTS_CONFIG } = require('../../frontend-mp/utils/constants')

describe('quiz-play page', () => {
  let page

  beforeEach(() => {
    Object.keys(storage).forEach(key => delete storage[key])
    jest.clearAllMocks()
    const app = global.getApp()
    app.globalData.wrongQuestions = []
    app.globalData.masteredQuestions = []
    app.globalData.dailyCompletionBonus = { date: '2026-06-16', claimed: false }
    const pointsByMode = {}
    Object.keys(QUIZ_POINTS_CONFIG.dailyModeLimits).forEach(mode => {
      pointsByMode[mode] = 0
    })
    app.globalData.dailyPoints = { date: '2026-06-16', pointsByMode }
    page = Object.create(pageObj)
    page.setData = jest.fn(function (data) {
      Object.assign(this.data, data)
    })
    page.data = {
      quizType: '',
      chapterId: null,
      chapterName: '',
      difficulty: '',
      difficultyName: '',
      isWrongReview: false,
      isTimedMode: false,
      isBossMode: false,
      questions: [],
      currentIndex: 0,
      currentQuestion: null,
      selectedIndex: -1,
      selectedIndexes: [],
      isAnswered: false,
      isCorrect: false,
      isTimeout: false,
      userAnswer: null,
      correctCount: 0,
      wrongCount: 0,
      timeoutCount: 0,
      totalPoints: 0,
      showResult: false,
      resultData: null,
      progressPercent: 0,
      timeLeft: 0,
      timer: null,
      QUESTION_TYPE_MAP: {
        single: { name: '单选题', icon: '○' },
        multiple: { name: '多选题', icon: '☐' },
        judge: { name: '判断题', icon: '✓' }
      },
      SCENE_MAP: {
        kitchen: '厨房',
        office: '办公室',
        campus: '校园'
      },
      TRASH_TYPE_MAP: {}
    }
  })

  describe('initQuiz', () => {
    test('type=daily 加载每日题目', () => {
      page.initQuiz({ type: 'daily' })
      expect(page.data.quizType).toBe('daily')
      expect(page.data.questions.length).toBeGreaterThan(0)
    })

    test('type=chapter 加载章节题目', () => {
      page.initQuiz({ type: 'chapter', chapterId: '1', chapterName: '可回收垃圾' })
      expect(page.data.quizType).toBe('chapter')
      expect(page.data.chapterId).toBe(1)
      expect(page.data.chapterName).toBe('可回收垃圾')
      expect(page.data.questions.length).toBeGreaterThan(0)
    })

    test('type=difficulty 加载难度题目', () => {
      page.initQuiz({ type: 'difficulty', difficulty: 'easy', difficultyName: '简单' })
      expect(page.data.quizType).toBe('difficulty')
      expect(page.data.difficulty).toBe('easy')
      expect(page.data.difficultyName).toBe('简单')
      expect(page.data.questions.length).toBeGreaterThan(0)
    })

    test('isWrongReview=true 从 storage 加载错题', () => {
      const app = global.getApp()
      app.globalData.wrongQuestions = [
        { id: 10, chapterId: 1, difficulty: 'easy', question: 'WQ1', options: ['A', 'B'], correctIndex: 0 }
      ]
      page.initQuiz({ isWrongReview: 'true' })
      expect(page.data.quizType).toBe('wrong')
      expect(page.data.isWrongReview).toBe(true)
      expect(page.data.questions.length).toBe(1)
    })

    test('题目为空时显示 toast 并返回', () => {
      jest.useFakeTimers()
      page.initQuiz({ type: 'chapter', chapterId: '999' })
      expect(wx.showToast).toHaveBeenCalledWith(expect.objectContaining({
        title: '暂无题目'
      }))
      jest.advanceTimersByTime(1500)
      expect(wx.navigateBack).toHaveBeenCalled()
      jest.useRealTimers()
    })
  })

  describe('onSelectOption', () => {
    beforeEach(() => {
      page.data.questions = [
        { id: 1, difficulty: 'easy', question: 'Q1', options: ['A', 'B', 'C', 'D'], correctIndex: 0 }
      ]
      page.data.currentQuestion = page.data.questions[0]
      page.data.currentIndex = 0
    })

    test('答对时设置 isCorrect=true 并增加 correctCount', () => {
      page.onSelectOption({ currentTarget: { dataset: { index: 0 } } })
      expect(page.data.isCorrect).toBe(true)
      expect(page.data.correctCount).toBe(1)
    })

    test('答对时调用 app.updateUserPoints 带 recordInfo 参数', () => {
      page.onSelectOption({ currentTarget: { dataset: { index: 0 } } })
      expect(capturedApp.updateUserPoints).toHaveBeenCalledWith(
        5,
        expect.objectContaining({
          category: 'quiz',
          title: '知识问答',
          emoji: '❓'
        })
      )
    })

    test('答对时从错题中移除', () => {
      const app = global.getApp()
      app.globalData.wrongQuestions = [{ id: 1, difficulty: 'easy', options: ['A', 'B', 'C', 'D'], correctIndex: 0 }]
      page.onSelectOption({ currentTarget: { dataset: { index: 0 } } })
      expect(app.globalData.wrongQuestions).toHaveLength(0)
    })

    test('答错时设置 isCorrect=false 并增加 wrongCount', () => {
      page.onSelectOption({ currentTarget: { dataset: { index: 1 } } })
      expect(page.data.isCorrect).toBe(false)
      expect(page.data.wrongCount).toBe(1)
    })

    test('答错时添加到错题', () => {
      page.onSelectOption({ currentTarget: { dataset: { index: 1 } } })
      expect(wx.showToast).toHaveBeenCalledWith(expect.objectContaining({
        title: '答错了，继续加油！'
      }))
      expect(storage.wrongQuestions.length).toBeGreaterThan(0)
    })

    test('已回答时不再处理', () => {
      page.data.isAnswered = true
      page.onSelectOption({ currentTarget: { dataset: { index: 0 } } })
      expect(page.data.isCorrect).toBe(false)
    })
  })

  describe('calculatePoints', () => {
    test('easy 难度返回 5 分', () => {
      page.data.currentQuestion = { difficulty: 'easy' }
      expect(page.calculatePoints()).toBe(5)
    })

    test('medium 难度返回 10 分', () => {
      page.data.currentQuestion = { difficulty: 'medium' }
      expect(page.calculatePoints()).toBe(10)
    })

    test('hard 难度返回 20 分', () => {
      page.data.currentQuestion = { difficulty: 'hard' }
      expect(page.calculatePoints()).toBe(20)
    })

    test('未知难度返回默认 5 分', () => {
      page.data.currentQuestion = { difficulty: 'unknown' }
      expect(page.calculatePoints()).toBe(5)
    })
  })

  describe('addToWrongQuestions', () => {
    test('新题目添加到错题', () => {
      const app = global.getApp()
      page.addToWrongQuestions({ id: 1, question: 'Q1', options: ['A', 'B'], correctIndex: 0 })
      expect(app.globalData.wrongQuestions).toHaveLength(1)
      expect(app.globalData.wrongQuestions[0].id).toBe(1)
    })

    test('已存在的题目不重复添加', () => {
      const app = global.getApp()
      app.globalData.wrongQuestions = [{ id: 1, question: 'Q1', options: ['A', 'B'], correctIndex: 0 }]
      page.addToWrongQuestions({ id: 1, question: 'Q1', options: ['A', 'B'], correctIndex: 0 })
      expect(app.globalData.wrongQuestions).toHaveLength(1)
    })
  })

  describe('removeFromWrongQuestions', () => {
    test('按 id 移除错题', () => {
      const app = global.getApp()
      app.globalData.wrongQuestions = [
        { id: 1, question: 'Q1' },
        { id: 2, question: 'Q2' }
      ]
      page.removeFromWrongQuestions(1)
      expect(app.globalData.wrongQuestions).toHaveLength(1)
      expect(app.globalData.wrongQuestions[0].id).toBe(2)
    })
  })

  describe('updateProgress', () => {
    test('计算百分比进度', () => {
      page.data.questions = [{}, {}, {}, {}]
      page.data.currentIndex = 1
      page.updateProgress()
      expect(page.data.progressPercent).toBe(50)
    })

    test('第一题进度', () => {
      page.data.questions = [{}, {}, {}, {}, {}]
      page.data.currentIndex = 0
      page.updateProgress()
      expect(page.data.progressPercent).toBe(20)
    })
  })

  describe('onNextQuestion', () => {
    test('有下一题时前进', () => {
      page.data.questions = [
        { id: 1, question: 'Q1' },
        { id: 2, question: 'Q2' }
      ]
      page.data.currentIndex = 0
      page.onNextQuestion()
      expect(page.data.currentIndex).toBe(1)
      expect(page.data.currentQuestion.id).toBe(2)
      expect(page.data.selectedIndex).toBe(-1)
      expect(page.data.isAnswered).toBe(false)
      expect(page.data.isCorrect).toBe(false)
    })

    test('没有下一题时调用 showQuizResult', () => {
      page.showQuizResult = jest.fn()
      page.data.questions = [{ id: 1, question: 'Q1' }]
      page.data.currentIndex = 0
      page.onNextQuestion()
      expect(page.showQuizResult).toHaveBeenCalled()
    })
  })

  describe('showQuizResult', () => {
    beforeEach(() => {
      page.data.questions = [{}, {}, {}, {}, {}]
      page.data.correctCount = 4
      page.data.wrongCount = 1
      page.data.totalPoints = 40
      page.data.quizType = 'daily'
      page.updateChapterProgress = jest.fn()
      page.markDailyCompleted = jest.fn()
    })

    test('计算正确率', () => {
      page.showQuizResult()
      expect(page.data.resultData.accuracy).toBe(80)
    })

    test('accuracy >= 80 时结果标题为 太棒了！', () => {
      page.showQuizResult()
      expect(page.data.resultData.title).toBe('太棒了！')
      expect(page.data.resultData.emoji).toBe('🎉')
    })

    test('accuracy >= 60 且 < 80 时结果标题为 不错哦！', () => {
      page.data.correctCount = 3
      page.showQuizResult()
      expect(page.data.resultData.title).toBe('不错哦！')
      expect(page.data.resultData.emoji).toBe('👍')
    })

    test('accuracy < 60 时结果标题为 继续加油！', () => {
      page.data.correctCount = 2
      page.showQuizResult()
      expect(page.data.resultData.title).toBe('继续加油！')
      expect(page.data.resultData.emoji).toBe('💪')
    })

    test('发放奖励积分', () => {
      const app = global.getApp()
      app.globalData.dailyCompletionBonus = { date: '2026-06-16', claimed: false }
      app.globalData.dailyPoints.pointsByMode.daily = 0
      page.showQuizResult()
      expect(capturedApp.updateUserPoints).toHaveBeenCalledWith(
        QUIZ_POINTS_CONFIG.dailyCompletionBonus,
        expect.objectContaining({
          category: 'quiz',
          title: '每日完成奖励',
          emoji: '🎁'
        })
      )
    })

    test('调用 addQuizRecord 添加答题记录', () => {
      page.showQuizResult()
      expect(capturedApp.addQuizRecord).toHaveBeenCalled()
    })

    test('调用 updateChapterProgress', () => {
      page.showQuizResult()
      expect(page.updateChapterProgress).toHaveBeenCalled()
    })

    test('调用 markDailyCompleted', () => {
      page.showQuizResult()
      expect(page.markDailyCompleted).toHaveBeenCalled()
    })

    test('showResult 设为 true', () => {
      page.showQuizResult()
      expect(page.data.showResult).toBe(true)
    })
  })

  describe('updateChapterProgress', () => {
    test('quizType 不为 chapter 时不操作', () => {
      page.data.quizType = 'daily'
      page.data.chapterId = null
      page.updateChapterProgress()
      expect(storage.chaptersProgress).toBeUndefined()
    })

    test('quizType=chapter 时保存进度到 storage', () => {
      page.data.quizType = 'chapter'
      page.data.chapterId = 1
      page.data.resultData = { accuracy: 90 }
      page.updateChapterProgress()
      expect(storage.chaptersProgress[1]).toBe(90)
    })

    test('accuracy >= 80 时解锁下一章节', () => {
      page.data.quizType = 'chapter'
      page.data.chapterId = 2
      page.data.resultData = { accuracy: 90 }
      page.updateChapterProgress()
      expect(storage.unlockedChapters).toContain(3)
    })

    test('accuracy < 80 时不解锁下一章节', () => {
      page.data.quizType = 'chapter'
      page.data.chapterId = 2
      page.data.resultData = { accuracy: 50 }
      page.updateChapterProgress()
      expect(storage.unlockedChapters).toBeUndefined()
    })

    test('进度取历史最高值', () => {
      storage.chaptersProgress = { 1: 95 }
      page.data.quizType = 'chapter'
      page.data.chapterId = 1
      page.data.resultData = { accuracy: 70 }
      page.updateChapterProgress()
      expect(storage.chaptersProgress[1]).toBe(95)
    })
  })

  describe('markDailyCompleted', () => {
    test('quizType=daily 时添加每日一练记录', () => {
      page.data.quizType = 'daily'
      const app = global.getApp()
      const beforeCount = app.getDailyQuizRecords().length
      page.markDailyCompleted()
      expect(app.addDailyQuizRecord).toHaveBeenCalled()
      expect(app.getDailyQuizRecords().length).toBeGreaterThanOrEqual(beforeCount)
    })

    test('quizType 不为 daily 时不操作', () => {
      page.data.quizType = 'chapter'
      const app = global.getApp()
      if (app.addDailyQuizRecord && app.addDailyQuizRecord.mockClear) {
        app.addDailyQuizRecord.mockClear()
      }
      page.markDailyCompleted()
      expect(app.addDailyQuizRecord).not.toHaveBeenCalled()
    })
  })

  describe('onRestart', () => {
    test('重置所有答题状态', () => {
      page.data.questions = [{ id: 1 }, { id: 2 }]
      page.data.currentIndex = 1
      page.data.currentQuestion = { id: 2 }
      page.data.selectedIndex = 2
      page.data.isAnswered = true
      page.data.isCorrect = true
      page.data.correctCount = 1
      page.data.wrongCount = 1
      page.data.totalPoints = 10
      page.data.showResult = true
      page.data.progressPercent = 50

      page.onRestart()

      expect(page.data.currentIndex).toBe(0)
      expect([1, 2]).toContain(page.data.currentQuestion.id)
      expect(page.data.selectedIndex).toBe(-1)
      expect(page.data.isAnswered).toBe(false)
      expect(page.data.isCorrect).toBe(false)
      expect(page.data.correctCount).toBe(0)
      expect(page.data.wrongCount).toBe(0)
      expect(page.data.totalPoints).toBe(0)
      expect(page.data.showResult).toBe(false)
      expect(page.data.progressPercent).toBe(0)
    })
  })

  describe('onBackToHome', () => {
    test('调用 navigateBack', () => {
      page.onBackToHome()
      expect(wx.navigateBack).toHaveBeenCalled()
    })
  })
})
