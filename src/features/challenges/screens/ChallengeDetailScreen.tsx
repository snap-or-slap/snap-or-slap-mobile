import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Badge, Button, Card, Screen } from '@ds/components';
import { ClockIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Avatar } from '@shared/components';
import { getChallengeDetailMock } from '../data/challenges.mock';
import { ChallengeStatusPill, HeartCountBadge } from '../components';

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

  return (
    <Screen
      scrollable
      padding="md"
      testID="challenge-detail-screen"
      contentStyle={styles.content}
    >
      <View style={styles.header}>
        <Button
          title="Back"
          variant="ghost"
          size="sm"
          onPress={onBack}
          testID="challenge-detail-back-button"
        />
      </View>

      <Card padding="none" style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <ChallengeStatusPill tone={challenge.status} label={challenge.statusLabel} />
          <HeartCountBadge label={challenge.heartsText} tone="brand" variant="filled" />
        </View>

        <AppText variant="heading" style={styles.heroTitle}>
          {challenge.title}
        </AppText>

        <View style={styles.metaRow}>
          <ClockIcon variant="outline" color={theme.colors.text['on-brand']} size={20} />
          <AppText variant="body" style={styles.heroMeta}>
            Reset {challenge.resetTimeText}
          </AppText>
        </View>

        <AppText variant="caption" style={styles.heroMeta}>
          Host @{challenge.hostUsername} | {challenge.dateRangeText}
        </AppText>
      </Card>

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
                  @{member.username} | {member.role === 'host' ? 'Host' : 'Member'}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </Card>

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
              <Badge
                variant="brand"
                size="sm"
                style={styles.activityStatus}
              >
                {activity.statusLabel}
              </Badge>
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

      <Card style={styles.card}>
        <AppText variant="subtitle" style={styles.sectionTitle}>
          Evidence feed
        </AppText>
        <AppText variant="body" style={styles.emptyText}>
          Media upload and evidence playback are intentionally reserved for the next adapter batch.
        </AppText>
      </Card>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      gap: 16,
    },
    header: {
      alignItems: 'flex-start',
    },
    heroCard: {
      gap: 14,
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
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    card: {
      padding: 16,
      gap: 14,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
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
      alignSelf: 'flex-start',
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
    emptyText: {
      color: theme.colors.text.secondary,
      lineHeight: 20,
    },
  });
}
