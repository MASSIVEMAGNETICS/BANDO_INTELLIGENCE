/**
 * Additional model-related types for the Bando AI Expert Debate Platform
 */

import { Expert, Message } from './types';

export interface ModelProvider {
  id: string;
  name: string;
  description: string;
  isLocal: boolean;
  capabilities: string[];
}

export interface ModelState {
  currentModel: string | null;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
  providers: ModelProvider[];
}

export interface ModelConfig {
  provider: string;
  modelPath?: string; // For local models
  apiKey?: string; // For online models
  options?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
  };
}