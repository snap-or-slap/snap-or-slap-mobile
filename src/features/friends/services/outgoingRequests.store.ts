import { ApiError } from '@services/api';
import { storage } from '@services/storage/storage.service';
import { profileService } from '@features/profile/services';

import type { OutgoingFriendRequest } from '../types';

const STORAGE_PREFIX = 'sos.outgoingFriendRequests';

function storageKey(currentUserId: string): string {
  return `${STORAGE_PREFIX}:${currentUserId}`;
}

function parseItems(value: string | null): OutgoingFriendRequest[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is OutgoingFriendRequest => {
      if (!item || typeof item !== 'object') return false;
      const request = item as Partial<OutgoingFriendRequest>;
      return typeof request.receiverId === 'string' && request.status === 'pending';
    });
  } catch {
    return [];
  }
}

export async function listOutgoingRequests(
  currentUserId: string,
): Promise<OutgoingFriendRequest[]> {
  return parseItems(await storage.getItem(storageKey(currentUserId)));
}

export async function replaceOutgoingRequests(
  currentUserId: string,
  items: OutgoingFriendRequest[],
): Promise<void> {
  await storage.setItem(storageKey(currentUserId), JSON.stringify(items));
}

export async function addOutgoingRequest(
  currentUserId: string,
  item: OutgoingFriendRequest,
): Promise<void> {
  const existing = await listOutgoingRequests(currentUserId);
  const nextItem: OutgoingFriendRequest = {
    ...item,
    status: 'pending',
    createdAt: item.createdAt ?? new Date().toISOString(),
  };
  const next = [
    nextItem,
    ...existing.filter((request) => request.receiverId !== item.receiverId),
  ];
  await replaceOutgoingRequests(currentUserId, next);
}

export async function removeOutgoingRequest(
  currentUserId: string,
  receiverId: string,
): Promise<void> {
  const existing = await listOutgoingRequests(currentUserId);
  await replaceOutgoingRequests(
    currentUserId,
    existing.filter((request) => request.receiverId !== receiverId),
  );
}

export async function clearOutgoingRequests(currentUserId: string): Promise<void> {
  await storage.removeItem(storageKey(currentUserId));
}

type RelationshipProfileResponse = {
  relationship?: string;
  user?: {
    username?: string | null;
    displayName?: string | null;
    avatarUrl?: string | null;
  };
};

function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

export async function reconcileOutgoingRequests(
  currentUserId: string,
): Promise<OutgoingFriendRequest[]> {
  const existing = await listOutgoingRequests(currentUserId);
  const reconciled: OutgoingFriendRequest[] = [];

  for (const item of existing) {
    try {
      const profile = await profileService.getUserProfile<RelationshipProfileResponse>(
        item.receiverId,
      );

      if (profile.relationship === 'pending_sent') {
        reconciled.push({
          ...item,
          username: profile.user?.username ?? item.username,
          displayName: profile.user?.displayName ?? item.displayName,
          avatarUrl: profile.user?.avatarUrl ?? item.avatarUrl,
        });
      }
    } catch (error) {
      if (!isNotFoundError(error)) {
        reconciled.push(item);
      }
    }
  }

  await replaceOutgoingRequests(currentUserId, reconciled);
  return reconciled;
}
