
import React from 'react';
import { AppView } from './types';

export const LEVELS = [
  { id: 1, name: "Nursing French Beginner", minXP: 0, icon: "👶🏽" },
  { id: 2, name: "Clinical Basics", minXP: 500, icon: "🩺" },
  { id: 3, name: "Patient Communication", minXP: 1500, icon: "💬" },
  { id: 4, name: "Exam Ready", minXP: 3000, icon: "📝" },
  { id: 5, name: "Confident Nursing Speaker", minXP: 5000, icon: "🏆" }
];

export const NAVIGATION_ITEMS = [
  { view: AppView.DASHBOARD, label: "Home", icon: "🏠" },
  { view: AppView.VOCABULARY, label: "Vocab", icon: "📚" },
  { view: AppView.EXAM_PRACTICE, label: "Exams", icon: "📑" },
  { view: AppView.SUPPORT, label: "Donate", icon: "❤️" },
  { view: AppView.PROFILE, label: "Profile", icon: "👤" }
];

export const VOCABULARY_DATA = [
  { id: 'v1', french: "L'infirmière", english: "The Nurse", category: "Hospital" },
  { id: 'v2', french: "Le patient", english: "The Patient", category: "Hospital" },
  { id: 'v3', french: "La tension artérielle", english: "Blood Pressure", category: "Vitals" },
  { id: 'v4', french: "Où avez-vous mal?", english: "Where does it hurt?", category: "Symptoms" },
  { id: 'v5', french: "La jambe", english: "The leg", category: "Body Parts" },
  { id: 'v6', french: "Le bras", english: "The arm", category: "Body Parts" },
  { id: 'v7', french: "Prenez ce médicament", english: "Take this medicine", category: "Instructions" },
  { id: 'v8', french: "Une injection", english: "An injection", category: "Procedures" },
];

export const EXAMS_SCHEMA = {
  weeks: [
    {
      week: 1,
      title: "Week 1: Foundations",
      lessons: [
        { id: "basics", title: "Basics", icon: "👋" },
        { id: "identities", title: "Identities", icon: "🆔" }
      ]
    },
    {
      week: 2,
      title: "Week 2: Clinical Assessment",
      lessons: [
        { id: "anatomy", title: "Anatomy", icon: "🦴" },
        { id: "symptoms", title: "Symptom Qs", icon: "🤒" }
      ]
    },
    {
      week: 3,
      title: "Week 3: Hospital Grammar",
      lessons: [
        { id: "etre_avoir", title: "Être / Avoir", icon: "⚛️" },
        { id: "er_verbs", title: "ER Verbs", icon: "📋" }
      ]
    },
    {
      week: 4,
      title: "Week 4: Procedures",
      lessons: [
        { id: "hygiene", title: "Hygiene", icon: "🧼" },
        { id: "observations", title: "Observations", icon: "📊" }
      ]
    },
    {
      week: 5,
      title: "Week 5: Medical History",
      lessons: [
        { id: "past_tense", title: "Past Tense", icon: "🕰️" },
        { id: "patient_history", title: "Patient History", icon: "📂" }
      ]
    },
    {
      week: 6,
      title: "Week 6: Safety & Emergency",
      lessons: [
        { id: "imperatives", title: "Imperatives", icon: "📢" },
        { id: "emergency", title: "Emergency", icon: "🚨" }
      ]
    },
    {
      week: 7,
      title: "Week 7: Professional Practice",
      lessons: [
        { id: "consultations", title: "Consultations", icon: "🗣️" },
        { id: "ethics", title: "Ethics", icon: "⚖️" }
      ]
    },
    {
      week: 8,
      title: "Week 8: Mastery",
      lessons: [
        { id: "written_exam", title: "Written Exam", icon: "✍️" },
        { id: "mock_exam", title: "Mock Exam", icon: "🎓" }
      ]
    }
  ]
};

// Legacy support for dashboard roadmap
export const WEEKLY_ROADMAP = EXAMS_SCHEMA.weeks.map(w => ({
  week: w.week,
  title: w.title,
  lessons: w.lessons.map(l => l.title)
}));

export const MOMO_DETAILS = {
  number: "+233537274710",
  name: "Arnold Odjidja",
  network: "MTN Ghana",
  amount: "₵50"
};
