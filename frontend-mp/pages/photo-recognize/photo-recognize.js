/**
 * 拍照识别页面
 * @description 相机预览、拍照、识别中动画、跳转到结果页
 */
const { navigateTo, showToast, showError, navigateBack } = require('../../utils/util')
const { mockRecognize, mockRecognizeFail } = require('../../data/recognize')

let cameraContext = null

Page({
  data: {
    capturedImage: '',
    isRecognizing: false,
    showScanLine: true,
    flashOn: false
  },

  onLoad(options) {
    console.log('[PhotoRecognize] 页面加载')
    
    cameraContext = wx.createCameraContext()
    
    if (options.source === 'album') {
      this.chooseFromAlbum()
    }
  },

  onUnload() {
    console.log('[PhotoRecognize] 页面卸载')
  },

  onCameraError(e) {
    console.error('[PhotoRecognize] 相机错误', e.detail)
    showError('相机启动失败，请检查权限设置')
    
    setTimeout(() => {
      navigateBack()
    }, 1500)
  },

  toggleFlash() {
    const newFlashOn = !this.data.flashOn
    this.setData({
      flashOn: newFlashOn
    })
    console.log('[PhotoRecognize] 闪光灯切换:', newFlashOn ? '开' : '关')
  },

  takePhoto() {
    console.log('[PhotoRecognize] 开始拍照')
    
    if (!cameraContext) {
      cameraContext = wx.createCameraContext()
    }

    this.setData({ showScanLine: false })

    wx.showLoading({
      title: '拍摄中...',
      mask: true
    })

    cameraContext.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('[PhotoRecognize] 拍照成功', res.tempImagePath)
        this.setData({
          capturedImage: res.tempImagePath
        })
        wx.hideLoading()
      },
      fail: (err) => {
        console.error('[PhotoRecognize] 拍照失败', err)
        wx.hideLoading()
        this.setData({ showScanLine: true })
        showError('拍照失败，请重试')
      }
    })
  },

  chooseFromAlbum() {
    console.log('[PhotoRecognize] 从相册选择')
    
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      sizeType: ['compressed'],
      success: (res) => {
        if (res.tempFiles && res.tempFiles.length > 0) {
          const imagePath = res.tempFiles[0].tempFilePath
          console.log('[PhotoRecognize] 相册选择成功', imagePath)
          this.setData({
            capturedImage: imagePath
          })
        }
      },
      fail: (err) => {
        console.error('[PhotoRecognize] 相册选择失败', err)
        if (err.errMsg && err.errMsg.includes('cancel')) {
          return
        }
        showError('选择图片失败，请重试')
      }
    })
  },

  retakePhoto() {
    console.log('[PhotoRecognize] 重拍')
    this.setData({
      capturedImage: '',
      isRecognizing: false,
      showScanLine: true
    })
  },

  confirmPhoto() {
    console.log('[PhotoRecognize] 确认图片，开始识别')
    const { capturedImage } = this.data
    
    if (!capturedImage) {
      showError('请先拍摄或选择图片')
      return
    }

    this.setData({ isRecognizing: true })

    const shouldFail = Math.random() < 0.1
    
    const recognizePromise = shouldFail 
      ? mockRecognizeFail(capturedImage)
      : mockRecognize(capturedImage)

    recognizePromise.then((result) => {
      console.log('[PhotoRecognize] 识别结果:', result)
      
      this.setData({ isRecognizing: false })
      
      if (result.success && result.data) {
        const resultData = encodeURIComponent(JSON.stringify({
          ...result.data,
          imagePath: capturedImage
        }))
        navigateTo('/pages/recognize-result/recognize-result', {
          data: resultData
        })
      } else {
        const errorData = encodeURIComponent(JSON.stringify({
          success: false,
          error: result.error,
          imagePath: capturedImage
        }))
        navigateTo('/pages/recognize-result/recognize-result', {
          data: errorData
        })
      }
    }).catch((err) => {
      console.error('[PhotoRecognize] 识别异常', err)
      this.setData({ isRecognizing: false })
      showError('识别失败，请重试')
    })
  },

  onShareAppMessage() {
    return {
      title: '拍照识垃圾 - 智能垃圾分类助手',
      path: '/pages/index/index'
    }
  }
})
