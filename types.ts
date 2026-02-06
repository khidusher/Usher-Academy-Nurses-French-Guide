
export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  VOCABULARY = 'VOCABULARY',
  GRAMMAR = 'GRAMMAR',
  EXAM_PRACTICE = 'EXAM_PRACTICE',
  LEADERBOARD = 'LEADERBOARD',
  SUPPORT = 'SUPPORT',
  EDIT_PROFILE = 'EDIT_PROFILE',
  PROFILE = 'PROFILE',
  ORAL_SIMULATOR = 'ORAL_SIMULATOR'
}

export interface User {
  id: string;
  name: string;
  identifier: string; // Can be email or phone number
  college?: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  completedLessons: string[];
  badges: string[];
  isSupporter: boolean;
  supportReference?: string;
  lastLessonId?: string;
}

export interface Flashcard {
  id: string;
  french: string;
  english: string;
  category: string;
  audioUrl?: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
