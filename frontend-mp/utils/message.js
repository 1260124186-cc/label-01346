const { generateId, formatDate, getStorage, setStorage } = require('./util')

const MESSAGE_STORAGE_KEY = 'messages'
const SUBSCRIPTION_KEY = 'subscriptionSettings'

const MESSAGE_TYPES = {
  SYSTEM: 'system',
  ACTIVITY: 'activity',
  ACTIVITY_REPORT: 'activity_report',
  FLASH_SALE_REMINDER: 'flash_sale_reminder',
  ORDER: 'order',
  SIGNIN: 'signin',
  QUIZ: 'quiz',
  ACHIEVEMENT: 'achievement',
  TICKET: 'ticket',
  POINTS_EXPIRE: 'points_expire',
  HOMEWORK: 'homework',
  HOMEWORK_REMINDER: 'homework_reminder',
  HOMEWORK_COMPLETED: 'homework_completed',
  DROP_POINT: 'drop_point'
}

const MESSAGE_TYPE_CONFIG = {
  [MESSAGE_TYPES.SYSTEM]: {
    id: MESSAGE_TYPES.SYSTEM,
    name: '系统通知',
    emoji: '🔔',
    color: '#5BBD72',
    bgColor: 'rgba(91, 189, 114, 0.1)'
  },
  [MESSAGE_TYPES.ACTIVITY]: {
    id: MESSAGE_TYPES.ACTIVITY,
    name: '活动提醒',
    emoji: '🎉',
    color: '#F39C12',
    bgColor: 'rgba(243, 156, 18, 0.1)'
  },
  [MESSAGE_TYPES.ORDER]: {
    id: MESSAGE_TYPES.ORDER,
    name: '订单物流',
    emoji: '📦',
    color: '#4A90D9',
    bgColor: 'rgba(74, 144, 217, 0.1)'
  },
  [MESSAGE_TYPES.SIGNIN]: {
    id: MESSAGE_TYPES.SIGNIN,
    name: '签到提醒',
    emoji: '📅',
    color: '#9B59B6',
    bgColor: 'rgba(155, 89, 182, 0.1)'
  },
  [MESSAGE_TYPES.QUIZ]: {
    id: MESSAGE_TYPES.QUIZ,
    name: '问答新题',
    emoji: '❓',
    color: '#E85D5D',
    bgColor: 'rgba(232, 93, 93, 0.1)'
  },
  [MESSAGE_TYPES.ACHIEVEMENT]: {
    id: MESSAGE_TYPES.ACHIEVEMENT,
    name: '成就勋章',
    emoji: '🏆',
    color: '#9B59B6',
    bgColor: 'rgba(155, 89, 182, 0.1)'
  },
  [MESSAGE_TYPES.TICKET]: {
    id: MESSAGE_TYPES.TICKET,
    name: '工单通知',
    emoji: '📝',
    color: '#E67E22',
    bgColor: 'rgba(230, 126, 34, 0.1)'
  },
  [MESSAGE_TYPES.POINTS_EXPIRE]: {
    id: MESSAGE_TYPES.POINTS_EXPIRE,
    name: '积分过期',
    emoji: '⏰',
    color: '#E85D5D',
    bgColor: 'rgba(232, 93, 93, 0.1)'
  },
  [MESSAGE_TYPES.HOMEWORK]: {
    id: MESSAGE_TYPES.HOMEWORK,
    name: '组作业通知',
    emoji: '📋',
    color: '#9B59B6',
    bgColor: 'rgba(155, 89, 182, 0.1)'
  },
  [MESSAGE_TYPES.HOMEWORK_REMINDER]: {
    id: MESSAGE_TYPES.HOMEWORK_REMINDER,
    name: '作业提醒',
    emoji: '🔔',
    color: '#F39C12',
    bgColor: 'rgba(243, 156, 18, 0.1)'
  },
  [MESSAGE_TYPES.HOMEWORK_COMPLETED]: {
    id: MESSAGE_TYPES.HOMEWORK_COMPLETED,
    name: '作业完成',
    emoji: '🎉',
    color: '#5BBD72',
    bgColor: 'rgba(91, 189, 114, 0.1)'
  },
  [MESSAGE_TYPES.ACTIVITY_REPORT]: {
    id: MESSAGE_TYPES.ACTIVITY_REPORT,
    name: '活动报告',
    emoji: '📊',
    color: '#3498DB',
    bgColor: 'rgba(52, 152, 219, 0.1)'
  },
  [MESSAGE_TYPES.FLASH_SALE_REMINDER]: {
    id: MESSAGE_TYPES.FLASH_SALE_REMINDER,
    name: '秒杀提醒',
    emoji: '⚡',
    color: '#E85D5D',
    bgColor: 'rgba(232, 93, 93, 0.1)'
  },
  [MESSAGE_TYPES.DROP_POINT]: {
    id: MESSAGE_TYPES.DROP_POINT,
    name: '投放点通知',
    emoji: '🗑️',
    color: '#5BBD72',
    bgColor: 'rgba(91, 189, 114, 0.1)'
  }
}

