import dayjs from 'dayjs';
import {
  CarbonRecord,
  CarbonStat,
  DailyData,
  Honor,
  Milestone,
  CompareData
} from '@/types/carbon';

export const mockStat: CarbonStat = {
  totalCO2: 156.8,
  totalCarbonPoints: 1568,
  totalClassifyCount: 128,
  totalRecycleWeight: 45.6,
  totalReduceCount: 89,
  todayCO2: 2.35,
  weekCO2: 18.5,
  monthCO2: 72.3
};

export const mockRecords: CarbonRecord[] = [
  {
    id: 'rec_001',
    category: 'classify',
    title: '正确垃圾分类',
    description: '厨余垃圾准确分类',
    count: 3,
    co2Reduction: 0.15,
    carbonPoints: 2,
    createdAt: dayjs().subtract(2, 'hour').toISOString(),
    source: 'auto'
  },
  {
    id: 'rec_002',
    category: 'recycle',
    subCategory: 'paper',
    title: '回收纸类',
    description: '旧报纸、纸箱',
    weight: 2.5,
    co2Reduction: 3.75,
    carbonPoints: 38,
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    source: 'order'
  },
  {
    id: 'rec_003',
    category: 'reduce',
    subCategory: 'plastic_bag',
    title: '减少使用塑料袋',
    description: '自带购物袋',
    count: 2,
    co2Reduction: 0.2,
    carbonPoints: 2,
    createdAt: dayjs().subtract(1, 'day').toISOString(),
    source: 'manual'
  },
  {
    id: 'rec_004',
    category: 'recycle',
    subCategory: 'plastic',
    title: '回收塑料瓶',
    description: 'PET瓶回收',
    weight: 1.2,
    co2Reduction: 3.0,
    carbonPoints: 30,
    createdAt: dayjs().subtract(2, 'day').toISOString(),
    source: 'order'
  },
  {
    id: 'rec_005',
    category: 'classify',
    title: '正确垃圾分类',
    description: '可回收物分类投放',
    count: 5,
    co2Reduction: 0.25,
    carbonPoints: 3,
    createdAt: dayjs().subtract(2, 'day').toISOString(),
    source: 'auto'
  },
  {
    id: 'rec_006',
    category: 'reduce',
    subCategory: 'disposable_cup',
    title: '减少一次性杯子',
    description: '使用自带水杯',
    count: 1,
    co2Reduction: 0.08,
    carbonPoints: 1,
    createdAt: dayjs().subtract(3, 'day').toISOString(),
    source: 'manual'
  },
  {
    id: 'rec_007',
    category: 'recycle',
    subCategory: 'metal',
    title: '回收金属',
    description: '铝罐、铁皮盒',
    weight: 0.8,
    co2Reduction: 2.4,
    carbonPoints: 24,
    createdAt: dayjs().subtract(3, 'day').toISOString(),
    source: 'order'
  },
  {
    id: 'rec_008',
    category: 'reduce',
    subCategory: 'takeout_box',
    title: '减少外卖餐盒',
    description: '自带餐具用餐',
    count: 3,
    co2Reduction: 0.45,
    carbonPoints: 5,
    createdAt: dayjs().subtract(4, 'day').toISOString(),
    source: 'manual'
  },
  {
    id: 'rec_009',
    category: 'classify',
    title: '正确垃圾分类',
    description: '有害垃圾单独投放',
    count: 2,
    co2Reduction: 0.1,
    carbonPoints: 1,
    createdAt: dayjs().subtract(4, 'day').toISOString(),
    source: 'auto'
  },
  {
    id: 'rec_010',
    category: 'recycle',
    subCategory: 'textile',
    title: '回收旧衣物',
    description: '纯棉T恤、牛仔裤',
    weight: 3.5,
    co2Reduction: 4.2,
    carbonPoints: 42,
    createdAt: dayjs().subtract(5, 'day').toISOString(),
    source: 'order'
  },
  {
    id: 'rec_011',
    category: 'reduce',
    subCategory: 'disposable_tableware',
    title: '减少一次性餐具',
    description: '外出就餐自带餐具',
    count: 2,
    co2Reduction: 0.24,
    carbonPoints: 2,
    createdAt: dayjs().subtract(5, 'day').toISOString(),
    source: 'manual'
  },
  {
    id: 'rec_012',
    category: 'recycle',
    subCategory: 'glass',
    title: '回收玻璃瓶',
    description: '饮料瓶、酱料瓶',
    weight: 1.5,
    co2Reduction: 1.2,
    carbonPoints: 12,
    createdAt: dayjs().subtract(6, 'day').toISOString(),
    source: 'order'
  }
];

