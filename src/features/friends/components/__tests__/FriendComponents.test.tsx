import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../../../../test-utils/renderWithTheme';
import { FriendListItem } from '../FriendListItem';
import { FriendProfileActions } from '../FriendProfileActions';
import { FriendRequestCard } from '../FriendRequestCard';
import { FriendRequestPreviewCard } from '../FriendRequestPreviewCard';
import { FriendRequestTabs } from '../FriendRequestTabs';
import { FriendSearchBar } from '../FriendSearchBar';
import { FriendSearchResultCard } from '../FriendSearchResultCard';
import { RelationshipBadge } from '../RelationshipBadge';
import type { FriendRequest, FriendUser } from '../../types';

const friend: FriendUser = {
  id: 'user-1',
  username: 'mina',
  displayName: 'Mina Park',
  currentStreak: 5,
  activeChallengesCount: 2,
  mutualCount: 3,
  relationship: 'none',
};

const request: FriendRequest = {
  id: 'request-1',
  direction: 'incoming',
  status: 'pending',
  user: friend,
  createdAt: '2026-05-01T00:00:00.000Z',
};

describe('FriendSearchBar', () => {
  it('changes text and clears a non-empty search', () => {
    const onChangeText = jest.fn();
    const onClear = jest.fn();

    renderWithTheme(
      <FriendSearchBar
        value="mina"
        onChangeText={onChangeText}
        onClear={onClear}
        testID="friend-search"
      />
    );

    fireEvent.changeText(screen.getByTestId('friend-search-input'), 'min');
    fireEvent.press(screen.getByTestId('friend-search-clear'));

    expect(onChangeText).toHaveBeenCalledWith('min');
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});

describe('FriendSearchResultCard', () => {
  it('renders user metadata and calls add friend when allowed', () => {
    const onPress = jest.fn();
    const onAddFriend = jest.fn();

    renderWithTheme(
      <FriendSearchResultCard
        user={friend}
        onPress={onPress}
        onAddFriend={onAddFriend}
        testID="search-result"
      />
    );

    expect(screen.getByText('Mina Park')).toBeTruthy();
    expect(screen.getByText(/@mina/)).toBeTruthy();

    fireEvent.press(screen.getByTestId('search-result'));
    fireEvent.press(screen.getByTestId('search-result-add'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onAddFriend).toHaveBeenCalledTimes(1);
  });

  it('disables add action for existing friends', () => {
    renderWithTheme(
      <FriendSearchResultCard
        user={{ ...friend, relationship: 'friend' }}
        onAddFriend={jest.fn()}
        testID="friend-result"
      />
    );

    expect(screen.getByTestId('friend-result-add')).toBeDisabled();
    expect(screen.getByText('Friends')).toBeTruthy();
  });
});

describe('FriendRequestCard', () => {
  it('accepts and declines incoming requests', () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();

    renderWithTheme(
      <FriendRequestCard
        request={request}
        mode="incoming"
        onAccept={onAccept}
        onDecline={onDecline}
        testID="incoming-request"
      />
    );

    fireEvent.press(screen.getByTestId('incoming-request-accept'));
    fireEvent.press(screen.getByTestId('incoming-request-decline'));

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onDecline).toHaveBeenCalledTimes(1);
  });

  it('shows outgoing request status without action buttons', () => {
    renderWithTheme(
      <FriendRequestCard
        request={{ ...request, direction: 'outgoing' }}
        mode="outgoing"
        testID="outgoing-request"
      />
    );

    expect(screen.getByText('Request sent')).toBeTruthy();
    expect(screen.getByText('Waiting')).toBeTruthy();
    expect(screen.queryByText('Accept')).toBeNull();
  });
});

describe('FriendRequestPreviewCard', () => {
  it('renders compact preview and handles actions', () => {
    const onAccept = jest.fn();
    const onDecline = jest.fn();
    const onPress = jest.fn();

    renderWithTheme(
      <FriendRequestPreviewCard
        request={request}
        onAccept={onAccept}
        onDecline={onDecline}
        onPress={onPress}
        testID="preview-request"
      />
    );

    fireEvent.press(screen.getByTestId('preview-request'));
    fireEvent.press(screen.getByTestId('preview-request-accept'));
    fireEvent.press(screen.getByTestId('preview-request-decline'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onDecline).toHaveBeenCalledTimes(1);
  });
});

describe('FriendRequestTabs', () => {
  it('switches between incoming and outgoing tabs', () => {
    const onChangeTab = jest.fn();

    renderWithTheme(
      <FriendRequestTabs
        activeTab="incoming"
        onChangeTab={onChangeTab}
        incomingCount={2}
        outgoingCount={1}
        testID="request-tabs"
      />
    );

    fireEvent.press(screen.getByText('Outgoing'));

    expect(onChangeTab).toHaveBeenCalledWith('outgoing');
  });
});

describe('FriendListItem', () => {
  it('renders friend summary and opens the profile', () => {
    const onPress = jest.fn();

    renderWithTheme(
      <FriendListItem friend={friend} onPress={onPress} testID="friend-item" />
    );

    expect(screen.getByText('Mina Park')).toBeTruthy();
    expect(screen.getByText('@mina')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('2 active challenges')).toBeTruthy();

    fireEvent.press(screen.getByTestId('friend-item'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('FriendProfileActions', () => {
  it('starts remove flow and confirms removal', () => {
    const onStartRemove = jest.fn();
    const onCancelRemove = jest.fn();
    const onConfirmRemove = jest.fn();
    const { rerender } = renderWithTheme(
      <FriendProfileActions
        confirming={false}
        onStartRemove={onStartRemove}
        onCancelRemove={onCancelRemove}
        onConfirmRemove={onConfirmRemove}
      />
    );

    fireEvent.press(screen.getByTestId('remove-friend-open'));
    expect(onStartRemove).toHaveBeenCalledTimes(1);

    rerender(
      <FriendProfileActions
        confirming
        error="Could not remove friend"
        onStartRemove={onStartRemove}
        onCancelRemove={onCancelRemove}
        onConfirmRemove={onConfirmRemove}
      />
    );

    expect(screen.getByText('Remove friend?')).toBeTruthy();
    expect(screen.getByText('Could not remove friend')).toBeTruthy();

    fireEvent.press(screen.getByText('Cancel'));
    fireEvent.press(screen.getByTestId('remove-friend-confirm'));

    expect(onCancelRemove).toHaveBeenCalledTimes(1);
    expect(onConfirmRemove).toHaveBeenCalledTimes(1);
  });
});

describe('RelationshipBadge', () => {
  it('renders the label for a relationship state', () => {
    renderWithTheme(<RelationshipBadge relationship="pending_sent" />);

    expect(screen.getByText('Request Sent')).toBeTruthy();
  });
});
