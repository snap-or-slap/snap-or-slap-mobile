import React from 'react';
import { View } from 'react-native';
import { Badge } from '@ds/components';
import type { RelationshipType } from '../types';
import {
  getRelationshipLabel,
  getRelationshipBadgeVariant,
} from '../utils';

type RelationshipBadgeProps = {
  relationship: RelationshipType;
  testID?: string;
};

export function RelationshipBadge({ relationship, testID }: RelationshipBadgeProps) {
  const label = getRelationshipLabel(relationship);
  const variant = getRelationshipBadgeVariant(relationship);

  return (
    <Badge variant={variant} size="sm" testID={testID} style={{alignSelf: "center"}}>
      {label}
    </Badge>
  );
}
