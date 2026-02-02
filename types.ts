
export type TrainingGoal = 'Lihaskasvu' | 'Ylläpito' | 'Painonpudotus' | 'Kehonmuokkaus';
export type ExperienceLevel = 'Aloittelija' | 'Keskitaso' | 'Kokenut' | 'Todella kokenut';
export type UserStatus = 'Aktiivinen' | 'Tauolta palannut' | 'Uusi tulokas';
export type WorkoutType = 'Normaali' | 'Rento' | 'Ykköset' | 'Aktiviteetti';
export type CreatinePhase = 'Tankkaus' | 'Ylläpito';
export type CreatineSpeed = 5 | 10 | 20;
export type Gender = 'Mies' | 'Nainen';
export type CoachType = 'aino' | 'arnold';

export interface CreatineConfig {
  enabled: boolean;
  phase: CreatinePhase;
  speed: CreatineSpeed;
  dailyIntake: number;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  goal: TrainingGoal;
  weeklyTarget: number;
  onboarded: boolean;
  experience: ExperienceLevel;
  status: UserStatus;
  gymDuration?: string;
  breakDuration?: string;
  preBreakDuration?: string;
  creatine: CreatineConfig;
  waterIntake: number;
  waterTrackingEnabled: boolean;
  coachName: string;
  coachType: CoachType;
  benchPR: number;
  squatPR: number;
  deadliftPR: number;
  tutorialStep: number;
}

export interface SetRecord {
  reps: number;
  weight: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: SetRecord[];
  isPRAttempt?: boolean;
}

export interface WorkoutSession {
  id: string;
  date: string;
  type: WorkoutType;
  exercises: Exercise[];
  finished: boolean;
  aiAnalysis?: string;
  rating?: 'green' | 'yellow' | 'red';
  isSkipped?: boolean;
  skipReason?: string;
  isTest?: boolean;
  activityNotes?: string;
  activityDuration?: number;
  activityDistance?: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export interface AppState {
  profile: UserProfile;
  sessions: WorkoutSession[];
  chats: ChatSession[];
  activeChatId: string;
  dailyWater: number;
  dailyCreatine: number;
  lastResetDate: string;
}
