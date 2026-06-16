import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, subtitle, extra, children }) => {
  return (
    <View className={styles.sectionCard}>
      <View className={styles.header}>
        <View className={styles.titleWrap}>
          <Text className={styles.title}>{title}</Text>
          {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
        </View>
        {extra && <View className={styles.extra}>{extra}</View>}
      </View>
      <View className={styles.body}>
        {children}
      </View>
    </View>
  );
};

export default SectionCard;
