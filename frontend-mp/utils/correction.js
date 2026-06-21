const { generateId, formatDate } = require('./util')
const {
  CORRECTION_STATUS,
  CORRECTION_POINTS_REWARD,
  CONTRIBUTOR_TIERS,
  HOT_CORRECTION_THRESHOLD,
  generateMockCorrections,
  generateMockLeaderboard
} = require('../data/correction')

const correctionManager = {
  _corrections: null,
  _leaderboard: null,

  init() {
    const stored = wx.getStorageSync('corrections')
    if (stored && stored.length > 0) {
      this._corrections = stored
    } else {
      this._corrections = generateMockCorrections()
      wx.setStorageSync('corrections', this._corrections)
    }

    const storedLeaderboard = wx.getStorageSync('correctionLeaderboard')
    if (storedLeaderboard && storedLeaderboard.length > 0) {
      this._leaderboard = storedLeaderboard
    } else {
      this._leaderboard = generateMockLeaderboard()
      wx.setStorageSync('correctionLeaderboard', this._leaderboard)
    }

    console.log('[Correction] 纠错系统已初始化，', this._corrections.length, '条纠错记录')
  },

  getCorrections(filters) {
    let list = [...(this._corrections || [])]
    if (filters) {
      if (filters.status) {
        list = list.filter(c => c.status === filters.status)
      }
      if (filters.submitterId) {
        list = list.filter(c => c.submitterId === filters.submitterId)
      }
      if (filters.reason) {
        list = list.filter(c => c.reason === filters.reason)
      }
    }
    return list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
  },

  getPendingCorrections() {
    return this.getCorrections({ status: CORRECTION_STATUS.PENDING })
  },

  getApprovedCorrections() {
    return this.getCorrections({ status: CORRECTION_STATUS.APPROVED })
  },

  getCorrectionsByUser(submitterId) {
    return this.getCorrections({ submitterId })
  },

  getCorrectionById(id) {
    return (this._corrections || []).find(c => c.id === id)
  },

  submitCorrection(data) {
    const correction = {
      id: generateId(),
      itemId: data.itemId || '',
      itemName: data.itemName || '',
      itemEmoji: data.itemEmoji || '🗑️',
      originalTypeId: data.originalTypeId,
      originalTypeName: data.originalTypeName || '',
      reason: data.reason,
      reasonName: data.reasonName || '',
      correctTypeId: data.correctTypeId || 0,
      correctTypeName: data.correctTypeName || '',
      description: data.description || '',
      images: data.images || [],
      status: CORRECTION_STATUS.PENDING,
      submitterId: data.submitterId || 'current_user',
      submitterName: data.submitterName || '环保达人',
      reviewerId: '',
      reviewTime: '',
      rewardPoints: 0,
      createTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }

    this._corrections.unshift(correction)
    wx.setStorageSync('corrections', this._corrections)
    console.log('[Correction] 新增纠错:', correction.itemName, correction.reasonName)

    this.updateHotCorrectionWords(correction.itemName, correction.itemEmoji)

    return correction
  },

  approveCorrection(id, reviewerId) {
    const correction = this.getCorrectionById(id)
    if (!correction) return { success: false, message: '纠错不存在' }
    if (correction.status !== CORRECTION_STATUS.PENDING) {
      return { success: false, message: '该纠错已处理' }
    }

    correction.status = CORRECTION_STATUS.APPROVED
    correction.reviewerId = reviewerId || 'admin'
    correction.reviewTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    correction.rewardPoints = CORRECTION_POINTS_REWARD

    wx.setStorageSync('corrections', this._corrections)

    this.syncToEncyclopedia(correction)

    this.updateLeaderboard(correction.submitterId, correction.submitterName)

    console.log('[Correction] 纠错已采纳:', correction.itemName, '奖励', CORRECTION_POINTS_REWARD, '积分')

    return {
      success: true,
      correction,
      rewardPoints: CORRECTION_POINTS_REWARD
    }
  },

  rejectCorrection(id, reviewerId, rejectReason) {
    const correction = this.getCorrectionById(id)
    if (!correction) return { success: false, message: '纠错不存在' }
    if (correction.status !== CORRECTION_STATUS.PENDING) {
      return { success: false, message: '该纠错已处理' }
    }

    correction.status = CORRECTION_STATUS.REJECTED
    correction.reviewerId = reviewerId || 'admin'
    correction.reviewTime = formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    correction.rejectReason = rejectReason || ''

    wx.setStorageSync('corrections', this._corrections)
    console.log('[Correction] 纠错已驳回:', correction.itemName, '原因:', rejectReason)

    return { success: true, correction }
  },

  updateLeaderboard(submitterId, submitterName) {
    if (!this._leaderboard) this._leaderboard = []

    const approvedList = this.getCorrections({ status: CORRECTION_STATUS.APPROVED, submitterId })
    const approvedCount = approvedList.length
    const totalPoints = approvedCount * CORRECTION_POINTS_REWARD

    const existing = this._leaderboard.find(u => u.userId === submitterId)
    if (existing) {
      existing.approvedCount = approvedCount
      existing.totalPoints = totalPoints
    } else {
      this._leaderboard.push({
        userId: submitterId,
        nickName: submitterName,
        avatarEmoji: '🌱',
        approvedCount,
        totalPoints
      })
    }

    this._leaderboard.sort((a, b) => b.approvedCount - a.approvedCount)
    this._leaderboard.forEach((u, i) => {
      u.rank = i + 1
    })

    wx.setStorageSync('correctionLeaderboard', this._leaderboard)
  },

  getLeaderboard() {
    return [...(this._leaderboard || [])]
  },

  getUserContributorTier(submitterId) {
    const approvedList = this.getCorrections({ status: CORRECTION_STATUS.APPROVED, submitterId })
    const count = approvedList.length

    let tier = null
    for (const t of CONTRIBUTOR_TIERS) {
      if (count >= t.minCount) {
        tier = t
      }
    }
    return tier
  },

  getUserCorrectionStats(submitterId) {
    const all = this.getCorrections({ submitterId })
    const approved = all.filter(c => c.status === CORRECTION_STATUS.APPROVED)
    const pending = all.filter(c => c.status === CORRECTION_STATUS.PENDING)
    const rejected = all.filter(c => c.status === CORRECTION_STATUS.REJECTED)

    return {
      total: all.length,
      approved: approved.length,
      pending: pending.length,
      rejected: rejected.length,
      totalPoints: approved.length * CORRECTION_POINTS_REWARD,
      tier: this.getUserContributorTier(submitterId)
    }
  },

  updateHotCorrectionWords(itemName, itemEmoji) {
    if (!itemName) return
    let hotWords = wx.getStorageSync('hotCorrectionWords') || []
    const existing = hotWords.find(w => w.name === itemName)
    if (existing) {
      existing.count += 1
      existing.emoji = itemEmoji || existing.emoji
    } else {
      hotWords.push({ name: itemName, emoji: itemEmoji || '🗑️', count: 1 })
    }
    hotWords.sort((a, b) => b.count - a.count)
    hotWords = hotWords.slice(0, 20)
    wx.setStorageSync('hotCorrectionWords', hotWords)
  },

  getHotCorrectionWords() {
    return (wx.getStorageSync('hotCorrectionWords') || [])
      .filter(w => w.count >= HOT_CORRECTION_THRESHOLD)
  },

  syncToEncyclopedia(correction) {
    if (!correction || !correction.itemId) return
    if (!correction.correctTypeId || correction.correctTypeId === correction.originalTypeId) {
      if (correction.reason !== 'wrong_desc' && correction.reason !== 'wrong_tips') return
    }

    const overrides = wx.getStorageSync('encyclopediaOverrides') || {}
    const existing = overrides[correction.itemId] || {}

    const patch = { ...existing }

    if (correction.correctTypeId && correction.correctTypeId !== correction.originalTypeId) {
      patch.typeId = correction.correctTypeId
      patch.correctedFromTypeId = correction.originalTypeId
    }

    if (correction.description) {
      patch.description = correction.description
      patch.correctedReason = correction.reasonName
    }

    patch.correctedAt = correction.reviewTime
    patch.correctedBy = correction.submitterName

    overrides[correction.itemId] = patch
    wx.setStorageSync('encyclopediaOverrides', overrides)

    console.log('[Correction] 百科数据已同步:', correction.itemName, patch)
  },

  getEncyclopediaOverrides() {
    return wx.getStorageSync('encyclopediaOverrides') || {}
  },

  getMergedHotSearchWords(baseWords) {
    const correctionWords = this.getHotCorrectionWords()
    if (correctionWords.length === 0) return baseWords

    const merged = [...baseWords]
    correctionWords.forEach(cw => {
      const alreadyExists = merged.find(bw => bw.name === cw.name)
      if (!alreadyExists) {
        merged.push({ name: cw.name, emoji: cw.emoji, hot: true, fromCorrection: true })
      } else {
        alreadyExists.hot = true
      }
    })
    return merged
  }
}

module.exports = {
  correctionManager,
  CORRECTION_STATUS,
  CORRECTION_POINTS_REWARD,
  CONTRIBUTOR_TIERS,
  HOT_CORRECTION_THRESHOLD
}
