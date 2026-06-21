/**
 * 垃圾分类常识页面
 * @description 展示各类垃圾的详细分类知识，根据首页传递的参数显示对应内容
 */
const app = getApp()
const {
  TRASH_TYPES,
  CITY_STANDARDS,
  QUIZ_QUESTIONS,
  getTrashTypesForCity,
  getQuestionsForCity,
  getTypeDescriptionForCity,
  getTypeNameForCity
} = require('../../utils/constants')
const { showToast, navigateBack, navigateTo } = require('../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    classifyId: 0,
    classifyData: null,
    allTypes: TRASH_TYPES,
    isLoading: true,
    cityStandards: CITY_STANDARDS,
    selectedCityId: 'shanghai',
    selectedCity: CITY_STANDARDS[0],
    relatedQuizQuestions: [],
    currentCity: 'shanghai'
  },

  /**
   * 生命周期函数--监听页面加载
   * @param {Object} options 页面参数
   */
  onLoad(options) {
    console.log('[Classify] 页面加载，接收参数：', options)

    const currentCity = app.getCurrentCity()
    const currentCityInfo = app.getCurrentCityInfo()
    const allTypes = getTrashTypesForCity(currentCity)

    // 接收页面传递的参数
    const { id, name } = options

    this.setData({
      currentCity: currentCity,
      selectedCityId: currentCity,
      selectedCity: currentCityInfo,
      allTypes: allTypes
    })

    if (id) {
      this.initClassifyData(parseInt(id))
    } else {
      // 如果没有传递ID，默认显示第一个分类
      this.initClassifyData(1)
    }

    // 设置导航栏标题（需要解码 URL 编码的中文）
    if (name) {
      wx.setNavigationBarTitle({
        title: decodeURIComponent(name)
      })
    }
  },

  onShow() {
    console.log('[Classify] 页面显示')
    const currentCity = app.getCurrentCity()
    if (currentCity !== this.data.currentCity) {
      const currentCityInfo = app.getCurrentCityInfo()
      const allTypes = getTrashTypesForCity(currentCity)
      this.setData({
        currentCity: currentCity,
        selectedCityId: currentCity,
        selectedCity: currentCityInfo,
        allTypes: allTypes
      })
      this.initClassifyData(this.data.classifyId)
    }
  },

  /**
   * 初始化分类数据
   * @param {number} id 分类ID
   */
  initClassifyData(id) {
    console.log('[Classify] 初始化分类数据，ID：', id)

    const currentCity = this.data.currentCity
    const allTypes = getTrashTypesForCity(currentCity)
    let classifyData = allTypes.find(item => item.id === id)

    // 如果找到了基础类型数据，补充城市特定的描述
    if (classifyData) {
      const cityDescription = getTypeDescriptionForCity(id, currentCity)
      if (cityDescription) {
        classifyData = {
          ...classifyData,
          description: cityDescription
        }
      }
    }

    if (classifyData) {
      const relatedQuestions = this.getRelatedQuestions(id)

      this.setData({
        classifyId: id,
        classifyData: classifyData,
        relatedQuizQuestions: relatedQuestions,
        isLoading: false
      })

      // 设置导航栏标题
      wx.setNavigationBarTitle({
        title: classifyData.name
      })

      // 设置导航栏颜色
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: classifyData.color,
        animation: {
          duration: 300,
          timingFunc: 'easeIn'
        }
      })

      console.log('[Classify] 分类数据加载成功', classifyData.name)
    } else {
      console.error('[Classify] 未找到对应的分类数据')
      showToast('分类数据加载失败')
      setTimeout(() => {
        navigateBack()
      }, 1500)
    }
  },

  /**
   * 切换分类
   * @param {Object} e 事件对象
   */
  onSwitchType(e) {
    const { id } = e.currentTarget.dataset
    console.log('[Classify] 切换分类', id)

    if (id !== this.data.classifyId) {
      this.setData({ isLoading: true })

      setTimeout(() => {
        this.initClassifyData(id)
      }, 200)
    }
  },

  /**
   * 点击示例项
   * @param {Object} e 事件对象
   */
  onExampleTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Classify] 点击示例', item)

    wx.showActionSheet({
      itemList: ['查看详情说明', '开始练习此类垃圾'],
      itemColor: '#2D3436',
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.showModal({
            title: item.name,
            content: item.desc,
            showCancel: false,
            confirmText: '知道了',
            confirmColor: this.data.classifyData.color
          })
        } else if (res.tapIndex === 1) {
          this.startPractice()
        }
      }
    })
  },

  /**
   * 长按示例项
   * @param {Object} e 事件对象
   */
  onExampleLongPress(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Classify] 长按示例', item)

    wx.showActionSheet({
      itemList: ['查看详情', '开始练习此类垃圾'],
      itemColor: '#2D3436',
      success: (res) => {
        if (res.tapIndex === 0) {
          this.onExampleTap(e)
        } else if (res.tapIndex === 1) {
          this.startPractice()
        }
      }
    })
  },

  /**
   * 开始练习此类垃圾
   */
  startPractice() {
    const { classifyId, classifyData } = this.data
    console.log('[Classify] 开始练习', classifyData.name)

    app.safeNavigateTo('/pages/sort-practice/sort-practice', {
      mode: 'category',
      typeId: classifyId,
      typeName: classifyData.name
    })
  },

  getRelatedQuestions(typeId) {
    const currentCity = this.data.currentCity
    const typeNameMap = { single: '单选', multiple: '多选', judge: '判断' }
    const diffNameMap = { easy: '简单', medium: '中等', hard: '困难' }
    const allQuestions = getQuestionsForCity(null, currentCity)
    const questions = allQuestions.filter(q => q.chapterId === typeId)
    const processed = questions.map(q => ({
      ...q,
      typeName: typeNameMap[q.type] || '单选',
      difficultyName: diffNameMap[q.difficulty] || '简单'
    }))
    const shuffled = processed.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  },

  onCityChange(e) {
    const { id } = e.currentTarget.dataset
    console.log('[Classify] 切换城市', id)

    if (id === this.data.currentCity) {
      return
    }

    const selectedCity = CITY_STANDARDS.find(c => c.id === id)
    if (selectedCity) {
      app.setCurrentCity(id)
      const allTypes = getTrashTypesForCity(id)
      this.setData({
        currentCity: id,
        selectedCityId: id,
        selectedCity: selectedCity,
        allTypes: allTypes
      })
      this.initClassifyData(this.data.classifyId)
    }
  },

  onQuizQuestionTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('[Classify] 点击相关题目', item.question)

    app.safeNavigateTo('/pages/quiz-play/quiz-play', {
      type: 'chapter',
      chapterId: this.data.classifyId,
      chapterName: this.data.classifyData.name
    })
  },

  goToQuizPlay() {
    const { classifyId, classifyData } = this.data
    console.log('[Classify] 去答题', classifyData.name)

    app.safeNavigateTo('/pages/quiz-play/quiz-play', {
      type: 'chapter',
      chapterId: classifyId,
      chapterName: classifyData.name
    })
  },

  goBack() {
    navigateBack()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const { classifyData } = this.data
    return {
      title: `${classifyData.name} - 垃圾分类知识`,
      path: `/pages/classify/classify?id=${classifyData.id}&name=${encodeURIComponent(classifyData.name)}`,
      imageUrl: ''
    }
  }
})
