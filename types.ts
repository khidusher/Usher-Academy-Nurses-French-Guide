
export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  VOCABULARY = 'VOCABULARY',
  GRAMMAR = 'GRAMMAR',
  EXAM_PRACTICE = 'EXAM_PRACTICE',
  LEADERBOARD = 'LEADERBOARD',
  SUPPORT = 'SUPPORT',
  EDIT_PROFILE = 'EDIT_PROFILE',
  PROFILE = 'PROFILE'
}

export interface User {
  id: string;
  name: string;
  identifier: string;
  college?: string;
}

export interface ExamRecord {
  lessonId: string;
  score: number;
  total: number;
  date: string;
  timeSpent?: number;
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
  examRecords: ExamRecord[];
}

export interface Flashcard {
  id: string;
  french: string;
  english: string;
  category: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}