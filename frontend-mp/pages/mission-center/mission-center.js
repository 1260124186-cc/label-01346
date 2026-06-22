const app = getApp()
const { showToast, showSuccess, navigateTo, formatDate } = require('../../utils/util')
const { DAILY_TREASURE_BOX } = require('../../utils/constants')

Page({
  data: {
    childModeEnabled: false,
    activeTab: 'daily',
    userPoints: 0,
    fullCompleteStreak: 0,
    dailyMissions: [],
    weeklyMissions: [],
    missionAchievements: [],
    dailySummary: {
      completed: 0,
      total: 0,
      progressPercent: 0,
      canClaimCount: 0,
      allCompleted: false
    },
    treasureAvailable: false,
    treasureClaimed: false,
    showTreasureModal: false,
    treasureResult: null,
    showClaimModal: false,
    claimResult: null,
    showAchievementModal: false,
    newAchievements: [],
    weekRange: '',
    experienceClasses: '',
    DAILY_TREASURE_BOX: DAILY_TREASURE_BOX
  },

  onLoad() {
    console.log('[MissionCenter] 页面加载')
    this.initWeekRange()
    this.refreshAllData()
  },

  onShow() {
    console.log('[MissionCenter] 页面显示')
    this.refreshAllData()
    this.setData({ experienceClasses: app.getExperienceClasses ? app.getExperienceClasses() : '' })
  },

  onPullDownRefresh() {
    console.log('[MissionCenter] 下拉刷新')
    this.refreshAllData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  },

  initWeekRange() {
    const weekInfo = app.getWeekRange ? app.getWeekRange(1) : null
    if (weekInfo) {
      const startParts = weekInfo.weekStart.split('-')
      const endParts = weekInfo.weekEnd.split('-')
      this.setData({
        weekRange: `${startParts[1]}月${startParts[2]}日 - ${endParts[1]}月${endParts[2]}日`
      })
    }
  },

  refreshAllData() {
    const childMode = app.isChildModeEnabled ? app.isChildModeEnabled() : false
    const userInfo = app.globalData.userInfo
    const dailyMissions = app.getVisibleDailyMissions(childMode)
    const weeklyMissions = app.getVisibleWeeklyMissions(childMode)
    const dailySummary = app.getDailyMissionsSummary()
    const treasureAvailable = app.isDailyTreasureAvailable()
    const treasureClaimed = app.isDailyTreasureClaimed()
    const streak = app.getFullCompleteStreak ? app.getFullCompleteStreak() : 0
    const achievements = app.getMissionAchievements ? app.getMissionAchievements() : []

    this.setData({
      childModeEnabled: childMode,
      userPoints: userInfo ? userInfo.points || 0 : 0,
      fullCompleteStreak: streak,
      dailyMissions,
      weeklyMissions,
      dailySummary,
      treasureAvailable,
      treasureClaimed,
      missionAchievements: achievements,
      experienceClasses: app.getExperienceClasses ? app.getExperienceClasses() : ''
    })
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset
    if (tab !== this.data.activeTab) {
      this.setData({ activeTab: tab })
    }
  },

  onMissionTap(e) {
    const { item } = e.currentTarget.dataset
    if (!item) return

    if (item.canClaim) {
      this.claimMission(item)
      return
    }

    if (item.isClaimed) {
      showToast('奖励已领取')
      return
    }

    if (item.displayLink) {
      navigateTo(item.displayLink)
    } else if (item.id === 'daily_share') {
      wx.showToast({ title: '点击右上角分享即可', icon: 'none' })
    }
  },

  claimMission(mission) {
    const isWeekly = this.data.activeTab === 'weekly'
    const result = app.claimMissionReward(mission.id, isWeekly)

    if (result.success) {
      this.setData({
        showClaimModal: true,
        claimResult: result
      })
      showSuccess(`+${result.points}积分`)
      this.refreshAllData()
    } else if (result.alreadyClaimed) {
      showToast('奖励已领取')
    } else {
      showToast(result.message || '领取失败')
    }
  },

  onClaimAllTap() {
    const result = app.claimAllAvailableMissions()
    if (result.totalPoints > 0) {
      let text = `已领取${result.dailyCount + result.weeklyCount}个任务，共+${result.totalPoints}积分`
      showSuccess(text)
      this.refreshAllData()
    } else {
      showToast('暂无可领取的奖励')
    }
  },

  onTreasureTap() {
    if (!this.data.treasureAvailable) {
      if (this.data.treasureClaimed) {
        showToast('今日宝箱已领取')
      } else {
        showToast('完成全部每日任务即可开启')
      }
      return
    }

    const result = app.claimDailyTreasure()
    if (result.success) {
      this.setData({
        showTreasureModal: true,
        treasureResult: result
      })

      if (result.newlyUnlockedAchievements && result.newlyUnlockedAchievements.length > 0) {
        setTimeout(() => {
          this.setData({
            showAchievementModal: true,
            newAchievements: result.newlyUnlockedAchievements
          })
        }, 1500)
      }

      showSuccess(`+${result.points}积分`)
      this.refreshAllData()
    } else if (result.alreadyClaimed) {
      showToast('今日宝箱已领取')
    } else {
      showToast(result.message || '领取失败')
    }
  },

  onCloseTreasureModal() {
    this.setData({ showTreasureModal: false, treasureResult: null })
  },

  onCloseClaimModal() {
    this.setData({ showClaimModal: false, claimResult: null })
  },

  onCloseAchievementModal() {
    this.setData({ showAchievementModal: false, newAchievements: [] })
  },

  onShareAppMessage() {
    const result = app.handleShareSuccess ? app.handleShareSuccess() : null
    if (result && result.success && result.points > 0) {
      setTimeout(() => {
        showSuccess(`分享成功 +${result.points}积分`)
        this.refreshAllData()
      }, 500)
    } else if (result && result.reason === 'daily_limit') {
      setTimeout(() => showToast('今日分享积分已达上限'), 500)
    }
    this.refreshAllData()
    return {
      title: '一起来完成环保任务，赢取丰厚奖励吧！',
      path: `/pages/mission-center/mission-center?inviterId=${app.getUserId()}`
    }
  }
})
