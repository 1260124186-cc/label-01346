const app = getApp()
const { navigateTo, showToast, showModal } = require('../../utils/util')
const {
  getVoteProducts,
  getSortedVoteProducts,
  castVote,
  getUserVotedProducts,
  getProductById,
  getEcoLevelColor
} = require('../../data/green-guide')

Page({
  data: {
    currentTab: 'rank',
    voteList: [],
    myVotes: [],
    totalVotes: 0,
    experienceClasses: ''
  },

  onLoad() {
    console.log('[GreenVote] 页面加载')
    this.setData({ experienceClasses: app.getExperienceClasses() })
  },

  onShow() {
    console.log('[GreenVote] 页面显示')
    this.setData({ experienceClasses: app.getExperienceClasses() })
    this.loadVoteData()
  },

  loadVoteData() {
    const sorted = getSortedVoteProducts()
    const totalVotes = sorted.reduce((sum, p) => sum + p.votes, 0)
    const maxVotes = sorted.length > 0 ? sorted[0].votes : 1

    const voteList = sorted.map((p, index) => {
      const product = getProductById(p.productId)
      return {
        ...p,
        rank: index + 1,
        ecoLevel: product ? product.ecoLevel : '',
        ecoLevelColor: product ? getEcoLevelColor(product.ecoLevel) : '#8E8E93',
        barWidth: Math.max(10, Math.floor((p.votes / maxVotes) * 100))
      }
    })

    const myVotes = getUserVotedProducts().map(v => {
      const product = getProductById(v.productId)
      return {
        ...v,
        ecoLevel: product ? product.ecoLevel : '',
        ecoLevelColor: product ? getEcoLevelColor(product.ecoLevel) : '#8E8E93'
      }
    })

    this.setData({ voteList, myVotes, totalVotes })
  },

  switchToRank() {
    this.setData({ currentTab: 'rank' })
  },

  switchToMyVotes() {
    this.loadVoteData()
    this.setData({ currentTab: 'myVotes' })
  },

  onVoteTap(e) {
    const { id } = e.currentTarget.dataset
    console.log('[GreenVote] 投票', id)
    const result = castVote(id)
    if (result.success) {
      showToast('投票成功！感谢你的推荐', 'success')
      this.loadVoteData()
    } else {
      showToast(result.message)
    }
  },

  onProductTap(e) {
    const { productid } = e.currentTarget.dataset
    if (productid) {
      navigateTo('/pages/green-product/green-product', { productId: productid })
    }
  },

  onGoToGuide() {
    navigateTo('/pages/green-guide/green-guide')
  },

  onShareAppMessage() {
    return {
      title: '我会复购的环保产品 - 投票清单',
      path: '/pages/green-vote/green-vote'
    }
  }
})
