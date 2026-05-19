export * from './challenges.service';
export * from './checkin.service';

import { challengesService } from './challenges.service';
import { checkinService } from './checkin.service';

export const challengeService = {
  ...challengesService,
  ...checkinService,
};
