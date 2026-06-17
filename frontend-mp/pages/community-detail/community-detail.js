const app = getApp()
const { COMMUNITY_REPORT_REASONS } = require('../../utils/constants')
const { showToast, showSuccess, showModal } = require('../../utils/util')

Page({
  data: {
    postId: '',
    post: null,
    comments: [],
    commentContent: '',
    showReport: false,
    reportReasons: COMMUNITY_REPORT_REASONS,
    selectedReasonId: '',
    reportDescription: '',
    userPoints: 0,
    isReviewing: false
  },

  onLoad(options) {
    const { id } = options
    if (!id) {
      showToast('参数错误')
      wx.navigateBack()
      return
    }
    this.setData({ postId: id })
    this.loadPost()
    this.loadComments()
    this.refreshUserInfo()
  },

  onShow() {
    this.loadPost()
    this.loadComments()
    this.refreshUserInfo()
  },

  refreshUserInfo() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({ userPoints: userInfo.points || 0 })
    }
  },

  loadPost() {
    const post = app.getCommunityPostById(this.data.postId)
    if (!post) {
      showToast('内容不存在或已删除')
      return
    }
    this.setData({
      post,
      isReviewing: post.status === 'reviewing'
    })
  },

  loadComments() {
    const comments = app.getCommentsByPostId(this.data.postId)
    this.setData({ comments })
  },

  onLikeTap() {
    const result = app.toggleLikePost(this.data.postId)
    if (result.success) {
      if (result.points > 0) {
        showToast(`点赞成功 +${result.points}积分`)
      }
      this.loadPost()
      this.refreshUserInfo()
    }
  },

  onCommentLikeTap(e) {
    const { id } = e.currentTarget.dataset
    const result = app.toggleLikeComment(this.data.postId, id)
    if (result.success) {
      this.loadComments()
    }
  },

  onCommentInput(e) {
    this.setData({ commentContent: e.detail.value })
  },

  onSubmitComment() {
    const content = this.data.commentContent.trim()
    if (!content) {
      showToast('请输入评论内容')
      return
    }
    if (content.length > 200) {
      showToast('评论最多200字')
      return
    }

    const result = app.addComment(this.data.postId, content)
    if (result.success) {
      if (result.points > 0) {
        showSuccess(`评论成功 +${result.points}积分`)
      } else {
        showSuccess('评论成功')
      }
      this.setData({ commentContent: '' })
      this.loadComments()
      this.loadPost()
      this.refreshUserInfo()
    }
  },

  onShareTap() {
  },

  onReportTap() {
    this.setData({
      showReport: true,
      selectedReasonId: '',
      reportDescription: ''
    })
  },

  onReportClose() {
    this.setData({ showReport: false })
  },

  onReportReasonTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ selectedReasonId: id })
  },

  onReportDescInput(e) {
    this.setData({ reportDescription: e.detail.value })
  },

  async onReportSubmit() {
    const { selectedReasonId, reportDescription, postId, reportReasons } = this.data
    if (!selectedReasonId) {
      showToast('请选择举报理由')
      return
    }

    const reason = reportReasons.find(r => r.id === selectedReasonId)
    const confirmed = await showModal({
      title: '确认举报',
      content: `您确定要举报该内容吗？\n理由：${reason.name}`,
      confirmText: '确认举报'
    })

    if (!confirmed) return

    app.addReport({
      targetId: postId,
      targetType: 'post',
      reasonId: selectedReasonId,
      reasonName: reason.name,
      description: reportDescription
    })

    showSuccess('举报已提交，感谢您的反馈')
    this.setData({ showReport: false })
    this.loadPost()
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset
    const urls = this.data.post.images || []
    if (urls.length > 0) {
      wx.previewImage({
        current: urls[index],
        urls
      })
    }
  },

  onMoreTap() {
    wx.showActionSheet({
      itemList: ['举报该内容', '复制内容'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.onReportTap()
        } else if (res.tapIndex === 1 && this.data.post) {
          wx.setClipboardData({
            data: this.data.post.content,
            success: () => showSuccess('内容已复制')
          })
        }
      }
    })
  },

  onShareAppMessage() {
    const post = this.data.post
    if (post) {
      const result = app.sharePost(this.data.postId)
      if (result.points > 0) {
        showToast(`分享成功 +${result.points}积分`)
      }
      this.loadPost()
      this.refreshUserInfo()

      return {
        title: post.title || post.content.slice(0, 40),
        path: `/pages/community-detail/community-detail?id=${this.data.postId}`
      }
    }
    return {
      title: '环保社区 - 分享环保生活',
      path: '/pages/community/community'
    }
  }
})
