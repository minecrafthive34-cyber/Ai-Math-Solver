import { Chat } from '@google/genai';

export enum SolutionStatus {
  SOLVED = 'solved',
  UNSOLVED = 'unsolved',
}

export interface SolutionResponse {
  status: SolutionStatus;
  title: string;
  classification: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Advanced';
  difficultyRating: number;
  difficultyJustification: string;
  keyConcepts: string[];
  reasoning: string;
  solution?: string[];
  explanation?: string;
  alternativeMethods?: string;
  commonPitfalls?: string;
}

export enum ChatRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export type AppChatSession = Chat;

export type SolveInput = string | { 
  image: { 
    mimeType: string; 
    data: string;
  },
  prompt: string;
};

export interface HistoryItem {
  id: string;
  problem: SolveInput;
  solution: SolutionResponse;
  timestamp: string;
}

export type Font = 'inter' | 'lora' | 'inconsolata';

export interface FontOption {
  id: Font;
  name: string;
}

export interface ExampleProblem {
  id: string;
  problem: string;
}