import React from 'react';
import { View } from 'react-native';
import { Screen, AppText, Card, Button, Badge } from '../design-system/components';

export const AppNavigator = () => {
  return (
    <Screen padded scroll>
      <View style={{ gap: 16 }}>
        <AppText variant="displaySmall">SnapOrSlap</AppText>
        <AppText variant="bodyLarge" color="secondary">Design system is ready.</AppText>

        <Card variant="elevated">
          <View style={{ gap: 12 }}>
            <AppText variant="titleMedium">Card Example</AppText>
            <Badge tone="success">Active</Badge>
          </View>
        </Card>

        <Button intent="primary" variant="solid" title="Continue" />
        <Button intent="subtle" variant="ghost" title="Skip" />
        <Button intent="negative" variant="outline" title="Reject example" />
        <Button intent="positive" variant="solid" title="Accept example" />
      </View>
    </Screen>
  );
};
