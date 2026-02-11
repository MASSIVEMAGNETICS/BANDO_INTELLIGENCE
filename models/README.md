# Models Directory

This directory is used for storing local AI models that can be used with the Bando AI Expert Debate Platform in offline mode.

## Supported Model Formats

- GGUF (preferred for local inference)
- ONNX
- Safetensors
- Other formats as implemented

## Adding Models

To add a local model:

1. Download a compatible model file
2. Place it in this directory
3. Restart the application to scan for new models

## Model Sources

You can find compatible open-source models at:

- [Hugging Face](https://huggingface.co/)
- [TheBloke's collection](https://huggingface.co/TheBloke)
- [MLC LLM Zoo](https://llm.mlc.ai/zoo)

## Important Notes

- Large models require significant RAM (8GB+ recommended)
- Model loading times vary based on size and hardware
- Some models may require specific hardware features (like AVX2 support)