import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import { harvestRecordList, harvestSummary } from '@/data/harvest';
import classnames from 'classnames';

type FilterType = 'all' | '紫菜' | '海带';

const HarvestPage: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');

  const filteredList = harvestRecordList.filter(r => typeFilter === 'all' || r.type === typeFilter);

  const getTypeClass = (t: string) => t === '紫菜' ? styles.typeLaver : styles.typeKelp;
  const getQualityClass = (q: string) => {
    switch (q) {
      case '优': return styles.qualityExcellent;
      case '良': return styles.qualityGood;
      default: return styles.qualityNormal;
    }
  };

  return (
    <ScrollView scrollY className={styles.pageContainer} style={{ minHeight: '100vh' }}>
      <PageHeader title="采收记录" subtitle="收割采收登记 · 产量统计" />

      <View className={styles.summaryRow}>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>{harvestSummary.totalHarvest}<Text className={styles.summaryUnit}>{harvestSummary.unit}</Text></Text>
          <Text className={styles.summaryLabel}>累计采收</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>{harvestSummary.thisMonth}<Text className={styles.summaryUnit}>公斤</Text></Text>
          <Text className={styles.summaryLabel}>本月采收</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>{Math.round(harvestSummary.excellentRate * 100)}<Text className={styles.summaryUnit}>%</Text></Text>
          <Text className={styles.summaryLabel}>优质品率</Text>
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

      {filteredList.map(record => (
        <View className={styles.recordCard} key={record.id}>
          <View className={styles.recordHeader}>
            <View className={styles.recordTitle}>
              <Text className={classnames(styles.typeTag, getTypeClass(record.type))}>{record.type}</Text>
              <Text className={styles.recordName}>{record.seaAreaName}</Text>
            </View>
            <Text className={classnames(styles.qualityTag, getQualityClass(record.quality))}>品质{record.quality}</Text>
          </View>

          <View className={styles.dataRow}>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>采收量</Text>
              <Text className={styles.dataValue}>{record.quantity}{record.unit}</Text>
            </View>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>采收日期</Text>
              <Text className={styles.dataValue}>{record.harvestDate}</Text>
            </View>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>操作员</Text>
              <Text className={styles.dataValue}>{record.operator}</Text>
            </View>
          </View>

          <Text className={styles.footer}>备注：{record.remark}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default HarvestPage;
