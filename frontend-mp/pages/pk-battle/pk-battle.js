const app = getApp()
const { PK_CONFIG, isQuestionCorrect } = require('../../utils/constants')
const { formatDate, generateId, navigateTo, showToast } = require('../../utils/util')

Page({
  data: {
    phase: 'matching',
    session: null,
    opponent: null,
    currentQuestionIndex: 0,
    currentQuestion: null,
    timeLeft: 10,
    selectedIndex: -1,
    isAnswered: false,
    isCorrect: false,
    correctCount: 0,
    totalQuestions: 5,
    timer: null,
    questionStartTime: 0
  },

  onLoad() {
    this.initPK()
  },

  initPK() {
    const result = app.startPK()

    if (!result.success) {
      const msgMap = {
        'daily_limit': '今日PK次数已达上限',
        'anti_cheat': '操作异常，请稍后再试',
        'no_opponent': '暂无对手，请稍后再试'
      }
      showToast(msgMap[result.reason] || '匹配失败，请重试')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }

    this.setData({
      session: result.session,
      opponent: result.opponent,
      totalQuestions: PK_CONFIG.questionCount,
      timeLeft: PK_CONFIG.timePerQuestion
    })

    setTimeout(() => {
      this.startBattle()
    }, 2000)
  },

  startBattle() {
    const session = this.data.session
    const firstQuestion = session.questions[0]

    this.setData({
      phase: 'battle',
      currentQuestionIndex: 0,
      currentQuestion: firstQuestion,
      timeLeft: PK_CONFIG.timePerQuestion,
      selectedIndex: -1,
      isAnswered: false,
      isCorrect: false,
      correctCount: 0,
      questionStartTime: Date.now()
    })

    this.startTimer()
  },

  startTimer() {
    this.stopTimer()
    const timer = setInterval(() => {
      const timeLeft = this.data.timeLeft - 1
      if (timeLeft <= 0) {
        this.stopTimer()
        this.handleTimeout()
      } else {
        this.setData({ timeLeft })
      }
    }, 1000)
    this.setData({ timer })
  },

  stopTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({ timer: null })
    }
  },

  handleTimeout() {
    if (this.data.isAnswered) return

    const timeSpent = PK_CONFIG.timePerQuestion * 1000
    const questionIndex = this.data.currentQuestionIndex
    const result = app.submitPKAnswer(questionIndex, -1, timeSpent)

    this.setData({
      isAnswered: true,
      isCorrect: false,
      selectedIndex: -1
    })

    showToast('时间到！', 'none')
    this.scheduleNextQuestion()
  },

  onSelectOption(e) {
    if (this.data.isAnswered) return

    this.stopTimer()

    const { index } = e.currentTarget.dataset
    const question = this.data.currentQuestion
    const type = question.type || 'single'
    const answer = type === 'multiple' ? [index] : index
    const timeSpent = Date.now() - this.data.questionStartTime

    const result = app.submitPKAnswer(this.data.currentQuestionIndex, answer, timeSpent)

    const correct = result.isCorrect

    this.setData({
      selectedIndex: index,
      isAnswered: true,
      isCorrect: correct,
      correctCount: correct ? this.data.correctCount + 1 : this.data.correctCount
    })

    if (correct) {
      showToast('答对了！', 'success')
    } else {
      showToast('答错了！', 'none')
    }

    this.scheduleNextQuestion()
  },

  scheduleNextQuestion() {
    setTimeout(() => {
      const nextIndex = this.data.currentQuestionIndex + 1

      if (nextIndex >= this.data.totalQuestions) {
        this.finishPK()
        return
      }

      const nextQuestion = this.data.session.questions[nextIndex]

      this.setData({
        currentQuestionIndex: nextIndex,
        currentQuestion: nextQuestion,
        timeLeft: PK_CONFIG.timePerQuestion,
        selectedIndex: -1,
        isAnswered: false,
        isCorrect: false,
        questionStartTime: Date.now()
      })

      this.startTimer()
    }, 1200)
  },

  finishPK() {
    this.stopTimer()
    this.setData({ phase: 'finished' })

    const result = app.finishPK()

    if (!result.success) {
      showToast('PK结果异常')
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }

    const pkResult = result.pkResult
    const params = {
      result: pkResult.result,
      pointsEarned: pkResult.pointsEarned,
      myCorrectCount: pkResult.myCorrectCount,
      opponentCorrectCount: pkResult.opponentCorrectCount,
      myTotalTime: pkResult.myTotalTime,
      opponentTotalTime: pkResult.opponentTotalTime,
      totalQuestions: pkResult.totalQuestions,
      opponentName: pkResult.session ? pkResult.session.opponentName : '',
      opponentAvatarEmoji: pkResult.session ? pkResult.session.opponentAvatarEmoji : ''
    }

    navigateTo('/pages/pk-result/pk-result', params)
  },

  onUnload() {
    this.stopTimer()
  }
})
