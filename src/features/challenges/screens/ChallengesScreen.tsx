
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Screen, AppText, Card, Badge } from '@ds/components';
import { useTheme } from '@ds/theme';
import { ChallengesHeader, ChallengeSegmentTabs, ChallengeSectionIntro } from '../components';
import { activeChallengesMock, formationChallengesMock, historyChallengesMock } from '../data/challenges.mock';
import { ChallengeSegment } from '../types';

export function ChallengesScreen() {
  const theme = useTheme();
  const [segment, setSegment] = useState<ChallengeSegment>('active');

  const renderIntro = () => {
    switch (segment) {
      case 'active':
        return (
          <ChallengeSectionIntro
            title="Active Challenges"
            description="Track ongoing challenges, monitor risk, and stay on top of each step."
          />
        );
      case 'formation':
        return (
          <ChallengeSectionIntro
            title="Challenges in Formation"
            description="Review upcoming challenges, check member readiness, and wait for them to start."
          />
        );
      case 'history':
        return (
          <ChallengeSectionIntro
            title="Challenge History"
            description="Look back at completed, failed, and cancelled challenges."
          />
        );
    }
  };

  const renderList = () => {
    let data: any[] = [];
    if (segment === 'active') data = activeChallengesMock;
    if (segment === 'formation') data = formationChallengesMock;
    if (segment === 'history') data = historyChallengesMock;

    return (
      <View style={styles.list} testID="challenges-list">
        {data.map((item, index) => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Badge tone={item.riskStatus === 'danger' ? 'danger' : 'neutral'}>{item.riskStatus || item.status || 'formation'}</Badge>
            </View>
            <AppText variant="titleMedium" style={{ color: theme.colors.text.primary, marginTop: 8 }}>
              {item.title}
            </AppText>
            <AppText variant="bodySmall" style={{ color: theme.colors.text.secondary, marginTop: 4 }}>
              {item.totalHeartsText || item.heartsText || item.description || ''}
            </AppText>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <Screen testID="challenges-screen" >
      <ChallengesHeader />
      <ChallengeSegmentTabs activeSegment={segment} onSegmentChange={setSegment} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderIntro()}
        {renderList()}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
  },
  list: {
    paddingHorizontal: 24,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    alignItems: 'flex-start',
  },
});
