import React, { useCallback } from 'react';
import { View, Text, ScrollView, Button, usePullDownRefresh } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useCarbonStore } from '@/store/carbonStore';
import CarbonStatCard from '@/components/CarbonStatCard';
import CarbonChart from '@/components/CarbonChart';
import CompareBar from '@/components/CompareBar';
import RecordItem from '@/components/RecordItem';
import { formatCO2, formatWeight } from '@/utils/carbonCalculator';

const CarbonPage: React.FC = () => {
  const {
    stat,
    records,
    weeklyData,
    monthlyData,
    compareData,
    selectedPeriod,
    loading,
    fetchData,
    setSelectedPeriod,
    getEquivalents
  } = useCarbonStore();

  const equivalents = getEquivalents();
  const chartData = selectedPeriod === 'week' ? weeklyData : monthlyData;
  const recentRecords = records.slice(0, 3);

  usePullDownRefresh(() => {
    fetchData();
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  });

  const handleRecord = useCallback(() => {
    Taro.navigateTo({ url: '/pages/record/index' });
    console.log('[CarbonPage] 跳转到记录页面');
  }, []);

  const handleViewDetail = useCallback(() => {
    Taro.navigateTo({ url: '/pages/carbon-detail/index' });
    console.log('[CarbonPage] 跳转到减排明细');
  }, []);

  const handleViewCertificate = useCallback(() => {
    Taro.navigateTo({ url: '/pages/carbon-certificate/index' });
    console.log('[CarbonPage] 跳转到碳减排证明');
  }, []);

  const handleViewHonors = useCallback(() => {
    Taro.switchTab({ url: '/pages/honors/index' });
    console.log('[CarbonPage] 跳转到荣誉墙');
  }, []);

  const handleRecordClick = useCallback((id: string) => {
    console.log('[CarbonPage] 点击记录:', id);
  }, []);

  const equivalentIcons = {
    car: '🚗',
    tree: '🌳',
    electricity: '⚡',
    water: '💧'
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerContent}>
          <Text className={styles.headerTitle}>累计碳减排</Text>
          <View className={styles.totalCO2}>
            <Text className={styles.totalValue}>{stat.totalCO2.toFixed(1)}</Text>
            <Text className={styles.totalUnit}>kg CO₂</Text>
          </View>
          <Text className={styles.subtitle}>相当于为地球做出了巨大贡献 🌍</Text>

          <ScrollView
            scrollX
            className={styles.equivalentsScroll}
            showScrollbar={false}
          >
            <View className={styles.equivalentsContainer}>
              {equivalents.map((eq, index) => (
                <View key={index} className={styles.equivalentCard}>
                  <Text className={styles.equivalentIcon}>{equivalentIcons[eq.type]}</Text>
                  <Text className={styles.equivalentValue}>{eq.value}</Text>
                  <Text className={styles.equivalentLabel}>{eq.label}{eq.unit}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <ScrollView className={styles.content} scrollY>
        <View className={styles.todayCard}>
          <View className={styles.todayHeader}>
            <Text className={styles.todayTitle}>今日减排</Text>
            <View className={styles.todayCO2}>
              <Text className={styles.todayValue}>{stat.todayCO2.toFixed(2)}</Text>
              <Text className={styles.todayUnit}>kg CO₂</Text>
            </View>
          </View>
          <View className={styles.todayStats}>
            <View className={styles.todayStatItem}>
              <Text className={styles.todayStatValue}>
                {weeklyData[weeklyData.length - 1]?.classifyCount || 0}
              </Text>
              <Text className={styles.todayStatLabel}>正确分类</Text>
            </View>
            <View className={styles.todayStatItem}>
              <Text className={styles.todayStatValue}>
                {formatWeight(weeklyData[weeklyData.length - 1]?.recycleWeight || 0)}
              </Text>
              <Text className={styles.todayStatLabel}>回收重量</Text>
            </View>
            <View className={styles.todayStatItem}>
              <Text className={styles.todayStatValue}>
                {weeklyData[weeklyData.length - 1]?.reduceCount || 0}
              </Text>
              <Text className={styles.todayStatLabel}>减少使用</Text>
            </View>
          </View>
        </View>

        <View className={styles.quickActions}>
          <Button className={styles.quickActionBtn} onClick={handleRecord}>
            <Text className={styles.btnIcon}>✏️</Text>
            <Text>记录减排</Text>
          </Button>
          <Button className={styles.quickActionSecondary} onClick={handleViewHonors}>
            <Text className={styles.btnIcon}>🏆</Text>
            <Text>荣誉</Text>
          </Button>
        </View>

        <View className={styles.shortcuts}>
          <View className={styles.shortcutCard} onClick={handleViewCertificate}>
            <Text className={styles.shortcutIcon}>📜</Text>
            <Text className={styles.shortcutText}>减排证明</Text>
          </View>
          <View className={styles.shortcutCard} onClick={handleViewDetail}>
            <Text className={styles.shortcutIcon}>📊</Text>
            <Text className={styles.shortcutText}>明细账单</Text>
          </View>
        </View>

        <View className={styles.statsGrid}>
          <View className={styles.statCard}>
            <CarbonStatCard
              icon="✅"
              title="正确分类"
              value={stat.totalClassifyCount}
              unit="次"
              trend={{ value: 12, label: '较上周' }}
            />
          </View>
          <View className={styles.statCard}>
            <CarbonStatCard
              icon="♻️"
              title="回收重量"
              value={formatWeight(stat.totalRecycleWeight)}
              trend={{ value: 8, label: '较上周' }}
            />
          </View>
          <View className={styles.statCard}>
            <CarbonStatCard
              icon="🚫"
              title="减少使用"
              value={stat.totalReduceCount}
              unit="次"
              trend={{ value: 15, label: '较上周' }}
            />
          </View>
          <View className={styles.statCard}>
            <CarbonStatCard
              icon="💎"
              title="碳积分"
              value={stat.totalCarbonPoints}
              unit="分"
              highlight
            />
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>减排趋势</Text>
          </View>
          <View className={styles.tabBar}>
            <Button
              className={classnames(styles.tabItem, {
                [styles.active]: selectedPeriod === 'week'
              })}
              onClick={() => setSelectedPeriod('week')}
            >
              本周
            </Button>
            <Button
              className={classnames(styles.tabItem, {
                [styles.active]: selectedPeriod === 'month'
              })}
              onClick={() => setSelectedPeriod('month')}
            >
              本月
            </Button>
          </View>
          <CarbonChart data={chartData} type="bar" height={300} />
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>对比排名</Text>
          </View>
          <CompareBar title="组内排名" data={compareData.group} />
          <View style={{ height: 24 }} />
          <CompareBar title="城市排名" data={compareData.city} />
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <Text className={styles.sectionTitle}>最近记录</Text>
            <Text className={styles.sectionMore} onClick={handleViewDetail}>
              查看全部 →
            </Text>
          </View>
          {recentRecords.length > 0 ? (
            <View className={styles.recordsList}>
              {recentRecords.map((record) => (
                <RecordItem
                  key={record.id}
                  record={record}
                  onClick={() => handleRecordClick(record.id)}
                />
              ))}
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📝</Text>
              <Text className={styles.emptyText}>暂无记录，快去记录你的环保行动吧</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CarbonPage;
