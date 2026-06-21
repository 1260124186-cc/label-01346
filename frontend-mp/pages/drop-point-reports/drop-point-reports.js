/**
 * 投放点上报记录页面
 * @description 展示用户的上报历史和审核状态
 */

const {
  DROP_POINT_STORAGE_KEYS,
  REPORT_TYPES
} = require('../../utils/constants')
const {
  showToast,
  getStorage,
  setStorage,
  navigateTo,
  navigateBack
} = require('../../utils/util')

const REPORT_STATUS_CONFIG = {
  pending: {
    id: 'pending',
    name: '待审核',
    color: '#F39C12',
    bgColor: 'rgba(243, 156, 18, 0.1)'
  },
  approved: {
    id: 'approved',
    name: '已通过',
    color: '#5BBD72',
    bgColor: 'rgba(91, 189, 114, 0.1)'
  },
  rejected: {
    id: 'rejected',
    name: '已驳回',
    color: '#E85D5D',
    bgColor: 'rgba(232, 93, 93, 0.1)'
  }
}

Page({
  data: {
    currentStatus: 'all',
    statusTabs: [],
    reportList: [],
    reportCount: {},
    isEmpty: false
  },

  onLoad(options) {
    console.log('[DropPointReports] 页面加载', options)
    this.initTabs()
    if (options.status) {
      this.setData({ currentStatus: options.status })
    }
  },

  onShow() {
    console.log('[DropPointReports] 页面显示')
    this.refreshData()
  },

  onPullDownRefresh() {
    console.log('[DropPointReports] 下拉刷新')
    this.refreshData()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 500)
  },

  initTabs() {
    const statusTabs = [
      { id: 'all', name: '全部' },
      { id: 'pending', name: '待审核', color: '#F39C12' },
      { id: 'approved', name: '已通过', color: '#5BBD72' },
      { id: 'rejected', name: '已驳回', color: '#E85D5D' }
    ]
    this.setData({ statusTabs })
  },

  refreshData() {
    try {
      const { currentStatus } = this.data
      const allReports = getStorage(DROP_POINT_STORAGE_KEYS.REPORTS, [])
      
      let filteredReports = allReports
      if (currentStatus !== 'all') {
        filteredReports = allReports.filter(r => r.status === currentStatus)
      }

      const reportList = filteredReports.map(report => ({
        ...report,
        typeInfo: this.getReportTypeInfo(report.type),
        statusInfo: REPORT_STATUS_CONFIG[report.status] || REPORT_STATUS_CONFIG.pending,
        formatTime: this.formatTime(report.createTime)
      }))

      const reportCount = {
        all: allReports.length,
        pending: allReports.filter(r => r.status === 'pending').length,
        approved: allReports.filter(r => r.status === 'approved').length,
        rejected: allReports.filter(r => r.status === 'rejected').length
      }

      this.setData({
        reportList,
        reportCount,
        isEmpty: reportList.length === 0
      })
    } catch (error) {
      console.error('[DropPointReports] 刷新数据失败', error)
      showToast('加载失败，请重试')
    }
  },

  getReportTypeInfo(typeId) {
    const typeMap = {}
    Object.values(REPORT_TYPES).forEach(type => {
      typeMap[type.id] = type
    })
    return typeMap[typeId] || REPORT_TYPES.OTHER
  },

  formatTime(timeStr) {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    return `${month}月${day}日 ${hour}:${minute}`
  },

  onStatusTap(e) {
    const { status } = e.currentTarget.dataset
    console.log('[DropPointReports] 切换状态', status)
    this.setData({ currentStatus: status })
    this.refreshData()
  },

  onReportTap(e) {
    const { report } = e.currentTarget.dataset
    console.log('[DropPointReports] 点击上报', report.id)
    showToast('上报详情功能开发中')
  },

  onBack() {
    navigateBack()
  },

  onGoToDropPoint() {
    navigateTo('/pages/drop-point/drop-point')
  }
})
