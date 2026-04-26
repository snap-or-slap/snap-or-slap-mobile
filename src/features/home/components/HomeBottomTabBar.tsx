
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import { EmojiHappyIcon, CupIcon, ProfileCircleIcon } from '@ds/icons';
import { HomeTabKey } from '../types';

interface HomeBottomTabBarProps {
  activeTab: HomeTabKey;
  onTabPress: (tab: HomeTabKey) => void;
}

export function HomeBottomTabBar({ activeTab, onTabPress }: HomeBottomTabBarProps) {
  const theme = useTheme();

  const getIcon = (key: HomeTabKey, isActive: boolean) => {
    const variant = isActive ? 'bold' : 'outline';
    const color = isActive ? theme.colors.text.brand : theme.colors.text.secondary;
    const size = 28;

    switch (key) {
      case 'friends':
        return <EmojiHappyIcon variant={variant} color={color} size={size} />;
      case 'challenges':
        return <CupIcon variant={variant} color={color} size={size} />;
      case 'profile':
        return <ProfileCircleIcon variant={variant} color={color} size={size} />;
      default:
        return null;
    }
  };

  const tabs: { key: HomeTabKey; label: string }[] = [
    { key: 'friends', label: 'Friends' },
    { key: 'challenges', label: 'Challenges' },
    { key: 'profile', label: 'Profile' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg.surface, borderTopColor: theme.colors.border.subtle }]} testID="home-bottom-tab-bar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            testID={`home-tab-${tab.key}`}
          >
            {getIcon(tab.key, isActive)}
            <AppText
              variant="labelSmall"
              style={{
                color: isActive ? theme.colors.text.brand : theme.colors.text.secondary,
                marginTop: 4,
              }}
            >
              {tab.label}
            </AppText>
            {isActive && (
              <View style={[styles.indicator, { backgroundColor: theme.colors.bg.brand }]} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 24,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 24,
    height: 4,
    borderRadius: 2,
  },
});
