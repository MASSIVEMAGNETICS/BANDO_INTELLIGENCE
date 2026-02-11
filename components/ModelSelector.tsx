import React, { useState, useEffect } from 'react';
import { ModelDiscovery, DiscoveredModel } from '../utils/modelDiscovery';
import { ServiceFactory } from '../services/serviceFactory';
import { ModelConfig } from '../types/modelTypes';

interface ModelSelectorProps {
  onModelChange: (config: ModelConfig) => void;
  currentConfig: ModelConfig;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelChange, currentConfig }) => {
  const [availableModels, setAvailableModels] = useState<DiscoveredModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(currentConfig.modelPath || '');
  const [provider, setProvider] = useState<'online' | 'local'>(currentConfig.provider as 'online' | 'local');

  useEffect(() => {
    const discoverModels = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const discovery = new ModelDiscovery();
        const models = await discovery.discoverModels();
        setAvailableModels(models);
        
        // Set selected model if it was previously selected
        if (currentConfig.modelPath) {
          setSelectedModel(currentConfig.modelPath);
        }
      } catch (err) {
        setError('Failed to discover local models');
        console.error('Model discovery error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    discoverModels();
  }, []);

  const handleProviderChange = (newProvider: 'online' | 'local') => {
    setProvider(newProvider);
    
    if (newProvider === 'online') {
      onModelChange({ provider: 'online' });
    } else if (selectedModel) {
      onModelChange({ 
        provider: 'local', 
        modelPath: selectedModel 
      });
    }
  };

  const handleModelSelect = (modelPath: string) => {
    setSelectedModel(modelPath);
    onModelChange({ 
      provider: 'local', 
      modelPath 
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border-white/10">
      <h3 className="text-lg font-bold mb-4">Model Selection</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Provider</label>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                provider === 'online'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              onClick={() => handleProviderChange('online')}
            >
              Online (Gemini)
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-colors ${
                provider === 'local'
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              onClick={() => handleProviderChange('local')}
            >
              Local Model
            </button>
          </div>
        </div>

        {provider === 'local' && (
          <div>
            <label className="block text-sm font-medium mb-2">Select Local Model</label>
            
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-10 bg-slate-800 rounded-lg"></div>
                <div className="h-10 bg-slate-800 rounded-lg"></div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-sm">{error}</div>
            ) : availableModels.length > 0 ? (
              <div className="space-y-2">
                {availableModels.map((model) => (
                  <div
                    key={model.path}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedModel === model.path
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => handleModelSelect(model.path)}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {model.format?.toUpperCase()} •{' '}
                      {(model.size / (1024 ** 3)).toFixed(1)} GB
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-sm">
                No local models found. Place model files in the models directory.
              </div>
            )}
          </div>
        )}

        {provider === 'online' && (
          <div className="text-sm text-slate-400">
            Using online Gemini API. Ensure your API key is configured.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelSelector;