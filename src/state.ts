export interface GameState {
  originalText: string;
  blankedText: string;
  blankWords: string[];
  submissions: Record<string, { words: string[]; timestamp: number; score: number }[]>;
  blankIndices: number[];
  isActive: boolean;
  postId: string;
  subredditName: string;
  originalAuthor: string;
  startTime: number;
}

export const gameStore: Record<string, GameState> = {};

export function createGameState(
  subredditName: string,
  postId: string,
  originalText: string,
  blankedText: string,
  blankWords: string[],
  blankIndices: number[],
  originalAuthor: string
): GameState {
  return {
    originalText,
    blankedText,
    blankWords,
    submissions: {},
    blankIndices,
    isActive: true,
    postId,
    subredditName,
    originalAuthor,
    startTime: Date.now(),
  };
}