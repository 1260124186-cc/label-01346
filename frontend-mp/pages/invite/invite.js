const app = getApp()
const { INVITE_CONFIG, SHARE_CONFIG } = require('../../utils/constants')
const { showToast, formatNumber, formatDate, showSuccess } = require('../../utils/util')

Page({
  data: {
    totalInvited: 0,
    totalRewards: 0,
    inviteRecords: [],
    userInfo: {},
    showPoster: false,
    posterImage: '',
    isGeneratingPoster: false,
    inviterRewardPoints: INVITE_CONFIG.inviterRewardPoints,
    inviteeRewardPoints: INVITE_CONFIG.inviteeRewardPoints,
    todayShared: false,
    remainingSharePoints: 0,
    shareTips: ''
  },

  onLoad() {
    console.log('[Invite] 页面加载')
    this.loadInviteData()
    this.loadShareStatus()
  },

  onShow() {
    console.log('[Invite] 页面显示')
    this.loadInviteData()
    this.loadShareStatus()
  },

  loadInviteData() {
    const stats = app.getInviteStats()
    const userInfo = app.globalData.userInfo || {}

    this.setData({
      totalInvited: stats.totalInvited,
      totalRewards: stats.totalRewards,
      inviteRecords: stats.records,
      userInfo
    })

    console.log('[Invite] 邀请数据已加载', stats)
  },

  loadShareStatus() {
    const shareInfo = app.getShareInfo()
    const remaining = app.getRemainingSharePoints()
    const todayShared = shareInfo.shareCount > 0

    let shareTips = ''
    if (remaining > 0) {
      shareTips = `今日分享还可获得 ${remaining} 积分`
    } else {
      shareTips = '今日分享积分已达上限'
    }

    this.setData({
      todayShared,
      remainingSharePoints: remaining,
      shareTips
    })
  },

  onInviteTap() {
    console.log('[Invite] 点击邀请好友')
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    showToast('请点击右上角分享给好友')
  },

  generatePoster() {
    console.log('[Invite] 生成邀请海报')

    if (this.data.isGeneratingPoster) {
      return
    }

    this.setData({ isGeneratingPoster: true })

    const query = wx.createSelectorQuery()
    query.select('#posterCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) {
          this.generatePosterFallback()
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        this.drawPoster(ctx, res[0].width, res[0].height)

        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvas,
            success: (result) => {
              this.setData({
                posterImage: result.tempFilePath,
                showPoster: true,
                isGeneratingPoster: false
              })
              showSuccess('海报生成成功')
            },
            fail: (err) => {
              console.error('[Invite] 海报生成失败', err)
              this.generatePosterFallback()
            }
          })
        }, 500)
      })
  },

  generatePosterFallback() {
    console.log('[Invite] 使用备用方案生成海报')
    const userInfo = this.data.userInfo || {}
    const nickName = userInfo.nickName || '环保达人'

    this.setData({
      posterImage: '',
      showPoster: true,
      isGeneratingPoster: false
    })

    showToast('请使用分享功能邀请好友')
  },

  drawPoster(ctx, width, height) {
    const { INVITE_CONFIG } = require('../../utils/constants')
    const userInfo = this.data.userInfo || {}
    const nickName = userInfo.nickName || '环保达人'
    const userId = app.getUserId()

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#5BBD72')
    gradient.addColorStop(1, '#4A9D5F')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      ctx.arc(
        width * (0.2 + i * 0.2),
        height * 0.3 + Math.sin(i) * 30,
        30 + i * 10,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('🌿 垃圾分类助手', width / 2, 60)

    ctx.font = '16px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillText(INVITE_CONFIG.posterTitle, width / 2, 90)

    ctx.font = '14px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText(INVITE_CONFIG.posterSubtitle, width / 2, 115)

    const cardY = 150
    const cardHeight = 200
    const cardPadding = 20
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.roundRect(cardPadding, cardY, width - cardPadding * 2, cardHeight, 12)
    ctx.fill()

    ctx.fillStyle = '#2D3436'
    ctx.font = 'bold 18px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`${nickName} 邀请你一起加入`, cardPadding + 15, cardY + 40)

    ctx.fillStyle = '#636E72'
    ctx.font = '14px sans-serif'
    ctx.fillText('学习垃圾分类知识，保护我们的家园', cardPadding + 15, cardY + 65)

    const rewardY = cardY + 95
    ctx.fillStyle = 'rgba(91, 189, 114, 0.1)'
    ctx.beginPath()
    ctx.roundRect(cardPadding + 15, rewardY, (width - cardPadding * 2 - 40) / 2, 70, 8)
    ctx.fill()

    ctx.fillStyle = '#5BBD72'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    const reward1X = cardPadding + 15 + (width - cardPadding * 2 - 40) / 4
    ctx.fillText(`+${INVITE_CONFIG.inviteeRewardPoints}`, reward1X, rewardY + 35)

    ctx.fillStyle = '#636E72'
    ctx.font = '12px sans-serif'
    ctx.fillText('新人注册奖励', reward1X, rewardY + 55)

    const reward2X = width - cardPadding - 15 - (width - cardPadding * 2 - 40) / 4
    ctx.fillStyle = 'rgba(243, 156, 18, 0.1)'
    ctx.beginPath()
    ctx.roundRect(cardPadding + 15 + (width - cardPadding * 2 - 40) / 2 + 10, rewardY, (width - cardPadding * 2 - 40) / 2, 70, 8)
    ctx.fill()

    ctx.fillStyle = '#F39C12'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText(`+${INVITE_CONFIG.inviterRewardPoints}`, reward2X, rewardY + 35)

    ctx.fillStyle = '#636E72'
    ctx.font = '12px sans-serif'
    ctx.fillText('邀请好友奖励', reward2X, rewardY + 55)

    const qrSize = 80
    const qrX = (width - qrSize) / 2
    const qrY = cardY + cardHeight - 30

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10)

    ctx.strokeStyle = '#2D3436'
    ctx.lineWidth = 2
    ctx.strokeRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10)

    ctx.fillStyle = '#2D3436'
    const cellSize = 8
    const cols = Math.floor(qrSize / cellSize)
    const rows = Math.floor(qrSize / cellSize)
    const seed = userId.charCodeAt(0) || 1

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const isCorner = (i < 3 && j < 3) || (i < 3 && j >= cols - 3) || (i >= rows - 3 && j < 3)
        const pseudoRandom = ((i * seed + j * 7) % 5) < 2

        if (isCorner || pseudoRandom) {
          ctx.fillRect(qrX + j * cellSize, qrY + i * cellSize, cellSize - 1, cellSize - 1)
        }
      }
    }

    ctx.fillStyle = '#636E72'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('扫码加入 · 一起环保', width / 2, qrY + qrSize + 25)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '12px sans-serif'
    ctx.fillText('垃圾分类助手 v1.0', width / 2, height - 20)
  },

  savePoster() {
    if (!this.data.posterImage) {
      showToast('海报图片不存在')
      return
    }

    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImage,
      success: () => {
        showSuccess('海报已保存到相册')
      },
      fail: (err) => {
        console.error('[Invite] 保存海报失败', err)
        if (err.errMsg && err.errMsg.indexOf('auth deny') > -1) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            confirmText: '去授权',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        } else {
          showToast('保存失败，请重试')
        }
      }
    })
  },

  closePoster() {
    this.setData({ showPoster: false })
  },

  preventClose() {},

  onShareAppMessage() {
    console.log('[Invite] 分享邀请')
    const shareInfo = app.generateShareInfo()

    const result = app.handleShareSuccess()
    if (result.success && result.points > 0) {
      showToast(`分享成功 +${result.points}积分`)
    } else if (result.reason === 'daily_limit') {
      console.log('[Invite] 今日分享积分已达上限')
    }

    this.loadShareStatus()
    return shareInfo
  },

  onShareTimeline() {
    console.log('[Invite] 分享到朋友圈')
    return {
      title: SHARE_CONFIG.shareTitle,
      query: `inviterId=${app.getUserId()}`,
      imageUrl: SHARE_CONFIG.shareImageUrl
    }
  },

  simulateInvite() {
    console.log('[Invite] 模拟邀请成功')
    const record = app.simulateInviteAccepted()
    if (record) {
      showSuccess(`邀请成功 +${record.rewardPoints}积分`)
      this.loadInviteData()
    }
  },

  goToPoints() {
    wx.navigateTo({ url: '/pages/points/points' })
  },

  onPullDownRefresh() {
    console.log('[Invite] 下拉刷新')
    this.loadInviteData()
    this.loadShareStatus()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  }
})
