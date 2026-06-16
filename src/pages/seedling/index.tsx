import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import { seedlingBatchList } from '@/data/seedling';
import classnames from 'classnames';

type FilterType = 'all' | '紫菜' | '海带';
type StatusFilter = 'all' | '培育中' | '可放养' | '已放养';

const SeedlingPage: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredList = seedlingBatchList.filter(batch => {
    const typeMatch = typeFilter === 'all' || batch.type === typeFilter;
    const statusMatch = statusFilter === 'all' || batch.status === statusFilter;
    return typeMatch && statusMatch;
  });

  const stats = {
    total: seedlingBatchList.reduce((sum, b) => sum + b.quantity, 0),
    nurturing: seedlingBatchList.filter(b => b.status === '培育中').length,
    ready: seedlingBatchList.filter(b => b.status === '可放养').length,
    deployed: seedlingBatchList.filter(b => b.status === '已放养').length
  };

  const getTypeClass = (type: string) => type === '紫菜' ? styles.typeLaver : styles.typeKelp;
  const getQualityClass = (q: string) => {
    switch (q) {
      case '优': return styles.qualityExcellent;
      case '良': return styles.qualityGood;
      default: return styles.qualityNormal;
    }
  };
  const getStatusClass = (s: string) => {
    switch (s) {
      case '培育中': return styles.statusNurturing;
      case '可放养': return styles.statusReady;
      default: return styles.statusDeployed;
    }
  };

  return (
    <ScrollView scrollY className={styles.pageContainer} style={{ minHeight: '100vh' }}>
      <PageHeader title="育苗管理" subtitle="紫菜海带苗种培育批次管理" />

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.total}<Text className={styles.statUnit}>万株</Text></Text>
          <Text className={styles.statLabel}>在培总量</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.nurturing}<Text className={styles.statUnit}>批</Text></Text>
          <Text className={styles.statLabel}>培育中</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{stats.ready}<Text className={styles.statUnit}>批</Text></Text>
          <Text className={styles.statLabel}>可放养</Text>
        </View>
      </View>

      <View className={styles.filters}>
        {(['all', '紫菜', '海带'] as FilterType[]).map(t => (
          <Text
            key={t}
            className={classnames(styles.filterItem, typeFilter === t && styles.filterActive)}
            onClick={() => setTypeFilter(t)}
          >
            {t === 'all' ? '全部' : t}
          </Text>
        ))}
      </View>

      <View className={styles.filters}>
        {(['all', '培育中', '可放养', '已放养'] as StatusFilter[]).map(s => (
          <Text
            key={s}
            className={classnames(styles.filterItem, statusFilter === s && styles.filterActive)}
            onClick={() => setStatusFilter(s)}
          >
            {s === 'all' ? '全部状态' : s}
          </Text>
        ))}
      </View>

      {filteredList.map(batch => (
        <View className={styles.batchCard} key={batch.id}>
          <View className={styles.batchHeader}>
            <View className={styles.batchTitle}>
              <Text className={styles.batchNo}>{batch.batchNo}</Text>
              <Text className={classnames(styles.typeTag, getTypeClass(batch.type))}>{batch.type}</Text>
              <Text className={classnames(styles.qualityTag, getQualityClass(batch.quality))}>品质{batch.quality}</Text>
            </View>
            <Text className={classnames(styles.statusBadge, getStatusClass(batch.status))}>{batch.status}</Text>
          </View>

          <View className={styles.dataGrid}>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>品种</Text>
              <Text className={styles.dataValue}>{batch.variety}</Text>
            </View>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>数量</Text>
              <Text className={styles.dataValue}>{batch.quantity}{batch.unit}</Text>
            </View>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>育苗日期</Text>
              <Text className={styles.dataValue}>{batch.nurseryDate}</Text>
            </View>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>预计放养</Text>
              <Text className={styles.dataValue}>{batch.expectedDate}</Text>
            </View>
          </View>

          <Text className={styles.remark}>操作员：{batch.operator} · {batch.remark}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default SeedlingPage;
