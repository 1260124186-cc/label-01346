const app = getApp()
const { correctionManager, CORRECTION_STATUS, CORRECTION_POINTS_REWARD } = require('../../utils/correction')
const { showToast, showModal, navigateTo } = require('../../utils/util')

Page({
  data: {
    currentTab: 'pending',
    pendingCount: 0,
    filteredList: [],
    pointsReward: CORRECTION_POINTS_REWARD,
    showRejectModal: false,
    rejectingId: '',
    rejectReasons: [
      { id: 'duplicate', text: '已有相同纠错被采纳' },
      { id: 'incorrect', text: '纠错内容不正确' },
      { id: 'insufficient', text: '说明不充分，无法判断' },
      { id: 'spam', text: '恶意提交/无关内容' }
    ],
    selectedRejectReason: '',
    rejectCustomReason: ''
  },

  onLoad() {
    this.loadCorrections()
  },

  onShow() {
    this.loadCorrections()
  },

  loadCorrections() {
    const pending = correctionManager.getPendingCorrections()
    const approved = correctionManager.getApprovedCorrections()
    const rejected = correctionManager.getCorrections({ status: CORRECTION_STATUS.REJECTED })

    this.setData({ pendingCount: pending.length })

    const { currentTab } = this.data
    let filteredList = []
    if (currentTab === 'pending') filteredList = pending
    else if (currentTab === 'approved') filteredList = approved
    else filteredList = rejected

    this.setData({ filteredList })
  },

  onTabTap(e) {
    const { tab } = e.currentTarget.dataset
    this.setData({ currentTab: tab })
    this.loadCorrections()
  },

  onApprove(e) {
    const { id } = e.currentTarget.dataset
    showModal({
      title: '确认采纳',
      content: `采纳后提交人将获得${CORRECTION_POINTS_REWARD}积分奖励，百科数据将同步更新。确认采纳？`,
      confirmText: '确认采纳',
      confirmColor: '#5BBD72'
    }).then(confirmed => {
      if (!confirmed) return

      const result = correctionManager.approveCorrection(id, 'admin')
      if (result.success) {
        if (result.rewardPoints > 0) {
          app.updateUserPoints(result.rewardPoints, {
            category: 'correction',
            title: '纠错采纳奖励',
            desc: `纠错"${result.correction.itemName}"被采纳`,
            emoji: '✅'
          })
        }
        showToast('已采纳，积分已发放', 'success')
        this.loadCorrections()
      } else {
        showToast(result.message, 'none')
      }
    })
  },

  onReject(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      showRejectModal: true,
      rejectingId: id,
      selectedRejectReason: '',
      rejectCustomReason: ''
    })
  },

  onSelectRejectReason(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ selectedRejectReason: id })
  },

  onRejectReasonInput(e) {
    this.setData({ rejectCustomReason: e.detail.value })
  },

  onCloseRejectModal() {
    this.setData({ showRejectModal: false, rejectingId: '' })
  },

  onConfirmReject() {
    const { rejectingId, selectedRejectReason, rejectCustomReason, rejectReasons } = this.data
    const reasonObj = rejectReasons.find(r => r.id === selectedRejectReason)
    const reason = [reasonObj ? reasonObj.text : '', rejectCustomReason].filter(Boolean).join('；')

    if (!reason) {
      showToast('请选择或填写驳回原因', 'none')
      return
    }

    const result = correctionManager.rejectCorrection(rejectingId, 'admin', reason)
    if (result.success) {
      showToast('已驳回', 'success')
      this.setData({ showRejectModal: false })
      this.loadCorrections()
    }
  },

  onPreviewImage(e) {
    const { url, urls } = e.currentTarget.dataset
    wx.previewImage({
      current: url,
      urls: urls
    })
  }
})
