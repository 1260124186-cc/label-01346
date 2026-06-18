const app = getApp()
const { showToast, showError, formatDate, navigateTo } = require('../../utils/util.js')

Page({
  data: {
    inputCode: '',
    isVerifying: false,
    result: null,
    verifyTime: ''
  },

  onLoad(options) {
    console.log('[CertificateVerify] 页面加载', options)

    if (options.code) {
      const code = decodeURIComponent(options.code)
      console.log('[CertificateVerify] URL 参数 code:', code)
      this.setData({ inputCode: code })
      this.onVerify()
    }

    if (options.certNo) {
      const certNo = decodeURIComponent(options.certNo)
      this.setData({ inputCode: certNo })
    }
  },

  onInput(e) {
    this.setData({
      inputCode: e.detail.value.trim(),
      result: null
    })
  },

  onClearInput() {
    this.setData({
      inputCode: '',
      result: null
    })
  },

  onScan() {
    console.log('[CertificateVerify] 扫码验真')
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        console.log('[CertificateVerify] 扫码结果', res)
        let code = res.result || ''

        const match = code.match(/code=([^&]+)/) || code.match(/certNo=([^&]+)/) || code.match(/certId=([^&]+)/)
        if (match) {
          code = decodeURIComponent(match[1])
        }

        code = code.replace(/^.*certificate-verify\?/, '')
        code = code.trim()

        this.setData({ inputCode: code })
        this.onVerify()
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('cancel')) {
          return
        }
        console.error('[CertificateVerify] 扫码失败', err)
        showError('扫码失败，请手动输入证书编号')
      }
    })
  },

  onVerify() {
    const { inputCode, isVerifying } = this.data

    if (isVerifying) return

    if (!inputCode || !inputCode.trim()) {
      showToast('请输入证书编号或验证码')
      return
    }

    this.setData({ isVerifying: true })

    setTimeout(() => {
      try {
        const result = app.verifyCertificate(inputCode.trim())
        const verifyTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')

        console.log('[CertificateVerify] 验真结果', result)

        this.setData({
          result,
          verifyTime,
          isVerifying: false
        })

        if (result.valid) {
          showToast('验真成功')
        } else {
          if (result.errorCode === 'RATE_LIMIT') {
            showToast('查询过于频繁，请稍后再试')
          } else if (result.errorCode === 'NOT_FOUND') {
            showToast('未找到该证书')
          } else if (result.errorCode === 'REVOKED') {
            showToast('该证书已被撤销')
          } else if (result.errorCode === 'EXPIRED') {
            showToast('该证书已过期')
          } else {
            showToast(result.errorMsg || '验真失败')
          }
        }
      } catch (e) {
        console.error('[CertificateVerify] 验真异常', e)
        this.setData({
          result: {
            valid: false,
            errorCode: 'SYSTEM_ERROR',
            errorMsg: '系统异常，请稍后重试'
          },
          isVerifying: false
        })
        showError('验真异常，请稍后重试')
      }
    }, 600)
  },

  formatISODate(isoString) {
    if (!isoString) return ''
    try {
      return formatDate(new Date(isoString), 'YYYY年MM月DD日 HH:mm')
    } catch (e) {
      return isoString
    }
  },

  onShareAppMessage() {
    return {
      title: '垃圾分类证书公开验真服务',
      path: '/pages/certificate-verify/certificate-verify',
      imageUrl: ''
    }
  },

  onShareTimeline() {
    return {
      title: '垃圾分类证书公开验真',
      query: ''
    }
  }
})
