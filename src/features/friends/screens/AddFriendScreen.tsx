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
import { searchUsers, sendFriendRequest } from '../services';

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
        const res = await searchUsers(text.trim());
        setResults(res);
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
    try {
      await sendFriendRequest(userId);
      setSentIds((prev) => new Set(prev).add(userId));
      // Optimistically update results to show "Requested"
      setResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, relationship: 'pending_outgoing' as const } : u,
        ),
      );
    } catch {
      // no-op; could show error toast
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
