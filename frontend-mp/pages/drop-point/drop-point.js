/**
 * 投放点地图页面逻辑
 * @description 展示附近垃圾分类投放点，支持地图和列表双模式
 */

const app = getApp()
const {
  DROP_POINT_TYPES,
  SUPPORTED_CATEGORIES,
  DROP_POINTS,
  DROP_POINT_STORAGE_KEYS,
  DEVICE_STATUS,
  REPORT_TYPES
} = require('../../utils/constants')
const {
  showToast,
  showLoading,
  hideLoading,
  getStorage,
  setStorage,
  navigateTo
} = require('../../utils/util')
const { messageManager, MESSAGE_TYPES } = require('../../utils/message')

Page({
  data: {
    viewMode: 'map',
    activeFilter: 'all',
    sortBy: 'distance',
    userLocation: {
      latitude: 39.9087,
      longitude: 116.4074
    },
    mapScale: 14,
    markers: [],
    points: DROP_POINTS,
    filteredPoints: DROP_POINTS,
    selectedPoint: null,
    showDetail: false,
    detailPoint: null,
    favorites: [],
    checkins: [],
    showReportModal: false,
    reportPoint: null,
    reportTypes: [],
    selectedReportType: '',
    reportDescription: '',
    scanHistory: [],
    DEVICE_STATUS: DEVICE_STATUS,
    DROP_POINT_TYPES: DROP_POINT_TYPES,
    SUPPORTED_CATEGORIES: SUPPORTED_CATEGORIES
  },

  onLoad(options) {
    console.log('[DropPoint] 页面加载', options)
    this.loadLocalData()
    this.initMarkers()
    this.filterPoints()
    this.getUserLocation()
    this.initReportTypes()

    if (options.pointId) {
      this.showPointDetailById(options.pointId)
    }

    if (options.scan === '1' && options.pointId) {
      this.handleScanCheckIn(options.pointId)
    }
  },

  onShow() {
    console.log('[DropPoint] 页面显示')
    this.loadLocalData()
    this.filterPoints()
  },

  onPullDownRefresh() {
    console.log('[DropPoint] 下拉刷新')
    this.loadLocalData()
    this.filterPoints()
    this.getUserLocation()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  loadLocalData() {
    const favorites = getStorage(DROP_POINT_STORAGE_KEYS.FAVORITES, [])
    const checkins = getStorage(DROP_POINT_STORAGE_KEYS.CHECKINS, [])
    const scanHistory = getStorage(DROP_POINT_STORAGE_KEYS.SCAN_HISTORY, [])
    this.setData({
      favorites,
      checkins,
      scanHistory
    })
  },

  initReportTypes() {
    const reportTypes = Object.values(REPORT_TYPES)
    this.setData({ reportTypes })
  },

  showPointDetailById(pointId) {
    const point = this.data.points.find(p => p.id === pointId)
    if (point) {
      this.setData({
        showDetail: true,
        detailPoint: point
      })
    }
  },

  handleScanCheckIn(pointId) {
    const point = this.data.points.find(p => p.id === pointId)
    if (!point) {
      showToast('未找到该投放点')
      return
    }

    const deviceStatus = this.getDeviceStatus(point.deviceStatus)
    if (deviceStatus.id === 'fault' || deviceStatus.id === 'temp_closed') {
      showToast(`${deviceStatus.name}，无法打卡`)
      return
    }

    this.doCheckIn(pointId, 'scan')

    const scanHistory = [...this.data.scanHistory]
    scanHistory.unshift({
      pointId,
      pointName: point.name,
      time: new Date().toISOString(),
      type: 'checkin'
    })
    if (scanHistory.length > 20) {
      scanHistory.pop()
    }
    setStorage(DROP_POINT_STORAGE_KEYS.SCAN_HISTORY, scanHistory)
    this.setData({ scanHistory })
  },

  getUserLocation() {
    showLoading('定位中...')
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log('[DropPoint] 获取位置成功', res)
        const newLocation = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        this.setData({
          userLocation: newLocation
        })
        this.updateDistances(res.latitude, res.longitude)
        this.initMarkers()
        hideLoading()
      },
      fail: (err) => {
        console.error('[DropPoint] 获取位置失败', err)
        showToast('定位失败，显示默认位置')
        hideLoading()
        this.updateDistances(39.9087, 116.4074)
        this.initMarkers()
      }
    })
  },

  updateDistances(userLat, userLng) {
    const points = this.data.points.map(point => {
      const distance = this.calculateDistance(
        userLat, userLng,
        point.latitude, point.longitude
      )
      return {
        ...point,
        distance: Math.round(distance)
      }
    })
    this.setData({ points })
    this.filterPoints()
  },

  calculateDistance(lat1, lng1, lat2, lng2) {
    const radLat1 = (lat1 * Math.PI) / 180.0
    const radLat2 = (lat2 * Math.PI) / 180.0
    const a = radLat1 - radLat2
    const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137
    s = Math.round(s * 10000) / 10
    return s
  },

  initMarkers() {
    const markers = this.data.filteredPoints.map((point, index) => {
      const typeInfo = this.getPointType(point.type)
      return {
        id: index,
        pointId: point.id,
        latitude: point.latitude,
        longitude: point.longitude,
        width: 40,
        height: 40,
        callout: {
          content: point.name,
          color: '#2D3436',
          fontSize: 12,
          borderRadius: 8,
          bgColor: '#ffffff',
          padding: 6,
          display: 'BYCLICK',
          textAlign: 'center'
        },
        anchor: { x: 0.5, y: 1 }
      }
    })
    this.setData({ markers })
  },

  filterPoints() {
    let filtered = [...this.data.points]
    const { activeFilter, sortBy, favorites } = this.data

    if (activeFilter === 'favorite') {
      filtered = filtered.filter(p => favorites.includes(p.id))
    } else if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === activeFilter)
    }

    if (sortBy === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    this.setData({ filteredPoints: filtered })
    this.initMarkers()
  },

  onFilterChange(e) {
    const { type } = e.currentTarget.dataset
    console.log('[DropPoint] 筛选切换', type)
    this.setData({ activeFilter: type })
    this.filterPoints()
  },

  onViewModeChange(e) {
    const { mode } = e.currentTarget.dataset
    console.log('[DropPoint] 视图切换', mode)
    this.setData({ viewMode: mode })
  },

  onSortChange(e) {
    const { sort } = e.currentTarget.dataset
    console.log('[DropPoint] 排序切换', sort)
    this.setData({ sortBy: sort })
    this.filterPoints()
  },

  onMarkerTap(e) {
    const { markerId } = e.detail
    console.log('[DropPoint] 点击标记点', markerId)
    const point = this.data.filteredPoints[markerId]
    if (point) {
      this.setData({ selectedPoint: point })
    }
  },

  onPointTap(e) {
    const { point } = e.currentTarget.dataset
    console.log('[DropPoint] 点击投放点', point.name)
    this.setData({ selectedPoint: point })
    this.onShowDetail(e)
  },

  onRegionChange(e) {
    if (e.type === 'end') {
      console.log('[DropPoint] 地图区域变化', e.detail)
    }
  },

  onLocateUser() {
    console.log('[DropPoint] 定位到用户位置')
    const mapContext = wx.createMapContext('dropPointMap')
    mapContext.moveToLocation({
      latitude: this.data.userLocation.latitude,
      longitude: this.data.userLocation.longitude,
      success: () => {
        console.log('[DropPoint] 移动到用户位置成功')
      },
      fail: (err) => {
        console.error('[DropPoint] 移动失败', err)
      }
    })
  },

  onZoomIn() {
    console.log('[DropPoint] 放大地图')
    this.setData({
      mapScale: Math.min(this.data.mapScale + 1, 20)
    })
  },

  onZoomOut() {
    console.log('[DropPoint] 缩小地图')
    this.setData({
      mapScale: Math.max(this.data.mapScale - 1, 3)
    })
  },

  onCheckIn(e) {
    const { id } = e.currentTarget.dataset
    console.log('[DropPoint] 打卡', id)
    this.doCheckIn(id, 'normal')
  },

  doCheckIn(pointId, type = 'normal') {
    const today = new Date().toDateString()
    let checkins = [...this.data.checkins]
    const existingIndex = checkins.findIndex(c => c.id === pointId && c.date === today)

    if (existingIndex >= 0) {
      showToast('今日已在此打卡')
      return
    }

    const point = this.data.points.find(p => p.id === pointId)
    if (!point) {
      showToast('未找到投放点')
      return
    }

    const deviceStatus = this.getDeviceStatus(point.deviceStatus)
    if (deviceStatus.id === 'fault' || deviceStatus.id === 'temp_closed') {
      showToast(`${deviceStatus.name}，无法打卡`)
      return
    }

    if (type === 'scan') {
      const distance = this.calculateDistance(
        this.data.userLocation.latitude,
        this.data.userLocation.longitude,
        point.latitude,
        point.longitude
      )
      if (distance > 500) {
        showToast('距离投放点太远，无法打卡')
        return
      }
    }

    checkins.push({
      id: pointId,
      date: today,
      time: new Date().toISOString(),
      type: type
    })

    const points = this.data.points.map(p => {
      if (p.id === pointId) {
        return { ...p, checkinCount: p.checkinCount + 1 }
      }
      return p
    })

    setStorage(DROP_POINT_STORAGE_KEYS.CHECKINS, checkins)

    const pointsReward = type === 'scan' ? 10 : 5
    const result = app.addPoints(pointsReward, 'drop_point_checkin')
    if (result.success) {
      showToast(`${type === 'scan' ? '扫码' : ''}打卡成功 +${result.points}积分`, 'success')
    } else {
      showToast(`${type === 'scan' ? '扫码' : ''}打卡成功`, 'success')
    }

    this.setData({ checkins, points })
    this.filterPoints()
  },

  onNavigate(e) {
    const { point } = e.currentTarget.dataset
    console.log('[DropPoint] 导航到', point.name)

    wx.openLocation({
      latitude: point.latitude,
      longitude: point.longitude,
      name: point.name,
      address: point.address,
      scale: 18,
      success: () => {
        console.log('[DropPoint] 打开地图导航成功')
      },
      fail: (err) => {
        console.error('[DropPoint] 打开地图导航失败', err)
        showToast('导航失败，请重试')
      }
    })
  },

  onShowDetail(e) {
    const { point } = e.currentTarget.dataset
    console.log('[DropPoint] 显示详情', point.name)
    this.setData({
      showDetail: true,
      detailPoint: point
    })
  },

  onCloseDetail() {
    console.log('[DropPoint] 关闭详情')
    this.setData({
      showDetail: false
    })
  },

  getPointType(typeId) {
    const typeMap = {
      'garbage_station': DROP_POINT_TYPES.GARBAGE_STATION,
      'recyclable': DROP_POINT_TYPES.RECYCLABLE,
      'harmful': DROP_POINT_TYPES.HARMFUL
    }
    return typeMap[typeId] || DROP_POINT_TYPES.GARBAGE_STATION
  },

  getCategory(categoryId) {
    return SUPPORTED_CATEGORIES.find(c => c.id === categoryId) || SUPPORTED_CATEGORIES[0]
  },

  isFavorite(id) {
    return this.data.favorites.includes(id)
  },

  hasCheckedIn(id) {
    const today = new Date().toDateString()
    return this.data.checkins.some(c => c.id === id && c.date === today)
  },

  formatDistance(distance) {
    if (distance < 1000) {
      return `${distance}m`
    } else {
      return `${(distance / 1000).toFixed(1)}km`
    }
  },

  getDeviceStatus(statusId) {
    const statusMap = {
      'normal': DEVICE_STATUS.NORMAL,
      'full': DEVICE_STATUS.FULL,
      'fault': DEVICE_STATUS.FAULT,
      'temp_closed': DEVICE_STATUS.TEMP_CLOSED
    }
    return statusMap[statusId] || DEVICE_STATUS.NORMAL
  },

  onScanCode() {
    console.log('[DropPoint] 扫码')
    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        console.log('[DropPoint] 扫码成功', res)
        const result = res.result
        this.handleScanResult(result)
      },
      fail: (err) => {
        console.error('[DropPoint] 扫码失败', err)
        showToast('扫码失败，请重试')
      }
    })
  },

  handleScanResult(result) {
    console.log('[DropPoint] 处理扫码结果', result)
    
    if (result.startsWith('drop_point_')) {
      const pointId = result.replace('drop_point_', '')
      const point = this.data.points.find(p => p.id === pointId)
      
      if (point) {
        this.showPointDetailById(pointId)
        this.handleScanCheckIn(pointId)
        
        const scanHistory = [...this.data.scanHistory]
        scanHistory.unshift({
          pointId,
          pointName: point.name,
          time: new Date().toISOString(),
          type: 'scan'
        })
        if (scanHistory.length > 20) {
          scanHistory.pop()
        }
        setStorage(DROP_POINT_STORAGE_KEYS.SCAN_HISTORY, scanHistory)
        this.setData({ scanHistory })
      } else {
        showToast('未找到该投放点')
      }
    } else {
      showToast('无效的投放点二维码')
    }
  },

  onOpenReport(e) {
    const { point } = e.currentTarget.dataset
    console.log('[DropPoint] 打开上报弹窗', point.name)
    this.setData({
      showReportModal: true,
      reportPoint: point,
      selectedReportType: '',
      reportDescription: ''
    })
  },

  onCloseReport() {
    console.log('[DropPoint] 关闭上报弹窗')
    this.setData({
      showReportModal: false,
      reportPoint: null,
      selectedReportType: '',
      reportDescription: ''
    })
  },

  onGoToReports() {
    console.log('[DropPoint] 跳转到上报记录')
    navigateTo('/pages/drop-point-reports/drop-point-reports')
  },

  onSelectReportType(e) {
    const { type } = e.currentTarget.dataset
    console.log('[DropPoint] 选择上报类型', type)
    this.setData({ selectedReportType: type })
  },

  onReportDescriptionInput(e) {
    this.setData({ reportDescription: e.detail.value })
  },

  onSubmitReport() {
    const { reportPoint, selectedReportType, reportDescription } = this.data
    
    if (!selectedReportType) {
      showToast('请选择上报类型')
      return
    }

    const reportTypeInfo = this.getReportType(selectedReportType)
    
    const report = {
      id: `report_${Date.now()}`,
      pointId: reportPoint.id,
      pointName: reportPoint.name,
      pointAddress: reportPoint.address,
      type: selectedReportType,
      typeName: reportTypeInfo.name,
      description: reportDescription,
      status: 'pending',
      createTime: new Date().toISOString()
    }

    const reports = getStorage(DROP_POINT_STORAGE_KEYS.REPORTS, [])
    reports.unshift(report)
    setStorage(DROP_POINT_STORAGE_KEYS.REPORTS, reports)

    showToast('上报成功，等待审核', 'success')
    this.onCloseReport()

    messageManager.addMessage({
      type: MESSAGE_TYPES.SYSTEM,
      title: '上报提交成功',
      content: `您提交的「${reportPoint.name}」${reportTypeInfo.name}上报已受理，我们将尽快审核。`,
      data: { reportId: report.id, pointId: reportPoint.id },
      read: false
    })
  },

  getReportType(typeId) {
    const typeMap = {}
    Object.values(REPORT_TYPES).forEach(type => {
      typeMap[type.id] = type
    })
    return typeMap[typeId] || REPORT_TYPES.OTHER
  },

  sendFavoriteStatusNotification(point, isFavorited) {
    if (isFavorited) {
      messageManager.addMessage({
        type: MESSAGE_TYPES.DROP_POINT,
        title: '已收藏投放点',
        content: `您已收藏「${point.name}」，我们会及时通知您该投放点的状态变更。`,
        data: { pointId: point.id, action: 'favorite' },
        read: false
      })
    }
  },

  onToggleFavorite(e) {
    const { id } = e.currentTarget.dataset
    console.log('[DropPoint] 切换收藏', id)

    let favorites = [...this.data.favorites]
    const isFavorited = favorites.includes(id)

    if (isFavorited) {
      favorites = favorites.filter(fid => fid !== id)
      showToast('已取消收藏')
    } else {
      favorites.push(id)
      showToast('收藏成功', 'success')
      
      const point = this.data.points.find(p => p.id === id)
      if (point) {
        this.sendFavoriteStatusNotification(point, true)
      }
    }

    setStorage(DROP_POINT_STORAGE_KEYS.FAVORITES, favorites)
    this.setData({ favorites })

    if (this.data.activeFilter === 'favorite') {
      this.filterPoints()
    }
  }
})

