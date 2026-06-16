import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface DataItemProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  color?: string;
}

const DataItem: React.FC<DataItemProps> = ({ label, value, unit, highlight, color }) => {
  return (
    <View className={styles.dataItem}>
      <Text className={styles.label}>{label}</Text>
      <View className={styles.valueWrap}>
        <Text
          className={highlight ? styles.valueHighlight : styles.value}
          style={color ? { color } : undefined}
        >
          {value}
        </Text>
        {unit && <Text className={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
};

export default DataItem;
