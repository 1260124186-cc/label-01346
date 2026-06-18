const { generateId, formatDate, getStorage, setStorage } = require('./util')
const { messageManager, MESSAGE_TYPES, MESSAGE_TYPE_CONFIG } = require('./message')

const TICKET_STORAGE_KEY = 'tickets'

const TICKET_TYPES = {
  ORDER: 'order',
  RECYCLE: 'recycle',
  RECOGNIZE: 'recognize',
  ENCYCLOPEDIA: 'encyclopedia'
}

const TICKET_TYPE_CONFIG = {
  [TICKET_TYPES.ORDER]: {
    id: TICKET_TYPES.ORDER,
    name: '订单问题',
    emoji: '📦',
    color: '#4A90D9',
    bgColor: 'rgba(74, 144, 217, 0.1)',
    description: '商品兑换、订单物流、退款售后等问题'
  },
  [TICKET_TYPES.RECYCLE]: {
    id: TICKET_TYPES.RECYCLE,
    name: '回收问题',
    emoji: '🚛',
    color: '#E67E22',
    bgColor: 'rgba(230, 126, 34, 0.1)',
    description: '上门回收、预约时间、回收人员等问题',
    isUrgent: true
  },
  [TICKET_TYPES.RECOGNIZE]: {
    id: TICKET_TYPES.RECOGNIZE,
    name: '识别不准',
    emoji: '📷',
    color: '#E74C3C',
    bgColor: 'rgba(231, 76, 60, 0.1)',
    description: '拍照识别结果不准确、识别失败等问题'
  },
  [TICKET_TYPES.ENCYCLOPEDIA]: {
    id: TICKET_TYPES.ENCYCLOPEDIA,
    name: '百科纠错',
    emoji: '📚',
    color: '#9B59B6',
    bgColor: 'rgba(155, 89, 182, 0.1)',
    description: '垃圾分类百科知识错误、缺失等问题'
  }
}

const TICKET_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  RESOLVED: 'resolved'
}

const TICKET_STATUS_CONFIG = {
  [TICKET_STATUS.PENDING]: {
    id: TICKET_STATUS.PENDING,
    name: '待受理',
    emoji: '⏳',
    color: '#F39C12',
    bgColor: 'rgba(243, 156, 18, 0.1)'
  },
  [TICKET_STATUS.PROCESSING]: {
    id: TICKET_STATUS.PROCESSING,
    name: '处理中',
    emoji: '🔄',
    color: '#3498DB',
    bgColor: 'rgba(52, 152, 219, 0.1)'
  },
  [TICKET_STATUS.RESOLVED]: {
    id: TICKET_STATUS.RESOLVED,
    name: '已解决',
    emoji: '✅',
    color: '#27AE60',
    bgColor: 'rgba(39, 174, 96, 0.1)'
  }
}

const CUSTOMER_SERVICE_PHONE = '400-123-4567'

const FAQ_LIST = [
  {
    id: 'faq1',
    question: '如何获取积分？',
    answer: '您可以通过以下方式获取积分：\n1. 每日签到：+5积分/天\n2. 答题正确：+5-20积分/题\n3. 完成学习课程：+50-200积分\n4. 邀请好友注册：+100积分/人\n5. 参与活动：根据活动规则获得积分奖励'
  },
  {
    id: 'faq2',
    question: '积分有什么用？',
    answer: '积分可以在「积分兑换」页面兑换各种环保好物，包括环保购物袋、便携餐具、保温杯等。积分自获取之日起1年内有效，请及时使用。'
  },
  {
    id: 'faq3',
    question: '如何预约上门回收？',
    answer: '在「我的」页面点击「上门回收」，选择回收物品类型、填写数量和取件地址，选择预约时间后提交即可。工作人员会在预约时间上门取件。'
  },
  {
    id: 'faq4',
    question: '拍照识别不准怎么办？',
    answer: '拍照识别功能基于AI算法，可能存在识别不准确的情况。您可以：\n1. 确保拍摄清晰，光线充足\n2. 尝试从不同角度拍摄\n3. 如果多次识别错误，可通过提交「识别不准」类型的工单反馈，我们会持续优化识别模型'
  },
  {
    id: 'faq5',
    question: '兑换的商品多久能收到？',
    answer: '商品兑换成功后，我们会在1-3个工作日内发货，发货后会通过消息通知您物流信息。一般情况下，3-7个工作日内可以收到商品。'
  },
  {
    id: 'faq6',
    question: '如何修改个人信息？',
    answer: '在「我的」页面，点击头像可以修改头像，点击昵称可以修改昵称。其他个人信息（如收货地址）可在「收货地址」页面管理。'
  },
  {
    id: 'faq7',
    question: '如何加入/创建家庭组？',
    answer: '在「我的」页面点击「创建/加入家庭/班级组」，可以创建新的群组或通过邀请码加入已有的群组。群组内可以一起学习、PK，查看组内排行榜。'
  },
  {
    id: 'faq8',
    question: '回收的积分什么时候到账？',
    answer: '上门回收完成后，工作人员会现场核验物品，实际积分会在核验完成后1-2个工作日内到账。您可以在「积分明细」中查看入账记录。'
  }
]

