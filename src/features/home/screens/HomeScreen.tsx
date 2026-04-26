
import React from 'react';
import { StyleSheet } from 'react-native';
import { Screen, AppText } from '@ds/components';

export const HomeScreen = () => (
  <Screen padded style={styles.container}>
    <AppText variant="titleMedium">Home Screen</AppText>
  </Screen>
);
const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' } });
