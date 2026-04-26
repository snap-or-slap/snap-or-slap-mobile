import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type {
    HistoryChallengeItem,
    HistoryResultStatus,
} from '../types/challenge.types';
import { ChallengeStatusPill } from './ChallengeStatusPill';
import { HeartCountBadge } from './HeartCountBadge';

type HistoryChallengeCardProps = {
    challenge: HistoryChallengeItem;
    testID?: string;
};

const STATUS_TONE_MAP: Record<
    HistoryResultStatus,
    'success' | 'game-over' | 'cancelled'
> = {
    success: 'success',
    'game-over': 'game-over',
    cancelled: 'cancelled',
};

const HEART_TONE_MAP: Record<HistoryResultStatus, 'brand' | 'danger' | 'muted'> =
{
    success: 'danger',
    'game-over': 'danger',
    cancelled: 'muted',
};

export function HistoryChallengeCard({
    challenge,
    testID,
}: HistoryChallengeCardProps) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View testID={testID} style={styles.card}>
            <View style={styles.topRow}>
                <ChallengeStatusPill tone={STATUS_TONE_MAP[challenge.status]} />

                {challenge.heartsText ? (
                    <HeartCountBadge
                        label={challenge.heartsText}
                        variant="outline"
                        tone={HEART_TONE_MAP[challenge.status]}
                    />
                ) : null}
            </View>

            <AppText variant="titleMedium" style={styles.title}>
                {challenge.title}
            </AppText>

            <AppText variant="bodyLarge" style={styles.description}>
                {challenge.description}
            </AppText>
        </View>
    );
}

function createStyles(theme: AppTheme) {
    return StyleSheet.create({
        card: {
            width: '100%',
            minHeight: 120,
            borderRadius: 24,
            paddingHorizontal: 18,
            paddingTop: 16,
            paddingBottom: 18,
            backgroundColor: theme.colors.bg['surface-elevated'],
            shadowColor: theme.colors.overlay.scrim,
            shadowOffset: {
                width: 0,
                height: 10,
            },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 4,
        },
        topRow: {
            minHeight: 34,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        title: {
            marginTop: 14,
            color: theme.colors.text.primary,
            fontSize: 22,
            lineHeight: 29,
            fontWeight: '800',
        },
        description: {
            marginTop: 10,
            color: theme.colors.text.secondary,
            fontSize: 15,
            lineHeight: 22,
            fontWeight: '500',
        },
    });
}