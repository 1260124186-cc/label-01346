const app = getApp()
const { showToast, showSuccess, showError, navigateBack, formatDate } = require('../../utils/util')
const { CHILD_PIN_CONFIG } = require('../../utils/constants')

Page({
  data: {
    mode: 'verify',
    title: '请输入家长PIN',
    subtitle: '',
    pinLength: 6,
    currentPIN: '',
    confirmPIN: '',
    step: 1,
    errorMessage: '',
    remainAttempts: 5,
    isLocked: false,
    lockCountdown: 0,
    showWXAuthOption: true,
    isAuthorizing: false,
    targetEnabled: true,
    isUnlockMode: false,
    activePIN: '',
    activePINLength: 0
  },

  onLoad(options) {
    const mode = options.mode || 'verify'
    const targetEnabled = options.enabled !== 'false'
    const isUnlockMode = options.unlock === 'true'

    let title = '请输入家长PIN'
    let subtitle = ''
    let showWXAuthOption = true

    if (isUnlockMode) {
      title = '使用时长已达上限'
      subtitle = '请家长输入PIN解锁继续使用'
    } else if (mode === 'set') {
      title = '设置家长PIN'
      subtitle = '用于开启/关闭儿童模式的验证'
      showWXAuthOption = false
    } else if (mode === 'change') {
      title = '修改家长PIN'
      subtitle = '请先输入当前PIN验证'
      showWXAuthOption = true
    } else if (mode === 'verify') {
      title = targetEnabled ? '开启儿童模式验证' : '关闭儿童模式验证'
      subtitle = '请家长输入PIN或微信授权'
    }

    const hasPIN = app.hasChildModePIN()
    if (!hasPIN && mode === 'verify') {
      title = '设置家长PIN'
      subtitle = '首次使用，请设置家长PIN（4-6位数字）'
    }

    this.setData({
      mode,
      title,
      subtitle,
      showWXAuthOption,
      targetEnabled,
      isUnlockMode,
      pinLength: CHILD_PIN_CONFIG.maxLength,
      remainAttempts: CHILD_PIN_CONFIG.maxAttempts
    })

    this.updateActivePIN()

    if (!hasPIN && mode === 'verify') {
      this.enterSetMode()
    }
  },

  updateActivePIN() {
    const activePIN = this.data.step === 1 ? this.data.currentPIN : this.data.confirmPIN
    this.setData({
      activePIN,
      activePINLength: activePIN.length
    })
  },

  enterSetMode() {
    this.setData({
      mode: 'set',
      title: '设置家长PIN',
      subtitle: '设置4-6位数字PIN作为家长验证',
      step: 1,
      currentPIN: '',
      confirmPIN: '',
      showWXAuthOption: false
    })
    this.updateActivePIN()
  },

  onInputPIN(e) {
    if (this.data.isLocked) return
    const value = (e.detail.value || '').replace(/\D/g, '').slice(0, this.data.pinLength)

    if (this.data.step === 1) {
      this.setData({ currentPIN: value, errorMessage: '' })
      if (value.length >= CHILD_PIN_CONFIG.minLength) {
        setTimeout(() => this.onConfirmFirstPIN(), 200)
      }
    } else {
      this.setData({ confirmPIN: value, errorMessage: '' })
      if (value.length === this.data.currentPIN.length) {
        setTimeout(() => this.onConfirmSecondPIN(), 200)
      }
    }
  },

  onKeyTap(e) {
    if (this.data.isLocked) return
    const key = e.currentTarget.dataset.key
    const field = this.data.step === 1 ? 'currentPIN' : 'confirmPIN'
    const current = this.data[field]

    if (key === 'delete') {
      this.setData({
        [field]: current.slice(0, -1),
        errorMessage: ''
      })
      this.updateActivePIN()
      return
    }

    if (current.length >= this.data.pinLength) return

    const newValue = current + key
    this.setData({
      [field]: newValue,
      errorMessage: ''
    })
    this.updateActivePIN()

    if (this.data.mode === 'set') {
      if (this.data.step === 1 && newValue.length >= CHILD_PIN_CONFIG.minLength) {
        setTimeout(() => this.onConfirmFirstPIN(), 150)
      } else if (this.data.step === 2 && newValue.length === this.data.currentPIN.length) {
        setTimeout(() => this.onConfirmSecondPIN(), 150)
      }
    } else {
      if (newValue.length >= CHILD_PIN_CONFIG.minLength) {
        setTimeout(() => this.doVerifyPIN(newValue), 150)
      }
    }
  },

  onConfirmFirstPIN() {
    const pin = this.data.currentPIN
    if (pin.length < CHILD_PIN_CONFIG.minLength) {
      this.setData({ errorMessage: `PIN至少${CHILD_PIN_CONFIG.minLength}位数字` })
      return
    }
    this.setData({
      step: 2,
      title: '确认家长PIN',
      subtitle: '请再次输入相同的PIN',
      confirmPIN: '',
      errorMessage: ''
    })
    this.updateActivePIN()
  },

  onConfirmSecondPIN() {
    const { currentPIN, confirmPIN } = this.data
    if (currentPIN !== confirmPIN) {
      this.setData({
        errorMessage: '两次输入的PIN不一致，请重新输入',
        currentPIN: '',
        confirmPIN: '',
        step: 1,
        title: '设置家长PIN',
        subtitle: '设置4-6位数字PIN作为家长验证'
      })
      this.updateActivePIN()
      return
    }

    const result = app.setChildModePIN(currentPIN)
    if (result.success) {
      showSuccess('PIN设置成功')
      this.handleAfterPINSet()
    } else {
      this.setData({
        errorMessage: result.message,
        currentPIN: '',
        confirmPIN: '',
        step: 1
      })
    }
  },

  doVerifyPIN(pin) {
    const result = app.verifyChildModePIN(pin)

    if (result.locked) {
      this.setData({
        isLocked: true,
        lockCountdown: result.remainSeconds,
        errorMessage: result.message
      })
      this.startLockCountdown()
      return
    }

    if (!result.success) {
      this.setData({
        errorMessage: result.message,
        remainAttempts: result.remainAttempts || 0,
        currentPIN: ''
      })
      return
    }

    showSuccess('验证通过')
    this.handleAfterVerifySuccess()
  },

  startLockCountdown() {
    this._lockTimer = setInterval(() => {
      let countdown = this.data.lockCountdown - 1
      if (countdown <= 0) {
        clearInterval(this._lockTimer)
        this.setData({
          isLocked: false,
          lockCountdown: 0,
          errorMessage: '',
          remainAttempts: CHILD_PIN_CONFIG.maxAttempts,
          currentPIN: ''
        })
      } else {
        const min = Math.floor(countdown / 60)
        const sec = countdown % 60
        this.setData({
          lockCountdown: countdown,
          errorMessage: min > 0
            ? `输入次数过多，请${min}分${sec}秒后重试`
            : `输入次数过多，请${sec}秒后重试`
        })
      }
    }, 1000)
  },

  onWXAuth() {
    if (this.data.isAuthorizing) return
    this.setData({ isAuthorizing: true })

    app.requestWXAuthForChildMode(this.data.mode).then(result => {
      this.setData({ isAuthorizing: false })
      if (result.success) {
        showSuccess('微信授权成功')
        if (this.data.mode === 'set') {
          this.handleAfterPINSet()
        } else {
          this.handleAfterVerifySuccess()
        }
      } else {
        showError(result.message || '微信授权失败，请使用PIN验证')
      }
    })
  },

  handleAfterPINSet() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      setTimeout(() => navigateBack(), 800)
    } else {
      wx.switchTab({ url: '/pages/settings/settings' })
    }
  },

  handleAfterVerifySuccess() {
    if (this.data.isUnlockMode) {
      app.setChildModeLocked(false)
      showSuccess('已解锁，可继续使用')
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 800)
      return
    }

    if (this.data.mode === 'change') {
      this.enterSetMode()
      return
    }

    app.setChildModeEnabled(this.data.targetEnabled)
    setTimeout(() => {
      if (getCurrentPages().length > 1) {
        navigateBack()
      } else {
        wx.switchTab({ url: '/pages/settings/settings' })
      }
    }, 800)
  },

  onUnload() {
    if (this._lockTimer) {
      clearInterval(this._lockTimer)
    }
  }
})
