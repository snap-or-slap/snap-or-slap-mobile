import React, { useMemo, useState } from 'react';
import { Image, Linking, StyleSheet, TextInput, View } from 'react-native';
import { AppText, Button, Card, Screen } from '@ds/components';
import { CameraIcon, CloseIcon, InfoCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { IconButton } from '@shared/components';
import { checkinService } from '../services/checkin.service';
import { ApiError } from '@services/api';

type CheckInCameraScreenProps = {
  challengeId: string;
  currentUserId?: string;
  onBack: () => void;
  onSubmitted?: () => void;
};

const CAMERA_DEPENDENCY_MESSAGE =
  'Camera capture requires expo-camera or expo-image-picker. Add it with: npx expo install expo-camera';

export function CheckInCameraScreen({
  challengeId,
  currentUserId = 'me',
  onBack,
  onSubmitted,
}: CheckInCameraScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPhoto = Boolean(photoUri);

  const handleCaptureFallback = () => {
    setError(undefined);
    // TODO: Replace this local demo URI with a captured file URI from
    // expo-camera or expo-image-picker, then upload it and submit the media URL.
    setPhotoUri(`local://check-in-proof/${challengeId}/${Date.now()}`);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(undefined);

    try {
      void currentUserId;
      const hostedEvidenceUrl =
        photoUri?.startsWith('http://') || photoUri?.startsWith('https://')
          ? photoUri
          : undefined;

      // TODO: Submit hosted media here when the backend provides a binary upload endpoint.
      await checkinService.submitCheckin(challengeId, {
        evidenceUrl: hostedEvidenceUrl,
        caption: caption.trim() || undefined,
      });
      onSubmitted?.();
      onBack();
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.status === 409) {
        setError(submitError.message || 'You already checked in for this cycle.');
      } else if (submitError instanceof ApiError) {
        setError(submitError.message || 'Could not submit your check-in. Please try again.');
      } else {
        setError('Could not submit your check-in. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen padding="md" safeArea="top" contentStyle={styles.content} testID="check-in-camera-screen">
      <View style={styles.header}>
        <IconButton
          accessibilityLabel="Close check-in"
          onPress={onBack}
          variant="ghost"
          icon={<CloseIcon size={28} color={theme.colors.text.brand} variant="outline" />}
          testID="check-in-close-button"
        />
        <AppText variant="heading" style={styles.title}>
          Photo proof
        </AppText>
      </View>

      <View style={styles.previewArea}>
        {hasPhoto ? (
          photoUri?.startsWith('local://') ? (
            <View style={styles.demoPreview}>
              <CameraIcon size={64} color={theme.colors.icon.brand} variant="bold" />
              <AppText variant="subtitle" style={styles.demoTitle}>
                Demo proof ready
              </AppText>
              <AppText variant="caption" style={styles.demoCaption}>
                Replace this with a captured camera URI when camera dependencies are installed.
              </AppText>
            </View>
          ) : (
            <Image source={{ uri: photoUri }} style={styles.previewImage} />
          )
        ) : (
          <View style={styles.cameraFallback}>
            <CameraIcon size={72} color={theme.colors.icon.tertiary} variant="outline" />
            <AppText variant="subtitle" style={styles.cameraTitle}>
              Camera unavailable
            </AppText>
            <AppText variant="body" style={styles.cameraBody}>
              {CAMERA_DEPENDENCY_MESSAGE}
            </AppText>
          </View>
        )}
      </View>

      {!hasPhoto ? (
        <Card variant="outlined" style={styles.permissionCard}>
          <InfoCircleIcon size={20} color={theme.colors.icon.info} variant="outline" />
          <View style={styles.permissionText}>
            <AppText variant="subtitle" style={styles.permissionTitle}>
              Camera permission needed
            </AppText>
            <AppText variant="caption" style={styles.permissionDescription}>
              Once camera support is installed, denied permissions can be updated in device settings.
            </AppText>
          </View>
          <Button title="Open Settings" variant="secondary" size="sm" onPress={Linking.openSettings} />
        </Card>
      ) : null}

      <View style={styles.captionGroup}>
        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Add a short note..."
          placeholderTextColor={theme.colors.text.disabled}
          multiline
          style={styles.captionInput}
          testID="check-in-caption-input"
        />
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
            onPress={() => setPhotoUri(undefined)}
            testID="check-in-retake-button"
          />
        ) : (
          <Button
            title="Use demo proof"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={handleCaptureFallback}
            testID="check-in-capture-button"
          />
        )}

        <Button
          title="Submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleSubmit}
          testID="check-in-submit-button"
        />
      </View>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
    cameraFallback: {
      padding: theme.spacing[24],
      alignItems: 'center',
      gap: theme.spacing[12],
    },
    cameraTitle: {
      color: theme.colors.text.inverse,
      fontWeight: '900',
    },
    cameraBody: {
      color: theme.colors.text.inverse,
      textAlign: 'center',
      lineHeight: 22,
    },
    demoPreview: {
      width: '100%',
      height: '100%',
      padding: theme.spacing[24],
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing[12],
      backgroundColor: theme.colors.bg['brand-subtle'],
    },
    demoTitle: {
      color: theme.colors.text.brand,
      fontWeight: '900',
    },
    demoCaption: {
      color: theme.colors.text.secondary,
      textAlign: 'center',
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
      minHeight: 86,
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
