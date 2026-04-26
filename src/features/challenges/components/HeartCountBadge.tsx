import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { HeartIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type {
    HeartBadgeTone,
    HeartBadgeVariant,
} from '../types/challenge.types';

type HeartCountBadgeProps = {
    label: string;
    variant?: HeartBadgeVariant;
    tone?: HeartBadgeTone;
    withBackground?: boolean;
    testID?: string;
};

const getToneColor = (theme: AppTheme, tone: HeartBadgeTone): string => {
    switch (tone) {
        case 'brand':
            return theme.colors.bg.brand;
        case 'danger':
            return theme.colors.bg.error;
        case 'muted':
            return theme.colors.text.tertiary;
    }
};

export function HeartCountBadge({
    label,
    variant = 'filled',
    tone = 'brand',
    withBackground = false,
    testID,
}: HeartCountBadgeProps) {
    const theme = useTheme();
    const color = getToneColor(theme, tone);
    const styles = createStyles(theme);

    return (
        <View
            testID={testID}
            style={[
                styles.root,
                withBackground ? styles.withBackground : null,
            ]}
        >
            <HeartIcon
                variant={variant === 'filled' ? 'bold' : 'outline'}
                size={24}
                color={color}
            />

            <AppText
                variant="bodyLarge"
                style={[
                    styles.label,
                    {
                        color,
                    },
                ]}
            >
                {label}
            </AppText>
        </View>
    );
}

function createStyles(theme: AppTheme) {
    return StyleSheet.create({
        root: {
            minHeight: 32,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        withBackground: {
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: theme.colors.bg['surface-elevated'],
        },
        label: {
            fontSize: 18,
            lineHeight: 24,
            fontWeight: '800',
        },
    });
}