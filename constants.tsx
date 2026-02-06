
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

export const WEEKLY_ROADMAP = [
  { week: 1, title: "Foundations & Greetings", lessons: ["Basics", "Identities"] },
  { week: 2, title: "Body & Pain Assessment", lessons: ["Anatomy", "Symptom Qs"] },
  { week: 3, title: "Hospital Verbs", lessons: ["Être/Avoir", "ER Verbs"] },
  { week: 4, title: "Daily Procedures", lessons: ["Hygiene", "Observations"] },
  { week: 5, title: "Medical History", lessons: ["Past Tense", "Patient History"] },
  { week: 6, title: "Patient Safety", lessons: ["Imperatives", "Emergency"] },
  { week: 7, title: "Role Play Mastery", lessons: ["Consultations", "Ethics"] },
  { week: 8, title: "Mock Exams", lessons: ["Written Exam", "Mock"] },
];

export const MOMO_DETAILS = {
  number: "+233537274710",
  name: "Arnold Odjidja",
  network: "MTN Ghana",
  amount: "₵50"
};
