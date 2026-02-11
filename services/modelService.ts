/**
 * Abstract interface for model services in the Bando AI Expert Debate Platform.
 * This interface defines the contract that all model providers (online, local, etc.) must implement.
 */

import { Expert, Message } from '../types';

export interface ModelInfo {
  id: string;
  name: string;
  version?: string;
  size?: number; // in bytes
  format?: string; // gguf, onnx, etc.
  capabilities?: string[];
  isOnline: boolean;
}

export interface GenerationResult {
  text: string;
  sources?: string[];
  tokensUsed?: number;
  processingTime?: number;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  repetitionPenalty?: number;
}

export interface ModelService {
  /**
   * Generates a response from the expert based on the given context
   */
  generateResponse(
    expert: Expert,
    topic: string,
    history: Message[],
    options?: GenerationOptions
  ): Promise<GenerationResult>;

  /**
   * Validates if the model is ready for use
   */
  validateModel(): Promise<boolean>;

  /**
   * Returns information about the current model
   */
  getModelInfo(): Promise<ModelInfo>;

  /**
   * Checks if the service is currently online/can make network requests
   */
  isOnline(): boolean;

  /**
   * Loads a model if applicable (for local models)
   */
  loadModel?(modelPath: string): Promise<void>;

  /**
   * Unloads a model if applicable (for local models)
   */
  unloadModel?(): Promise<void>;
}