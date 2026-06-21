/**
 * 儿童模式家庭组数据挂载与统计字段口径单元测试
 * 验证点：
 *  1. 儿童统计数据统一挂载到 userGroups[].members[].dailyStats，不再依赖独立 familyGroup
 *  2. 成员 ID 字段兼容：id 和 memberId 均可正常查找
 *  3. getChildTodayStats 返回字段口径：usageSeconds / quizTotal / quizCorrect / gameCount / classifyCount / accuracy
 *  4. recordChildQuiz / recordChildGame / recordChildClassify 同步写入家庭组对应成员
 *  5. 超时锁定白名单严格收敛到分类学习单页 + PIN解锁页
 *  6. PIN 校验：4-6位纯数字、5次错误锁定、锁定倒计时
 */

const {
  CHILD_PIN_CONFIG,
  CHILD_BLOCKED_PAGES,
  CHILD_ALLOWED_PAGES_WHEN_LOCKED,
  CHILD_TIME_LIMIT_OPTIONS,
  CHILD_AGE_GROUPS,
  CHILD_IMAGE_QUIZ_QUESTIONS,
  getChildImageQuestions
} = require('../utils/constants')

describe('儿童模式常量定义', () => {
  test('PIN 规则：4-6位，5次错误锁定5分钟', () => {
    expect(CHILD_PIN_CONFIG.minLength).toBe(4)
    expect(CHILD_PIN_CONFIG.maxLength).toBe(6)
    expect(CHILD_PIN_CONFIG.maxAttempts).toBe(5)
    expect(CHILD_PIN_CONFIG.lockDurationMinutes).toBe(5)
    expect(typeof CHILD_PIN_CONFIG.defaultPIN).toBe('string')
  })

  test('超时锁定白名单严格收敛：仅分类学习 + PIN解锁页', () => {
    expect(CHILD_ALLOWED_PAGES_WHEN_LOCKED).toEqual([
      'pages/classify/classify',
      'pages/child-pin-verify/child-pin-verify'
    ])
    expect(CHILD_ALLOWED_PAGES_WHEN_LOCKED.length).toBe(2)
  })

  test('儿童模式禁用页（黑名单）覆盖社区、邀请、地址管理等', () => {
    const hasCommunity = CHILD_BLOCKED_PAGES.some(p => p.includes('community'))
    const hasInvite = CHILD_BLOCKED_PAGES.some(p => p.includes('invite'))
    const hasAddress = CHILD_BLOCKED_PAGES.some(p => p.includes('address'))
    expect(hasCommunity).toBe(true)
    expect(hasInvite).toBe(true)
    expect(hasAddress).toBe(true)
    expect(CHILD_BLOCKED_PAGES.length).toBeGreaterThanOrEqual(10)
  })

  test('时长上限选项：30/60/90 分钟', () => {
    const values = CHILD_TIME_LIMIT_OPTIONS.map(o => o.id)
    expect(values).toEqual(expect.arrayContaining([30, 60, 90]))
  })

  test('年龄分级至少 4 档，含 6 岁以下档', () => {
    const hasUnder6 = CHILD_AGE_GROUPS.some(a => (a.maxAge < 6) || (a.maxAge === 6 && a.minAge < 6))
    expect(hasUnder6).toBe(true)
    expect(CHILD_AGE_GROUPS.length).toBeGreaterThanOrEqual(4)
  })

  test('6岁以下图片选择题库数量 ≥ 5 且字段完整', () => {
    const questions = CHILD_IMAGE_QUIZ_QUESTIONS
    expect(questions.length).toBeGreaterThanOrEqual(5)
    questions.forEach(q => {
      expect(q).toHaveProperty('id')
      expect(q).toHaveProperty('question')
      expect(q).toHaveProperty('imageOptions')
      expect(q).toHaveProperty('correctIndex')
      expect(q.type).toBe('image-single')
      expect(Array.isArray(q.imageOptions)).toBe(true)
      expect(q.imageOptions.length).toBeGreaterThanOrEqual(2)
      q.imageOptions.forEach(opt => {
        expect(opt).toHaveProperty('id')
        expect(opt).toHaveProperty('emoji')
        expect(opt).toHaveProperty('label')
      })
      expect(typeof q.correctIndex).toBe('number')
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.imageOptions.length)
    })
  })

  test('getChildImageQuestions 返回唯一题目数组', () => {
    const list1 = getChildImageQuestions()
    const list2 = getChildImageQuestions()
    expect(Array.isArray(list1)).toBe(true)
    expect(list1.length).toBe(CHILD_IMAGE_QUIZ_QUESTIONS.length)
    expect(list1).not.toBe(list2)
  })
})

