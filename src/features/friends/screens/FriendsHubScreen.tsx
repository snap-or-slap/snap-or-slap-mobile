import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import { Screen, AppText, Button, Badge } from '@ds/components';
import { UserAddIcon, SearchNormalIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { motion } from '@ds/utils';
import {
  FriendListItem,
  FriendRequestPreviewCard,
  FriendSearchBar,
  FriendEmptyState,
} from '../components';
import type { FriendUser, FriendRequest } from '../types';
import {
  getFriends,
  getIncomingRequests,
  respondFriendRequest,
} from '../services';

type FriendsHubScreenProps = {
  onOpenFriendRequests?: () => void;
  onOpenAddFriend?: () => void;
  onOpenFriendProfile?: (userId: string) => void;
};

export function FriendsHubScreen({
  onOpenFriendRequests,
  onOpenAddFriend,
  onOpenFriendProfile,
}: FriendsHubScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  // ── Data state ──────────────────────────────────────────────────
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Search state ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // ── Animation ────────────────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function loadData() {
      try {
        const [f, req] = await Promise.all([getFriends(), getIncomingRequests()]);
        setFriends(f);
        setIncomingRequests(req);
      } catch (err) {
        // Silently fall through to empty state
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }).start();
      }
    }
    loadData();
  }, []);

  // ── Local search (filters friends list) ─────────────────────────
  const filteredFriends = searchQuery.trim()
    ? friends.filter(
        (f) =>
          f.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : friends;

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
  };

  // ── Request actions ──────────────────────────────────────────────
  const handleAccept = async (requestId: string) => {
    try {
      await respondFriendRequest(requestId, 'accept');
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch {
      // no-op; keep UI intact
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await respondFriendRequest(requestId, 'decline');
      setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch {
      // no-op
    }
  };

  return (
    <Screen scrollable padding="md" testID="friends-hub-screen" keyboardShouldPersistTaps="handled">
      {/* ── Header ────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AppText variant="heading" style={styles.title}>
            Friends
          </AppText>
          <AppText variant="body" style={styles.subtitle}>
            Manage your squad connections.
          </AppText>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setIsSearchActive(!isSearchActive)}
            style={styles.iconButton}
            accessibilityLabel="Search friends"
            testID="friends-hub-search-toggle"
          >
            <SearchNormalIcon size={22} color={theme.colors.icon.primary} variant="outline" />
          </Pressable>
          <Pressable
            onPress={onOpenAddFriend}
            style={styles.iconButton}
            accessibilityLabel="Add friend"
            testID="friends-hub-add-friend"
          >
            <UserAddIcon size={22} color={theme.colors.icon.primary} variant="outline" />
          </Pressable>
        </View>
      </View>

      {/* ── Search bar ────────────────────────────────────────── */}
      {isSearchActive ? (
        <FriendSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search your friends…"
          onClear={handleClearSearch}
          autoFocus
          testID="friends-hub-search"
        />
      ) : null}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* ── Incoming Requests Preview ─────────────────────── */}
        {!isSearchActive && incomingRequests.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <AppText variant="subtitle" style={styles.sectionTitle}>
                  Friend Requests
                </AppText>
                <AppText variant="caption" style={styles.sectionSubtitle}>
                  New connections waiting
                </AppText>
              </View>
              <Pressable
                onPress={onOpenFriendRequests}
                accessibilityLabel="View all friend requests"
                testID="friends-hub-view-all-requests"
              >
                <AppText variant="label" style={styles.viewAll}>
                  View all
                </AppText>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.requestsScroll}
            >
              {incomingRequests.map((req) => (
                <FriendRequestPreviewCard
                  key={req.id}
                  request={req}
                  onAccept={() => handleAccept(req.id)}
                  onDecline={() => handleDecline(req.id)}
                  onPress={() => onOpenFriendProfile?.(req.user.id)}
                  testID={`request-preview-${req.id}`}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* ── No requests badge ─────────────────────────────── */}
        {!isSearchActive && incomingRequests.length === 0 && !loading ? (
          <Pressable
            onPress={onOpenFriendRequests}
            style={styles.noRequestsRow}
            testID="friends-hub-no-requests"
          >
            <AppText variant="body" style={styles.noRequestsText}>
              Friend Requests
            </AppText>
            <AppText variant="caption" style={styles.noRequestsCaption}>
              No pending requests · View all
            </AppText>
          </Pressable>
        ) : null}

        {/* ── Friends List ──────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AppText variant="subtitle" style={styles.sectionTitle}>
              Friends
            </AppText>
            {!isSearchActive ? (
              <Badge variant="neutral" size="sm">
                {String(friends.length)}
              </Badge>
            ) : (
              <AppText variant="caption" style={styles.sectionSubtitle}>
                {filteredFriends.length} result{filteredFriends.length !== 1 ? 's' : ''}
              </AppText>
            )}
          </View>

          {!loading && filteredFriends.length === 0 ? (
            <FriendEmptyState
              title={
                isSearchActive
                  ? `No friends found for "${searchQuery}"`
                  : 'No friends yet'
              }
              description={
                isSearchActive
                  ? 'Try a different name, or find someone new.'
                  : 'Add friends to see them here.'
              }
              primaryActionLabel={isSearchActive ? 'Clear search' : 'Find friends'}
              onPrimaryAction={isSearchActive ? handleClearSearch : onOpenAddFriend}
              secondaryActionLabel={isSearchActive ? 'Find new friends' : undefined}
              onSecondaryAction={isSearchActive ? onOpenAddFriend : undefined}
              testID="friends-hub-empty"
            />
          ) : (
            <View style={styles.list}>
              {filteredFriends.map((friend) => (
                <FriendListItem
                  key={friend.id}
                  friend={friend}
                  onPress={() => onOpenFriendProfile?.(friend.id)}
                  testID={`friend-item-${friend.id}`}
                />
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    headerLeft: {
      flex: 1,
      gap: 2,
    },
    headerActions: {
      flexDirection: 'row',
      gap: 8,
      paddingTop: 4,
    },
    iconButton: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.bg.surface,
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    subtitle: {
      color: theme.colors.text.secondary,
    },
    content: {
      gap: 20,
      marginTop: 4,
    },
    section: {
      gap: 12,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionHeaderLeft: {
      gap: 2,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    sectionSubtitle: {
      color: theme.colors.text.tertiary,
    },
    viewAll: {
      color: theme.colors.text.brand,
      fontWeight: '700',
    },
    requestsScroll: {
      gap: 12,
      paddingVertical: 4,
    },
    list: {
      gap: 8,
    },
    noRequestsRow: {
      backgroundColor: theme.colors.bg.surface,
      borderRadius: theme.radius.lg,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 2,
    },
    noRequestsText: {
      color: theme.colors.text.primary,
      fontWeight: '700',
    },
    noRequestsCaption: {
      color: theme.colors.text.tertiary,
    },
  });
}
