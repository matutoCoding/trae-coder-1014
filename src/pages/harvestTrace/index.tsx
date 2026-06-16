import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import SectionCard from '@/components/SectionCard';
import StatCard from '@/components/StatCard';
import { harvestRecordList } from '@/data/harvest';
import { dryingRecordList, finishedProductList } from '@/data/processing';
import { orderList } from '@/data/sales';
import { processingTraceList, inventoryList } from '@/data/inventory';
import classnames from 'classnames';

const HarvestTracePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;

  const harvestRecord = harvestRecordList.find(h => h.id === id) || harvestRecordList[0];
  const trace = processingTraceList.find(t => t.harvestId === harvestRecord.id);
  const dryingRecord = trace?.dryingId ? dryingRecordList.find(d => d.id === trace.dryingId) : null;
  const productRecord = trace?.productId ? finishedProductList.find(p => p.id === trace.productId) : null;
  const inventoryItem = trace?.inventoryId ? inventoryList.find(i => i.id === trace.inventoryId) : null;
  const pendingOrders = trace?.orderIds
    ? orderList.filter(o => o.status === '待发货' && trace.orderIds!.includes(o.id))
    : [];

  const getTypeClass = (type: string) => type === '紫菜' ? styles.typeLaver : styles.typeKelp;

  const timelineEvents = useMemo(() => {
    const events: Array<{
      key: string;
      icon: string;
      title: string;
      status: 'done' | 'doing' | 'pending';
      time: string;
      desc: string;
      detail?: any;
    }> = [];

    events.push({
      key: 'harvest',
      icon: '🧺',
      title: '采收完成',
      status: 'done',
      time: harvestRecord.harvestDate,
      desc: `${harvestRecord.seaAreaName} · ${harvestRecord.quantity}${harvestRecord.unit} · 品质${harvestRecord.quality}`,
      detail: harvestRecord
    });

    if (dryingRecord) {
      events.push({
        key: 'drying',
        icon: dryingRecord.processType === '晾晒' ? '☀️' : '🔥',
        title: `${dryingRecord.processType}完成`,
        status: 'done',
        time: dryingRecord.endTime || dryingRecord.startTime,
        desc: `${dryingRecord.processType} · 投料${dryingRecord.inputQuantity}${dryingRecord.inputUnit} → 产出${dryingRecord.outputQuantity}${dryingRecord.outputUnit}`,
        detail: dryingRecord
      });
    } else if (trace?.status === 'drying') {
      events.push({
        key: 'drying',
        icon: '☀️',
        title: '晾晒/烘干中',
        status: 'doing',
        time: '进行中',
        desc: '正在加工中，请稍候'
      });
    } else {
      events.push({
        key: 'drying',
        icon: '☀️',
        title: '待加工',
        status: 'pending',
        time: '未开始',
        desc: '尚未进入晾晒/烘干工序'
      });
    }

    if (productRecord) {
      events.push({
        key: 'pack',
        icon: '📦',
        title: '分级打包完成',
        status: 'done',
        time: productRecord.packageDate,
        desc: `${productRecord.type}${productRecord.grade} · ${productRecord.packageCount}件 · ${productRecord.totalWeight}${productRecord.unit}`,
        detail: productRecord
      });
    } else if (trace && ['packed', 'in_stock'].includes(trace.status)) {
      // 已经完成打包但没找到记录时忽略
    } else {
      events.push({
        key: 'pack',
        icon: '📦',
        title: '待打包',
        status: 'pending',
        time: '未开始',
        desc: '尚未进入分级打包工序'
      });
    }

    if (inventoryItem) {
      events.push({
        key: 'stock',
        icon: '🏬',
        title: '成品入库',
        status: 'done',
        time: inventoryItem.updateTime.split(' ')[0],
        desc: `${inventoryItem.quantity}${inventoryItem.unit} · ${inventoryItem.warehouse}`,
        detail: inventoryItem
      });
    } else if (trace?.status === 'in_stock') {
      // 已入库但没找到记录时忽略
    } else {
      events.push({
        key: 'stock',
        icon: '🏬',
        title: '待入库',
        status: 'pending',
        time: '未开始',
        desc: '成品尚未入库'
      });
    }

    if (pendingOrders.length > 0) {
      events.push({
        key: 'order',
        icon: '📋',
        title: '订单占用中',
        status: 'doing',
        time: '待发货',
        desc: `${pendingOrders.length}张待发货订单占用`,
        detail: pendingOrders
      });
    } else if (inventoryItem) {
      events.push({
        key: 'order',
        icon: '✅',
        title: '可销售',
        status: 'done',
        time: '空闲',
        desc: '库存充足，可销售'
      });
    }

    return events;
  }, [harvestRecord, dryingRecord, productRecord, inventoryItem, pendingOrders, trace]);

  const getStatusDotClass = (status: string) => {
    switch (status) {
      case 'done': return styles.dotDone;
      case 'doing': return styles.dotDoing;
      default: return styles.dotPending;
    }
  };

  const getStatusLineClass = (status: string) => {
    return status === 'done' ? styles.lineDone : styles.linePending;
  };

  const totalOccupied = pendingOrders.reduce((s, o) => {
    if (!trace?.grade) return s;
    const product = o.products.find(p => p.type === harvestRecord.type && p.grade === trace.grade);
    return s + (product?.quantity || 0);
  }, 0);

  const remainingQty = inventoryItem ? Math.max(0, inventoryItem.quantity - totalOccupied) : 0;

  return (
    <ScrollView scrollY className={styles.pageContainer} style={{ minHeight: '100vh' }}>
      <PageHeader title="批次档案" subtitle={`${harvestRecord.type} · ${harvestRecord.harvestDate}`} />

      <View className={styles.infoCard}>
        <View className={styles.infoHeader}>
          <Text className={classnames(styles.typeTag, getTypeClass(harvestRecord.type))}>{harvestRecord.type}</Text>
          <View className={styles.infoHeaderRight}>
            <Text className={styles.infoBatchNo}>批次 #{harvestRecord.id}</Text>
            <Text className={styles.infoStatus}>{trace?.status === 'in_stock' ? '已入库' : trace?.status === 'drying' ? '加工中' : '待加工'}</Text>
          </View>
        </View>
        <Text className={styles.infoTitle}>{harvestRecord.seaAreaName}</Text>
        <Text className={styles.infoDesc}>采收{harvestRecord.quantity}{harvestRecord.unit} · 品质{harvestRecord.quality} · 操作员{harvestRecord.operator}</Text>
        <Text className={styles.infoRemark}>📝 {harvestRecord.remark || '无备注'}</Text>
      </View>

      <SectionCard title="⏱️ 加工时间线" subtitle="从采收至销售的全链路追溯">
        <View className={styles.timeline}>
          {timelineEvents.map((event, idx) => (
            <View className={styles.timelineItem} key={event.key}>
              <View className={styles.timelineLeft}>
                <View className={classnames(styles.timelineDot, getStatusDotClass(event.status))}>
                  <Text>{event.icon}</Text>
                </View>
                {idx < timelineEvents.length - 1 && (
                  <View className={classnames(styles.timelineLine, getStatusLineClass(event.status))} />
                )}
              </View>
              <View className={styles.timelineContent}>
                <View className={styles.timelineHeader}>
                  <Text className={styles.timelineTitle}>{event.title}</Text>
                  <Text className={styles.timelineTime}>{event.time}</Text>
                </View>
                <Text className={styles.timelineDesc}>{event.desc}</Text>
                {event.key === 'drying' && event.detail && (
                  <View className={styles.timelineDetail}>
                    <View className={styles.detailRow}>
                      <Text className={styles.detailLabel}>加工方式</Text>
                      <Text className={styles.detailValue}>{event.detail.processType}</Text>
                    </View>
                    <View className={styles.detailRow}>
                      <Text className={styles.detailLabel}>开始时间</Text>
                      <Text className={styles.detailValue}>{event.detail.startTime}</Text>
                    </View>
                    <View className={styles.detailRow}>
                      <Text className={styles.detailLabel}>完成时间</Text>
                      <Text className={styles.detailValue}>{event.detail.endTime || '进行中'}</Text>
                    </View>
                    <View className={styles.detailRow}>
                      <Text className={styles.detailLabel}>产出率</Text>
                      <Text className={styles.detailValue}>
                        {Math.round((event.detail.outputQuantity / event.detail.inputQuantity) * 100)}%
                      </Text>
                    </View>
                  </View>
                )}
                {event.key === 'pack' && event.detail && (
                  <View className={styles.timelineDetail}>
                    <View className={styles.detailRow}>
                      <Text className={styles.detailLabel}>批次号</Text>
                      <Text className={styles.detailValue}>{event.detail.batchNo}</Text>
                    </View>
                    <View className={styles.detailRow}>
                      <Text className={styles.detailLabel}>等级</Text>
                      <Text className={styles.detailValue}>{event.detail.grade}</Text>
                    </View>
                    <View className={styles.detailRow}>
                      <Text className={styles.detailLabel}>包装规格</Text>
                      <Text className={styles.detailValue}>{event.detail.packageSpec}</Text>
                    </View>
                    <View className={styles.detailRow}>
                      <Text className={styles.detailLabel}>存储库位</Text>
                      <Text className={styles.detailValue}>{event.detail.storageLocation}</Text>
                    </View>
                  </View>
                )}
                {event.key === 'order' && event.detail && event.detail.length > 0 && (
                  <View className={styles.orderOccupyList}>
                    {event.detail.map((order: any) => {
                      if (!trace?.grade) return null;
                      const product = order.products.find((p: any) => p.type === harvestRecord.type && p.grade === trace.grade);
                      return (
                        <View className={styles.orderOccupyItem} key={order.id}>
                          <View className={styles.orderOccupyLeft}>
                            <Text className={styles.orderNo}>{order.orderNo}</Text>
                            <Text className={styles.orderCustomer}>{order.customerName}</Text>
                          </View>
                          <View className={styles.orderOccupyRight}>
                            <Text className={styles.orderQty}>占用 {product?.quantity || 0}kg</Text>
                            <Text className={styles.orderStatus}>待发货</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </SectionCard>

      {inventoryItem && (
        <>
          <View className={styles.summaryGrid}>
            <StatCard label="成品库存" value={inventoryItem.quantity} unit="公斤" icon="📦" bgColor="#E6F7FF" color="#0077B6" />
            <StatCard label="订单占用" value={totalOccupied} unit="公斤" icon="📋" bgColor="#FFF7E6" color="#FF7D00" />
            <StatCard label="剩余可发" value={remainingQty} unit="公斤" icon="✅" bgColor={remainingQty > 0 ? '#E8FBF2' : '#FFECE8'} color={remainingQty > 0 ? '#00B42A' : '#F53F3F'} />
          </View>

          <SectionCard title="🏬 成品库存信息">
            <View className={styles.stockInfoCard}>
              <View className={styles.stockInfoHeader}>
                <Text className={classnames(styles.typeTag, getTypeClass(inventoryItem.type))}>{inventoryItem.type}</Text>
                <Text className={classnames(styles.gradeTag,
                  inventoryItem.grade === '特级' ? styles.gradeSuper :
                  inventoryItem.grade === '一级' ? styles.gradeFirst : styles.gradeSecond
                )}>
                  {inventoryItem.grade}
                </Text>
              </View>
              <View className={styles.stockInfoGrid}>
                <View className={styles.stockInfoItem}>
                  <Text className={styles.stockInfoLabel}>库存数量</Text>
                  <Text className={styles.stockInfoValue}>{inventoryItem.quantity} {inventoryItem.unit}</Text>
                </View>
                <View className={styles.stockInfoItem}>
                  <Text className={styles.stockInfoLabel}>存储库位</Text>
                  <Text className={styles.stockInfoValue}>{inventoryItem.warehouse}</Text>
                </View>
                <View className={styles.stockInfoItem}>
                  <Text className={styles.stockInfoLabel}>更新时间</Text>
                  <Text className={styles.stockInfoValue}>{inventoryItem.updateTime}</Text>
                </View>
                <View className={styles.stockInfoItem}>
                  <Text className={styles.stockInfoLabel}>可用数量</Text>
                  <Text className={classnames(styles.stockInfoValue, remainingQty === 0 && styles.stockDanger)}>
                    {remainingQty} {inventoryItem.unit}
                  </Text>
                </View>
              </View>
            </View>
          </SectionCard>
        </>
      )}

      {pendingOrders.length > 0 && (
        <SectionCard title="📋 关联待发货订单" subtitle={`共${pendingOrders.length}张订单 · 点击查看订单详情`}>
          {pendingOrders.map(order => (
            <View
              className={styles.orderCard}
              key={order.id}
              onClick={() => Taro.switchTab({ url: '/pages/sales/index' })}
            >
              <View className={styles.orderHeader}>
                <Text className={styles.orderNo}>{order.orderNo}</Text>
                <Text className={styles.orderStatusTag}>待发货</Text>
              </View>
              <Text className={styles.orderCustomer}>{order.customerName}</Text>
              <View className={styles.orderProduct}>
                {(() => {
                  if (!trace?.grade) return null;
                  const product = order.products.find((p: any) => p.type === harvestRecord.type && p.grade === trace.grade);
                  return product ? (
                    <Text className={styles.orderProductText}>
                      占用：{product.productName} × {product.quantity}{product.unit}
                    </Text>
                  ) : null;
                })()}
              </View>
              <Text className={styles.orderDate}>下单时间：{order.orderDate} · 预计发货：{order.deliveryDate}</Text>
            </View>
          ))}
        </SectionCard>
      )}
    </ScrollView>
  );
};

export default HarvestTracePage;
