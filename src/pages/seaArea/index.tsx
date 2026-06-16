import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import { seaAreaList, overviewStats, typhoonWarning } from '@/data/seaArea';
import classnames from 'classnames';

const SeaAreaPage: React.FC = () => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal': return styles.statusNormal;
      case 'warning': return styles.statusWarning;
      case 'danger': return styles.statusDanger;
      default: return styles.statusNormal;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '正常';
      case 'warning': return '预警';
      case 'danger': return '危险';
      default: return '正常';
    }
  };

  const getTyphoonAdvice = (area: typeof seaAreaList[0]) => {
    if (area.status === 'danger') {
      return [
        '立即加固筏架，收紧浮球缆绳',
        '撤离海上作业人员',
        '检查应急物资储备',
        '启动防灾应急预案'
      ];
    }
    if (area.status === 'warning') {
      return [
        '加强设施巡检',
        '准备加固材料',
        '关注气象动态',
        '减少出海作业'
      ];
    }
    return ['保持日常巡查', '关注天气变化'];
  };

  return (
    <ScrollView scrollY className={styles.pageContainer} style={{ minHeight: '100vh' }}>
      <PageHeader title="海区台账" subtitle="养殖海区分布 · 风险监测 · 台风应对" />

      <View className={styles.summaryGrid}>
        <StatCard label="养殖总面积" value={overviewStats.totalArea} unit="亩" icon="🗺️" bgColor="#E6F7FF" color="#0077B6" />
        <StatCard label="海区数量" value={overviewStats.seaAreaCount} unit="个" icon="🌊" bgColor="#E8FBF2" color="#00B42A" />
        <StatCard label="预警海区" value={overviewStats.warningAreaCount} unit="个" icon="⚠️" bgColor="#FFF7E6" color="#FF7D00" />
        <StatCard label="危险海区" value={overviewStats.dangerAreaCount} unit="个" icon="🔴" bgColor="#FFECE8" color="#F53F3F" />
      </View>

      {typhoonWarning.active && (
        <View className={styles.typhoonBanner}>
          <View className={styles.typhoonHeader}>
            <Text className={styles.typhoonIcon}>🌀</Text>
            <View className={styles.typhoonInfo}>
              <Text className={styles.typhoonName}>{typhoonWarning.name}</Text>
              <Text className={styles.typhoonDetail}>{typhoonWarning.level} · {typhoonWarning.distance} · {typhoonWarning.direction}</Text>
            </View>
          </View>
          <Text className={styles.typhoonTime}>{typhoonWarning.expectedTime}</Text>
        </View>
      )}

      {seaAreaList.map(area => (
        <View className={styles.areaCard} key={area.id}>
          <View className={styles.cardHeader}>
            <View className={styles.cardTitleRow}>
              <Text className={styles.areaName}>{area.name}</Text>
              <Text className={classnames(styles.statusBadge, getStatusClass(area.status))}>
                {getStatusText(area.status)}
              </Text>
            </View>
            <Text className={styles.areaType}>{area.type}</Text>
          </View>

          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>位置</Text>
              <Text className={styles.infoValue}>{area.location}</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>面积</Text>
              <Text className={styles.infoValue}>{area.area}亩</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>水温</Text>
              <Text className={styles.infoValue}>{area.temperature}℃</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>盐度</Text>
              <Text className={styles.infoValue}>{area.salinity}‰</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>挂养量</Text>
              <Text className={styles.infoValue}>{area.seedCount}万株</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoLabel}>建区时间</Text>
              <Text className={styles.infoValue}>{area.createTime}</Text>
            </View>
          </View>

          <Text className={styles.areaDesc}>{area.description}</Text>

          {(area.status === 'warning' || area.status === 'danger') && (
            <View className={styles.adviceSection}>
              <Text className={styles.adviceTitle}>
                {area.status === 'danger' ? '🔴 应急建议' : '🟡 防范建议'}
              </Text>
              {getTyphoonAdvice(area).map((item, idx) => (
                <View className={styles.adviceItem} key={idx}>
                  <View className={styles.adviceDot} />
                  <Text className={styles.adviceText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default SeaAreaPage;
