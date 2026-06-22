import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useCarbonStore } from '@/store/carbonStore';
import { RecordCategory, ReduceSubCategory } from '@/types/carbon';
import {
  calculateCO2,
  calculateCarbonPoints,
  getCategoryInfo,
  getReduceSubCategoryInfo,
  getRecycleSubCategoryInfo,
  formatCO2
} from '@/utils/carbonCalculator';

const categories: { category: RecordCategory; icon: string; name: string }[] = [
  { category: 'classify', icon: '✅', name: '正确分类' },
  { category: 'recycle', icon: '♻️', name: '回收利用' },
  { category: 'reduce', icon: '🚫', name: '减少使用' }
];

const reduceSubCategories: ReduceSubCategory[] = [
  'plastic_bag',
  'disposable_cup',
  'disposable_tableware',
  'takeout_box',
  'bottle',
  'others'
];

const recycleSubCategories: string[] = [
  'paper',
  'plastic',
  'metal',
  'glass',
  'textile',
  'mixed'
];

const RecordPage: React.FC = () => {
  const { addRecord } = useCarbonStore();

  const [selectedCategory, setSelectedCategory] = useState<RecordCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const estimatedCO2 = useMemo(() => {
    if (!selectedCategory) return 0;
    return calculateCO2(selectedCategory, selectedSubCategory || undefined, quantity);
  }, [selectedCategory, selectedSubCategory, quantity]);

  const estimatedPoints = useMemo(() => {
    return calculateCarbonPoints(estimatedCO2);
  }, [estimatedCO2]);

  const canSubmit = useMemo(() => {
    return selectedCategory && quantity > 0;
  }, [selectedCategory, quantity]);

  const handleCategorySelect = useCallback((category: RecordCategory) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setQuantity(1);
    console.log('[RecordPage] 选择分类:', category);
  }, []);

  const handleSubCategorySelect = useCallback((subCategory: string) => {
    setSelectedSubCategory(subCategory === selectedSubCategory ? null : subCategory);
    console.log('[RecordPage] 选择子分类:', subCategory);
  }, [selectedSubCategory]);

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(999, prev + delta)));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !selectedCategory) return;

    setSubmitting(true);
    console.log('[RecordPage] 提交记录:', {
      category: selectedCategory,
      subCategory: selectedSubCategory,
      quantity
    });

    try {
      const categoryInfo = getCategoryInfo(selectedCategory);
      let title = categoryInfo.name;
      let subInfo: { name: string; icon: string } | null = null;

      if (selectedCategory === 'reduce' && selectedSubCategory) {
        subInfo = getReduceSubCategoryInfo(selectedSubCategory);
        title = `减少${subInfo.name}`;
      } else if (selectedCategory === 'recycle' && selectedSubCategory) {
        subInfo = getRecycleSubCategoryInfo(selectedSubCategory);
        title = `回收${subInfo.name}`;
      }

      addRecord({
        category: selectedCategory,
        subCategory: selectedSubCategory || undefined,
        title,
        description: '',
        count: selectedCategory !== 'recycle' ? quantity : undefined,
        weight: selectedCategory === 'recycle' ? quantity : undefined
      });

      Taro.showToast({
        title: '记录成功！',
        icon: 'success',
        duration: 1500
      });

      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('[RecordPage] 提交失败:', error);
      Taro.showToast({
        title: '记录失败，请重试',
        icon: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, selectedCategory, selectedSubCategory, quantity, addRecord]);

  const handleCancel = useCallback(() => {
    Taro.navigateBack();
  }, []);

  const renderSubCategories = () => {
    if (!selectedCategory) return null;

    if (selectedCategory === 'classify') {
      return (
        <View className={styles.tipsCard}>
          <Text className={styles.tipsText}>
            💡 正确垃圾分类可减少填埋和焚烧产生的碳排放，每次正确分类约减少 0.05kg CO₂
          </Text>
        </View>
      );
    }

    const subCategories = selectedCategory === 'reduce' ? reduceSubCategories : recycleSubCategories;
    const getInfo = selectedCategory === 'reduce'
      ? getReduceSubCategoryInfo
      : getRecycleSubCategoryInfo;

    return (
      <View className={styles.subCategoryGrid}>
        {subCategories.map((sub) => {
          const info = getInfo(sub);
          return (
            <View
              key={sub}
              className={classnames(styles.subCategoryItem, {
                [styles.active]: selectedSubCategory === sub
              })}
              onClick={() => handleSubCategorySelect(sub)}
            >
              <Text className={styles.subCategoryIcon}>{info.icon}</Text>
              <Text className={styles.subCategoryName}>{info.name}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>选择记录类型</Text>
          <View className={styles.categoryList}>
            {categories.map((cat) => (
              <View
                key={cat.category}
                className={classnames(styles.categoryCard, {
                  [styles.active]: selectedCategory === cat.category
                })}
                onClick={() => handleCategorySelect(cat.category)}
              >
                <Text className={styles.categoryIcon}>{cat.icon}</Text>
                <Text className={styles.categoryName}>{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {selectedCategory && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              {selectedCategory === 'classify' ? '小提示' : '选择具体类型'}
            </Text>
            {renderSubCategories()}
          </View>
        )}

        {selectedCategory && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              {selectedCategory === 'recycle' ? '回收重量' : '记录数量'}
            </Text>
            <View className={styles.inputCard}>
              <View className={styles.inputRow}>
                <Text className={styles.inputLabel}>
                  {selectedCategory === 'recycle' ? '重量' : '次数'}
                  <Text className={styles.inputUnit}>
                    {selectedCategory === 'recycle' ? '(kg)' : '(次)'}
                  </Text>
                </Text>
                <View className={styles.quantityControl}>
                  <Button
                    className={styles.quantityBtn}
                    onClick={() => handleQuantityChange(-1)}
                  >
                    -
                  </Button>
                  <Text className={styles.quantityValue}>{quantity}</Text>
                  <Button
                    className={classnames(styles.quantityBtn, styles.primary)}
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </Button>
                </View>
              </View>
            </View>
          </View>
        )}

        {selectedCategory && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>预计减排效果</Text>
            <View className={styles.previewCard}>
              <Text className={styles.previewTitle}>本次记录将产生以下环保效果</Text>
              <View className={styles.previewValues}>
                <View className={styles.previewItem}>
                  <Text className={styles.previewValue}>-{estimatedCO2.toFixed(2)}</Text>
                  <Text className={styles.previewUnit}>kg CO₂</Text>
                </View>
                <View className={styles.previewItem}>
                  <Text className={styles.previewValue}>+{estimatedPoints}</Text>
                  <Text className={styles.previewUnit}>碳积分</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {!selectedCategory && (
          <View className={styles.emptyTip}>
            <Text className={styles.emptyIcon}>👆</Text>
            <Text className={styles.emptyText}>请先选择记录类型</Text>
          </View>
        )}
      </View>

      <View className={styles.footer}>
        <Button className={styles.cancelBtn} onClick={handleCancel}>
          取消
        </Button>
        <Button
          className={styles.submitBtn}
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {submitting ? '提交中...' : '保存记录'}
        </Button>
      </View>
    </View>
  );
};

export default RecordPage;
