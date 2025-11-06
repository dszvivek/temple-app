import { DeityType } from './deity.model';

/**
 * Wish Model
 * Represents a devotee's wish/prayer in the temple
 */
export interface Wish {
  id: string;
  deityId: DeityType; // Which deity this wish is dedicated to
  title: string;
  description: string;
  category: WishCategory;
  status: WishStatus;
  createdAt: Date;
  activatedAt?: Date;
  fulfilledAt?: Date;
  donationAmount?: number;
  offeringType?: string;
}

export enum WishCategory {
  HEALTH = 'health',
  PROSPERITY = 'prosperity',
  EDUCATION = 'education',
  FAMILY = 'family',
  CAREER = 'career',
  GENERAL = 'general'
}

export enum WishStatus {
  CREATED = 'created',
  ACTIVATED = 'activated',
  FULFILLED = 'fulfilled'
}
