
import { TrainingGoal } from './types';

export const GOALS: TrainingGoal[] = [
  'Lihaskasvu',
  'Ylläpito',
  'Painonpudotus',
  'Kehonmuokkaus'
];

export const GOAL_DESCRIPTIONS: Record<TrainingGoal, string> = {
  'Lihaskasvu': 'Maksimoi lihasmassan kasvu ja voima.',
  'Ylläpito': 'Säilytä nykyinen kunto ja terveys.',
  'Painonpudotus': 'Pudota rasvaprosenttia säilyttäen lihasmassaa.',
  'Kehonmuokkaus': 'Paino pysyy samana, rasva vähenee, lihas kasvaa.'
};

export const COLORS = {
  primary: 'blue-600',
  secondary: 'blue-50',
  accent: 'blue-400',
  success: 'emerald-500',
  warning: 'amber-500',
  error: 'rose-500',
};
