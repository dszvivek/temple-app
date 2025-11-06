/**
 * Deity Model
 * Defines deity types and configurations for the multi-temple system
 */

export enum DeityType {
  HANUMAN = 'hanuman',
  GANESH = 'ganesh'
}

export interface Deity {
  id: DeityType;
  name: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
  icon: string; // emoji or image path
  color: string; // primary theme color (Tailwind class)
  gradients: DeityGradients;
}

export interface DeityGradients {
  sunrise: string;
  day: string;
  sunset: string;
  night: string;
}

export interface DeityMantra {
  deityId: DeityType;
  name: string;
  nameHindi: string;
  audioFile: string;
  duration: number; // seconds
  schedule: MantraSchedule;
}

export interface MantraSchedule {
  frequency: 'hourly' | 'daily' | 'custom';
  times?: { hour: number; minute: number }[];
  startHour?: number;
  endHour?: number;
}
