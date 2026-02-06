
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

interface OralSimulatorProps {
  addXP: (amount: number) => void;
}

const OralSimulator: React.FC<OralSimulatorProps> = ({ addXP }) => {
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState<string>("Ready to practice your oral exam? Tap start to simulate a clinical scenario with a patient.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Audio contexts and refs for Live API
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    setIsActive(true);
    setFeedback("Connecting to the clinical simulator...");
    
    // In a real environment, we'd use the Live API logic here
    // For this prototype, we'll simulate the AI patient behavior
    setTimeout(() => {
      setFeedback("Patient: Bonjour Infirmière. J'ai très mal au ventre...");
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 1500);
  };

  const stopSession = () => {
    setIsActive(false);
    setFeedback("Session ended. Great job practicing your clinical French!");
    addXP(20);
  };

  return (
    <div className="p-4 flex flex-col items-center h-full">
      <div className="w-full text-center mb-10">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Oral Exam Lab</h2>
        <p className="text-sm text-slate-500">Practice clinical role-plays with a virtual patient.</p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        {/* Animated Sound Waves */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 bg-emerald-400 rounded-full transition-all duration-300 ${isSpeaking ? 'animate-bounce' : 'h-8 opacity-40'}`} 
                style={{ height: isSpeaking ? `${Math.random() * 80 + 20}%` : '2rem', animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
        
        {/* Core Visualization */}
        <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${
          isActive ? 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] scale-110' : 'bg-slate-200'
        }`}>
          <span className="text-6xl">{isActive ? '🏥' : '🎙️'}</span>
        </div>
      </div>

      <div className="w-full bg-slate-50 p-6 rounded-3xl border border-slate-200 mb-8 min-h-[120px] flex items-center justify-center">
        <p className="text-center font-medium text-slate-700 italic leading-relaxed">
          "{feedback}"
        </p>
      </div>

      <div className="w-full space-y-4">
        {!isActive ? (
          <button 
            onClick={startSession}
            className="w-full bg-emerald-500 text-white py-5 rounded-3xl font-bold text-xl shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>▶️</span> Start Simulator
          </button>
        ) : (
          <button 
            onClick={stopSession}
            className="w-full bg-red-500 text-white py-5 rounded-3xl font-bold text-xl shadow-xl shadow-red-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span>⏹️</span> Finish Session
          </button>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-2">
            <span className="text-lg">📜</span>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Scenario</p>
              <p className="text-xs font-bold text-slate-700">Abdominal Pain</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-3 rounded-2xl flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Reward</p>
              <p className="text-xs font-bold text-slate-700">+20 XP</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">Powered by Gemini Real-time AI</p>
      </div>
    </div>
  );
};

export default OralSimulator;
