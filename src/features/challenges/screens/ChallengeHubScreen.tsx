import React, { useCallback, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Button, Screen } from '@ds/components';
import { NotificationBingIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppHeader, IconButton } from '@shared/components';
import type { ChallengeSegment } from '../types/challenge.types';
import { ChallengeTabBar } from '../components/ChallengeTabBar';
import { ChallengeCard } from '../components/ChallengeCard';
import { ChallengeEmptyState } from '../components/ChallengeEmptyState';
import { getChallengeListMock } from '../data/challenges.mock';

type ChallengeHubScreenProps = {
  onCreateChallenge?: () => void;
  onOpenChallenge?: (challengeId: string) => void;
};

export function ChallengeHubScreen({
  onCreateChallenge,
  onOpenChallenge,
}: ChallengeHubScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [segment, setSegment] = useState<ChallengeSegment>('active');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSegmentChange = useCallback(
    (newSegment: ChallengeSegment) => {
      if (newSegment === segment) return;
      // Fade out → update → fade in
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setSegment(newSegment);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    },
    [segment, fadeAnim]
  );

  const challenges = getChallengeListMock(segment);

  const renderContent = () => {
    if (challenges.length === 0) {
      return renderEmptyState();
    }

    return challenges.map((challenge) => {
      const mode =
        challenge.status === 'ACTIVE'
          ? 'active'
          : challenge.status === 'FORMATION' || challenge.status === 'INVITED'
          ? 'formation'
          : 'history';

      const isInvite = challenge.isInvite;

      return (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          mode={mode}
          onPress={() => onOpenChallenge?.(challenge.id)}
          primaryActionLabel={
            mode === 'active' ? 'View' : isInvite ? 'Accept' : 'View'
          }
          secondaryActionLabel={isInvite ? 'Decline' : undefined}
          onPrimaryAction={() => onOpenChallenge?.(challenge.id)}
          testID={`challenge-card-${challenge.id}`}
        />
      );
    });
  };

  const renderEmptyState = () => {
    switch (segment) {
      case 'active':
        return (
          <ChallengeEmptyState
            title="No active challenges yet"
            description="Start a challenge with your squad and hold each other accountable."
            actionLabel="Create Challenge"
            onAction={onCreateChallenge}
            testID="active-empty-state"
          />
        );
      case 'formation':
        return (
          <ChallengeEmptyState
            title="No pending challenges"
            description="Challenges awaiting members or start confirmation will appear here."
            testID="formation-empty-state"
          />
        );
      case 'history':
        return (
          <ChallengeEmptyState
            title="No challenge history yet"
            description="Completed, failed, and cancelled challenges will appear here."
            testID="history-empty-state"
          />
        );
    }
  };

  return (
    <Screen testID="challenge-hub-screen">
      <View style={styles.root}>
        <View style={styles.headerWrap}>
          <AppHeader
            title="Challenges"
            subtitle="Keep your squad accountable."
            rightAction={
              <View style={styles.notifWrap}>
                <IconButton
                  accessibilityLabel="Challenge notifications"
                  variant="ghost"
                  icon={
                    <NotificationBingIcon
                      size={24}
                      color={theme.colors.text.brand}
                      variant="outline"
                    />
                  }
                />
                <View style={[styles.notifDot, { backgroundColor: theme.colors.bg.error }]} />
              </View>
            }
            testID="challenge-hub-header"
          />
        </View>

        {/* ── Create Challenge CTA ── */}
        <View style={styles.ctaWrap}>
          <Button
            title="Create Challenge"
            variant="primary"
            size="md"
            fullWidth
            onPress={onCreateChallenge}
            testID="open-create-challenge-button"
          />
        </View>

        {/* ── Tab Bar ── */}
        <ChallengeTabBar
          activeSegment={segment}
          onSegmentChange={handleSegmentChange}
          testID="challenge-tab-bar"
        />

        {/* ── Tab Content ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[styles.cardList, { opacity: fadeAnim }]}
            testID="challenges-list"
          >
            {renderContent()}
          </Animated.View>
        </ScrollView>
      </View>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    headerWrap: {
      paddingHorizontal: theme.spacing[24],
      paddingTop: theme.spacing[16],
    },
    notifWrap: {
      position: 'relative',
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notifDot: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    ctaWrap: {
      paddingHorizontal: theme.spacing[24],
      marginBottom: theme.spacing[16],
    },
    scrollContent: {
      paddingHorizontal: theme.spacing[24],
      paddingBottom: 120,
    },
    cardList: {
      gap: 16,
    },
  });
}
