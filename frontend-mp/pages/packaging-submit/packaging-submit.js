const app = getApp()
const {
  PACKAGING_CATEGORIES
} = require('../../data/packaging')
const {
  TRASH_TYPES
} = require('../../utils/constants')
const {
  navigateBack,
  showToast,
  showSuccess,
  showModal,
  getStorage,
  setStorage,
  formatDate,
  generateId
} = require('../../utils/util')

function createEmptyComponent() {
  return {
    id: generateId(),
    name: '',
    typeId: 0,
    typeName: '',
    instruction: '',
    isRequired: true
  }
}

Page({
  data: {
    categories: PACKAGING_CATEGORIES,
    trashTypes: TRASH_TYPES,
    formData: {
      name: '',
      description: '',
      category: '',
      components: [createEmptyComponent(), createEmptyComponent()],
      remark: ''
    },
    reviewQueue: []
  },

  onLoad() {
    console.log('[PackagingSubmit] 页面加载')
    this.loadReviewQueue()
    this.loadDraft()
  },

  loadReviewQueue() {
    const queue = getStorage('packagingReviewQueue', [])
    this.setData({ reviewQueue: queue })
  },

  loadDraft() {
    const draft = getStorage('packagingSubmitDraft', null)
    if (draft) {
      this.setData({ formData: draft })
    }
  },

  onInputName(e) {
    this.setData({ 'formData.name': e.detail.value })
  },

  onInputDescription(e) {
    this.setData({ 'formData.description': e.detail.value })
  },

  onSelectCategory(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ 'formData.category': id })
  },

  onCompInputName(e) {
    const { index } = e.currentTarget.dataset
    this.setData({ [`formData.components[${index}].name`]: e.detail.value })
  },

  onCompSelectType(e) {
    const { compIndex, typeId } = e.currentTarget.dataset
    const tid = parseInt(typeId)
    const type = TRASH_TYPES.find(t => t.id === tid)
    if (type) {
      this.setData({
        [`formData.components[${compIndex}].typeId`]: tid,
        [`formData.components[${compIndex}].typeName`]: type.name
      })
    }
  },

  onCompInputInstruction(e) {
    const { index } = e.currentTarget.dataset
    this.setData({ [`formData.components[${index}].instruction`]: e.detail.value })
  },

  onCompToggleRequired(e) {
    const { index } = e.currentTarget.dataset
    const current = this.data.formData.components[index].isRequired
    this.setData({ [`formData.components[${index}].isRequired`]: !current })
  },

  onAddComponent() {
    const components = this.data.formData.components
    if (components.length >= 8) {
      showToast('最多添加8个部件')
      return
    }
    components.push(createEmptyComponent())
    this.setData({ 'formData.components': components })
  },

  onRemoveComponent(e) {
    const { index } = e.currentTarget.dataset
    const components = this.data.formData.components
    if (components.length <= 2) {
      showToast('至少保留2个部件')
      return
    }
    components.splice(index, 1)
    this.setData({ 'formData.components': components })
  },

  onInputRemark(e) {
    this.setData({ 'formData.remark': e.detail.value })
  },

  validateForm() {
    const { name, description, category, components } = this.data.formData

    if (!name.trim()) {
      showToast('请输入包装名称')
      return false
    }
    if (!description.trim()) {
      showToast('请输入包装描述')
      return false
    }
    if (!category) {
      showToast('请选择包装类别')
      return false
    }
    if (components.length < 2) {
      showToast('至少添加2个部件')
      return false
    }

    for (let i = 0; i < components.length; i++) {
      const comp = components[i]
      if (!comp.name.trim()) {
        showToast('请输入第' + (i + 1) + '个部件名称')
        return false
      }
      if (!comp.typeId) {
        showToast('请选择第' + (i + 1) + '个部件的分类')
        return false
      }
      if (!comp.instruction.trim()) {
        showToast('请填写第' + (i + 1) + '个部件的拆分说明')
        return false
      }
    }

    return true
  },

  onSaveDraft() {
    setStorage('packagingSubmitDraft', this.data.formData)
    showSuccess('草稿已保存')
  },

  onSubmit() {
    if (!this.validateForm()) return

    showModal({
      title: '确认提交',
      content: '提交后将进入审核队列，审核通过后可获积分奖励。确认提交？',
      confirmText: '确认提交',
      confirmColor: '#5BBD72'
    }).then(confirmed => {
      if (confirmed) {
        this.doSubmit()
      }
    })
  },

  doSubmit() {
    const { formData } = this.data
    const submission = {
      id: generateId(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      components: formData.components.map(c => ({
        id: generateId(),
        name: c.name.trim(),
        typeId: c.typeId,
        typeName: c.typeName,
        instruction: c.instruction.trim(),
        isRequired: c.isRequired
      })),
      remark: formData.remark.trim(),
      status: 'pending',
      statusText: '审核中',
      submitTime: formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }

    const queue = getStorage('packagingReviewQueue', [])
    queue.unshift(submission)
    setStorage('packagingReviewQueue', queue)

    setStorage('packagingSubmitDraft', null)

    this.setData({
      formData: {
        name: '',
        description: '',
        category: '',
        components: [createEmptyComponent(), createEmptyComponent()],
        remark: ''
      },
      reviewQueue: queue
    })

    app.updateUserPoints(5, {
      category: 'classify',
      title: '提交包装建议',
      desc: '提交组合包装拆解建议',
      emoji: '✍️'
    })

    showSuccess('提交成功！+5积分')

    setTimeout(() => {
      navigateBack()
    }, 1500)
  }
})
