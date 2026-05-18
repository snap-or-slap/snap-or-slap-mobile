import type { ChallengeStatus, ChallengeStatusTone } from '../types/challenge.types';

/**
 * Maps the canonical ChallengeStatus (API/domain) to the ChallengeStatusTone (UI).
 */
export function statusToTone(status: ChallengeStatus): ChallengeStatusTone {
  switch (status) {
    case 'ACTIVE':
      return 'active';
    case 'FORMATION':
      return 'formation';
    case 'INVITED':
      return 'invited';
    case 'FINISHED':
      return 'success';
    case 'GAME_OVER':
      return 'game-over';
    case 'CANCELLED':
      return 'cancelled';
    default:
      return 'formation';
  }
}

/**
 * Maps ChallengeStatus to a human-readable label.
 */
export function statusLabel(status: ChallengeStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'Active';
    case 'FORMATION':
      return 'Formation';
    case 'INVITED':
      return 'Invited';
    case 'FINISHED':
      return 'Finished';
    case 'GAME_OVER':
      return 'Game Over';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}

/**
 * Returns whether this status belongs to the "active" segment.
 */
export function isActiveSegment(status: ChallengeStatus): boolean {
  return status === 'ACTIVE';
}

/**
 * Returns whether this status belongs to the "formation" segment.
 */
export function isFormationSegment(status: ChallengeStatus): boolean {
  return status === 'FORMATION' || status === 'INVITED';
}

/**
 * Returns whether this status belongs to the "history" segment.
 */
export function isHistorySegment(status: ChallengeStatus): boolean {
  return (
    status === 'FINISHED' || status === 'GAME_OVER' || status === 'CANCELLED'
  );
}
