/**
 * Service factory for the Bando AI Expert Debate Platform.
 * Creates and manages instances of model services based on configuration.
 */

import { ModelService } from './modelService';
import { OnlineModelService } from './geminiService';
import { LocalModelService } from './localModelService';
import { ModelConfig } from '../types/modelTypes';

export class ServiceFactory {
  private static onlineService: OnlineModelService | null = null;
  private static localServices: Map<string, LocalModelService> = new Map();

  /**
   * Creates a model service based on the provided configuration
   */
  static createModelService(config: ModelConfig): ModelService {
    if (config.provider === 'online') {
      // Return singleton instance of online service
      if (!this.onlineService) {
        this.onlineService = new OnlineModelService();
      }
      return this.onlineService;
    } else if (config.provider === 'local') {
      // Create or return cached local model service
      const modelPath = config.modelPath || '';
      
      if (!this.localServices.has(modelPath)) {
        const localService = new LocalModelService(modelPath);
        this.localServices.set(modelPath, localService);
      }
      
      return this.localServices.get(modelPath)!;
    } else {
      throw new Error(`Unsupported model provider: ${config.provider}`);
    }
  }

  /**
   * Gets the appropriate service based on whether we're online or have a local model configured
   */
  static getDefaultModelService(localModelPath?: string): ModelService {
    if (localModelPath) {
      return this.createModelService({
        provider: 'local',
        modelPath: localModelPath
      });
    } else {
      return this.createModelService({
        provider: 'online'
      });
    }
  }

  /**
   * Clears cached services (useful for testing or when switching models)
   */
  static clearCache(): void {
    this.onlineService = null;
    this.localServices.clear();
  }

  /**
   * Gets the current online service instance if it exists
   */
  static getOnlineService(): OnlineModelService | null {
    return this.onlineService;
  }

  /**
   * Gets a local service instance by model path if it exists
   */
  static getLocalService(modelPath: string): LocalModelService | null {
    return this.localServices.get(modelPath) || null;
  }
}