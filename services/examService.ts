import { ExamQuestion } from '../types';

/**
 * STATIC EXAM DATABASE - 160 Questions
 * Provided by Usher Academy.
 */
const IN_BUILT_EXAM_DATA: Record<string, any[]> = {
  "basics": [
    { question: "Que signifie “Bonjour” ?", options: ["Good night", "Goodbye", "Hello", "Sorry"], correctIndex: 2, explanation: "Standard professional greeting used during clinical rotations." },
    { question: "Comment dit-on “nurse” en français ?", options: ["Docteur", "Infirmier", "Patient", "Pharmacien"], correctIndex: 1, explanation: "Infirmier (male) / Infirmière (female) is your professional title." },
    { question: "“Je suis étudiant(e)” signifie :", options: ["I am a teacher", "I am a nurse", "I am a student", "I am sick"], correctIndex: 2, explanation: "Used to identify your status to patients and clinical instructors." },
    { question: "Quel mot est une salutation polie ?", options: ["Merci", "Bonjour", "Mal", "Douleur"], correctIndex: 1, explanation: "Bonjour is the essential professional opener for any interaction." },
    { question: "“Comment allez-vous ?” veut dire :", options: ["Where are you?", "How are you?", "What is your name?", "Are you sick?"], correctIndex: 1, explanation: "Formal inquiry into a patient's general well-being." },
    { question: "Quelle est la bonne réponse à “Comment allez-vous ?”", options: ["À demain", "Ça va", "Merci beaucoup", "Bonjour"], correctIndex: 1, explanation: "A common neutral response indicating stability." },
    { question: "“Merci” signifie :", options: ["Please", "Hello", "Thank you", "Goodbye"], correctIndex: 2, explanation: "Essential courtesy for patient rapport." },
    { question: "Quel mot est formel ?", options: ["Salut", "Tu", "Vous", "Ça"], correctIndex: 2, explanation: "Always use 'Vous' for patients and senior nursing staff." },
    { question: "“Je m’appelle Ama” signifie :", options: ["I am sick", "My name is Ama", "I am Ama’s nurse", "Ama is a nurse"], correctIndex: 1, explanation: "Used during self-introduction at the start of a shift." },
    { question: "Quel mot signifie “patient” ?", options: ["L’infirmier", "Le patient", "Le médecin", "L’hôpital"], correctIndex: 1, explanation: "Direct clinical term: Le patient (m) / La patiente (f)." }
  ],
  "identities": [
    { question: "“Je suis infirmière” signifie :", options: ["I am a patient", "I am a nurse", "I am a doctor", "I am a student"], correctIndex: 1, explanation: "Professional identity for female nurses." },
    { question: "Quel est le féminin de “infirmier” ?", options: ["Infirmière", "Infirmiers", "Patiente", "Docteure"], correctIndex: 0, explanation: "The feminine form ends in 'ière'." },
    { question: "“Il est médecin” veut dire :", options: ["She is a nurse", "He is a doctor", "He is a patient", "She is a doctor"], correctIndex: 1, explanation: "Referring to the physician." },
    { question: "Quel pronom est correct pour une patiente ?", options: ["Il", "Elle", "Nous", "Vous"], correctIndex: 1, explanation: "'Elle' is used for female subjects." },
    { question: "“Nous sommes étudiants” signifie :", options: ["We are patients", "We are teachers", "We are students", "We are nurses"], correctIndex: 2, explanation: "Group identification for students." },
    { question: "Quel mot désigne un hôpital ?", options: ["L’école", "La maison", "L’hôpital", "Le marché"], correctIndex: 2, explanation: "Your clinical workplace." },
    { question: "“Vous êtes malade ?” signifie :", options: ["Are you tired?", "Are you sick?", "Are you hungry?", "Are you ready?"], correctIndex: 1, explanation: "Initial clinical screening question." },
    { question: "Quel pronom est poli ?", options: ["Tu", "Il", "Elle", "Vous"], correctIndex: 3, explanation: "Professional distance and respect requires 'Vous'." },
    { question: "“Je travaille à l’hôpital” veut dire :", options: ["I live at the hospital", "I study at the hospital", "I work at the hospital", "I sleep at the hospital"], correctIndex: 2, explanation: "Description of your duty station." },
    { question: "Qui soigne les patients ?", options: ["Le patient", "L’infirmier", "L’étudiant", "Le visiteur"], correctIndex: 1, explanation: "The nurse is the primary caregiver." }
  ],
  "anatomy": [
    { question: "“La tête” signifie :", options: ["Leg", "Hand", "Head", "Chest"], correctIndex: 2, explanation: "Anatomical focus for neurological assessments." },
    { question: "Quel mot signifie “arm” ?", options: ["La jambe", "Le bras", "Le pied", "Le dos"], correctIndex: 1, explanation: "Used when taking BP or pulse." },
    { question: "Où est le cœur ?", options: ["La tête", "La poitrine", "La main", "Le pied"], correctIndex: 1, explanation: "Located in the chest (la poitrine)." },
    { question: "“Les yeux” sont :", options: ["Eyes", "Ears", "Nose", "Mouth"], correctIndex: 0, explanation: "Essential for pupillary reflex checks." },
    { question: "Quel mot signifie “leg” ?", options: ["Le bras", "Le pied", "La jambe", "Le dos"], correctIndex: 2, explanation: "Used when checking for edema or fractures." },
    { question: "“La bouche” est utilisée pour :", options: ["Voir", "Entendre", "Parler", "Marcher"], correctIndex: 2, explanation: "Relevant for oral medications." },
    { question: "Combien de bras a une personne ?", options: ["Un", "Deux", "Trois", "Quatre"], correctIndex: 1, explanation: "Normal human anatomy count." },
    { question: "“Le dos” signifie :", options: ["Back", "Chest", "Head", "Foot"], correctIndex: 0, explanation: "Relevant for spinal and posture checks." },
    { question: "Quel est un organe ?", options: ["Le cœur", "La main", "Le pied", "Le bras"], correctIndex: 0, explanation: "The heart is a major vital organ." },
    { question: "“Le pied” est utilisé pour :", options: ["Manger", "Écrire", "Marcher", "Voir"], correctIndex: 2, explanation: "Lower extremity function." }
  ],
  "symptoms": [
    { question: "“J’ai mal à la tête” signifie :", options: ["I am tired", "I have a headache", "I have fever", "I am hungry"], correctIndex: 1, explanation: "Common neurological symptom." },
    { question: "Quel mot signifie “pain” ?", options: ["Douleur", "Maladie", "Fatigue", "Fièvre"], correctIndex: 0, explanation: "Pain assessment is the 5th vital sign." },
    { question: "“Avez-vous de la fièvre ?” veut dire :", options: ["Do you have pain?", "Do you have fever?", "Are you coughing?", "Are you tired?"], correctIndex: 1, explanation: "Infection screening question." },
    { question: "Quel symptôme est correct ?", options: ["L’hôpital", "La douleur", "Le lit", "La chaise"], correctIndex: 1, explanation: "Pain is a subjective clinical symptom." },
    { question: "“Je suis fatigué(e)” signifie :", options: ["I am sick", "I am tired", "I am hungry", "I am angry"], correctIndex: 1, explanation: "Fatigue is a systemic symptom." },
    { question: "Quel mot signifie “cough” ?", options: ["Toux", "Fièvre", "Mal", "Douleur"], correctIndex: 0, explanation: "Respiratory clinical indicator." },
    { question: "“Où avez-vous mal ?” signifie :", options: ["Where do you live?", "Where do you hurt?", "What is your name?", "Are you sick?"], correctIndex: 1, explanation: "Pinpointing the locus of pain." },
    { question: "La fièvre est une :", options: ["Maladie", "Symptôme", "Médicament", "Profession"], correctIndex: 1, explanation: "Fever is a key clinical finding." },
    { question: "Quel mot est un symptôme ?", options: ["L’infirmier", "La fièvre", "L’hôpital", "Le médecin"], correctIndex: 1, explanation: "Only 'fièvre' is a clinical state." },
    { question: "Qui pose des questions sur les symptômes ?", options: ["Le patient", "L’infirmier", "Le visiteur", "L’étudiant"], correctIndex: 1, explanation: "Part of the nursing assessment process." }
  ],
  "etre_avoir": [
    { question: "Je ___ infirmier.", options: ["ai", "es", "suis", "as"], correctIndex: 2, explanation: "'Être' is used for profession/identity." },
    { question: "Nous ___ des patients aujourd’hui.", options: ["sommes", "avons", "êtes", "ont"], correctIndex: 1, explanation: "'Avoir' denotes clinical census/possession." },
    { question: "Elle ___ une fièvre.", options: ["est", "a", "ai", "sommes"], correctIndex: 1, explanation: "Symptoms/conditions take 'avoir'." },
    { question: "Vous ___ fatigué ?", options: ["avez", "êtes", "êtes avoir", "ont"], correctIndex: 1, explanation: "States of being take 'être'." },
    { question: "Ils ___ prêts pour l’examen.", options: ["ont", "sont", "avez", "sommes"], correctIndex: 1, explanation: "Readiness is a state (être)." },
    { question: "J’___ mal à la tête.", options: ["ai", "suis", "as", "est"], correctIndex: 0, explanation: "'Avoir mal' is a fixed idiom for pain." },
    { question: "Tu ___ étudiant en soins infirmiers.", options: ["as", "es", "ai", "sommes"], correctIndex: 1, explanation: "Identity takes 'être'." },
    { question: "Le patient ___ calme.", options: ["a", "est", "ont", "êtes"], correctIndex: 1, explanation: "Behavioral state takes 'être'." },
    { question: "Nous ___ un rendez-vous.", options: ["sommes", "avons", "êtes", "es"], correctIndex: 1, explanation: "Scheduling takes 'avoir'." },
    { question: "Elles ___ heureuses.", options: ["ont", "sont", "as", "êtes"], correctIndex: 1, explanation: "Emotional states take 'être'." }
  ],
  "er_verbs": [
    { question: "Je ___ le patient. (parler)", options: ["parles", "parle", "parlons", "parlent"], correctIndex: 1, explanation: "Present tense -er conjugation for 'je'." },
    { question: "Nous ___ les mains. (laver)", options: ["lavez", "lavons", "lavent", "laves"], correctIndex: 1, explanation: "Standard -ons ending for 'nous'." },
    { question: "Elle ___ le médicament. (donner)", options: ["donne", "donnes", "donnons", "donnent"], correctIndex: 0, explanation: "3rd person singular -e ending." },
    { question: "Vous ___ la température. (mesurer)", options: ["mesurez", "mesurons", "mesures", "mesurent"], correctIndex: 0, explanation: "Formal 'vous' takes the -ez ending." },
    { question: "Ils ___ le patient. (observer)", options: ["observes", "observons", "observent", "observe"], correctIndex: 2, explanation: "Plural subject takes -ent ending." },
    { question: "Tu ___ le dossier. (préparer)", options: ["prépare", "préparons", "préparez", "préparent"], correctIndex: 0, explanation: "Singular informal preparation." },
    { question: "Elles ___ les symptômes. (noter)", options: ["notes", "notons", "note", "notent"], correctIndex: 3, explanation: "Female plural nurses noting symptoms." },
    { question: "Je ___ une injection. (préparer)", options: ["prépare", "prépares", "préparons", "préparent"], correctIndex: 0, explanation: "First person preparation." },
    { question: "Nous ___ le patient. (aider)", options: ["aides", "aidons", "aident", "aide"], correctIndex: 1, explanation: "Collaborative care (we help)." },
    { question: "Vous ___ français. (parler)", options: ["parlons", "parlent", "parlez", "parles"], correctIndex: 2, explanation: "Formal clinical interaction." }
  ],
  "hygiene": [
    { question: "Lavez-vous les mains avant…", options: ["manger", "dormir", "soigner un patient", "marcher"], correctIndex: 2, explanation: "Critical infection prevention protocol." },
    { question: "Le savon sert à…", options: ["hydrater", "nettoyer", "nourrir", "parfumer"], correctIndex: 1, explanation: "Primary tool for hand sanitization." },
    { question: "Les gants sont utilisés pour…", options: ["écrire", "dormir", "éviter les infections", "courir"], correctIndex: 2, explanation: "Essential PPE for bodily fluid safety." },
    { question: "Quand faut-il se laver les mains ?", options: ["Jamais", "Avant et après les soins", "Seulement le matin", "Le soir"], correctIndex: 1, explanation: "WHO 5 moments of hand hygiene." },
    { question: "Le masque protège…", options: ["les chaussures", "le patient et l’infirmier", "la table", "le lit"], correctIndex: 1, explanation: "Respiratory protection protocol." },
    { question: "Une bonne hygiène réduit…", options: ["la douleur", "les infections", "la faim", "la fatigue"], correctIndex: 1, explanation: "Reduces hospital-acquired infections (HAI)." },
    { question: "Les ongles doivent être…", options: ["longs", "propres et courts", "sales", "colorés"], correctIndex: 1, explanation: "Prevents bacteria buildup under nails." },
    { question: "L’eau et le savon sont utilisés pour…", options: ["désinfecter les mains", "mesurer", "écrire", "chauffer"], correctIndex: 0, explanation: "Standard aseptic hand preparation." },
    { question: "Avant une injection, il faut…", options: ["dormir", "se laver les mains", "manger", "courir"], correctIndex: 1, explanation: "Basic aseptic technique requirement." },
    { question: "L’hygiène est importante en soins infirmiers parce que…", options: ["c’est la loi", "c’est facile", "elle protège les patients", "elle coûte cher"], correctIndex: 2, explanation: "Patient safety is the primary goal." }
  ],
  "observations": [
    { question: "Observer un patient signifie…", options: ["l’ignorer", "le regarder attentivement", "lui parler fort", "dormir"], correctIndex: 1, explanation: "Active clinical monitoring and assessment." },
    { question: "La température normale est environ…", options: ["30°C", "37°C", "40°C", "45°C"], correctIndex: 1, explanation: "Standard physiological baseline." },
    { question: "La tension artérielle est mesurée avec…", options: ["un thermomètre", "un stéthoscope", "un tensiomètre", "une balance"], correctIndex: 2, explanation: "Device for hemodynamic monitoring." },
    { question: "La respiration rapide est appelée…", options: ["bradycardie", "fièvre", "tachypnée", "douleur"], correctIndex: 2, explanation: "High respiratory rate terminology." },
    { question: "Observer la peau permet de détecter…", options: ["la faim", "des infections", "le sommeil", "la voix"], correctIndex: 1, explanation: "Detecting jaundice, rashes, or pressure ulcers." },
    { question: "La douleur peut être évaluée avec…", options: ["une échelle de douleur", "une balance", "une montre", "un thermomètre"], correctIndex: 0, explanation: "Using visual or numerical pain scales." },
    { question: "Les signes vitaux incluent…", options: ["taille", "poids", "température, pouls, respiration", "âge"], correctIndex: 2, explanation: "The four core vital clinical indicators." },
    { question: "Une observation doit être…", options: ["oubliée", "notée correctement", "racontée", "chantée"], correctIndex: 1, explanation: "Documentation is a legal clinical requirement." },
    { question: "Le pouls mesure…", options: ["la respiration", "le battement du cœur", "la fièvre", "la douleur"], correctIndex: 1, explanation: "Assessing heart rate and rhythm." },
    { question: "Les observations aident à…", options: ["jouer", "décider des soins", "dormir", "manger"], correctIndex: 1, explanation: "Informing the clinical care plan." }
  ],
  "past_tense": [
    { question: "J’___ le patient.", options: ["ai aidé", "aide", "aide", "aider"], correctIndex: 0, explanation: "Reporting a past action with 'avoir'." },
    { question: "Elle ___ la température.", options: ["mesure", "a mesuré", "mesurer", "mesurait"], correctIndex: 1, explanation: "Documentation of a completed check." },
    { question: "Nous ___ les mains.", options: ["lavons", "avons lavé", "laver", "lavions"], correctIndex: 1, explanation: "Hygiene action performed in the past." },
    { question: "Tu ___ le médicament ?", options: ["as donné", "donnes", "donner", "donnais"], correctIndex: 0, explanation: "Confirmation of medication administration." },
    { question: "Ils ___ le rapport.", options: ["écrivent", "ont écrit", "écrire", "écrivaient"], correctIndex: 1, explanation: "Documentation completed in the past." },
    { question: "Le patient ___ hier.", options: ["arrive", "est arrivé", "arriver", "arrivait"], correctIndex: 1, explanation: "Admission event reporting." },
    { question: "Vous ___ le dossier.", options: ["préparez", "avez préparé", "préparer", "prépariez"], correctIndex: 1, explanation: "Task completion reporting." },
    { question: "Elle ___ malade.", options: ["est", "a été", "être", "était"], correctIndex: 1, explanation: "Reporting a previous health state." },
    { question: "Nous ___ l’injection.", options: ["faisons", "avons fait", "faire", "faisions"], correctIndex: 1, explanation: "Procedure completed in the past." },
    { question: "J’___ fatigué.", options: ["suis", "ai été", "étais", "être"], correctIndex: 1, explanation: "Self-report of previous state." }
  ],
  "patient_history": [
    { question: "L’histoire médicale comprend…", options: ["le nom seulement", "les maladies passées", "l’adresse", "la profession"], correctIndex: 1, explanation: "Comprehensive medical background gathering." },
    { question: "Un antécédent est…", options: ["une maladie passée", "un repas", "une douleur actuelle", "un médicament"], correctIndex: 0, explanation: "Clinical term for previous medical issues." },
    { question: "Pourquoi demander l’histoire du patient ?", options: ["pour discuter", "pour choisir le bon soin", "pour écrire", "pour dormir"], correctIndex: 1, explanation: "Critical for safe and effective care planning." },
    { question: "Les allergies doivent être…", options: ["ignorées", "notées", "oubliées", "cachées"], correctIndex: 1, explanation: "Essential safety information for drug admin." },
    { question: "Les médicaments habituels sont…", options: ["sans importance", "importants pour le traitement", "interdits", "rares"], correctIndex: 1, explanation: "Avoiding drug interactions." },
    { question: "L’histoire familiale inclut…", options: ["les amis", "les parents et maladies héréditaires", "les voisins", "les collègues"], correctIndex: 1, explanation: "Identifying genetic predispositions." },
    { question: "Quand prendre l’histoire du patient ?", options: ["après le traitement", "avant le traitement", "jamais", "le soir"], correctIndex: 1, explanation: "Initial triage and intake phase." },
    { question: "Un patient diabétique a une histoire de…", options: ["fièvre", "diabète", "fracture", "toux"], correctIndex: 1, explanation: "Chronic metabolic history." },
    { question: "Les informations doivent être…", options: ["fausses", "exactes", "exagérées", "secrètes"], correctIndex: 1, explanation: "Medical accuracy is a professional standard." },
    { question: "L’histoire aide à prévenir…", options: ["les erreurs médicales", "la faim", "le sommeil", "le bruit"], correctIndex: 0, explanation: "History-taking is a major error-prevention tool." }
  ],
  "imperatives": [
    { question: "The correct imperative for “Please sit down” (formal) is:", options: ["Assieds-toi", "Asseyez-vous", "Vous asseyez", "Assis-vous"], correctIndex: 1, explanation: "Polite formal command for patients." },
    { question: "Choose the correct command for a patient (formal): ___ votre respiration.", options: ["Écouter", "Écoutez", "Écoutons", "Écouté"], correctIndex: 1, explanation: "Instructions for auscultation." },
    { question: "Which is the negative imperative ?", options: ["Prenez ce médicament", "Ne parlez pas", "Vous parlez", "Parlons"], correctIndex: 1, explanation: "Instructing silence for a procedure." },
    { question: "___ profondément, s’il vous plaît.", options: ["Respirer", "Respirez", "Respirez-vous", "Respirons"], correctIndex: 1, explanation: "Instructions for deep breathing." },
    { question: "Informal command to a colleague: “Wash your hands.”", options: ["Lavez-vous", "Lave-toi", "Laver toi", "Se laver"], correctIndex: 1, explanation: "Peer communication among nurses." },
    { question: "Which sentence is correct ?", options: ["N’oubliez le dossier", "N’oubliez pas le dossier", "N’oublier pas", "Pas oublier"], correctIndex: 1, explanation: "Standard negative syntax." },
    { question: "Formal negative command: “Do not move.”", options: ["Ne bougez pas", "Ne bouge pas", "Pas bougez", "Vous ne bougez"], correctIndex: 0, explanation: "Command for immobility during injection." },
    { question: "___ ce formulaire avant la consultation.", options: ["Compléter", "Complétez", "Complété", "Complétons"], correctIndex: 1, explanation: "Paperwork instruction." },
    { question: "Which verb drops -s in the imperative ?", options: ["Finir", "Prendre", "Parler", "Aller"], correctIndex: 3, explanation: "Irregular command rule for 'aller'." },
    { question: "Correct command to multiple patients:", options: ["Repose-toi", "Reposez-vous", "Reposons", "Reposer"], correctIndex: 1, explanation: "Pluralized instruction." }
  ],
  "emergency": [
    { question: "Urgence means:", options: ["Appointment", "Emergency", "Pain", "Medicine"], correctIndex: 1, explanation: "Critical clinical status." },
    { question: "Which phrase is best in an emergency ?", options: ["Attendez demain", "Appelez le médecin immédiatement", "Prenez un rendez-vous", "Écrivez le dossier"], correctIndex: 1, explanation: "Priority actions for trauma or arrest." },
    { question: "Le patient est inconscient. means:", options: ["The patient is tired", "The patient is unconscious", "The patient is angry", "The patient is asleep"], correctIndex: 1, explanation: "GCS assessment finding." },
    { question: "Il saigne beaucoup. means:", options: ["He is crying", "He is bleeding heavily", "He is coughing", "He is vomiting"], correctIndex: 1, explanation: "Hemorrhage identification." },
    { question: "What should a nurse say first ?", options: ["Mangez", "Restez calme", "Dormez", "Partez"], correctIndex: 1, explanation: "Stabilizing patient psychology." },
    { question: "Arrêt cardiaque refers to:", options: ["Headache", "Cardiac arrest", "Fever", "Dizziness"], correctIndex: 1, explanation: "Code Blue emergency situation." },
    { question: "Best instruction during emergency:", options: ["Courez partout", "Suivez les instructions", "Attendez dehors", "Parlez fort"], correctIndex: 1, explanation: "Maintaining operational order." },
    { question: "La douleur est sévère means:", options: ["Mild pain", "Severe pain", "No pain", "Temporary pain"], correctIndex: 1, explanation: "High pain score assessment." },
    { question: "In emergencies, time is:", options: ["Optional", "Very important", "Slow", "Flexible"], correctIndex: 1, explanation: "Golden hour principle." },
    { question: "Appelez une ambulance means:", options: ["Call a nurse", "Call an ambulance", "Call family", "Call security"], correctIndex: 1, explanation: "Emergency dispatch." }
  ],
  "consultations": [
    { question: "Motif de consultation means:", options: ["Doctor’s name", "Reason for visit", "Treatment", "Diagnosis"], correctIndex: 1, explanation: "The chief complaint." },
    { question: "Correct polite question:", options: ["Tu as mal ?", "Vous avez mal où ?", "Où mal ?", "Vous mal ?"], correctIndex: 1, explanation: "Professional inquiry into pain locus." },
    { question: "Depuis quand avez-vous ces symptômes ? means:", options: ["Are you sick?", "Since when have you had these symptoms?", "Do you take medicine?", "Where is the pain?"], correctIndex: 1, explanation: "Establishing duration and onset." },
    { question: "Which tense is commonly used in consultations ?", options: ["Future", "Present & Past", "Conditional only", "Subjunctive"], correctIndex: 1, explanation: "Reporting current and past health states." },
    { question: "Le patient se plaint de… means:", options: ["The patient complains of…", "The patient sleeps", "The patient recovers", "The patient leaves"], correctIndex: 0, explanation: "Clinical reporting of subjective symptoms." },
    { question: "Avez-vous déjà eu cette maladie ? asks about:", options: ["Current pain", "Medical history", "Medication", "Family"], correctIndex: 1, explanation: "History of recurrent issues." },
    { question: "Professional tone requires:", options: ["Informal language", "Slang", "Polite formal French", "Silence"], correctIndex: 2, explanation: "Bedside manner standard." },
    { question: "Quels médicaments prenez-vous actuellement ? asks about:", options: ["Past illness", "Current medication", "Surgery", "Allergy"], correctIndex: 1, explanation: "Drug reconciliation." },
    { question: "During consultation, the nurse should:", options: ["Interrupt often", "Listen carefully", "Rush", "Ignore details"], correctIndex: 1, explanation: "Active listening leads to better diagnosis." },
    { question: "Merci de votre coopération means:", options: ["Thank you for your cooperation", "Goodbye", "Sit down", "Be quiet"], correctIndex: 0, explanation: "Polite closure of interaction." }
  ],
  "ethics": [
    { question: "Confidentialité means:", options: ["Noise", "Privacy/confidentiality", "Consent", "Authority"], correctIndex: 1, explanation: "Protection of patient clinical data." },
    { question: "Patient information must be:", options: ["Shared freely", "Kept confidential", "Posted online", "Discussed publicly"], correctIndex: 1, explanation: "Ethical standard for PHI." },
    { question: "Consentement refers to:", options: ["Punishment", "Patient agreement", "Diagnosis", "Emergency"], correctIndex: 1, explanation: "Informed choice protocol." },
    { question: "When is consent required ?", options: ["Always, when possible", "Never", "Only for surgery", "Only for adults"], correctIndex: 0, explanation: "Universal ethical clinical requirement." },
    { question: "Ethical nursing care requires:", options: ["Respect", "Speed only", "Silence", "Distance"], correctIndex: 0, explanation: "Core pillar of professional nursing." },
    { question: "Respect de la dignité means:", options: ["Respecting patient dignity", "Giving orders", "Ignoring feelings", "Limiting care"], correctIndex: 0, explanation: "Holistic patient care principle." },
    { question: "Nurses must treat patients:", options: ["Differently", "Equally and fairly", "Based on age", "Based on status"], correctIndex: 1, explanation: "Equity in healthcare delivery." },
    { question: "Discussing patient cases outside work is:", options: ["Encouraged", "Unethical", "Required", "Normal"], correctIndex: 1, explanation: "Breach of clinical ethics." },
    { question: "Ethics help nurses to:", options: ["Make correct decisions", "Finish early", "Avoid work", "Ignore rules"], correctIndex: 0, explanation: "Guides clinical judgment." },
    { question: "Professional ethics build:", options: ["Fear", "Trust", "Conflict", "Distance"], correctIndex: 1, explanation: "Trust is the basis of nursing." }
  ],
  "written_exam": [
    { question: "Which sentence is grammatically correct ?", options: ["Le patient avoir mal", "Le patient a mal", "Le patient est mal", "Le patient mal"], correctIndex: 1, explanation: "Correct conjugation of 'avoir'." },
    { question: "Hier, j’ai ___ le patient.", options: ["aide", "aidé", "aider", "aidant"], correctIndex: 1, explanation: "Past participle agreement." },
    { question: "Correct formal instruction:", options: ["Ferme la bouche", "Fermez la bouche, s’il vous plaît", "Vous fermez", "Fermé"], correctIndex: 1, explanation: "Polite clinical command." },
    { question: "Best response to pain complaint:", options: ["Ignore", "Evaluate pain level", "Walk away", "Argue"], correctIndex: 1, explanation: "Priority nursing action." },
    { question: "Elle ___ une injection ce matin.", options: ["donne", "a donné", "donnait", "donnera"], correctIndex: 1, explanation: "Reporting a past procedure." },
    { question: "Which is medical vocabulary ?", options: ["Chaise", "Douleur", "Rue", "Livre"], correctIndex: 1, explanation: "Specific clinical term." },
    { question: "Avant l’examen, il faut…", options: ["réviser", "dormir seulement", "parler", "sortir"], correctIndex: 0, explanation: "Academic preparation." },
    { question: "Correct plural:", options: ["Hôpital", "Hôpitals", "Hôpitaux", "Hôpitalx"], correctIndex: 2, explanation: "Standard French pluralization." },
    { question: "A formal exam answer should be:", options: ["Short and unclear", "Clear and structured", "Informal", "Personal"], correctIndex: 1, explanation: "Academic standard." },
    { question: "Written exams test:", options: ["Memory only", "Understanding and language use", "Speed", "Guessing"], correctIndex: 1, explanation: "Holistic knowledge assessment." }
  ],
  "mock_exam": [
    { question: "Le patient ___ depuis deux jours.", options: ["tousse", "tousser", "a tousser", "toussé"], correctIndex: 0, explanation: "Present continuous symptom conjugation." },
    { question: "Best instruction:", options: ["Prenez ce médicament après manger", "Prenez ce médicament après le repas", "Prenez médicament", "Après prenez"], correctIndex: 1, explanation: "Clear administration advice." },
    { question: "Avez-vous des antécédents médicaux ? means:", options: ["Current pain", "Medical history", "Family name", "Allergies only"], correctIndex: 1, explanation: "History intake terminology." },
    { question: "Correct emergency phrase:", options: ["Ce n’est pas grave", "C’est une urgence", "Attendez", "Revenez demain"], correctIndex: 1, explanation: "High priority triage alert." },
    { question: "Nous ___ les signes vitaux.", options: ["prenons", "prendre", "avons prendre", "pris"], correctIndex: 0, explanation: "Collaborative vital sign monitoring." },
    { question: "Ethical response:", options: ["Share patient info", "Protect patient privacy", "Ignore consent", "Rush care"], correctIndex: 1, explanation: "Bioethical imperative." },
    { question: "Correct negative imperative:", options: ["Ne prenez pas", "Ne prenez pas ce médicament sans avis médical", "Pas prenez", "Ne prenez"], correctIndex: 1, explanation: "Patient safety instruction." },
    { question: "La consultation commence par…", options: ["Diagnostic", "Accueil du patient", "Prescription", "Facture"], correctIndex: 1, explanation: "Standard intake protocol." },
    { question: "Proper professional language is:", options: ["Informal", "Polite and respectful", "Casual", "Slang"], correctIndex: 1, explanation: "Standard for NMC clinical exams." },
    { question: "Mock exams are useful because they:", options: ["Replace exams", "Prepare students mentally and academically", "Waste time", "Reduce study"], correctIndex: 1, explanation: "Final readiness check." }
  ]
};

/**
 * Retreives 10 questions for a given lesson from local storage.
 */
export const generateExamQuestions = async (lessonId: string): Promise<ExamQuestion[]> => {
  // Simulate delay for consistent UI/UX feel
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const rawQuestions = IN_BUILT_EXAM_DATA[lessonId];
  if (!rawQuestions) {
    throw new Error(`Lesson ID '${lessonId}' not found in internal exam repository.`);
  }

  // Map to the required interface
  return rawQuestions.map((q, idx) => ({
    id: `${lessonId}_${idx}`,
    question: q.question,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation
  }));
};