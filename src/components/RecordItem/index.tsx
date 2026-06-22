import React from 'react';
import { View, Text } from '@tarojs/components';
import dayjs from 'dayjs';
import styles from './index.module.scss';
import { CarbonRecord } from '@/types/carbon';
import {
  getCategoryInfo,
  getReduceSubCategoryInfo,
  getRecycleSubCategoryInfo,
  formatCO2,
  formatWeight
} from '@/utils/carbonCalculator';

interface RecordItemProps {
  record: CarbonRecord;
  onClick?: () => void;
}

const RecordItem: React.FC<RecordItemProps> = ({ record, onClick }) => {
  const categoryInfo = getCategoryInfo(record.category);
  let subInfo: { name: string; icon: string } | null = null;

  if (record.category === 'reduce' && record.subCategory) {
    subInfo = getReduceSubCategoryInfo(record.subCategory);
  } else if (record.category === 'recycle' && record.subCategory) {
    subInfo = getRecycleSubCategoryInfo(record.subCategory);
  }

  const sourceLabel = {
    manual: '手动记录',
    order: '回收订单',
    auto: '自动识别'
  };

  return (
    <View className={styles.item} onClick={onClick}>
      <View
        className={styles.icon}
        style={{ background: `${categoryInfo.color}11` }}
      >
        <Text className={styles.iconText}>{subInfo?.icon || categoryInfo.icon}</Text>
      </View>
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{record.title}</Text>
          <Text className={styles.co2}>-{formatCO2(record.co2Reduction)}</Text>
        </View>
        <View className={styles.meta}>
          <View className={styles.tags}>
            <Text
              className={styles.tag}
              style={{ background: `${categoryInfo.color}11`, color: categoryInfo.color }}
            >
              {categoryInfo.name}
            </Text>
            {subInfo && (
              <Text className={styles.tagSecondary}>{subInfo.name}</Text>
            )}
            {record.source && (
              <Text className={styles.tagSource}>
                {sourceLabel[record.source]}
              </Text>
            )}
          </View>
          <Text className={styles.time}>
            {dayjs(record.createdAt).format('MM-DD HH:mm')}
          </Text>
        </View>
        <View className={styles.details}>
          {record.count !== undefined && record.category !== 'recycle' && (
            <Text className={styles.detail}>数量: {record.count} 次</Text>
          )}
          {record.weight !== undefined && (
            <Text className={styles.detail}>重量: {formatWeight(record.weight)}</Text>
          )}
          <Text className={styles.points}>+{record.carbonPoints} 碳积分</Text>
        </View>
      </View>
    </View>
  );
};

export default RecordItem;
