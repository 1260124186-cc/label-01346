/**
 * 用户等级配置
 */
const USER_LEVELS = [
  { level: 1, name: '环保新手', minPoints: 0, maxPoints: 500, icon: '🌱' },
  { level: 2, name: '环保学徒', minPoints: 500, maxPoints: 1500, icon: '🌿' },
  { level: 3, name: '环保达人', minPoints: 1500, maxPoints: 3500, icon: '🌳' },
  { level: 4, name: '环保专家', minPoints: 3500, maxPoints: 7000, icon: '🌲' },
  { level: 5, name: '环保大师', minPoints: 7000, maxPoints: Infinity, icon: '🏆' }
]

module.exports = {
  USER_LEVELS
}
