import React from 'react';
import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { DangerZoneCard } from '../DangerZoneCard';
import { DeleteAccountConfirmCard } from '../DeleteAccountConfirmCard';
import { ProfileBadgeSection } from '../ProfileBadgeSection';
import { ProfileHeaderCard } from '../ProfileHeaderCard';
import { ProfileSettingRow } from '../ProfileSettingRow';
import { ProfileSettingsSection } from '../ProfileSettingsSection';
import { ProfileStatCard } from '../ProfileStatCard';
import { ProfileStatsGrid } from '../ProfileStatsGrid';
import { ThemeModeSelector } from '../ThemeModeSelector';
import type { UserProfile } from '../../types';

const profile: UserProfile = {
  id: 'user-1',
  username: 'mina',
  displayName: 'Mina Park',
  email: 'mina@example.com',
  bio: 'Morning challenge host',
  isPrivate: true,
  currentStreak: 9,
  challengesJoined: 12,
  completionRate: 86,
  badges: [{ id: 'badge-1', label: 'Early Bird' }],
};

describe('profile components', () => {
  it('renders the header card with identity and bio', () => {
    renderWithTheme(<ProfileHeaderCard profile={profile} />);

    expect(screen.getByText('Mina Park')).toBeTruthy();
    expect(screen.getByText('@mina')).toBeTruthy();
    expect(screen.getByText('mina@example.com')).toBeTruthy();
    expect(screen.getByText('Morning challenge host')).toBeTruthy();
    expect(screen.getByText('You')).toBeTruthy();
  });

  it('renders stats grid from profile metrics and fallback badge count', () => {
    renderWithTheme(<ProfileStatsGrid profile={profile} />);

    expect(screen.getByText('Stats')).toBeTruthy();
    expect(screen.getByText('Current streak')).toBeTruthy();
    expect(screen.getByText('9')).toBeTruthy();
    expect(screen.getByText('Challenges')).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
    expect(screen.getByText('Completion')).toBeTruthy();
    expect(screen.getByText('86%')).toBeTruthy();
    expect(screen.getByText('Badges')).toBeTruthy();
  });

  it('renders a single stat card', () => {
    renderWithTheme(<ProfileStatCard label="Friends" value={4} />);

    expect(screen.getByText('Friends')).toBeTruthy();
    expect(screen.getByText('4')).toBeTruthy();
  });

  it('renders a setting row with optional helper and action', () => {
    renderWithTheme(
      <ProfileSettingRow label="Privacy" value="Private profile" helperText="Friends only">
        <Text>Action</Text>
      </ProfileSettingRow>
    );

    expect(screen.getByText('Privacy')).toBeTruthy();
    expect(screen.getByText('Private profile')).toBeTruthy();
    expect(screen.getByText('Friends only')).toBeTruthy();
    expect(screen.getByText('Action')).toBeTruthy();
  });

  it('renders settings and handles privacy/logout actions', () => {
    const onPrivacyChange = jest.fn();
    const onLogout = jest.fn();

    renderWithTheme(
      <ProfileSettingsSection
        profile={profile}
        onPrivacyChange={onPrivacyChange}
        onLogout={onLogout}
      />
    );

    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('Private profile')).toBeTruthy();
    expect(screen.getByText('@mina')).toBeTruthy();

    fireEvent(screen.getByTestId('profile-privacy-switch'), 'valueChange', false);
    fireEvent.press(screen.getByTestId('profile-logout-button'));

    expect(onPrivacyChange).toHaveBeenCalledWith(false);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('allows switching theme mode', () => {
    renderWithTheme(<ThemeModeSelector />);

    fireEvent.press(screen.getByText('Dark'));

    expect(screen.getByText('Light')).toBeTruthy();
    expect(screen.getByText('System')).toBeTruthy();
  });

  it('renders earned and locked badges', () => {
    renderWithTheme(<ProfileBadgeSection profile={profile} />);

    expect(screen.getByText('Badges and trophies')).toBeTruthy();
    expect(screen.getByText('Early Bird')).toBeTruthy();
    expect(screen.getByText('Consistency')).toBeTruthy();
    expect(screen.getByText('Squad MVP')).toBeTruthy();
  });

  it('opens danger zone delete action', () => {
    const onDeletePress = jest.fn();

    renderWithTheme(<DangerZoneCard onDeletePress={onDeletePress} />);

    expect(screen.getByText('Danger zone')).toBeTruthy();
    fireEvent.press(screen.getByTestId('delete-account-open'));

    expect(onDeletePress).toHaveBeenCalledTimes(1);
  });

  it('confirms or cancels account deletion and renders errors', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    renderWithTheme(
      <DeleteAccountConfirmCard
        error="Deletion failed"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('Delete account?')).toBeTruthy();
    expect(screen.getByText('Deletion failed')).toBeTruthy();

    fireEvent.press(screen.getByText('Cancel'));
    fireEvent.press(screen.getByTestId('delete-account-confirm'));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
