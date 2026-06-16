import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import { seaAreaList, overviewStats, typhoonWarning } from '@/data/seaArea';
import classnames from 'classnames';
import { appStore } from '@/store/appStore';

type TypeFilter = 'all' | '紫菜' | '海带' | '混合';
type RiskFilter = 'all' | 'normal' | 'warning' | 'danger';

const SeaAreaPage: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');

  const reinforceStats = appStore.getTaskStats();

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

  const getAdvice = (area: typeof seaAreaList[0]) => {
    if (area.status === 'danger') {
      return {
        icon: '🔴',
        title: '应急处置建议',
        highlight: true,
        items: [
          '【立即】通知所有海上作业人员撤离至安全区域',
          '【紧急】加固筏架缆绳，收紧浮球固定索',
          '【必备】检查应急物资储备，启动应急预案',
          '【沟通】保持与合作社指挥中心通讯畅通'
        ]
      };
    }
    if (area.status === 'warning') {
      return {
        icon: '🟡',
        title: '风险防范建议',
        highlight: true,
        items: [
          '【巡查】加强设施巡检，排查筏架松动情况',
          '【准备】准备加固材料，随时应对台风',
          '【关注】密切关注气象动态，减少出海作业',
          '【预警】通知作业人员做好撤离准备'
        ]
      };
    }
    return {
      icon: '✅',
      title: '日常巡查建议',
      highlight: false,
      items: [
        '按频次进行水质监测（水温、盐度、PH值、溶解氧）',
        '定期检查浮球、缆绳、网帘等设施状况',
        '观察苗种生长状态，记录生长数据',
        '清理海区漂浮杂物，保持养殖环境整洁'
      ]
    };
  };

  const getTypeCategory = (typeStr: string): TypeFilter => {
    if (typeStr.includes('紫菜')) return '紫菜';
    if (typeStr.includes('海带')) return '海带';
    return '混合';
  };

  const filteredList = useMemo(() => {
    return seaAreaList.filter(area => {
      if (typeFilter !== 'all' && getTypeCategory(area.type) !== typeFilter) return false;
      if (riskFilter !== 'all' && area.status !== riskFilter) return false;
      return true;
    });
  }, [typeFilter, riskFilter]);

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
        <View className={styles.typhoonBanner} onClick={() => Taro.navigateTo({ url: '/pages/typhoon/index' })}>
          <View className={styles.typhoonHeader}>
            <Text className={styles.typhoonIcon}>🌀</Text>
            <View className={styles.typhoonInfo}>
              <Text className={styles.typhoonName}>{typhoonWarning.name}</Text>
              <Text className={styles.typhoonDetail}>{typhoonWarning.level} · {typhoonWarning.distance} · {typhoonWarning.direction}</Text>
            </View>
          </View>
          <Text className={styles.typhoonTime}>{typhoonWarning.expectedTime}</Text>
          <View className={styles.typhoonProgress}>
            <View className={styles.progressBarBg}>
              <View className={styles.progressBarFill} style={{ width: `${reinforceStats.progress}%` }} />
            </View>
            <Text className={styles.typhoonProgressText}>加固进度 {reinforceStats.progress}%（{reinforceStats.done}/{reinforceStats.total}项）</Text>
          </View>
        </View>
      )}

      <View className={styles.filterWrap}>
        <View className={styles.filterRow}>
          <Text className={styles.filterLabel}>品类：</Text>
          <View className={styles.filterOptions}>
            {[
              { key: 'all', label: '全部' },
              { key: '紫菜', label: '紫菜' },
              { key: '海带', label: '海带' },
              { key: '混合', label: '混合' }
            ].map(opt => (
              <Text
                key={opt.key}
                className={classnames(styles.filterOption, typeFilter === opt.key && styles.filterOptionActive)}
                onClick={() => setTypeFilter(opt.key as TypeFilter)}
              >
                {opt.label}
              </Text>
            ))}
          </View>
        </View>
        <View className={styles.filterRow}>
          <Text className={styles.filterLabel}>风险：</Text>
          <View className={styles.filterOptions}>
            {[
              { key: 'all', label: '全部', cls: '' },
              { key: 'normal', label: '正常', cls: styles.optNormal },
              { key: 'warning', label: '预警', cls: styles.optWarning },
              { key: 'danger', label: '危险', cls: styles.optDanger }
            ].map(opt => (
              <Text
                key={opt.key}
                className={classnames(
                  styles.filterOption,
                  riskFilter === opt.key && (styles.filterOptionActive || opt.cls)
                )}
                onClick={() => setRiskFilter(opt.key as RiskFilter)}
              >
                {opt.label}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {filteredList.length === 0 ? (
        <View className={styles.emptyTip}>
          <Text className={styles.emptyText}>暂无符合条件的海区</Text>
        </View>
      ) : (
        filteredList.map(area => {
          const advice = getAdvice(area);
          return (
            <View
              className={classnames(styles.areaCard, area.status === 'danger' && styles.areaCardDanger, area.status === 'warning' && styles.areaCardWarning)}
              key={area.id}
              onClick={() => Taro.navigateTo({ url: `/pages/seaAreaDetail/index?id=${area.id}` })}
            >
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

              <View className={classnames(styles.adviceSection, advice.highlight && styles.adviceSectionHighlight)}>
                <Text className={styles.adviceTitle}>
                  {advice.icon} {advice.title}
                </Text>
                {advice.items.map((item, idx) => (
                  <View className={styles.adviceItem} key={idx}>
                    <View className={classnames(styles.adviceDot, advice.highlight && styles.adviceDotHighlight)} />
                    <Text className={styles.adviceText}>{item}</Text>
                  </View>
                ))}
              </View>

              <Text className={styles.detailTip}>点击查看详情 →</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

export default SeaAreaPage;
