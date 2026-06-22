import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { CompareData } from '@/types/carbon';

interface CompareBarProps {
  title: string;
  data: CompareData[];
  unit?: string;
}

const CompareBar: React.FC<CompareBarProps> = ({ title, data, unit = 'kg' }) => {
  const maxValue = useMemo(() => {
    return Math.max(...data.map(d => d.value)) * 1.1;
  }, [data]);

  return (
    <View className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <View className={styles.bars}>
        {data.map((item, index) => (
          <View key={index} className={styles.barItem}>
            <View className={styles.barLabel}>
              <Text className={`${styles.labelText} ${item.isMe ? styles.isMe : ''}`}>
                {item.label}
              </Text>
              <Text className={styles.valueText}>
                {item.value.toFixed(1)} {unit}
              </Text>
            </View>
            <View className={styles.barTrack}>
              <View
                className={`${styles.barFill} ${item.isMe ? styles.isMe : ''}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CompareBar;
