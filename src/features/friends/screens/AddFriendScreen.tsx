import React, { useState, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Screen, AppText } from '@ds/components';
import { ArrowCircleLeftIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { motion } from '@ds/utils';
import { AppHeader, IconButton } from '@shared/components';
import { FriendSearchBar, FriendSearchResultCard, FriendEmptyState } from '../components';
import type { FriendUser } from '../types';
import {
  addOutgoingRequest,
  getOutgoingRequests,
  getUserProfile,
  searchUsers,
  sendFriendRequest,
} from '../services';
import { ApiError, session } from '@services/api';

type AddFriendScreenProps = {
  onBack?: () => void;
  onOpenUserPreview?: (userId: string) => void;
};

export function AddFriendScreen({ onBack, onOpenUserPreview }: AddFriendScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FriendUser[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  const listFadeAnim = useRef(new Animated.Value(0)).current;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = (text: string) => {
    setQuery(text);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const [res, outgoing] = await Promise.all([
          searchUsers(text.trim()),
          getOutgoingRequests(),
        ]);
        const outgoingIds = new Set(outgoing.map((request) => request.user.id));
        setResults(res.map((user) =>
          outgoingIds.has(user.id) ? { ...user, relationship: 'pending_sent' } : user,
        ));
        setHasSearched(true);
        listFadeAnim.setValue(0);
        Animated.timing(listFadeAnim, {
          toValue: 1,
          duration: motion.duration.normal,
          useNativeDriver: true,
        }).start();
      } catch {
        setError('Could not search users. Please try again.');
        setResults([]);
        setHasSearched(true);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  const handleAddFriend = async (userId: string) => {
    const target = results.find((user) => user.id === userId);
    if (!target) return;

    try {
      const response = await sendFriendRequest(userId);
      const requestId = (response.request as { id?: unknown })?.id;
      await addOutgoingRequest(await session.getCurrentUserId(), {
        requestId: typeof requestId === 'string' ? requestId : undefined,
        receiverId: target.id,
        username: target.username,
        displayName: target.displayName,
        avatarUrl: target.avatarUrl ?? null,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setSentIds((prev) => new Set(prev).add(userId));
      // Optimistically update results to show "Requested"
      setResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, relationship: 'pending_sent' as const } : u,
        ),
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        const profile = await getUserProfile(userId).catch(() => undefined);
        if (profile?.relationship === 'pending_sent') {
          await addOutgoingRequest(await session.getCurrentUserId(), {
            receiverId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            avatarUrl: profile.avatarUrl ?? null,
            status: 'pending',
            createdAt: new Date().toISOString(),
          });
          setSentIds((prev) => new Set(prev).add(userId));
          setResults((prev) =>
            prev.map((u) =>
              u.id === userId ? { ...u, relationship: 'pending_sent' as const } : u,
            ),
          );
          return;
        }
      }

      setError('Could not send friend request. Please try again.');
    }
  };

  const isEmptyResult = hasSearched && !searching && results.length === 0 && !error;

  return (
    <Screen scrollable padding="md" testID="add-friend-screen" keyboardShouldPersistTaps="handled">
      <AppHeader
        title="Add Friends"
        leftAction={
          onBack ? (
            <IconButton
              accessibilityLabel="Go back"
              onPress={onBack}
              icon={<ArrowCircleLeftIcon size={26} color={theme.colors.text.brand} variant="outline" />}
              testID="add-friend-back"
            />
          ) : undefined
        }
        testID="add-friend-header"
      />

      {/* ── Search ────────────────────────────────────────────── */}
      <FriendSearchBar
        value={query}
        onChangeText={handleQueryChange}
        placeholder="Search by username…"
        onClear={handleClear}
        autoFocus
        testID="add-friend-search"
      />

      {/* ── Content ───────────────────────────────────────────── */}
      <View style={styles.content}>
        {/* Before search */}
        {!hasSearched && !searching && query.length < 2 ? (
          <FriendEmptyState
            title="Search by username to find friends"
            description="Type at least 2 characters to search."
            testID="add-friend-before-search"
          />
        ) : null}

        {/* Searching indicator */}
        {searching ? (
          <AppText variant="body" style={styles.searching}>
            Searching…
          </AppText>
        ) : null}

        {/* Error */}
        {error ? (
          <FriendEmptyState
            title="Could not search users"
            description={error}
            primaryActionLabel="Try again"
            onPrimaryAction={() => handleQueryChange(query)}
            testID="add-friend-error"
          />
        ) : null}

        {/* No result */}
        {isEmptyResult ? (
          <FriendEmptyState
            title="No user found"
            description={`We couldn't find anyone matching "${query}".`}
            testID="add-friend-no-result"
          />
        ) : null}

        {/* Results */}
        {results.length > 0 ? (
          <Animated.View style={[styles.results, { opacity: listFadeAnim }]}>
            {results.map((user) => (
              <FriendSearchResultCard
                key={user.id}
                user={user}
                onPress={() => onOpenUserPreview?.(user.id)}
                onAddFriend={() => handleAddFriend(user.id)}
                disabled={sentIds.has(user.id)}
                testID={`search-result-${user.id}`}
              />
            ))}
          </Animated.View>
        ) : null}
      </View>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      marginTop: 20,
      gap: 8,
    },
    searching: {
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      paddingVertical: 24,
    },
    results: {
      gap: 8,
    },
  });
}
