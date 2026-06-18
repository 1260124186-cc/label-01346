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
    reportTargetType: 'post',
    reportTargetId: '',
    userPoints: 0,
    isReviewing: false,
    isPostOwner: false,
    replyingTo: null,
    commentPlaceholder: '友善评论，共同维护良好氛围...',
    currentUserId: ''
  },

  onLoad(options) {
    const { id } = options
    if (!id) {
      showToast('参数错误')
      wx.navigateBack()
      return
    }
    const userId = app.globalData.userInfo && app.globalData.userInfo.id
    this.setData({ postId: id, currentUserId: userId || '' })
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
      this.setData({
        userPoints: userInfo.points || 0,
        currentUserId: userInfo.id
      })
    }
  },

  loadPost() {
    const post = app.getCommunityPostById(this.data.postId)
    if (!post) {
      showToast('内容不存在或已删除')
      return
    }
    const userId = this.data.currentUserId || (app.globalData.userInfo && app.globalData.userInfo.id)
    const isPostOwner = userId && post.userId === userId
    this.setData({
      post,
      isReviewing: post.status === 'reviewing',
      isPostOwner: !!isPostOwner
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

  onReplyTap(e) {
    const { comment } = e.currentTarget.dataset
    this.setData({
      replyingTo: comment,
      commentPlaceholder: `回复 @${comment.userNickName}：`,
      commentContent: `@${comment.userNickName} `
    })
  },

  onReplyCancel() {
    this.setData({
      replyingTo: null,
      commentPlaceholder: '友善评论，共同维护良好氛围...',
      commentContent: ''
    })
  },

  onMentionUser(e) {
    const { nickname } = e.currentTarget.dataset
    const content = this.data.commentContent
    this.setData({
      commentContent: content + `@${nickname} `
    })
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

    const options = {}
    if (this.data.replyingTo) {
      options.replyTo = {
        commentId: this.data.replyingTo.id,
        userId: this.data.replyingTo.userId,
        userNickName: this.data.replyingTo.userNickName
      }
    }

    const result = app.addComment(this.data.postId, content, options)
    if (result.success) {
      if (result.points > 0) {
        showSuccess(`评论成功 +${result.points}积分`)
      } else {
        showSuccess('评论成功')
      }
      this.setData({
        commentContent: '',
        replyingTo: null,
        commentPlaceholder: '友善评论，共同维护良好氛围...'
      })
      this.loadComments()
      this.loadPost()
      this.refreshUserInfo()
    }
  },

  onPinComment(e) {
    const { id } = e.currentTarget.dataset
    const result = app.pinComment(this.data.postId, id)
    if (result.success) {
      if (result.points > 0) {
        showSuccess(`置顶成功，被置顶用户 +${result.points}积分`)
      } else {
        showSuccess('置顶成功')
      }
      this.loadComments()
    }
  },

  onCommentReportTap(e) {
    const { id } = e.currentTarget.dataset
    this.setData({
      showReport: true,
      reportTargetType: 'comment',
      reportTargetId: id,
      selectedReasonId: '',
      reportDescription: ''
    })
  },

  onShareTap() {
  },

  onReportTap() {
    this.setData({
      showReport: true,
      reportTargetType: 'post',
      reportTargetId: this.data.postId,
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
    const { selectedReasonId, reportDescription, reportTargetType, reportTargetId, reportReasons } = this.data
    if (!selectedReasonId) {
      showToast('请选择举报理由')
      return
    }

    const reason = reportReasons.find(r => r.id === selectedReasonId)
    const confirmed = await showModal({
      title: '确认举报',
      content: `您确定要举报该${reportTargetType === 'post' ? '帖子' : '评论'}吗？\n理由：${reason.name}`,
      confirmText: '确认举报'
    })

    if (!confirmed) return

    app.addReport({
      targetId: reportTargetId,
      targetType: reportTargetType,
      reasonId: selectedReasonId,
      reasonName: reason.name,
      description: reportDescription
    })

    showSuccess('举报已提交，感谢您的反馈')
    this.setData({ showReport: false })
    if (reportTargetType === 'post') {
      this.loadPost()
    } else {
      this.loadComments()
    }
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

  onKnowledgeCardTap(e) {
    const { card } = e.currentTarget.dataset
    showToast(`跳转到${card.type === 'course' ? '课程' : '百科'}：${card.title}`)
  },

  onMoreTap() {
    const items = ['举报该内容', '复制内容']
    wx.showActionSheet({
      itemList: items,
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
