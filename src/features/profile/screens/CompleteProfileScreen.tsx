import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppText, Button, Card, Screen } from '@ds/components';
import { ArrowCircleLeftIcon, CameraIcon, EditIcon, InfoCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { IconButton } from '@shared/components';
import { session } from '@services/api';
import {
  markProfileSetupCompleted,
  profileService,
} from '../services';

type CompleteProfileScreenProps = {
  initialDisplayName?: string;
  initialAvatarUrl?: string;
  onBack?: () => void;
  onComplete: () => void;
};

export function CompleteProfileScreen({
  initialDisplayName,
  initialAvatarUrl,
  onBack,
  onComplete,
}: CompleteProfileScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [displayName, setDisplayName] = useState(initialDisplayName ?? '');
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | undefined>(initialAvatarUrl);
  const [error, setError] = useState<string | undefined>();
  const [info, setInfo] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedName = displayName.trim();

  useEffect(() => {
    let mounted = true;

    session.getCurrentUser().then((user) => {
      if (!mounted || displayName.trim()) return;

      setDisplayName(user?.displayName?.trim() || user?.username?.trim() || '');
      setSelectedPhotoUri(user?.avatarUrl ?? undefined);
    });

    return () => {
      mounted = false;
    };
  }, [displayName]);

  const handlePickPhoto = async () => {
    setInfo(undefined);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setInfo('Photo access was not granted. You can continue without a photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedPhotoUri(result.assets[0]?.uri);
        setInfo('Photo preview saved locally. Backend avatar upload is not available yet.');
      }
    } catch {
      setInfo('Could not open your photo library. You can continue without a photo.');
    }
  };

  const completeProfile = async (skipPhoto = false) => {
    if (!trimmedName) {
      setError('Display name is required.');
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    try {
      const updatedUser = await profileService.updateMe({
        displayName: trimmedName,
      });
      // TODO: Send selectedPhotoUri when the backend adds a real avatar upload/update endpoint.
      await session.setCurrentUser({
        ...updatedUser,
        avatarUrl: skipPhoto ? updatedUser.avatarUrl : (selectedPhotoUri ?? updatedUser.avatarUrl),
      });
      await markProfileSetupCompleted();
      onComplete();
    } catch (err) {
      setError(err instanceof TypeError
        ? 'Could not reach the server. Check your connection and try again.'
        : 'Could not save your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen scrollable padding="md" safeArea="top" contentStyle={styles.content} testID="complete-profile-screen">
      <View style={styles.header}>
        {onBack ? (
          <IconButton
            accessibilityLabel="Go back"
            onPress={onBack}
            variant="ghost"
            icon={<ArrowCircleLeftIcon size={30} color={theme.colors.text.brand} variant="outline" />}
            testID="complete-profile-back-button"
          />
        ) : null}
        <AppText variant="heading" style={styles.title}>
          Complete profile
        </AppText>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatarShell}>
          {selectedPhotoUri ? (
            <Image source={{ uri: selectedPhotoUri }} style={styles.avatarImage} />
          ) : (
            <CameraIcon size={64} color={theme.colors.icon.tertiary} variant="outline" />
          )}
          <View style={styles.editButtonWrap}>
            <IconButton
              accessibilityLabel="Upload profile photo"
              onPress={handlePickPhoto}
              size="lg"
              variant="brand"
              icon={<EditIcon size={24} color={theme.colors.text['on-brand']} variant="outline" />}
              testID="upload-photo-button"
            />
          </View>
        </View>
        <AppText variant="subtitle" style={styles.uploadLabel}>
          Upload photo
        </AppText>
      </View>

      <View style={styles.fieldGroup}>
        <AppText variant="label" style={styles.label}>
          Display Name
          <AppText variant="label" style={styles.required}>
            *
          </AppText>
        </AppText>
        <TextInput
          value={displayName}
          onChangeText={(value) => {
            setDisplayName(value);
            if (error) setError(undefined);
          }}
          placeholder="huangfu-1204"
          placeholderTextColor={theme.colors.text.disabled}
          autoCapitalize="words"
          style={[styles.input, error ? styles.inputError : null]}
          testID="display-name-input"
        />
        {error ? (
          <AppText variant="caption" style={styles.errorText}>
            {error}
          </AppText>
        ) : (
          <AppText variant="body" style={styles.helperText}>
            This is how your friends will see you in SOS
          </AppText>
        )}
      </View>

      <Card variant="outlined" style={styles.infoCard}>
        <InfoCircleIcon size={20} color={theme.colors.icon.info} variant="outline" />
        <AppText variant="body" style={styles.infoText}>
          You can update this later in Profile
        </AppText>
      </Card>

      {info ? (
        <AppText variant="caption" style={styles.noteText}>
          {info}
        </AppText>
      ) : null}

      <View style={styles.footer}>
        <Button
          title="Continue"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={completeProfile}
          testID="complete-profile-continue-button"
        />
        <Button
          title="Skip photo"
          variant="secondary"
          size="lg"
          fullWidth
          disabled={isSubmitting}
          onPress={() => {
            setSelectedPhotoUri(undefined);
            completeProfile(true);
          }}
          testID="complete-profile-skip-photo-button"
        />
      </View>
    </Screen>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      flexGrow: 1,
      gap: theme.spacing[24],
      paddingBottom: theme.spacing[24],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[16],
      paddingTop: theme.spacing[8],
    },
    title: {
      color: theme.colors.text.brand,
      fontWeight: '900',
    },
    avatarSection: {
      alignItems: 'center',
      gap: theme.spacing[12],
      paddingVertical: theme.spacing[24],
    },
    avatarShell: {
      width: 172,
      height: 172,
      borderRadius: 86,
      borderWidth: 4,
      borderColor: theme.colors.border.default,
      backgroundColor: theme.colors.bg['surface-elevated'],
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButtonWrap: {
      position: 'absolute',
      right: 10,
      bottom: 10,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 86,
    },
    uploadLabel: {
      color: theme.colors.text.secondary,
      fontWeight: '800',
    },
    fieldGroup: {
      gap: theme.spacing[8],
    },
    label: {
      color: theme.colors.text.secondary,
      fontWeight: '800',
    },
    required: {
      color: theme.colors.text.error,
      fontWeight: '900',
    },
    input: {
      minHeight: 58,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      borderRadius: theme.radius.xl,
      paddingHorizontal: theme.spacing[16],
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.bg.surface,
      fontSize: 18,
    },
    inputError: {
      borderColor: theme.colors.border.error,
    },
    helperText: {
      color: theme.colors.text.tertiary,
    },
    errorText: {
      color: theme.colors.text.error,
      fontWeight: '700',
    },
    infoCard: {
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[12],
      borderColor: theme.colors.border.info,
    },
    infoText: {
      flex: 1,
      color: theme.colors.text.info,
      fontWeight: '700',
    },
    noteText: {
      color: theme.colors.text.warning,
    },
    footer: {
      marginTop: 'auto',
      gap: theme.spacing[12],
    },
  });
}