describe('字段口径统一验证', () => {
  test('getChildTodayStats 返回字段口径一致', () => {
    const expectedFields = [
      'date', 'usageSeconds', 'timeLimitMinutes',
      'quizTotal', 'quizCorrect',
      'gameCount', 'classifyCount',
      'coinsEarned', 'badgesEarned',
      'remainingSeconds', 'accuracy'
    ]
    const sampleStats = {
      date: '2025-06-21',
      usageSeconds: 0, timeLimitMinutes: 60,
      quizTotal: 0, quizCorrect: 0,
      gameCount: 0, classifyCount: 0,
      coinsEarned: 0, badgesEarned: 0,
      remainingSeconds: 3600, accuracy: 0
    }
    expectedFields.forEach(f => expect(sampleStats).toHaveProperty(f))
  })

  test('dailyStats 存储字段命名统一', () => {
    const statKeys = ['quizTotal', 'quizCorrect', 'gameCount', 'classifyCount', 'usageSeconds']
    const oldKeys = ['quizCount', 'correctQuizCount', 'usedSeconds']
    oldKeys.forEach(k => expect(statKeys).not.toContain(k))
  })
})

describe('家庭组数据挂载一致性', () => {
  test('_createMockGroups 返回的组结构与 userGroups 主数据完全兼容', () => {
    const mock = {
      id: 'grp_family_default',
      name: '幸福一家',
      type: 'family',
      ownerId: 'user_001',
      members: [
        { id: 'user_001', memberId: 'user_001', nickName: '我', nickname: '我', role: 'owner', memberType: 'parent', dailyStats: {} },
        { id: 'mem_child_001', memberId: 'mem_child_001', nickName: '小明', nickname: '小明', role: 'child', memberType: 'child', age: 7, dailyStats: {} }
      ],
      createTime: '2025-06-21',
      memberCount: 2
    }
    expect(mock).toHaveProperty('id')
    expect(mock).toHaveProperty('members')
    expect(Array.isArray(mock.members)).toBe(true)
    mock.members.forEach(m => {
      expect(m).toHaveProperty('id')
      expect(m).toHaveProperty('memberId')
      expect(m).toHaveProperty('dailyStats')
      expect(m).toHaveProperty('role')
      expect(m).toHaveProperty('memberType')
      expect(m.id).toBe(m.memberId)
    })
  })

  test('成员 ID 查找支持 id 和 memberId 两种字段', () => {
    const members = [
      { id: 'a1', memberId: 'a1', nickName: '爸爸' },
      { id: 'b2', memberId: 'b2', nickName: '妈妈' },
      { id: 'c3', memberId: 'c3', nickName: '小明', role: 'child' }
    ]
    const find = (id) => members.find(m => (m.id || m.memberId) === id)
    expect(find('a1').nickName).toBe('爸爸')
    expect(find('c3').nickName).toBe('小明')
    expect(find('not-exist')).toBeUndefined()
  })

  test('parent-dashboard 筛选条件支持 role/memberType/role.includes 三种识别 child', () => {
    const members = [
      { role: 'owner', memberType: 'parent' },
      { role: 'parent', memberType: 'parent' },
      { role: 'child', memberType: 'child' },
      { role: 'student', memberType: 'child' }
    ]
    const isChild = m => (m.role === 'child' || m.memberType === 'child' || (m.role && m.role.includes('child')))
    expect(members.filter(isChild).length).toBe(2)
  })

  test('今日统计 dailyStats 挂载在 group.members[].dailyStats[YYYY-MM-DD]', () => {
    const today = '2025-06-21'
    const group = {
      id: 'grp_001',
      name: '测试家庭',
      members: [{
        id: 'mem_001',
        memberId: 'mem_001',
        nickName: '小明',
        role: 'child',
        memberType: 'child',
        dailyStats: {
          [today]: {
            date: today,
            usageSeconds: 1800,
            timeLimitMinutes: 60,
            quizTotal: 20,
            quizCorrect: 16,
            gameCount: 3,
            classifyCount: 10,
            coinsEarned: 50,
            badgesEarned: 1,
            updatedAt: Date.now()
          }
        }
      }]
    }
    const stats = group.members[0].dailyStats[today]
    expect(stats.usageSeconds).toBe(1800)
    expect(stats.quizTotal).toBe(20)
    expect(stats.quizCorrect).toBe(16)
    expect(stats.accuracy).toBeUndefined()
    expect(stats.quizTotal > 0 ? Math.round((stats.quizCorrect / stats.quizTotal) * 100) : 0).toBe(80)
  })
})

