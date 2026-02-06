
import { GoogleGenAI, Type } from "@google/genai";

export const getGeminiResponse = async (prompt: string, systemInstruction: string) => {
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

const GHANAIAN_CLINICAL_SCENARIOS = [
  "Outpatient triage at Ridge Hospital, Accra.",
  "Maternal health counseling in a rural CHPS compound.",
  "Post-operative monitoring after a surgery at Komfo Anokye Teaching Hospital.",
  "Emergency dehydration treatment (ORS/IV) for a pediatric patient.",
  "Communicating malaria prevention in a community health outreach.",
  "Nursing ethics and patient confidentiality in a busy ward.",
  "Managing patient records and vital signs reporting in French.",
  "Explaining drug dosages and side effects to a Francophone patient."
];

export const generateExamQuestions = async (lessonTopic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const randomScenario = GHANAIAN_CLINICAL_SCENARIOS[Math.floor(Math.random() * GHANAIAN_CLINICAL_SCENARIOS.length)];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate EXACTLY 10 multiple-choice questions (MCQs) for a Ghana Nursing Board French Exam Prep.
    Primary Theme: ${lessonTopic}
    Clinical Scenario Base: ${randomScenario}
    
    Requirements:
    1. COUNT: Exactly 10 questions.
    2. CONTENT: Focus on vocabulary, grammar (vous-form, present tense), and patient communication relative to the lesson.
    3. LANGUAGE: Questions in professional French. Options in French (include English translation in brackets).
    4. OPTIONS: Exactly 4 options (A, B, C, D) per question.
    5. FEEDBACK: Provide a short 'Clinical Pearl' explanation for the correct answer.
    6. TONE: Professional, clinical, and encouraging.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctIndex", "explanation"]
        }
      }
    }
  });
  
  const parsed = JSON.parse(response.text);
  return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
};
