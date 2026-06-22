import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { DailyData } from '@/types/carbon';

interface CarbonChartProps {
  data: DailyData[];
  type?: 'bar' | 'line';
  height?: number;
}

const CarbonChart: React.FC<CarbonChartProps> = ({ data, type = 'bar', height = 200 }) => {
  const maxValue = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map(d => d.co2)) * 1.2;
  }, [data]);

  const total = useMemo(() => {
    return data.reduce((sum, d) => sum + d.co2, 0);
  }, [data]);

  return (
    <View className={styles.chartContainer}>
      <View className={styles.chartHeader}>
        <Text className={styles.chartTitle}>减排趋势</Text>
        <Text className={styles.chartTotal}>总计 {total.toFixed(1)} kg CO₂</Text>
      </View>
      <View className={styles.chartWrapper} style={{ height: `${height}rpx` }}>
        <View className={styles.yAxis}>
          <Text className={styles.yLabel}>{maxValue.toFixed(1)}</Text>
          <Text className={styles.yLabel}>{(maxValue / 2).toFixed(1)}</Text>
          <Text className={styles.yLabel}>0</Text>
        </View>
        <View className={styles.chartContent}>
          <View className={styles.gridLines}>
            <View className={styles.gridLine} />
            <View className={styles.gridLine} />
            <View className={styles.gridLine} />
          </View>
          <View className={styles.barsContainer}>
            {data.map((item, index) => {
              const barHeight = (item.co2 / maxValue) * 100;
              return (
                <View key={index} className={styles.barItem}>
                  <View className={styles.barWrapper}>
                    {type === 'bar' ? (
                      <View
                        className={styles.bar}
                        style={{ height: `${barHeight}%` }}
                      >
                        <Text className={styles.barValue}>{item.co2.toFixed(1)}</Text>
                      </View>
                    ) : (
                      <View className={styles.linePoint} style={{ bottom: `${barHeight}%` }}>
                        <View className={styles.pointDot} />
                      </View>
                    )}
                  </View>
                  <Text className={styles.xLabel}>{item.date}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <View className={styles.legend}>
        <View className={styles.legendItem}>
          <View className={styles.legendDot} />
          <Text className={styles.legendText}>CO₂ 减排量 (kg)</Text>
        </View>
      </View>
    </View>
  );
};

export default CarbonChart;
