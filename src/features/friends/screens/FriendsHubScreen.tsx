import React, { useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native';
import { Screen, AppText, Badge } from '@ds/components';
import { UserAddIcon, SearchNormalIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppHeader, IconButton } from '@shared/components';
import {
  FriendListItem,
  FriendRequestPreviewCard,
  FriendSearchBar,
  FriendEmptyState,
} from '../components';
import type { FriendUser, FriendRequest } from '../types';
import {
  useGetFriendsQuery,
  useGetIncomingRequestsQuery,
  useGetOutgoingRequestsQuery,
  useRespondToFriendRequestMutation,
} from '@store/api/friendApi';

type FriendsHubScreenProps = {
  onOpenFriendRequests?: () => void;
  onOpenAddFriend?: () => void;
  onOpenFriendProfile?: (userId: string) => void;
  onOpenUserPreview?: (userId: string) => void;
};

export function FriendsHubScreen({
  onOpenFriendRequests,
  onOpenAddFriend,
  onOpenFriendProfile,
  onOpenUserPreview,
}: FriendsHubScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // ── RTK Query data fetching ─────────────────────────────────────
  const { data: friendsRaw, isLoading: loading } = useGetFriendsQuery();
  const { data: incomingRaw } = useGetIncomingRequestsQuery();
  const { data: outgoingRaw } = useGetOutgoingRequestsQuery();
  const [respondMut] = useRespondToFriendRequestMutation();

  const friends = (friendsRaw ?? []) as FriendUser[];
  const incomingRequests = (incomingRaw ?? []) as FriendRequest[];

  // ── Search state ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // ── Animation ────────────────────────────────────────────────────
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // ── Local search (filters friends list) ─────────────────────────
  const filteredFriends = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return friends;
    return friends.filter(
      (f) =>
        f.displayName.toLowerCase().includes(q) ||
        f.username.toLowerCase().includes(q),
    );
  }, [friends, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchActive(false);
  };

  // ── Request actions ──────────────────────────────────────────────
  const handleAccept = async (requestId: string) => {
    try {
      await respondMut({ requestId, action: 'accept' }).unwrap();
      // RTK Query auto-refetches via tag invalidation
    } catch {
      // no-op; keep UI intact
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await respondMut({ requestId, action: 'decline' }).unwrap();
      // RTK Query auto-refetches via tag invalidation
    } catch {
      // no-op
    }
  };

  return (
    <Screen scrollable padding="md" testID="friends-hub-screen" keyboardShouldPersistTaps="handled">
      <AppHeader
        title="Friends"
        subtitle="Manage your squad connections."
        rightAction={
          <View style={styles.headerActions}>
            <IconButton
              onPress={() => setIsSearchActive(!isSearchActive)}
              accessibilityLabel="Search friends"
              variant="ghost"
              icon={<SearchNormalIcon size={22} color={theme.colors.text.brand} variant="outline" />}
              testID="friends-hub-search-toggle"
            />
            <IconButton
              onPress={onOpenAddFriend}
              accessibilityLabel="Add friend"
              variant="ghost"
              icon={<UserAddIcon size={22} color={theme.colors.text.brand} variant="outline" />}
              testID="friends-hub-add-friend"
            />
          </View>
        }
        testID="friends-hub-header"
      />

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
              No pending requests
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
    headerActions: {
      flexDirection: 'row',
      gap: theme.spacing[4],
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
    sentList: {
      gap: 8,
    },
    sentRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing[12],
      backgroundColor: theme.colors.bg['surface-elevated'],
      borderRadius: theme.radius.lg,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sentText: {
      flex: 1,
      gap: 2,
    },
    sentName: {
      color: theme.colors.text.primary,
      fontWeight: '700',
    },
    emptyInlineText: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      paddingVertical: theme.spacing[8],
    },
    noRequestsRow: {
      backgroundColor: theme.colors.bg['surface-elevated'],
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