const getDefaultTickets = () => {
  const now = new Date()
  const today = formatDate(now, 'YYYY-MM-DD')
  const yesterday = formatDate(new Date(now.getTime() - 86400000), 'YYYY-MM-DD')
  const twoDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 2), 'YYYY-MM-DD')

  return [
    {
      id: generateId(),
      type: TICKET_TYPES.ORDER,
      title: '兑换商品未收到',
      description: '我在6月10日兑换了环保购物袋，订单号：20240610001，至今未收到商品，请帮忙查询。',
      images: [],
      status: TICKET_STATUS.RESOLVED,
      orderNo: '20240610001',
      createdAt: twoDaysAgo + ' 10:30',
      updatedAt: yesterday + ' 15:20',
      replies: [
        {
          id: generateId(),
          isStaff: true,
          content: '您好，已为您查询到该订单已于6月12日签收，签收人为您的家人。如果您仍未收到商品，请联系快递员或我们进一步核实。',
          createdAt: yesterday + ' 11:00'
        },
        {
          id: generateId(),
          isStaff: false,
          content: '好的，我问一下家人，谢谢！',
          createdAt: yesterday + ' 11:30'
        },
        {
          id: generateId(),
          isStaff: true,
          content: '不客气，如果还有其他问题请随时联系我们。祝您生活愉快！',
          createdAt: yesterday + ' 15:20'
        }
      ],
      rating: 5
    },
    {
      id: generateId(),
      type: TICKET_TYPES.RECYCLE,
      title: '回收人员迟到',
      description: '预约了今天下午2-4点上门回收旧家电，现在已经5点了还没有人来，请尽快联系处理。',
      images: [],
      status: TICKET_STATUS.PROCESSING,
      isUrgent: true,
      recycleOrderNo: 'RO20240618001',
      createdAt: today + ' 17:00',
      updatedAt: today + ' 17:15',
      replies: [
        {
          id: generateId(),
          isStaff: true,
          content: '非常抱歉给您带来不便！我们已紧急联系回收人员，他因为前面的用户物品较多延误了，预计6点前可以到达您处。回收人员电话：138****8888，您也可以直接联系。',
          createdAt: today + ' 17:15'
        }
      ]
    },
    {
      id: generateId(),
      type: TICKET_TYPES.RECOGNIZE,
      title: '玉米皮识别错误',
      description: '拍照识别玉米皮，系统识别为厨余垃圾，但实际上玉米皮因为难降解，应该属于其他垃圾。',
      images: [],
      status: TICKET_STATUS.PENDING,
      createdAt: yesterday + ' 20:30',
      updatedAt: yesterday + ' 20:30',
      replies: []
    }
  ]
}

class TicketManager {
  constructor() {
    this.tickets = []
    this.init()
  }

  init() {
    const storedTickets = getStorage(TICKET_STORAGE_KEY)
    if (storedTickets && Array.isArray(storedTickets) && storedTickets.length > 0) {
      this.tickets = storedTickets
    } else {
      this.tickets = getDefaultTickets()
      this.save()
    }
    console.log('[TicketManager] 初始化完成，工单数量:', this.tickets.length)
  }

  save() {
    setStorage(TICKET_STORAGE_KEY, this.tickets)
  }

