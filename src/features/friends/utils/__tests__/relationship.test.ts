import {
  canViewChallengeScope,
  canViewFullProfile,
  getAddFriendLabel,
  getRelationshipBadgeVariant,
  getRelationshipLabel,
  isAddFriendDisabled,
} from '../relationship';

describe('relationship utils', () => {
  it.each([
    ['friend', 'Friend', 'success', 'Friends', true],
    ['none', 'Not Friend', 'neutral', 'Add Friend', false],
    ['non_friend', 'Not Friend', 'neutral', 'Add Friend', false],
    ['squadmate', 'Squadmate', 'info', 'Add Friend', false],
    ['pending_sent', 'Request Sent', 'warning', 'Request Sent', true],
    ['pending_outgoing', 'Request Sent', 'warning', 'Request Sent', true],
    ['pending_received', 'Wants to connect', 'brand', 'Accept', false],
    ['pending_incoming', 'Wants to connect', 'brand', 'Accept', false],
    ['self', 'You', 'neutral', 'You', true],
  ] as const)(
    'maps %s to display metadata',
    (relationship, label, variant, addFriendLabel, disabled) => {
      expect(getRelationshipLabel(relationship)).toBe(label);
      expect(getRelationshipBadgeVariant(relationship)).toBe(variant);
      expect(getAddFriendLabel(relationship)).toBe(addFriendLabel);
      expect(isAddFriendDisabled(relationship)).toBe(disabled);
    },
  );

  it('falls back for unknown relationship values', () => {
    const relationship = 'blocked' as never;

    expect(getRelationshipLabel(relationship)).toBe('Unknown');
    expect(getRelationshipBadgeVariant(relationship)).toBe('neutral');
    expect(getAddFriendLabel(relationship)).toBe('Add friend');
    expect(isAddFriendDisabled(relationship)).toBe(false);
  });

  it('controls profile visibility by relationship type', () => {
    expect(canViewFullProfile('friend')).toBe(true);
    expect(canViewFullProfile('self')).toBe(true);
    expect(canViewFullProfile('squadmate')).toBe(false);

    expect(canViewChallengeScope('friend')).toBe(true);
    expect(canViewChallengeScope('self')).toBe(true);
    expect(canViewChallengeScope('squadmate')).toBe(true);
    expect(canViewChallengeScope('none')).toBe(false);
  });
});
