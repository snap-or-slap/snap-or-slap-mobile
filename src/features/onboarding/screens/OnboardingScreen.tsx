import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  Pressable,
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
import { AnimatedIllustration } from '../components/AnimatedIllustration';

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

  // Fade animation for text-content transitions
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevIndex = useRef(currentIndex);

  useEffect(() => {
    if (prevIndex.current !== currentIndex) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
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

  const brandColor = theme.colors.text.brand;

  // Show an arrow icon on intermediate slides (not first, not last)
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
            <ArrowCircleLeftIcon variant="outline" size={18} color={brandColor} />
            <AppText variant="label" style={{ color: brandColor, marginLeft: 4 }}>
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
            <AppText variant="label" style={{ color: brandColor }}>
              Skip
            </AppText>
          </Pressable>
        ) : (
          <View style={styles.navSpacer} />
        )}
      </View>

      {/* Illustration area with AnimatedIllustration for entry motion */}
      <View style={[styles.illustrationArea, currentSlide.illustrationType === 'none' && styles.illustrationAreaCompact]}>
        <AnimatedIllustration animKey={currentIndex}>
          <OnboardingIllustration type={currentSlide.illustrationType} />
        </AnimatedIllustration>
      </View>

      {/* Text content with slide fade */}
      <Animated.View style={[styles.textArea, { opacity: fadeAnim }]}>
        <OnboardingSlide
          title={currentSlide.title}
          description={currentSlide.description}
        />
      </Animated.View>

      {/* Flexible spacer */}
      <View style={{ flex: 1 }} />

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

const styles = StyleSheet.create(
  {
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
      width: 64,
    },
    illustrationArea: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 100,
      minHeight: 200,
      marginTop: 30,
    },
    illustrationAreaCompact: {
      minHeight: 200,
      maxHeight: 300,
    },
    textArea: {
      paddingTop: 60,
    },
    paginationContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    actionsContainer: {
      paddingBottom: 20,
    },
  }
);
