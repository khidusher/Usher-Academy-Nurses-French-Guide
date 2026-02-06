
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
  "Maternal health triage in a rural clinic in the Volta Region.",
  "Malaria rapid diagnostic testing (RDT) procedures and patient counseling in Twi/French.",
  "Post-operative care for a patient following a caesarean section at Korle-Bu.",
  "Emergency response to a road traffic accident victim presenting with shock.",
  "Diabetes management education for an elderly patient in an outpatient department.",
  "Pediatric immunization schedule communication and vaccine storage protocols.",
  "Hypertension screening and lifestyle advice for a patient in a community health setting.",
  "Infection prevention and control (IPC) protocols during an infectious disease outbreak.",
];

export const generateExamQuestions = async (lessonTopic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const randomScenario = GHANAIAN_CLINICAL_SCENARIOS[Math.floor(Math.random() * GHANAIAN_CLINICAL_SCENARIOS.length)];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate EXACTLY 10 professional clinical MCQs for the Ghana Nursing Board Exam Prep.
    Lesson Topic: ${lessonTopic}
    Clinical Scenario Base: ${randomScenario}
    
    Requirements:
    1. EXACTLY 10 questions.
    2. Language: Questions in professional French. Options in French (with English translations in brackets where necessary).
    3. Clinical Context: Scenarios MUST reflect Ghanaian nursing standards (MOH/NMC guidelines).
    4. Structure: Each question must have 4 options (A, B, C, D) and ONE correct answer.
    5. Explanations: Provide a 'Clinical Pearl' explanation (max 150 chars).`,
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
  // Safety check to ensure exactly 10 or at least high volume
  return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
};
