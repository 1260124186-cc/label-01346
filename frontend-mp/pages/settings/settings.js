/**
 * 设置页面
 * @description 消息通知开关、清除缓存、隐私政策、用户协议、意见反馈
 */
const app = getApp()
const { showToast, showSuccess, showModal, showLoading, hideLoading, navigateTo } = require('../../utils/util')
const { CITY_STANDARDS, getCityInfo, hasUpcomingStandard,
  CHILD_TIME_LIMIT_OPTIONS, CHILD_AGE_GROUPS } = require('../../utils/constants')
const voice = require('../../utils/voice')

Page({
  data: {
    notifyEnabled: true,
    cacheSize: '0 MB',
    version: '1.0.0',
    childModeEnabled: false,
    userRole: 'member',
    currentCity: 'shanghai',
    currentCityInfo: null,
    hasUpcomingStandard: false,
    cityOptions: CITY_STANDARDS,
    roleOptions: [
      { id: 'owner', name: '创建者' },
      { id: 'parent', name: '家长' },
      { id: 'teacher', name: '老师' },
      { id: 'member', name: '成员' },
      { id: 'child', name: '儿童' },
      { id: 'student', name: '学生' }
    ],
    roleEmojiMap: {
      owner: '👑',
      parent: '👨‍👩‍👧',
      teacher: '👨‍🏫',
      member: '👤',
      child: '🧒',
      student: '🎒'
    },
    currentRoleDisplay: '👤 成员',

    hasChildPIN: false,
    childTimeLimit: 60,
    childTimeLimitOptions: CHILD_TIME_LIMIT_OPTIONS,
    childAgeGroup: '6to8',
    childAgeGroups: CHILD_AGE_GROUPS,
    childAgeGroupText: '6-8岁',
    usageTimeText: '0分钟',
    usageRemainingText: '60分钟',
    usagePercent: 0,
    isChildLocked: false,
    showTimePicker: false,
    showAgePicker: false,
    darkMode: false,
    darkModeSource: 'system',
    largeFont: false,
    experienceClasses: '',
    voiceModeEnabled: false,
    currentDialect: 'zh-CN',
    dialectOptions: [],
    currentDialectName: '普通话',
    showDialectPicker: false
  },

  onLoad() {
    console.log('[Settings] 页面加载')
    this.loadSettings()
    this.calculateCacheSize()
    this.loadChildModeState()
    this.loadExperienceState()
    this.loadVoiceSettings()

    const userRole = wx.getStorageSync('userRole') || 'member'
    const currentCity = app.getCurrentCity()
    const currentCityInfo = app.getCurrentCityInfo()
    const hasUpcoming = app.hasCityUpcomingStandard()
    this.setData({ userRole, currentCity, currentCityInfo, hasUpcomingStandard: hasUpcoming })
    this.updateRoleDisplay(userRole)
  },

  onShow() {
    console.log('[Settings] 页面显示')
    const currentCity = app.getCurrentCity()
    const currentCityInfo = app.getCurrentCityInfo()
    const hasUpcoming = app.hasCityUpcomingStandard()
    this.setData({ currentCity, currentCityInfo, hasUpcomingStandard: hasUpcoming })
    this.loadChildModeState()
    this.loadExperienceState()
    this.loadVoiceSettings()
  },

  loadExperienceState() {
    const darkMode = app.isDarkMode()
    const darkModeSource = app.getThemeSetting()
    const largeFont = app.isLargeFont()
    const experienceClasses = app.getExperienceClasses()
    this.setData({ darkMode, darkModeSource, largeFont, experienceClasses })
  },

  onThemeChange(isDark) {
    this.setData({
      darkMode: isDark,
      experienceClasses: app.getExperienceClasses()
    })
  },

  onFontChange(isLarge) {
    this.setData({
      largeFont: isLarge,
      experienceClasses: app.getExperienceClasses()
    })
  },

  loadChildModeState() {
    const childModeEnabled = app.isChildModeEnabled()
    const hasChildPIN = app.hasChildModePIN()
    const childTimeLimit = app.getChildTimeLimit()
    const ageGroupId = app.getChildAgeGroup()
    const ageGroupInfo = app.getChildAgeGroupInfo()
    const usedSec = app.getChildUsageTime()
    const remainingSec = app.getChildRemainingTime()
    const usagePercent = app.getChildUsagePercent()
    const isLocked = app.isChildModeLocked()

    this.setData({
      childModeEnabled,
      hasChildPIN,
      childTimeLimit,
      childAgeGroup: ageGroupId,
      childAgeGroupText: ageGroupInfo ? ageGroupInfo.name : '6-8岁',
      usageTimeText: app.formatUsageTime(usedSec),
      usageRemainingText: app.formatUsageTime(remainingSec),
      usagePercent,
      isChildLocked: isLocked
    })
  },

  updateRoleDisplay(roleId) {
    const roleOptions = this.data.roleOptions
    const roleEmojiMap = this.data.roleEmojiMap
    const role = roleOptions.find(r => r.id === roleId)
    const emoji = roleEmojiMap[roleId] || '👤'
    const name = role ? role.name : '成员'
    this.setData({ currentRoleDisplay: `${emoji} ${name}` })
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
  },

  onChildModeChange(e) {
    const enabled = e.detail.value
    console.log('[Settings] 儿童模式开关:', enabled)

    if (enabled) {
      navigateTo('/pages/child-pin-verify/child-pin-verify?mode=verify&enabled=true')
    } else {
      navigateTo('/pages/child-pin-verify/child-pin-verify?mode=verify&enabled=false')
    }

    setTimeout(() => {
      const actual = app.isChildModeEnabled()
      this.setData({ childModeEnabled: actual })
    }, 50)
  },

  onChangePIN() {
    if (!app.hasChildModePIN()) {
      navigateTo('/pages/child-pin-verify/child-pin-verify?mode=set')
      return
    }
    navigateTo('/pages/child-pin-verify/child-pin-verify?mode=change')
  },

  onGoDashboard() {
    const canAccess = app.hasChildModePIN() || app.isChildModeEnabled()
    if (!canAccess) {
      showToast('请先开启儿童模式')
      return
    }
    navigateTo('/pages/parent-dashboard/parent-dashboard')
  },

  onSelectTimeLimit() {
    this.setData({ showTimePicker: true })
  },

  onConfirmTimeLimit(e) {
    const minutes = parseInt(e.currentTarget.dataset.minutes)
    app.setChildTimeLimit(minutes)
    showSuccess(`已设置${minutes}分钟`)
    this.setData({ showTimePicker: false })
    this.loadChildModeState()
  },

  onSelectAgeGroup() {
    this.setData({ showAgePicker: true })
  },

  onConfirmAgeGroup(e) {
    const ageId = e.currentTarget.dataset.ageId
    app.setChildAgeGroup(ageId)
    const info = app.getChildAgeGroupInfo()
    showSuccess(`已设置为${info.name}`)
    this.setData({ showAgePicker: false })
    this.loadChildModeState()
  },

  onCloseTimePicker() {
    this.setData({ showTimePicker: false })
  },

  onCloseAgePicker() {
    this.setData({ showAgePicker: false })
  },

  preventMaskClose() {},

  onRoleSelect() {
    console.log('[Settings] 点击选择角色')
    const roleOptions = this.data.roleOptions
    const roleEmojiMap = this.data.roleEmojiMap
    const itemList = roleOptions.map(role => `${roleEmojiMap[role.id]} ${role.name}`)

    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        const selectedRole = roleOptions[res.tapIndex]
        const roleId = selectedRole.id
        const roleName = selectedRole.name
        this.setData({ userRole: roleId })
        this.updateRoleDisplay(roleId)
        wx.setStorageSync('userRole', roleId)
        app.setUserRole(roleId)
        showSuccess(`已切换为「${roleName}」`)
      },
      fail: () => {
        console.log('[Settings] 取消选择角色')
      }
    })
  },

  onCitySelect() {
    console.log('[Settings] 点击选择城市')
    const cityOptions = this.data.cityOptions
    const itemList = cityOptions.map(city => `${city.emoji} ${city.name}`)

    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        const selectedCity = cityOptions[res.tapIndex]
        const cityId = selectedCity.id
        const cityName = selectedCity.name
        const oldCityId = this.data.currentCity
        if (cityId === oldCityId) {
          showToast('当前已是该城市标准')
          return
        }
        this.showCityChangeConfirm(cityId, cityName, oldCityId)
      },
      fail: () => {
        console.log('[Settings] 取消选择城市')
      }
    })
  },

  showCityChangeConfirm(newCityId, newCityName, oldCityId) {
    const oldCityInfo = getCityInfo(oldCityId)
    showModal({
      title: '切换城市标准',
      content: `确定要从「${oldCityInfo.name}」切换到「${newCityName}」吗？\n\n切换后，搜索百科、分类练习、问答解析等将按照「${newCityName}」的本地分类标准显示。\n\n⚠️ 提示：部分历史记录中的分类标签将按照新城市标准重新展示，可能与之前显示不一致。`,
      confirmText: '确认切换',
      cancelText: '再想想',
      confirmColor: '#5BBD72'
    }).then(confirmed => {
      if (confirmed) {
        this.changeCity(newCityId, newCityName)
      }
    })
  },

  changeCity(cityId, cityName) {
    showLoading('切换中...')
    const success = app.setCurrentCity(cityId)
    if (success) {
      const cityInfo = getCityInfo(cityId)
      const hasUpcoming = hasUpcomingStandard(cityId)
      this.setData({
        currentCity: cityId,
        currentCityInfo: cityInfo,
        hasUpcomingStandard: hasUpcoming
      })
      setTimeout(() => {
        hideLoading()
        showSuccess(`已切换为「${cityName}」标准`)
        this.showCityChangedTips(cityName)
      }, 500)
    } else {
      hideLoading()
      showToast('切换失败，请重试')
    }
  },

  showCityChangedTips(cityName) {
    const tips = [
      '✅ 搜索百科已更新为当地标准',
      '✅ 分类练习已更新为当地标准',
      '✅ 问答解析已更新为当地标准',
      'ℹ️ 历史记录标签将按新标准展示'
    ]
    const content = tips.join('\n')
    setTimeout(() => {
      showModal({
        title: `已切换到${cityName}标准`,
        content: content,
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#5BBD72'
      })
    }, 300)
  },

  onUpcomingStandard() {
    console.log('[Settings] 点击查看新标准预告')
    navigateTo('/pages/region-notice/region-notice')
  },

  onDarkModeChange(e) {
    const enabled = e.detail.value
    console.log('[Settings] 深色模式开关:', enabled)
    app.setThemeSetting(enabled ? 'dark' : 'light')
    this.setData({
      darkMode: enabled,
      darkModeSource: enabled ? 'dark' : 'light',
      experienceClasses: app.getExperienceClasses()
    })
    showSuccess(enabled ? '已开启深色模式' : '已关闭深色模式')
  },

  onDarkModeSourceSelect() {
    console.log('[Settings] 点击选择深色模式来源')
    const options = [
      { id: 'system', name: '跟随系统' },
      { id: 'dark', name: '始终深色' },
      { id: 'light', name: '始终浅色' }
    ]
    const itemList = options.map(o => {
      const mark = o.id === this.data.darkModeSource ? ' ✓' : ''
      return o.name + mark
    })

    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        const selected = options[res.tapIndex]
        if (selected.id === this.data.darkModeSource) return
        app.setThemeSetting(selected.id)
        this.setData({
          darkMode: app.isDarkMode(),
          darkModeSource: selected.id,
          experienceClasses: app.getExperienceClasses()
        })
        const nameMap = { system: '跟随系统', dark: '始终深色', light: '始终浅色' }
        showSuccess(`已切换为「${nameMap[selected.id]}」`)
      }
    })
  },

  onLargeFontChange(e) {
    const enabled = e.detail.value
    console.log('[Settings] 大字号模式开关:', enabled)
    app.setLargeFont(enabled)
    this.setData({
      largeFont: enabled,
      experienceClasses: app.getExperienceClasses()
    })
    showSuccess(enabled ? '已开启大字号模式' : '已关闭大字号模式')
  },

  loadVoiceSettings() {
    const voiceEnabled = voice.isVoiceEnabled()
    const dialect = voice.getCurrentDialect()
    const dialectOptions = voice.getDialectOptions()
    const dialectInfo = dialectOptions.find(d => d.id === dialect)
    
    this.setData({
      voiceModeEnabled: voiceEnabled,
      currentDialect: dialect,
      dialectOptions,
      currentDialectName: dialectInfo ? dialectInfo.name : '普通话'
    })
  },

  onVoiceModeChange(e) {
    const enabled = e.detail.value
    console.log('[Settings] 语音模式开关:', enabled)
    
    if (enabled) {
      wx.authorize({
        scope: 'scope.record',
        success: () => {
          voice.setVoiceEnabled(true)
          this.setData({ voiceModeEnabled: true })
          showSuccess('已开启语音模式')
          this.playVoiceDemo()
        },
        fail: () => {
          this.setData({ voiceModeEnabled: false })
          showModal({
            title: '需要麦克风权限',
            content: '语音模式需要使用麦克风进行语音识别，请在设置中开启麦克风权限。',
            confirmText: '去设置',
            confirmColor: '#5BBD72'
          }).then(confirmed => {
            if (confirmed) {
              wx.openSetting()
            }
          })
        }
      })
    } else {
      voice.setVoiceEnabled(false)
      this.setData({ voiceModeEnabled: false })
      showToast('已关闭语音模式')
    }
  },

  playVoiceDemo() {
    voice.speak('语音模式已开启，您可以使用语音搜索和语音答题功能。', {
      useTTS: false,
      onEnd: () => {
        console.log('[Settings] 语音演示播放完成')
      }
    })
  },

  onDialectSelect() {
    if (!this.data.voiceModeEnabled) {
      showToast('请先开启语音模式')
      return
    }
    this.setData({ showDialectPicker: true })
  },

  onConfirmDialect(e) {
    const dialectId = e.currentTarget.dataset.dialectId
    const dialectOptions = this.data.dialectOptions
    const dialectInfo = dialectOptions.find(d => d.id === dialectId)
    
    if (dialectInfo) {
      voice.setDialect(dialectId)
      this.setData({
        currentDialect: dialectId,
        currentDialectName: dialectInfo.name,
        showDialectPicker: false
      })
      showSuccess(`已切换为${dialectInfo.name}识别`)
      
      voice.speak(`已切换为${dialectInfo.name}识别模式`, { useTTS: false })
    }
  },

  onCloseDialectPicker() {
    this.setData({ showDialectPicker: false })
  }
})
