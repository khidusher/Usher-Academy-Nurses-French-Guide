
import React from 'react';
import { AppView } from '../types';

interface GrammarProps {
  addXP: (amount: number) => void;
  setView: (view: AppView) => void;
}

const Grammar: React.FC<GrammarProps> = ({ addXP, setView }) => {
  const grammarRules = [
    { 
      title: "Être (To be) - Identité", 
      rule: "Je suis infirmière. (I am a nurse)", 
      usage: "Essential for introducing yourself to patients.",
      examTip: "Always use 'Je suis' to start your oral exam intro."
    },
    { 
      title: "Avoir (To have) - Symptômes", 
      rule: "Le patient a de la fièvre. (The patient has fever)", 
      usage: "Used for vital signs and patient states.",
      examTip: "Exam questions often ask 'Qu'est-ce que le patient a?'"
    },
    { 
      title: "L'Impératif (Instructions)", 
      rule: "Ouvrez la bouche. (Open your mouth)", 
      usage: "Giving clear instructions during procedures.",
      examTip: "Use the 'Vous' form to remain professional and polite."
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-4 py-3 shrink-0">
        <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Language Science</h2>
        <p className="text-sm font-black text-slate-800">Grammar Lab</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <p className="text-sm font-medium text-slate-500 text-center leading-relaxed">Master these essential high-yield French structures tested in Ghanaian Nursing Exams.</p>
        </div>

        <div className="space-y-6">
          {grammarRules.map((rule, idx) => (
            <div key={idx} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm group hover:border-emerald-200 transition-colors">
              <h3 className="text-xl font-black text-slate-800 mb-4">{rule.title}</h3>
              <div className="bg-emerald-50 text-emerald-700 p-5 rounded-2xl font-mono text-sm mb-6 border border-emerald-100 flex items-center justify-center text-center">
                "{rule.rule}"
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinical Usage</p>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{rule.usage}</p>
                </div>
                <div className="flex gap-3 items-start bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <span className="text-xl shrink-0">💡</span>
                  <div>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Exam Secret</p>
                    <p className="text-xs text-amber-900 font-bold leading-relaxed">{rule.examTip}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  addXP(10);
                  alert("Nice! You've mastered this rule.");
                }}
                className="mt-8 w-full bg-slate-800 text-white py-4 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all"
              >
                Mark as Mastered (+10 XP)
              </button>
            </div>
          ))}
        </div>

        <div className="text-center py-4">
          <button onClick={() => setView(AppView.DASHBOARD)} className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] hover:text-emerald-500 transition-colors">Return to Roadmap</button>
        </div>
      </div>
    </div>
  );
};

export default Grammar;
