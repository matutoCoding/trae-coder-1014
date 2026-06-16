import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { FunctionItem } from '@/types';

interface FunctionGridProps {
  items: FunctionItem[];
  columns?: number;
}

const FunctionGrid: React.FC<FunctionGridProps> = ({ items, columns = 4 }) => {
  const handleClick = (item: FunctionItem) => {
    console.log('[FunctionGrid] click:', item.key, item.path);
    if (item.path) {
      Taro.navigateTo({ url: item.path });
    }
  };

  return (
    <View className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {items.map(item => (
        <View
          key={item.key}
          className={styles.gridItem}
          onClick={() => handleClick(item)}
        >
          <View
            className={styles.iconBox}
            style={{ backgroundColor: item.bgColor }}
          >
            <Text className={styles.icon} style={{ color: item.textColor }}>
              {getIcon(item.key)}
            </Text>
          </View>
          <Text className={styles.label}>{item.name}</Text>
        </View>
      ))}
    </View>
  );
};

function getIcon(key: string): string {
  const iconMap: Record<string, string> = {
    seedling: '🌱',
    mariculture: '🌊',
    harvest: '🧺',
    drying: '☀️',
    monitor: '📡',
    typhoon: '🌀',
    cost: '💰',
    order: '📦',
    delivery: '🚚',
    storage: '🏭',
    report: '📈',
    setting: '⚙️',
    seaArea: '🗺️',
    package: '📦',
    employee: '👥',
    quality: '✅'
  };
  return iconMap[key] || '📄';
}

export default FunctionGrid;
