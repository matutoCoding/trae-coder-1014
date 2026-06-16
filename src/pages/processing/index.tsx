import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import SectionCard from '@/components/SectionCard';
import StatCard from '@/components/StatCard';
import ListItem from '@/components/ListItem';
import FunctionGrid from '@/components/FunctionGrid';
import { dryingRecordList, finishedProductList } from '@/data/processing';
import { harvestRecordList, harvestSummary } from '@/data/harvest';
import { FunctionItem } from '@/types';
import classnames from 'classnames';

type TabType = 'harvest' | 'drying' | 'product';

const ProcessingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('harvest');

  const functionItems: FunctionItem[] = [
    { key: 'harvest', name: '采收登记', path: '/pages/harvest/index', bgColor: '#FFF7E6', textColor: '#FF7D00' },
    { key: 'drying', name: '晾晒加工', path: '/pages/drying/index', bgColor: '#E6F7FF', textColor: '#0077B6' },
    { key: 'package', name: '分级打包', path: '/pages/drying/index', bgColor: '#F3E8FF', textColor: '#722ED1' },
    { key: 'storage', name: '成品入库', path: '', bgColor: '#E8FBF2', textColor: '#00B42A' }
  ];

  const getTypeClass = (type: string) => {
    return type === '紫菜' ? styles.typeLaver : styles.typeKelp;
  };

  const getProcessClass = (type: string) => {
    return type === '晾晒' ? styles.processDrying : styles.processBaking;
  };

  const getGradeClass = (grade: string) => {
    switch (grade) {
      case '特级': return styles.gradeSuper;
      case '一级': return styles.gradeFirst;
      case '二级': return styles.gradeSecond;
      default: return styles.gradeSecond;
    }
  };

  const dryingStats = {
    totalInput: dryingRecordList.reduce((sum, r) => sum + r.inputQuantity, 0),
    totalOutput: dryingRecordList.reduce((sum, r) => sum + r.outputQuantity, 0),
    dryingCount: dryingRecordList.filter(r => r.processType === '晾晒').length,
    bakingCount: dryingRecordList.filter(r => r.processType === '烘干').length
  };

  const productStats = {
    totalPackages: finishedProductList.reduce((sum, p) => sum + p.packageCount, 0),
    totalWeight: finishedProductList.reduce((sum, p) => sum + p.totalWeight, 0),
    superGrade: finishedProductList.filter(p => p.grade === '特级').reduce((sum, p) => sum + p.totalWeight, 0)
  };

  const getQualityClass = (q: string) => {
    switch (q) {
      case '优': return styles.qualityExcellent;
      case '良': return styles.qualityGood;
      default: return styles.qualityNormal;
    }
  };

  const renderHarvest = () => (
    <>
      <View className={styles.summaryGrid}>
        <StatCard
          label="累计采收"
          value={harvestSummary.totalHarvest}
          unit={harvestSummary.unit}
          icon="🧺"
          bgColor="#FFF7E6"
          color="#FF7D00"
        />
        <StatCard
          label="本月采收"
          value={harvestSummary.thisMonth}
          unit="公斤"
          icon="📅"
          bgColor="#E6F7FF"
          color="#0077B6"
        />
        <StatCard
          label="紫菜采收"
          value={harvestSummary.seaweedCount}
          unit="公斤"
          icon="🌿"
          bgColor="#E8FBF2"
          color="#00B42A"
        />
        <StatCard
          label="海带采收"
          value={harvestSummary.kelpCount}
          unit="公斤"
          icon="🌊"
          bgColor="#E6F0FF"
          color="#0077B6"
        />
      </View>
      <SectionCard title="采收记录" subtitle={`共${harvestRecordList.length}条采收记录`}>
        <View className={styles.listContainer} style={{ padding: 0, boxShadow: 'none' }}>
          {harvestRecordList.map(record => (
            <ListItem
              key={record.id}
              title={
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className={classnames(styles.typeTag, getTypeClass(record.type))}>{record.type}</Text>
                  <Text>{record.seaAreaName}</Text>
                </View>
              }
              subtitle={`采收${record.quantity}${record.unit} · 品质${record.quality} · 操作员:${record.operator}`}
              desc={`采收日期:${record.harvestDate}`}
              tags={[{
                text: record.quality,
                bgColor: record.quality === '优' ? '#E8FBF2' : record.quality === '良' ? '#E6F7FF' : '#F2F3F5',
                textColor: record.quality === '优' ? '#00B42A' : record.quality === '良' ? '#0077B6' : '#86909C'
              }]}
              onClick={() => {
                console.log('[Processing] click harvest record:', record.id);
                Taro.navigateTo({ url: '/pages/harvest/index' });
              }}
            />
          ))}
        </View>
      </SectionCard>
    </>
  );

  const renderDrying = () => (
    <>
      <View className={styles.summaryGrid}>
        <StatCard label="投料总量" value={dryingStats.totalInput} unit="公斤" icon="📥" bgColor="#FFF7E6" color="#FF7D00" />
        <StatCard label="产出总量" value={dryingStats.totalOutput} unit="公斤" icon="📤" bgColor="#E8FBF2" color="#00B42A" />
        <StatCard label="晾晒批次" value={dryingStats.dryingCount} unit="批" icon="☀️" bgColor="#E6F7FF" color="#0077B6" />
        <StatCard label="烘干批次" value={dryingStats.bakingCount} unit="批" icon="🔥" bgColor="#F3E8FF" color="#722ED1" />
      </View>
      <SectionCard title="加工记录" subtitle={`共${dryingRecordList.length}条加工记录`}>
        <View className={styles.listContainer} style={{ padding: 0, boxShadow: 'none' }}>
          {dryingRecordList.map(record => (
            <ListItem
              key={record.id}
              title={
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className={classnames(styles.typeTag, getTypeClass(record.type))}>{record.type}</Text>
                  <Text className={classnames(styles.processTag, getProcessClass(record.processType))}>{record.processType}</Text>
                  <Text>批次 {record.batchNo}</Text>
                </View>
              }
              subtitle={`投料${record.inputQuantity}${record.inputUnit} → 产出${record.outputQuantity}${record.outputUnit}`}
              desc={`操作员:${record.operator} · ${record.remark}`}
              onClick={() => {
                console.log('[Processing] click drying record:', record.batchNo);
                Taro.navigateTo({ url: '/pages/drying/index' });
              }}
            />
          ))}
        </View>
      </SectionCard>
    </>
  );

  const renderProduct = () => (
    <>
      <View className={styles.summaryGrid}>
        <StatCard label="包装总数" value={productStats.totalPackages} unit="件" icon="📦" bgColor="#E6F7FF" color="#0077B6" />
        <StatCard label="成品重量" value={productStats.totalWeight} unit="公斤" icon="⚖️" bgColor="#E8FBF2" color="#00B42A" />
        <StatCard label="特级品" value={productStats.superGrade} unit="公斤" icon="🏆" bgColor="#FFE4CE" color="#D46B08" />
        <StatCard label="成品批次" value={finishedProductList.length} unit="批" icon="📋" bgColor="#F3E8FF" color="#722ED1" />
      </View>
      <SectionCard title="成品分级" subtitle="成品分级打包记录">
        <View className={styles.listContainer} style={{ padding: 0, boxShadow: 'none' }}>
          {finishedProductList.map(product => (
            <ListItem
              key={product.id}
              title={
                <View style={{ display: 'flex', alignItems: 'center' }}>
                  <Text className={classnames(styles.typeTag, getTypeClass(product.type))}>{product.type}</Text>
                  <Text className={classnames(styles.gradeTag, getGradeClass(product.grade))}>{product.grade}</Text>
                  <Text>{product.batchNo}</Text>
                </View>
              }
              subtitle={`${product.packageCount}件 · ${product.packageSpec} · 共${product.totalWeight}${product.unit}`}
              desc={`打包日期:${product.packageDate} · 库位:${product.storageLocation}`}
              onClick={() => {
                console.log('[Processing] click product:', product.batchNo);
                Taro.navigateTo({ url: '/pages/drying/index' });
              }}
            />
          ))}
        </View>
      </SectionCard>
    </>
  );

  return (
    <View className={styles.pageContainer}>
      <PageHeader
        title="加工记录"
        subtitle="采收登记 · 晾晒烘干 · 成品打包"
      />

      <SectionCard title="快捷操作">
        <FunctionGrid items={functionItems} columns={4} />
      </SectionCard>

      <View className={styles.tabs}>
        <Text
          className={classnames(styles.tabItem, activeTab === 'harvest' && styles.tabActive)}
          onClick={() => setActiveTab('harvest')}
        >
          采收记录
        </Text>
        <Text
          className={classnames(styles.tabItem, activeTab === 'drying' && styles.tabActive)}
          onClick={() => setActiveTab('drying')}
        >
          晾晒加工
        </Text>
        <Text
          className={classnames(styles.tabItem, activeTab === 'product' && styles.tabActive)}
          onClick={() => setActiveTab('product')}
        >
          成品打包
        </Text>
      </View>

      {activeTab === 'harvest' && renderHarvest()}
      {activeTab === 'drying' && renderDrying()}
      {activeTab === 'product' && renderProduct()}
    </View>
  );
};

export default ProcessingPage;
