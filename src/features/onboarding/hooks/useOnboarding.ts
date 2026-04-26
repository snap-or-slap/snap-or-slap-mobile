import { useState, useCallback } from 'react';
import { onboardingSlides } from '../data/onboardingSlides';

interface UseOnboardingOptions {
  onComplete?: () => void;
  onLogin?: () => void;
  onCreateAccount?: () => void;
}

export function useOnboarding(options: UseOnboardingOptions = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides = onboardingSlides;
  const totalSlides = slides.length;

  const currentSlide = slides[currentIndex];
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === totalSlides - 1;

  const completeOnboarding = useCallback(() => {
    if (options.onComplete) {
      options.onComplete();
    }
    // If no onComplete callback is provided, this is a no-op.
    // Navigation integration will be handled at the screen level.
  }, [options.onComplete]);

  const goNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalSlides]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const skip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const handlePrimaryAction = useCallback(() => {
    if (isFirstSlide) {
      // "Get started" → move to next slide
      goNext();
    } else if (isLastSlide) {
      // "Create account" → complete onboarding
      // TODO: eventually navigate to Register/Auth screen
      if (options.onCreateAccount) {
        options.onCreateAccount();
      } else {
        completeOnboarding();
      }
    } else {
      // "Next" → move to next slide
      goNext();
    }
  }, [isFirstSlide, isLastSlide, goNext, completeOnboarding, options.onCreateAccount]);

  const handleSecondaryAction = useCallback(() => {
    if (isFirstSlide) {
      // "I already have an account" → complete onboarding
      // TODO: eventually navigate to Login/Auth screen
      if (options.onLogin) {
        options.onLogin();
      } else {
        completeOnboarding();
      }
    } else if (isLastSlide) {
      // "Log in" → complete onboarding
      // TODO: eventually navigate to Login/Auth screen
      if (options.onLogin) {
        options.onLogin();
      } else {
        completeOnboarding();
      }
    }
  }, [isFirstSlide, isLastSlide, completeOnboarding, options.onLogin]);

  return {
    currentIndex,
    currentSlide,
    totalSlides,
    isFirstSlide,
    isLastSlide,
    goNext,
    goBack,
    skip,
    completeOnboarding,
    handlePrimaryAction,
    handleSecondaryAction,
  };
}
