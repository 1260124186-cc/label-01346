/**
 * 个人中心菜单项
 */
const PROFILE_MENUS = [
  {
    id: 'quiz',
    icon: 'quiz',
    emoji: '❓',
    title: '知识问答',
    desc: '答题赢取积分奖励',
    link: '/pages/quiz/quiz'
  },
  {
    id: 'records',
    icon: 'history',
    emoji: '📊',
    title: '分类记录',
    desc: '查看历史分类记录',
    link: '/pages/records/records'
  },
  {
    id: 'points',
    icon: 'coin',
    emoji: '💰',
    title: '积分明细',
    desc: '查看积分获取与消费',
    link: '/pages/points/points'
  },
  {
    id: 'orders',
    icon: 'order',
    emoji: '📦',
    title: '兑换订单',
    desc: '查看商品兑换记录',
    link: '/pages/orders/orders'
  },
  {
    id: 'about',
    icon: 'info',
    emoji: 'ℹ️',
    title: '关于我们',
    desc: '了解垃圾分类助手',
    link: ''
  }
]

module.exports = {
  PROFILE_MENUS
}
