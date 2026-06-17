const app = getApp()
const { formatDate, generateId, showToast, showSuccess, showLoading, hideLoading, navigateTo, navigateBack } = require('../../utils/util.js')

const CERTIFICATE_COLORS = {
  'kitchen': { primary: '#5BBD72', gradientStart: '#6ECC84', gradientEnd: '#3A9D5A', accent: '#B8E6C4' },
  'harmful': { primary: '#E85D5D', gradientStart: '#F06E6E', gradientEnd: '#C0392B', accent: '#F8C8C8' },
  'recyclable': { primary: '#4A90D9', gradientStart: '#5DA3E8', gradientEnd: '#2E6CB5', accent: '#B8D4F0' },
  'other': { primary: '#8E8E93', gradientStart: '#A0A0A5', gradientEnd: '#6B6B70', accent: '#D8D8DB' },
  'esg': { primary: '#9B59B6', gradientStart: '#A569BD', gradientEnd: '#7D3C98', accent: '#D8B8E8' },
  'default': { primary: '#5BBD72', gradientStart: '#6ECC84', gradientEnd: '#3A9D5A', accent: '#B8E6C4' }
}

Page({
  data: {
    certificate: null,
    courseColor: null,
    tempImagePath: '',
    canvasWidth: 750,
    canvasHeight: 1000,
    isDrawing: false
  },

  onLoad(options) {
    console.log('[Certificate] 页面加载', options)
    const certId = options.certId || ''
    this.loadCertificate(certId)
  },

  loadCertificate(certId) {
    const certificates = this.getCertificates()
    let certificate = certificates.find(c => c.id === certId)

    if (!certificate) {
      certificate = this.generateMockCertificate(certId)
    }

    if (!certificate.certNo) {
      certificate.certNo = 'CERT' + Date.now()
    }

    const userInfo = app.globalData.userInfo || {}
    certificate.userNickName = certificate.userNickName || userInfo.nickName || '环保达人'
    certificate.avatarUrl = certificate.avatarUrl || userInfo.avatarUrl || ''
    certificate.passDate = certificate.passDate || formatDate(new Date(), 'YYYY年MM月DD日')

    const colorKey = this.getColorKeyByCourseId(certificate.courseId)
    const courseColor = CERTIFICATE_COLORS[colorKey] || CERTIFICATE_COLORS.default

    this.setData({
      certificate,
      courseColor
    })

    console.log('[Certificate] 证书数据加载完成', certificate)
  },

  getCertificates() {
    let certificates = app.globalData.certificates
    if (!certificates || !Array.isArray(certificates)) {
      certificates = wx.getStorageSync('certificates') || []
    }
    return certificates
  },

  generateMockCertificate(certId) {
    const { COURSES } = require('../../data/courses.js')
    const course = COURSES[0] || {}

    return {
      id: certId || generateId(),
      courseId: course.id || 'course_kitchen_01',
      courseTitle: course.title || '厨余垃圾减量与资源化',
      certificateName: course.certificateName || '厨余垃圾管理师',
      certificateLevel: course.certificateLevel || '初级',
      userNickName: '',
      avatarUrl: '',
      totalDuration: course.totalDuration || 45,
      accuracy: 92,
      passDate: '',
      certNo: '',
      pointsReward: course.pointsReward || 200
    }
  },

  getColorKeyByCourseId(courseId) {
    if (!courseId) return 'default'
    if (courseId.includes('kitchen')) return 'kitchen'
    if (courseId.includes('harmful')) return 'harmful'
    if (courseId.includes('recyclable')) return 'recyclable'
    if (courseId.includes('other')) return 'other'
    if (courseId.includes('esg')) return 'esg'
    return 'default'
  },

  onSaveToAlbum() {
    if (this.data.isDrawing) return
    this.setData({ isDrawing: true })
    showLoading('正在生成证书...')

    this.drawCertificateToCanvas().then((tempFilePath) => {
      hideLoading()
      return this.saveImageToAlbum(tempFilePath)
    }).then(() => {
      this.setData({ isDrawing: false })
      showSuccess('证书已保存到相册')
    }).catch((err) => {
      hideLoading()
      this.setData({ isDrawing: false })
      console.error('[Certificate] 保存失败', err)
      showToast('保存失败，请重试')
    })
  },

  drawCertificateToCanvas() {
    return new Promise((resolve, reject) => {
      const { certificate, courseColor } = this.data
      const query = wx.createSelectorQuery()
      query.select('#certCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) {
            reject(new Error('获取canvas失败'))
            return
          }

          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio || 2
          const designW = 750
          const designH = 1000

          canvas.width = designW * dpr
          canvas.height = designH * dpr
          ctx.scale(dpr, dpr)

          this.drawCertificate(ctx, designW, designH, certificate, courseColor)

          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvas,
              x: 0,
              y: 0,
              width: designW,
              height: designH,
              destWidth: designW * 2,
              destHeight: designH * 2,
              success: (res) => {
                this.setData({ tempImagePath: res.tempFilePath })
                resolve(res.tempFilePath)
              },
              fail: reject
            })
          }, 200)
        })
    })
  },

  drawCertificate(ctx, w, h, cert, colors) {
    const { primary, gradientStart, gradientEnd, accent } = colors

    this.drawBackground(ctx, w, h, gradientStart, gradientEnd)
    this.drawBorder(ctx, w, h, primary, accent)
    this.drawCornerDecorations(ctx, w, h, primary)
    this.drawHeader(ctx, w, primary)
    this.drawCertTitle(ctx, w, 220, primary)
    this.drawCertInfo(ctx, w, cert, primary)
    this.drawSeal(ctx, w, h, primary)
    this.drawQRCodePlaceholder(ctx, w, h, primary)
  },

  drawBackground(ctx, w, h, start, end) {
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, '#FFFDF5')
    gradient.addColorStop(0.5, '#FFFBEC')
    gradient.addColorStop(1, '#FFFDF5')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    const bgGradient = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w)
    bgGradient.addColorStop(0, start + '08')
    bgGradient.addColorStop(1, end + '03')
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, w, h)
  },

  drawBorder(ctx, w, h, primary, accent) {
    const padding = 30
    const borderW = 4
    const innerPadding = 15

    ctx.strokeStyle = primary
    ctx.lineWidth = borderW
    ctx.strokeRect(padding, padding, w - padding * 2, h - padding * 2)

    ctx.strokeStyle = accent
    ctx.lineWidth = 1
    ctx.setLineDash([8, 4])
    ctx.strokeRect(padding + innerPadding, padding + innerPadding,
      w - (padding + innerPadding) * 2, h - (padding + innerPadding) * 2)
    ctx.setLineDash([])

    ctx.strokeStyle = primary + '80'
    ctx.lineWidth = 1
    ctx.strokeRect(padding + innerPadding + 8, padding + innerPadding + 8,
      w - (padding + innerPadding + 8) * 2, h - (padding + innerPadding + 8) * 2)
  },

  drawCornerDecorations(ctx, w, h, color) {
    const corners = [
      { x: 30, y: 30 },
      { x: w - 30, y: 30 },
      { x: 30, y: h - 30 },
      { x: w - 30, y: h - 30 }
    ]
    const size = 50

    corners.forEach((corner, idx) => {
      ctx.save()
      ctx.translate(corner.x, corner.y)
      if (idx === 1) ctx.rotate(Math.PI / 2)
      if (idx === 3) ctx.rotate(Math.PI / 2)
      if (idx === 2) ctx.rotate(Math.PI)

      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'

      ctx.beginPath()
      ctx.moveTo(0, size)
      ctx.lineTo(0, 0)
      ctx.lineTo(size, 0)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(8, size)
      ctx.lineTo(8, 8)
      ctx.lineTo(size, 8)
      ctx.strokeStyle = color + '60'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(0, 0, 6, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      ctx.restore()
    })

    this.drawStar(ctx, 80, 80, 5, 12, 5, color + '40')
    this.drawStar(ctx, w - 80, 80, 5, 12, 5, color + '40')
    this.drawStar(ctx, 80, h - 80, 5, 12, 5, color + '40')
    this.drawStar(ctx, w - 80, h - 80, 5, 12, 5, color + '40')
  },

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
  },

  drawHeader(ctx, w, color) {
    const centerX = w / 2
    const startY = 70

    ctx.font = 'bold 28px sans-serif'
    ctx.fillStyle = color + '80'
    ctx.textAlign = 'center'
    ctx.fillText('★ ★ ★', centerX, startY)

    ctx.font = '20px sans-serif'
    ctx.fillStyle = '#999'
    ctx.fillText('OFFICIAL CERTIFICATE', centerX, startY + 35)

    ctx.strokeStyle = color + '40'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(w / 2 - 120, startY + 55)
    ctx.lineTo(w / 2 - 20, startY + 55)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(w / 2, startY + 55, 6, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(w / 2 + 20, startY + 55)
    ctx.lineTo(w / 2 + 120, startY + 55)
    ctx.stroke()
  },

  drawCertTitle(ctx, w, startY, color) {
    const centerX = w / 2

    ctx.font = 'bold 64px "STKaiti", "KaiTi", serif'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.shadowColor = color + '40'
    ctx.shadowBlur = 10
    ctx.shadowOffsetY = 2
    ctx.fillText('电子结业证书', centerX, startY)
    ctx.shadowBlur = 0
    ctx.shadowOffsetY = 0

    ctx.font = '22px sans-serif'
    ctx.fillStyle = '#666'
    ctx.fillText('ELECTRONIC COMPLETION CERTIFICATE', centerX, startY + 50)
  },

  drawCertInfo(ctx, w, cert, color) {
    const centerX = w / 2
    let startY = 340
    const lineHeight = 50

    ctx.font = '24px sans-serif'
    ctx.fillStyle = '#333'
    ctx.textAlign = 'left'

    const holderLabel = '兹证明'
    ctx.font = '24px sans-serif'
    ctx.fillStyle = '#666'
    ctx.fillText(holderLabel, 100, startY)

    ctx.font = 'bold 36px "STKaiti", "KaiTi", serif'
    ctx.fillStyle = color
    const nickWidth = ctx.measureText(cert.userNickName).width
    ctx.fillText(cert.userNickName, 180, startY)

    ctx.font = '24px sans-serif'
    ctx.fillStyle = '#666'
    ctx.fillText('（学员），已完成', 180 + nickWidth + 10, startY)

    startY += lineHeight + 10
    ctx.font = 'bold 32px "STKaiti", "KaiTi", serif'
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.fillText('《' + cert.courseTitle + '》', centerX, startY)

    startY += lineHeight
    ctx.font = '24px sans-serif'
    ctx.fillStyle = '#666'
    ctx.textAlign = 'center'
    ctx.fillText('全部课程学习，并通过考核，特发此证。', centerX, startY)

    startY += lineHeight + 30

    const infoLeftX = 120
    const infoRightX = w / 2 + 60
    const labelColor = '#888'
    const valueColor = '#333'

    this.drawInfoRow(ctx, infoLeftX, startY, '证书名称：', cert.certificateName, labelColor, valueColor, color)
    this.drawInfoRow(ctx, infoRightX, startY, '证书等级：', cert.certificateLevel, labelColor, valueColor, color)

    startY += lineHeight
    this.drawInfoRow(ctx, infoLeftX, startY, '学习时长：', cert.totalDuration + ' 学时', labelColor, valueColor, color)
    this.drawInfoRow(ctx, infoRightX, startY, '考核成绩：', cert.accuracy + ' 分', labelColor, valueColor, color)

    startY += lineHeight
    this.drawInfoRow(ctx, infoLeftX, startY, '通过日期：', cert.passDate, labelColor, valueColor, color)
    this.drawInfoRow(ctx, infoRightX, startY, '奖励积分：', '+' + cert.pointsReward, labelColor, valueColor, color)

    startY += lineHeight + 20
    ctx.font = '20px monospace'
    ctx.fillStyle = '#999'
    ctx.textAlign = 'center'
    ctx.fillText('证书编号：' + cert.certNo, centerX, startY)
  },

  drawInfoRow(ctx, x, y, label, value, labelColor, valueColor, accentColor) {
    ctx.font = '22px sans-serif'
    ctx.fillStyle = labelColor
    ctx.textAlign = 'left'
    ctx.fillText(label, x, y)

    const labelWidth = ctx.measureText(label).width
    ctx.font = 'bold 24px sans-serif'
    ctx.fillStyle = valueColor
    ctx.fillText(value, x + labelWidth, y)
  },

  drawSeal(ctx, w, h, color) {
    const sealX = w - 180
    const sealY = h - 220
    const radius = 80

    ctx.save()
    ctx.translate(sealX, sealY)
    ctx.rotate(-0.15)

    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.strokeStyle = color + 'C0'
    ctx.lineWidth = 4
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(0, 0, radius - 8, 0, Math.PI * 2)
    ctx.strokeStyle = color + '80'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.font = 'bold 18px "STKaiti", "KaiTi", serif'
    ctx.fillStyle = color + 'D0'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const sealText = '垃圾分类培训中心'
    for (let i = 0; i < sealText.length; i++) {
      const angle = -Math.PI / 2 - (sealText.length - 1) * 0.15 / 2 + i * 0.15
      const charX = Math.cos(angle) * (radius - 20)
      const charY = Math.sin(angle) * (radius - 20)
      ctx.save()
      ctx.translate(charX, charY)
      ctx.rotate(angle + Math.PI / 2)
      ctx.fillText(sealText[i], 0, 0)
      ctx.restore()
    }

    this.drawStar(ctx, 0, -15, 5, 20, 8, color + 'C0')

    ctx.font = 'bold 14px sans-serif'
    ctx.fillStyle = color + 'C0'
    ctx.fillText('专用章', 0, 25)

    ctx.font = '12px sans-serif'
    ctx.fillStyle = color + '90'
    ctx.fillText('CERTIFIED', 0, 50)

    ctx.restore()
  },

  drawQRCodePlaceholder(ctx, w, h, color) {
    const qrX = 120
    const qrY = h - 260
    const size = 130

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(qrX - 5, qrY - 5, size + 10, size + 10)

    ctx.strokeStyle = color + '40'
    ctx.lineWidth = 1
    ctx.strokeRect(qrX - 5, qrY - 5, size + 10, size + 10)

    ctx.fillStyle = '#FFF'
    ctx.fillRect(qrX, qrY, size, size)

    const cells = 21
    const cellSize = size / cells

    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        if (this.isQRPatternCell(i, j, cells)) {
          ctx.fillStyle = color
          ctx.fillRect(qrX + j * cellSize, qrY + i * cellSize, cellSize, cellSize)
        } else if ((i + j) % 3 === 0 && Math.random() > 0.6) {
          ctx.fillStyle = color + '30'
          ctx.fillRect(qrX + j * cellSize, qrY + i * cellSize, cellSize, cellSize)
        }
      }
    }

    this.drawQRPosition(ctx, qrX, qrY, cellSize, color)
    this.drawQRPosition(ctx, qrX + size - 7 * cellSize, qrY, cellSize, color)
    this.drawQRPosition(ctx, qrX, qrY + size - 7 * cellSize, cellSize, color)

    ctx.font = '14px sans-serif'
    ctx.fillStyle = '#888'
    ctx.textAlign = 'center'
    ctx.fillText('扫码验证真伪', qrX + size / 2, qrY + size + 25)
  },

  isQRPatternCell(i, j, size) {
    if ((i < 3 && j < 3) || (i < 3 && j >= size - 3) || (i >= size - 3 && j < 3)) {
      return false
    }
    return (i * 7 + j * 13) % 5 === 0
  },

  drawQRPosition(ctx, x, y, cellSize, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, cellSize * 7, cellSize * 7)

    ctx.fillStyle = '#FFF'
    ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5)

    ctx.fillStyle = color
    ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3)
  },

  saveImageToAlbum(filePath) {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.writePhotosAlbum'] === false) {
            wx.showModal({
              title: '提示',
              content: '需要您授权保存图片到相册',
              confirmText: '去授权',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  wx.openSetting({
                    success: (settingRes) => {
                      if (settingRes.authSetting['scope.writePhotosAlbum']) {
                        this.doSave(filePath, resolve, reject)
                      } else {
                        reject(new Error('用户拒绝授权'))
                      }
                    }
                  })
                } else {
                  reject(new Error('用户取消授权'))
                }
              }
            })
          } else {
            this.doSave(filePath, resolve, reject)
          }
        }
      })
    })
  },

  doSave(filePath, resolve, reject) {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: resolve,
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('auth')) {
          reject(new Error('授权失败'))
        } else {
          reject(err)
        }
      }
    })
  },

  onShareAppMessage() {
    const { certificate, courseColor, tempImagePath } = this.data
    const title = `我获得了「${certificate.certificateName}」${certificate.certificateLevel}证书，快来一起学习垃圾分类吧！`

    const shareInfo = {
      title,
      path: '/pages/index/index?from=cert_share&certId=' + certificate.id
    }

    if (tempImagePath) {
      shareInfo.imageUrl = tempImagePath
    }

    const result = app.handleShareSuccess ? app.handleShareSuccess() : null
    if (result && result.success && result.points > 0) {
      showToast(`分享成功 +${result.points}积分`)
    }

    return shareInfo
  },

  onShareTimeline() {
    const { certificate, tempImagePath } = this.data
    const shareInfo = {
      title: `我已获得「${certificate.certificateName}」${certificate.certificateLevel}证书！`,
      query: `from=cert_timeline&certId=${certificate.id}`
    }

    if (tempImagePath) {
      shareInfo.imageUrl = tempImagePath
    }

    return shareInfo
  },

  goBackProfile() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      navigateBack()
    } else {
      navigateTo('/pages/profile/profile')
    }
  }
})
