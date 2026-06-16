import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import SectionCard from '@/components/SectionCard';
import StatCard from '@/components/StatCard';
import { orderList, salesStats } from '@/data/sales';
import { getInventoryQty, inventoryList } from '@/data/inventory';
import classnames from 'classnames';

type TabType = 'all' | 'pending' | 'shipped' | 'completed' | 'cancelled';

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

  const filteredOrders = getFilteredOrders();

  const pendingQty = orderList
    .filter(o => o.status === '待发货')
    .reduce((s, o) => s + o.products.reduce((ps, p) => ps + p.quantity, 0), 0);

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

      <View className={styles.stockRow}>
        <View className={styles.stockCard}>
          <Text className={styles.stockIcon}>📦</Text>
          <View className={styles.stockInfo}>
            <Text className={styles.stockValue}>{totalStock}公斤</Text>
            <Text className={styles.stockLabel}>成品库存总量</Text>
          </View>
        </View>
        <View className={classnames(styles.stockCard, pendingQty > totalStock * 0.8 && styles.stockWarn)}>
          <Text className={styles.stockIcon}>📤</Text>
          <View className={styles.stockInfo}>
            <Text className={styles.stockValue}>{pendingQty}公斤</Text>
            <Text className={styles.stockLabel}>
              待发货需用量
              {pendingQty > totalStock * 0.8 ? ' · ⚠️库存紧张' : ''}
            </Text>
          </View>
        </View>
      </View>

      <SectionCard title="库存明细" subtitle="下单前请确认库存是否充足">
        <View className={styles.inventoryGrid}>
          {inventoryList.map(item => (
            <View className={styles.inventoryItem} key={item.id}>
              <View className={styles.inventoryHeader}>
                <Text className={classnames(styles.invTypeTag, item.type === '紫菜' ? styles.invLaver : styles.invKelp)}>{item.type}</Text>
                <Text className={classnames(styles.invGradeTag, item.grade === '特级' ? styles.invSuper : item.grade === '一级' ? styles.invFirst : styles.invSecond)}>
                  {item.grade}
                </Text>
              </View>
              <Text className={styles.inventoryQty}>{item.quantity}<Text className={styles.inventoryUnit}>{item.unit}</Text></Text>
            </View>
          ))}
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
              const stockSufficient = stockQty >= p.quantity;
              return (
                <View className={styles.productItem} key={idx}>
                  <View className={styles.productLeft}>
                    <Text className={styles.productName}>{p.productName}</Text>
                    <Text className={styles.productInfo}>{p.quantity}{p.unit} × ¥{p.unitPrice}</Text>
                  </View>
                  {order.status === '待发货' && (
                    <View className={classnames(styles.stockTip, stockSufficient ? styles.stockOk : styles.stockAlert)}>
                      {stockSufficient ? '✓ 可发' : '⚠️ 库存不足'}
                      <Text className={styles.stockTipQty}>（库存{stockQty}{p.unit}）</Text>
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
