import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppText, Badge, Button, Card, Screen } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type CreateChallengeScreenProps = {
  onBack?: () => void;
  onCreated?: (challengeId: string) => void;
};

type ActivityDraft = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

const friendOptions = [
  { id: 'friend-anna', username: 'anna' },
  { id: 'friend-khoa', username: 'khoa' },
  { id: 'friend-linh', username: 'linh' },
];

function createActivity(index: number): ActivityDraft {
  return {
    id: `activity-${index + 1}`,
    name: '',
    startTime: '06:00',
    endTime: '07:00',
  };
}

export function CreateChallengeScreen({
  onBack,
  onCreated,
}: CreateChallengeScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [title, setTitle] = useState('');
  const [startsOn, setStartsOn] = useState('2026-05-18');
  const [endsOn, setEndsOn] = useState('2026-05-31');
  const [resetTime, setResetTime] = useState('05:00');
  const [hearts, setHearts] = useState('3');
  const [activities, setActivities] = useState<ActivityDraft[]>([createActivity(0)]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const addActivity = () => {
    if (activities.length >= 5) {
      setSubmitMessage('Each challenge can have up to 5 activities for now.');
      return;
    }

    setActivities((current) => [...current, createActivity(current.length)]);
  };

  const updateActivity = (activityId: string, patch: Partial<ActivityDraft>) => {
    setActivities((current) =>
      current.map((activity) =>
        activity.id === activityId ? { ...activity, ...patch } : activity
      )
    );
  };

  const removeActivity = (activityId: string) => {
    if (activities.length === 1) {
      return;
    }

    setActivities((current) => current.filter((activity) => activity.id !== activityId));
  };

  const toggleFriend = (friendId: string) => {
    setSelectedFriendIds((current) =>
      current.includes(friendId)
        ? current.filter((id) => id !== friendId)
        : [...current, friendId]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setSubmitMessage('Add a challenge title before creating it.');
      return;
    }

    if (activities.some((activity) => !activity.name.trim())) {
      setSubmitMessage('Add a name for every activity.');
      return;
    }

    setSubmitMessage('Draft saved locally. Backend creation comes in the adapter batch.');
    onCreated?.('active-wake-up-5am-safe');
  };

  return (
    <Screen
      scrollable
      padding="md"
      keyboardShouldPersistTaps="handled"
      testID="create-challenge-screen"
      contentStyle={styles.content}
    >
      <View style={styles.header}>
        <Button
          title="Back"
          variant="ghost"
          size="sm"
          onPress={onBack}
          testID="create-challenge-back-button"
        />
        <View style={styles.headerText}>
          <AppText variant="heading" style={styles.title}>
            Create challenge
          </AppText>
          <AppText variant="body" style={styles.subtitle}>
            Set the stakes, schedule, and the friends who should keep you honest.
          </AppText>
        </View>
      </View>

      <Card style={styles.card}>
        <LabeledInput
          label="Challenge title"
          value={title}
          onChangeText={setTitle}
          placeholder="Wake Up 5AM"
          styles={styles}
        />

        <View style={styles.twoColumn}>
          <LabeledInput
            label="Starts"
            value={startsOn}
            onChangeText={setStartsOn}
            placeholder="YYYY-MM-DD"
            styles={styles}
          />
          <LabeledInput
            label="Ends"
            value={endsOn}
            onChangeText={setEndsOn}
            placeholder="YYYY-MM-DD"
            styles={styles}
          />
        </View>

        <View style={styles.twoColumn}>
          <LabeledInput
            label="Hearts"
            value={hearts}
            onChangeText={setHearts}
            placeholder="3"
            keyboardType="number-pad"
            styles={styles}
          />
          <LabeledInput
            label="Reset time"
            value={resetTime}
            onChangeText={setResetTime}
            placeholder="05:00"
            styles={styles}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderText}>
            <AppText variant="subtitle" style={styles.sectionTitle}>
              Daily activities
            </AppText>
            <AppText variant="caption" style={styles.helper}>
              Media proof is intentionally skipped in this batch.
            </AppText>
          </View>
          <Button title="Add" size="sm" variant="secondary" onPress={addActivity} />
        </View>

        {activities.map((activity, index) => (
          <View key={activity.id} style={styles.activityCard}>
            <View style={styles.sectionHeader}>
              <AppText variant="subtitle" style={styles.activityTitle}>
                Activity {index + 1}
              </AppText>
              {activities.length > 1 ? (
                <Button
                  title="Remove"
                  variant="ghost"
                  size="sm"
                  onPress={() => removeActivity(activity.id)}
                />
              ) : null}
            </View>

            <LabeledInput
              label="Name"
              value={activity.name}
              onChangeText={(value) => updateActivity(activity.id, { name: value })}
              placeholder="Post wake-up proof"
              styles={styles}
            />

            <View style={styles.twoColumn}>
              <LabeledInput
                label="From"
                value={activity.startTime}
                onChangeText={(value) => updateActivity(activity.id, { startTime: value })}
                placeholder="06:00"
                styles={styles}
              />
              <LabeledInput
                label="To"
                value={activity.endTime}
                onChangeText={(value) => updateActivity(activity.id, { endTime: value })}
                placeholder="07:00"
                styles={styles}
              />
            </View>
          </View>
        ))}
      </Card>

      <Card style={styles.card}>
        <AppText variant="subtitle" style={styles.sectionTitle}>
          Invite friends
        </AppText>
        <View style={styles.friendWrap}>
          {friendOptions.map((friend) => {
            const selected = selectedFriendIds.includes(friend.id);

            return (
              <Pressable
                key={friend.id}
                accessibilityRole="button"
                onPress={() => toggleFriend(friend.id)}
                style={styles.friendChipPressable}
              >
                <Badge
                  variant={selected ? 'brand' : 'neutral'}
                  size="md"
                  style={styles.friendChip}
                  textStyle={selected ? styles.friendChipTextSelected : styles.friendChipText}
                >
                  @{friend.username}
                </Badge>
              </Pressable>
            );
          })}
        </View>
      </Card>

      {submitMessage ? (
        <AppText variant="caption" style={styles.message}>
          {submitMessage}
        </AppText>
      ) : null}

      <Button
        title="Create challenge"
        variant="primary"
        size="lg"
        fullWidth
        onPress={handleSubmit}
        testID="create-challenge-submit-button"
      />
    </Screen>
  );
}

type LabeledInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'number-pad';
  styles: ReturnType<typeof createStyles>;
};

function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  styles,
}: LabeledInputProps) {
  return (
    <View style={styles.inputGroup}>
      <AppText variant="label" style={styles.inputLabel}>
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={styles.inputPlaceholder.color}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      gap: 16,
    },
    header: {
      gap: 12,
    },
    headerText: {
      gap: 6,
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    subtitle: {
      color: theme.colors.text.secondary,
    },
    card: {
      padding: 16,
      gap: 14,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12,
    },
    sectionHeaderText: {
      flex: 1,
      gap: 3,
    },
    sectionTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    helper: {
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
    inputGroup: {
      flex: 1,
      gap: 8,
    },
    inputLabel: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
    },
    input: {
      minHeight: 48,
      borderRadius: 16,
      paddingHorizontal: 14,
      backgroundColor: theme.colors.bg.surface,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      color: theme.colors.text.primary,
    },
    inputPlaceholder: {
      color: theme.colors.text.tertiary,
    },
    twoColumn: {
      flexDirection: 'row',
      gap: 10,
    },
    activityCard: {
      gap: 12,
      borderRadius: 18,
      padding: 14,
      backgroundColor: theme.colors.bg['brand-subtle'],
    },
    activityTitle: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    friendWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    friendChipPressable: {
      alignSelf: 'flex-start',
    },
    friendChip: {
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    friendChipText: {
      color: theme.colors.text.brand,
      fontWeight: '800',
    },
    friendChipTextSelected: {
      color: theme.colors.text['on-brand'],
    },
    message: {
      color: theme.colors.text.secondary,
      lineHeight: 18,
    },
  });
}
