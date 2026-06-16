import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import { dryingRecordList, finishedProductList } from '@/data/processing';
import classnames from 'classnames';

type TabType = 'drying' | 'package';

const DryingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('drying');

  const dryingStats = {
    totalInput: dryingRecordList.reduce((s, r) => s + r.inputQuantity, 0),
    totalOutput: dryingRecordList.reduce((s, r) => s + r.outputQuantity, 0)
  };

  const productStats = {
    totalPackages: finishedProductList.reduce((s, p) => s + p.packageCount, 0),
    totalWeight: finishedProductList.reduce((s, p) => s + p.totalWeight, 0)
  };

  const getTypeClass = (t: string) => t === '紫菜' ? styles.typeLaver : styles.typeKelp;
  const getProcessClass = (p: string) => p === '晾晒' ? styles.processDrying : styles.processBaking;
  const getGradeClass = (g: string) => {
    switch (g) {
      case '特级': return styles.gradeSuper;
      case '一级': return styles.gradeFirst;
      default: return styles.gradeSecond;
    }
  };

  const renderDrying = () => (
    <>
      <View className={styles.statsGrid}>
        <StatCard label="投料总量" value={dryingStats.totalInput} unit="公斤" icon="📥" bgColor="#FFF7E6" color="#FF7D00" />
        <StatCard label="产出总量" value={dryingStats.totalOutput} unit="公斤" icon="📤" bgColor="#E8FBF2" color="#00B42A" />
      </View>
      {dryingRecordList.map(record => (
        <View className={styles.card} key={record.id}>
          <View className={styles.cardHeader}>
            <View className={styles.cardTitle}>
              <Text className={classnames(styles.typeTag, getTypeClass(record.type))}>{record.type}</Text>
              <Text className={classnames(styles.processTag, getProcessClass(record.processType))}>{record.processType}</Text>
              <Text className={styles.titleText}>{record.batchNo}</Text>
            </View>
          </View>
          <View className={styles.dataGrid}>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>投料量</Text>
              <Text className={styles.dataValue}>{record.inputQuantity}{record.inputUnit}</Text>
            </View>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>产出量</Text>
              <Text className={styles.dataValue}>{record.outputQuantity}{record.outputUnit}</Text>
            </View>
          </View>
          <Text className={styles.footer}>
            加工：{record.startTime} ~ {record.endTime}
          </Text>
          <Text className={styles.footer} style={{ marginTop: '8rpx', paddingTop: 0, borderTop: 'none' }}>
            操作员：{record.operator} · {record.remark}
          </Text>
        </View>
      ))}
    </>
  );

  const renderPackage = () => (
    <>
      <View className={styles.statsGrid}>
        <StatCard label="包装总数" value={productStats.totalPackages} unit="件" icon="📦" bgColor="#E6F7FF" color="#0077B6" />
        <StatCard label="成品重量" value={productStats.totalWeight} unit="公斤" icon="⚖️" bgColor="#F3E8FF" color="#722ED1" />
      </View>
      {finishedProductList.map(product => (
        <View className={styles.card} key={product.id}>
          <View className={styles.cardHeader}>
            <View className={styles.cardTitle}>
              <Text className={classnames(styles.typeTag, getTypeClass(product.type))}>{product.type}</Text>
              <Text className={classnames(styles.gradeTag, getGradeClass(product.grade))}>{product.grade}</Text>
              <Text className={styles.titleText}>{product.batchNo}</Text>
            </View>
          </View>
          <View className={styles.packageGrid}>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>包装件数</Text>
              <Text className={styles.dataValue}>{product.packageCount}件</Text>
            </View>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>规格</Text>
              <Text className={styles.dataValue}>{product.packageSpec}</Text>
            </View>
            <View className={styles.dataItem}>
              <Text className={styles.dataLabel}>总重</Text>
              <Text className={styles.dataValue}>{product.totalWeight}{product.unit}</Text>
            </View>
          </View>
          <Text className={styles.footer}>打包日期：{product.packageDate} · 操作员：{product.operator}</Text>
          <Text className={styles.footer} style={{ marginTop: '8rpx', paddingTop: 0, borderTop: 'none' }}>库位：{product.storageLocation}</Text>
        </View>
      ))}
    </>
  );

  return (
    <ScrollView scrollY className={styles.pageContainer} style={{ minHeight: '100vh' }}>
      <PageHeader title="晾晒加工" subtitle="晾晒烘干 · 成品分级打包" />

      <View className={styles.tabs}>
        <Text className={classnames(styles.tabItem, activeTab === 'drying' && styles.tabActive)} onClick={() => setActiveTab('drying')}>加工记录</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'package' && styles.tabActive)} onClick={() => setActiveTab('package')}>成品打包</Text>
      </View>

      {activeTab === 'drying' && renderDrying()}
      {activeTab === 'package' && renderPackage()}
    </ScrollView>
  );
};

export default DryingPage;
