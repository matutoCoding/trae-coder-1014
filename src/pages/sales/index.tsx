import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import SectionCard from '@/components/SectionCard';
import StatCard from '@/components/StatCard';
import { orderList, salesStats } from '@/data/sales';
import { getInventoryQty, inventoryList } from '@/data/inventory';
import classnames from 'classnames';

type TabType = 'all' | 'pending' | 'shipped' | 'completed' | 'cancelled';

type OccupyMap = Record<string, number>;

const buildOccupyKey = (type: string, grade: string) => `${type}-${grade}`;

const SalesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const getCustomerTypeClass = (type: string) => {
    switch (type) {
      case '加工厂': return styles.customerFactory;
      case '电商': return styles.customerEcommerce;
      case '批发': return styles.customerWholesale;
      default: return styles.customerFactory;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case '待发货': return styles.statusPending;
      case '已发货': return styles.statusShipped;
      case '已完成': return styles.statusCompleted;
      case '已取消': return styles.statusCancelled;
      default: return styles.statusPending;
    }
  };

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'pending': return orderList.filter(o => o.status === '待发货');
      case 'shipped': return orderList.filter(o => o.status === '已发货');
      case 'completed': return orderList.filter(o => o.status === '已完成');
      case 'cancelled': return orderList.filter(o => o.status === '已取消');
      default: return orderList;
    }
  };

  const pendingOrders = orderList.filter(o => o.status === '待发货');

  const occupiedMap = useMemo<OccupyMap>(() => {
    const map: OccupyMap = {};
    pendingOrders.forEach(order => {
      order.products.forEach(p => {
        const key = buildOccupyKey(p.type, p.grade);
        map[key] = (map[key] || 0) + p.quantity;
      });
    });
    return map;
  }, [pendingOrders.length]);

  const getRemainingQty = (type: string, grade: string, needQty: number) => {
    const totalStock = getInventoryQty(type, grade);
    const allOccupied = occupiedMap[buildOccupyKey(type, grade)] || 0;
    return Math.max(0, totalStock - allOccupied + needQty);
  };

  const filteredOrders = getFilteredOrders();

  const pendingQty = pendingOrders.reduce((s, o) => s + o.products.reduce((ps, p) => ps + p.quantity, 0), 0);
  const totalStock = inventoryList.reduce((s, i) => s + i.quantity, 0);

  return (
    <View className={styles.pageContainer}>
      <PageHeader
        title="订单销售"
        subtitle="加工厂订单 · 电商发货 · 销售统计"
      />

      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>
            {salesStats.totalOrders}
            <Text className={styles.statUnit}>单</Text>
          </Text>
          <Text className={styles.statLabel}>累计订单</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>
            {(salesStats.totalAmount / 10000).toFixed(1)}
            <Text className={styles.statUnit}>万元</Text>
          </Text>
          <Text className={styles.statLabel}>累计销售</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statValue}>
            {(salesStats.monthSales / 10000).toFixed(1)}
            <Text className={styles.statUnit}>万元</Text>
          </Text>
          <Text className={styles.statLabel}>本月销售</Text>
        </View>
      </View>

      <SectionCard title="📦 库存占用分析" subtitle="按产品和等级汇总待发货占用量">
        <View className={styles.occupyGrid}>
          {inventoryList.map(item => {
            const key = buildOccupyKey(item.type, item.grade);
            const occupied = occupiedMap[key] || 0;
            const remaining = Math.max(0, item.quantity - occupied);
            const shortage = occupied > item.quantity;
            return (
              <View className={classnames(styles.occupyItem, shortage && styles.occupyShortage)} key={item.id}>
                <View className={styles.occupyHeader}>
                  <Text className={classnames(styles.invTypeTag, item.type === '紫菜' ? styles.invLaver : styles.invKelp)}>{item.type}</Text>
                  <Text className={classnames(styles.invGradeTag, item.grade === '特级' ? styles.invSuper : item.grade === '一级' ? styles.invFirst : styles.invSecond)}>
                    {item.grade}
                  </Text>
                  {shortage && <Text className={styles.shortageTag}>⚠️ 缺货</Text>}
                </View>
                <View className={styles.occupyStats}>
                  <View className={styles.occupyStat}>
                    <Text className={styles.occupyNum}>{item.quantity}</Text>
                    <Text className={styles.occupyLabel}>库存总量</Text>
                  </View>
                  <View className={styles.occupyMinus}>−</View>
                  <View className={styles.occupyStat}>
                    <Text className={classnames(styles.occupyNum, styles.occupyWarn)}>{occupied}</Text>
                    <Text className={styles.occupyLabel}>待发货占用</Text>
                  </View>
                  <View className={styles.occupyMinus}>=</View>
                  <View className={styles.occupyStat}>
                    <Text className={classnames(styles.occupyNum, shortage ? styles.occupyDanger : styles.occupyOk)}>{remaining}</Text>
                    <Text className={styles.occupyLabel}>剩余可发</Text>
                  </View>
                </View>
                <View className={styles.occupyBar}>
                  <View className={styles.occupyBarTotal} />
                  <View
                    className={classnames(styles.occupyBarUsed, shortage && styles.occupyBarShort)}
                    style={{ width: `${Math.min(100, (occupied / item.quantity) * 100)}%` }}
                  />
                </View>
                <Text className={styles.occupyLoc}>📍 {item.warehouse} · 更新：{item.updateTime}</Text>
              </View>
            );
          })}
        </View>
      </SectionCard>

      <View className={styles.categoryRow}>
        <View className={styles.categoryCard}>
          <Text className={styles.categoryIcon}>🏭</Text>
          <Text className={styles.categoryCount}>{salesStats.factoryCount}</Text>
          <Text className={styles.categoryLabel}>加工厂订单</Text>
        </View>
        <View className={styles.categoryCard}>
          <Text className={styles.categoryIcon}>🛒</Text>
          <Text className={styles.categoryCount}>{salesStats.ecommerceCount}</Text>
          <Text className={styles.categoryLabel}>电商订单</Text>
        </View>
        <View className={styles.categoryCard}>
          <Text className={styles.categoryIcon}>📦</Text>
          <Text className={styles.categoryCount}>{salesStats.wholesaleCount}</Text>
          <Text className={styles.categoryLabel}>批发订单</Text>
        </View>
      </View>

      <View className={styles.tabs}>
        <Text className={classnames(styles.tabItem, activeTab === 'all' && styles.tabActive)} onClick={() => setActiveTab('all')}>全部</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'pending' && styles.tabActive)} onClick={() => setActiveTab('pending')}>待发货</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'shipped' && styles.tabActive)} onClick={() => setActiveTab('shipped')}>已发货</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'completed' && styles.tabActive)} onClick={() => setActiveTab('completed')}>已完成</Text>
        <Text className={classnames(styles.tabItem, activeTab === 'cancelled' && styles.tabActive)} onClick={() => setActiveTab('cancelled')}>已取消</Text>
      </View>

      {filteredOrders.map(order => (
        <View className={styles.orderCard} key={order.id}>
          <View className={styles.orderHeader}>
            <View>
              <Text className={styles.orderNo}>
                {order.orderNo}
                <Text className={classnames(styles.customerType, getCustomerTypeClass(order.customerType))}>{order.customerType}</Text>
              </Text>
              <Text className={styles.customerName}>{order.customerName}</Text>
            </View>
            <Text className={classnames(styles.statusTag, getStatusClass(order.status))}>{order.status}</Text>
          </View>

          <View className={styles.productList}>
            {order.products.map((p, idx) => {
              const stockQty = getInventoryQty(p.type, p.grade);
              const allOccupied = occupiedMap[buildOccupyKey(p.type, p.grade)] || 0;
              const remaining = getRemainingQty(p.type, p.grade, p.quantity);
              const shortage = order.status === '待发货' && remaining < p.quantity;
              return (
                <View className={styles.productItem} key={idx}>
                  <View className={styles.productLeft}>
                    <Text className={styles.productName}>{p.productName}</Text>
                    <Text className={styles.productInfo}>{p.quantity}{p.unit} × ¥{p.unitPrice}</Text>
                  </View>
                  {order.status === '待发货' && (
                    <View className={styles.stockInfo}>
                      <View className={classnames(styles.stockTip, shortage ? styles.stockAlert : styles.stockOk)}>
                        {shortage ? '⚠️ 库存不足' : '✓ 可发'}
                      </View>
                      <View className={styles.stockDetailRow}>
                        <Text className={styles.stockDetailText}>库存:{stockQty} 待占用:{allOccupied}</Text>
                        <Text className={classnames(styles.stockRemain, shortage && styles.stockRemainDanger)}>
                          剩余可发:{remaining}{p.unit}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          <View className={styles.orderInfo}>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>下单时间</Text>
              <Text className={styles.infoValue}>{order.orderDate}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>预计发货</Text>
              <Text className={styles.infoValue}>{order.deliveryDate}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>联系人</Text>
              <Text className={styles.infoValue}>{order.contact} · {order.phone}</Text>
            </View>
            <View className={styles.totalRow}>
              <Text className={styles.totalLabel}>订单金额</Text>
              <Text className={styles.totalValue}>
                ¥{order.totalAmount.toLocaleString()}
                <Text className={styles.totalUnit}>元</Text>
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default SalesPage;
