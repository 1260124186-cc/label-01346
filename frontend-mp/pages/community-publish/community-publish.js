const app = getApp()
const { COMMUNITY_POST_TYPES, COMMUNITY_TOPICS, COMMUNITY_POINTS_CONFIG } = require('../../utils/constants')
const { showToast, showSuccess, navigateBack } = require('../../utils/util')

Page({
  data: {
    postTypes: COMMUNITY_POST_TYPES,
    currentType: 'experience',
    topics: COMMUNITY_TOPICS,
    selectedTopics: [],
    content: '',
    images: [],
    maxImages: 9,
    contentMaxLength: 500,
    publishPoints: COMMUNITY_POINTS_CONFIG.publishPost
  },

  onTypeTap(e) {
    const { type } = e.currentTarget.dataset
    this.setData({ currentType: type })
  },

  onTopicTap(e) {
    const { topic } = e.currentTarget.dataset
    let selected = [...this.data.selectedTopics]
    const idx = selected.findIndex(t => t.id === topic.id)
    if (idx > -1) {
      selected.splice(idx, 1)
    } else {
      if (selected.length >= 3) {
        showToast('最多选择3个话题')
        return
      }
      selected.push(topic)
    }
    this.setData({ selectedTopics: selected })
  },

  onContentInput(e) {
    const value = e.detail.value
    if (value.length > this.data.contentMaxLength) {
      showToast(`最多${this.data.contentMaxLength}字`)
      return
    }
    this.setData({ content: value })
  },

  onChooseImage() {
    const remain = this.data.maxImages - this.data.images.length
    if (remain <= 0) {
      showToast('最多上传9张图片')
      return
    }

    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const newImages = res.tempFiles.map(f => f.tempFilePath)
        this.setData({
          images: [...this.data.images, ...newImages].slice(0, this.data.maxImages)
        })
      },
      fail: () => {
        showToast('选择图片失败')
      }
    })
  },

  onRemoveImage(e) {
    const { index } = e.currentTarget.dataset
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset
    wx.previewImage({
      current: this.data.images[index],
      urls: this.data.images
    })
  },

  validateContent() {
    const { content, images, currentType } = this.data
    
    if (currentType === 'photo') {
      if (images.length === 0) {
        showToast('请至少上传一张图片')
        return false
      }
    } else {
      if (content.trim().length < 5) {
        showToast('内容至少5个字')
        return false
      }
    }
    return true
  },

  onPublish() {
    if (!this.validateContent()) return

    const { content, images, currentType, selectedTopics } = this.data

    wx.showLoading({ title: '发布中...', mask: true })

    const result = app.addCommunityPost({
      type: currentType,
      content: content,
      images: images,
      topics: selectedTopics.map(t => t.id),
      topicNames: selectedTopics.map(t => t.name)
    })

    wx.hideLoading()

    if (result.points > 0) {
      showSuccess(`发布成功 +${result.points}积分`)
    } else {
      showSuccess('发布成功')
    }

    setTimeout(() => {
      navigateBack()
    }, 1000)
  }
})
