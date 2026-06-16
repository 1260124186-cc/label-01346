require('../setup')

const { storage } = require('../setup')
const { getQuestionsByDifficulty } = require('../../frontend-mp/utils/constants')

let page
global.Page = jest.fn(obj => { page = obj; return obj })
require('../../frontend-mp/pages/quiz-difficulty/quiz-difficulty')

describe('quiz-difficulty', () => {
  let instance

  beforeEach(() => {
    jest.clearAllMocks()
    Object.keys(storage).forEach(key => delete storage[key])
    instance = { data: JSON.parse(JSON.stringify(page.data)), setData: jest.fn(function(updates) { Object.assign(this.data, updates) }) }
    Object.keys(page).forEach(key => {
      if (typeof page[key] === 'function') {
        instance[key] = page[key].bind(instance)
      }
    })
  })

  test('data 包含 difficulties=[], userPoints=0', () => {
    expect(page.data.difficulties).toEqual([])
    expect(page.data.userPoints).toBe(0)
  })

  test('loadDifficulties 映射 QUIZ_DIFFICULTIES 并附加 questionCount/bestScore/totalAttempts', () => {
    storage['difficultyBest_easy'] = 80
    storage['difficultyAttempts_easy'] = 5
    storage['difficultyBest_medium'] = 60
    storage['difficultyAttempts_medium'] = 3

    instance.loadDifficulties()

    expect(instance.setData).toHaveBeenCalledWith({ difficulties: expect.any(Array) })

    const calledArg = instance.setData.mock.calls[0][0].difficulties
    const easyItem = calledArg.find(d => d.id === 'easy')
    const mediumItem = calledArg.find(d => d.id === 'medium')
    const hardItem = calledArg.find(d => d.id === 'hard')

    expect(easyItem.questionCount).toBe(getQuestionsByDifficulty('easy').length)
    expect(easyItem.bestScore).toBe(80)
    expect(easyItem.totalAttempts).toBe(5)

    expect(mediumItem.questionCount).toBe(getQuestionsByDifficulty('medium').length)
    expect(mediumItem.bestScore).toBe(60)
    expect(mediumItem.totalAttempts).toBe(3)

    expect(hardItem.questionCount).toBe(getQuestionsByDifficulty('hard').length)
    expect(hardItem.bestScore).toBe(0)
    expect(hardItem.totalAttempts).toBe(0)
  })

  test('onDifficultyTap questionCount 为 0 时显示 toast', () => {
    instance.onDifficultyTap({ currentTarget: { dataset: { difficulty: { id: 'easy', name: '简单', questionCount: 0 } } } })
    expect(global.wx.showToast).toHaveBeenCalledWith(expect.objectContaining({ title: '该难度暂无题目' }))
    expect(global.wx.navigateTo).not.toHaveBeenCalled()
  })

  test('onDifficultyTap questionCount 大于 0 时导航到 quiz-play 页面', () => {
    instance.onDifficultyTap({ currentTarget: { dataset: { difficulty: { id: 'easy', name: '简单', questionCount: 10 } } } })
    expect(global.wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/quiz-play/quiz-play?type=difficulty&difficulty=easy&difficultyName=%E7%AE%80%E5%8D%95',
      fail: expect.any(Function)
    })
  })
})
