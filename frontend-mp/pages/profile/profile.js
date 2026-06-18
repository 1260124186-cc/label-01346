/**
 * 个人中心页面
 * @description 展示用户个人信息和功能菜单，支持头像上传
 */
const app = getApp()
const { PROFILE_MENUS, getUserLevel } = require('../../utils/constants')
const { showToast, showModal, formatNumber, navigateTo } = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo: {
      avatarUrl: '',
      nickName: '环保达人',
      points: 0,
      level: 1,
      joinDate: ''
    },
    // 用户等级信息
    levelInfo: {
      level: 1,
      name: '环保新手',
      icon: '🌱',
      progress: 0
    },
    // 功能菜单（按分组拆分）
    learnMenus: PROFILE_MENUS.find(g => g.groupId === 'learn').items,
    recordMenus: PROFILE_MENUS.find(g => g.groupId === 'record').items,
    serviceMenus: PROFILE_MENUS.find(g => g.groupId === 'service').items,
    otherMenus: PROFILE_MENUS.find(g => g.groupId === 'other').items,
    noticeMenus: PROFILE_MENUS.find(g => g.groupId === 'notice') ? PROFILE_MENUS.find(g => g.groupId === 'notice').items : [],
    // 兼容旧的 menuList（测试用）
    menuList: PROFILE_MENUS,
    // 统计数据
    statistics: [
      { id: 'classify', label: '分类次数', value: 0 },
      { id: 'points', label: '累计积分', value: 0 },
      { id: 'days', label: '连续打卡', value: 0 }
    ],
    // 是否正在上传头像
    isUploading: false,
    // 签到状态
    isSignedToday: false,
    // 儿童模式
    childModeEnabled: false,
    // 组信息
    myGroups: [],
    currentGroup: null,
    // 权限
    hasReportPermission: false,
    // 成就勋章
    achievements: [],
    unlockedAchievementCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log('[Profile] 页面加载')
    this.initUserInfo()
    this.loadChildModeAndGroupData()
    this.loadAchievements()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('[Profile] 页面显示')
    this.refreshUserInfo()
    this.loadChildModeAndGroupData()
    this.loadAchievements()
  },

  /**
   * 加载儿童模式、组信息、权限
   */
  loadChildModeAndGroupData() {
    const childModeEnabled = app.isChildModeEnabled ? app.isChildModeEnabled() : false
    const myGroups = app.getMyGroups ? app.getMyGroups() : []
    const currentGroup = app.getCurrentGroup ? app.getCurrentGroup() : null
    const hasReportPermission = app.hasPermission ? app.hasPermission('report') : false

    const menuData = this.filterMenus(childModeEnabled)

    this.setData({
      childModeEnabled,
      myGroups: Array.isArray(myGroups) ? myGroups : [],
      currentGroup: currentGroup || null,
      hasReportPermission,
      ...menuData
    })
  },

  /**
   * 过滤菜单（儿童模式下简化）
   */
  filterMenus(childMode) {
    const baseMenus = {
      learnMenus: PROFILE_MENUS.find(g => g.groupId === 'learn').items,
      recordMenus: PROFILE_MENUS.find(g => g.groupId === 'record').items,
      serviceMenus: PROFILE_MENUS.find(g => g.groupId === 'service').items,
      otherMenus: PROFILE_MENUS.find(g => g.groupId === 'other').items,
      noticeMenus: PROFILE_MENUS.find(g => g.groupId === 'notice') ? PROFILE_MENUS.find(g => g.groupId === 'notice').items : []
    }

    if (!childMode) {
      return baseMenus
    }

    if (app.filterMenusForChild) {
      return app.filterMenusForChild(baseMenus)
    }

    const filteredLearn = baseMenus.learnMenus.filter(m => {
      const excludeIds = ['community', 'exchange', 'orders', 'recycle']
      return !excludeIds.includes(m.id)
    }).slice(0, 6)

    const filteredRecord = baseMenus.recordMenus.filter(m => {
      const excludeIds = ['orders', 'quizRecords']
      return !excludeIds.includes(m.id)
    })

    const filteredService = baseMenus.serviceMenus.filter(m => {
      const excludeIds = ['recycle', 'recycleOrders', 'address']
      return !excludeIds.includes(m.id)
    })

    return {
      learnMenus: filteredLearn,
      recordMenus: filteredRecord,
      serviceMenus: filteredService,
      otherMenus: baseMenus.otherMenus,
      noticeMenus: []
    }
  },

  /**
   * 加载成就勋章
   */
  loadAchievements() {
    let achievements = []
    if (app.getAchievements) {
      achievements = app.getAchievements()
    }
    const unlockedCount = achievements.filter(a => a.unlocked).length
    this.setData({
      achievements,
      unlockedAchievementCount: unlockedCount
    })
  },

  /**
   * 初始化用户信息
   */
  initUserInfo() {
    this.refreshUserInfo()
  },

  /**
   * 刷新用户信息
   */
  refreshUserInfo() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      const levelInfo = getUserLevel(userInfo.points || 0)
      const stats = app.getStatistics()

      const myGroups = app.getMyGroups ? app.getMyGroups() : []
      const currentGroup = app.getCurrentGroup ? app.getCurrentGroup() : null
      const hasReportPermission = app.hasPermission ? app.hasPermission('report') : false

      this.setData({
        userInfo: {
          ...userInfo,
          points: userInfo.points || 0
        },
        levelInfo: levelInfo,
        statistics: [
          { id: 'classify', label: '分类次数', value: stats.classifyCount },
          { id: 'points', label: '累计积分', value: stats.totalEarnedPoints },
          { id: 'days', label: '连续打卡', value: stats.continuousDays }
        ],
        isSignedToday: app.isTodaySignedIn(),
        myGroups: Array.isArray(myGroups) ? myGroups : [],
        currentGroup: currentGroup || null,
        hasReportPermission
      })

      console.log('[Profile] 用户信息已刷新', userInfo, stats)
    }
  },

  goToSignIn() {
    console.log('[Profile] 点击签到')
    navigateTo('/pages/signin/signin')
  },

  /**
   * 跳转到家庭组页面
   */
  goToFamilyGroup() {
    console.log('[Profile] 点击家庭组')
    navigateTo('/pages/family-group/family-group')
  },

  /**
   * 跳转到组排行榜
   */
  goToGroupLeaderboard() {
    console.log('[Profile] 点击组排行榜')
    navigateTo('/pages/group-leaderboard/group-leaderboard')
  },

  /**
   * 跳转到学习报告
   */
  goToLearningReport() {
    console.log('[Profile] 点击学习报告')
    navigateTo('/pages/learning-report/learning-report')
  },

  /**
   * 点击成就勋章
   */
  onAchievementTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Profile] 点击成就', item.name)
    navigateTo('/pages/achievement-detail/achievement-detail?id=' + item.id)
  },

  /**
   * 点击头像，选择本地图片上传
   */
  onAvatarTap() {
    console.log('[Profile] 点击头像')

    wx.showActionSheet({
      itemList: ['从相册选择', '拍照'],
      success: (res) => {
        const sourceType = res.tapIndex === 0 ? ['album'] : ['camera']
        this.chooseAvatar(sourceType)
      }
    })
  },

  /**
   * 选择头像图片
   * @param {Array} sourceType 图片来源
   */
  chooseAvatar(sourceType) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: sourceType,
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        console.log('[Profile] 选择图片成功', tempFilePath)

        this.uploadAvatar(tempFilePath)
      },
      fail: (err) => {
        if (err.errMsg.indexOf('cancel') === -1) {
          console.error('[Profile] 选择图片失败', err)
          showToast('选择图片失败')
        }
      }
    })
  },

  /**
   * 上传头像
   * @param {string} filePath 图片临时路径
   */
  uploadAvatar(filePath) {
    this.setData({ isUploading: true })

    // 模拟上传过程（实际项目中应上传到服务器）
    setTimeout(() => {
      // 更新用户头像
      const userInfo = {
        ...this.data.userInfo,
        avatarUrl: filePath
      }

      // 保存到全局和本地存储
      app.updateUserInfo({ avatarUrl: filePath })

      this.setData({
        userInfo: userInfo,
        isUploading: false
      })

      showToast('头像更新成功')
      console.log('[Profile] 头像上传成功')
    }, 1000)
  },

  /**
   * 点击昵称，修改昵称
   */
  onNickNameTap() {
    console.log('[Profile] 点击昵称')

    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入新昵称',
      success: (res) => {
        if (res.confirm && res.content) {
          const nickName = res.content.trim()
          if (nickName.length > 0 && nickName.length <= 12) {
            app.updateUserInfo({ nickName })
            this.refreshUserInfo()
            showToast('昵称修改成功')
          } else {
            showToast('昵称长度应为1-12个字符')
          }
        }
      }
    })
  },

  /**
   * 点击菜单项
   * @param {Object} e 事件对象
   */
  onMenuTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Profile] 点击菜单', item.title)

    // 如果有链接，直接跳转
    if (item.link) {
      navigateTo(item.link)
      return
    }

    // 没有链接的特殊处理
    switch (item.id) {
      case 'about':
        this.showAbout()
        break
      default:
        showToast('功能开发中')
        break
    }
  },

  /**
   * 关于我们
   */
  showAbout() {
    wx.showModal({
      title: '关于我们',
      content: '垃圾分类助手 v1.0.0\n\n致力于帮助用户更好地进行垃圾分类，保护我们共同的家园。\n\n垃圾分类，从我做起！',
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#5BBD72'
    })
  },

  /**
   * 点击统计项
   * @param {Object} e 事件对象
   */
  onStatTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Profile] 点击统计', item.label)
    showToast(`${item.label}：${item.value}`)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    console.log('[Profile] 用户分享')
    const shareInfo = app.generateShareInfo()

    const result = app.handleShareSuccess()
    if (result.success && result.points > 0) {
      showToast(`分享成功 +${result.points}积分`)
    } else if (result.reason === 'daily_limit') {
      showToast('今日分享积分已达上限')
    }

    this.refreshUserInfo()
    return shareInfo
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    console.log('[Profile] 分享到朋友圈')
    const { SHARE_CONFIG } = require('../../utils/constants')
    return {
      title: SHARE_CONFIG.shareTitle,
      query: `inviterId=${app.getUserId()}`,
      imageUrl: SHARE_CONFIG.shareImageUrl
    }
  }
})
