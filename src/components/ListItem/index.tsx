import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface ListItemTag {
  text: string;
  bgColor: string;
  textColor: string;
}

interface ListItemProps {
  title: string;
  subtitle?: string;
  desc?: string;
  tags?: ListItemTag[];
  right?: React.ReactNode;
  onClick?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ title, subtitle, desc, tags, right, onClick }) => {
  return (
    <View
      className={classnames(styles.listItem, onClick && styles.clickable)}
      onClick={onClick}
    >
      <View className={styles.content}>
        <View className={styles.headerRow}>
          <Text className={styles.title}>{title}</Text>
          {tags && tags.length > 0 && (
            <View className={styles.tags}>
              {tags.map((tag, idx) => (
                <Text
                  key={idx}
                  className={styles.tag}
                  style={{ backgroundColor: tag.bgColor, color: tag.textColor }}
                >
                  {tag.text}
                </Text>
              ))}
            </View>
          )}
        </View>
        {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
        {desc && <Text className={styles.desc}>{desc}</Text>}
      </View>
      {right && <View className={styles.right}>{right}</View>}
    </View>
  );
};

export default ListItem;
