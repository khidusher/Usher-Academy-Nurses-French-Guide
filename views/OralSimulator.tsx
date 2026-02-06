
import React, { useState, useRef } from 'react';
import { AppView } from '../types';

interface OralSimulatorProps {
  addXP: (amount: number) => void;
  setView: (view: AppView) => void;
}

const OralSimulator: React.FC<OralSimulatorProps> = ({ addXP, setView }) => {
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState<string>("Ready to practice your oral exam? Tap start to simulate a clinical scenario with a patient.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Simulation of the Live API session for prototype purposes
  const startSession = async () => {
    setIsActive(true);
    setFeedback("Connecting to the clinical simulator...");
    
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
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
        <button onClick={() => setView(AppView.DASHBOARD)} className="p-2 hover:bg-emerald-700 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </button>
        <h2 className="text-xs font-bold uppercase tracking-wider">Oral Exam Lab</h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        <div className="w-full text-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 mb-2">Patient Simulation</h2>
          <p className="text-sm text-slate-500">Practice clinical role-plays with voice AI.</p>
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center mb-10">
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
          
          <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 ${
            isActive ? 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] scale-110' : 'bg-white border-4 border-slate-100'
          }`}>
            <span className="text-6xl">{isActive ? '🏥' : '🎙️'}</span>
          </div>
        </div>

        <div className="w-full bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 mb-8 min-h-[120px] flex items-center justify-center shadow-sm">
          <p className="text-center font-medium text-slate-700 italic leading-relaxed">
            "{feedback}"
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          {!isActive ? (
            <button 
              onClick={startSession}
              className="w-full bg-emerald-500 text-white py-5 rounded-[2.5rem] font-black text-xl shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <span>▶️</span> Start Simulator
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="w-full bg-red-500 text-white py-5 rounded-[2.5rem] font-black text-xl shadow-xl shadow-red-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <span>⏹️</span> Finish Session
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
              <span className="text-2xl">📜</span>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scenario</p>
                <p className="text-xs font-black text-slate-700">Triage</p>
              </div>
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
              <span className="text-2xl">⚡</span>
              <div className="flex-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Reward</p>
                <p className="text-xs font-black text-slate-700">+20 XP</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Live Clinical Lab</p>
        </div>
      </div>
    </div>
  );
};

export default OralSimulator;