export const mockHonors: Honor[] = [
  {
    id: 'honor_001',
    name: '绿色新手',
    description: '完成首次碳减排记录',
    icon: '🌱',
    requirement: 1,
    requirementType: 'count',
    achieved: true,
    achievedAt: dayjs().subtract(30, 'day').toISOString(),
    level: 'bronze'
  },
  {
    id: 'honor_002',
    name: '分类达人',
    description: '累计正确分类50次',
    icon: '✅',
    requirement: 50,
    requirementType: 'count',
    achieved: true,
    achievedAt: dayjs().subtract(15, 'day').toISOString(),
    level: 'silver'
  },
  {
    id: 'honor_003',
    name: '回收先锋',
    description: '累计回收重量达20kg',
    icon: '♻️',
    requirement: 20,
    requirementType: 'co2',
    achieved: true,
    achievedAt: dayjs().subtract(10, 'day').toISOString(),
    level: 'silver'
  },
  {
    id: 'honor_004',
    name: '环保卫士',
    description: '累计减排CO₂达100kg',
    icon: '🛡️',
    requirement: 100,
    requirementType: 'co2',
    achieved: true,
    achievedAt: dayjs().subtract(3, 'day').toISOString(),
    level: 'gold'
  },
  {
    id: 'honor_005',
    name: '减塑英雄',
    description: '累计减少一次性用品100次',
    icon: '🥇',
    requirement: 100,
    requirementType: 'count',
    achieved: false,
    level: 'gold'
  },
  {
    id: 'honor_006',
    name: '碳中和大师',
    description: '累计减排CO₂达500kg',
    icon: '👑',
    requirement: 500,
    requirementType: 'co2',
    achieved: false,
    level: 'platinum'
  },
  {
    id: 'honor_007',
    name: '坚持之星',
    description: '连续记录30天',
    icon: '⭐',
    requirement: 30,
    requirementType: 'days',
    achieved: false,
    level: 'gold'
  },
  {
    id: 'honor_008',
    name: '碳积分达人',
    description: '碳积分累计达1000分',
    icon: '💎',
    requirement: 1000,
    requirementType: 'points',
    achieved: true,
    achievedAt: dayjs().subtract(5, 'day').toISOString(),
    level: 'silver'
  }
];

export const mockMilestones: Milestone[] = [
  {
    id: 'ms_001',
    name: '初始里程碑',
    description: '累计减排10kg CO₂',
    requirement: 10,
    current: 156.8,
    type: 'co2',
    reward: '绿色新手徽章',
    completed: true
  },
  {
    id: 'ms_002',
    name: '小有成就',
    description: '累计减排50kg CO₂',
    requirement: 50,
    current: 156.8,
    type: 'co2',
    reward: '环保先锋徽章',
    completed: true
  },
  {
    id: 'ms_003',
    name: '环保达人',
    description: '累计减排100kg CO₂',
    requirement: 100,
    current: 156.8,
    type: 'co2',
    reward: '环保卫士徽章 + 专属证书',
    completed: true
  },
  {
    id: 'ms_004',
    name: '绿色领袖',
    description: '累计减排200kg CO₂',
    requirement: 200,
    current: 156.8,
    type: 'co2',
    reward: '绿色领袖徽章 + 专属头像框',
    completed: false
  },
  {
    id: 'ms_005',
    name: '碳中和先锋',
    description: '累计减排500kg CO₂',
    requirement: 500,
    current: 156.8,
    type: 'co2',
    reward: '碳中和大师徽章 + 年度环保人物提名',
    completed: false
  }
];

export const mockWeeklyData: DailyData[] = [
  { date: dayjs().subtract(6, 'day').format('MM-DD'), co2: 3.2, classifyCount: 8, recycleWeight: 1.2, reduceCount: 5 },
  { date: dayjs().subtract(5, 'day').format('MM-DD'), co2: 2.8, classifyCount: 6, recycleWeight: 0.8, reduceCount: 3 },
  { date: dayjs().subtract(4, 'day').format('MM-DD'), co2: 4.5, classifyCount: 12, recycleWeight: 1.5, reduceCount: 6 },
  { date: dayjs().subtract(3, 'day').format('MM-DD'), co2: 1.8, classifyCount: 4, recycleWeight: 0, reduceCount: 2 },
  { date: dayjs().subtract(2, 'day').format('MM-DD'), co2: 3.5, classifyCount: 7, recycleWeight: 1.0, reduceCount: 4 },
  { date: dayjs().subtract(1, 'day').format('MM-DD'), co2: 2.3, classifyCount: 5, recycleWeight: 0.5, reduceCount: 3 },
  { date: dayjs().format('MM-DD'), co2: 2.35, classifyCount: 3, recycleWeight: 0, reduceCount: 2 }
];

export const mockMonthlyData: DailyData[] = [
  { date: '第1周', co2: 18.5, classifyCount: 45, recycleWeight: 5.2, reduceCount: 28 },
  { date: '第2周', co2: 22.3, classifyCount: 52, recycleWeight: 6.8, reduceCount: 35 },
  { date: '第3周', co2: 15.8, classifyCount: 38, recycleWeight: 4.5, reduceCount: 22 },
  { date: '第4周', co2: 15.7, classifyCount: 33, recycleWeight: 3.6, reduceCount: 19 }
];

export const mockCompareData: { group: CompareData[]; city: CompareData[] } = {
  group: [
    { label: '我', value: 18.5, isMe: true },
    { label: '组内平均', value: 12.3 },
    { label: '第1名', value: 25.6 },
    { label: '第2名', value: 22.1 },
    { label: '第3名', value: 19.8 }
  ],
  city: [
    { label: '我', value: 72.3, isMe: true },
    { label: '城市平均', value: 45.6 },
    { label: '城市Top 10%', value: 89.2 }
  ]
};
