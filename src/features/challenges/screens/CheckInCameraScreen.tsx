import React, { useMemo, useRef, useState } from 'react';
import { Image, Linking, StyleSheet, TextInput, View } from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  type CameraCapturedPicture,
} from 'expo-camera';

import { AppText, Button, Card, Screen } from '@ds/components';
import { CloseIcon, InfoCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { IconButton } from '@shared/components';
import { useSubmitCheckinWithPhotoMutation } from '@store/api/checkinApi';

type CheckInCameraScreenProps = {
  challengeId: string;
  currentUserId?: string;
  onBack: () => void;
  onSubmitted?: () => void;
};

export function CheckInCameraScreen({
  challengeId,
  currentUserId,
  onBack,
  onSubmitted,
}: CheckInCameraScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [submitCheckinMutation, { isLoading: isSubmitting }] = useSubmitCheckinWithPhotoMutation();

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isCapturing, setIsCapturing] = useState(false);

  const hasPhoto = Boolean(photoUri);

  const handleRequestPermission = async () => {
    try {
      setError(undefined);
      await requestPermission();
    } catch {
      setError('Could not request camera permission. Please try again.');
    }
  };

  const handleOpenSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      setError('Could not open settings. Please update camera permission manually.');
    }
  };

  const handleCapture = async () => {
    try {
      setError(undefined);

      if (!cameraRef.current || !isCameraReady) {
        setError('Camera is not ready yet. Please try again.');
        return;
      }

      setIsCapturing(true);

      const photo: CameraCapturedPicture =
        await cameraRef.current.takePictureAsync({
          quality: 0.75,
          skipProcessing: false,
        });

      if (!photo.uri) {
        setError('Could not capture photo. Please try again.');
        return;
      }

      setPhotoUri(photo.uri);
    } catch {
      setError('Could not access camera. Please check camera permission.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleRetake = () => {
    setError(undefined);
    setPhotoUri(undefined);
    setIsCameraReady(false);
  };

  const handleSubmit = async () => {
    if (!photoUri) {
      setError('Please take a photo before submitting.');
      return;
    }

    setError(undefined);

    try {
      await submitCheckinMutation({
        challengeId,
        payload: {
          userId: currentUserId,
          photoUri,
          caption: caption.trim() || undefined,
        },
      }).unwrap();

      onSubmitted?.();
      onBack();
    } catch (submitError: any) {
      const status = submitError?.status;
      const message = submitError?.data?.message || submitError?.message || submitError?.error;

      if (status === 409) {
        setError(message || 'You already checked in for this cycle.');
      } else if (message) {
        setError(message);
      } else {
        setError('Could not submit your check-in. Please try again.');
      }
    }
  };

  if (!permission) {
    return (
      <Screen padding="md" safeArea="top" contentStyle={styles.centered}>
        <AppText variant="body" style={styles.loadingText}>
          Loading camera permission...
        </AppText>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen
        padding="md"
        safeArea="top"
        contentStyle={styles.content}
        testID="check-in-camera-permission-screen"
      >
        <View style={styles.header}>
          <IconButton
            accessibilityLabel="Close check-in"
            onPress={onBack}
            variant="ghost"
            icon={
              <CloseIcon
                size={28}
                color={theme.colors.text.brand}
                variant="outline"
              />
            }
            testID="check-in-close-button"
          />

          <AppText variant="heading" style={styles.title}>
            Photo proof
          </AppText>
        </View>

        <Card variant="outlined" style={styles.permissionCard}>
          <InfoCircleIcon
            size={20}
            color={theme.colors.icon.info}
            variant="outline"
          />

          <View style={styles.permissionText}>
            <AppText variant="subtitle" style={styles.permissionTitle}>
              Camera permission needed
            </AppText>

            <AppText variant="caption" style={styles.permissionDescription}>
              SnapOrSlap needs camera access so you can take a check-in proof.
            </AppText>
          </View>
        </Card>

        {error ? (
          <AppText variant="caption" style={styles.errorText}>
            {error}
          </AppText>
        ) : null}

        <View style={styles.footer}>
          <Button
            title="Grant Permission"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleRequestPermission}
            testID="check-in-grant-permission-button"
          />

          <Button
            title="Open Settings"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={handleOpenSettings}
            testID="check-in-open-settings-button"
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      padding="md"
      safeArea="top"
      contentStyle={styles.content}
      testID="check-in-camera-screen"
    >
      <View style={styles.header}>
        <IconButton
          accessibilityLabel="Close check-in"
          onPress={onBack}
          variant="ghost"
          icon={
            <CloseIcon
              size={28}
              color={theme.colors.text.brand}
              variant="outline"
            />
          }
          testID="check-in-close-button"
        />

        <AppText variant="heading" style={styles.title}>
          Photo proof
        </AppText>
      </View>

      <View style={styles.previewArea}>
        {hasPhoto ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.previewImage}
            resizeMode="cover"
            testID="check-in-photo-preview"
          />
        ) : (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
            onCameraReady={() => {
              setIsCameraReady(true);
            }}
          />
        )}
      </View>

      <View style={styles.captionGroup}>
        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Add a short note..."
          placeholderTextColor={theme.colors.text.disabled}
          multiline
          maxLength={280}
          editable={!isSubmitting}
          style={styles.captionInput}
          testID="check-in-caption-input"
        />

        <AppText variant="caption" style={styles.captionCounter}>
          {caption.length}/280
        </AppText>
      </View>

      {error ? (
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      ) : null}

      <View style={styles.footer}>
        {hasPhoto ? (
          <Button
            title="Retake"
            variant="secondary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            onPress={handleRetake}
            testID="check-in-retake-button"
          />
        ) : (
          <Button
            title="Take Photo"
            variant="secondary"
            size="lg"
            fullWidth
            loading={isCapturing}
            disabled={isCapturing || !isCameraReady}
            onPress={handleCapture}
            testID="check-in-capture-button"
          />
        )}

        <Button
          title="Submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting || !hasPhoto}
          onPress={handleSubmit}
          testID="check-in-submit-button"
        />
      </View>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      color: theme.colors.text.secondary,
    },
    content: {
      flex: 1,
      gap: theme.spacing[16],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[16],
    },
    title: {
      color: theme.colors.text.brand,
      fontWeight: '900',
    },
    previewArea: {
      flex: 1,
      minHeight: 320,
      borderRadius: theme.radius['2xl'],
      overflow: 'hidden',
      backgroundColor: theme.colors.bg['surface-inverse'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewImage: {
      width: '100%',
      height: '100%',
    },
    permissionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[12],
      borderColor: theme.colors.border.info,
    },
    permissionText: {
      flex: 1,
      gap: theme.spacing[4],
    },
    permissionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    permissionDescription: {
      color: theme.colors.text.secondary,
    },
    captionGroup: {
      minHeight: 104,
    },
    captionInput: {
      minHeight: 86,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      borderRadius: theme.radius.lg,
      padding: theme.spacing[16],
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.bg.surface,
      textAlignVertical: 'top',
      fontSize: 16,
    },
    captionCounter: {
      alignSelf: 'flex-end',
      color: theme.colors.text.secondary,
    },
    errorText: {
      color: theme.colors.text.error,
      fontWeight: '700',
    },
    footer: {
      gap: theme.spacing[12],
      paddingBottom: theme.spacing[8],
    },
  });
}