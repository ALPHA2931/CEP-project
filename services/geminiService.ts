import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini client
// Note: In a real production app, you might proxy this through your own backend to secure the key.
// For this demo, we assume the environment variable is available.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateAnnouncementContent = async (topic: string, tone: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock response.");
    return `[Mock AI Response] Here is a draft announcement about "${topic}". Please configure your API_KEY to see real AI magic!`;
  }

  try {
    const prompt = `Write a professional internal company announcement about: "${topic}". The tone should be ${tone}. Keep it concise (under 100 words). Format with clear line breaks.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please try again.";
  }
};