import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface CarbonStatCardProps {
  icon: string;
  title: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  trend?: {
    value: number;
    label: string;
  };
}

const CarbonStatCard: React.FC<CarbonStatCardProps> = ({
  icon,
  title,
  value,
  unit,
  highlight = false,
  trend
}) => {
  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <Text className={styles.icon}>{icon}</Text>
        <Text className={styles.title}>{title}</Text>
      </View>
      <View className={styles.content}>
        <Text className={`${styles.value} ${highlight ? styles.highlight : ''}`}>
          {value}
        </Text>
        {unit && <Text className={styles.unit}>{unit}</Text>}
      </View>
      {trend && (
        <View className={styles.trend}>
          <Text className={trend.value >= 0 ? styles.trendUp : styles.trendDown}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </Text>
          <Text className={styles.trendLabel}>{trend.label}</Text>
        </View>
      )}
    </View>
  );
};

export default CarbonStatCard;
