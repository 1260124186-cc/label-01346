/**
 * 抽奖记录页面
 * @description 展示转盘/盲盒中奖记录，含待领取实物的领取流程
 */
const app = getApp()
const { navigateTo, showToast, showModal, formatDate } = require('../../utils/util')

const TAB_LABELS = {
  all: '',
  lottery: '转盘',
  blindbox: '盲盒',
  win: '中奖'
}

Page({
  data: {
    stats: {
      totalDrawCount: 0,
      wonRareCount: 0,
      wonPointsTotal: 0
    },
    pendingPhysical: [],
    currentTab: 'all',
    currentTabLabel: '',
    groupedRecords: [],
    showAddressModal: false,
    selectedPrizeId: null,
    selectedPrizeName: '',
    addressList: [],
    selectedAddressId: null,
    experienceClasses: '',
    lotterySystem: null
  },

  onLoad() {
    console.log('[LotteryRecords] 页面加载')
    const lotterySystem = app.globalData.lotterySystem || require('../../utils/lottery').lotterySystem
    this.setData({
      lotterySystem,
      experienceClasses: app.globalData.darkMode ? 'dark-mode' : ''
    })
    this.refreshAllData()
  },

  onShow() {
    console.log('[LotteryRecords] 页面显示')
    this.setData({
      experienceClasses: app.globalData.darkMode ? 'dark-mode' : ''
    })
    this.refreshAllData()
  },

  onPullDownRefresh() {
    this.refreshAllData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 300)
  },

  refreshAllData() {
    this.loadStats()
    this.loadPendingPhysical()
    this.filterAndGroupRecords()
    this.loadAddressList()
  },

  loadStats() {
    const lotteryStats = app.getLotteryStats()
    const allRecords = app.getLotteryRecords() || []
    let wonRareCount = 0
    let wonPointsTotal = 0
    allRecords.forEach(r => {
      const prizes = r.prizes || (r.prize ? [r.prize] : [])
      prizes.forEach(p => {
        if (p && this.data.lotterySystem.isRarityOrHigher(p.rarity, 'rare')) {
          wonRareCount++
        }
        if (p && p.type === 'points' && p.value) {
          wonPointsTotal += p.value
        }
      })
    })
    this.setData({
      stats: {
        totalDrawCount: lotteryStats.totalDrawCount || 0,
        wonRareCount,
        wonPointsTotal
      }
    })
  },

  loadPendingPhysical() {
    const allRecords = app.getLotteryRecords() || []
    const pending = []
    for (let i = 0; i < allRecords.length; i++) {
      const r = allRecords[i]
      const prizes = r.prizes || (r.prize ? [r.prize] : [])
      for (let j = 0; j < prizes.length; j++) {
        const p = prizes[j]
        if (p && p.type === 'physical' && !p.claimed && !p.orderId) {
          pending.push({
            id: p.id || r.id + '-' + j,
            prizeId: p.id,
            recordId: r.id,
            prizeIndex: j,
            emoji: p.emoji || '🎁',
            name: p.name,
            rarityLabel: this.getRarityLabel(p.rarity),
            timeAgo: this.formatTimeAgo(r.timestamp)
          })
        }
      }
    }
    this.setData({ pendingPhysical: pending.slice(0, 10) })
  },

  getRarityLabel(rarity) {
    const labels = {
      common: '普通',
      uncommon: '优秀',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说'
    }
    return labels[rarity] || '普通'
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: tab,
      currentTabLabel: TAB_LABELS[tab] || ''
    }, () => {
      this.filterAndGroupRecords()
    })
  },

  filterAndGroupRecords() {
    const allRecords = app.getLotteryRecords() || []
    const { currentTab } = this.data
    const lotterySystem = this.data.lotterySystem

    let filtered = allRecords.slice()

    if (currentTab === 'lottery') {
      filtered = filtered.filter(r => !r.isBlindbox && r.drawType !== 'blindbox' && r.sourceType !== 'blindbox')
    } else if (currentTab === 'blindbox') {
      filtered = filtered.filter(r => r.isBlindbox || r.drawType === 'blindbox' || r.sourceType === 'blindbox')
    } else if (currentTab === 'win') {
      filtered = filtered.filter(r => {
        const prizes = r.prizes || (r.prize ? [r.prize] : [])
        return prizes.some(p => p && lotterySystem.isRarityOrHigher(p.rarity, 'rare'))
      })
    }

    filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

    const grouped = {}
    filtered.forEach(r => {
      const date = new Date(r.timestamp || Date.now())
      const dateKey = formatDate(date, 'YYYY-MM-DD')
      if (!grouped[dateKey]) grouped[dateKey] = []

      const prizes = r.prizes || (r.prize ? [r.prize] : [])
      const isBlindbox = r.isBlindbox || r.drawType === 'blindbox' || r.sourceType === 'blindbox'
      const hasRare = prizes.some(p => p && lotterySystem.isRarityOrHigher(p.rarity, 'rare'))
      const prize0 = prizes[0] || {}
      const bgColors = {
        lottery: '#E8F8EC',
        blindbox: '#F0E6FF'
      }
      const type = isBlindbox ? 'blindbox' : 'lottery'
      const typeEmoji = isBlindbox ? '📦' : '🎰'
      const title = isBlindbox
        ? (r.boxName || '开启盲盒')
        : (r.drawCount && r.drawCount > 1 ? `十连抽奖 ×${r.drawCount}` : '幸运转盘 · 单抽')

      const prizeList = prizes.map(p => ({
        id: p.id,
        emoji: p.emoji,
        name: p.name,
        isRare: p && lotterySystem.isRarityOrHigher(p.rarity, 'rare')
      }))

      let canClaim = false
      let recordIdForClaim = null
      for (let idx = 0; idx < prizes.length; idx++) {
        const p = prizes[idx]
        if (p && p.type === 'physical' && !p.claimed && !p.orderId) {
          canClaim = true
          recordIdForClaim = p.id || r.id + '-' + idx
          break
        }
      }

      const bgColor = bgColors[type]

      grouped[dateKey].push({
        id: r.id,
        bgColor,
        typeEmoji,
        isBlindbox,
        count: prizes.length,
        title,
        time: formatDate(new Date(r.timestamp || Date.now()), 'HH:mm'),
        prizes: prizeList,
        prizeEmoji: prize0.emoji || '🎁',
        prizeName: prize0.name || '谢谢参与',
        isRare: hasRare,
        rarityLabel: this.getRarityLabel(prize0.rarity),
        description: r.description || (prize0.description || ''),
        canClaim,
        idForClaim: recordIdForClaim
      })
    })

    const todayKey = formatDate(new Date(), 'YYYY-MM-DD')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayKey = formatDate(yesterday, 'YYYY-MM-DD')

    const groupedRecords = Object.keys(grouped).map(key => ({
      dateKey: key,
      dateLabel: key === todayKey ? '今天' : key === yesterdayKey ? '昨天' : key,
      items: grouped[key]
    }))

    this.setData({ groupedRecords })
  },

  loadAddressList() {
    try {
      const addresses = wx.getStorageSync('address_list') || []
      this.setData({
        addressList: addresses,
        selectedAddressId: addresses.find(a => a.isDefault) ? addresses.find(a => a.isDefault).id : (addresses[0] ? addresses[0].id : null)
      })
    } catch (err) {
      this.setData({ addressList: [] })
    }
  },

  claimPrize(e) {
    const prizeId = e.currentTarget.dataset.prizeId
    if (!prizeId) return
    let prizeName = ''
    const allRecords = app.getLotteryRecords() || []
    for (let i = 0; i < allRecords.length; i++) {
      const r = allRecords[i]
      const prizes = r.prizes || (r.prize ? [r.prize] : [])
      for (let j = 0; j < prizes.length; j++) {
        const p = prizes[j]
        const pid = p.id || r.id + '-' + j
        if (pid === prizeId) {
          prizeName = p.name || '实物奖品'
          break
        }
      }
    }
    this.setData({
      showAddressModal: true,
      selectedPrizeId: prizeId,
      selectedPrizeName: prizeName
    })
    this.loadAddressList()
  },

  selectAddress(e) {
    this.setData({ selectedAddressId: e.currentTarget.dataset.id })
  },

  addNewAddress() {
    showToast('请在个人中心添加地址')
    setTimeout(() => {
      navigateTo('/pages/address/address')
    }, 800)
  },

  async confirmClaim() {
    if (!this.data.selectedPrizeId || !this.data.selectedAddressId) {
      showToast('请选择收货地址')
      return
    }
    try {
      const result = await app.claimPhysicalPrize(this.data.selectedPrizeId, this.data.selectedAddressId)
      if (result && result.success) {
        this.setData({ showAddressModal: false })
        showModal('领取成功', '实物奖品已生成订单，将按流程发货。可在"订单中心"查看进度', false)
        this.refreshAllData()
      } else {
        showToast(result && result.message ? result.message : '领取失败')
      }
    } catch (err) {
      console.error('[LotteryRecords] 领取实物异常:', err)
      showToast('系统繁忙，请重试')
    }
  },

  hideAddressModal() {
    this.setData({ showAddressModal: false })
  },

  goToLottery() {
    navigateTo('/pages/lottery/lottery')
  },

  formatTimeAgo(timestamp) {
    if (!timestamp) return ''
    const diff = Date.now() - timestamp
    const min = 60 * 1000
    const hour = 60 * min
    const day = 24 * hour
    if (diff < min) return '刚刚'
    if (diff < hour) return Math.floor(diff / min) + '分钟前'
    if (diff < day) return Math.floor(diff / hour) + '小时前'
    if (diff < 7 * day) return Math.floor(diff / day) + '天前'
    return formatDate(new Date(timestamp), 'MM-DD')
  },

  preventClose() {},

  onShareAppMessage() {
    return {
      title: '🎰 我在垃圾分类助手抽中了好东西，快来试试手气！',
      path: '/pages/lottery/lottery'
    }
  }
})
