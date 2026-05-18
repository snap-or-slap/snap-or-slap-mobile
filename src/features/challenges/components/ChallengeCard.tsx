import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Button, Card } from '@ds/components';
import { ClockIcon, CupIcon, UserAddIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { ChallengeListItem } from '../types/challenge.types';
import { ChallengeStatusBadge } from './ChallengeStatusBadge';
import { ChallengeHearts } from './ChallengeHearts';
import { ChallengeMetaRow } from './ChallengeMetaRow';
import { ChallengeMemberPreview } from './ChallengeMemberPreview';
import { ChallengeProgressSummary } from './ChallengeProgressSummary';
import { formatDateRange } from '../utils/challengeFormatters';

export type ChallengeCardMode = 'active' | 'formation' | 'history';

export type ChallengeCardProps = {
  challenge: ChallengeListItem;
  mode: ChallengeCardMode;
  onPress?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  testID?: string;
};

export function ChallengeCard({
  challenge,
  mode,
  onPress,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLabel,
  secondaryActionLabel,
  testID,
}: ChallengeCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const isDanger =
    mode === 'active' &&
    challenge.heartsLeft != null &&
    challenge.totalHearts != null &&
    challenge.heartsLeft / challenge.totalHearts <= 0.33;

  return (
    <Card
      testID={testID}
      variant="elevated"
      padding="none"
      pressable={!!onPress}
      onPress={onPress}
      style={styles.card}
    >
      {/* ── Top row: status badge + hearts ── */}
      <View style={styles.topRow}>
        <ChallengeStatusBadge status={challenge.status} />
        {challenge.heartsLeft != null || challenge.totalHearts != null ? (
          <ChallengeHearts
            heartsLeft={challenge.heartsLeft}
            totalHearts={challenge.totalHearts}
            label={
              challenge.totalHearts != null && challenge.heartsLeft == null
                ? `${challenge.totalHearts} total`
                : undefined
            }
            tone={isDanger ? 'danger' : 'brand'}
          />
        ) : null}
      </View>

      {/* ── Title ── */}
      <AppText variant="subtitle" style={styles.title} numberOfLines={2}>
        {challenge.title}
      </AppText>

      {/* ── Mode-specific meta ── */}
      {mode === 'active' ? (
        <View style={styles.metaBlock}>
          {challenge.resetTime ? (
            <ChallengeMetaRow
              icon={<ClockIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
              label={`Reset ${challenge.resetTime}`}
            />
          ) : null}
          {challenge.currentStepLabel || challenge.progressLabel ? (
            <ChallengeProgressSummary
              currentStepLabel={challenge.currentStepLabel}
              progressLabel={isDanger ? 'Danger — check in now!' : challenge.progressLabel}
            />
          ) : null}
          {challenge.memberCount != null || challenge.members ? (
            <ChallengeMemberPreview
              members={challenge.members}
              memberCount={challenge.memberCount}
            />
          ) : null}
        </View>
      ) : null}

      {mode === 'formation' ? (
        <View style={styles.metaBlock}>
          {challenge.hostName ? (
            <ChallengeMetaRow
              icon={<UserAddIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
              label={`Host: ${challenge.hostName}`}
            />
          ) : null}
          {challenge.startDate ? (
            <ChallengeMetaRow
              icon={<ClockIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
              label={`Starts ${challenge.startDate}`}
            />
          ) : null}
          {challenge.joinedCount != null && challenge.memberCount != null ? (
            <ChallengeMetaRow
              icon={<UserAddIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
              label={`${challenge.joinedCount}/${challenge.memberCount} joined`}
            />
          ) : null}
        </View>
      ) : null}

      {mode === 'history' ? (
        <View style={styles.metaBlock}>
          {challenge.startDate && challenge.endDate ? (
            <ChallengeMetaRow
              icon={<ClockIcon size={18} color={theme.colors.text.secondary} variant="outline" />}
              label={formatDateRange(challenge.startDate, challenge.endDate)}
            />
          ) : null}
          {challenge.progressLabel ? (
            <AppText variant="caption" style={styles.historyResult}>
              {challenge.progressLabel}
            </AppText>
          ) : null}
          {challenge.status === 'FINISHED' ? (
            <View style={styles.trophyRow}>
              <CupIcon size={20} color={theme.colors.text.success} variant="bold" />
              <AppText variant="caption" style={styles.trophyText}>
                Challenge complete!
              </AppText>
            </View>
          ) : null}
          {challenge.memberCount != null || challenge.members ? (
            <ChallengeMemberPreview
              members={challenge.members}
              memberCount={challenge.memberCount}
            />
          ) : null}
        </View>
      ) : null}

      {/* ── Action buttons ── */}
      {(onPrimaryAction || onSecondaryAction) ? (
        <View style={styles.actionRow}>
          {onSecondaryAction && secondaryActionLabel ? (
            <Button
              title={secondaryActionLabel}
              variant="ghost"
              size="sm"
              onPress={onSecondaryAction}
              style={styles.actionButton}
            />
          ) : null}
          {onPrimaryAction && primaryActionLabel ? (
            <Button
              title={primaryActionLabel}
              variant="primary"
              size="sm"
              onPress={onPrimaryAction}
              style={styles.actionButton}
              testID={`challenge-card-primary-${challenge.id}`}
            />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      width: '100%',
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 18,
      gap: 0,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 34,
    },
    title: {
      marginTop: 12,
      color: theme.colors.text.primary,
      fontSize: 20,
      lineHeight: 27,
      fontWeight: '800',
    },
    metaBlock: {
      marginTop: 14,
      gap: 10,
    },
    historyResult: {
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    trophyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    trophyText: {
      color: theme.colors.text.success,
      fontWeight: '600',
    },
    actionRow: {
      marginTop: 16,
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'flex-end',
    },
    actionButton: {
      minWidth: 80,
    },
  });
}
