require('../setup')

const {
  TRASH_TYPES,
  BANNER_LIST,
  EXCHANGE_GOODS,
  EXCHANGE_BANNERS,
  PROFILE_MENUS,
  USER_LEVELS,
  getUserLevel,
  QUIZ_CHAPTERS,
  QUIZ_DIFFICULTIES,
  QUIZ_QUESTIONS,
  getQuestionsByChapter,
  getQuestionsByDifficulty,
  getRandomQuestions,
  getDailyQuestions
} = require('../../frontend-mp/utils/constants')

describe('TRASH_TYPES', () => {
  test('length is 4', () => {
    expect(TRASH_TYPES).toHaveLength(4)
  })

  test('each has required top-level properties', () => {
    TRASH_TYPES.forEach(item => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('englishName')
      expect(item).toHaveProperty('emoji')
      expect(item).toHaveProperty('color')
      expect(item).toHaveProperty('description')
      expect(item).toHaveProperty('examples')
      expect(item).toHaveProperty('tips')
    })
  })

  test('examples are arrays with name/desc/icon', () => {
    TRASH_TYPES.forEach(item => {
      expect(Array.isArray(item.examples)).toBe(true)
      item.examples.forEach(example => {
        expect(example).toHaveProperty('name')
        expect(example).toHaveProperty('desc')
        expect(example).toHaveProperty('icon')
      })
    })
  })
})

describe('BANNER_LIST', () => {
  test('length is 3', () => {
    expect(BANNER_LIST).toHaveLength(3)
  })

  test('each has id/image/title', () => {
    BANNER_LIST.forEach(item => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('image')
      expect(item).toHaveProperty('title')
    })
  })
})

