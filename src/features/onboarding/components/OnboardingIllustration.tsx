import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppText, Card, Badge } from '@ds/components';
import { CameraIcon, HeartIcon } from '@ds/icons';
import type { IllustrationType } from '../data/onboardingSlides';

interface OnboardingIllustrationProps {
  type: IllustrationType;
  testID?: string;
}

// ─── Avatar placeholder ─────────────────────────────────────────
function Avatar({
  size = 44,
  border,
  styles,
  theme,
}: {
  size?: number;
  border?: 'green' | 'red';
  styles: ReturnType<typeof createStyles>;
  theme: AppTheme;
}) {
  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: border ? 2.5 : 0,
          borderColor:
            border === 'red' ? theme.colors.border.error : border === 'green' ? theme.colors.border.success : 'transparent',
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.4 }}>🧑</Text>
    </View>
  );
}

// ─── Status dot ─────────────────────────────────────────────────
function StatusDot({ color, styles }: { color: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <View
      style={[styles.statusDot, { backgroundColor: color }]}
    />
  );
}

// ─── Slide 1: Team Challenge ────────────────────────────────────
function TeamChallengeIllustration({ styles, theme }: { styles: ReturnType<typeof createStyles>; theme: AppTheme }) {
  const brandBg = theme.colors.bg['brand-subtle'];
  const brandColor = theme.colors.text.brand;

  return (
    <View style={styles.illustrationContainer}>
      {/* Floating avatars */}
      <View style={styles.floatingAvatars}>
        <Avatar size={36} styles={styles} theme={theme} />
        <Avatar size={50} styles={styles} theme={theme} />
        <Avatar size={36} styles={styles} theme={theme} />
      </View>

      {/* Stacked cards behind */}
      <View style={styles.stackedCardsContainer}>
        <View
          style={[
            styles.stackedCard,
            { backgroundColor: brandBg, transform: [{ rotate: '-8deg' }] },
          ]}
        />
        <View
          style={[
            styles.stackedCard,
            { backgroundColor: theme.colors.border.subtle, transform: [{ rotate: '6deg' }] },
          ]}
        />
        {/* Main card */}
        <Card variant="elevated" style={styles.mainCard}>
          <View style={styles.mainCardContent}>
            <View style={[styles.iconCircle, { backgroundColor: brandBg }]}>
              <Text style={{ fontSize: 24 }}>🤩</Text>
            </View>
            <AppText
              variant="labelMedium"
              style={{ color: brandColor, marginTop: 4 }}
            >
              Challage
            </AppText>
            <AppText variant="bodySmall" color="secondary">
              Wake up at 5AM
            </AppText>
          </View>
        </Card>
      </View>
    </View>
  );
}

// ─── Slide 2: Photo Proof ───────────────────────────────────────
function PhotoProofIllustration({ styles, theme }: { styles: ReturnType<typeof createStyles>; theme: AppTheme }) {
  const brandColor = theme.colors.bg.brand;

  return (
    <View style={styles.illustrationContainer}>
      {/* Photo card */}
      <View style={styles.photoCard}>
        <Text style={{ fontSize: 64 }}>🤳</Text>
        {/* Proof badge */}
        <Badge tone="success" size="sm" style={styles.proofBadge}>
          ✓ Proof submitted
        </Badge>
      </View>

      {/* Camera button */}
      <View style={[styles.cameraButton, { backgroundColor: brandColor }]}>
        <CameraIcon variant="bold" size={22} color={theme.colors.text['on-brand']} />
      </View>
    </View>
  );
}