const SUBSCRIPTION_TEMPLATES = {
  SIGNIN_REMINDER: {
    name: '签到提醒',
    tmplIds: [],
    description: '提醒每日签到获取积分奖励'
  },
  SHIPMENT_NOTICE: {
    name: '兑换发货通知',
    tmplIds: [],
    description: '兑换商品发货时通知物流信息'
  },
  ACTIVITY_START: {
    name: '活动开始提醒',
    tmplIds: [],
    description: '关注的活动开始前提醒您参与'
  },
  HOMEWORK_ASSIGNED: {
    name: '组作业通知',
    tmplIds: [],
    description: '老师/家长发布新组作业时通知'
  },
  HOMEWORK_DUE: {
    name: '作业截止提醒',
    tmplIds: [],
    description: '组作业截止前提醒未完成成员'
  },
  HOMEWORK_COMPLETE: {
    name: '作业完成通知',
    tmplIds: [],
    description: '组作业全部完成时通知发布者'
  },
  FLASH_SALE_RESERVE: {
    name: '秒杀预约提醒',
    tmplIds: [],
    description: '开抢前提醒已预约的用户'
  },
  ACTIVITY_REPORT_NOTICE: {
    name: '活动报告通知',
    tmplIds: [],
    description: '活动结束后生成参与报告时通知'
  }
}

