import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, right }) => {
  return (
    <View className={styles.pageHeader}>
      <View className={styles.left}>
        <Text className={styles.title}>{title}</Text>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
      </View>
      {right && <View className={styles.right}>{right}</View>}
    </View>
  );
};

export default PageHeader;
