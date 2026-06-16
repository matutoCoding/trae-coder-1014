import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import { typhoonWarning, seaAreaList } from '@/data/seaArea';
import classnames from 'classnames';

type TabType = 'warning' | 'reinforce' | 'supplies';

interface ReinforceTask {
  id: string;
  task: string;
  status: 'pending' | 'doing' | 'done';
  area: string;
  assignee: string;
}

interface SupplyItem {
  id: string;
  name: string;
  quantity: string;
  status: 'sufficient' | 'shortage';
  location: string;
}

const reinforceTasks: ReinforceTask[] = [
  { id: '1', task: '加固A区筏架缆绳', status: 'done', area: 'A区-东海湾', assignee: '张建国' },
  { id: '2', task: '收紧B区浮球固定索', status: 'done', area: 'B区-西洋岛', assignee: '李海生' },
  { id: '3', task: '加固C区养殖网帘', status: 'doing', area: 'C区-东冲口', assignee: '王明华' },
  { id: '4', task: '检查D区锚泊系统', status: 'doing', area: 'D区-牙城湾', assignee: '李海生' },
  { id: '5', task: '撤离E区海上人员', status: 'pending', area: 'E区-三沙港', assignee: '张建国' },
  { id: '6', task: '加固加工厂仓库门窗', status: 'pending', area: '加工厂', assignee: '陈主管' },
  { id: '7', task: '检查排水系统畅通', status: 'pending', area: '加工厂', assignee: '陈主管' },
  { id: '8', task: '固定露天晾晒设备', status: 'doing', area: '晾晒场', assignee: '王明华' }
];

const supplyList: SupplyItem[] = [
  { id: '1', name: '缆绳', quantity: '200米', status: 'sufficient', location: 'A区仓库' },
  { id: '2', name: '浮球备件', quantity: '50个', status: 'sufficient', location: 'A区仓库' },
  { id: '3', name: '加固钢索', quantity: '100米', status: 'shortage', location: '需调拨' },
  { id: '4', name: '防水篷布', quantity: '20张', status: 'sufficient', location: '加工厂仓库' },
  { id: '5', name: '沙袋', quantity: '100个', status: 'shortage', location: '需采购' },
  { id: '6', name: '应急照明', quantity: '10套', status: 'sufficient', location: '加工厂仓库' },
  { id: '7', name: '救生衣', quantity: '15件', status: 'sufficient', location: 'B区仓库' },
  { id: '8', name: '通讯设备', quantity: '5台', status: 'sufficient', location: '办公室' }
];

const TyphoonPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('warning');

  const taskStats = {
    total: reinforceTasks.length,
    done: reinforceTasks.filter(t => t.status === 'done').length,
    doing: reinforceTasks.filter(t => t.status === 'doing').length,
    pending: reinforceTasks.filter(t => t.status === 'pending').length
  };

  const supplyStats = {
    total: supplyList.length,
    sufficient: supplyList.filter(s => s.status === 'sufficient').length,
    shortage: supplyList.filter(s => s.status === 'shortage').length
  };

  const dangerAreas = seaAreaList.filter(a => a.status === 'danger' || a.status === 'warning');

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'done': return styles.taskDone;
      case 'doing': return styles.taskDoing;
      case 'pending': return styles.taskPending;
      default: return styles.taskPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done': return '已完成';
      case 'doing': return '进行中';
      case 'pending': return '待处理';
      default: return '待处理';
    }
  };

  const getSupplyStatusClass = (status: string) => {
    return status === 'sufficient' ? styles.supplySufficient : styles.supplyShortage;
  };

  const renderWarning = () => (
    <>
      <View className={styles.warningCard}>
        <View className={styles.warningHeader}>
          <Text className={styles.warningIcon}>🌀</Text>
          <View className={styles.warningInfo}>
            <Text className={styles.warningName}>{typhoonWarning.name}</Text>
            <Text className={styles.warningLevel}>{typhoonWarning.level}</Text>
          </View>
        </View>
        <View className={styles.warningDetails}>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>距离</Text>
            <Text className={styles.detailValue}>{typhoonWarning.distance}</Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>移动方向</Text>
            <Text className={styles.detailValue}>{typhoonWarning.direction}</Text>
          </View>
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>预计影响</Text>
            <Text className={styles.detailValue}>{typhoonWarning.expectedTime}</Text>
          </View>
        </View>
      </View>

      {dangerAreas.length > 0 && (
        <View className={styles.sectionCard}>
          <Text className={styles.sectionTitle}>⚠️ 受影响海区</Text>
          {dangerAreas.map(area => (
            <View className={styles.affectedArea} key={area.id}>
              <View className={styles.affectedHeader}>
                <Text className={styles.affectedName}>{area.name}</Text>
                <Text className={classnames(styles.riskBadge, area.status === 'danger' ? styles.riskDanger : styles.riskWarning)}>
                  {area.status === 'danger' ? '高风险' : '中风险'}
                </Text>
              </View>
              <Text className={styles.affectedInfo}>📍 {area.location} · {area.area}亩 · {area.type}</Text>
              <Text className={styles.affectedInfo}>🌡️ 水温{area.temperature}℃ · 盐度{area.salinity}‰ · 挂养{area.seedCount}万株</Text>
            </View>
          ))}
        </View>
      )}

      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>📋 防范建议</Text>
        {typhoonWarning.advice.map((item, idx) => (
          <View className={styles.adviceItem} key={idx}>
            <View className={styles.adviceDot} />
            <Text className={styles.adviceText}>{item}</Text>
          </View>
        ))}
      </View>
    </>
  );

  const renderReinforce = () => (
    <>
      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{taskStats.done}<Text className={styles.statUnit}>/{taskStats.total}</Text></Text>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{taskStats.doing}<Text className={styles.statUnit}>项</Text></Text>
          <Text className={styles.statLabel}>进行中</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{taskStats.pending}<Text className={styles.statUnit}>项</Text></Text>
          <Text className={styles.statLabel}>待处理</Text>
        </View>
      </View>

      <View className={styles.progressBar}>
        <View className={styles.progressFill} style={{ width: `${(taskStats.done / taskStats.total) * 100}%` }} />
      </View>
      <Text className={styles.progressText}>加固进度：{Math.round((taskStats.done / taskStats.total) * 100)}%</Text>

      {reinforceTasks.map(task => (
        <View className={styles.taskCard} key={task.id}>
          <View className={styles.taskHeader}>
            <Text className={styles.taskName}>{task.task}</Text>
            <Text className={classnames(styles.taskStatus, getStatusClass(task.status))}>
              {getStatusText(task.status)}
            </Text>
          </View>
          <View className={styles.taskMeta}>
            <Text className={styles.taskArea}>📍 {task.area}</Text>
            <Text className={styles.taskAssignee}>👤 {task.assignee}</Text>
          </View>
        </View>
      ))}
    </>
  );

  const renderSupplies = () => (
    <>
      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{supplyStats.sufficient}<Text className={styles.statUnit}>项</Text></Text>
          <Text className={styles.statLabel}>储备充足</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{supplyStats.shortage}<Text className={styles.statUnit}>项</Text></Text>
          <Text className={styles.statLabel}>储备不足</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{supplyStats.total}<Text className={styles.statUnit}>项</Text></Text>
          <Text className={styles.statLabel}>物资总数</Text>
        </View>
      </View>

      {supplyList.map(item => (
        <View className={styles.supplyCard} key={item.id}>
          <View className={styles.supplyHeader}>
            <Text className={styles.supplyName}>{item.name}</Text>
            <Text className={classnames(styles.supplyStatus, getSupplyStatusClass(item.status))}>
              {item.status === 'sufficient' ? '充足' : '不足'}
            </Text>
          </View>
          <View className={styles.supplyMeta}>
            <Text className={styles.supplyQty}>数量：{item.quantity}</Text>
            <Text className={styles.supplyLocation}>📍 {item.location}</Text>
          </View>
        </View>
      ))}
    </>
  );

  return (
    <ScrollView scrollY className={styles.pageContainer} style={{ minHeight: '100vh' }}>
      <PageHeader title="台风应对" subtitle="预警详情 · 加固事项 · 应急物资" />

      <View className={styles.tabs}>
        <Text className={classnames(styles.tabItem, activeTab === 'warning' && styles.tabActive)} onClick={() => setActiveTab('warning')}>预警详情</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'reinforce' && styles.tabActive)} onClick={() => setActiveTab('reinforce')}>加固事项</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'supplies' && styles.tabActive)} onClick={() => setActiveTab('supplies')}>应急物资</Text>
      </View>

      {activeTab === 'warning' && renderWarning()}
      {activeTab === 'reinforce' && renderReinforce()}
      {activeTab === 'supplies' && renderSupplies()}
    </ScrollView>
  );
};

export default TyphoonPage;
