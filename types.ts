export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  category?: string;
}

export interface PlayerState {
  id: 1 | 2;
  score: number; // Represents distance on track (e.g., 0 to 10)
  currentQuestion: Question | null;
  isAnswering: boolean; // Prevent double taps
  streak: number;
}

export enum GameStatus {
  MENU = 'MENU',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export type SoundType = 'correct' | 'wrong' | 'win' | 'click' | 'engine';