const getDefaultMessages = () => {
  const now = new Date()
  const today = formatDate(now, 'YYYY-MM-DD')
  const yesterday = formatDate(new Date(now.getTime() - 86400000), 'YYYY-MM-DD')
  const twoDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 2), 'YYYY-MM-DD')
  const threeDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 3), 'YYYY-MM-DD')

  return [
    {
      id: generateId(),
      type: MESSAGE_TYPES.SYSTEM,
      title: '欢迎使用垃圾分类助手',
      content: '欢迎使用垃圾分类助手！通过学习垃圾分类知识、参与答题、每日签到等方式获取积分，积分可以兑换环保好物哦~',
      emoji: '🌟',
      isRead: true,
      time: threeDaysAgo + ' 09:00',
      data: {}
    },
    {
      id: generateId(),
      type: MESSAGE_TYPES.ACTIVITY,
      title: '世界环境日活动即将开始',
      content: '6月5日世界环境日特别活动：当日答题积分翻倍，邀请好友额外获得100积分奖励！快来参与吧~',
      emoji: '🌍',
      isRead: false,
      time: twoDaysAgo + ' 10:30',
      data: {
        activityId: 'env_day_2024',
        link: '/pages/activity/activity'
      }
    },
    {
      id: generateId(),
      type: MESSAGE_TYPES.SIGNIN,
      title: '今日签到提醒',
      content: '今天还没有签到哦！签到可获得5积分奖励，连续签到7天额外获得50积分奖励~',
      emoji: '📅',
      isRead: false,
      time: yesterday + ' 20:00',
      data: {
        link: '/pages/signin/signin'
      }
    },
    {
      id: generateId(),
      type: MESSAGE_TYPES.ORDER,
      title: '订单已发货',
      content: '您兑换的「环保购物袋」已通过顺丰速运发货，物流单号：SF2024060512345678，预计3天内送达。',
      emoji: '🚚',
      isRead: false,
      time: yesterday + ' 14:20',
      data: {
        orderId: 'order_demo_001',
        goodsName: '环保购物袋',
        logisticsCompany: '顺丰速运',
        logisticsNo: 'SF2024060512345678',
        link: '/pages/orders/orders'
      }
    },
    {
      id: generateId(),
      type: MESSAGE_TYPES.QUIZ,
      title: '新题目上线通知',
      content: '垃圾分类知识问答新增50道全新题目！涵盖办公场景、校园场景，快来挑战看看吧~',
      emoji: '📚',
      isRead: true,
      time: threeDaysAgo + ' 15:45',
      data: {
        chapterId: 5,
        link: '/pages/quiz/quiz'
      }
    },
    {
      id: generateId(),
      type: MESSAGE_TYPES.SYSTEM,
      title: '积分规则更新通知',
      content: '积分有效期调整为自获取之日起1年有效，请及时使用积分兑换心仪的商品。点击查看详情了解更多。',
      emoji: '💰',
      isRead: true,
      time: threeDaysAgo + ' 11:00',
      data: {
        link: '/pages/points/points'
      }
    },
    {
      id: generateId(),
      type: MESSAGE_TYPES.ORDER,
      title: '订单已完成',
      content: '您兑换的「便携餐具套装」已确认收货，感谢您对环保事业的支持！如有任何问题请联系客服。',
      emoji: '✅',
      isRead: true,
      time: threeDaysAgo + ' 16:30',
      data: {
        orderId: 'order_demo_002',
        goodsName: '便携餐具套装',
        link: '/pages/orders/orders'
      }
    }
  ]
}

class MessageManager {
  constructor() {
    this.messages = []
    this.subscriptionSettings = {}
    this.init()
  }

  init() {
    const storedMessages = getStorage(MESSAGE_STORAGE_KEY)
    if (storedMessages && Array.isArray(storedMessages) && storedMessages.length > 0) {
      this.messages = storedMessages
    } else {
      this.messages = getDefaultMessages()
      this.save()
    }

    const storedSettings = getStorage(SUBSCRIPTION_KEY)
    if (storedSettings) {
      this.subscriptionSettings = storedSettings
    } else {
      this.subscriptionSettings = {
        signinReminder: true,
        shipmentNotice: true,
        activityStart: true,
        flashSaleReserve: true,
        activityReportNotice: true,
        homeworkAssigned: true,
        homeworkDue: true,
        homeworkComplete: true,
        lastSigninReminderTime: 0,
        lastPointsExpireReminderTime: 0,
        lastHomeworkReminderTime: 0
      }
      this.saveSubscriptionSettings()
    }
    console.log('[MessageManager] 初始化完成，消息数量:', this.messages.length)
  }

  save() {
    setStorage(MESSAGE_STORAGE_KEY, this.messages)
  }

  saveSubscriptionSettings() {
    setStorage(SUBSCRIPTION_KEY, this.subscriptionSettings)
  }

  getAllMessages() {
    return [...this.messages].sort((a, b) => new Date(b.time) - new Date(a.time))
  }

  getMessagesByType(type) {
    if (!type || type === 'all') {
      return this.getAllMessages()
    }
    return this.messages
      .filter(m => m.type === type)
      .sort((a, b) => new Date(b.time) - new Date(a.time))
  }

  getUnreadCount(type = null) {
    if (!type || type === 'all') {
      return this.messages.filter(m => !m.isRead).length
    }
    return this.messages.filter(m => m.type === type && !m.isRead).length
  }

