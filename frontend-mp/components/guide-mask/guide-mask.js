/**
 * 新用户引导蒙层组件
 * @description 3 步引导：搜索、练习、签到
 */

const GUIDE_STEPS = [
  {
    id: 'search',
    title: '智能搜索',
    description: '点击顶部搜索框，输入垃圾名称快速查询分类',
    emoji: '🔍',
    highlightClass: 'guide-highlight-search'
  },
  {
    id: 'practice',
    title: '分类练习',
    description: '通过小游戏练习垃圾分类，边玩边学赢积分',
    emoji: '🎮',
    highlightClass: 'guide-highlight-practice'
  },
  {
    id: 'signin',
    title: '每日签到',
    description: '每日签到领积分，连续打卡7天额外奖励50积分',
    emoji: '📅',
    highlightClass: 'guide-highlight-signin'
  }
]

const GUIDE_SHOWN_KEY = 'guideMaskShown'

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    }
  },

  data: {
    currentStep: 0,
    steps: GUIDE_STEPS,
    totalSteps: GUIDE_STEPS.length
  },

  methods: {
    nextStep() {
      const next = this.data.currentStep + 1
      if (next >= this.data.totalSteps) {
        this.closeGuide()
      } else {
        this.setData({ currentStep: next })
      }
    },

    prevStep() {
      const prev = this.data.currentStep - 1
      if (prev >= 0) {
        this.setData({ currentStep: prev })
      }
    },

    skipGuide() {
      console.log('[guide-mask] 用户跳过引导')
      this.closeGuide()
    },

    closeGuide() {
      this.setData({ currentStep: 0 })
      this.triggerEvent('close')
      wx.setStorageSync(GUIDE_SHOWN_KEY, true)
      console.log('[guide-mask] 引导已关闭')
    },

    onMaskTap() {
      this.nextStep()
    },

    onStepTap(e) {
      const { step } = e.currentTarget.dataset
      if (step !== undefined && step >= 0 && step < this.data.totalSteps) {
        this.setData({ currentStep: step })
      }
    }
  }
})

const isGuideShown = () => {
  try {
    return !!wx.getStorageSync(GUIDE_SHOWN_KEY)
  } catch (e) {
    return false
  }
}

const shouldShowGuide = () => {
  return !isGuideShown()
}

module.exports = {
  isGuideShown,
  shouldShowGuide,
  GUIDE_STEPS
}
