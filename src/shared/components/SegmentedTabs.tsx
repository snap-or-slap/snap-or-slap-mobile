import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppText, Badge } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { motion } from '@ds/utils';

export type SegmentedTabItem<T extends string> = {
  key: T;
  label: string;
  count?: number;
};

type SegmentedTabsProps<T extends string> = {
  items: SegmentedTabItem<T>[];
  activeKey: T;
  onChange: (key: T) => void;
  testID?: string;
};

export function SegmentedTabs<T extends string>({
  items,
  activeKey,
  onChange,
  testID,
}: SegmentedTabsProps<T>) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.wrapper} testID={testID}>
      <View style={styles.container}>
        {items.map((item) => (
          <SegmentedTab
            key={item.key}
            item={item}
            isActive={activeKey === item.key}
            onPress={() => onChange(item.key)}
            styles={styles}
            testID={testID ? `${testID}-${item.key}` : undefined}
          />
        ))}
      </View>
    </View>
  );
}

function SegmentedTab<T extends string>({
  item,
  isActive,
  onPress,
  styles,
  testID,
}: {
  item: SegmentedTabItem<T>;
  isActive: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  testID?: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: motion.scale.pressed,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: motion.duration.normal,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.tabWrap, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.tab, isActive && styles.activeTab]}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={item.label}
        testID={testID}
      >
        <AppText variant="body" style={[styles.label, isActive && styles.activeLabel]}>
          {item.label}
        </AppText>
        {item.count !== undefined && item.count > 0 ? (
          <Badge variant={isActive ? 'brand' : 'neutral'} size="sm">
            {String(item.count)}
          </Badge>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrapper: {
      width: '100%',
    },
    container: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.bg['brand-subtle'],
      borderWidth: 1.5,
      borderColor: theme.colors.border.subtle,
      gap: 4,
    },
    tabWrap: {
      flex: 1,
    },
    tab: {
      minHeight: 42,
      borderRadius: theme.radius.full,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[8],
      gap: theme.spacing[4],
    },
    activeTab: {
      backgroundColor: theme.colors.bg['brand-subtle-hover'],
    },
    label: {
      color: theme.colors.text.secondary,
      fontWeight: '600',
      textAlign: 'center',
    },
    activeLabel: {
      color: theme.colors.text.brand,
      fontWeight: '700',
    },
  });
}
