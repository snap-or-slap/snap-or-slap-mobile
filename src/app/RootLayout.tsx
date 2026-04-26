import React from 'react';
import { View, StyleSheet } from 'react-native';

export const RootLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: { flex: 1 }
});
