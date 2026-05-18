import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppText, Card, Badge } from '@ds/components';
import {
  HeartIcon,
  ProfileCircleIcon,
  FlashIcon,
  ClockIcon,
  TickCircleIcon,
  SmileysIcon,
} from '@ds/icons';
import type { IllustrationType } from '../data/onboardingSlides';

// ─── Asset ──────────────────────────────────────────────────────────────────
const photoProofImage = require('@assets/images/onboarding/photo-proof-onboarding.png');

interface OnboardingIllustrationProps {
  type: IllustrationType;
  testID?: string;
}

// ─── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({
  size = 44,
  border,
  theme,
  done,
}: {
  size?: number;
  border?: 'success' | 'error';
  theme: AppTheme;
  done?: boolean;
}) {
  const borderColor =
    border === 'success'
      ? theme.colors.border.success
      : border === 'error'
      ? theme.colors.border.error
      : 'transparent';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: border ? 2.5 : 0,
        borderColor,
        backgroundColor: theme.colors.bg['brand-subtle'],
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <ProfileCircleIcon
        size={size * 0.65}
        color={theme.colors.icon.brand}
        variant="bulk"
      />
      {done && (
        <View
          style={{
            position: 'absolute',
            bottom: -1,
            right: -1,
            backgroundColor: theme.colors.bg.success,
            borderRadius: 8,
            width: 14,
            height: 14,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: theme.colors.bg.surface,
          }}
        >
          <TickCircleIcon size={10} color={theme.colors.text['on-brand']} variant="bold" />
        </View>
      )}
    </View>
  );
}

