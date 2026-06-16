import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import PageHeader from '@/components/PageHeader';
import SectionCard from '@/components/SectionCard';
import { orderList, salesStats } from '@/data/sales';
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
            {order.products.map((p, idx) => (
              <View className={styles.productItem} key={idx}>
                <Text className={styles.productName}>{p.productName}</Text>
                <Text className={styles.productInfo}>{p.quantity}{p.unit} × ¥{p.unitPrice}</Text>
              </View>
            ))}
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
