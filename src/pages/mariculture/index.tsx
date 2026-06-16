import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import { hangingRecordList, monitorDataList } from '@/data/farming';
import { seaAreaList } from '@/data/seaArea';
import classnames from 'classnames';

type TabType = 'hanging' | 'monitor';

const MariculturePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('hanging');

  const hangingStats = {
    totalRopes: hangingRecordList.reduce((s, r) => s + r.ropeCount, 0),
    totalFloats: hangingRecordList.reduce((s, r) => s + r.floatCount, 0),
    areaCount: new Set(hangingRecordList.map(r => r.seaAreaId)).size
  };

  const getTypeClass = (t: string) => t === '紫菜' ? styles.typeLaver : styles.typeKelp;

  const renderHanging = () => (
    <>
      <View className={styles.summaryGrid}>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>{hangingStats.totalRopes}<Text className={styles.summaryUnit}>根</Text></Text>
          <Text className={styles.summaryLabel}>挂养苗绳</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>{hangingStats.totalFloats}<Text className={styles.summaryUnit}>个</Text></Text>
          <Text className={styles.summaryLabel}>布设浮球</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>{hangingStats.areaCount}<Text className={styles.summaryUnit}>个</Text></Text>
          <Text className={styles.summaryLabel}>覆盖海区</Text>
        </View>
      </View>

      {hangingRecordList.map(record => {
        const area = seaAreaList.find(a => a.id === record.seaAreaId);
        return (
          <View className={styles.card} key={record.id}>
            <View className={styles.cardHeader}>
              <Text className={styles.cardTitle}>
                {record.seaAreaName}
                <Text className={classnames(styles.typeTag, getTypeClass(record.type))}>{record.type}</Text>
              </Text>
            </View>
            <View className={styles.infoGrid}>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>苗绳</Text>
                <Text className={styles.infoValue}>{record.ropeCount}根</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>绳长</Text>
                <Text className={styles.infoValue}>{record.ropeLength}米</Text>
              </View>
              <View className={styles.infoItem}>
                <Text className={styles.infoLabel}>浮球</Text>
                <Text className={styles.infoValue}>{record.floatCount}个</Text>
              </View>
            </View>
            <View className={styles.footer}>
              批次号：{record.batchNo} · 挂养日期：{record.hangingDate} · 操作员：{record.operator}
            </View>
            <View className={styles.footer} style={{ marginTop: '8rpx', paddingTop: 0, borderTop: 'none' }}>
              备注：{record.remark}
            </View>
          </View>
        );
      })}
    </>
  );

  const renderMonitor = () => (
    <View className={styles.monitorGrid}>
      {monitorDataList.map(data => (
        <View className={styles.monitorCard} key={data.id}>
          <Text className={styles.monitorTitle}>{data.seaAreaName}</Text>
          <View className={styles.monitorData}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>水温</Text>
              <Text className={styles.infoValue}>{data.temperature}℃</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>盐度</Text>
              <Text className={styles.infoValue}>{data.salinity}‰</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>pH值</Text>
              <Text className={styles.infoValue}>{data.ph}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>溶解氧</Text>
              <Text className={styles.infoValue}>{data.dissolvedOxygen}mg/L</Text>
            </View>
          </View>
          <View className={styles.footer}>
            {data.recordTime} · {data.weather}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView scrollY className={styles.pageContainer} style={{ minHeight: '100vh' }}>
      <PageHeader title="海上养殖" subtitle="苗绳挂养 · 浮球布设 · 水质监测" />

      <View className={styles.tabs}>
        <Text className={classnames(styles.tabItem, activeTab === 'hanging' && styles.tabActive)} onClick={() => setActiveTab('hanging')}>挂养登记</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'monitor' && styles.tabActive)} onClick={() => setActiveTab('monitor')}>监测数据</Text>
      </View>

      {activeTab === 'hanging' && renderHanging()}
      {activeTab === 'monitor' && renderMonitor()}
    </ScrollView>
  );
};

export default MariculturePage;
