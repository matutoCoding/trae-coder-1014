import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import { costStats } from '@/data/cost';
import { harvestSummary } from '@/data/harvest';
import { salesStats } from '@/data/sales';

interface MenuItem {
  key: string;
  icon: string;
  text: string;
  path?: string;
  bgColor: string;
  badge?: string;
}

const MinePage: React.FC = () => {
  const menuItems: MenuItem[] = [
    { key: 'cost', icon: '💰', text: '成本核算', path: '/pages/cost/index', bgColor: '#FFF7E6' },
    { key: 'seaArea', icon: '🗺️', text: '海区台账', path: '/pages/seaArea/index', bgColor: '#E6F7FF' },
    { key: 'employee', icon: '👥', text: '员工管理', path: '', bgColor: '#E8FBF2' },
    { key: 'report', icon: '📈', text: '经营报表', path: '/pages/cost/index', bgColor: '#F3E8FF' },
    { key: 'quality', icon: '✅', text: '品质追溯', path: '', bgColor: '#E6FFFB' },
    { key: 'setting', icon: '⚙️', text: '系统设置', path: '', bgColor: '#F2F3F5' }
  ];

  const handleMenuClick = (item: MenuItem) => {
    console.log('[Mine] click menu:', item.key);
    if (item.path) {
      Taro.navigateTo({ url: item.path });
    } else {
      Taro.showToast({ title: '功能开发中', icon: 'none' });
    }
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.profileHeader}>
        <View className={styles.profileInfo}>
          <View className={styles.avatar}>👤</View>
          <View className={styles.profileText}>
            <Text className={styles.profileName}>林志远</Text>
            <Text className={styles.profileRole}>三都澳海养合作社 · 管理员</Text>
          </View>
        </View>
        <View className={styles.profileStats}>
          <View className={styles.profileStat}>
            <Text className={styles.profileStatValue}>{salesStats.totalOrders}</Text>
            <Text className={styles.profileStatLabel}>处理订单</Text>
          </View>
          <View className={styles.profileStat}>
            <Text className={styles.profileStatValue}>{harvestSummary.totalHarvest / 1000}吨</Text>
            <Text className={styles.profileStatLabel}>累计采收</Text>
          </View>
          <View className={styles.profileStat}>
            <Text className={styles.profileStatValue}>{costStats.profitMargin}%</Text>
            <Text className={styles.profileStatLabel}>利润率</Text>
          </View>
        </View>
      </View>

      <View className={styles.quickStats}>
        <StatCard
          label="总投入成本"
          value={`¥${(costStats.totalCost / 10000).toFixed(1)}`}
          unit="万元"
          icon="💵"
          bgColor="#FFECE8"
          color="#F53F3F"
        />
        <StatCard
          label="总销售收入"
          value={`¥${(costStats.totalRevenue / 10000).toFixed(1)}`}
          unit="万元"
          icon="💹"
          bgColor="#E8FBF2"
          color="#00B42A"
        />
        <StatCard
          label="净利润"
          value={`¥${(costStats.netProfit / 10000).toFixed(1)}`}
          unit="万元"
          icon="🏆"
          bgColor="#E6F7FF"
          color="#0077B6"
        />
        <StatCard
          label="利润率"
          value={`${costStats.profitMargin}%`}
          icon="📊"
          bgColor="#F3E8FF"
          color="#722ED1"
        />
      </View>

      <View className={styles.menuList}>
        {menuItems.map(item => (
          <View className={styles.menuItem} key={item.key} onClick={() => handleMenuClick(item)}>
            <View className={styles.menuIcon} style={{ backgroundColor: item.bgColor }}>
              <Text>{item.icon}</Text>
            </View>
            <Text className={styles.menuText}>{item.text}</Text>
            {item.badge && <Text className={styles.menuBadge}>{item.badge}</Text>}
            <Text className={styles.menuArrow}>›</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MinePage;