  getUnreadCountByType() {
    const result = {}
    Object.keys(MESSAGE_TYPE_CONFIG).forEach(type => {
      result[type] = this.getUnreadCount(type)
    })
    result.all = this.getUnreadCount('all')
    return result
  }

  addMessage(message) {
    const newMessage = {
      id: generateId(),
      isRead: false,
      time: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      ...message,
      data: message.data || {}
    }
    this.messages.unshift(newMessage)
    this.save()
    console.log('[MessageManager] 新增消息:', newMessage.title)
    return newMessage
  }

  markAsRead(messageId) {
    const message = this.messages.find(m => m.id === messageId)
    if (message && !message.isRead) {
      message.isRead = true
      this.save()
      console.log('[MessageManager] 消息已读:', messageId)
      return true
    }
    return false
  }

  markAllAsRead(type = null) {
    let count = 0
    this.messages.forEach(m => {
      if (!m.isRead) {
        if (!type || type === 'all' || m.type === type) {
          m.isRead = true
          count++
        }
      }
    })
    if (count > 0) {
      this.save()
      console.log('[MessageManager] 全部已读，数量:', count)
    }
    return count
  }

  deleteMessage(messageId) {
    const index = this.messages.findIndex(m => m.id === messageId)
    if (index > -1) {
      this.messages.splice(index, 1)
      this.save()
      console.log('[MessageManager] 删除消息:', messageId)
      return true
    }
    return false
  }

  deleteReadMessages() {
    const beforeCount = this.messages.length
    this.messages = this.messages.filter(m => !m.isRead)
    const deletedCount = beforeCount - this.messages.length
    if (deletedCount > 0) {
      this.save()
      console.log('[MessageManager] 删除已读消息:', deletedCount)
    }
    return deletedCount
  }

  deleteAllMessages() {
    const count = this.messages.length
    this.messages = []
    this.save()
    console.log('[MessageManager] 清空全部消息:', count)
    return count
  }

  getSubscriptionSetting(key) {
    return this.subscriptionSettings[key] !== false
  }

  setSubscriptionSetting(key, value) {
    this.subscriptionSettings[key] = value
    this.saveSubscriptionSettings()
  }

  getAllSubscriptionSettings() {
    return { ...this.subscriptionSettings }
  }

  shouldSendSigninReminder() {
    if (!this.getSubscriptionSetting('signinReminder')) return false
    const now = Date.now()
    const lastTime = this.subscriptionSettings.lastSigninReminderTime || 0
    const hoursDiff = (now - lastTime) / (1000 * 60 * 60)
    return hoursDiff >= 20
  }

  updateSigninReminderTime() {
    this.subscriptionSettings.lastSigninReminderTime = Date.now()
    this.saveSubscriptionSettings()
  }

  shouldSendPointsExpireReminder() {
    const now = Date.now()
    const lastTime = this.subscriptionSettings.lastPointsExpireReminderTime || 0
    const hoursDiff = (now - lastTime) / (1000 * 60 * 60)
    return hoursDiff >= 24
  }

  updatePointsExpireReminderTime() {
    this.subscriptionSettings.lastPointsExpireReminderTime = Date.now()
    this.saveSubscriptionSettings()
  }

  shouldSendHomeworkReminder() {
    if (!this.getSubscriptionSetting('homeworkDue')) return false
    const now = Date.now()
    const lastTime = this.subscriptionSettings.lastHomeworkReminderTime || 0
    const hoursDiff = (now - lastTime) / (1000 * 60 * 60)
    return hoursDiff >= 12
  }

  updateHomeworkReminderTime() {
    this.subscriptionSettings.lastHomeworkReminderTime = Date.now()
    this.saveSubscriptionSettings()
  }
}

const messageManager = new MessageManager()

module.exports = {
  MESSAGE_TYPES,
  MESSAGE_TYPE_CONFIG,
  SUBSCRIPTION_TEMPLATES,
  messageManager
}
