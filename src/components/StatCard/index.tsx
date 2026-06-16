import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  icon?: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  color = '#0077B6',
  icon = '📊',
  bgColor = '#E6F7FF'
}) => {
  return (
    <View className={styles.statCard}>
      <View className={styles.iconBox} style={{ backgroundColor: bgColor }}>
        <Text className={styles.icon}>{icon}</Text>
      </View>
      <View className={styles.content}>
        <Text className={styles.label}>{label}</Text>
        <View className={styles.valueRow}>
          <Text className={styles.value} style={{ color }}>{value}</Text>
          {unit && <Text className={styles.unit}>{unit}</Text>}
        </View>
      </View>
    </View>
  );
};

export default StatCard;
