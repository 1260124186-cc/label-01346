/**
 * 投放点数据模块
 * @description 存放垃圾分类投放点的模拟数据
 */

/**
 * 投放点类型
 */
const DROP_POINT_TYPES = {
  GARBAGE_STATION: {
    id: 'garbage_station',
    name: '垃圾分类站',
    emoji: '🏠',
    color: '#5BBD72',
    bgColor: 'rgba(91, 189, 114, 0.1)',
    description: '综合垃圾分类投放点，通常设有四分类垃圾桶'
  },
  RECYCLABLE: {
    id: 'recyclable',
    name: '可回收物回收点',
    emoji: '♻️',
    color: '#4A90D9',
    bgColor: 'rgba(74, 144, 217, 0.1)',
    description: '专门回收可回收物的站点，部分提供上门回收服务'
  },
  HARMFUL: {
    id: 'harmful',
    name: '有害垃圾收集点',
    emoji: '☣️',
    color: '#E85D5D',
    bgColor: 'rgba(232, 93, 93, 0.1)',
    description: '专门收集有害垃圾的站点，需单独投放'
  }
}

/**
 * 支持的垃圾类别标签
 */
const SUPPORTED_CATEGORIES = [
  { id: 'kitchen', name: '厨余垃圾', emoji: '🍂', color: '#5BBD72' },
  { id: 'recyclable', name: '可回收物', emoji: '♻️', color: '#4A90D9' },
  { id: 'harmful', name: '有害垃圾', emoji: '☣️', color: '#E85D5D' },
  { id: 'other', name: '其他垃圾', emoji: '🗑️', color: '#8E8E93' },
  { id: 'bulky', name: '大件垃圾', emoji: '🛋️', color: '#9B59B6' },
  { id: 'electronic', name: '电子废弃物', emoji: '💻', color: '#F39C12' }
]

/**
 * 设备状态
 */
const DEVICE_STATUS = {
  NORMAL: {
    id: 'normal',
    name: '正常运行',
    emoji: '✅',
    color: '#5BBD72',
    bgColor: 'rgba(91, 189, 114, 0.1)'
  },
  FULL: {
    id: 'full',
    name: '满溢',
    emoji: '📦',
    color: '#F39C12',
    bgColor: 'rgba(243, 156, 18, 0.1)'
  },
  FAULT: {
    id: 'fault',
    name: '设备故障',
    emoji: '⚠️',
    color: '#E85D5D',
    bgColor: 'rgba(232, 93, 93, 0.1)'
  },
  TEMP_CLOSED: {
    id: 'temp_closed',
    name: '临时关闭',
    emoji: '🚫',
    color: '#8E8E93',
    bgColor: 'rgba(142, 142, 147, 0.1)'
  }
}

/**
 * 上报类型
 */
const REPORT_TYPES = {
  NO_SUCH_POINT: {
    id: 'no_such_point',
    name: '此处无此站点',
    emoji: '❓',
    description: '该位置不存在投放点'
  },
  RELOCATED: {
    id: 'relocated',
    name: '已搬迁',
    emoji: '🚚',
    description: '投放点已搬迁至其他位置'
  },
  TEMP_CLOSED: {
    id: 'temp_closed',
    name: '临时关闭',
    emoji: '🚫',
    description: '投放点临时关闭，无法使用'
  },
  DEVICE_FAULT: {
    id: 'device_fault',
    name: '设备故障',
    emoji: '🔧',
    description: '智能设备出现故障'
  },
  OVERFLOW: {
    id: 'overflow',
    name: '垃圾满溢',
    emoji: '📦',
    description: '垃圾桶已满，需要清运'
  },
  OTHER: {
    id: 'other',
    name: '其他问题',
    emoji: '💬',
    description: '其他需要反馈的问题'
  }
}

/**
 * 投放点模拟数据
 * 以北京天安门附近为例，生成周边投放点
 */
