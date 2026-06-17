const app = getApp()
const { navigateTo } = require('../../utils/util')

Page({
  data: {
    stats: {
      certificates: 0,
      completedCourses: 0,
      totalMinutes: 0
    },
    certificates: [],
    levelColors: {
      '初级': '#5BBD72',
      '中级': '#F39C12',
      '高级': '#E85D5D'
    }
  },

  onLoad() {
    console.log('[Certificates] 页面加载')
  },

  onShow() {
    console.log('[Certificates] 页面显示')
    this.loadStats()
    this.loadCertificates()
  },

  loadStats() {
    const stats = app.getLearningStats()
    this.setData({
      stats: {
        certificates: stats.certificates || 0,
        completedCourses: stats.completedCourses || 0,
        totalMinutes: stats.totalMinutes || 0
      }
    })
  },

  loadCertificates() {
    const certificates = app.getCertificates()
    this.setData({ certificates })
    console.log('[Certificates] 加载证书列表', certificates.length, '张')
  },

  onCertificateTap(e) {
    const { certId } = e.currentTarget.dataset
    navigateTo('/pages/certificate/certificate', { certId })
  },

  goToLearningCenter() {
    navigateTo('/pages/learning-center/learning-center')
  },

  onPullDownRefresh() {
    console.log('[Certificates] 下拉刷新')
    this.loadStats()
    this.loadCertificates()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  }
})
