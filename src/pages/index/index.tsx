import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import SectionCard from '@/components/SectionCard';
import FunctionGrid from '@/components/FunctionGrid';
import { seaAreaList, overviewStats, typhoonWarning } from '@/data/seaArea';
import { salesStats } from '@/data/sales';
import { harvestSummary } from '@/data/harvest';
import { appStore } from '@/store/appStore';
import { FunctionItem } from '@/types';
import classnames from 'classnames';

const IndexPage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => setTick(t => t + 1));
    return unsubscribe;
  }, []);

  const reinforceStats = appStore.getTaskStats();

  const functionItems: FunctionItem[] = [
    { key: 'seedling', name: '育苗管理', path: '/pages/seedling/index', bgColor: '#E6F7FF', textColor: '#0077B6' },
    { key: 'mariculture', name: '海上养殖', path: '/pages/mariculture/index', bgColor: '#E8FBF2', textColor: '#00B42A' },
    { key: 'harvest', name: '采收记录', path: '/pages/harvest/index', bgColor: '#FFF7E6', textColor: '#FF7D00' },
    { key: 'drying', name: '晾晒加工', path: '/pages/drying/index', bgColor: '#F3E8FF', textColor: '#722ED1' },
    { key: 'seaArea', name: '海区台账', path: '/pages/seaArea/index', bgColor: '#E6FFFB', textColor: '#00B42A' },
    { key: 'typhoon', name: '台风应对', path: '/pages/typhoon/index', bgColor: '#FFECE8', textColor: '#F53F3F' },
    { key: 'cost', name: '成本核算', path: '/pages/cost/index', bgColor: '#FFF0E6', textColor: '#FF7D00' },
    { key: 'order', name: '订单管理', path: 'switchTab:/pages/sales/index', bgColor: '#E6F0FF', textColor: '#0077B6' }
  ];

  const onPullDownRefresh = () => {
    console.log('[Index] pull down refresh');
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Taro.stopPullDownRefresh();
      Taro.showToast({ title: '刷新成功', icon: 'success' });
    }, 1000);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'normal':
        return styles.statusNormal;
      case 'warning':
        return styles.statusWarning;
      case 'danger':
        return styles.statusDanger;
      default:
        return styles.statusNormal;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'warning':
        return '预警';
      case 'danger':
        return '危险';
      default:
        return '正常';
    }
  };

  return (
    <ScrollView
      scrollY
      className={styles.pageContainer}
      style={{ minHeight: '100vh' }}
      refresherEnabled
      refresherTriggered={refreshing}
      onRefresherRefresh={onPullDownRefresh}
    >
      <View className={styles.hero}>
        <Text className={styles.heroTitle}>三都澳海养合作社</Text>
        <Text className={styles.heroSubtitle}>海带紫菜全产业链数字化管理平台</Text>
        <View className={styles.heroStats}>
          <View className={styles.heroStat}>
            <Text className={styles.heroStatValue}>
              {overviewStats.totalArea}
              <Text className={styles.heroStatUnit}>亩</Text>
            </Text>
            <Text className={styles.heroStatLabel}>养殖海区</Text>
          </View>
          <View className={styles.heroStat}>
            <Text className={styles.heroStatValue}>
              {overviewStats.totalSeedlings}
              <Text className={styles.heroStatUnit}>万</Text>
            </Text>
            <Text className={styles.heroStatLabel}>在养苗种</Text>
          </View>
          <View className={styles.heroStat}>
            <Text className={styles.heroStatValue}>
              {(salesStats.totalAmount / 10000).toFixed(1)}
              <Text className={styles.heroStatUnit}>万</Text>
            </Text>
            <Text className={styles.heroStatLabel}>累计销售</Text>
          </View>
        </View>
      </View>

      {typhoonWarning.active && (
        <View className={styles.warningCard} onClick={() => Taro.navigateTo({ url: '/pages/typhoon/index' })}>
          <View className={styles.warningHeader}>
            <Text className={styles.warningIcon}>🌀</Text>
            <Text className={styles.warningTitle}>{typhoonWarning.name}</Text>
            <Text className={styles.warningLevel}>{typhoonWarning.level}</Text>
          </View>
          <Text className={styles.warningInfo}>
            {typhoonWarning.distance} · {typhoonWarning.direction} · {typhoonWarning.expectedTime}
          </Text>
          <View className={styles.warningProgress}>
            <View className={styles.warningProgressBar}>
              <View className={styles.warningProgressFill} style={{ width: `${reinforceStats.progress}%` }} />
            </View>
            <Text className={styles.warningProgressText}>
              加固进度 {reinforceStats.progress}%（{reinforceStats.done}/{reinforceStats.total}项已完成）
            </Text>
          </View>
          <View className={styles.warningAdvice}>
            {typhoonWarning.advice.slice(0, 2).map((item, idx) => (
              <View className={styles.adviceItem} key={idx}>
                <View className={styles.adviceDot} />
                <Text>{item}</Text>
              </View>
            ))}
          </View>
          <Text className={styles.warningMore}>点击查看详情 →</Text>
        </View>
      )}

      <View className={styles.statGrid}>
        <StatCard
          label="本月采收"
          value={harvestSummary.thisMonth}
          unit="公斤"
          icon="🧺"
          bgColor="#FFF7E6"
          color="#FF7D00"
        />
        <StatCard
          label="待发货订单"
          value={salesStats.pendingOrders}
          unit="单"
          icon="📦"
          bgColor="#FFECE8"
          color="#F53F3F"
        />
        <StatCard
          label="优质品率"
          value={`${Math.round(harvestSummary.excellentRate * 100)}%`}
          icon="✅"
          bgColor="#E8FBF2"
          color="#00B42A"
        />
        <StatCard
          label="正常海区"
          value={overviewStats.normalAreaCount}
          unit="个"
          icon="🌊"
          bgColor="#E6F7FF"
          color="#0077B6"
        />
      </View>

      <SectionCard title="快捷功能" subtitle="常用业务操作入口">
        <FunctionGrid items={functionItems} columns={4} />
      </SectionCard>

      <SectionCard
        title="海区状态"
        subtitle="实时监测各养殖区状态"
        extra={<Text className={styles.viewAll} onClick={() => Taro.navigateTo({ url: '/pages/seaArea/index' })}>查看全部</Text>}
      >
        <View className={styles.seaAreaList}>
          {seaAreaList.slice(0, 3).map(area => (
            <View className={styles.seaAreaItem} key={area.id}>
              <View className={styles.seaAreaTop}>
                <Text className={styles.seaAreaName}>{area.name}</Text>
                <Text className={classnames(styles.statusTag, getStatusClass(area.status))}>
                  {getStatusText(area.status)}
                </Text>
              </View>
              <Text className={styles.seaAreaLocation}>📍 {area.location} · {area.area}亩 · {area.type}</Text>
              <View className={styles.seaAreaMetrics}>
                <View className={styles.metric}>
                  <Text className={styles.metricLabel}>水温</Text>
                  <Text className={styles.metricValue}>
                    {area.temperature}
                    <Text className={styles.metricUnit}>℃</Text>
                  </Text>
                </View>
                <View className={styles.metric}>
                  <Text className={styles.metricLabel}>盐度</Text>
                  <Text className={styles.metricValue}>
                    {area.salinity}
                    <Text className={styles.metricUnit}>‰</Text>
                  </Text>
                </View>
                <View className={styles.metric}>
                  <Text className={styles.metricLabel}>挂养</Text>
                  <Text className={styles.metricValue}>
                    {area.seedCount}
                    <Text className={styles.metricUnit}>万株</Text>
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </SectionCard>
    </ScrollView>
  );
};

export default IndexPage;
