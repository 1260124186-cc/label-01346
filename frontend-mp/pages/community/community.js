const app = getApp()
const { COMMUNITY_POST_TYPES, COMMUNITY_TOPICS, COMMUNITY_POINTS_CONFIG } = require('../../utils/constants')
const { navigateTo, showToast } = require('../../utils/util')

Page({
  data: {
    postTypes: [{ id: 'all', name: '全部', icon: '📋', color: '#5BBD72' }, ...COMMUNITY_POST_TYPES, { id: 'official', name: '官方', icon: '🌿', color: '#E67E22' }],
    currentType: 'all',
    topics: COMMUNITY_TOPICS,
    currentTopic: '',
    posts: [],
    userPoints: 0
  },

  onLoad() {
    console.log('[Community] 页面加载')
    this.loadPosts()
  },

  onShow() {
    console.log('[Community] 页面显示')
    this.loadPosts()
    this.refreshUserInfo()
  },

  refreshUserInfo() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userPoints: userInfo.points || 0
      })
    }
  },

  loadPosts() {
    const { currentType, currentTopic } = this.data
    let filter = {}

    if (currentType === 'official') {
      filter.officialOnly = true
    } else if (currentType !== 'all') {
      filter.type = currentType
    }

    if (currentTopic) {
      filter.topic = currentTopic
    }

    const posts = app.getCommunityPosts(filter)
    this.setData({ posts })
    console.log('[Community] 加载帖子', posts.length, '条')
  },

  onTypeTap(e) {
    const { type } = e.currentTarget.dataset
    this.setData({ currentType: type, currentTopic: '' }, () => {
      this.loadPosts()
    })
  },

  onTopicTap(e) {
    const { topic } = e.currentTarget.dataset
    const newTopic = this.data.currentTopic === topic ? '' : topic
    this.setData({ currentTopic: newTopic }, () => {
      this.loadPosts()
    })
  },

  onPostTap(e) {
    const { id } = e.currentTarget.dataset
    navigateTo('/pages/community-detail/community-detail', { id })
  },

  onLikeTap(e) {
    const { id } = e.currentTarget.dataset
    const result = app.toggleLikePost(id)

    if (result.success) {
      if (result.points > 0) {
        showToast(`点赞成功 +${result.points}积分`)
      }
      this.loadPosts()
      this.refreshUserInfo()
    }
  },

  onShareTap(e) {
    const { id } = e.currentTarget.dataset
    const post = app.getCommunityPostById(id)
    if (!post) return

    this.setData({ sharePostId: id })
  },

  onPublishTap() {
    navigateTo('/pages/community-publish/community-publish')
  },

  onPullDownRefresh() {
    console.log('[Community] 下拉刷新')
    this.loadPosts()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 800)
  },

  onShareAppMessage() {
    const postId = this.data.sharePostId
    if (postId) {
      const post = app.getCommunityPostById(postId)
      const result = app.sharePost(postId)
      if (result.points > 0) {
        showToast(`分享成功 +${result.points}积分`)
      }
      this.loadPosts()
      this.refreshUserInfo()

      return {
        title: post ? (post.title || post.content.slice(0, 30)) : '环保社区 - 分享环保生活',
        path: `/pages/community-detail/community-detail?id=${postId}`
      }
    }

    return {
      title: '环保社区 - 一起分享环保生活',
      path: '/pages/community/community'
    }
  }
})
