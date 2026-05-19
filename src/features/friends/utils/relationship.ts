import type { RelationshipType } from '../types';

/** Returns human-readable label for a relationship type */
export function getRelationshipLabel(relationship: RelationshipType): string {
  switch (relationship) {
    case 'friend':
      return 'Friend';
    case 'none':
    case 'non_friend':
      return 'Not Friend';
    case 'squadmate':
      return 'Squadmate';
    case 'pending_sent':
    case 'pending_outgoing':
      return 'Request Sent';
    case 'pending_received':
    case 'pending_incoming':
      return 'Wants to connect';
    case 'self':
      return 'You';
    default:
      return 'Unknown';
  }
}

/**
 * Returns the Badge variant mapped to a relationship type.
 * Uses the design-system Badge variants only.
 */
export function getRelationshipBadgeVariant(
  relationship: RelationshipType,
): 'success' | 'info' | 'warning' | 'neutral' | 'brand' | 'danger' {
  switch (relationship) {
    case 'friend':
      return 'success';
    case 'none':
    case 'non_friend':
      return 'neutral';
    case 'squadmate':
      return 'info';
    case 'pending_sent':
    case 'pending_outgoing':
      return 'warning';
    case 'pending_received':
    case 'pending_incoming':
      return 'brand';
    case 'self':
      return 'neutral';
    default:
      return 'neutral';
  }
}

/** Returns true if the user can view full friend profile */
export function canViewFullProfile(relationship: RelationshipType): boolean {
  return relationship === 'friend' || relationship === 'self';
}

/** Returns true if the user can view challenge-scoped info */
export function canViewChallengeScope(relationship: RelationshipType): boolean {
  return (
    relationship === 'friend' ||
    relationship === 'self' ||
    relationship === 'squadmate'
  );
}

/** Returns the add-friend button label based on relationship */
export function getAddFriendLabel(relationship: RelationshipType): string {
  switch (relationship) {
    case 'friend':
      return 'Friends';
    case 'pending_sent':
    case 'pending_outgoing':
      return 'Request Sent';
    case 'pending_received':
    case 'pending_incoming':
      return 'Accept';
    case 'none':
    case 'non_friend':
    case 'squadmate':
      return 'Add Friend';
    case 'self':
      return 'You';
    default:
      return 'Add friend';
  }
}

/** Returns whether the add-friend button should be disabled */
export function isAddFriendDisabled(relationship: RelationshipType): boolean {
  return (
    relationship === 'friend' ||
    relationship === 'pending_sent' ||
    relationship === 'pending_outgoing' ||
    relationship === 'self'
  );
}
