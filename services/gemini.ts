
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

/**
 * Curated Ghanaian Nursing Curriculum Scenarios.
 * These are "in-built" to the prompt to ensure high quality while 
 * Gemini handles the generation of unique distractors and clinical explanations.
 */
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

export const generateExamQuestions = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // We select a random scenario from our "in-built" list to ground the generation
  const randomScenario = GHANAIAN_CLINICAL_SCENARIOS[Math.floor(Math.random() * GHANAIAN_CLINICAL_SCENARIOS.length)];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 professional MCQs for the Ghana Nursing Board Exam Prep.
    Primary Topic: ${topic}
    Clinical Scenario Base: ${randomScenario}
    
    Requirements:
    1. Language: Questions in French, but options can be English/French hybrid (realistic for Ghana exams).
    2. Difficulty: Level 3 Clinical Competency.
    3. Authenticity: Use Ghanaian medical context (MOH protocols, local terminology).
    4. Explanations: Must provide a 'Clinical Pearl' for the correct answer.`,
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
  return JSON.parse(response.text);
};
