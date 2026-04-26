
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, AppText, Card, Button } from '@ds/components';
import { useTheme } from '@ds/theme';

export function FriendsScreen() {
  const theme = useTheme();

  return (
    <Screen testID="friends-screen"  >
      <AppText variant="headlineLarge" style={{ color: theme.colors.text.primary, marginBottom: 8 }}>
        Friends
      </AppText>
      <AppText variant="bodyMedium" style={{ color: theme.colors.text.secondary, marginBottom: 24 }}>
        Manage friend requests, squadmates, and close accountability circles.
      </AppText>
      
      <Card style={styles.card}>
        <AppText variant="titleMedium" style={{ color: theme.colors.text.primary }}>Friend requests</AppText>
        <AppText variant="bodySmall" style={{ color: theme.colors.text.secondary }}>No new requests</AppText>
      </Card>
      
      <Card style={styles.card}>
        <AppText variant="titleMedium" style={{ color: theme.colors.text.primary }}>Your friends</AppText>
        <AppText variant="bodySmall" style={{ color: theme.colors.text.secondary }}>You haven't added any friends yet.</AppText>
      </Card>

      <Button title="Find friends" intent="primary" variant="solid" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
});
