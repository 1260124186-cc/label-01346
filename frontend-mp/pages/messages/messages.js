const app = getApp()
const {
  MESSAGE_TYPES,
  MESSAGE_TYPE_CONFIG,
  messageManager
} = require('../../utils/message')
const { showToast, showSuccess, showModal, navigateTo } = require('../../utils/util')

Page({
  data: {
    currentTab: 'all',
    tabList: [
      { id: 'all', name: '全部' },
      { id: MESSAGE_TYPES.SYSTEM, name: '系统通知' },
      { id: MESSAGE_TYPES.ACTIVITY, name: '活动提醒' },
      { id: MESSAGE_TYPES.ORDER, name: '订单物流' },
      { id: MESSAGE_TYPES.TICKET, name: '工单通知' },
      { id: MESSAGE_TYPES.SIGNIN, name: '签到提醒' },
      { id: MESSAGE_TYPES.QUIZ, name: '问答新题' },
      { id: MESSAGE_TYPES.ACHIEVEMENT, name: '成就勋章' }
    ],
    messageList: [],
    unreadCount: {},
    hasReadMessages: false,
    emptyTip: '暂无消息，保持关注哦~',
    subSettings: {
      signinReminder: true,
      shipmentNotice: true,
      activityStart: true
    }
  },

  onLoad() {
    console.log('[Messages] 页面加载')
    this.refreshData()
  },

  onShow() {
    console.log('[Messages] 页面显示')
    this.refreshData()
  },

  onPullDownRefresh() {
    console.log('[Messages] 下拉刷新')
    this.refreshData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  refreshData() {
    const { currentTab } = this.data
    const messages = messageManager.getMessagesByType(currentTab)
    const unreadCount = messageManager.getUnreadCountByType()
    const hasReadMessages = messages.some(m => m.isRead)
    const subSettings = messageManager.getAllSubscriptionSettings()

    const messageList = messages.map(msg => ({
      ...msg,
      typeConfig: MESSAGE_TYPE_CONFIG[msg.type] || MESSAGE_TYPE_CONFIG[MESSAGE_TYPES.SYSTEM]
    }))

    let emptyTip = '暂无消息，保持关注哦~'
    if (currentTab === MESSAGE_TYPES.SYSTEM) emptyTip = '暂无系统通知'
    else if (currentTab === MESSAGE_TYPES.ACTIVITY) emptyTip = '暂无活动提醒'
    else if (currentTab === MESSAGE_TYPES.ORDER) emptyTip = '暂无订单物流消息'
    else if (currentTab === MESSAGE_TYPES.TICKET) emptyTip = '暂无工单通知'
    else if (currentTab === MESSAGE_TYPES.SIGNIN) emptyTip = '暂无签到提醒'
    else if (currentTab === MESSAGE_TYPES.QUIZ) emptyTip = '暂无新题上线通知'

    this.setData({
      messageList,
      unreadCount,
      hasReadMessages,
      emptyTip,
      subSettings
    })
  },

  onTabTap(e) {
    const { id } = e.currentTarget.dataset
    if (id === this.data.currentTab) return
    console.log('[Messages] 切换Tab:', id)
    this.setData({ currentTab: id }, () => {
      this.refreshData()
    })
  },

  onMessageTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Messages] 点击消息:', item.id, item.title)

    if (!item.isRead) {
      messageManager.markAsRead(item.id)
    }

    const data = item.data || {}
    if (data.link) {
      navigateTo(data.link)
      setTimeout(() => this.refreshData(), 100)
      return
    }

    this.showMessageDetail(item)
  },

  onMessageLongPress(e) {
    const { id } = e.currentTarget.dataset
    console.log('[Messages] 长按消息:', id)

    wx.showActionSheet({
      itemList: ['标记为已读', '删除此消息'],
      itemColor: '#1D1D1F',
      success: (res) => {
        if (res.tapIndex === 0) {
          messageManager.markAsRead(id)
          showSuccess('已标记为已读')
        } else if (res.tapIndex === 1) {
          messageManager.deleteMessage(id)
          showSuccess('消息已删除')
        }
        this.refreshData()
      }
    })
  },

  showMessageDetail(item) {
    const config = item.typeConfig || MESSAGE_TYPE_CONFIG[item.type]
    wx.showModal({
      title: config.emoji + ' ' + item.title,
      content: item.content + '\n\n发送时间：' + item.time,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#5BBD72',
      success: () => {
        this.refreshData()
      }
    })
  },

  onMarkAllRead() {
    const { currentTab } = this.data
    showModal({
      title: '全部已读',
      content: currentTab === 'all'
        ? '确定要将全部消息标记为已读吗？'
        : `确定要将「${(MESSAGE_TYPE_CONFIG[currentTab] && MESSAGE_TYPE_CONFIG[currentTab].name) || ''}」类消息全部标记为已读吗？`,
      confirmText: '全部已读',
      confirmColor: '#5BBD72'
    }).then(confirmed => {
      if (confirmed) {
        const count = messageManager.markAllAsRead(currentTab)
        if (count > 0) {
          showSuccess(`已标记 ${count} 条已读`)
        }
        this.refreshData()
      }
    })
  },

  onClearRead() {
    showModal({
      title: '清除已读消息',
      content: '确定要清除所有已读消息吗？此操作不可恢复。',
      confirmText: '清除',
      confirmColor: '#E74C3C'
    }).then(confirmed => {
      if (confirmed) {
        const count = messageManager.deleteReadMessages()
        if (count > 0) {
          showSuccess(`已清除 ${count} 条消息`)
        }
        this.refreshData()
      }
    })
  },

  onSubSettingChange(e) {
    const { key } = e.currentTarget.dataset
    const enabled = e.detail.value
    console.log('[Messages] 订阅设置变化:', key, enabled)
    messageManager.setSubscriptionSetting(key, enabled)
    this.setData({
      [`subSettings.${key}`]: enabled
    })
    showToast(enabled ? '已开启' : '已关闭', 'none')
  },

  onRequestSubscribe() {
    console.log('[Messages] 请求微信订阅消息授权')

    const tmplIds = []

    if (tmplIds.length === 0) {
      showModal({
        title: '订阅消息说明',
        content: '订阅消息功能需要在微信公众平台配置模板ID后使用。\n\n当前已开启本地消息提醒，将在您打开小程序时提醒您签到、查看活动等。',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#5BBD72'
      })
      return
    }

    if (typeof wx.requestSubscribeMessage === 'function') {
      wx.requestSubscribeMessage({
        tmplIds: tmplIds,
        success: (res) => {
          console.log('[Messages] 订阅消息授权成功:', res)
          showSuccess('订阅成功')
        },
        fail: (err) => {
          console.error('[Messages] 订阅消息授权失败:', err)
          if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
            showToast('订阅失败，请在设置中开启')
          }
        }
      })
    } else {
      showToast('当前微信版本不支持订阅消息')
    }
  },

  onShareAppMessage() {
    const shareInfo = app.generateShareInfo()
    return shareInfo
  }
})
