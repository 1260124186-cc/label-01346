import { EmissionFactor, Equivalent, RecordCategory, ReduceSubCategory } from '@/types/carbon';

export const EMISSION_FACTORS: EmissionFactor[] = [
  {
    name: '正确垃圾分类',
    factor: 0.05,
    unit: 'kg CO₂/次',
    category: 'classify'
  },
  {
    name: '可回收物-纸类',
    factor: 1.5,
    unit: 'kg CO₂/kg',
    category: 'recycle',
    subCategory: 'paper'
  },
  {
    name: '可回收物-塑料',
    factor: 2.5,
    unit: 'kg CO₂/kg',
    category: 'recycle',
    subCategory: 'plastic'
  },
  {
    name: '可回收物-金属',
    factor: 3.0,
    unit: 'kg CO₂/kg',
    category: 'recycle',
    subCategory: 'metal'
  },
  {
    name: '可回收物-玻璃',
    factor: 0.8,
    unit: 'kg CO₂/kg',
    category: 'recycle',
    subCategory: 'glass'
  },
  {
    name: '可回收物-织物',
    factor: 1.2,
    unit: 'kg CO₂/kg',
    category: 'recycle',
    subCategory: 'textile'
  },
  {
    name: '可回收物-综合',
    factor: 1.8,
    unit: 'kg CO₂/kg',
    category: 'recycle',
    subCategory: 'mixed'
  },
  {
    name: '减少塑料袋',
    factor: 0.1,
    unit: 'kg CO₂/个',
    category: 'reduce',
    subCategory: 'plastic_bag'
  },
  {
    name: '减少一次性杯子',
    factor: 0.08,
    unit: 'kg CO₂/个',
    category: 'reduce',
    subCategory: 'disposable_cup'
  },
  {
    name: '减少一次性餐具',
    factor: 0.12,
    unit: 'kg CO₂/套',
    category: 'reduce',
    subCategory: 'disposable_tableware'
  },
  {
    name: '减少外卖餐盒',
    factor: 0.15,
    unit: 'kg CO₂/个',
    category: 'reduce',
    subCategory: 'takeout_box'
  },
  {
    name: '减少塑料瓶',
    factor: 0.09,
    unit: 'kg CO₂/个',
    category: 'reduce',
    subCategory: 'bottle'
  }
];

export const EQUIVALENT_FACTORS = {
  car: { factor: 0.2, unit: '公里', label: '少开车约' },
  tree: { factor: 18, unit: '棵', label: '少砍树约' },
  electricity: { factor: 0.5, unit: '度', label: '节约用电约' },
  water: { factor: 100, unit: '升', label: '节约用水约' }
};

export const getEmissionFactor = (
  category: RecordCategory,
  subCategory?: string
): EmissionFactor | undefined => {
  if (category === 'recycle' && subCategory) {
    return EMISSION_FACTORS.find(
      f => f.category === category && f.subCategory === subCategory
    ) || EMISSION_FACTORS.find(f => f.category === category && f.subCategory === 'mixed');
  }
  if (category === 'reduce' && subCategory) {
    return EMISSION_FACTORS.find(
      f => f.category === category && f.subCategory === subCategory
    );
  }
  return EMISSION_FACTORS.find(f => f.category === category);
};

export const calculateCO2 = (
  category: RecordCategory,
  subCategory?: string,
  amount: number = 1
): number => {
  const factor = getEmissionFactor(category, subCategory);
  if (!factor) return 0;
  return Number((factor.factor * amount).toFixed(2));
};

export const calculateCarbonPoints = (co2: number): number => {
  return Math.floor(co2 * 10);
};

export const calculateEquivalents = (co2Kg: number): Equivalent[] => {
  return Object.entries(EQUIVALENT_FACTORS).map(([type, config]) => ({
    type: type as Equivalent['type'],
    value: Number((co2Kg / config.factor).toFixed(1)),
    unit: config.unit,
    label: config.label
  }));
};

export const getReduceSubCategoryInfo = (subCategory: ReduceSubCategory | string) => {
  const map: Record<ReduceSubCategory | string, { name: string; icon: string }> = {
    plastic_bag: { name: '塑料袋', icon: '🛍️' },
    disposable_cup: { name: '一次性杯子', icon: '🥤' },
    disposable_tableware: { name: '一次性餐具', icon: '🥢' },
    takeout_box: { name: '外卖餐盒', icon: '📦' },
    bottle: { name: '塑料瓶', icon: '🧴' },
    others: { name: '其他一次性用品', icon: '♻️' }
  };
  return map[subCategory] || map.others;
};

export const getRecycleSubCategoryInfo = (subCategory: string) => {
  const map: Record<string, { name: string; icon: string }> = {
    paper: { name: '纸类', icon: '📄' },
    plastic: { name: '塑料', icon: '🔵' },
    metal: { name: '金属', icon: '🔩' },
    glass: { name: '玻璃', icon: '🫙' },
    textile: { name: '织物', icon: '👕' },
    mixed: { name: '综合', icon: '♻️' }
  };
  return map[subCategory] || map.mixed;
};

export const getCategoryInfo = (category: RecordCategory) => {
  const map: Record<RecordCategory, { name: string; icon: string; color: string }> = {
    classify: { name: '正确分类', icon: '✅', color: '#22c55e' },
    recycle: { name: '回收利用', icon: '♻️', color: '#3b82f6' },
    reduce: { name: '减少使用', icon: '🚫', color: '#f59e0b' },
    others: { name: '其他', icon: '📝', color: '#86909c' }
  };
  return map[category];
};

export const formatCO2 = (kg: number): string => {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} 吨`;
  }
  return `${kg.toFixed(2)} kg`;
};

export const formatWeight = (kg: number): string => {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} 吨`;
  }
  if (kg >= 1) {
    return `${kg.toFixed(1)} kg`;
  }
  return `${(kg * 1000).toFixed(0)} g`;
};
