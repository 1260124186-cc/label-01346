import { create } from 'zustand';
import dayjs from 'dayjs';
import {
  CarbonRecord,
  CarbonStat,
  DailyData,
  Honor,
  Milestone,
  RecordCategory,
  ReduceSubCategory
} from '@/types/carbon';
import {
  calculateCO2,
  calculateCarbonPoints,
  calculateEquivalents
} from '@/utils/carbonCalculator';
import {
  mockRecords,
  mockHonors,
  mockMilestones,
  mockWeeklyData,
  mockMonthlyData,
  mockCompareData,
  mockStat
} from '@/data/carbonMock';

interface CarbonState {
  records: CarbonRecord[];
  stat: CarbonStat;
  honors: Honor[];
  milestones: Milestone[];
  weeklyData: DailyData[];
  monthlyData: DailyData[];
  compareData: { group: any[]; city: any[] };
  loading: boolean;
  selectedPeriod: 'week' | 'month';
  addRecord: (record: Omit<CarbonRecord, 'id' | 'createdAt' | 'co2Reduction' | 'carbonPoints'>) => void;
  fetchData: () => void;
  setSelectedPeriod: (period: 'week' | 'month') => void;
  getRecordById: (id: string) => CarbonRecord | undefined;
  getRecordsByDateRange: (startDate: string, endDate: string) => CarbonRecord[];
  getEquivalents: () => ReturnType<typeof calculateEquivalents>;
}

export const useCarbonStore = create<CarbonState>((set, get) => ({
  records: mockRecords,
  stat: mockStat,
  honors: mockHonors,
  milestones: mockMilestones,
  weeklyData: mockWeeklyData,
  monthlyData: mockMonthlyData,
  compareData: mockCompareData,
  loading: false,
  selectedPeriod: 'week',

  addRecord: (recordData) => {
    const co2Reduction = calculateCO2(
      recordData.category,
      recordData.subCategory,
      recordData.count || recordData.weight || 1
    );
    const carbonPoints = calculateCarbonPoints(co2Reduction);

    const newRecord: CarbonRecord = {
      ...recordData,
      id: `rec_${Date.now()}`,
      createdAt: dayjs().toISOString(),
      co2Reduction,
      carbonPoints,
      source: 'manual'
    };

    set((state) => {
      const newRecords = [newRecord, ...state.records];
      const newStat = { ...state.stat };
      newStat.totalCO2 += co2Reduction;
      newStat.totalCarbonPoints += carbonPoints;
      newStat.todayCO2 += co2Reduction;
      newStat.weekCO2 += co2Reduction;
      newStat.monthCO2 += co2Reduction;

      if (recordData.category === 'classify') {
        newStat.totalClassifyCount += recordData.count || 0;
      } else if (recordData.category === 'recycle') {
        newStat.totalRecycleWeight += recordData.weight || 0;
      } else if (recordData.category === 'reduce') {
        newStat.totalReduceCount += recordData.count || 0;
      }

      return {
        records: newRecords,
        stat: newStat
      };
    });

    console.log('[CarbonStore] 新增碳减排记录:', newRecord);
  },

  fetchData: () => {
    set({ loading: true });
    setTimeout(() => {
      set({ loading: false });
      console.log('[CarbonStore] 数据加载完成');
    }, 500);
  },

  setSelectedPeriod: (period) => {
    set({ selectedPeriod: period });
  },

  getRecordById: (id) => {
    return get().records.find((r) => r.id === id);
  },

  getRecordsByDateRange: (startDate, endDate) => {
    const start = dayjs(startDate).startOf('day');
    const end = dayjs(endDate).endOf('day');
    return get().records.filter((r) => {
      const recordDate = dayjs(r.createdAt);
      return recordDate.isAfter(start) && recordDate.isBefore(end);
    });
  },

  getEquivalents: () => {
    return calculateEquivalents(get().stat.totalCO2);
  }
}));
