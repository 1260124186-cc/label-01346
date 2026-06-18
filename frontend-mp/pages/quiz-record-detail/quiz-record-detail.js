/**
 * 答题记录详情页面
 * @description 展示单次答题的详细情况，包括每题的用户答案和正确答案
 */
const app = getApp()
const { navigateTo, showToast, showModal } = require('../../utils/util')
const { getQuestionById } = require('../../utils/constants')

Page({
  data: {
    recordId: '',
    record: null,
    questions: [],
    QUESTION_TYPE_MAP: {
      single: { name: '单选', icon: '○' },
      multiple: { name: '多选', icon: '☐' },
      judge: { name: '判断', icon: '✓' }
    },
    isWrongReview: false
  },

  onLoad(options) {
    console.log('[QuizRecordDetail] 页面加载', options)
    const { recordId } = options
    this.setData({ recordId })
    this.loadRecordDetail()
  },

  loadRecordDetail() {
    const records = app.getQuizRecords()
    const record = records.find(r => r.id === this.data.recordId)

    if (!record) {
      showToast('记录不存在')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }

    const quizType = record.quizType || 'chapter'
    const isTimed = record.isTimed || quizType === 'timed'
    const isBoss = record.isBoss || quizType === 'boss'
    const isWrongReview = record.isWrongReview || quizType === 'wrong'
    const isDaily = quizType === 'daily'

    let typeIcon = '📚'
    let typeName = '章节练习'
    let typeColor = '#4A90D9'

    if (isTimed) {
      typeIcon = '⏱️'
      typeName = '限时挑战'
      typeColor = '#9B59B6'
    } else if (isBoss) {
      typeIcon = '👹'
      typeName = 'Boss关'
      typeColor = '#E74C3C'
    } else if (isWrongReview) {
      typeIcon = '📝'
      typeName = '错题复习'
      typeColor = '#E85D5D'
    } else if (isDaily) {
      typeIcon = '📅'
      typeName = '每日一练'
      typeColor = '#5BBD72'
    }

    const accuracy = record.accuracy || 0
    let accuracyLevel = 'normal'
    if (accuracy >= 90) accuracyLevel = 'excellent'
    else if (accuracy >= 80) accuracyLevel = 'good'
    else if (accuracy >= 60) accuracyLevel = 'normal'
    else accuracyLevel = 'poor'

    const timeoutCount = record.timeoutCount || 0

    const recordQuestions = record.questions || []
    const processedQuestions = recordQuestions.map((q, index) => {
      const fullQuestion = getQuestionById(q.id) || {}
      const type = fullQuestion.type || 'single'
      let options = fullQuestion.options || q.options || []
      let correctIndex = fullQuestion.correctIndex
      let correctIndexes = fullQuestion.correctIndexes || []

      if (type === 'judge' && (!options || options.length === 0)) {
        options = ['正确', '错误']
      }

      const optionsWithLabel = options.map((opt, idx) => {
        const label = type === 'judge' ? (idx === 0 ? '✓' : '✗') : String.fromCharCode(65 + idx)
        const isCorrectOption = type === 'multiple'
          ? correctIndexes.includes(idx)
          : idx === correctIndex
        const isUserOption = Array.isArray(q.userAnswer)
          ? q.userAnswer.includes(idx)
          : q.userAnswer === idx

        return {
          text: opt,
          label,
          isCorrectOption,
          isUserOption
        }
      })

      let correctAnswerLabel = ''
      if (type === 'multiple') {
        correctAnswerLabel = correctIndexes
          .sort((a, b) => a - b)
          .map(i => String.fromCharCode(65 + i))
          .join('、')
      } else if (type === 'judge') {
        correctAnswerLabel = correctIndex === 0 ? '正确' : '错误'
      } else {
        correctAnswerLabel = String.fromCharCode(65 + correctIndex)
      }

      let userAnswerLabel = '未作答'
      if (q.userAnswer !== undefined && q.userAnswer !== null) {
        if (Array.isArray(q.userAnswer)) {
          userAnswerLabel = q.userAnswer.length > 0
            ? q.userAnswer
                .sort((a, b) => a - b)
                .map(i => String.fromCharCode(65 + i))
                .join('、')
            : '未作答'
        } else {
          userAnswerLabel = String.fromCharCode(65 + q.userAnswer)
        }
      }

      const difficultyNameMap = { easy: '简单', medium: '中等', hard: '困难' }
      const difficulty = fullQuestion.difficulty || 'medium'

      return {
        index: index + 1,
        question: fullQuestion.question || q.question,
        type,
        options,
        optionsWithLabel,
        correctIndex,
        correctIndexes,
        correctAnswerLabel,
        userAnswer: q.userAnswer,
        userAnswerLabel,
        isCorrect: q.isCorrect,
        difficulty,
        difficultyName: difficultyNameMap[difficulty] || '简单',
        explanation: fullQuestion.explanation || ''
      }
    })

    const wrongQuestions = processedQuestions.filter(q => !q.isCorrect)
    const wrongIds = wrongQuestions.map(q => {
      const recordQ = recordQuestions[q.index - 1]
      const fullQ = recordQ ? getQuestionById(recordQ.id) : null
      return fullQ || {}
    }).filter(q => q.id)

    this.setData({
      record: {
        ...record,
        typeIcon,
        typeName,
        typeColor,
        accuracyLevel,
        timeoutCount
      },
      questions: processedQuestions,
      isWrongReview: wrongIds.length > 0,
      wrongIdsForReview: wrongIds
    })

    wx.setNavigationBarTitle({
      title: record.chapterName || typeName
    })
  },

  onQuestionTap(e) {
    const { index } = e.currentTarget.dataset
    const questions = this.data.questions
    questions[index].expanded = !questions[index].expanded
    this.setData({ questions })
  },

  onReviewWrongTap() {
    if (!this.data.wrongIdsForReview || this.data.wrongIdsForReview.length === 0) {
      showToast('没有错题需要复习')
      return
    }

    const wrongIds = this.data.wrongIdsForReview.map(q => q.id).join(',')
    navigateTo('/pages/quiz-play/quiz-play', {
      type: 'wrong',
      isWrongReview: 'true',
      questionIds: wrongIds
    })
  },

  onDeleteTap() {
    showModal({
      title: '删除记录',
      content: '确定要删除这条答题记录吗？删除后无法恢复。',
      confirmText: '删除',
      confirmColor: '#E85D5D'
    }).then(() => {
      let records = app.globalData.quizRecords || []
      records = records.filter(r => r.id !== this.data.recordId)
      app.globalData.quizRecords = records
      wx.setStorageSync('quizRecords', records)
      
      showToast('已删除')
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    }).catch(() => {})
  }
})