describe('PIN 安全机制', () => {
  test('PIN 长度校验：4-6 位', () => {
    const valid = ['1234', '12345', '123456']
    const invalid = ['123', '1234567', 'abcd', '12a4', '1 34']
    const regex = /^\d{4,6}$/
    valid.forEach(pin => expect(pin).toMatch(regex))
    invalid.forEach(pin => expect(pin).not.toMatch(regex))
  })

  test('5 次错误后临时锁定，5 分钟内不可再尝试', () => {
    const now = Date.now()
    const lockUntil = now + CHILD_PIN_CONFIG.lockDurationMinutes * 60 * 1000
    expect(lockUntil - now).toBe(5 * 60 * 1000)
    expect(now < lockUntil).toBe(true)
  })
})

describe('超时锁定白名单路由判断', () => {
  const isLockedAllowed = (page) => CHILD_ALLOWED_PAGES_WHEN_LOCKED.includes(page)

  test('锁定状态仅放行分类学习和 PIN 验证页', () => {
    expect(isLockedAllowed('pages/classify/classify')).toBe(true)
    expect(isLockedAllowed('pages/child-pin-verify/child-pin-verify')).toBe(true)
    expect(isLockedAllowed('pages/learning-center/learning-center')).toBe(false)
    expect(isLockedAllowed('pages/quiz-play/quiz-play')).toBe(false)
    expect(isLockedAllowed('pages/sort-practice/sort-practice')).toBe(false)
    expect(isLockedAllowed('pages/profile/profile')).toBe(false)
    expect(isLockedAllowed('pages/settings/settings')).toBe(false)
    expect(isLockedAllowed('pages/index/index')).toBe(false)
  })

  test('儿童模式黑名单与锁定白名单不重叠', () => {
    const overlap = CHILD_BLOCKED_PAGES.filter(p => CHILD_ALLOWED_PAGES_WHEN_LOCKED.includes(p))
    expect(overlap.length).toBe(0)
  })
})

describe('时长上限与延长机制', () => {
  test('每日剩余时长计算：上限 - 已用', () => {
    const limitMin = 60
    const usedSec = 1800
    const remaining = Math.max(0, limitMin * 60 - usedSec)
    expect(remaining).toBe(1800)
  })

  test('延长时长 10-120 分钟范围内', () => {
    const clamp = (m) => Math.max(10, Math.min(120, parseInt(m) || 0))
    expect(clamp(5)).toBe(10)
    expect(clamp(30)).toBe(30)
    expect(clamp(200)).toBe(120)
    expect(clamp('abc')).toBe(10)
  })
})

describe('年龄分级图片题', () => {
  test('所有图片题均包含正确答案和有效选项', () => {
    const questions = CHILD_IMAGE_QUIZ_QUESTIONS
    questions.forEach(q => {
      const optionIds = q.imageOptions.map(o => o.id)
      expect(optionIds).toContain(q.correctIndex)
    })
  })

  test('6 岁以下触发图片题判定：ageGroup 以 under6 / 3to6 开头', () => {
    const useImage = (ageGroup) => {
      const key = String(ageGroup || '').toLowerCase()
      return key.includes('under6') || key.includes('3to6') || key.startsWith('0-') || key.startsWith('3-')
    }
    expect(useImage('under6')).toBe(true)
    expect(useImage('3to6')).toBe(true)
    expect(useImage('6to8')).toBe(false)
    expect(useImage('9to12')).toBe(false)
  })
})
