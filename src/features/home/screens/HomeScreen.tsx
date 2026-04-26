import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '@ds/components';
import { HomeBottomTabBar } from '../components';
import { HomeTabKey } from '../types';

import { ChallengesScreen } from '@features/challenges';
import { FriendsScreen } from '@features/friends';
import { ProfileScreen } from '@features/profile';

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState<HomeTabKey>('challenges');

  const renderContent = () => {
    switch (activeTab) {
      case 'friends':
        return <FriendsScreen />;
      case 'challenges':
        return <ChallengesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container} testID="home-screen">
      <View style={styles.content}>
        {renderContent()}
      </View>
      <HomeBottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
