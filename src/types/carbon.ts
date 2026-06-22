export type RecordCategory = 'classify' | 'recycle' | 'reduce' | 'others';

export type ReduceSubCategory = 
  | 'plastic_bag' 
  | 'disposable_cup' 
  | 'disposable_tableware' 
  | 'takeout_box' 
  | 'bottle' 
  | 'others';

export interface CarbonRecord {
  id: string;
  category: RecordCategory;
  subCategory?: ReduceSubCategory | string;
  title: string;
  description?: string;
  count?: number;
  weight?: number;
  co2Reduction: number;
  carbonPoints: number;
  createdAt: string;
  source?: 'manual' | 'order' | 'auto';
}

export interface CarbonStat {
  totalCO2: number;
  totalCarbonPoints: number;
  totalClassifyCount: number;
  totalRecycleWeight: number;
  totalReduceCount: number;
  todayCO2: number;
  weekCO2: number;
  monthCO2: number;
}

export interface DailyData {
  date: string;
  co2: number;
  classifyCount: number;
  recycleWeight: number;
  reduceCount: number;
}

export interface CompareData {
  label: string;
  value: number;
  isMe?: boolean;
}

export interface Honor {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  requirementType: 'co2' | 'points' | 'days' | 'count';
  achieved: boolean;
  achievedAt?: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  requirement: number;
  current: number;
  type: 'co2' | 'points' | 'streak';
  reward: string;
  completed: boolean;
}

export interface EmissionFactor {
  name: string;
  factor: number;
  unit: string;
  category: RecordCategory;
  subCategory?: string;
}

export interface Equivalent {
  type: 'car' | 'tree' | 'electricity' | 'water';
  value: number;
  unit: string;
  label: string;
}

export interface CertificateData {
  id: string;
  userName: string;
  period: string;
  startDate: string;
  endDate: string;
  totalCO2: number;
  totalClassifyCount: number;
  totalRecycleWeight: number;
  totalReduceCount: number;
  carbonPoints: number;
  generatedAt: string;
  certificateNo: string;
}
