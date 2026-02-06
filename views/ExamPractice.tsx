
import React, { useState, useEffect } from 'react';
import { generateExamQuestions } from '../services/gemini';
import { ExamQuestion, AppView } from '../types';

interface ExamPracticeProps {
  addXP: (amount: number) => void;
  setView: (view: AppView) => void;
}

const ExamPractice: React.FC<ExamPracticeProps> = ({ addXP, setView }) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Initializing Security...');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const statusMessages = [
    'Authenticating Session...',
    'Syncing with NMC Guidelines...',
    'Fetching Clinical Cases...',
    'Assembling Exam Package...',
    'Securing Environment...',
  ];

  const startNewQuiz = async () => {
    setLoading(true);
    setDownloadProgress(0);
    setSyncStatus(statusMessages[0]);
    
    // Smooth progress simulation
    let msgIdx = 0;
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 98) return prev;
        const inc = Math.random() * 6;
        const next = Math.min(98, prev + inc);
        
        const nextMsgIdx = Math.min(statusMessages.length - 1, Math.floor((next / 100) * statusMessages.length));
        if (nextMsgIdx !== msgIdx) {
          msgIdx = nextMsgIdx;
          setSyncStatus(statusMessages[msgIdx]);
        }
        return next;
      });
    }, 200);

    try {
      const q = await generateExamQuestions("Clinical Nursing Excellence");
      setQuestions(q);
      setDownloadProgress(100);
      setSyncStatus('Sync Successful');
      setTimeout(() => {
        setLoading(false);
        setCurrentIndex(0);
        setScore(0);
        setIsFinished(false);
        setSelectedOption(null);
        setShowExplanation(false);
      }, 600);
    } catch (err) {
      console.error(err);
      alert("Encryption Error: Could not sync with exam server.");
      setLoading(false);
    } finally {
      clearInterval(interval);
    }
  };

  useEffect(() => {
    startNewQuiz();
  }, []);

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === questions[currentIndex].correctIndex) {
      setScore(prev => prev + 1);
      addXP(30);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-white">
        <div className="relative mb-10">
          <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl relative z-10 border-4 border-emerald-50">
            <span className="text-4xl text-white">🔐</span>
          </div>
          <div className="absolute -inset-4 bg-emerald-500/10 rounded-full animate-pulse"></div>
        </div>

        <div className="w-full max-w-xs space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-black text-slate-800">Secure Data Sync</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1">{syncStatus}</p>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-50">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest">
              <span>NMC Registry V4.1</span>
              <span>{Math.round(downloadProgress)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const passed = (score / questions.length) >= 0.6;
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 bg-slate-50 animate-in zoom-in duration-500">
        <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-5xl mb-8 shadow-2xl border-8 ${
          passed ? 'bg-emerald-100 border-emerald-50 text-emerald-600' : 'bg-red-100 border-red-50 text-red-600'
        }`}>
          {passed ? '🏆' : '📖'}
        </div>
        
        <h2 className="text-3xl font-black text-slate-800 mb-2">Simulation Over</h2>
        <p className="text-slate-500 mb-10 font-medium">
          Final Score: <span className="font-black text-slate-900">{score} / {questions.length}</span>
        </p>

        <div className="w-full max-w-xs space-y-3">
          <button 
            onClick={startNewQuiz}
            className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black shadow-xl shadow-emerald-200 active:scale-95 transition-all"
          >
            🔄 New Simulation
          </button>
          <button 
            onClick={() => setView(AppView.DASHBOARD)}
            className="w-full bg-white text-slate-500 py-4 rounded-3xl font-black border border-slate-200 active:scale-95 transition-all"
          >
            🏠 Return Home
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[currentIndex];

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-20">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessment Mode</span>
            <span className="text-xs font-black text-slate-800">ITEM {currentIndex + 1} OF {questions.length}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black border border-emerald-100">
            {score} POINTS
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <p className="text-lg font-bold text-slate-800 leading-relaxed text-center">
            {q.question}
          </p>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correctIndex;
            const isSelected = selectedOption === idx;
            let btnClass = "bg-white border-slate-100 text-slate-700 shadow-sm";
            
            if (selectedOption !== null) {
              if (isCorrect) btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-100 scale-105 z-10";
              else if (isSelected) btnClass = "bg-red-500 border-red-500 text-white shadow-xl shadow-red-100 scale-105 z-10";
              else btnClass = "opacity-30 grayscale border-transparent";
            } else {
              btnClass += " hover:border-emerald-300 transition-all active:scale-[0.98]";
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-5 rounded-[2rem] border-2 font-bold text-base flex items-center gap-4 ${btnClass}`}
              >
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs shrink-0 font-black ${
                  selectedOption === null ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-white/20 border-white/40'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="bg-white border-2 border-emerald-100 p-8 rounded-[3rem] shadow-2xl shadow-emerald-100/20 animate-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{selectedOption === q.correctIndex ? '⚡' : '📚'}</span>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Explanation</h4>
            </div>
            <p className="text-sm text-slate-600 font-medium leading-relaxed mb-8 italic">
              {q.explanation}
            </p>
            <button 
              onClick={handleNext}
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-base shadow-xl active:scale-95 transition-all"
            >
              {currentIndex === questions.length - 1 ? 'Finalize Report' : 'Confirm & Continue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPractice;
