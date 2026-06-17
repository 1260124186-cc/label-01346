require('../setup')

const { storage } = require('../setup')

let page
global.Page = jest.fn(obj => { page = obj; return obj })
require('../../frontend-mp/pages/quiz-wrong/quiz-wrong')

describe('quiz-wrong', () => {
  let instance

  beforeEach(() => {
    jest.clearAllMocks()
    Object.keys(storage).forEach(key => delete storage[key])
    const app = global.getApp()
    app.globalData.wrongQuestions = []
    instance = { data: JSON.parse(JSON.stringify(page.data)), setData: jest.fn(function(updates) { Object.assign(this.data, updates) }) }
    Object.keys(page).forEach(key => {
      if (typeof page[key] === 'function') {
        instance[key] = page[key].bind(instance)
      }
    })
  })

  test('data 包含 wrongQuestions=[], selectedQuestions=[], isSelectMode=false, userPoints=0', () => {
    expect(page.data.wrongQuestions).toEqual([])
    expect(page.data.selectedQuestions).toEqual([])
    expect(page.data.isSelectMode).toBe(false)
    expect(page.data.userPoints).toBe(0)
  })

  test('loadWrongQuestions 从 app 读取并处理 optionsWithLabel 和 correctAnswerLabel', () => {
    const app = global.getApp()
    app.globalData.wrongQuestions = [
      { id: 1, question: 'test', options: ['A', 'B', 'C', 'D'], correctIndex: 1 }
    ]
    instance.loadWrongQuestions()
    expect(instance.setData).toHaveBeenCalledWith({
      wrongQuestions: [
        expect.objectContaining({
          optionsWithLabel: [
            { text: 'A', label: 'A' },
            { text: 'B', label: 'B' },
            { text: 'C', label: 'C' },
            { text: 'D', label: 'D' }
          ],
          correctAnswerLabel: 'B'
        })
      ],
      selectedQuestions: [],
      isSelectMode: false
    })
  })

  test('loadWrongQuestions 无数据时返回空数组', () => {
    instance.loadWrongQuestions()
    expect(instance.setData).toHaveBeenCalledWith({
      wrongQuestions: [],
      selectedQuestions: [],
      isSelectMode: false
    })
  })

  test('onQuestionTap 在 selectMode 下调用 toggleSelect', () => {
    instance.data.isSelectMode = true
    instance.toggleSelect = jest.fn()
    instance.onQuestionTap({ currentTarget: { dataset: { question: { id: 1 }, index: 0 } } })
    expect(instance.toggleSelect).toHaveBeenCalledWith(0)
  })

  test('onQuestionTap 非 selectMode 下调用 startReview 传入该题目', () => {
    instance.data.isSelectMode = false
    const question = { id: 1, question: 'test' }
    instance.startReview = jest.fn()
    instance.onQuestionTap({ currentTarget: { dataset: { question, index: 0 } } })
    expect(instance.startReview).toHaveBeenCalledWith([question])
  })

  test('onEnterSelectMode 启用 selectMode 并清空选中', () => {
    instance.data.isSelectMode = false
    instance.onEnterSelectMode()
    expect(instance.setData).toHaveBeenCalledWith({
      isSelectMode: true,
      selectedQuestions: []
    })
  })

  test('onEnterSelectMode 已在 selectMode 时不重复设置', () => {
    instance.data.isSelectMode = true
    instance.onEnterSelectMode()
    expect(instance.setData).not.toHaveBeenCalled()
  })

  test('onQuestionLongPress 启用 selectMode 并选中该 index', () => {
    instance.data.isSelectMode = false
    instance.onQuestionLongPress({ currentTarget: { dataset: { index: 2 } } })
    expect(instance.setData).toHaveBeenCalledWith({
      isSelectMode: true,
      selectedQuestions: [2]
    })
  })

  test('onQuestionLongPress index 为 undefined 时选中空数组', () => {
    instance.data.isSelectMode = false
    instance.onQuestionLongPress({ currentTarget: { dataset: {} } })
    expect(instance.setData).toHaveBeenCalledWith({
      isSelectMode: true,
      selectedQuestions: []
    })
  })

  test('onQuestionLongPress 已在 selectMode 时不重复设置', () => {
    instance.data.isSelectMode = true
    instance.onQuestionLongPress({ currentTarget: { dataset: { index: 2 } } })
    expect(instance.setData).not.toHaveBeenCalled()
  })

  test('toggleSelect 添加未选中的 index', () => {
    instance.data.selectedQuestions = [0, 2]
    instance.toggleSelect(1)
    expect(instance.setData).toHaveBeenCalledWith({ selectedQuestions: [0, 2, 1] })
  })

  test('toggleSelect 移除已选中的 index', () => {
    instance.data.selectedQuestions = [0, 1, 2]
    instance.toggleSelect(1)
    expect(instance.setData).toHaveBeenCalledWith({ selectedQuestions: [0, 2] })
  })

  test('toggleSelect 移除后 selectedQuestions 为空则退出 selectMode', () => {
    instance.data.selectedQuestions = [0]
    instance.data.isSelectMode = true
    instance.toggleSelect(0)
    expect(instance.setData).toHaveBeenCalledWith({ selectedQuestions: [] })
    expect(instance.setData).toHaveBeenCalledWith({ isSelectMode: false })
  })

  test('onSelectAll 选中全部 index', () => {
    instance.data.wrongQuestions = [{ id: 1 }, { id: 2 }, { id: 3 }]
    instance.data.selectedQuestions = [0]
    instance.onSelectAll()
    expect(instance.setData).toHaveBeenCalledWith({ selectedQuestions: [0, 1, 2] })
  })

  test('onSelectAll 全部已选中则取消全选并退出 selectMode', () => {
    instance.data.wrongQuestions = [{ id: 1 }, { id: 2 }]
    instance.data.selectedQuestions = [0, 1]
    instance.onSelectAll()
    expect(instance.setData).toHaveBeenCalledWith({ selectedQuestions: [], isSelectMode: false })
  })

  test('onDeleteSelected 无选中时显示 toast', () => {
    instance.data.selectedQuestions = []
    instance.onDeleteSelected()
    expect(global.wx.showToast).toHaveBeenCalledWith(expect.objectContaining({ title: '请先选择题目' }))
  })

  test('onDeleteSelected 显示确认弹窗后删除选中题目', () => {
    instance.data.wrongQuestions = [
      { id: 1, question: 'q1' },
      { id: 2, question: 'q2' },
      { id: 3, question: 'q3' }
    ]
    instance.data.selectedQuestions = [0, 2]
    instance.onDeleteSelected()
    expect(global.wx.showModal).toHaveBeenCalledWith(expect.objectContaining({
      title: '确认删除',
      content: '确定要删除选中的 2 道题目吗？'
    }))
  })

  test('deleteSelected 从 storage 中删除选中题目', () => {
    instance.data.wrongQuestions = [
      { id: 1, question: 'q1' },
      { id: 2, question: 'q2' },
      { id: 3, question: 'q3' }
    ]
    instance.data.selectedQuestions = [0, 2]
    instance.deleteSelected()
    expect(global.wx.setStorageSync).toHaveBeenCalledWith('wrongQuestions', [{ id: 2, question: 'q2' }])
    expect(instance.setData).toHaveBeenCalledWith({
      wrongQuestions: [{ id: 2, question: 'q2' }],
      selectedQuestions: [],
      isSelectMode: false
    })
  })

  test('onStartReview 在 selectMode 下复习选中的题目', () => {
    instance.data.isSelectMode = true
    instance.data.selectedQuestions = [0, 2]
    instance.data.wrongQuestions = [
      { id: 1, question: 'q1' },
      { id: 2, question: 'q2' },
      { id: 3, question: 'q3' }
    ]
    instance.startReview = jest.fn()
    instance.onStartReview()
    expect(instance.startReview).toHaveBeenCalledWith([{ id: 1, question: 'q1' }, { id: 3, question: 'q3' }])
  })

  test('onStartReview 非 selectMode 下复习所有错题', () => {
    instance.data.isSelectMode = false
    instance.data.wrongQuestions = [{ id: 1 }, { id: 2 }]
    instance.startReview = jest.fn()
    instance.onStartReview()
    expect(instance.startReview).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }])
  })

  test('onStartReview 无错题时显示 toast', () => {
    instance.data.isSelectMode = false
    instance.data.wrongQuestions = []
    instance.onStartReview()
    expect(global.wx.showToast).toHaveBeenCalledWith(expect.objectContaining({ title: '暂无错题' }))
  })

  test('startReview 导航到 quiz-play 页面并传参', () => {
    instance.startReview([{ id: 1 }, { id: 2 }])
    expect(global.wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/quiz-play/quiz-play?type=wrong&isWrongReview=true&questionIds=1%2C2',
      fail: expect.any(Function)
    })
  })

  test('onCancelSelect 退出 selectMode 并清空选中', () => {
    instance.onCancelSelect()
    expect(instance.setData).toHaveBeenCalledWith({
      isSelectMode: false,
      selectedQuestions: []
    })
  })
})
