import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '@ds/components';

import {
  ActiveChallengeCard,
  ChallengeSectionIntro,
  ChallengeSegmentTabs,
  ChallengesHeader,
  FormationChallengeCard,
  HistoryChallengeCard,
} from '../components';

import {
  activeChallengesMock,
  formationChallengesMock,
  historyChallengesMock,
} from '../data/challenges.mock';

import type { ChallengeSegment } from '../types';

const SEGMENT_CONTENT: Record<
  ChallengeSegment,
  {
    title: string;
    description: string;
  }
> = {
  formation: {
    title: 'Challenges in Formation',
    description:
      'Review upcoming challenges, check member readiness, and wait for them to start.',
  },
  active: {
    title: 'Active Challenges',
    description:
      'Track ongoing challenges, monitor risk, and stay on top of each step.',
  },
  history: {
    title: 'Challenge History',
    description:
      'Look back at completed, failed, and cancelled challenges.',
  },
};

export function ChallengesScreen() {
  const [segment, setSegment] = useState<ChallengeSegment>('active');

  const segmentContent = SEGMENT_CONTENT[segment];

  const renderChallengeList = () => {
    switch (segment) {
      case 'formation':
        return (
          <View style={styles.list} testID="challenges-list">
            {formationChallengesMock.map((challenge) => (
              <FormationChallengeCard
                key={challenge.id}
                challenge={challenge}
                testID={`formation-challenge-card-${challenge.id}`}
              />
            ))}
          </View>
        );

      case 'active':
        return (
          <View style={styles.list} testID="challenges-list">
            {activeChallengesMock.map((challenge) => (
              <ActiveChallengeCard
                key={challenge.id}
                challenge={challenge}
                testID={`active-challenge-card-${challenge.id}`}
              />
            ))}
          </View>
        );

      case 'history':
        return (
          <View style={styles.list} testID="challenges-list">
            {historyChallengesMock.map((challenge) => (
              <HistoryChallengeCard
                key={challenge.id}
                challenge={challenge}
                testID={`history-challenge-card-${challenge.id}`}
              />
            ))}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Screen testID="challenges-screen">
      <View style={styles.root}>
        <ChallengesHeader />

        <ChallengeSegmentTabs
          activeSegment={segment}
          onSegmentChange={setSegment}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ChallengeSectionIntro
            title={segmentContent.title}
            description={segmentContent.description}
          />

          {renderChallengeList()}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 120,
  },
  list: {
    paddingHorizontal: 24,
    gap: 16,
  },
});