const DROP_POINTS = [
  {
    id: 'dp001',
    type: 'garbage_station',
    name: '东长安街垃圾分类站',
    address: '北京市东城区东长安街1号',
    latitude: 39.9087,
    longitude: 116.4074,
    distance: 120,
    businessHours: {
      weekdays: '06:00-22:00',
      weekends: '07:00-21:00'
    },
    isOpenNow: true,
    supportedCategories: ['kitchen', 'recyclable', 'harmful', 'other'],
    facilities: ['智能分类柜', '洗手池', '照明设备', '语音提示'],
    rating: 4.8,
    checkinCount: 256,
    description: '示范级垃圾分类站，配备智能分类设备，专人值守指导分类',
    contactPhone: '010-12345678',
    createTime: '2024-01-15',
    deviceStatus: 'normal',
    fillLevel: 35,
    lastStatusUpdate: '2024-06-21 08:30',
    hasSmartDevice: true,
    qrCode: 'drop_point_dp001'
  },
  {
    id: 'dp002',
    type: 'recyclable',
    name: '王府井可回收物回收中心',
    address: '北京市东城区王府井大街88号',
    latitude: 39.9139,
    longitude: 116.4103,
    distance: 580,
    businessHours: {
      weekdays: '09:00-18:00',
      weekends: '09:00-17:00'
    },
    isOpenNow: true,
    supportedCategories: ['recyclable', 'electronic', 'bulky'],
    facilities: ['称重设备', '积分兑换', '上门回收', '打包服务'],
    rating: 4.6,
    checkinCount: 189,
    description: '专业可回收物处理中心，提供上门回收服务，累计积分可兑换礼品',
    contactPhone: '010-87654321',
    createTime: '2024-02-20',
    deviceStatus: 'normal',
    fillLevel: 60,
    lastStatusUpdate: '2024-06-21 09:00',
    hasSmartDevice: true,
    qrCode: 'drop_point_dp002'
  },
  {
    id: 'dp003',
    type: 'harmful',
    name: '北京站有害垃圾定点收集站',
    address: '北京市东城区北京站东街1号',
    latitude: 39.9042,
    longitude: 116.4271,
    distance: 1200,
    businessHours: {
      weekdays: '08:30-17:30',
      weekends: '09:00-16:00'
    },
    isOpenNow: false,
    supportedCategories: ['harmful'],
    facilities: ['防泄漏容器', '专业存储', '安全防护', '溯源系统'],
    rating: 4.9,
    checkinCount: 78,
    description: '官方指定有害垃圾收集站，配备专业存储设备，确保有害垃圾安全处理',
    contactPhone: '010-11112222',
    createTime: '2023-11-10',
    deviceStatus: 'full',
    fillLevel: 95,
    lastStatusUpdate: '2024-06-21 07:45',
    hasSmartDevice: true,
    qrCode: 'drop_point_dp003'
  },
  {
    id: 'dp004',
    type: 'garbage_station',
    name: '前门大街智能分类站',
    address: '北京市东城区前门大街12号',
    latitude: 39.8983,
    longitude: 116.3974,
    distance: 1500,
    businessHours: {
      weekdays: '24小时',
      weekends: '24小时'
    },
    isOpenNow: true,
    supportedCategories: ['kitchen', 'recyclable', 'harmful', 'other'],
    facilities: ['24小时投放', '智能识别', '自动称重', '积分系统'],
    rating: 4.7,
    checkinCount: 423,
    description: '24小时智能垃圾分类站，AI智能识别垃圾类型，投放即可获得积分',
    contactPhone: '010-33334444',
    createTime: '2024-03-01',
    deviceStatus: 'fault',
    fillLevel: 25,
    lastStatusUpdate: '2024-06-21 06:00',
    hasSmartDevice: true,
    qrCode: 'drop_point_dp004'
  },
  {
    id: 'dp005',
    type: 'garbage_station',
    name: '故宫社区分类投放点',
    address: '北京市东城区景山前街4号',
    latitude: 39.9163,
    longitude: 116.3972,
    distance: 950,
    businessHours: {
      weekdays: '06:30-21:30',
      weekends: '07:00-21:00'
    },
    isOpenNow: true,
    supportedCategories: ['kitchen', 'recyclable', 'harmful', 'other', 'bulky'],
    facilities: ['分类指导', '志愿者服务', '宣传展板', '休息区'],
    rating: 4.5,
    checkinCount: 312,
    description: '社区示范投放点，常年有志愿者提供分类指导，定期开展环保宣传活动',
    contactPhone: '010-55556666',
    createTime: '2023-08-15',
    deviceStatus: 'normal',
    fillLevel: 50,
    lastStatusUpdate: '2024-06-21 08:00',
    hasSmartDevice: false,
    qrCode: 'drop_point_dp005'
  },
  {
    id: 'dp006',
    type: 'recyclable',
    name: '崇文门旧物回收点',
    address: '北京市东城区崇文门外大街3号',
    latitude: 39.8994,
    longitude: 116.4158,
    distance: 1800,
    businessHours: {
      weekdays: '08:00-19:00',
      weekends: '09:00-18:00'
    },
    isOpenNow: true,
    supportedCategories: ['recyclable', 'electronic'],
    facilities: ['高价回收', '现场结算', '上门服务', '以旧换新'],
    rating: 4.4,
    checkinCount: 156,
    description: '专业旧物回收点，回收价格透明，支持以旧换新，现场结算',
    contactPhone: '010-77778888',
    createTime: '2023-09-20',
    deviceStatus: 'normal',
    fillLevel: 45,
    lastStatusUpdate: '2024-06-21 08:30',
    hasSmartDevice: false,
    qrCode: 'drop_point_dp006'
  },
  {
    id: 'dp007',
    type: 'garbage_station',
    name: '建国门社区分类站',
    address: '北京市东城区建国门内大街22号',
    latitude: 39.9091,
    longitude: 116.4350,
    distance: 2100,
    businessHours: {
      weekdays: '06:00-22:00',
      weekends: '06:00-22:00'
    },
    isOpenNow: true,
    supportedCategories: ['kitchen', 'recyclable', 'harmful', 'other'],
    facilities: ['四色垃圾桶', '洗手池', '照明', '监控设备'],
    rating: 4.3,
    checkinCount: 198,
    description: '标准化社区垃圾分类站，设备齐全，环境整洁',
    contactPhone: '010-99990000',
    createTime: '2023-07-10',
    deviceStatus: 'temp_closed',
    fillLevel: 0,
    lastStatusUpdate: '2024-06-20 18:00',
    hasSmartDevice: false,
    qrCode: 'drop_point_dp007'
  },
  {
    id: 'dp008',
    type: 'harmful',
    name: '东城区环保驿站',
    address: '北京市东城区和平里西街15号',
    latitude: 39.9421,
    longitude: 116.4186,
    distance: 3500,
    businessHours: {
      weekdays: '09:00-17:00',
      weekends: '休息'
    },
    isOpenNow: false,
    supportedCategories: ['harmful', 'electronic'],
    facilities: ['专业存储', '分类处理', '环保宣传', '咨询服务'],
    rating: 4.8,
    checkinCount: 67,
    description: '集有害垃圾收集、环保宣传、咨询服务于一体的综合性环保驿站',
    contactPhone: '010-12121212',
    createTime: '2023-12-01',
    deviceStatus: 'normal',
    fillLevel: 30,
    lastStatusUpdate: '2024-06-21 09:30',
    hasSmartDevice: true,
    qrCode: 'drop_point_dp008'
  },
  {
    id: 'dp009',
    type: 'recyclable',
    name: '朝阳门再生资源回收点',
    address: '北京市东城区朝阳门内大街199号',
    latitude: 39.9248,
    longitude: 116.4294,
    distance: 2800,
    businessHours: {
      weekdays: '07:30-18:30',
      weekends: '08:00-17:30'
    },
    isOpenNow: true,
    supportedCategories: ['recyclable', 'bulky', 'electronic'],
    facilities: ['大型回收设备', '货车装卸', '分类打包', '仓储服务'],
    rating: 4.6,
    checkinCount: 234,
    description: '大型再生资源回收点，支持大批量可回收物回收，配备专业设备',
    contactPhone: '010-34343434',
    createTime: '2023-06-15',
    deviceStatus: 'normal',
    fillLevel: 70,
    lastStatusUpdate: '2024-06-21 07:00',
    hasSmartDevice: true,
    qrCode: 'drop_point_dp009'
  },
  {
    id: 'dp010',
    type: 'garbage_station',
    name: '东直门交通枢纽分类站',
    address: '北京市东城区东直门外大街48号',
    latitude: 39.9416,
    longitude: 116.4349,
    distance: 4200,
    businessHours: {
      weekdays: '05:00-23:00',
      weekends: '05:00-23:00'
    },
    isOpenNow: true,
    supportedCategories: ['kitchen', 'recyclable', 'harmful', 'other'],
    facilities: ['大容量垃圾桶', '频繁清运', '保洁服务', '指示标识'],
    rating: 4.2,
    checkinCount: 567,
    description: '交通枢纽配套分类站，容量大，清运频率高，满足大流量需求',
    contactPhone: '010-56565656',
    createTime: '2023-05-20',
    deviceStatus: 'full',
    fillLevel: 88,
    lastStatusUpdate: '2024-06-21 08:15',
    hasSmartDevice: true,
    qrCode: 'drop_point_dp010'
  }
]

/**
 * 本地存储 Key
 */
const STORAGE_KEYS = {
  FAVORITES: 'drop_point_favorites',
  CHECKINS: 'drop_point_checkins',
  REPORTS: 'drop_point_reports',
  STATUS_HISTORY: 'drop_point_status_history',
  SCAN_HISTORY: 'drop_point_scan_history'
}

module.exports = {
  DROP_POINT_TYPES,
  SUPPORTED_CATEGORIES,
  DEVICE_STATUS,
  REPORT_TYPES,
  DROP_POINTS,
  STORAGE_KEYS
}
