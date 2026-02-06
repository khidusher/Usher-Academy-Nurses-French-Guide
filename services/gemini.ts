
import { GoogleGenAI, Type } from "@google/genai";

/**
 * INTERNAL DATA REPOSITORY
 * These questions are 'in-built' and processed by Gemini to provide 
 * clinical explanations and secure delivery.
 */
const IN_BUILT_EXAM_DATA: Record<string, any[]> = {
  "basics": [
    { q: "Que signifie « Bonjour » ?", a: ["Good night", "Goodbye", "Hello", "Sorry"], c: 2 },
    { q: "Comment dit-on « nurse » en français ?", a: ["Docteur", "Infirmier", "Patient", "Pharmacien"], c: 1 },
    { q: "« Je suis étudiant(e) » signifie :", a: ["I am a teacher", "I am a nurse", "I am a student", "I am sick"], c: 2 },
    { q: "Quel mot est une salutation polie ?", a: ["Merci", "Bonjour", "Mal", "Douleur"], c: 1 },
    { q: "« Comment allez-vous ? » veut dire :", a: ["Where are you?", "How are you?", "What is your name?", "Are you sick?"], c: 1 },
    { q: "Quelle est la bonne réponse à « Comment allez-vous ? »", a: ["À demain", "Ça va", "Merci beaucoup", "Bonjour"], c: 1 },
    { q: "« Merci » signifie :", a: ["Please", "Hello", "Thank you", "Goodbye"], c: 2 },
    { q: "Quel mot est formel ?", a: ["Salut", "Tu", "Vous", "Ça"], c: 2 },
    { q: "« Je m’appelle Ama » signifie :", a: ["I am sick", "My name is Ama", "I am Ama’s nurse", "Ama is a nurse"], c: 1 },
    { q: "Quel mot signifie « patient » ?", a: ["L’infirmier", "Le patient", "Le médecin", "L’hôpital"], c: 1 }
  ],
  "identities": [
    { q: "« Je suis infirmière » signifie :", a: ["I am a patient", "I am a nurse", "I am a doctor", "I am a student"], c: 1 },
    { q: "Quel est le féminin de « infirmier » ?", a: ["Infirmière", "Infirmiers", "Patiente", "Docteure"], c: 0 },
    { q: "« Il est médecin » veut dire :", a: ["She is a nurse", "He is a doctor", "He is a patient", "She is a doctor"], c: 1 },
    { q: "Quel pronom est correct pour une patiente ?", a: ["Il", "Elle", "Nous", "Vous"], c: 1 },
    { q: "« Nous sommes étudiants » signifie :", a: ["We are patients", "We are teachers", "We are students", "We are nurses"], c: 2 },
    { q: "Quel mot désigne un hôpital ?", a: ["L’école", "La maison", "L’hôpital", "Le marché"], c: 2 },
    { q: "« Vous êtes malade ? » signifie :", a: ["Are you tired?", "Are you sick?", "Are you hungry?", "Are you ready?"], c: 1 },
    { q: "Quel pronom est poli ?", a: ["Tu", "Il", "Elle", "Vous"], c: 3 },
    { q: "« Je travaille à l’hôpital » veut dire :", a: ["I live at the hospital", "I study at the hospital", "I work at the hospital", "I sleep at the hospital"], c: 2 },
    { q: "Qui soigne les patients ?", a: ["Le patient", "L’infirmier", "L’étudiant", "Le visiteur"], c: 1 }
  ],
  "anatomy": [
    { q: "« La tête » signifie :", a: ["Leg", "Hand", "Head", "Chest"], c: 2 },
    { q: "Quel mot signifie « arm » ?", a: ["La jambe", "Le bras", "Le pied", "Le dos"], c: 1 },
    { q: "Où est le cœur ?", a: ["La tête", "La poitrine", "La main", "Le pied"], c: 1 },
    { q: "« Les yeux » sont :", a: ["Eyes", "Ears", "Nose", "Mouth"], c: 0 },
    { q: "Quel mot signifie « leg » ?", a: ["Le bras", "Le pied", "La jambe", "Le dos"], c: 2 },
    { q: "« La bouche » est utilisée pour :", a: ["Voir", "Entendre", "Parler", "Marcher"], c: 2 },
    { q: "Combien de bras a une personne ?", a: ["Un", "Deux", "Trois", "Quatre"], c: 1 },
    { q: "« Le dos » signifie :", a: ["Back", "Chest", "Head", "Foot"], c: 0 },
    { q: "Quel est un organe ?", a: ["Le cœur", "La main", "Le pied", "Le bras"], c: 0 },
    { q: "« Le pied » est utilisé pour :", a: ["Manger", "Écrire", "Marcher", "Voir"], c: 2 }
  ],
  "symptoms": [
    { q: "« J’ai mal à la tête » signifie :", a: ["I am tired", "I have a headache", "I have fever", "I am hungry"], c: 1 },
    { q: "Quel mot signifie « pain » ?", a: ["Douleur", "Maladie", "Fatigue", "Fièvre"], c: 0 },
    { q: "« Avez-vous de la fièvre ? » veut dire :", a: ["Do you have pain?", "Do you have fever?", "Are you coughing?", "Are you tired?"], c: 1 },
    { q: "Quel symptôme est correct ?", a: ["L’hôpital", "La douleur", "Le lit", "La chaise"], c: 1 },
    { q: "« Je suis fatigué(e) » signifie :", a: ["I am sick", "I am tired", "I am hungry", "I am angry"], c: 1 },
    { q: "Quel mot signifie « cough » ?", a: ["Toux", "Fièvre", "Mal", "Douleur"], c: 0 },
    { q: "« Où avez-vous mal ? » signifie :", a: ["Where do you live?", "Where do you hurt?", "What is your name?", "Are you sick?"], c: 1 },
    { q: "La fièvre est une :", a: ["Maladie", "Symptôme", "Médicament", "Profession"], c: 1 },
    { q: "Quel mot est un symptôme ?", a: ["L’infirmier", "La fièvre", "L’hôpital", "Le médecin"], c: 1 },
    { q: "Qui pose des questions sur les symptômes ?", a: ["Le patient", "L’infirmier", "Le visiteur", "L’étudiant"], c: 1 }
  ],
  "etre_avoir": [
    { q: "Je ___ infirmier.", a: ["ai", "es", "suis", "as"], c: 2 },
    { q: "Nous ___ des patients aujourd’hui.", a: ["sommes", "avons", "êtes", "ont"], c: 1 },
    { q: "Elle ___ une fièvre.", a: ["est", "a", "ai", "sommes"], c: 1 },
    { q: "Vous ___ fatigué ?", a: ["avez", "êtes", "êtes avoir", "ont"], c: 1 },
    { q: "Ils ___ prêts pour l’examen.", a: ["ont", "sont", "avez", "sommes"], c: 1 },
    { q: "J’___ mal à la tête.", a: ["ai", "suis", "as", "est"], c: 0 },
    { q: "Tu ___ étudiant en soins infirmiers.", a: ["as", "es", "ai", "sommes"], c: 1 },
    { q: "Le patient ___ calme.", a: ["a", "est", "ont", "êtes"], c: 1 },
    { q: "Nous ___ un rendez-vous.", a: ["sommes", "avons", "êtes", "es"], c: 1 },
    { q: "Elles ___ heureuses.", a: ["ont", "sont", "as", "êtes"], c: 1 }
  ],
  "er_verbs": [
    { q: "Je ___ le patient. (parler)", a: ["parles", "parle", "parlons", "parlent"], c: 1 },
    { q: "Nous ___ les mains. (laver)", a: ["lavez", "lavons", "lavent", "laves"], c: 1 },
    { q: "Elle ___ le médicament. (donner)", a: ["donne", "donnes", "donnons", "donnent"], c: 0 },
    { q: "Vous ___ la température. (mesurer)", a: ["mesurez", "mesurons", "mesures", "mesurent"], c: 0 },
    { q: "Ils ___ le patient. (observer)", a: ["observes", "observons", "observent", "observe"], c: 2 },
    { q: "Tu ___ le dossier. (préparer)", a: ["prépare", "préparons", "préparez", "préparent"], c: 0 },
    { q: "Elles ___ les symptômes. (noter)", a: ["notes", "notons", "note", "notent"], c: 3 },
    { q: "Je ___ une injection. (préparer)", a: ["prépare", "prépares", "préparons", "préparent"], c: 0 },
    { q: "Nous ___ le patient. (aider)", a: ["aides", "aidons", "aident", "aide"], c: 1 },
    { q: "Vous ___ français. (parler)", a: ["parlons", "parlent", "parlez", "parles"], c: 2 }
  ],
  "hygiene": [
    { q: "Lavez-vous les mains avant…", a: ["manger", "dormir", "soigner un patient", "marcher"], c: 2 },
    { q: "Le savon sert à…", a: ["hydrater", "nettoyer", "nourrir", "parfumer"], c: 1 },
    { q: "Les gants sont utilisés pour…", a: ["écrire", "dormir", "éviter les infections", "courir"], c: 2 },
    { q: "Quand faut-il se laver les mains ?", a: ["Jamais", "Avant et après les soins", "Seulement le matin", "Le soir"], c: 1 },
    { q: "Le masque protège…", a: ["les chaussures", "le patient et l’infirmier", "la table", "le lit"], c: 1 },
    { q: "Une bonne hygiène réduit…", a: ["la douleur", "les infections", "la faim", "la fatigue"], c: 1 },
    { q: "Les ongles doivent être…", a: ["longs", "propres et courts", "sales", "colorés"], c: 1 },
    { q: "L’eau et le savon sont utilisés pour…", a: ["désinfecter les mains", "mesurer", "écrire", "chauffer"], c: 0 },
    { q: "Avant une injection, il faut…", a: ["dormir", "se laver les mains", "manger", "courir"], c: 1 },
    { q: "L’hygiène est importante en soins infirmiers parce que…", a: ["c’est la loi", "c’est facile", "elle protège les patients", "elle coûte cher"], c: 2 }
  ],
  "observations": [
    { q: "Observer un patient signifie…", a: ["l’ignorer", "le regarder attentivement", "lui parler fort", "dormir"], c: 1 },
    { q: "La température normale est environ…", a: ["30°C", "37°C", "40°C", "45°C"], c: 1 },
    { q: "La tension artérielle est mesurée avec…", a: ["un thermomètre", "un stéthoscope", "un tensiomètre", "une balance"], c: 2 },
    { q: "La respiration rapide est appelée…", a: ["bradycardie", "fièvre", "tachypnée", "douleur"], c: 2 },
    { q: "Observer la peau permet de détecter…", a: ["la faim", "des infections", "le sommeil", "la voix"], c: 1 },
    { q: "La douleur peut être évaluée avec…", a: ["une échelle de douleur", "une balance", "une montre", "un thermomètre"], c: 0 },
    { q: "Les signes vitaux incluent…", a: ["taille", "poids", "température, pouls, respiration", "âge"], c: 2 },
    { q: "Une observation doit être…", a: ["oubliée", "notée correctement", "racontée", "chantée"], c: 1 },
    { q: "Le pouls mesure…", a: ["la respiration", "le battement du cœur", "la fièvre", "la douleur"], c: 1 },
    { q: "Les observations aident à…", a: ["jouer", "décider des soins", "dormir", "manger"], c: 1 }
  ],
  "past_tense": [
    { q: "J’___ le patient.", a: ["ai aidé", "aide", "aide", "aider"], c: 0 },
    { q: "Elle ___ la température.", a: ["mesure", "a mesuré", "mesurer", "mesurait"], c: 1 },
    { q: "Nous ___ les mains.", a: ["lavons", "avons lavé", "laver", "lavions"], c: 1 },
    { q: "Tu ___ le médicament ?", a: ["as donné", "donnes", "donner", "donnais"], c: 0 },
    { q: "Ils ___ le rapport.", a: ["écrivent", "ont écrit", "écrire", "écrivaient"], c: 1 },
    { q: "Le patient ___ hier.", a: ["arrive", "est arrivé", "arriver", "arrivait"], c: 1 },
    { q: "Vous ___ le dossier.", a: ["préparez", "avez préparé", "préparer", "prépariez"], c: 1 },
    { q: "Elle ___ malade.", a: ["est", "a été", "être", "était"], c: 1 },
    { q: "Nous ___ l’injection.", a: ["faisons", "avons fait", "faire", "faisions"], c: 1 },
    { q: "J’___ fatigué.", a: ["suis", "ai été", "étais", "être"], c: 1 }
  ],
  "patient_history": [
    { q: "L’histoire médicale comprend…", a: ["le nom seulement", "les maladies passées", "l’adresse", "la profession"], c: 1 },
    { q: "Un antécédent est…", a: ["une maladie passée", "un repas", "une douleur actuelle", "un médicament"], c: 0 },
    { q: "Pourquoi demander l’histoire du patient ?", a: ["pour discuter", "pour choisir le bon soin", "pour écrire", "pour dormir"], c: 1 },
    { q: "Les allergies doivent être…", a: ["ignorées", "notées", "oubliées", "cachées"], c: 1 },
    { q: "Les médicaments habituels sont…", a: ["sans importance", "importants pour le traitement", "interdits", "rares"], c: 1 },
    { q: "L’histoire familiale inclut…", a: ["les amis", "les parents et maladies héréditaires", "les voisins", "les collègues"], c: 1 },
    { q: "Quand prendre l’histoire du patient ?", a: ["après le traitement", "avant le traitement", "jamais", "le soir"], c: 1 },
    { q: "Un patient diabétique a une histoire de…", a: ["fièvre", "diabète", "fracture", "toux"], c: 1 },
    { q: "Les informations doivent être…", a: ["fausses", "exactes", "exagérées", "secrètes"], c: 1 },
    { q: "L’histoire aide à prévenir…", a: ["les erreurs médicales", "la faim", "le sommeil", "le bruit"], c: 0 }
  ],
  "imperatives": [
    { q: "The correct imperative for « Please sit down » (formal) is:", a: ["Assieds-toi", "Asseyez-vous", "Vous asseyez", "Assis-vous"], c: 1 },
    { q: "Choose the correct command for a patient (formal): ___ votre respiration.", a: ["Écouter", "Écoutez", "Écoutons", "Écouté"], c: 1 },
    { q: "Which is the negative imperative ?", a: ["Prenez ce médicament", "Ne parlez pas", "Vous parlez", "Parlons"], c: 1 },
    { q: "___ profondément, s’il vous plaît.", a: ["Respirer", "Respirez", "Respirez-vous", "Respirons"], c: 1 },
    { q: "Informal command to a colleague: « Wash your hands. »", a: ["Lavez-vous", "Lave-toi", "Laver toi", "Se laver"], c: 1 },
    { q: "Which sentence is correct ?", a: ["N’oubliez le dossier", "N’oubliez pas le dossier", "N’oublier pas", "Pas oublier"], c: 1 },
    { q: "Formal negative command: « Do not move. »", a: ["Ne bougez pas", "Ne bouge pas", "Pas bougez", "Vous ne bougez"], c: 0 },
    { q: "___ ce formulaire avant la consultation.", a: ["Compléter", "Complétez", "Complété", "Complétons"], c: 1 },
    { q: "Which verb drops -s in the imperative ?", a: ["Finir", "Prendre", "Parler", "Aller"], c: 3 },
    { q: "Correct command to multiple patients:", a: ["Repose-toi", "Reposez-vous", "Reposons", "Reposer"], c: 1 }
  ],
  "emergency": [
    { q: "Urgence means:", a: ["Appointment", "Emergency", "Pain", "Medicine"], c: 1 },
    { q: "Which phrase is best in an emergency ?", a: ["Attendez demain", "Appelez le médecin immédiatement", "Prenez un rendez-vous", "Écrivez le dossier"], c: 1 },
    { q: "Le patient est inconscient. means:", a: ["The patient is tired", "The patient is unconscious", "The patient is angry", "The patient is asleep"], c: 1 },
    { q: "Il saigne beaucoup. means:", a: ["He is crying", "He is bleeding heavily", "He is coughing", "He is vomiting"], c: 1 },
    { q: "What should a nurse say first ?", a: ["Mangez", "Restez calme", "Dormez", "Partez"], c: 1 },
    { q: "Arrêt cardiaque refers to:", a: ["Headache", "Cardiac arrest", "Fever", "Dizziness"], c: 1 },
    { q: "Best instruction during emergency:", a: ["Courez partout", "Suivez les instructions", "Attendez dehors", "Parlez fort"], c: 1 },
    { q: "La douleur est sévère means:", a: ["Mild pain", "Severe pain", "No pain", "Temporary pain"], c: 1 },
    { q: "In emergencies, time is:", a: ["Optional", "Very important", "Slow", "Flexible"], c: 1 },
    { q: "Appelez une ambulance means:", a: ["Call a nurse", "Call an ambulance", "Call family", "Call security"], c: 1 }
  ],
  "consultations": [
    { q: "Motif de consultation means:", a: ["Doctor’s name", "Reason for visit", "Treatment", "Diagnosis"], c: 1 },
    { q: "Correct polite question:", a: ["Tu as mal ?", "Vous avez mal où ?", "Où mal ?", "Vous mal ?"], c: 1 },
    { q: "Depuis quand avez-vous ces symptômes ? means:", a: ["Are you sick?", "Since when have you had these symptoms?", "Do you take medicine?", "Where is the pain?"], c: 1 },
    { q: "Which tense is commonly used in consultations ?", a: ["Future", "Present & Past", "Conditional only", "Subjunctive"], c: 1 },
    { q: "Le patient se plaint de… means:", a: ["The patient complains of…", "The patient sleeps", "The patient recovers", "The patient leaves"], c: 0 },
    { q: "Avez-vous déjà eu cette maladie ? asks about:", a: ["Current pain", "Medical history", "Medication", "Family"], c: 1 },
    { q: "Professional tone requires:", a: ["Informal language", "Slang", "Polite formal French", "Silence"], c: 2 },
    { q: "Quels médicaments prenez-vous actuellement ? asks about:", a: ["Past illness", "Current medication", "Surgery", "Allergy"], c: 1 },
    { q: "During consultation, the nurse should:", a: ["Interrupt often", "Listen carefully", "Rush", "Ignore details"], c: 1 },
    { q: "Merci de votre coopération means:", a: ["Thank you for your cooperation", "Goodbye", "Sit down", "Be quiet"], c: 0 }
  ],
  "ethics": [
    { q: "Confidentialité means:", a: ["Noise", "Privacy/confidentiality", "Consent", "Authority"], c: 1 },
    { q: "Patient information must be:", a: ["Shared freely", "Kept confidential", "Posted online", "Discussed publicly"], c: 1 },
    { q: "Consentement refers to:", a: ["Punishment", "Patient agreement", "Diagnosis", "Emergency"], c: 1 },
    { q: "When is consent required ?", a: ["Always, when possible", "Never", "Only for surgery", "Only for adults"], c: 0 },
    { q: "Ethical nursing care requires:", a: ["Respect", "Speed only", "Silence", "Distance"], c: 0 },
    { q: "Respect de la dignité means:", a: ["Respecting patient dignity", "Giving orders", "Ignoring feelings", "Limiting care"], c: 0 },
    { q: "Nurses must treat patients:", a: ["Differently", "Equally and fairly", "Based on age", "Based on status"], c: 1 },
    { q: "Discussing patient cases outside work is:", a: ["Encouraged", "Unethical", "Required", "Normal"], c: 1 },
    { q: "Ethics help nurses to:", a: ["Make correct decisions", "Finish early", "Avoid work", "Ignore rules"], c: 0 },
    { q: "Professional ethics build:", a: ["Fear", "Trust", "Conflict", "Distance"], c: 1 }
  ],
  "written_exam": [
    { q: "Which sentence is grammatically correct ?", a: ["Le patient avoir mal", "Le patient a mal", "Le patient est mal", "Le patient mal"], c: 1 },
    { q: "Hier, j’ai ___ le patient.", a: ["aide", "aidé", "aider", "aidant"], c: 1 },
    { q: "Correct formal instruction:", a: ["Ferme la bouche", "Fermez la bouche, s’il vous plaît", "Vous fermez", "Fermé"], c: 1 },
    { q: "Best response to pain complaint:", a: ["Ignore", "Evaluate pain level", "Walk away", "Argue"], c: 1 },
    { q: "Elle ___ une injection ce matin.", a: ["donne", "a donné", "donnait", "donnera"], c: 1 },
    { q: "Which is medical vocabulary ?", a: ["Chaise", "Douleur", "Rue", "Livre"], c: 1 },
    { q: "Avant l’examen, il faut…", a: ["réviser", "dormir seulement", "parler", "sortir"], c: 0 },
    { q: "Correct plural:", a: ["Hôpital", "Hôpitals", "Hôpitaux", "Hôpitalx"], c: 2 },
    { q: "A formal exam answer should be:", a: ["Short and unclear", "Clear and structured", "Informal", "Personal"], c: 1 },
    { q: "Written exams test:", a: ["Memory only", "Understanding and language use", "Speed", "Guessing"], c: 1 }
  ],
  "mock_exam": [
    { q: "Le patient ___ depuis deux jours.", a: ["tousse", "tousser", "a tousser", "toussé"], c: 0 },
    { q: "Best instruction:", a: ["Prenez ce médicament après manger", "Prenez ce médicament après le repas", "Prenez médicament", "Après prenez"], c: 1 },
    { q: "Avez-vous des antécédents médicaux ? means:", a: ["Current pain", "Medical history", "Family name", "Allergies only"], c: 1 },
    { q: "Correct emergency phrase:", a: ["Ce n’est pas grave", "C’est une urgence", "Attendez", "Revenez demain"], c: 1 },
    { q: "Nous ___ les signes vitaux.", a: ["prenons", "prendre", "avons prendre", "pris"], c: 0 },
    { q: "Ethical response:", a: ["Share patient info", "Protect patient privacy", "Ignore consent", "Rush care"], c: 1 },
    { q: "Correct negative imperative:", a: ["Ne prenez pas", "Ne prenez pas ce médicament sans avis médical", "Pas prenez", "Ne prenez"], c: 1 },
    { q: "La consultation commence par…", a: ["Diagnostic", "Accueil du patient", "Prescription", "Facture"], c: 1 },
    { q: "Proper professional language is:", a: ["Informal", "Polite and respectful", "Casual", "Slang"], c: 1 },
    { q: "Mock exams are useful because they:", a: ["Replace exams", "Prepare students mentally and academically", "Waste time", "Reduce study"], c: 1 }
  ]
};

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
 * Generates 10 exam questions for a given lesson.
 * Relies on the in-built data repository while using Gemini to
 * dynamically generate clinical explanations (Clinical Pearls).
 */
export const generateExamQuestions = async (lessonId: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Extract lesson ID from the roadmap title if needed, 
  // but the app now passes lessonId directly.
  const questionsData = IN_BUILT_EXAM_DATA[lessonId] || IN_BUILT_EXAM_DATA["basics"];

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Format these 10 in-built clinical questions for a Ghanaian Nursing Student.
    Lesson ID: ${lessonId}
    Data: ${JSON.stringify(questionsData)}
    
    Task: 
    1. Output the provided questions exactly.
    2. For EACH question, generate a professional 'Clinical Pearl' explanation (max 120 chars) in English explaining why the correct answer is clinical standard in Ghana.
    3. Return strictly in the required JSON array format.`,
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
  // Ensure we mapped correctly and return
  return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
};
