import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '@ds/theme';
import { AppText, Screen } from '@ds/components';
import { ArrowCircleLeftIcon } from '@ds/icons';
import { useOnboarding } from '../hooks/useOnboarding';
import {
  AnimatedWaveBackground,
  OnboardingSlide,
  OnboardingPagination,
  OnboardingActions,
  OnboardingIllustration,
} from '../components';

interface OnboardingScreenProps {
  onComplete?: () => void;
  onLogin?: () => void;
  onCreateAccount?: () => void;
}

export function OnboardingScreen({
  onComplete,
  onLogin,
  onCreateAccount,
}: OnboardingScreenProps) {
  const theme = useTheme();
  const { height: screenHeight } = useWindowDimensions();

  const {
    currentIndex,
    currentSlide,
    totalSlides,
    isFirstSlide,
    isLastSlide,
    goBack,
    skip,
    handlePrimaryAction,
    handleSecondaryAction,
  } = useOnboarding({ onComplete, onLogin, onCreateAccount });

  // Fade animation for content transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevIndex = useRef(currentIndex);

  useEffect(() => {
    if (prevIndex.current !== currentIndex) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      prevIndex.current = currentIndex;
    }
  }, [currentIndex]);

  const pageBg = theme.colors.bg.page;
  const brandColor = theme.colors.text.brand;
  const borderSubtle = theme.colors.border.subtle;

  // Determine if the "Next" button should show an arrow icon
  const showRightArrow = !isFirstSlide && !isLastSlide;

  return (
    <Screen testID="onboarding-screen">
      <StatusBar barStyle="dark-content" />

      {/* Animated wave background */}
      <AnimatedWaveBackground currentIndex={currentIndex} />

      {/* Top navigation row */}
      <View style={styles.navRow}>
        {currentSlide.showBack ? (
          <Pressable
            onPress={goBack}
            style={styles.backButton}
            testID="onboarding-back-button"
          >
            <ArrowCircleLeftIcon variant="outline" size={16} color={brandColor} />
            <AppText
              variant="labelLarge"
              style={{ color: brandColor, marginLeft: 4 }}
            >
              Back
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.navSpacer} />
        )}

        {currentSlide.showSkip ? (
          <Pressable
            onPress={skip}
            style={[styles.skipButton, { borderColor: brandColor }]}
            testID="onboarding-skip-button"
          >
            <AppText
              variant="labelMedium"
              style={{ color: brandColor }}
            >
              Skip
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.navSpacer} />
        )}
      </View>

      {/* Illustration */}
      <Animated.View
        style={[
          styles.illustrationArea,
          {
            opacity: fadeAnim,
            // Use proportional height based on whether we're on the last slide
            flex: currentSlide.illustrationType === 'none' ? 0.3 : 1,
          },
        ]}
      >
        <OnboardingIllustration type={currentSlide.illustrationType} />
      </Animated.View>

      {/* Text content */}
      <Animated.View style={[styles.textArea, { opacity: fadeAnim }]}>
        <OnboardingSlide
          title={currentSlide.title}
          description={currentSlide.description}
        />
      </Animated.View>

      {/* Spacer to push pagination + buttons to bottom */}
      <View style={{ flex: currentSlide.illustrationType === 'none' ? 1 : 0.3 }} />

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <OnboardingPagination total={totalSlides} activeIndex={currentIndex} />
      </View>

      {/* Action buttons */}
      <View style={styles.actionsContainer}>
        <OnboardingActions
          primaryLabel={currentSlide.primaryLabel}
          secondaryLabel={currentSlide.secondaryLabel}
          showRightArrow={showRightArrow}
          onPrimaryPress={handlePrimaryAction}
          onSecondaryPress={
            currentSlide.secondaryLabel ? handleSecondaryAction : undefined
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipButton: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  navSpacer: {
    width: 60,
  },
  illustrationArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  textArea: {
    paddingTop: 8,
  },
  paginationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  actionsContainer: {
    paddingBottom: 16,
  },
});
