import React, { useEffect, useMemo, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { AppText, Badge, Button, Card, Screen } from '@ds/components';
import {
  ArrowCircleLeftIcon,
  CameraIcon,
  InfoCircleIcon,
  NotificationBingIcon,
  TickCircleIcon,
} from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { IconButton } from '@shared/components';
import { markPermissionsSetupCompleted } from '../services';

type PermissionItem = {
  key: 'notifications' | 'camera' | 'photos';
  title: string;
  description: string;
  state: PermissionState;
  icon: React.ReactNode;
};

type PermissionState = 'granted' | 'undetermined' | 'blocked' | 'unavailable';

type ExpoPermissionResponse = {
  granted?: boolean;
  status?: string;
  canAskAgain?: boolean;
};

type SetupPermissionsScreenProps = {
  onBack?: () => void;
  onComplete: () => void;
};

export function SetupPermissionsScreen({ onBack, onComplete }: SetupPermissionsScreenProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [states, setStates] = useState<Record<PermissionItem['key'], PermissionState>>({
    notifications: 'undetermined',
    camera: 'undetermined',
    photos: 'undetermined',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncPermissions = async () => {
      const nextStates = await getPermissionStates();

      if (isMounted) {
        setStates(nextStates);
      }
    };

    void syncPermissions();

    return () => {
      isMounted = false;
    };
  }, []);

  const items: PermissionItem[] = [
    {
      key: 'notifications',
      title: 'Notifications',
      description: 'Requires a development build for remote push notifications. You can continue without enabling this.',
      state: states.notifications,
      icon: <NotificationBingIcon size={28} color={theme.colors.icon.tertiary} variant="bold" />,
    },
    {
      key: 'camera',
      title: 'Camera',
      description: 'Take photo proof quickly for each challenge step',
      state: states.camera,
      icon: <CameraIcon size={28} color={theme.colors.icon.tertiary} variant="bold" />,
    },
    {
      key: 'photos',
      title: 'Photos',
      description: 'Choose images from your library for profile photo or proof when needed',
      state: states.photos,
      icon: <CameraIcon size={28} color={theme.colors.icon.tertiary} variant="bold" />,
    },
  ];

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      await markPermissionsSetupCompleted();
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestPermission = async (key: PermissionItem['key']) => {
    const nextState = await requestPermission(key);
    setStates((current) => ({
      ...current,
      [key]: nextState,
    }));
  };

  return (
    <Screen scrollable padding="md" safeArea="top" contentStyle={styles.content} testID="setup-permissions-screen">
      <View style={styles.header}>
        {onBack ? (
          <IconButton
            accessibilityLabel="Go back"
            onPress={onBack}
            variant="ghost"
            icon={<ArrowCircleLeftIcon size={30} color={theme.colors.text.brand} variant="outline" />}
            testID="setup-permissions-back-button"
          />
        ) : null}
        <AppText variant="heading" style={styles.title}>
          Set up permissions
        </AppText>
      </View>

      <View style={styles.permissionList}>
        {items.map((item) => (
          <PermissionCard key={item.key} item={item} />
        ))}
      </View>

      <Card variant="outlined" style={styles.infoCard}>
        <InfoCircleIcon size={20} color={theme.colors.icon.info} variant="outline" />
        <AppText variant="body" style={styles.infoText}>
          You can change these later in Settings
        </AppText>
      </Card>

      <View style={styles.footer}>
        <Button
          title="Continue"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleContinue}
          testID="setup-permissions-continue-button"
        />
      </View>
    </Screen>
  );

  function PermissionCard({ item }: { item: PermissionItem }) {
    const isGranted = item.state === 'granted';
    const isBlocked = item.state === 'blocked';
    const isUnavailable = item.state === 'unavailable';

    return (
      <Card style={styles.permissionCard}>
        <View style={styles.permissionTopRow}>
          <View style={styles.permissionTitleRow}>
            {item.icon}
            <AppText variant="subtitle" style={styles.permissionTitle}>
              {item.title}
            </AppText>
          </View>

          {isGranted ? (
            <Badge
              variant="success"
              leftIcon={<TickCircleIcon size={16} color={theme.colors.icon.success} variant="outline" />}
            >
              Allowed
            </Badge>
          ) : null}
        </View>

        <AppText variant="body" style={styles.permissionDescription}>
          {item.description}
        </AppText>

        {!isGranted ? (
          <View style={styles.permissionActionRow}>
            <Button
              title={isBlocked ? 'Open Settings' : isUnavailable ? 'Unavailable' : 'Allow'}
              variant={isUnavailable ? 'secondary' : 'primary'}
              size="sm"
              disabled={isUnavailable}
              onPress={isBlocked ? () => void Linking.openSettings() : () => handleRequestPermission(item.key)}
              testID={`permission-${item.key}-action`}
            />
          </View>
        ) : null}
      </Card>
    );
  }
}

async function getPermissionStates(): Promise<Record<PermissionItem["key"], PermissionState>> {
  const [camera, photos] = await Promise.all([
    getPermissionState(() => ImagePicker.getCameraPermissionsAsync()),
    getPermissionState(() => ImagePicker.getMediaLibraryPermissionsAsync()),
  ]);

  return {
    notifications: "unavailable",
    camera,
    photos,
  };
}

async function requestPermission(key: PermissionItem["key"]): Promise<PermissionState> {
  switch (key) {
    case "notifications":
      // Expo Go Android SDK 53+ does not support remote push notifications.
      // Keep this as a placeholder until we use a development build.
      return "unavailable";

    case "camera":
      return getPermissionState(() => ImagePicker.requestCameraPermissionsAsync());

    case "photos":
      return getPermissionState(() => ImagePicker.requestMediaLibraryPermissionsAsync());

    default:
      return "unavailable";
  }
}

async function getPermissionState(
  getPermission: () => Promise<ExpoPermissionResponse>,
): Promise<PermissionState> {
  try {
    return toPermissionState(await getPermission());
  } catch {
    return 'unavailable';
  }
}

function toPermissionState(response: ExpoPermissionResponse): PermissionState {
  if (response.granted || response.status === 'granted') {
    return 'granted';
  }

  if (response.status === 'denied' && response.canAskAgain === false) {
    return 'blocked';
  }

  return 'undetermined';
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
    permissionList: {
      gap: theme.spacing[16],
    },
    permissionCard: {
      gap: theme.spacing[16],
      backgroundColor: theme.colors.bg['brand-subtle'],
    },
    permissionTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing[12],
    },
    permissionTitleRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[12],
    },
    permissionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '900',
    },
    permissionDescription: {
      color: theme.colors.text.primary,
      lineHeight: 24,
    },
    permissionActionRow: {
      alignItems: 'flex-end',
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
    footer: {
      marginTop: 'auto',
    },
  });
}
