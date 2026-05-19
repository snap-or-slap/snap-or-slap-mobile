
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { EmojiHappyIcon, CupIcon, NotificationBingIcon, ProfileCircleIcon } from '@ds/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeTabKey } from '../types';

interface HomeBottomTabBarProps {
  activeTab: HomeTabKey;
  onTabPress: (tab: HomeTabKey) => void;
  notificationUnreadCount?: number;
}

export function HomeBottomTabBar({
  activeTab,
  onTabPress,
  notificationUnreadCount = 0,
}: HomeBottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const getIcon = (key: HomeTabKey, isActive: boolean) => {
    const variant = isActive ? 'bold' : 'outline';
    const color = isActive ? theme.colors.text.brand : theme.colors.text.secondary;
    const size = 22;

    switch (key) {
      case 'friends':
        return <EmojiHappyIcon variant={variant} color={color} size={size} />;
      case 'challenges':
        return <CupIcon variant={variant} color={color} size={size} />;
      case 'notifications':
        return <NotificationBingIcon variant={variant} color={color} size={size} />;
      case 'profile':
        return <ProfileCircleIcon variant={variant} color={color} size={size} />;
      default:
        return null;
    }
  };

  const tabs: { key: HomeTabKey; label: string }[] = [
    { key: 'friends', label: 'Friends' },
    { key: 'challenges', label: 'Challenges' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'profile', label: 'Profile' },
  ];

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, theme.spacing[8]) },
      ]}
      testID="home-bottom-tab-bar"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={({ pressed }) => [
              styles.tab,
              isActive && styles.activeTab,
              pressed && styles.pressedTab,
            ]}
            onPress={() => onTabPress(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            testID={`home-tab-${tab.key}`}
          >
            <View style={styles.iconWrap}>
              {getIcon(tab.key, isActive)}
              {tab.key === 'notifications' && notificationUnreadCount > 0 ? (
                <View style={styles.badge} testID="notifications-tab-unread-badge">
                  <AppText variant="caption" style={styles.badgeText}>
                    {notificationUnreadCount > 9 ? '9+' : notificationUnreadCount}
                  </AppText>
                </View>
              ) : null}
            </View>
            <AppText
              variant="caption"
              style={[styles.label, isActive && styles.activeLabel]}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      minHeight: 62,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.bg['surface-elevated'],
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.subtle,
      borderTopLeftRadius: theme.radius.md,
      borderTopRightRadius: theme.radius.md,
      paddingTop: theme.spacing[4],
      paddingHorizontal: theme.spacing[8],
      gap: theme.spacing[4],
    },
    tab: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.sm,
      gap: 2,
    },
    iconWrap: {
      position: 'relative',
      minWidth: 28,
      alignItems: 'center',
    },
    badge: {
      position: 'absolute',
      top: -7,
      right: -10,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      paddingHorizontal: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.bg.error,
    },
    badgeText: {
      color: theme.colors.text.inverse,
      fontSize: 10,
      fontWeight: '900',
      lineHeight: 12,
    },
    activeTab: {
      backgroundColor: theme.colors.bg['brand-subtle'],
    },
    pressedTab: {
      backgroundColor: theme.colors.bg['surface-pressed'],
    },
    label: {
      color: theme.colors.text.secondary,
      fontWeight: '600',
    },
    activeLabel: {
      color: theme.colors.text.brand,
      fontWeight: '700',
    },
  });
}
