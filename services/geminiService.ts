
import { GoogleGenAI } from "@google/genai";
import { PersonaType, Message, Expert } from "../types";
import { ModelService, GenerationResult, GenerationOptions, ModelInfo } from "./modelService";

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class OnlineModelService implements ModelService {
  private readonly modelName: string = 'gemini-3-flash-preview';
  
  async generateResponse(
    expert: Expert,
    topic: string,
    history: Message[],
    options?: GenerationOptions
  ): Promise<GenerationResult> {
    
    const historyString = history.map(m => {
      const sender = m.expertId === 'director' ? 'DEBATE DIRECTOR (HUMAN)' : m.expertId;
      return `${sender}: ${m.content}`;
    }).join('\n');
    
    const prompt = `
      IDENTITY:
      You are ${expert.name}, acting as the ${expert.role}.
      Your Domain of Expertise: ${expert.domain}
      Your Communication Style: ${expert.style}
      Your Core Principle: ${expert.principle}
      
      CONTEXT:
      The debate topic is "${topic}".
      
      DEBATE HISTORY:
      ${historyString}
      
      INSTRUCTIONS:
      1. Respond to the debate from your specific perspective.
      2. If the "DEBATE DIRECTOR" has provided an intervention or asked a question, you MUST address it first.
      3. Maintain your persona's unique style and principles strictly.
      4. Stay concise (max 2-3 paragraphs).
      5. Use the "googleSearch" tool for factual grounding.
    `;

    try {
      // Generate content using the recommended model and search tools.
      const response = await ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: options?.temperature ?? 0.9,
        },
      });

      // Directly access the text property as per the SDK guidelines.
      const text = response.text || "I am currently processing the Director's request.";
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web?.uri)
        .filter(Boolean);

      return { 
        text, 
        sources,
        tokensUsed: undefined, // Not available in this API
        processingTime: undefined // Would need to measure manually
      };
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }

  async validateModel(): Promise<boolean> {
    try {
      // Simple validation - check if API key is configured
      if (!process.env.API_KEY) {
        return false;
      }
      // Could add more sophisticated validation here
      return true;
    } catch (error) {
      console.error("Model validation error:", error);
      return false;
    }
  }

  async getModelInfo(): Promise<ModelInfo> {
    return {
      id: this.modelName,
      name: this.modelName,
      isOnline: true,
      capabilities: ['search', 'grounding']
    };
  }

  isOnline(): boolean {
    return !!process.env.API_KEY;
  }
}

// Export the original function for backward compatibility
// TODO: Remove this export once all references are updated to use the class
export const getExpertResponse = async (
  expert: Expert,
  topic: string,
  history: Message[]
): Promise<{ text: string; sources?: string[] }> => {
  const service = new OnlineModelService();
  try {
    const result = await service.generateResponse(expert, topic, history);
    return { text: result.text, sources: result.sources };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Connection to the logic core interrupted." };
  }
};
