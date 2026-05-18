import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '@ds/components';
import { HomeBottomTabBar } from '../components';
import { HomeTabKey } from '../types';

import {
  ChallengeDetailScreen,
  ChallengeHubScreen,
  CreateChallengeScreen,
} from '@features/challenges';
import {
  FriendsHubScreen,
  FriendRequestsScreen,
  AddFriendScreen,
  FriendProfileScreen,
  UserProfilePreviewScreen,
} from '@features/friends';
import { ProfileScreen } from '@features/profile';

type HomeRoute =
  | { name: 'tabs' }
  | { name: 'createChallenge' }
  | { name: 'challengeDetail'; challengeId: string }
  | { name: 'friendRequests' }
  | { name: 'addFriend' }
  | { name: 'friendProfile'; userId: string }
  | { name: 'userPreview'; userId: string };

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState<HomeTabKey>('challenges');
  const [route, setRoute] = useState<HomeRoute>({ name: 'tabs' });

  // ── Challenge sub-routes ─────────────────────────────────────────
  if (route.name === 'createChallenge') {
    return (
      <CreateChallengeScreen
        onBack={() => setRoute({ name: 'tabs' })}
        onCreated={(challengeId) => setRoute({ name: 'challengeDetail', challengeId })}
      />
    );
  }

  if (route.name === 'challengeDetail') {
    return (
      <ChallengeDetailScreen
        challengeId={route.challengeId}
        onBack={() => setRoute({ name: 'tabs' })}
      />
    );
  }

  // ── Friend sub-routes ────────────────────────────────────────────
  if (route.name === 'friendRequests') {
    return (
      <FriendRequestsScreen
        onBack={() => setRoute({ name: 'tabs' })}
        onFindFriends={() => setRoute({ name: 'addFriend' })}
        onOpenUserPreview={(userId) => setRoute({ name: 'userPreview', userId })}
      />
    );
  }

  if (route.name === 'addFriend') {
    return (
      <AddFriendScreen
        onBack={() => setRoute({ name: 'tabs' })}
        onOpenUserPreview={(userId) => setRoute({ name: 'userPreview', userId })}
      />
    );
  }

  if (route.name === 'friendProfile') {
    return (
      <FriendProfileScreen
        userId={route.userId}
        onBack={() => setRoute({ name: 'tabs' })}
      />
    );
  }

  if (route.name === 'userPreview') {
    return (
      <UserProfilePreviewScreen
        userId={route.userId}
        onBack={() => setRoute({ name: 'tabs' })}
      />
    );
  }

  // ── Main tabs ────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 'friends':
        return (
          <FriendsHubScreen
            onOpenFriendRequests={() => setRoute({ name: 'friendRequests' })}
            onOpenAddFriend={() => setRoute({ name: 'addFriend' })}
            onOpenFriendProfile={(userId) => setRoute({ name: 'friendProfile', userId })}
          />
        );
      case 'challenges':
        return (
          <ChallengeHubScreen
            onCreateChallenge={() => setRoute({ name: 'createChallenge' })}
            onOpenChallenge={(challengeId) =>
              setRoute({ name: 'challengeDetail', challengeId })
            }
          />
        );
      case 'profile':
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  return (
    <Screen style={styles.container} safeArea="none" testID="home-screen">
      <View style={styles.content}>
        {renderContent()}
      </View>
      <HomeBottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </Screen>
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
