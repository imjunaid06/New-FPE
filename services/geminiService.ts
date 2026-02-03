
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { AIAnalysisResponse, TicketPriority } from "../types";

// Fix: Use correct initialization as per Gemini API guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeIncident = async (title: string, description: string): Promise<AIAnalysisResponse> => {
  try {
    // Fix: Using correct GenerateContentResponse return type
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this support ticket incident:
      Title: ${title}
      Description: ${description}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: {
              type: Type.STRING,
              description: "Must be LOW, MEDIUM, HIGH, or URGENT",
            },
            category: {
              type: Type.STRING,
              description: "e.g., Technical, Billing, Security, Feature Request, Bug",
            },
            summary: {
              type: Type.STRING,
              description: "A short 1-sentence summary of the issue.",
            },
            sentiment: {
              type: Type.STRING,
              description: "Customer sentiment: Positive, Neutral, Negative, or Frustrated",
            },
          },
          required: ["priority", "category", "summary", "sentiment"],
        },
      },
    });

    // Fix: Accessing .text as a property, not a method
    const result = JSON.parse(response.text.trim());
    return result as AIAnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      priority: TicketPriority.MEDIUM,
      category: "Uncategorized",
      summary: "Analysis failed, please review manually.",
      sentiment: "Unknown",
    };
  }
};

export const troubleshootChat = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  try {
    // Fix: Add Chat type annotation and correctly pass history
    const chat: Chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: history.map(h => ({ role: h.role as 'user' | 'model', parts: h.parts })),
      config: {
        systemInstruction: "You are an expert enterprise IT support specialist. Your goal is to help users troubleshoot technical issues effectively. Be professional, technical but accessible, and prioritize safety. If an issue seems critical or unresolved after a few steps, suggest creating an official support ticket.",
      }
    });

    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Troubleshoot Chat Error:", error);
    throw error;
  }
};
