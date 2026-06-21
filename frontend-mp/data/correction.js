const { generateId } = require('../utils/util')
const { formatDate } = require('../utils/util')
const { TRASH_TYPES } = require('../utils/constants')

const CORRECTION_REASONS = [
  { id: 'wrong_category', name: '分类错误', emoji: '🔀', desc: '该物品所属分类不正确' },
  { id: 'wrong_desc', name: '描述有误', emoji: '📝', desc: '基本介绍或投放说明有误' },
  { id: 'missing_item', name: '缺少条目', emoji: '📭', desc: '该物品不在百科中，需要补充' },
  { id: 'wrong_tips', name: '投放建议有误', emoji: '💡', desc: '投放建议信息不正确' },
  { id: 'other', name: '其他问题', emoji: '❓', desc: '其他类型的问题' }
]

const CORRECTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

const CORRECTION_POINTS_REWARD = 20

const CONTRIBUTOR_TIERS = [
  { id: 'bronze', name: '铜牌贡献者', emoji: '🥉', minCount: 1, color: '#CD7F32', bgColor: 'rgba(205, 127, 50, 0.1)' },
  { id: 'silver', name: '银牌贡献者', emoji: '🥈', minCount: 5, color: '#C0C0C0', bgColor: 'rgba(192, 192, 192, 0.1)' },
  { id: 'gold', name: '金牌贡献者', emoji: '🥇', minCount: 15, color: '#FFD700', bgColor: 'rgba(255, 215, 0, 0.1)' },
  { id: 'diamond', name: '钻石贡献者', emoji: '💎', minCount: 30, color: '#B9F2FF', bgColor: 'rgba(185, 242, 255, 0.1)' }
]

const HOT_CORRECTION_THRESHOLD = 3

function getCorrectionCategoryOptions() {
  return TRASH_TYPES.map(t => ({
    id: t.id,
    name: t.name,
    emoji: t.emoji,
    color: t.color,
    bgColor: t.bgColor
  }))
}

function generateMockCorrections() {
  const now = new Date()
  const today = formatDate(now, 'YYYY-MM-DD HH:mm')
  const yesterday = formatDate(new Date(now.getTime() - 86400000), 'YYYY-MM-DD HH:mm')
  const twoDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 2), 'YYYY-MM-DD HH:mm')
  const threeDaysAgo = formatDate(new Date(now.getTime() - 86400000 * 3), 'YYYY-MM-DD HH:mm')

  return [
    {
      id: generateId(),
      itemId: 'trash_001',
      itemName: '塑料瓶',
      itemEmoji: '🧴',
      originalTypeId: 4,
      originalTypeName: '其他垃圾',
      reason: 'wrong_category',
      reasonName: '分类错误',
      correctTypeId: 1,
      correctTypeName: '可回收垃圾',
      description: '塑料瓶属于可回收垃圾，不是其他垃圾',
      images: [],
      status: CORRECTION_STATUS.APPROVED,
      submitterId: 'user_mock_1',
      submitterName: '环保达人',
      reviewerId: 'admin',
      reviewTime: yesterday,
      rewardPoints: CORRECTION_POINTS_REWARD,
      createTime: threeDaysAgo
    },
    {
      id: generateId(),
      itemId: 'trash_005',
      itemName: '废电池',
      itemEmoji: '🔋',
      originalTypeId: 1,
      originalTypeName: '可回收垃圾',
      reason: 'wrong_category',
      reasonName: '分类错误',
      correctTypeId: 2,
      correctTypeName: '有害垃圾',
      description: '废电池含有重金属，属于有害垃圾',
      images: [],
      status: CORRECTION_STATUS.APPROVED,
      submitterId: 'user_mock_1',
      submitterName: '环保达人',
      reviewerId: 'admin',
      reviewTime: twoDaysAgo,
      rewardPoints: CORRECTION_POINTS_REWARD,
      createTime: threeDaysAgo
    },
    {
      id: generateId(),
      itemId: 'trash_010',
      itemName: '外卖餐盒',
      itemEmoji: '🥡',
      originalTypeId: 3,
      originalTypeName: '厨余垃圾',
      reason: 'wrong_category',
      reasonName: '分类错误',
      correctTypeId: 4,
      correctTypeName: '其他垃圾',
      description: '外卖餐盒属于其他垃圾，不是厨余垃圾',
      images: [],
      status: CORRECTION_STATUS.PENDING,
      submitterId: 'user_mock_2',
      submitterName: '分类小白',
      reviewerId: '',
      reviewTime: '',
      rewardPoints: 0,
      createTime: yesterday
    },
    {
      id: generateId(),
      itemId: 'trash_012',
      itemName: '大骨头',
      itemEmoji: '🦴',
      originalTypeId: 3,
      originalTypeName: '厨余垃圾',
      reason: 'wrong_category',
      reasonName: '分类错误',
      correctTypeId: 4,
      correctTypeName: '其他垃圾',
      description: '大骨头因为难腐蚀，应归为其他垃圾',
      images: [],
      status: CORRECTION_STATUS.PENDING,
      submitterId: 'user_mock_3',
      submitterName: '绿色先锋',
      reviewerId: '',
      reviewTime: '',
      rewardPoints: 0,
      createTime: today
    },
    {
      id: generateId(),
      itemId: 'trash_015',
      itemName: '椰子壳',
      itemEmoji: '🥥',
      originalTypeId: 3,
      originalTypeName: '厨余垃圾',
      reason: 'wrong_desc',
      reasonName: '描述有误',
      correctTypeId: 4,
      correctTypeName: '其他垃圾',
      description: '椰子壳因为坚硬难以粉碎，应归为其他垃圾',
      images: [],
      status: CORRECTION_STATUS.REJECTED,
      submitterId: 'user_mock_2',
      submitterName: '分类小白',
      reviewerId: 'admin',
      reviewTime: twoDaysAgo,
      rewardPoints: 0,
      rejectReason: '已有相同纠错被采纳',
      createTime: threeDaysAgo
    }
  ]
}

function generateMockLeaderboard() {
  return [
    { rank: 1, userId: 'user_mock_1', nickName: '环保达人', avatarEmoji: '🌱', approvedCount: 12, totalPoints: 240 },
    { rank: 2, userId: 'user_mock_3', nickName: '绿色先锋', avatarEmoji: '🌿', approvedCount: 8, totalPoints: 160 },
    { rank: 3, userId: 'user_mock_2', nickName: '分类小白', avatarEmoji: '🍀', approvedCount: 3, totalPoints: 60 },
    { rank: 4, userId: 'user_mock_4', nickName: '回收达人', avatarEmoji: '♻️', approvedCount: 2, totalPoints: 40 }
  ]
}

module.exports = {
  CORRECTION_REASONS,
  CORRECTION_STATUS,
  CORRECTION_POINTS_REWARD,
  CONTRIBUTOR_TIERS,
  HOT_CORRECTION_THRESHOLD,
  getCorrectionCategoryOptions,
  generateMockCorrections,
  generateMockLeaderboard
}
