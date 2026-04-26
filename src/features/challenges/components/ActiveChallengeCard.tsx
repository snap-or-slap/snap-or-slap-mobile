import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { ClockIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { ActiveChallengeItem } from '../types/challenge.types';
import { ChallengeStatusPill } from './ChallengeStatusPill';
import { HeartCountBadge } from './HeartCountBadge';

type ActiveChallengeCardProps = {
    challenge: ActiveChallengeItem;
    testID?: string;
};

export function ActiveChallengeCard({
    challenge,
    testID,
}: ActiveChallengeCardProps) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const isDanger = challenge.riskStatus === 'danger';

    return (
        <View testID={testID} style={styles.card}>
            <View style={styles.topRow}>
                <ChallengeStatusPill tone="active" />

                <HeartCountBadge
                    label={challenge.heartsText}
                    variant="filled"
                    tone={isDanger ? 'danger' : 'brand'}
                />
            </View>

            <AppText variant="titleMedium" style={styles.title}>
                {challenge.title}
            </AppText>

            <View style={styles.metaRow}>
                <View style={styles.resetGroup}>
                    <ClockIcon variant="outline" size={21} color={theme.colors.text.secondary} />

                    <AppText variant="bodyLarge" style={styles.metaText}>
                        Reset {challenge.resetTimeText}
                    </AppText>
                </View>

                <AppText variant="bodyLarge" style={styles.stepText}>
                    {challenge.stepText}
                </AppText>
            </View>

            <ChallengeStatusPill
                tone={isDanger ? 'danger' : 'on-track'}
                label={isDanger ? 'Danger' : 'On track'}
                showDot
            />
        </View>
    );
}

function createStyles(theme: AppTheme) {
    return StyleSheet.create({
        card: {
            width: '100%',
            minHeight: 164,
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
        metaRow: {
            marginTop: 16,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        resetGroup: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        metaText: {
            color: theme.colors.text.secondary,
            fontSize: 15,
            lineHeight: 21,
            fontWeight: '500',
        },
        stepText: {
            color: theme.colors.text.secondary,
            fontSize: 15,
            lineHeight: 21,
            fontWeight: '500',
        },
    });
}