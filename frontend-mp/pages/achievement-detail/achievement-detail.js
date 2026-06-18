const app = getApp()
const { formatDate, generateId, showToast, showSuccess, showLoading, hideLoading, navigateTo, navigateBack } = require('../../utils/util.js')

const ACHIEVEMENT_SLOGANS = {
  classify_master: '分类达人，环保先锋',
  quiz_king: '知识就是力量',
  signin_30: '坚持就是胜利',
  classify_100: '百折不挠，分类专家',
  points_5000: '积少成多，厚积薄发',
  invite_10: '社交达人，绿色传播者',
  group_task_hero: '团队之光，协作先锋',
  cert_collector: '学无止境，证途璀璨'
}

const ACHIEVEMENT_LINKS = {
  classifyCount: '/pages/records/records',
  correctQuizCount: '/pages/quiz-records/quiz-records',
  continuousSignIn: '/pages/signin/signin',
  totalPoints: '/pages/points/points',
  inviteCount: '/pages/invite/invite',
  groupTaskComplete: '/pages/family-group/family-group',
  certCollect: '/pages/certificates/certificates'
}

const ACHIEVEMENT_LINK_LABELS = {
  classifyCount: '查看分类记录',
  correctQuizCount: '查看答题记录',
  continuousSignIn: '查看签到记录',
  totalPoints: '查看积分明细',
  inviteCount: '查看邀请记录',
  groupTaskComplete: '查看家庭组',
  certCollect: '查看证书列表'
}

