const app = getApp()
const { COMMUNITY_POST_TYPES, COMMUNITY_TOPICS, COMMUNITY_POINTS_CONFIG, getKnowledgeCardsByTopic, TOPIC_KNOWLEDGE_CARDS } = require('../../utils/constants')
const { showToast, showSuccess, navigateBack } = require('../../utils/util')

Page({
  data: {
    postTypes: COMMUNITY_POST_TYPES,
    currentType: 'experience',
    topics: COMMUNITY_TOPICS,
    topicsWithSelected: [],
    selectedTopics: [],
    content: '',
    images: [],
    maxImages: 9,
    contentMaxLength: 500,
    publishPoints: COMMUNITY_POINTS_CONFIG.publishPost,
    availableKnowledgeCards: [],
    selectedKnowledgeCards: [],
    showKnowledgePicker: false,
    currentCreatorLevel: null
  },

  onLoad() {
    this.refreshTopicsWithSelected()
    this.loadCreatorLevel()
  },

  loadCreatorLevel() {
    const level = app.getCurrentUserCreatorLevel()
    this.setData({
      currentCreatorLevel: level,
      publishPoints: Math.floor(COMMUNITY_POINTS_CONFIG.publishPost * level.pointsMultiplier)
    })
  },

  refreshTopicsWithSelected() {
    const { topics, selectedTopics } = this.data
    const selectedIds = selectedTopics.map(t => t.id)
    const topicsWithSelected = topics.map(t => ({
      ...t,
      isSelected: selectedIds.indexOf(t.id) > -1
    }))
    this.setData({ topicsWithSelected })
    this.refreshAvailableKnowledgeCards()
  },

  refreshAvailableKnowledgeCards() {
    const { selectedTopics } = this.data
    const selectedCardIds = this.data.selectedKnowledgeCards.map(c => c.id)
    let cards = []
    selectedTopics.forEach(topic => {
      const topicCards = getKnowledgeCardsByTopic(topic.id)
      topicCards.forEach(card => {
        if (!cards.find(c => c.id === card.id)) {
          cards.push({
            ...card,
            isSelected: selectedCardIds.indexOf(card.id) > -1
          })
        }
      })
    })
    if (cards.length === 0) {
      cards = TOPIC_KNOWLEDGE_CARDS.map(card => ({
        ...card,
        isSelected: selectedCardIds.indexOf(card.id) > -1
      }))
    }
    this.setData({ availableKnowledgeCards: cards })
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
    this.setData({ selectedTopics: selected }, () => {
      this.refreshTopicsWithSelected()
    })
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

  onInsertKnowledgeCard() {
    this.refreshAvailableKnowledgeCards()
    this.setData({ showKnowledgePicker: true })
  },

  onCloseKnowledgePicker() {
    this.setData({ showKnowledgePicker: false })
  },

  onKnowledgeCardTap(e) {
    const { card } = e.currentTarget.dataset
    let selected = [...this.data.selectedKnowledgeCards]
    const idx = selected.findIndex(c => c.id === card.id)
    if (idx > -1) {
      selected.splice(idx, 1)
    } else {
      if (selected.length >= 3) {
        showToast('最多插入3张知识卡片')
        return
      }
      selected.push(card)
    }
    this.setData({ selectedKnowledgeCards: selected }, () => {
      this.refreshAvailableKnowledgeCards()
    })
  },

  onRemoveKnowledgeCard(e) {
    const { cardId } = e.currentTarget.dataset
    const selected = this.data.selectedKnowledgeCards.filter(c => c.id !== cardId)
    this.setData({ selectedKnowledgeCards: selected }, () => {
      this.refreshAvailableKnowledgeCards()
    })
  },

  onKnowledgeCardLinkTap(e) {
    const { card } = e.currentTarget.dataset
    showToast(`跳转到${card.type === 'course' ? '课程' : '百科'}：${card.title}`)
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

    const { content, images, currentType, selectedTopics, selectedKnowledgeCards } = this.data

    wx.showLoading({ title: '发布中...', mask: true })

    const result = app.addCommunityPost({
      type: currentType,
      content: content,
      images: images,
      topics: selectedTopics.map(t => t.id),
      topicNames: selectedTopics.map(t => t.name),
      knowledgeCards: selectedKnowledgeCards
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
