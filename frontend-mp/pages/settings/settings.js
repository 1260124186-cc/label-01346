/**
 * 设置页面
 * @description 消息通知开关、清除缓存、隐私政策、用户协议、意见反馈
 */
const app = getApp()
const { showToast, showSuccess, showModal, showLoading, hideLoading } = require('../../utils/util')

Page({
  data: {
    notifyEnabled: true,
    cacheSize: '0 MB',
    version: '1.0.0'
  },

  onLoad() {
    console.log('[Settings] 页面加载')
    this.loadSettings()
    this.calculateCacheSize()
  },

  onShow() {
    console.log('[Settings] 页面显示')
  },

  loadSettings() {
    const settings = wx.getStorageSync('appSettings')
    if (settings) {
      this.setData({
        notifyEnabled: settings.notifyEnabled !== false
      })
    }
  },

  saveSettings() {
    wx.setStorageSync('appSettings', {
      notifyEnabled: this.data.notifyEnabled
    })
  },

  onNotifyChange(e) {
    const enabled = e.detail.value
    console.log('[Settings] 消息通知开关:', enabled)
    this.setData({ notifyEnabled: enabled })
    this.saveSettings()

    if (enabled) {
      showSuccess('已开启消息通知')
    } else {
      showToast('已关闭消息通知')
    }
  },

  calculateCacheSize() {
    try {
      const res = wx.getStorageInfoSync()
      const sizeKB = res.currentSize || 0
      const sizeMB = (sizeKB / 1024).toFixed(2)
      this.setData({ cacheSize: sizeMB + ' MB' })
    } catch (e) {
      console.error('[Settings] 获取缓存大小失败', e)
      this.setData({ cacheSize: '0 MB' })
    }
  },

  onClearCache() {
    console.log('[Settings] 点击清除缓存')
    showModal({
      title: '清除缓存',
      content: `确定要清除本地缓存数据吗？\n当前缓存大小：${this.data.cacheSize}`,
      confirmText: '清除',
      confirmColor: '#E74C3C'
    }).then(confirmed => {
      if (confirmed) {
        this.clearCache()
      }
    })
  },

  clearCache() {
    showLoading('清除中...')
    try {
      wx.clearStorageSync()

      const userInfo = app.globalData.userInfo
      if (userInfo) {
        wx.setStorageSync('userInfo', userInfo)
      }

      setTimeout(() => {
        hideLoading()
        this.calculateCacheSize()
        showSuccess('缓存已清除')
      }, 800)
    } catch (e) {
      hideLoading()
      console.error('[Settings] 清除缓存失败', e)
      showToast('清除缓存失败')
    }
  },

  onPrivacyPolicy() {
    console.log('[Settings] 点击隐私政策')
    wx.showModal({
      title: '隐私政策',
      content: '垃圾分类助手隐私政策\n\n我们非常重视您的个人信息和隐私保护。我们将按照法律法规要求，采取相应安全保护措施，尽力保护您的个人信息安全可控。\n\n1. 我们会收集的信息：昵称、头像、设备ID（用于防刷）\n2. 我们如何使用信息：用于提供垃圾分类服务、积分奖励记录\n3. 信息安全：我们使用本地存储，您的数据仅保存在您的设备上\n4. 您的权利：您可以随时修改或删除您的个人信息\n\n如有疑问，请通过意见反馈联系我们。',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#5BBD72'
    })
  },

  onUserAgreement() {
    console.log('[Settings] 点击用户协议')
    wx.showModal({
      title: '用户协议',
      content: '垃圾分类助手用户服务协议\n\n欢迎使用垃圾分类助手！在使用本应用前，请您仔细阅读以下协议：\n\n一、服务内容\n本应用提供垃圾分类知识学习、积分奖励、商品兑换等服务。\n\n二、用户规范\n1. 请合法合规使用本应用\n2. 不得利用本应用进行任何违法违规活动\n3. 不得恶意刷分、作弊等行为\n\n三、积分规则\n1. 积分可通过签到、答题、分类等方式获得\n2. 积分有效期为自获取之日起1年\n3. 积分可用于兑换商品\n\n四、免责声明\n本应用仅供学习参考，实际分类请以当地规定为准。\n\n感谢您的使用！',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#5BBD72'
    })
  },

  onFeedback() {
    console.log('[Settings] 点击意见反馈')
    wx.showModal({
      title: '意见反馈',
      editable: true,
      placeholderText: '请输入您的意见或建议，帮助我们做得更好...',
      confirmText: '提交',
      confirmColor: '#5BBD72',
      success: (res) => {
        if (res.confirm) {
          const content = (res.content || '').trim()
          if (content.length > 0) {
            this.submitFeedback(content)
          } else {
            showToast('请输入反馈内容')
          }
        }
      }
    })
  },

  submitFeedback(content) {
    showLoading('提交中...')

    const feedbackList = wx.getStorageSync('feedbackList') || []
    feedbackList.unshift({
      id: 'fb_' + Date.now(),
      content: content,
      time: new Date().toLocaleString(),
      status: 'pending'
    })
    wx.setStorageSync('feedbackList', feedbackList)

    setTimeout(() => {
      hideLoading()
      showSuccess('反馈已提交，感谢您的建议！')
    }, 800)
  }
})
