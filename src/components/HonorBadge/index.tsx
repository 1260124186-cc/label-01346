import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Honor } from '@/types/carbon';

interface HonorBadgeProps {
  honor: Honor;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  currentValue?: number;
}

const HonorBadge: React.FC<HonorBadgeProps> = ({
  honor,
  size = 'medium',
  showProgress = false,
  currentValue = 0
}) => {
  const levelColors = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2'
  };

  const progress = showProgress
    ? Math.min(100, (currentValue / honor.requirement) * 100)
    : 100;

  return (
    <View
      className={classnames(styles.badge, styles[size], {
        [styles.achieved]: honor.achieved,
        [styles.locked]: !honor.achieved
      })}
      style={{
        borderColor: honor.achieved ? levelColors[honor.level] : undefined
      }}
    >
      <View
        className={styles.iconWrapper}
        style={{
          background: honor.achieved
            ? `linear-gradient(135deg, ${levelColors[honor.level]}33, ${levelColors[honor.level]}11)`
            : undefined
        }}
      >
        <Text className={styles.icon}>{honor.icon}</Text>
        {honor.achieved && (
          <View className={styles.levelBadge} style={{ background: levelColors[honor.level] }}>
            <Text className={styles.levelText}>
              {honor.level === 'bronze' ? '铜' : honor.level === 'silver' ? '银' : honor.level === 'gold' ? '金' : '铂'}
            </Text>
          </View>
        )}
      </View>
      <View className={styles.info}>
        <Text className={styles.name}>{honor.name}</Text>
        <Text className={styles.description}>{honor.description}</Text>
      </View>
      {showProgress && !honor.achieved && (
        <View className={styles.progressWrapper}>
          <View className={styles.progressBar}>
            <View
              className={styles.progressFill} style={{ width: `${progress}%` }} />
          </View>
          <Text className={styles.progressText}>
            {currentValue} / {honor.requirement}
          </Text>
        </View>
      )}
    </View>
  );
};

export default HonorBadge;