  getAllTickets() {
    return [...this.tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getTicketsByStatus(status) {
    if (!status || status === 'all') {
      return this.getAllTickets()
    }
    return this.tickets
      .filter(t => t.status === status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getTicketById(ticketId) {
    return this.tickets.find(t => t.id === ticketId) || null
  }

  createTicket(ticketData) {
    const newTicket = {
      id: generateId(),
      status: TICKET_STATUS.PENDING,
      createdAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      updatedAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
      images: [],
      replies: [],
      ...ticketData
    }

    this.tickets.unshift(newTicket)
    this.save()

    messageManager.addMessage({
      type: MESSAGE_TYPES.TICKET,
      title: '工单提交成功',
      content: `您的「${TICKET_TYPE_CONFIG[newTicket.type].name}」工单已提交，工单号：${newTicket.id}，我们会尽快处理。`,
      emoji: '📝',
      data: {
        ticketId: newTicket.id,
        link: '/pages/ticket-detail/ticket-detail?id=' + newTicket.id
      }
    })

    console.log('[TicketManager] 创建工单:', newTicket.id)
    return newTicket
  }

  appendReply(ticketId, content, images = []) {
    const ticket = this.getTicketById(ticketId)
    if (!ticket) return null

    const reply = {
      id: generateId(),
      isStaff: false,
      content,
      images,
      createdAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }

    ticket.replies.push(reply)
    ticket.updatedAt = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    this.save()

    console.log('[TicketManager] 追加回复:', ticketId)
    return reply
  }

  updateStatus(ticketId, status) {
    const ticket = this.getTicketById(ticketId)
    if (!ticket) return false

    const oldStatus = ticket.status
    ticket.status = status
    ticket.updatedAt = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    this.save()

    if (oldStatus !== status) {
      const statusConfig = TICKET_STATUS_CONFIG[status]
      messageManager.addMessage({
        type: MESSAGE_TYPES.TICKET,
        title: '工单状态更新',
        content: `您的工单「${ticket.title}」状态已更新为：${statusConfig.emoji} ${statusConfig.name}`,
        emoji: statusConfig.emoji,
        data: {
          ticketId: ticketId,
          link: '/pages/ticket-detail/ticket-detail?id=' + ticketId
        }
      })
    }

    console.log('[TicketManager] 更新工单状态:', ticketId, status)
    return true
  }

  rateTicket(ticketId, rating) {
    const ticket = this.getTicketById(ticketId)
    if (!ticket) return false

    ticket.rating = rating
    ticket.updatedAt = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    this.save()

    messageManager.addMessage({
      type: MESSAGE_TYPES.TICKET,
      title: '感谢您的评价',
      content: `感谢您对我们服务的评价（${rating}星），您的反馈对我们很重要！`,
      emoji: '⭐',
      data: {
        ticketId: ticketId,
        link: '/pages/ticket-detail/ticket-detail?id=' + ticketId
      }
    })

    console.log('[TicketManager] 工单评价:', ticketId, rating)
    return true
  }

  getUnreadCount() {
    return this.tickets.filter(t => t.status === TICKET_STATUS.PENDING).length
  }

  getCountByStatus() {
    return {
      all: this.tickets.length,
      [TICKET_STATUS.PENDING]: this.tickets.filter(t => t.status === TICKET_STATUS.PENDING).length,
      [TICKET_STATUS.PROCESSING]: this.tickets.filter(t => t.status === TICKET_STATUS.PROCESSING).length,
      [TICKET_STATUS.RESOLVED]: this.tickets.filter(t => t.status === TICKET_STATUS.RESOLVED).length
    }
  }

  simulateStaffReply(ticketId) {
    const ticket = this.getTicketById(ticketId)
    if (!ticket || ticket.status === TICKET_STATUS.RESOLVED) return null

    const autoReplies = [
      '您好，感谢您的反馈！我们已收到您的问题，正在核实中，预计1-2个工作日内给您答复。',
      '您好，我们正在加急处理您的问题，请耐心等待。如有紧急情况，请拨打客服热线：400-123-4567。',
      '您好，经过核实，您反馈的问题我们已经记录，会尽快安排处理。感谢您的理解与支持！'
    ]

    setTimeout(() => {
      const reply = {
        id: generateId(),
        isStaff: true,
        content: autoReplies[Math.floor(Math.random() * autoReplies.length)],
        createdAt: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
      }

      const currentTicket = this.getTicketById(ticketId)
      if (currentTicket) {
        currentTicket.replies.push(reply)
        if (currentTicket.status === TICKET_STATUS.PENDING) {
          currentTicket.status = TICKET_STATUS.PROCESSING
        }
        currentTicket.updatedAt = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
        this.save()

        messageManager.addMessage({
          type: MESSAGE_TYPES.TICKET,
          title: '工单有新回复',
          content: `您的工单「${currentTicket.title}」收到客服新回复，请查看。`,
          emoji: '💬',
          data: {
            ticketId: ticketId,
            link: '/pages/ticket-detail/ticket-detail?id=' + ticketId
          }
        })

        console.log('[TicketManager] 模拟客服回复:', ticketId)
      }
    }, 3000)

    return true
  }
}

const ticketManager = new TicketManager()

module.exports = {
  TICKET_TYPES,
  TICKET_TYPE_CONFIG,
  TICKET_STATUS,
  TICKET_STATUS_CONFIG,
  CUSTOMER_SERVICE_PHONE,
  FAQ_LIST,
  ticketManager
}
