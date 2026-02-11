/**
 * Model discovery utility for the Bando AI Expert Debate Platform.
 * Discovers and validates local model files in specified directories.
 */

import { ModelInfo } from '../services/modelService';

export interface DiscoveredModel extends ModelInfo {
  path: string;
  size: number; // in bytes
  lastModified: Date;
}

const SUPPORTED_FORMATS = ['.gguf', '.onnx', '.bin', '.safetensors'];
const DEFAULT_MODEL_DIRECTORIES = [
  './models',
  './.models',
  '~/models',
  '~/Documents/models'
];

export class ModelDiscovery {
  private searchPaths: string[] = [];

  constructor(customPaths?: string[]) {
    this.searchPaths = customPaths || DEFAULT_MODEL_DIRECTORIES;
  }

  /**
   * Discover all compatible models in configured directories
   */
  async discoverModels(): Promise<DiscoveredModel[]> {
    const models: DiscoveredModel[] = [];
    
    // In a real implementation, this would scan the filesystem
    // Since we're in a browser environment, we'll simulate the discovery
    
    // Simulating discovered models
    const mockModels: DiscoveredModel[] = [
      {
        id: 'llama-3.2-3b-gguf',
        name: 'Llama 3.2 3B (GGUF)',
        path: './models/llama-3.2-3b.gguf',
        size: 1800000000, // ~1.8GB
        lastModified: new Date(),
        format: 'gguf',
        isOnline: false,
        capabilities: []
      },
      {
        id: 'mistral-7b-openorca-gguf',
        name: 'Mistral 7B OpenOrca (GGUF)',
        path: './models/mistral-7b-openorca.gguf',
        size: 4100000000, // ~4.1GB
        lastModified: new Date(Date.now() - 86400000), // 1 day ago
        format: 'gguf',
        isOnline: false,
        capabilities: []
      }
    ];
    
    // Filter models based on supported formats
    const validModels = mockModels.filter(model => 
      SUPPORTED_FORMATS.some(format => 
        model.path.toLowerCase().endsWith(format)
      )
    );
    
    return validModels;
  }

  /**
   * Validate if a model file is compatible with our system
   */
  async validateModel(path: string): Promise<boolean> {
    // In a real implementation, this would check:
    // 1. File exists and is readable
    // 2. File format is supported
    // 3. File is not corrupted
    // 4. System has enough resources to run the model
    
    const extension = path.split('.').pop()?.toLowerCase();
    if (!extension || !SUPPORTED_FORMATS.includes('.' + extension)) {
      return false;
    }
    
    // Additional validation could go here
    return true;
  }

  /**
   * Get detailed information about a model file
   */
  async getModelDetails(path: string): Promise<Omit<DiscoveredModel, 'id' | 'name'> | null> {
    // In a real implementation, this would extract metadata from the model file
    // For now, we'll simulate getting file stats
    
    if (!await this.validateModel(path)) {
      return null;
    }
    
    const fileName = path.split('/').pop() || path.split('\\').pop() || '';
    const name = fileName.replace(/\.[^/.]+$/, ""); // Remove extension
    
    // Simulated file stats
    return {
      path,
      size: Math.floor(Math.random() * 10000000000) + 100000000, // Random size between 100MB-10GB
      lastModified: new Date(),
      format: path.split('.').pop()?.toLowerCase() || '',
      isOnline: false,
      capabilities: []
    };
  }

  /**
   * Add a custom search path for model discovery
   */
  addSearchPath(path: string): void {
    if (!this.searchPaths.includes(path)) {
      this.searchPaths.push(path);
    }
  }

  /**
   * Get all configured search paths
   */
  getSearchPaths(): string[] {
    return [...this.searchPaths];
  }
}