// ─── Team card (shared by Slides 3 & 4) ─────────────────────────
function TeamStatusCard({ showSlap, styles, theme }: { showSlap: boolean; styles: ReturnType<typeof createStyles>; theme: AppTheme }) {
  const brandColor = theme.colors.bg.brand;

  return (
    <View style={styles.illustrationContainer}>
      <Card variant="elevated" style={styles.teamCard}>
        <View style={styles.teamCardContent}>
          {/* Hearts row */}
          <View style={styles.heartsRow}>
            <HeartIcon variant="bold" size={20} color={theme.colors.text.error} />
            <HeartIcon variant="bold" size={20} color={theme.colors.text.error} />
            <HeartIcon variant="bold" size={20} color={theme.colors.text.error} />
            <HeartIcon variant="outline" size={20} color={theme.colors.text.disabled} />
          </View>

          <AppText
            variant="bodySmall"
            color="secondary"
            style={{ marginBottom: 12 }}
          >
            Wake up at 5AM
          </AppText>

          {/* Avatars grid */}
          <View style={styles.avatarGrid}>
            <View style={styles.avatarWithStatus}>
              <Avatar size={52} border="green" styles={styles} theme={theme} />
              <StatusDot color={theme.colors.bg.success} styles={styles} />
            </View>
            <View style={styles.avatarWithStatus}>
              <Avatar size={52} border="green" styles={styles} theme={theme} />
              <StatusDot color={theme.colors.bg.success} styles={styles} />
            </View>
            <View style={styles.avatarWithStatus}>
              <Avatar size={52} border="green" styles={styles} theme={theme} />
              <StatusDot color={theme.colors.bg.success} styles={styles} />
            </View>
            <View style={styles.avatarWithStatus}>
              <Avatar size={52} border="red" styles={styles} theme={theme} />
              <StatusDot color={theme.colors.bg.success} styles={styles} />
            </View>
          </View>
        </View>
      </Card>

      {/* Slap reminder below card */}
      {showSlap && (
        <View style={styles.slapRow}>
          <View style={styles.avatarWithStatus}>
            <Avatar size={40} border="red" styles={styles} theme={theme} />
            <StatusDot color={theme.colors.bg.success} styles={styles} />
          </View>
          <View style={[styles.slapPill, { backgroundColor: brandColor }]}>
            <Text style={styles.slapText}>⏱ Slap</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Slide 5: Empty ─────────────────────────────────────────────
function EmptyIllustration() {
  return <View style={{ height: 40 }} />;
}

// ─── Main export ────────────────────────────────────────────────
export function OnboardingIllustration({
  type,
  testID = 'onboarding-illustration',
}: OnboardingIllustrationProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const renderIllustration = () => {
    switch (type) {
      case 'teamChallenge':
        return <TeamChallengeIllustration styles={styles} theme={theme} />;
      case 'photoProof':
        return <PhotoProofIllustration styles={styles} theme={theme} />;
      case 'sharedConsequences':
        return <TeamStatusCard showSlap={false} styles={styles} theme={theme} />;
      case 'slapReminder':
        return <TeamStatusCard showSlap styles={styles} theme={theme} />;
      case 'none':
      default:
        return <EmptyIllustration />;
    }
  };

  return <View testID={testID}>{renderIllustration()}</View>;
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    illustrationContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 260,
      width: '100%',
    },
    avatar: {
      backgroundColor: theme.colors.border.default,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      position: 'absolute',
      bottom: 0,
      right: 0,
      borderWidth: 1.5,
      borderColor: theme.colors.bg.surface,
    },
    floatingAvatars: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 8,
      alignItems: 'flex-end',
    },
    stackedCardsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 160,
      width: 220,
    },
    stackedCard: {
      position: 'absolute',
      width: 180,
      height: 130,
      borderRadius: 20,
    },
    mainCard: {
      width: 180,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
    },
    mainCardContent: {
      alignItems: 'center',
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoCard: {
      width: 220,
      height: 180,
      borderRadius: 20,
      backgroundColor: theme.colors.border.subtle,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    proofBadge: {
      position: 'absolute',
      top: 10,
      left: 10,
    },
    cameraButton: {
      width: 52,
      height: 52,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
    },
    teamCard: {
      borderRadius: 20,
      padding: 20,
      width: 230,
    },
    teamCardContent: {
      alignItems: 'center',
    },
    heartsRow: {
      flexDirection: 'row',
      gap: 4,
      marginBottom: 8,
    },
    avatarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      justifyContent: 'center',
    },
    avatarWithStatus: {
      position: 'relative',
    },
    slapRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 14,
    },
    slapPill: {
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    slapText: {
      color: theme.colors.text['on-brand'],
      fontWeight: '700',
      fontSize: 14,
    },
  });
}

