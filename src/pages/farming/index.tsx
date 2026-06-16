import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import SectionCard from '@/components/SectionCard';
import ListItem from '@/components/ListItem';
import { seedlingBatchList } from '@/data/seedling';
import { hangingRecordList, monitorDataList } from '@/data/farming';
import { FunctionItem } from '@/types';
import FunctionGrid from '@/components/FunctionGrid';
import classnames from 'classnames';

type TabType = 'seedling' | 'hanging' | 'monitor';

const FarmingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('seedling');

  const functionItems: FunctionItem[] = [
    { key: 'seedling', name: '育苗管理', path: '/pages/seedling/index', bgColor: '#E6F7FF', textColor: '#0077B6' },
    { key: 'mariculture', name: '挂养登记', path: '/pages/mariculture/index', bgColor: '#E8FBF2', textColor: '#00B42A' },
    { key: 'monitor', name: '监测记录', path: '/pages/mariculture/index', bgColor: '#FFF7E6', textColor: '#FF7D00' },
    { key: 'typhoon', name: '台风应对', path: '/pages/typhoon/index', bgColor: '#FFECE8', textColor: '#F53F3F' }
  ];

  const getTypeClass = (type: string) => {
    return type === '紫菜' ? styles.typeLaver : styles.typeKelp;
  };

  const getQualityClass = (quality: string) => {
    switch (quality) {
      case '优': return styles.qualityExcellent;
      case '良': return styles.qualityGood;
      case '中': return styles.qualityNormal;
      default: return styles.qualityNormal;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case '培育中': return styles.statusNurturing;
      case '可放养': return styles.statusReady;
      case '已放养': return styles.statusDeployed;
      default: return styles.statusNurturing;
    }
  };

  const seedlingStats = {
    total: seedlingBatchList.reduce((sum, b) => sum + b.quantity, 0),
    nurturing: seedlingBatchList.filter(b => b.status === '培育中').length,
    ready: seedlingBatchList.filter(b => b.status === '可放养').length
  };

  const hangingStats = {
    totalRopes: hangingRecordList.reduce((sum, r) => sum + r.ropeCount, 0),
    totalFloats: hangingRecordList.reduce((sum, r) => sum + r.floatCount, 0),
    totalAreas: new Set(hangingRecordList.map(r => r.seaAreaId)).size
  };

  const renderSeedling = () => (
    <>
      <View className={styles.summaryRow}>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>
            {seedlingStats.total}
            <Text className={styles.summaryUnit}>万株</Text>
          </Text>
          <Text className={styles.summaryLabel}>在培苗种</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>
            {seedlingStats.nurturing}
            <Text className={styles.summaryUnit}>批</Text>
          </Text>
          <Text className={styles.summaryLabel}>培育中</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>
            {seedlingStats.ready}
            <Text className={styles.summaryUnit}>批</Text>
          </Text>
          <Text className={styles.summaryLabel}>可放养</Text>
        </View>
      </View>
      <SectionCard title="苗种批次" subtitle={`共${seedlingBatchList.length}个批次`}>
        <View className={styles.listContainer} style={{ padding: 0, boxShadow: 'none' }}>
          {seedlingBatchList.map(batch => (
            <ListItem
              key={batch.id}
              title={
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className={classnames(styles.batchType, getTypeClass(batch.type))}>{batch.type}</Text>
                  <Text>{batch.batchNo}</Text>
                </View>
              }
              subtitle={`${batch.variety} · ${batch.quantity}${batch.unit} · 操作员:${batch.operator}`}
              desc={`育苗:${batch.nurseryDate} ~ 预计:${batch.expectedDate}`}
              tags={[
                { text: batch.quality, bgColor: 'transparent', textColor: 'inherit' },
                { text: batch.status, bgColor: 'transparent', textColor: 'inherit' }
              ].map(t => ({
                text: t.text,
                bgColor: t.text === batch.quality
                  ? (batch.quality === '优' ? '#E8FBF2' : batch.quality === '良' ? '#E6F7FF' : '#F2F3F5')
                  : (batch.status === '培育中' ? '#FFF7E6' : batch.status === '可放养' ? '#E8FBF2' : '#E6F7FF'),
                textColor: t.text === batch.quality
                  ? (batch.quality === '优' ? '#00B42A' : batch.quality === '良' ? '#0077B6' : '#86909C')
                  : (batch.status === '培育中' ? '#FF7D00' : batch.status === '可放养' ? '#00B42A' : '#0077B6')
              }))}
              onClick={() => {
                console.log('[Farming] click batch:', batch.batchNo);
                Taro.navigateTo({ url: '/pages/seedling/index' });
              }}
            />
          ))}
        </View>
      </SectionCard>
    </>
  );

  const renderHanging = () => (
    <>
      <View className={styles.summaryRow}>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>
            {hangingStats.totalRopes}
            <Text className={styles.summaryUnit}>根</Text>
          </Text>
          <Text className={styles.summaryLabel}>挂养苗绳</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>
            {hangingStats.totalFloats}
            <Text className={styles.summaryUnit}>个</Text>
          </Text>
          <Text className={styles.summaryLabel}>布设浮球</Text>
        </View>
        <View className={styles.summaryCard}>
          <Text className={styles.summaryValue}>
            {hangingStats.totalAreas}
            <Text className={styles.summaryUnit}>个</Text>
          </Text>
          <Text className={styles.summaryLabel}>覆盖海区</Text>
        </View>
      </View>
      <SectionCard title="挂养记录" subtitle={`共${hangingRecordList.length}条记录`}>
        <View className={styles.listContainer} style={{ padding: 0, boxShadow: 'none' }}>
          {hangingRecordList.map(record => (
            <ListItem
              key={record.id}
              title={
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className={classnames(styles.batchType, getTypeClass(record.type))}>{record.type}</Text>
                  <Text>{record.seaAreaName}</Text>
                </View>
              }
              subtitle={`批次:${record.batchNo} · 苗绳${record.ropeCount}根(${record.ropeLength}米) · 浮球${record.floatCount}个`}
              desc={`挂养日期:${record.hangingDate} · 操作员:${record.operator}`}
              onClick={() => {
                console.log('[Farming] click hanging record:', record.batchNo);
                Taro.navigateTo({ url: '/pages/mariculture/index' });
              }}
            />
          ))}
        </View>
      </SectionCard>
    </>
  );

  const renderMonitor = () => (
    <SectionCard title="监测数据" subtitle="各海区水质实时监测">
      <View className={styles.listContainer} style={{ padding: 0, boxShadow: 'none' }}>
        {monitorDataList.slice(0, 5).map(data => (
          <ListItem
            key={data.id}
            title={data.seaAreaName}
            subtitle={`记录时间:${data.recordTime} · 天气:${data.weather}`}
            desc={`操作员:${data.operator}`}
            right={
              <View style={{ textAlign: 'right' }}>
                <View style={{ display: 'flex', gap: '32rpx' }}>
                  <View>
                    <Text className={styles.monitorLabel}>水温</Text>
                    <View>
                      <Text className={styles.monitorValue}>
                        {data.temperature}
                        <Text className={styles.monitorUnit}>℃</Text>
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text className={styles.monitorLabel}>盐度</Text>
                    <View>
                      <Text className={styles.monitorValue}>
                        {data.salinity}
                        <Text className={styles.monitorUnit}>‰</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            }
          />
        ))}
      </View>
    </SectionCard>
  );

  return (
    <View className={styles.pageContainer}>
      <PageHeader
        title="养殖管理"
        subtitle="苗种培育 · 海上挂养 · 水质监测"
      />

      <SectionCard title="快捷操作">
        <FunctionGrid items={functionItems} columns={4} />
      </SectionCard>

      <View className={styles.tabs}>
        <Text
          className={classnames(styles.tabItem, activeTab === 'seedling' && styles.tabActive)}
          onClick={() => setActiveTab('seedling')}
        >
          育苗管理
        </Text>
        <Text
          className={classnames(styles.tabItem, activeTab === 'hanging' && styles.tabActive)}
          onClick={() => setActiveTab('hanging')}
        >
          挂养登记
        </Text>
        <Text
          className={classnames(styles.tabItem, activeTab === 'monitor' && styles.tabActive)}
          onClick={() => setActiveTab('monitor')}
        >
          监测数据
        </Text>
      </View>

      {activeTab === 'seedling' && renderSeedling()}
      {activeTab === 'hanging' && renderHanging()}
      {activeTab === 'monitor' && renderMonitor()}
    </View>
  );
};

export default FarmingPage;
