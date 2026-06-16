import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import { typhoonWarning, seaAreaList } from '@/data/seaArea';
import { appStore } from '@/store/appStore';
import classnames from 'classnames';

type TabType = 'warning' | 'reinforce' | 'byArea' | 'daily' | 'supplies';

interface SupplyItem {
  id: string;
  name: string;
  quantity: string;
  status: 'sufficient' | 'shortage';
  location: string;
}

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
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = appStore.subscribe(() => setTick(t => t + 1));
    return unsubscribe;
  }, []);

  const reinforceTasks = appStore.getReinforceTasks();
  const taskStats = appStore.getTaskStats();
  const areaTaskStats = appStore.getAreaTaskStats();

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

  const getNextStatus = (status: string) => {
    switch (status) {
      case 'pending': return 'doing';
      case 'doing': return 'done';
      case 'done': return 'pending';
      default: return 'pending';
    }
  };

  const handleStatusChange = (id: string, currentStatus: string) => {
    const next = getNextStatus(currentStatus) as 'pending' | 'doing' | 'done';
    appStore.updateTaskStatus(id, next);
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
          <View className={styles.detailRow}>
            <Text className={styles.detailLabel}>加固进度</Text>
            <Text className={styles.detailValue}>
              {taskStats.progress}%（{taskStats.done}/{taskStats.total}项）
            </Text>
          </View>
        </View>
        <View className={styles.miniProgressBar}>
          <View className={styles.miniProgressFill} style={{ width: `${taskStats.progress}%` }} />
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
        <View className={styles.progressFill} style={{ width: `${taskStats.progress}%` }} />
      </View>
      <Text className={styles.progressText}>加固进度：{taskStats.progress}%</Text>
      <Text className={styles.progressHint}>💡 点击状态标签可切换：待处理 → 进行中 → 已完成</Text>

      {reinforceTasks.map(task => (
        <View className={styles.taskCard} key={task.id}>
          <View className={styles.taskHeader}>
            <Text className={styles.taskName}>{task.task}</Text>
            <Text
              className={classnames(styles.taskStatus, styles.taskStatusClickable, getStatusClass(task.status))}
              onClick={() => handleStatusChange(task.id, task.status)}
            >
              {getStatusText(task.status)} ↻
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

  const renderByArea = () => (
    <>
      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{areaTaskStats.length}<Text className={styles.statUnit}>个</Text></Text>
          <Text className={styles.statLabel}>涉及区域</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{areaTaskStats.filter(a => a.progress === 100).length}<Text className={styles.statUnit}>个</Text></Text>
          <Text className={styles.statLabel}>已全部完成</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>{areaTaskStats.filter(a => a.progress < 50).length}<Text className={styles.statUnit}>个</Text></Text>
          <Text className={styles.statLabel}>需重点关注</Text>
        </View>
      </View>

      <Text className={styles.progressHint}>💡 按完成进度从低到高排序，优先处理未完成的高风险海区</Text>

      {areaTaskStats.map(areaStat => {
        const areaInfo = seaAreaList.find(a => a.name === areaStat.area);
        const isHighRisk = areaInfo && (areaInfo.status === 'danger' || areaInfo.status === 'warning');
        return (
          <View className={classnames(styles.areaCard, isHighRisk && styles.areaCardHighRisk)} key={areaStat.area}>
            <View className={styles.areaHeader}>
              <View className={styles.areaHeaderLeft}>
                <Text className={styles.areaName}>{areaStat.area}</Text>
                {isHighRisk && (
                  <Text className={classnames(styles.riskBadge, areaInfo!.status === 'danger' ? styles.riskDanger : styles.riskWarning)}>
                    {areaInfo!.status === 'danger' ? '高风险' : '中风险'}
                  </Text>
                )}
              </View>
              <Text className={classnames(
                styles.areaProgressBadge,
                areaStat.progress === 100 ? styles.progressAllDone :
                areaStat.progress >= 50 ? styles.progressHalf : styles.progressLow
              )}>
                {areaStat.progress}%
              </Text>
            </View>
            <View className={styles.areaBarRow}>
              <View className={styles.areaProgressBar}>
                <View
                  className={classnames(
                    styles.areaProgressFill,
                    areaStat.progress === 100 ? styles.fillDone :
                    areaStat.progress >= 50 ? styles.fillHalf : styles.fillLow
                  )}
                  style={{ width: `${areaStat.progress}%` }}
                />
              </View>
            </View>
            <View className={styles.areaStatsRow}>
              <View className={styles.areaMiniStat}>
                <Text className={styles.areaMiniNumDone}>{areaStat.done}</Text>
                <Text className={styles.areaMiniLabel}>已完成</Text>
              </View>
              <View className={styles.areaMiniStat}>
                <Text className={styles.areaMiniNumDoing}>{areaStat.doing}</Text>
                <Text className={styles.areaMiniLabel}>进行中</Text>
              </View>
              <View className={styles.areaMiniStat}>
                <Text className={styles.areaMiniNumPending}>{areaStat.pending}</Text>
                <Text className={styles.areaMiniLabel}>待处理</Text>
              </View>
              <View className={styles.areaMiniStat}>
                <Text className={styles.areaMiniNum}>{areaStat.total}</Text>
                <Text className={styles.areaMiniLabel}>任务总计</Text>
              </View>
            </View>
            {areaStat.tasks && areaStat.tasks.length > 0 && (
              <View className={styles.areaTaskList}>
                {areaStat.tasks.map(t => (
                  <View className={styles.areaTaskItem} key={t.id}>
                    <View className={styles.areaTaskDot} />
                    <Text className={styles.areaTaskText}>{t.task}</Text>
                    <Text className={classnames(styles.areaTaskStatus,
                      t.status === 'done' ? styles.taskDone : t.status === 'doing' ? styles.taskDoing : styles.taskPending
                    )}>
                      {getStatusText(t.status)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </>
  );

  const renderDaily = () => {
    const today = new Date().toLocaleDateString('zh-CN');
    const completedToday = reinforceTasks.filter(t => t.status === 'done');
    const pendingTotal = reinforceTasks.filter(t => t.status === 'pending');

    const dailyByArea = areaTaskStats.map(areaStat => {
      const areaInfo = seaAreaList.find(a => a.name === areaStat.area);
      const isHighRisk = areaInfo && (areaInfo.status === 'danger' || areaInfo.status === 'warning');
      const pendingTasks = areaStat.tasks.filter(t => t.status === 'pending');
      const doingTasks = areaStat.tasks.filter(t => t.status === 'doing');
      const assignees = [...new Set(areaStat.tasks.map(t => t.assignee))];
      return {
        ...areaStat,
        areaInfo,
        isHighRisk,
        pendingTasks,
        doingTasks,
        assignees
      };
    }).sort((a, b) => {
      if (a.isHighRisk && !b.isHighRisk) return -1;
      if (!a.isHighRisk && b.isHighRisk) return 1;
      return a.progress - b.progress;
    });

    return (
      <>
        <View className={styles.dailyHeader}>
          <View className={styles.dailyHeaderTop}>
            <Text className={styles.dailyDateIcon}>📅</Text>
            <View className={styles.dailyHeaderInfo}>
              <Text className={styles.dailyDate}>{today} 处置日报</Text>
              <Text className={styles.dailySubtitle}>高风险海区优先 · 按完成进度排序</Text>
            </View>
          </View>
          <View className={styles.dailyStatsRow}>
            <View className={styles.dailyStatCard}>
              <Text className={styles.dailyStatValueDone}>{completedToday.length}</Text>
              <Text className={styles.dailyStatLabel}>今日已完成</Text>
            </View>
            <View className={styles.dailyStatCard}>
              <Text className={styles.dailyStatValueDoing}>{reinforceTasks.filter(t => t.status === 'doing').length}</Text>
              <Text className={styles.dailyStatLabel}>进行中</Text>
            </View>
            <View className={styles.dailyStatCard}>
              <Text className={styles.dailyStatValuePending}>{pendingTotal.length}</Text>
              <Text className={styles.dailyStatLabel}>仍未处理</Text>
            </View>
          </View>
        </View>

        {dailyByArea.map(daily => (
          <View className={classnames(styles.dailyCard, daily.isHighRisk && styles.dailyCardHighRisk)} key={daily.area}>
            <View className={styles.dailyCardHeader}>
              <View className={styles.dailyCardHeaderLeft}>
                <Text className={styles.dailyCardArea}>{daily.area}</Text>
                {daily.isHighRisk && (
                  <Text className={classnames(styles.riskBadge, daily.areaInfo!.status === 'danger' ? styles.riskDanger : styles.riskWarning)}>
                    {daily.areaInfo!.status === 'danger' ? '高风险' : '中风险'}
                  </Text>
                )}
              </View>
              <View className={styles.dailyCardHeaderRight}>
                <Text className={classnames(
                  styles.dailyProgressBadge,
                  daily.progress === 100 ? styles.progressAllDone :
                  daily.progress >= 50 ? styles.progressHalf : styles.progressLow
                )}>
                  {daily.progress}%
                </Text>
              </View>
            </View>

            <View className={styles.dailyProgressBar}>
              <View
                className={classnames(
                  styles.areaProgressFill,
                  daily.progress === 100 ? styles.fillDone :
                  daily.progress >= 50 ? styles.fillHalf : styles.fillLow
                )}
                style={{ width: `${daily.progress}%` }}
              />
            </View>

            <View className={styles.dailyMetaRow}>
              <View className={styles.dailyMetaItem}>
                <Text className={styles.dailyMetaIcon}>✅</Text>
                <Text className={styles.dailyMetaText}>已完成 {daily.done}/{daily.total}</Text>
              </View>
              <View className={styles.dailyMetaItem}>
                <Text className={styles.dailyMetaIcon}>⏳</Text>
                <Text className={styles.dailyMetaText}>进行中 {daily.doing}</Text>
              </View>
              <View className={styles.dailyMetaItem}>
                <Text className={styles.dailyMetaIcon}>⚠️</Text>
                <Text className={styles.dailyMetaText}>未处理 {daily.pending}</Text>
              </View>
            </View>

            <View className={styles.dailyAssignee}>
              <Text className={styles.dailyAssigneeLabel}>👤 负责人：</Text>
              {daily.assignees.map((name, idx) => (
                <Text className={styles.dailyAssigneeTag} key={idx}>{name}</Text>
              ))}
            </View>

            {daily.pendingTasks.length > 0 && (
              <View className={styles.dailyPendingList}>
                <Text className={styles.dailyPendingTitle}>🔴 待闭环事项</Text>
                {daily.pendingTasks.map(task => (
                  <View
                    className={styles.dailyPendingItem}
                    key={task.id}
                    onClick={() => handleStatusChange(task.id, task.status)}
                  >
                    <View className={styles.dailyPendingDot} />
                    <Text className={styles.dailyPendingText}>{task.task}</Text>
                    <Text className={styles.dailyPendingBtn}>标为进行中 →</Text>
                  </View>
                ))}
              </View>
            )}

            {daily.doingTasks.length > 0 && (
              <View className={styles.dailyDoingList}>
                <Text className={styles.dailyDoingTitle}>🟡 进行中事项</Text>
                {daily.doingTasks.map(task => (
                  <View
                    className={styles.dailyDoingItem}
                    key={task.id}
                    onClick={() => handleStatusChange(task.id, task.status)}
                  >
                    <View className={styles.dailyDoingDot} />
                    <Text className={styles.dailyDoingText}>{task.task}</Text>
                    <Text className={styles.dailyDoingBtn}>标为完成 ✓</Text>
                  </View>
                ))}
              </View>
            )}

            {daily.progress === 100 && (
              <View className={styles.dailyAllDone}>
                <Text className={styles.dailyAllDoneIcon}>🎉</Text>
                <Text className={styles.dailyAllDoneText}>该海区加固事项已全部完成</Text>
              </View>
            )}
          </View>
        ))}
      </>
    );
  };

  return (
    <ScrollView scrollY className={styles.pageContainer} style={{ minHeight: '100vh' }}>
      <PageHeader title="台风应对" subtitle="预警详情 · 加固事项 · 处置日报" />

      <View className={styles.tabs}>
        <Text className={classnames(styles.tabItem, activeTab === 'warning' && styles.tabActive)} onClick={() => setActiveTab('warning')}>预警详情</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'reinforce' && styles.tabActive)} onClick={() => setActiveTab('reinforce')}>加固事项</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'byArea' && styles.tabActive)} onClick={() => setActiveTab('byArea')}>按海区汇总</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'daily' && styles.tabActive)} onClick={() => setActiveTab('daily')}>处置日报</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'supplies' && styles.tabActive)} onClick={() => setActiveTab('supplies')}>应急物资</Text>
      </View>

      {activeTab === 'warning' && renderWarning()}
      {activeTab === 'reinforce' && renderReinforce()}
      {activeTab === 'byArea' && renderByArea()}
      {activeTab === 'daily' && renderDaily()}
      {activeTab === 'supplies' && renderSupplies()}
    </ScrollView>
  );
};

export default TyphoonPage;
