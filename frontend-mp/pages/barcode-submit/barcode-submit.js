/**
 * 未知条码录入页面
 * @description 引导用户拍照和手动录入未知条码的商品信息
 */

const app = getApp()
const {
  navigateTo,
  navigateBack,
  showToast,
  showSuccess,
  showModal,
  formatDate,
  generateId
} = require('../../utils/util')
const {
  BARCODE_CATEGORIES,
  addUserContributedBarcode,
  addScanHistory
} = require('../../data/barcode')
const {
  getAllCompositePackaging
} = require('../../data/packaging')

const COMMON_MATERIALS = ['纸', '塑料', '金属', '玻璃', '铝箔', '织物', '橡胶', '复合材料']

Page({
  data: {
    barcode: '',
    barcodeType: '',
    productImage: '',
    materialInput: '',
    categories: BARCODE_CATEGORIES,
    commonMaterials: COMMON_MATERIALS,
    allPackaging: [],
    selectedPackaging: null,
    canSubmit: false,
    experienceClasses: '',
    formData: {
      productName: '',
      brand: '',
      category: '',
      materials: [],
      description: ''
    }
  },

  onLoad(options) {
    console.log('[BarcodeSubmit] 页面加载', options)
    this.setData({ experienceClasses: app.getExperienceClasses() })

    if (options) {
      this.setData({
        barcode: options.barcode || '',
        barcodeType: options.barcodeType || 'barCode'
      })
    }

    this.setData({
      allPackaging: getAllCompositePackaging()
    })
  },

  onShow() {
    console.log('[BarcodeSubmit] 页面显示')
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  checkCanSubmit() {
    const { formData } = this.data
    const canSubmit = !!(formData.productName && formData.productName.trim())
    this.setData({ canSubmit })
  },

  onChooseImage() {
    console.log('[BarcodeSubmit] 选择图片')
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        if (res.tempFiles && res.tempFiles.length > 0) {
          this.setData({
            productImage: res.tempFiles[0].tempFilePath
          })
        }
      },
      fail: (err) => {
        console.error('[BarcodeSubmit] 选择图片失败', err)
      }
    })
  },

  onRemoveImage() {
    this.setData({ productImage: '' })
  },

  onInputProductName(e) {
    const value = e.detail.value
    this.setData({
      'formData.productName': value
    })
    this.checkCanSubmit()
  },

  onInputBrand(e) {
    this.setData({
      'formData.brand': e.detail.value
    })
  },

  onSelectCategory(e) {
    const { category } = e.currentTarget.dataset
    this.setData({
      'formData.category': category.id
    })
  },

  onMaterialInput(e) {
    this.setData({
      materialInput: e.detail.value
    })
  },

  onAddMaterial() {
    const { materialInput, formData } = this.data
    const material = materialInput.trim()
    
    if (!material) {
      showToast('请输入材质名称')
      return
    }

    if (formData.materials.includes(material)) {
      showToast('该材质已添加')
      return
    }

    if (formData.materials.length >= 10) {
      showToast('最多添加10个材质')
      return
    }

    this.setData({
      'formData.materials': [...formData.materials, material],
      materialInput: ''
    })
  },

  onQuickAddMaterial(e) {
    const { material } = e.currentTarget.dataset
    const { formData } = this.data
    
    if (formData.materials.includes(material)) {
      this.onRemoveMaterial({ currentTarget: { dataset: { material } } })
      return
    }

    if (formData.materials.length >= 10) {
      showToast('最多添加10个材质')
      return
    }

    this.setData({
      'formData.materials': [...formData.materials, material]
    })
  },

  onRemoveMaterial(e) {
    const { material } = e.currentTarget.dataset
    const { formData } = this.data
    this.setData({
      'formData.materials': formData.materials.filter(m => m !== material)
    })
  },

  onSelectPackaging() {
    console.log('[BarcodeSubmit] 选择组合包装')
    const { allPackaging } = this.data

    wx.showActionSheet({
      itemList: allPackaging.map(p => `${p.emoji} ${p.name}`),
      itemColor: '#2D3436',
      success: (res) => {
        const selected = allPackaging[res.tapIndex]
        this.setData({
          selectedPackaging: selected,
          'formData.packagingId': selected.id
        })
      }
    })
  },

  onInputDescription(e) {
    this.setData({
      'formData.description': e.detail.value
    })
  },

  onSubmit() {
    console.log('[BarcodeSubmit] 提交表单')
    const { canSubmit, barcode, barcodeType, formData, selectedPackaging, productImage } = this.data

    if (!canSubmit) {
      showToast('请填写商品名称')
      return
    }

    if (!barcode) {
      showToast('条码信息丢失，请重新扫码')
      return
    }

    wx.showLoading({
      title: '提交中...',
      mask: true
    })

    setTimeout(() => {
      const newEntry = {
        barcode: barcode,
        barcodeType: barcodeType,
        productName: formData.productName.trim(),
        brand: formData.brand ? formData.brand.trim() : '',
        emoji: this.getEmojiForCategory(formData.category),
        category: formData.category || 'other',
        materials: formData.materials,
        packagingId: selectedPackaging ? selectedPackaging.id : '',
        description: formData.description ? formData.description.trim() : '',
        image: productImage
      }

      const savedEntry = addUserContributedBarcode(newEntry)

      addScanHistory({
        barcode: barcode,
        barcodeType: barcodeType,
        productName: newEntry.productName,
        brand: newEntry.brand,
        emoji: newEntry.emoji,
        packagingId: newEntry.packagingId,
        materials: newEntry.materials,
        description: newEntry.description
      })

      wx.hideLoading()

      if (savedEntry) {
        showSuccess('提交成功，感谢贡献！')
        setTimeout(() => {
          const resultData = encodeURIComponent(JSON.stringify({
            barcode: barcode,
            isNew: true
          }))
          wx.redirectTo({
            url: '/pages/barcode-result/barcode-result?barcode=' + barcode
          })
        }, 1500)
      } else {
        showToast('提交失败，请重试')
      }
    }, 800)
  },

  getEmojiForCategory(categoryId) {
    const category = BARCODE_CATEGORIES.find(c => c.id === categoryId)
    return category ? category.emoji : '📦'
  },

  onThemeChange(isDark) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onFontChange(isLarge) {
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onShareAppMessage() {
    return {
      title: '扫码识物百科 - 共同完善垃圾分类数据库',
      path: '/pages/barcode-scan/barcode-scan'
    }
  }
})
