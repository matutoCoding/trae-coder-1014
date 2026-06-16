import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import SectionCard from '@/components/SectionCard';
import ListItem from '@/components/ListItem';
import { seaAreaList } from '@/data/seaArea';
import { hangingRecordList, monitorDataList } from '@/data/farming';
import { harvestRecordList } from '@/data/harvest';
import classnames from 'classnames';

type DetailTab = 'hanging' | 'monitor' | 'harvest';

const SeaAreaDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;
  const [activeTab, setActiveTab] = useState<DetailTab>('hanging');

  const seaArea = seaAreaList.find(s => s.id === id) || seaAreaList[0];
  const hangingRecords = hangingRecordList.filter(h => h.seaAreaId === seaArea.id);
  const monitorRecords = monitorDataList.filter(m => m.seaAreaId === seaArea.id).slice(0, 10);
  const harvestRecords = harvestRecordList.filter(h => h.seaAreaId === seaArea.id);

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

  const advice = getAdvice(seaArea);
  const latestMonitor = monitorRecords[0];

  return (
    <ScrollView scrollY className={styles.pageContainer} style={{ minHeight: '100vh' }}>
      <PageHeader title={seaArea.name} subtitle={seaArea.location} />

      <View className={classnames(styles.infoCard, seaArea.status === 'danger' && styles.infoCardDanger, seaArea.status === 'warning' && styles.infoCardWarning)}>
        <View className={styles.infoHeader}>
          <Text className={styles.infoTitle}>{seaArea.name}</Text>
          <Text className={classnames(styles.statusBadge, getStatusClass(seaArea.status))}>
            {getStatusText(seaArea.status)}
          </Text>
        </View>
        <Text className={styles.infoType}>{seaArea.type}</Text>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>位置</Text>
            <Text className={styles.infoValue}>{seaArea.location}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>面积</Text>
            <Text className={styles.infoValue}>{seaArea.area}亩</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>挂养量</Text>
            <Text className={styles.infoValue}>{seaArea.seedCount}万株</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>建区时间</Text>
            <Text className={styles.infoValue}>{seaArea.createTime}</Text>
          </View>
        </View>
        <Text className={styles.infoDesc}>{seaArea.description}</Text>
      </View>

      {latestMonitor && (
        <View className={styles.monitorCard}>
          <Text className={styles.monitorCardTitle}>🌡️ 最新水质监测</Text>
          <View className={styles.monitorGrid}>
            <View className={styles.monitorItem}>
              <Text className={styles.monitorValue}>{latestMonitor.temperature}℃</Text>
              <Text className={styles.monitorLabel}>水温</Text>
            </View>
            <View className={styles.monitorItem}>
              <Text className={styles.monitorValue}>{latestMonitor.salinity}‰</Text>
              <Text className={styles.monitorLabel}>盐度</Text>
            </View>
            <View className={styles.monitorItem}>
              <Text className={styles.monitorValue}>PH{latestMonitor.ph}</Text>
              <Text className={styles.monitorLabel}>酸碱度</Text>
            </View>
            <View className={styles.monitorItem}>
              <Text className={styles.monitorValue}>{latestMonitor.dissolvedOxygen}mg/L</Text>
              <Text className={styles.monitorLabel}>溶解氧</Text>
            </View>
          </View>
          <Text className={styles.monitorTime}>监测时间：{latestMonitor.recordTime} · {latestMonitor.weather} · 记录人：{latestMonitor.operator}</Text>
        </View>
      )}

      <View className={classnames(styles.adviceCard, advice.highlight && styles.adviceCardHighlight)}>
        <Text className={styles.adviceTitle}>{advice.icon} {advice.title}</Text>
        {advice.items.map((item, idx) => (
          <View className={styles.adviceItem} key={idx}>
            <View className={classnames(styles.adviceDot, advice.highlight && styles.adviceDotHighlight)} />
            <Text className={styles.adviceText}>{item}</Text>
          </View>
        ))}
      </View>

      <View className={styles.summaryRow}>
        <StatCard label="挂养记录" value={hangingRecords.length} unit="条" icon="🌿" bgColor="#E6F7FF" color="#0077B6" />
        <StatCard label="监测数据" value={monitorRecords.length} unit="条" icon="📊" bgColor="#E8FBF2" color="#00B42A" />
        <StatCard label="采收记录" value={harvestRecords.length} unit="条" icon="🧺" bgColor="#FFF7E6" color="#FF7D00" />
      </View>

      <View className={styles.tabs}>
        <Text className={classnames(styles.tabItem, activeTab === 'hanging' && styles.tabActive)} onClick={() => setActiveTab('hanging')}>挂养记录</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'monitor' && styles.tabActive)} onClick={() => setActiveTab('monitor')}>水质监测</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'harvest' && styles.tabActive)} onClick={() => setActiveTab('harvest')}>采收记录</Text>
      </View>

      {activeTab === 'hanging' && (
        <SectionCard title="挂养记录" subtitle={`共${hangingRecords.length}条`}>
          {hangingRecords.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🌿</Text>
              <Text className={styles.emptyTitle}>暂无挂养记录</Text>
              <Text className={styles.emptyDesc}>该海区尚未进行苗绳挂养</Text>
              <Text className={styles.emptyBack} onClick={() => Taro.navigateBack()}>← 返回海区列表</Text>
            </View>
          ) : (
            hangingRecords.map(record => (
              <ListItem
                key={record.id}
                title={<Text>{record.type} · 批次{record.batchNo}</Text>}
                subtitle={`苗绳${record.ropeCount}条×${record.ropeLength}米 · 浮球${record.floatCount}个`}
                desc={`挂养日期：${record.hangingDate} · 操作员：${record.operator}`}
                onClick={() => Taro.navigateTo({ url: '/pages/mariculture/index' })}
              />
            ))
          )}
        </SectionCard>
      )}

      {activeTab === 'monitor' && (
        <SectionCard title="水质监测记录" subtitle={`最近${monitorRecords.length}条`}>
          {monitorRecords.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📊</Text>
              <Text className={styles.emptyTitle}>暂无监测数据</Text>
              <Text className={styles.emptyDesc}>该海区尚未进行水质监测</Text>
              <Text className={styles.emptyBack} onClick={() => Taro.navigateBack()}>← 返回海区列表</Text>
            </View>
          ) : (
            monitorRecords.map(record => (
              <ListItem
                key={record.id}
                title={<Text>{record.seaAreaName} 监测数据</Text>}
                subtitle={`🌡️${record.temperature}℃ · 🧂${record.salinity}‰ · PH${record.ph} · 💧${record.dissolvedOxygen}mg/L`}
                desc={`记录时间：${record.recordTime} · 天气：${record.weather} · 记录人：${record.operator}`}
              />
            ))
          )}
        </SectionCard>
      )}

      {activeTab === 'harvest' && (
        <SectionCard title="采收记录" subtitle={`共${harvestRecords.length}条`}>
          {harvestRecords.length === 0 ? (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🧺</Text>
              <Text className={styles.emptyTitle}>暂无采收记录</Text>
              <Text className={styles.emptyDesc}>该海区尚未进行采收作业</Text>
              <Text className={styles.emptyBack} onClick={() => Taro.navigateBack()}>← 返回海区列表</Text>
            </View>
          ) : (
            harvestRecords.map(record => (
              <ListItem
                key={record.id}
                title={<Text>{record.type} · 采收{record.quantity}{record.unit} · 品质{record.quality}</Text>}
                subtitle={`采收海区：${record.seaAreaName} · 操作员：${record.operator}`}
                desc={`采收日期：${record.harvestDate}`}
                tags={[{
                  text: record.quality,
                  bgColor: record.quality === '优' ? '#E8FBF2' : record.quality === '良' ? '#E6F7FF' : '#F2F3F5',
                  textColor: record.quality === '优' ? '#00B42A' : record.quality === '良' ? '#0077B6' : '#86909C'
                }]}
                onClick={() => Taro.navigateTo({ url: '/pages/harvest/index' })}
              />
            ))
          )}
        </SectionCard>
      )}
    </ScrollView>
  );
};

export default SeaAreaDetailPage;