Page({
  data: {
    achievement: null,
    isUnlocked: false,
    unlockTime: '',
    slogan: '',
    relatedRecords: [],
    relatedLink: '',
    relatedLinkLabel: '',
    userInfo: null,
    showPosterModal: false,
    isDrawing: false,
    tempImagePath: '',
    canvasWidth: 600,
    canvasHeight: 800,
    showUnlockAnimation: false,
    unlockParticles: []
  },

  onLoad(options) {
    console.log('[AchievementDetail] 页面加载', options)
    const achievementId = options.id || ''
    const showUnlock = options.showUnlock === 'true'
    this.loadAchievementDetail(achievementId)

    if (showUnlock) {
      this.playUnlockAnimation()
    }
  },

  loadAchievementDetail(achievementId) {
    const achievements = app.getAchievements ? app.getAchievements() : []
    const achievement = achievements.find(a => a.id === achievementId)

    if (!achievement) {
      showToast('成就不存在')
      setTimeout(() => navigateBack(), 1500)
      return
    }

    const unlockRecords = wx.getStorageSync('achievementUnlockRecords') || {}
    const unlockTime = unlockRecords[achievementId] || ''

    const slogan = ACHIEVEMENT_SLOGANS[achievementId] || '环保路上，你我同行'
    const relatedLink = ACHIEVEMENT_LINKS[achievement.condition.type] || ''
    const relatedLinkLabel = ACHIEVEMENT_LINK_LABELS[achievement.condition.type] || '查看详情'

    const relatedRecords = this.getRelatedRecords(achievement)

    const userInfo = app.globalData.userInfo || {}

    this.setData({
      achievement,
      isUnlocked: achievement.unlocked,
      unlockTime,
      slogan,
      relatedRecords,
      relatedLink,
      relatedLinkLabel,
      userInfo
    })

    console.log('[AchievementDetail] 成就详情加载完成', achievement.name)
  },

  getRelatedRecords(achievement) {
    const condType = achievement.condition.type
    const records = []

    switch (condType) {
      case 'classifyCount': {
        const classifyRecords = app.getClassifyRecords ? app.getClassifyRecords() : []
        classifyRecords.slice(0, 5).forEach(r => {
          records.push({
            id: r.id,
            title: r.trashName,
            subtitle: r.typeName,
            time: r.time,
            emoji: r.emoji
          })
        })
        break
      }
      case 'correctQuizCount': {
        const quizRecords = app.getQuizRecords ? app.getQuizRecords() : []
        quizRecords.slice(0, 5).forEach(r => {
          records.push({
            id: r.id,
            title: r.chapterName || '综合答题',
            subtitle: `正确${r.correctCount}/${r.totalQuestions}题`,
            time: r.time,
            emoji: '❓'
          })
        })
        break
      }
      case 'continuousSignIn': {
        const signInRecords = app.getSignInRecords ? app.getSignInRecords() : []
        signInRecords.slice(-5).reverse().forEach(date => {
          records.push({
            id: date,
            title: '签到打卡',
            subtitle: date,
            time: date,
            emoji: '📅'
          })
        })
        break
      }
      case 'totalPoints': {
        const pointsRecords = app.getPointsRecords ? app.getPointsRecords() : []
        pointsRecords.filter(r => r.type === 'earn').slice(0, 5).forEach(r => {
          records.push({
            id: r.id,
            title: r.title,
            subtitle: `+${r.points}积分`,
            time: r.time,
            emoji: r.emoji || '💰'
          })
        })
        break
      }
      case 'inviteCount': {
        const inviteRecords = app.getInviteRecords ? app.getInviteRecords() : []
        inviteRecords.slice(0, 5).forEach(r => {
          records.push({
            id: r.id,
            title: r.inviteeName || '好友',
            subtitle: `+${r.rewardPoints}积分`,
            time: r.time,
            emoji: '👥'
          })
        })
        break
      }
      case 'groupTaskComplete': {
        const myGroups = app.getMyGroups ? app.getMyGroups() : []
        myGroups.forEach(g => {
          records.push({
            id: g.id,
            title: g.name,
            subtitle: `${g.memberCount || 0}名成员`,
            time: g.createTime || '',
            emoji: g.type === 'family' ? '👨‍👩‍👧‍👦' : '🏫'
          })
        })
        break
      }
      case 'certCollect': {
        const certificates = app.globalData.certificates || wx.getStorageSync('certificates') || []
        certificates.slice(0, 5).forEach(c => {
          records.push({
            id: c.id,
            title: c.certificateName || c.courseTitle,
            subtitle: c.certificateLevel || '初级',
            time: c.passDate || '',
            emoji: '🎓'
          })
        })
        break
      }
    }

    return records
  },

  playUnlockAnimation() {
    const particles = []
    const emojis = ['✨', '🌟', '⭐', '🎉', '🏆', '💫', '🎊', '💥']
    for (let i = 0; i < 20; i++) {
      particles.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 1.5 + Math.random() * 1.5,
        scale: 0.5 + Math.random() * 1
      })
    }

    this.setData({
      showUnlockAnimation: true,
      unlockParticles: particles
    })

    setTimeout(() => {
      this.setData({ showUnlockAnimation: false })
    }, 4000)
  },

  onRelatedLinkTap() {
    const { relatedLink } = this.data
    if (relatedLink) {
      navigateTo(relatedLink)
    }
  },

  onRecordItemTap(e) {
    const { item } = e.currentTarget.dataset
    const condType = this.data.achievement.condition.type
    if (condType === 'classifyCount' || condType === 'correctQuizCount') {
      showToast(`${item.title} - ${item.subtitle}`)
    }
  },

  showPosterModal() {
    this.setData({ showPosterModal: true })
  },

  hidePosterModal() {
    this.setData({ showPosterModal: false })
  },

  stopPropagation() {},

  onGeneratePoster() {
    if (this.data.isDrawing) return
    this.setData({ isDrawing: true })
    showLoading('生成海报中...')

    this.drawPosterToCanvas().then((tempFilePath) => {
      hideLoading()
      this.setData({
        tempImagePath,
        isDrawing: false
      })
      showSuccess('海报生成成功')
    }).catch((err) => {
      hideLoading()
      this.setData({ isDrawing: false })
      console.error('[AchievementDetail] 海报生成失败', err)
      showToast('海报生成失败，请重试')
    })
  },

  drawPosterToCanvas() {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select('#posterCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0] || !res[0].node) {
            reject(new Error('获取canvas失败'))
            return
          }

          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio || 2
          const designW = 600
          const designH = 800

          canvas.width = designW * dpr
          canvas.height = designH * dpr
          ctx.scale(dpr, dpr)

          this.drawPoster(ctx, designW, designH)

          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvas,
              x: 0, y: 0,
              width: designW,
              height: designH,
              destWidth: designW * 2,
              destHeight: designH * 2,
              success: (res) => resolve(res.tempFilePath),
              fail: reject
            })
          }, 200)
        })
    })
  },

  drawPoster(ctx, w, h) {
    const { achievement, userInfo, slogan } = this.data
    const primaryColor = achievement.color || '#5BBD72'

    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(0.5, '#16213e')
    gradient.addColorStop(1, '#0f3460')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    for (let i = 0; i < 30; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const r = Math.random() * 2 + 0.5
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`
      ctx.fill()
    }

    const glowGradient = ctx.createRadialGradient(w / 2, 300, 0, w / 2, 300, 200)
    glowGradient.addColorStop(0, primaryColor + '40')
    glowGradient.addColorStop(0.5, primaryColor + '15')
    glowGradient.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGradient
    ctx.fillRect(0, 100, w, 400)

    ctx.font = 'bold 80px sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = primaryColor + '80'
    ctx.shadowBlur = 20
    ctx.fillText(achievement.emoji, w / 2, 260)
    ctx.shadowBlur = 0

    ctx.font = 'bold 36px sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(achievement.name, w / 2, 360)

    ctx.strokeStyle = primaryColor + '60'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(w / 2 - 100, 390)
    ctx.lineTo(w / 2 + 100, 390)
    ctx.stroke()

    ctx.font = '24px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText(achievement.description, w / 2, 430)

    ctx.font = '28px sans-serif'
    ctx.fillStyle = primaryColor
    ctx.fillText(slogan, w / 2, 480)

    const avatarY = 550
    const avatarR = 40
    const avatarX = w / 2
    ctx.beginPath()
    ctx.arc(avatarX, avatarY, avatarR + 3, 0, Math.PI * 2)
    ctx.strokeStyle = primaryColor
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2)
    ctx.fillStyle = primaryColor + '30'
    ctx.fill()

    ctx.font = '28px sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(userInfo.nickName ? userInfo.nickName[0] : '达', avatarX, avatarY + 2)

    ctx.font = '24px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
    ctx.fillText(userInfo.nickName || '环保达人', avatarX, avatarY + 60)

    ctx.font = '18px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.fillText('垃圾分类助手 · 成就勋章', w / 2, h - 60)

    ctx.font = '16px sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
    ctx.fillText('长按识别小程序码', w / 2, h - 30)
  },

  onSavePoster() {
    const { tempImagePath } = this.data
    if (!tempImagePath) {
      showToast('请先生成海报')
      return
    }

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
                      this.doSaveImage(tempImagePath)
                    }
                  }
                })
              }
            }
          })
        } else {
          this.doSaveImage(tempImagePath)
        }
      }
    })
  },

  doSaveImage(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        showSuccess('海报已保存到相册')
      },
      fail: (err) => {
        console.error('[AchievementDetail] 保存失败', err)
        showToast('保存失败')
      }
    })
  },

  onShareAppMessage() {
    const { achievement, slogan, tempImagePath } = this.data
    const title = `我解锁了「${achievement.name}」勋章！${slogan}`

    const shareInfo = {
      title,
      path: '/pages/index/index?from=achievement_share&achievementId=' + achievement.id
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
    const { achievement, slogan, tempImagePath } = this.data
    const shareInfo = {
      title: `我解锁了「${achievement.name}」勋章！${slogan}`,
      query: `from=achievement_timeline&achievementId=${achievement.id}`
    }

    if (tempImagePath) {
      shareInfo.imageUrl = tempImagePath
    }

    return shareInfo
  },

  goBack() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      navigateBack()
    } else {
      navigateTo('/pages/profile/profile')
    }
  }
})