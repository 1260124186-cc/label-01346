const app = getApp()
const { correctionManager, CONTRIBUTOR_TIERS } = require('../../utils/correction')
const { navigateTo } = require('../../utils/util')

Page({
  data: {
    leaderboard: [],
    myStats: null,
    myTier: null,
    contributorTiers: CONTRIBUTOR_TIERS
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    if (app.globalData.leaderboardNeedsRefresh) {
      app.globalData.leaderboardNeedsRefresh = false
    }
    this.loadData()
  },

  loadData() {
    const leaderboard = correctionManager.getLeaderboard()
    const myStats = correctionManager.getUserCorrectionStats('current_user')
    const myTier = correctionManager.getUserContributorTier('current_user')

    this.setData({ leaderboard, myStats, myTier })
  },

  goToMyCorrections() {
    navigateTo('/pages/correction-review/correction-review')
  }
})
