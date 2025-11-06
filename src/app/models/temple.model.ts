/**
 * Temple Model
 * Defines complete temple configuration including deity, mantras, aarti times, and rituals
 */

import { Deity, DeityMantra } from './deity.model';

export interface TempleConfig {
  deity: Deity;
  mantras: DeityMantra[];
  aartiTimes: AartiTime[];
  offerings: TempleOffering[];
  blessings: TempleBlessings;
  ritualInstructions: RitualStep[];
}

export interface AartiTime {
  hour: number;
  minute: number;
  label: string;
  labelHindi: string;
  emoji: string;
}

export interface TempleOffering {
  name: string;
  nameHindi: string;
  icon: string;
  description?: string;
  descriptionHindi?: string;
}

export interface TempleBlessings {
  general: string[];
  generalHindi: string[];
  specific: {
    health: string[];
    healthHindi: string[];
    prosperity: string[];
    prosperityHindi: string[];
    education: string[];
    educationHindi: string[];
    family: string[];
    familyHindi: string[];
    career: string[];
    careerHindi: string[];
  };
}

export interface RitualStep {
  step: number;
  action: string;
  actionHindi: string;
  instruction: string;
  instructionHindi: string;
  duration?: number; // optional duration in seconds
}
