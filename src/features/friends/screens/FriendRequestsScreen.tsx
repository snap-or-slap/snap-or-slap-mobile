import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Screen, AppText, Button } from '@ds/components';
import { ArrowCircleLeftIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { motion } from '@ds/utils';
import { Pressable } from 'react-native';
import {
  FriendRequestCard,
  FriendRequestTabs,
  FriendEmptyState,
} from '../components';
import type { FriendRequest, FriendRequestTab } from '../types';
import {
  getIncomingRequests,
  getOutgoingRequests,
  respondFriendRequest,
  unsendFriendRequest,
} from '../services';

type FriendRequestsScreenProps = {
  onBack?: () => void;
  onFindFriends?: () => void;
  onOpenUserPreview?: (userId: string, direction: 'incoming' | 'outgoing') => void;
};

export function FriendRequestsScreen({
  onBack,
  onFindFriends,
  onOpenUserPreview,
}: FriendRequestsScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [activeTab, setActiveTab] = useState<FriendRequestTab>('incoming');
  const [incoming, setIncoming] = useState<FriendRequest[]>([]);
  const [outgoing, setOutgoing] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const tabFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    async function loadData() {
      try {
        const [inc, out] = await Promise.all([
          getIncomingRequests(),
          getOutgoingRequests(),
        ]);
        setIncoming(inc);
        setOutgoing(out);
      } catch {
        // silently fall through
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleTabChange = (tab: FriendRequestTab) => {
    // Fade out, switch, fade in
    Animated.timing(tabFadeAnim, {
      toValue: 0,
      duration: motion.duration.fast,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      Animated.timing(tabFadeAnim, {
        toValue: 1,
        duration: motion.duration.normal,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleAccept = async (requestId: string) => {
    try {
      await respondFriendRequest(requestId, 'accept');
      setIncoming((prev) => prev.filter((r) => r.id !== requestId));
    } catch {
      // no-op
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await respondFriendRequest(requestId, 'decline');
      setIncoming((prev) => prev.filter((r) => r.id !== requestId));
    } catch {
      // no-op
    }
  };

  const handleUnsend = async (requestId: string) => {
    try {
      await unsendFriendRequest(requestId);
      setOutgoing((prev) => prev.filter((r) => r.id !== requestId));
    } catch {
      // no-op; TODO: show error toast when available
    }
  };

  const currentList = activeTab === 'incoming' ? incoming : outgoing;

  return (
    <Screen scrollable padding="md" testID="friend-requests-screen" keyboardShouldPersistTaps="handled">
      {/* ── Header ────────────────────────────────────────────── */}
      <View style={styles.header}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            testID="friend-requests-back"
          >
            <ArrowCircleLeftIcon size={28} color={theme.colors.icon.primary} variant="outline" />
          </Pressable>
        ) : null}
        <AppText variant="heading" style={styles.title}>
          Friend Requests
        </AppText>
      </View>

      {/* ── Tabs ──────────────────────────────────────────────── */}
      <FriendRequestTabs
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        incomingCount={incoming.length}
        outgoingCount={outgoing.length}
        testID="friend-requests-tabs"
      />

      {/* ── Summary row ───────────────────────────────────────── */}
      <View style={styles.summaryRow}>
        <AppText variant="caption" style={styles.summaryText}>
          {currentList.length}{' '}
          {activeTab === 'incoming' ? 'received' : 'sent'} request
          {currentList.length !== 1 ? 's' : ''}
        </AppText>
      </View>

      {/* ── Tab content (with fade transition) ────────────────── */}
      <Animated.View style={{ opacity: tabFadeAnim, gap: 8 }}>
        {!loading && currentList.length === 0 ? (
          activeTab === 'incoming' ? (
            <FriendEmptyState
              title="No friend requests yet"
              description="When someone sends you a request, it will appear here."
              primaryActionLabel="Find new friends"
              onPrimaryAction={onFindFriends}
              testID="incoming-empty"
            />
          ) : (
            <>
              <FriendEmptyState
                title="No outgoing requests"
                description="You haven't sent any friend requests recently."
                primaryActionLabel="Find new friends"
                onPrimaryAction={onFindFriends}
                testID="outgoing-empty"
              />
              <RequestTipsCard theme={theme} />
            </>
          )
        ) : (
          <>
            {currentList.map((req) => (
              <FriendRequestCard
                key={req.id}
                request={req}
                mode={activeTab}
                onAccept={
                  activeTab === 'incoming' ? () => handleAccept(req.id) : undefined
                }
                onDecline={
                  activeTab === 'incoming' ? () => handleDecline(req.id) : undefined
                }
                onUnsend={
                  activeTab === 'outgoing' ? () => handleUnsend(req.id) : undefined
                }
                onPress={() =>
                  onOpenUserPreview?.(req.user.id, activeTab)
                }
                testID={`request-card-${req.id}`}
              />
            ))}
            {activeTab === 'outgoing' && currentList.length > 0 ? (
              <RequestTipsCard theme={theme} />
            ) : null}
          </>
        )}
      </Animated.View>
    </Screen>
  );
}

function RequestTipsCard({ theme }: { theme: AppTheme }) {
  const styles = createInfoCardStyles(theme);
  return (
    <View style={styles.card}>
      <AppText variant="label" style={styles.title}>
        Request Tips
      </AppText>
      <AppText variant="caption" style={styles.text}>
        • Requests expire after 30 days if not accepted.{'\n'}
        • You can send a new invite later if needed.
      </AppText>
    </View>
  );
}

function createInfoCardStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.bg['brand-subtle'],
      borderRadius: theme.radius.lg,
      padding: 16,
      gap: 6,
    },
    title: {
      color: theme.colors.text.brand,
      fontWeight: '700',
    },
    text: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
  });
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    backButton: {
      padding: 4,
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    summaryRow: {
      marginTop: 8,
      marginBottom: 4,
    },
    summaryText: {
      color: theme.colors.text.tertiary,
    },
  });
}
