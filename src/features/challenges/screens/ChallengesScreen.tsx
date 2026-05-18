import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Screen } from '@ds/components';

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

type ChallengesScreenProps = {
  onCreateChallenge?: () => void;
  onOpenChallenge?: (challengeId: string) => void;
};

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

export function ChallengesScreen({
  onCreateChallenge,
  onOpenChallenge,
}: ChallengesScreenProps) {
  const [segment, setSegment] = useState<ChallengeSegment>('active');

  const segmentContent = SEGMENT_CONTENT[segment];

  const renderChallengeList = () => {
    switch (segment) {
      case 'formation':
        return (
          <View style={styles.list} testID="challenges-list">
            {formationChallengesMock.map((challenge) => (
              <Pressable
                key={challenge.id}
                testID={`formation-challenge-card-${challenge.id}`}
                onPress={() => onOpenChallenge?.(challenge.id)}
              >
                <FormationChallengeCard
                  challenge={challenge}
                />
              </Pressable>
            ))}
          </View>
        );

      case 'active':
        return (
          <View style={styles.list} testID="challenges-list">
            {activeChallengesMock.map((challenge) => (
              <Pressable
                key={challenge.id}
                testID={`active-challenge-card-${challenge.id}`}
                onPress={() => onOpenChallenge?.(challenge.id)}
              >
                <ActiveChallengeCard
                  challenge={challenge}
                />
              </Pressable>
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
          <View style={styles.createAction}>
            <Button
              title="Create challenge"
              variant="primary"
              onPress={onCreateChallenge}
              testID="open-create-challenge-button"
            />
          </View>

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
  createAction: {
    paddingHorizontal: 24,
    marginBottom: 18,
  },
  list: {
    paddingHorizontal: 24,
    gap: 16,
  },
});
