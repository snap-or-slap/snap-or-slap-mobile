import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { ChallengeStatusTone } from '../types/challenge.types';

type ChallengeStatusPillProps = {
    tone: ChallengeStatusTone;
    label?: string;
    showDot?: boolean;
    testID?: string;
};

const getStatusConfig = (
    theme: AppTheme
): Record<
    ChallengeStatusTone,
    {
        label: string;
        backgroundColor: string;
        borderColor: string;
        textColor: string;
        dotColor?: string;
    }
> => ({
    active: {
        label: 'Active',
        backgroundColor: theme.colors.bg.brand,
        borderColor: theme.colors.bg.brand,
        textColor: theme.colors.text['on-brand'],
    },
    formation: {
        label: 'Formation',
        backgroundColor: theme.colors.bg['surface-inverse'],
        borderColor: theme.colors.bg['surface-inverse'],
        textColor: theme.colors.text.inverse,
    },
    'on-track': {
        label: 'On track',
        backgroundColor: theme.colors.bg['success-subtle'],
        borderColor: theme.colors.border.success,
        textColor: theme.colors.text.success,
        dotColor: theme.colors.bg.success,
    },
    danger: {
        label: 'Danger',
        backgroundColor: theme.colors.bg['error-subtle'],
        borderColor: theme.colors.border.error,
        textColor: theme.colors.text.error,
        dotColor: theme.colors.bg.error,
    },
    success: {
        label: 'Success',
        backgroundColor: theme.colors.bg.success,
        borderColor: theme.colors.border.success,
        textColor: theme.colors.text['on-success'],
    },
    'game-over': {
        label: 'Game Over',
        backgroundColor: theme.colors.bg.error,
        borderColor: theme.colors.border.error,
        textColor: theme.colors.text['on-error'],
    },
    cancelled: {
        label: 'Cancelled',
        backgroundColor: theme.colors.bg.disabled,
        borderColor: theme.colors.border.disabled,
        textColor: theme.colors.text.disabled,
    },
});

export function ChallengeStatusPill({
    tone,
    label,
    showDot,
    testID,
}: ChallengeStatusPillProps) {
    const theme = useTheme();
    const config = getStatusConfig(theme)[tone];
    const shouldShowDot = showDot ?? (tone === 'on-track' || tone === 'danger');
    
    return (
        <View
            testID={testID}
            style={[
                styles.root,
                {
                    backgroundColor: config.backgroundColor,
                    borderColor: config.borderColor,
                },
            ]}
        >
            {shouldShowDot && config.dotColor ? (
                <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
            ) : null}

            <AppText
                variant="bodyLarge"
                style={[
                    styles.label,
                    {
                        color: config.textColor,
                    },
                ]}
            >
                {label ?? config.label}
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        minHeight: 32,
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 999,
    },
    label: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '600',
    },
});