describe('EXCHANGE_GOODS', () => {
  test('length is 6', () => {
    expect(EXCHANGE_GOODS).toHaveLength(6)
  })

  test('each has id/name/points/stock/image/tag', () => {
    EXCHANGE_GOODS.forEach(item => {
      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('name')
      expect(item).toHaveProperty('points')
      expect(item).toHaveProperty('stock')
      expect(item).toHaveProperty('image')
      expect(item).toHaveProperty('tag')
    })
  })

  test('all points > 0', () => {
    EXCHANGE_GOODS.forEach(item => {
      expect(item.points).toBeGreaterThan(0)
    })
  })

  test('all stock >= 0', () => {
    EXCHANGE_GOODS.forEach(item => {
      expect(item.stock).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('EXCHANGE_BANNERS', () => {
  test('length is 3', () => {
    expect(EXCHANGE_BANNERS).toHaveLength(3)
  })
})

describe('PROFILE_MENUS', () => {
  test('has 4 groups (学习中心/我的记录/我的服务/其他)', () => {
    expect(PROFILE_MENUS).toHaveLength(4)
    expect(PROFILE_MENUS[0].groupName).toBe('学习中心')
    expect(PROFILE_MENUS[1].groupName).toBe('我的记录')
    expect(PROFILE_MENUS[2].groupName).toBe('我的服务')
    expect(PROFILE_MENUS[3].groupName).toBe('其他')
  })

  test('each group has groupId, groupName and items array', () => {
    PROFILE_MENUS.forEach(group => {
      expect(group).toHaveProperty('groupId')
      expect(group).toHaveProperty('groupName')
      expect(group).toHaveProperty('items')
      expect(Array.isArray(group.items)).toBe(true)
      expect(group.items.length).toBeGreaterThan(0)
    })
  })

  test('each menu item has id/title/link/emoji', () => {
    PROFILE_MENUS.forEach(group => {
      group.items.forEach(item => {
        expect(item).toHaveProperty('id')
        expect(item).toHaveProperty('title')
        expect(item).toHaveProperty('link')
        expect(item).toHaveProperty('emoji')
      })
    })
  })
})

describe('USER_LEVELS', () => {
  test('length is 5', () => {
    expect(USER_LEVELS).toHaveLength(5)
  })

  test('minPoints/maxPoints progression', () => {
    for (let i = 1; i < USER_LEVELS.length; i++) {
      expect(USER_LEVELS[i].minPoints).toBe(USER_LEVELS[i - 1].maxPoints)
    }
  })

  test('maxPoints of last level is Infinity', () => {
    expect(USER_LEVELS[USER_LEVELS.length - 1].maxPoints).toBe(Infinity)
  })
})

describe('getUserLevel', () => {
  test('points 0 -> level 1', () => {
    const result = getUserLevel(0)
    expect(result.level).toBe(1)
  })

  test('points 500 -> level 2', () => {
    const result = getUserLevel(500)
    expect(result.level).toBe(2)
  })

  test('points 1500 -> level 3', () => {
    const result = getUserLevel(1500)
    expect(result.level).toBe(3)
  })

  test('points 3500 -> level 4', () => {
    const result = getUserLevel(3500)
    expect(result.level).toBe(4)
  })

  test('points 7000 -> level 5', () => {
    const result = getUserLevel(7000)
    expect(result.level).toBe(5)
  })

  test('returns progress percentage', () => {
    const result = getUserLevel(250)
    expect(result).toHaveProperty('progress')
    expect(typeof result.progress).toBe('number')
    expect(result.progress).toBeGreaterThanOrEqual(0)
  })
})

describe('QUIZ_CHAPTERS', () => {
  test('length is 5', () => {
    expect(QUIZ_CHAPTERS).toHaveLength(5)
  })
})

describe('QUIZ_DIFFICULTIES', () => {
  test('length is 3', () => {
    expect(QUIZ_DIFFICULTIES).toHaveLength(3)
  })

  test('contains easy/medium/hard', () => {
    const ids = QUIZ_DIFFICULTIES.map(d => d.id)
    expect(ids).toContain('easy')
    expect(ids).toContain('medium')
    expect(ids).toContain('hard')
  })
})

describe('QUIZ_QUESTIONS', () => {
  test('length is 25', () => {
    expect(QUIZ_QUESTIONS).toHaveLength(25)
  })

  test('each has id/chapterId/difficulty/question/options/correctIndex/explanation', () => {
    QUIZ_QUESTIONS.forEach(q => {
      expect(q).toHaveProperty('id')
      expect(q).toHaveProperty('chapterId')
      expect(q).toHaveProperty('difficulty')
      expect(q).toHaveProperty('question')
      expect(q).toHaveProperty('options')
      expect(q).toHaveProperty('correctIndex')
      expect(q).toHaveProperty('explanation')
    })
  })

  test('correctIndex within 0-3', () => {
    QUIZ_QUESTIONS.forEach(q => {
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThanOrEqual(3)
    })
  })
})

describe('getQuestionsByChapter', () => {
  test('returns questions for chapter 1 (should be 6)', () => {
    const result = getQuestionsByChapter(1)
    expect(result).toHaveLength(6)
    result.forEach(q => {
      expect(q.chapterId).toBe(1)
    })
  })

  test('returns [] for non-existent chapter', () => {
    const result = getQuestionsByChapter(999)
    expect(result).toEqual([])
  })
})

describe('getQuestionsByDifficulty', () => {
  test("returns questions for 'easy' (should be 10)", () => {
    const result = getQuestionsByDifficulty('easy')
    expect(result).toHaveLength(10)
    result.forEach(q => {
      expect(q.difficulty).toBe('easy')
    })
  })

  test("returns questions for 'medium' (should be 10)", () => {
    const result = getQuestionsByDifficulty('medium')
    expect(result).toHaveLength(10)
    result.forEach(q => {
      expect(q.difficulty).toBe('medium')
    })
  })

  test("returns questions for 'hard' (should be 5)", () => {
    const result = getQuestionsByDifficulty('hard')
    expect(result).toHaveLength(5)
    result.forEach(q => {
      expect(q.difficulty).toBe('hard')
    })
  })
})

describe('getRandomQuestions', () => {
  test('returns correct count', () => {
    const result = getRandomQuestions(3)
    expect(result).toHaveLength(3)
  })

  test('returns questions from pool', () => {
    const result = getRandomQuestions(5)
    result.forEach(q => {
      expect(QUIZ_QUESTIONS).toContainEqual(expect.objectContaining({ id: q.id }))
    })
  })
})

describe('getDailyQuestions', () => {
  test('returns 5 questions', () => {
    const result = getDailyQuestions()
    expect(result).toHaveLength(5)
  })

  test('all from QUIZ_QUESTIONS', () => {
    const result = getDailyQuestions()
    result.forEach(q => {
      expect(QUIZ_QUESTIONS).toContainEqual(expect.objectContaining({ id: q.id }))
    })
  })
})
