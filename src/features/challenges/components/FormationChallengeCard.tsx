import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { FormationChallengeItem } from '../types/challenge.types';
import { ChallengeStatusPill } from './ChallengeStatusPill';
import { HeartCountBadge } from './HeartCountBadge';
import { JoinedMembersBar } from './JoinedMembersBar';

type FormationChallengeCardProps = {
    challenge: FormationChallengeItem;
    testID?: string;
};

export function FormationChallengeCard({
    challenge,
    testID,
}: FormationChallengeCardProps) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
        <View testID={testID} style={styles.card}>
            <View style={styles.topRow}>
                <ChallengeStatusPill tone="formation" />

                <HeartCountBadge
                    label={challenge.heartsText}
                    variant="filled"
                    tone="brand"
                />
            </View>

            <AppText variant="titleMedium" style={styles.title}>
                {challenge.title}
            </AppText>

            <View style={styles.infoGrid}>
                <InfoBlock label="Duration" value={challenge.durationText} styles={styles} />
                <InfoBlock label="Start date" value={challenge.startDateText} styles={styles} />
                <InfoBlock label="Loop every" value={challenge.loopEveryText} styles={styles} />
                <InfoBlock label="Reset at" value={challenge.resetAtText} styles={styles} />
            </View>

            <JoinedMembersBar
                joinedText={challenge.joinedText}
                extraMembersText={challenge.extraMembersText}
            />
        </View>
    );
}

function InfoBlock({ label, value, styles }: { label: string; value: string; styles: ReturnType<typeof createStyles> }) {
    return (
        <View style={styles.infoBlock}>
            <AppText variant="bodyLarge" style={styles.infoLabel}>
                {label}
            </AppText>

            <AppText variant="bodyLarge" style={styles.infoValue}>
                {value}
            </AppText>
        </View>
    );
}

function createStyles(theme: AppTheme) {
    return StyleSheet.create({
        card: {
            width: '100%',
            minHeight: 294,
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
        infoGrid: {
            marginTop: 22,
            rowGap: 18,
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        infoBlock: {
            width: '50%',
        },
        infoLabel: {
            color: theme.colors.text.tertiary,
            fontSize: 14,
            lineHeight: 19,
            fontWeight: '500',
        },
        infoValue: {
            marginTop: 4,
            color: theme.colors.text.primary,
            fontSize: 17,
            lineHeight: 23,
            fontWeight: '800',
        },
    });
}