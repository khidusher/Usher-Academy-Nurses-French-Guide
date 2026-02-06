
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Guideline: Always use process.env.API_KEY directly in the constructor.
// Removed local API_KEY constant to comply with best practices.

export const getGeminiResponse = async (prompt: string, systemInstruction: string) => {
  // Use process.env.API_KEY directly in the client constructor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });
  return response.text;
};

export const generateExamQuestions = async (topic: string) => {
  // Use process.env.API_KEY directly in the client constructor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 multiple choice questions for a Ghanaian nursing student learning French. Topic: ${topic}. Format the output as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctIndex", "explanation"]
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const getSpeech = async (text: string) => {
  // Use process.env.API_KEY directly in the client constructor
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Pronounce clearly in French: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  // Extracting audio bytes from candidates parts
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