// ─── Slide 1: Team Challenge ─────────────────────────────────────────────────
function TeamChallengeIllustration({ theme }: { theme: AppTheme }) {
  const brandBg = theme.colors.bg['brand-subtle'];
  const brandColor = theme.colors.text.brand;
  const surfaceColor = theme.colors.bg.surface;

  return (
    <View style={styles.illustrationContainer}>
      {/* Floating avatar row */}
      <View style={styles.floatingAvatars}>
        <Avatar size={36} theme={theme} />
        <Avatar size={52} border="success" done theme={theme} />
        <Avatar size={36} theme={theme} />
      </View>

      {/* Stacked cards composition */}
      <View style={styles.stackedCardsContainer}>
        {/* Back card – left tilt */}
        <Card
          variant="elevated"
          style={[
            styles.stackedCard,
            styles.backCardLeft,
            { backgroundColor: surfaceColor, borderColor: theme.colors.border.subtle },
          ]}
        >
          <View />
        </Card>

        {/* Back card – right tilt */}
        <Card
          variant="elevated"
          style={[
            styles.stackedCard,
            styles.backCardRight,
            { backgroundColor: brandBg, borderColor: theme.colors.border.subtle },
          ]}
        >
          <View />
        </Card>

        {/* Main card */}
        <Card variant="elevated" style={styles.mainCard}>
          <View style={styles.mainCardContent}>
            <SmileysIcon
              size={72}
              color={theme.colors.icon.brand}
              secondaryColor={theme.colors.bg.brand}
              variant="bulk"
            />
            <View style={styles.mainCardTextGroup}>
              <AppText variant="label" style={{ color: brandColor }}>
                Challenge
              </AppText>
              <AppText variant="caption" color="secondary" style={styles.centeredText}>
                Wake up at 5AM
              </AppText>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
}

// ─── Slide 2: Photo Proof ────────────────────────────────────────────────────
function PhotoProofIllustration({ theme }: { theme: AppTheme }) {
  return (
    <View style={styles.photoProofContainer}>
      <Image
        source={photoProofImage}
        resizeMode="contain"
        style={styles.photoProofImage}
        testID="photo-proof-image"
      />
    </View>
  );
}

// ─── Slide 3: Shared Consequences ────────────────────────────────────────────
function SharedConsequencesIllustration({ theme }: { theme: AppTheme }) {
  return (
    <View style={styles.illustrationContainer}>
      <Card variant="elevated" style={styles.teamCard}>
        <View style={styles.teamCardContent}>
          {/* Hearts row */}
          <View style={styles.heartsRow}>
            <HeartIcon variant="bold" size={22} color={theme.colors.text.error} />
            <HeartIcon variant="bold" size={22} color={theme.colors.text.error} />
            <HeartIcon variant="bold" size={22} color={theme.colors.text.error} />
            <HeartIcon variant="outline" size={22} color={theme.colors.text.disabled} />
            <HeartIcon variant="outline" size={22} color={theme.colors.text.disabled} />
          </View>

          <AppText variant="caption" color="secondary" style={[styles.centeredText, { marginBottom: 16 }]}>
            Wake up at 5AM
          </AppText>

          {/* Avatar grid – all green (team doing well) */}
          <View style={styles.avatarGrid}>
            <Avatar size={48} border="success" done theme={theme} />
            <Avatar size={48} border="success" done theme={theme} />
            <Avatar size={48} border="success" done theme={theme} />
            <Avatar size={48} border="error" theme={theme} />
          </View>
        </View>
      </Card>
    </View>
  );
}

// ─── Slide 4: Slap Reminder ───────────────────────────────────────────────────
function SlapReminderIllustration({ theme }: { theme: AppTheme }) {
  const brandColor = theme.colors.bg.brand;

  return (
    <View style={styles.illustrationContainer}>
      <Card variant="elevated" style={styles.teamCard}>
        <View style={styles.teamCardContent}>
          {/* Hearts – one missing */}
          <View style={styles.heartsRow}>
            <HeartIcon variant="bold" size={22} color={theme.colors.text.error} />
            <HeartIcon variant="bold" size={22} color={theme.colors.text.error} />
            <HeartIcon variant="outline" size={22} color={theme.colors.text.disabled} />
            <HeartIcon variant="outline" size={22} color={theme.colors.text.disabled} />
            <HeartIcon variant="outline" size={22} color={theme.colors.text.disabled} />
          </View>

          <AppText variant="caption" color="secondary" style={[styles.centeredText, { marginBottom: 16 }]}>
            Wake up at 5AM
          </AppText>

          {/* Avatars – one late (red border) */}
          <View style={styles.avatarGrid}>
            <Avatar size={48} border="success" done theme={theme} />
            <Avatar size={48} border="success" done theme={theme} />
            <Avatar size={48} border="error" theme={theme} />
            <Avatar size={48} border="error" theme={theme} />
          </View>
        </View>
      </Card>

      {/* Slap reminder pill */}
      <View style={styles.slapRow}>
        <Avatar size={38} border="error" theme={theme} />
        <View style={[styles.slapPill, { backgroundColor: brandColor }]}>
          <ClockIcon size={14} color={theme.colors.text['on-brand']} variant="bold" />
          <AppText
            variant="label"
            style={{ color: theme.colors.text['on-brand'], marginLeft: 6 }}
          >
            Slap reminder
          </AppText>
        </View>
      </View>
    </View>
  );
}

// ─── Slide 5: Empty / CTA ────────────────────────────────────────────────────
function CTAIllustration({ theme }: { theme: AppTheme }) {
  return (
    <View style={styles.ctaIllustration}>
      <View
        style={[
          styles.ctaIconCircle,
          { backgroundColor: theme.colors.bg['brand-subtle'] },
        ]}
      >
        <FlashIcon
          size={52}
          color={theme.colors.icon.brand}
          variant="bulk"
        />
      </View>
    </View>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function OnboardingIllustration({
  type,
  testID = 'onboarding-illustration',
}: OnboardingIllustrationProps) {
  const theme = useTheme();

  const renderIllustration = () => {
    switch (type) {
      case 'teamChallenge':
        return <TeamChallengeIllustration theme={theme} />;
      case 'photoProof':
        return <PhotoProofIllustration theme={theme} />;
      case 'sharedConsequences':
        return <SharedConsequencesIllustration theme={theme} />;
      case 'slapReminder':
        return <SlapReminderIllustration theme={theme} />;
      case 'none':
      default:
        return <CTAIllustration theme={theme} />;
    }
  };

  return <View testID={testID}>{renderIllustration()}</View>;
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    width: '100%',
  },
  floatingAvatars: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  stackedCardsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 190,
    width: 240,
  },
  stackedCard: {
    position: 'absolute',
    width: 180,
    height: 152,
    borderRadius: 24,
    borderWidth: 1,
  },
  backCardLeft: {
    transform: [{ rotate: '-10deg' }, { translateX: -22 }, { translateY: 14 }],
    opacity: 0.65,
  },
  backCardRight: {
    transform: [{ rotate: '10deg' }, { translateX: 22 }, { translateY: 10 }],
    opacity: 0.75,
  },
  mainCard: {
    width: 188,
    minHeight: 172,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  mainCardContent: {
    alignItems: 'center',
    gap: 12,
  },
  mainCardTextGroup: {
    alignItems: 'center',
    gap: 4,
  },
  centeredText: {
    textAlign: 'center',
  },

  // Photo proof
  photoProofContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  photoProofImage: {
    width: '85%',
    height: 280,
  },

  // Team / hearts / avatars shared
  teamCard: {
    borderRadius: 20,
    padding: 20,
    width: 240,
  },
  teamCardContent: {
    alignItems: 'center',
  },
  heartsRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 10,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },

  // Slap pill
  slapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  slapPill: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // CTA slide
  ctaIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    width: '100%',
  },
  ctaIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
