import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Button, Card, Screen } from '@ds/components';
import { ArrowCircleLeftIcon, ClockIcon, CupIcon, MedalStarIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppHeader, Avatar, IconButton } from '@shared/components';
import { getChallengeDetailMock } from '../data/challenges.mock';
import { ChallengeStatusBadge } from '../components/ChallengeStatusBadge';
import { ChallengeHearts } from '../components/ChallengeHearts';
import { ChallengeMetaRow } from '../components/ChallengeMetaRow';

type ChallengeDetailScreenProps = {
  challengeId?: string;
  onBack?: () => void;
};

export function ChallengeDetailScreen({
  challengeId,
  onBack,
}: ChallengeDetailScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const challenge = getChallengeDetailMock(challengeId);

  const isHistory =
    challenge.status === 'success' ||
    challenge.status === 'game-over' ||
    challenge.status === 'cancelled';

  const isFormation = challenge.status === 'formation';

  return (
    <Screen
      scrollable
      padding="md"
      testID="challenge-detail-screen"
      contentStyle={styles.content}
    >
      <AppHeader
        title="Challenge Detail"
        leftAction={
          onBack ? (
            <IconButton
              accessibilityLabel="Go back"
              onPress={onBack}
              icon={<ArrowCircleLeftIcon size={26} color={theme.colors.text.brand} variant="outline" />}
              testID="challenge-detail-back-button"
            />
          ) : undefined
        }
        testID="challenge-detail-header"
      />

      {/* ── Hero card ── */}
      <Card padding="none" style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <ChallengeStatusBadge tone={challenge.status} label={challenge.statusLabel} />
          <ChallengeHearts label={challenge.heartsText} tone="brand" />
        </View>

        <AppText variant="heading" style={styles.heroTitle}>
          {challenge.title}
        </AppText>

        <ChallengeMetaRow
          icon={<ClockIcon variant="outline" color={theme.colors.text['on-brand']} size={20} />}
          label={`Reset ${challenge.resetTimeText}`}
        />

        <AppText variant="caption" style={styles.heroMeta}>
          Host @{challenge.hostUsername} · {challenge.dateRangeText}
        </AppText>
      </Card>

      {/* ── Formation waiting state ── */}
      {isFormation ? (
        <Card style={styles.card}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            Waiting for members
          </AppText>
          <AppText variant="body" style={styles.bodyText}>
            This challenge will start once the minimum number of members have joined.
          </AppText>
          <Button
            title="Invite Friends"
            variant="secondary"
            size="sm"
            onPress={() => undefined}
            testID="invite-friends-button"
          />
        </Card>
      ) : null}

      {/* ── History result ── */}
      {isHistory ? (
        <Card style={styles.card}>
          {challenge.status === 'success' ? (
            <View style={styles.resultRow}>
              <CupIcon size={28} color={theme.colors.text.success} variant="bold" />
              <View style={styles.resultText}>
                <AppText variant="subtitle" style={[styles.sectionTitle, { color: theme.colors.text.success }]}>
                  Challenge Completed!
                </AppText>
                <AppText variant="caption" style={styles.bodyText}>
                  Great job keeping the squad accountable.
                </AppText>
              </View>
            </View>
          ) : null}
          {challenge.status === 'game-over' ? (
            <View style={styles.resultRow}>
              <MedalStarIcon size={28} color={theme.colors.text.error} variant="outline" />
              <View style={styles.resultText}>
                <AppText variant="subtitle" style={[styles.sectionTitle, { color: theme.colors.text.error }]}>
                  Game Over
                </AppText>
                <AppText variant="caption" style={styles.bodyText}>
                  The squad ran out of hearts. Better luck next time!
                </AppText>
              </View>
            </View>
          ) : null}
          {challenge.status === 'cancelled' ? (
            <AppText variant="body" style={styles.bodyText}>
              This challenge was cancelled before completion.
            </AppText>
          ) : null}
        </Card>
      ) : null}

      {/* ── Members ── */}
      <Card style={styles.card}>
        <AppText variant="subtitle" style={styles.sectionTitle}>
          Members
        </AppText>
        <View style={styles.membersList}>
          {challenge.members.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <Avatar name={member.displayName} avatarUrl={member.avatarUrl} size={44} />
              <View style={styles.memberText}>
                <AppText variant="subtitle" style={styles.memberName}>
                  {member.displayName}
                </AppText>
                <AppText variant="caption" style={styles.memberMeta}>
                  @{member.username} · {member.role === 'host' ? 'Host' : 'Member'}
                </AppText>
              </View>
              {/* Slap nudge — placeholder for non-host, active challenges */}
              {!isHistory && !isFormation && member.role !== 'host' ? (
                <Button
                  title="Slap"
                  variant="secondary"
                  size="sm"
                  onPress={() => undefined}
                  testID={`slap-${member.id}`}
                />
              ) : null}
            </View>
          ))}
        </View>
      </Card>

      {/* ── Today's activities / check-in (active only) ── */}
      {!isHistory && !isFormation && challenge.activities.length > 0 ? (
        <Card style={styles.card}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            Today
          </AppText>
          {challenge.activities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <AppText variant="subtitle" style={styles.activityName}>
                  {activity.name}
                </AppText>
                <AppText variant="caption" style={styles.activityStatus}>
                  {activity.statusLabel}
                </AppText>
              </View>
              <AppText variant="caption" style={styles.activityWindow}>
                {activity.windowLabel}
              </AppText>
              <View style={styles.actionRow}>
                <Button
                  title="Check in"
                  variant="primary"
                  size="sm"
                  onPress={() => undefined}
                  style={styles.actionButton}
                  testID={`check-in-${activity.id}`}
                />
                <Button
                  title="Slap nudge"
                  variant="secondary"
                  size="sm"
                  onPress={() => undefined}
                  style={styles.actionButton}
                />
              </View>
            </View>
          ))}
        </Card>
      ) : null}

      {/* ── Evidence feed placeholder ── */}
      {!isHistory ? (
        <Card style={styles.card}>
          <AppText variant="subtitle" style={styles.sectionTitle}>
            Evidence feed
          </AppText>
          <AppText variant="body" style={styles.bodyText}>
            Media upload and evidence playback are reserved for the next adapter batch.
          </AppText>
        </Card>
      ) : null}
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      gap: 16,
    },
    heroCard: {
      gap: 12,
      borderRadius: 28,
      padding: 20,
      backgroundColor: theme.colors.bg.brand,
    },
    heroTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    heroTitle: {
      color: theme.colors.text['on-brand'],
      fontWeight: '800',
    },
    heroMeta: {
      color: theme.colors.text['on-brand'],
      opacity: 0.8,
    },
    card: {
      padding: 16,
      gap: 14,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    bodyText: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 14,
    },
    resultText: {
      flex: 1,
      gap: 4,
    },
    membersList: {
      gap: 12,
    },
    memberRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    memberText: {
      flex: 1,
      gap: 2,
    },
    memberName: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    memberMeta: {
      color: theme.colors.text.secondary,
    },
    activityCard: {
      gap: 10,
      borderRadius: 18,
      padding: 14,
      backgroundColor: theme.colors.bg['brand-subtle'],
    },
    activityHeader: {
      gap: 4,
    },
    activityName: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    activityStatus: {
      color: theme.colors.text.secondary,
    },
    activityWindow: {
      color: theme.colors.text.secondary,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 10,
    },
    actionButton: {
      flex: 1,
    },
  });
}
