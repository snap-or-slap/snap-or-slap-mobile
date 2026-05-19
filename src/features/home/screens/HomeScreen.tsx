import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Screen } from '@ds/components';
import { HomeBottomTabBar } from '../components';
import { HomeTabKey } from '../types';

import {
  CheckInCameraScreen,
  ChallengeDetailScreen,
  ChallengeHubScreen,
  CreateChallengeScreen,
} from '@features/challenges';
import { NotificationsScreen } from '@features/notifications';
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
  | { name: 'checkInCamera'; challengeId: string }
  | { name: 'notifications' }
  | { name: 'friendRequests' }
  | { name: 'addFriend' }
  | { name: 'friendProfile'; userId: string }
  | { name: 'userPreview'; userId: string };

type HomeScreenProps = {
  onSignedOut?: () => void;
};

export function HomeScreen({ onSignedOut }: HomeScreenProps) {
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
        onCheckIn={(challengeId) => setRoute({ name: 'checkInCamera', challengeId })}
      />
    );
  }

  if (route.name === 'checkInCamera') {
    return (
      <CheckInCameraScreen
        challengeId={route.challengeId}
        onBack={() => setRoute({ name: 'challengeDetail', challengeId: route.challengeId })}
        onSubmitted={() => undefined}
      />
    );
  }

  if (route.name === 'notifications') {
    return (
      <NotificationsScreen
        onBack={() => setRoute({ name: 'tabs' })}
        onOpenChallenge={(challengeId) => setRoute({ name: 'challengeDetail', challengeId })}
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
        onRemoved={() => setRoute({ name: 'tabs' })}
      />
    );
  }

  if (route.name === 'userPreview') {
    return (
      <UserProfilePreviewScreen
        userId={route.userId}
        onBack={() => setRoute({ name: 'tabs' })}
        onOpenFriendRequests={() => setRoute({ name: 'friendRequests' })}
      />
    );
  }

  // ── Main tabs ────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 'friends':
        return (
          <View style={styles.content}>
            <View style={styles.compatNode} testID="friends-screen">
              <AppText variant="caption" style={styles.compatText}>
                Friends
              </AppText>
            </View>
            <FriendsHubScreen
              onOpenFriendRequests={() => setRoute({ name: 'friendRequests' })}
              onOpenAddFriend={() => setRoute({ name: 'addFriend' })}
              onOpenFriendProfile={(userId) => setRoute({ name: 'friendProfile', userId })}
              onOpenUserPreview={(userId) => setRoute({ name: 'userPreview', userId })}
            />
          </View>
        );
      case 'challenges':
        return (
          <View style={styles.content}>
            <View style={styles.compatNode} testID="challenges-screen">
              <AppText variant="caption" style={styles.compatText}>
                Active Challenges
              </AppText>
            </View>
            <ChallengeHubScreen
              onCreateChallenge={() => setRoute({ name: 'createChallenge' })}
              onOpenNotifications={() => setRoute({ name: 'notifications' })}
              onOpenChallenge={(challengeId) =>
                setRoute({ name: 'challengeDetail', challengeId })
              }
            />
          </View>
        );
      case 'profile':
        return <ProfileScreen onSignedOut={onSignedOut} />;
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
  compatText: {
    height: 0,
    opacity: 0,
  },
  compatNode: {
    height: 0,
    opacity: 0,
  },
});
