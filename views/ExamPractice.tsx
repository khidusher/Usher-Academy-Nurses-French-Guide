
import React, { useState, useEffect, useRef } from 'react';
import { generateExamQuestions } from '../services/gemini';
import { ExamQuestion, AppView } from '../types';
import { WEEKLY_ROADMAP } from '../constants';

interface ExamPracticeProps {
  addXP: (amount: number) => void;
  setView: (view: AppView) => void;
}

const ExamPractice: React.FC<ExamPracticeProps> = ({ addXP, setView }) => {
  const [activeStep, setActiveStep] = useState<'SELECT' | 'SYNC' | 'QUIZ' | 'RESULT'>('SELECT');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isTimed, setIsTimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [syncProgress, setSyncProgress] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startExam = async (lesson: string) => {
    setSelectedLesson(lesson);
    setActiveStep('SYNC');
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(p => Math.min(98, p + Math.random() * 15));
    }, 200);

    try {
      const q = await generateExamQuestions(lesson);
      setQuestions(q);
      setAnswers(new Array(q.length).fill(null));
      setSyncProgress(100);
      setTimeout(() => {
        setActiveStep('QUIZ');
        if (isTimed) setTimeLeft(q.length * 30); // 30s per question
      }, 500);
    } catch (err) {
      alert("Failed to sync exam data.");
      setActiveStep('SELECT');
    } finally {
      clearInterval(interval);
    }
  };

  useEffect(() => {
    if (activeStep === 'QUIZ' && isTimed && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setActiveStep('RESULT');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeStep, isTimed]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = idx;
    setAnswers(newAnswers);
    setSelectedOption(idx);
    
    // Auto-advance after short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedOption(null);
      }
    }, 400);
  };

  const calculateScore = () => {
    return answers.reduce((acc, curr, idx) => {
      return acc + (curr === questions[idx]?.correctIndex ? 1 : 0);
    }, 0);
  };

  if (activeStep === 'SELECT') {
    return (
      <div className="flex flex-col h-full bg-slate-50 p-6 space-y-6 overflow-y-auto pb-32">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800">Exam Center</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Select a Clinical Module to Certify</p>
        </div>

        <div className="bg-emerald-600 p-6 rounded-[2rem] text-white shadow-xl flex justify-between items-center">
          <div>
            <h3 className="font-black text-lg">Timed Mode</h3>
            <p className="text-[10px] text-emerald-100 uppercase font-bold tracking-widest">+2x XP Reward</p>
          </div>
          <button 
            onClick={() => setIsTimed(!isTimed)}
            className={`w-14 h-8 rounded-full relative transition-colors ${isTimed ? 'bg-emerald-400' : 'bg-emerald-800'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isTimed ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="space-y-3">
          {WEEKLY_ROADMAP.map((week) => (
            <div key={week.week} className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Week {week.week}</p>
              {week.lessons.map(lesson => (
                <button
                  key={lesson}
                  onClick={() => startExam(lesson)}
                  className="w-full bg-white p-5 rounded-[1.5rem] border border-slate-200 flex items-center justify-between group active:scale-95 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg group-hover:bg-emerald-50 transition-colors">📑</div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 text-sm">{lesson}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">10 Questions</p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-emerald-500 transition-colors">▶</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeStep === 'SYNC') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-white space-y-8">
        <div className="relative">
          <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 animate-bounce">
            <span className="text-4xl text-white">🔐</span>
          </div>
          <div className="absolute -inset-4 bg-emerald-100 rounded-full animate-ping opacity-20"></div>
        </div>
        <div className="w-full max-w-xs space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-800">Syncing Clinical Data</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1">NMC-GH V5.0 PROTOCOL</p>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${syncProgress}%` }} />
          </div>
        </div>
      </div>
    );
  }

  if (activeStep === 'QUIZ') {
    const q = questions[currentIndex];
    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
      <div className="flex flex-col h-full bg-slate-50">
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-center bg-slate-900 text-white px-3 py-1 rounded-xl">
              <span className="text-xs font-black">{currentIndex + 1} / {questions.length}</span>
            </div>
            {isTimed && (
              <div className={`px-3 py-1 rounded-xl text-xs font-black border ${timeLeft < 30 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
            )}
          </div>
          <button onClick={() => setActiveStep('RESULT')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-lg">End Exam</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 leading-relaxed text-center">{q.question}</h3>
          </div>

          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-5 rounded-[1.5rem] border-2 font-bold text-sm text-left flex items-center gap-4 transition-all ${
                  answers[currentIndex] === idx 
                    ? 'bg-emerald-600 border-emerald-600 text-white scale-[1.02] shadow-lg shadow-emerald-100' 
                    : 'bg-white border-slate-100 text-slate-700 hover:border-emerald-200'
                }`}
              >
                <span className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] shrink-0 font-black ${
                   answers[currentIndex] === idx ? 'bg-white/20 border-white/40' : 'bg-slate-50 border-slate-200'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <footer className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/80 backdrop-blur-md p-4 flex justify-between border-t border-slate-100">
           <button 
             disabled={currentIndex === 0}
             onClick={() => { setCurrentIndex(c => c - 1); setSelectedOption(answers[currentIndex - 1]); }}
             className="text-xs font-black text-slate-400 disabled:opacity-30 uppercase tracking-widest"
           >
             ← Back
           </button>
           <button 
             onClick={() => {
               if (currentIndex < questions.length - 1) {
                 setCurrentIndex(c => c + 1);
                 setSelectedOption(answers[currentIndex + 1]);
               } else {
                 setActiveStep('RESULT');
                 addXP(calculateScore() * (isTimed ? 20 : 10));
               }
             }}
             className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
           >
             {currentIndex === questions.length - 1 ? 'Finish Exam' : 'Next Question →'}
           </button>
        </footer>
      </div>
    );
  }

  if (activeStep === 'RESULT') {
    const finalScore = calculateScore();
    const passed = finalScore >= 7;

    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 bg-slate-50 animate-in zoom-in duration-500">
        <div className={`w-32 h-32 rounded-[3rem] flex items-center justify-center text-6xl mb-8 shadow-2xl border-8 ${
          passed ? 'bg-emerald-100 border-emerald-50 text-emerald-600 shadow-emerald-100' : 'bg-amber-100 border-amber-50 text-amber-600 shadow-amber-100'
        }`}>
          {passed ? '🎖️' : '📚'}
        </div>
        
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-black text-slate-800">{passed ? 'Certification Earned!' : 'Revise Clinical Notes'}</h2>
          <p className="text-sm text-slate-500 font-medium">Topic: <span className="text-slate-900 font-bold">{selectedLesson}</span></p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-10">
           <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Score</p>
             <p className="text-2xl font-black text-slate-800">{finalScore}/10</p>
           </div>
           <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Reward</p>
             <p className="text-2xl font-black text-emerald-600">+{finalScore * (isTimed ? 20 : 10)} XP</p>
           </div>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={() => setActiveStep('SELECT')}
            className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black shadow-xl shadow-emerald-200 active:scale-95 transition-all"
          >
            🔄 Retake Practice
          </button>
          <button 
            onClick={() => setView(AppView.DASHBOARD)}
            className="w-full bg-white text-slate-500 border-2 border-slate-100 py-4 rounded-[2rem] font-black active:scale-95 transition-all"
          >
            🏠 Return Home
          </button>
        </div>

        <div className="mt-12 bg-white p-6 rounded-[2rem] border border-slate-100 w-full max-w-sm">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Clinical Strength Review</h4>
           <div className="space-y-3">
             {answers.map((ans, idx) => (
               <div key={idx} className="flex gap-3 text-left">
                  <span className="text-lg shrink-0">{ans === questions[idx]?.correctIndex ? '✅' : '❌'}</span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-700 truncate">{questions[idx]?.question}</p>
                    <p className="text-[9px] text-slate-400 leading-tight">{questions[idx]?.explanation}</p>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ExamPractice;
