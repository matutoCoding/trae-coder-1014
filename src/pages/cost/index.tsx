import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import { costItemList, costStats } from '@/data/cost';

const iconMap: Record<string, { icon: string; color: string }> = {
  '苗种': { icon: '🌱', color: '#E6F7FF' },
  '物资': { icon: '📦', color: '#FFF7E6' },
  '人工': { icon: '👷', color: '#E8FBF2' },
  '设备': { icon: '🔧', color: '#F3E8FF' },
  '运输': { icon: '🚚', color: '#E6FFFB' },
  '加工': { icon: '🏭', color: '#FFF0E6' },
  '其他': { icon: '📋', color: '#F2F3F5' }
};

const CostPage: React.FC = () => {
  return (
    <ScrollView scrollY className={styles.pageContainer} style={{ minHeight: '100vh' }}>
      <PageHeader title="成本核算" subtitle="养殖成本统计 · 收益分析" />

      <View className={styles.profitCard}>
        <Text className={styles.profitLabel}>净利润</Text>
        <Text className={styles.profitValue}>
          ¥{(costStats.netProfit / 10000).toFixed(2)}
          <Text className={styles.profitUnit}>万元</Text>
        </Text>
        <View className={styles.profitRow}>
          <View className={styles.profitItem}>
            <Text className={styles.profitItemValue}>¥{(costStats.totalCost / 10000).toFixed(1)}万</Text>
            <Text className={styles.profitItemLabel}>总成本</Text>
          </View>
          <View className={styles.profitItem}>
            <Text className={styles.profitItemValue}>¥{(costStats.totalRevenue / 10000).toFixed(1)}万</Text>
            <Text className={styles.profitItemLabel}>总收入</Text>
          </View>
          <View className={styles.profitItem}>
            <Text className={styles.profitItemValue}>{costStats.profitMargin}%</Text>
            <Text className={styles.profitItemLabel}>利润率</Text>
          </View>
        </View>
      </View>

      <View className={styles.breakdownCard}>
        <Text className={styles.sectionTitle}>成本构成</Text>
        {costStats.categoryBreakdown.map(item => {
          const cfg = iconMap[item.category] || iconMap['其他'];
          return (
            <View className={styles.breakdownItem} key={item.category}>
              <View className={styles.categoryIcon} style={{ backgroundColor: cfg.color }}>
                <Text>{cfg.icon}</Text>
              </View>
              <View className={styles.categoryInfo}>
                <Text className={styles.categoryName}>{item.category}</Text>
                <View className={styles.categoryBar}>
                  <View
                    className={styles.categoryBarFill}
                    style={{ width: `${item.percentage * 3}%` }}
                  />
                </View>
              </View>
              <View className={styles.categoryAmount}>
                <Text className={styles.categoryValue}>¥{item.amount.toLocaleString()}</Text>
                <Text className={styles.categoryPercent}>{item.percentage}%</Text>
              </View>
            </View>
          );
        })}
      </View>

      <View className={styles.recordCard}>
        <Text className={styles.sectionTitle}>支出明细</Text>
        {costItemList.map(item => (
          <View className={styles.recordRow} key={item.id}>
            <View className={styles.recordInfo}>
              <Text className={styles.recordName}>{item.name}</Text>
              <Text className={styles.recordMeta}>{item.category} · {item.date} · {item.operator}</Text>
            </View>
            <Text className={styles.recordAmount}>¥{item.amount.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CostPage;
