
import React, { useState, useEffect } from 'react';
import { generateExamQuestions } from '../services/gemini';
import { ExamQuestion, AppView } from '../types';

interface ExamPracticeProps {
  addXP: (amount: number) => void;
  setView: (view: AppView) => void;
}

// Fixed: Completed component implementation with proper return and default export to fix "Module has no default export" and "Type void is not assignable to ReactNode" errors.
const ExamPractice: React.FC<ExamPracticeProps> = ({ addXP, setView }) => {
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const startNewQuiz = async () => {
    setLoading(true);
    setDownloadProgress(0);
    
    // Simulate downloading progress while Gemini generates content
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 200);

    try {
      const topic = "General Clinical Practice for Ghanaian Nurses";
      const q = await generateExamQuestions(topic);
      if (q && Array.isArray(q)) {
        setQuestions(q);
      } else {
        throw new Error("Invalid questions format received");
      }
      setDownloadProgress(100);
      setLoading(false);
      setCurrentIndex(0);
      setScore(0);
      setIsFinished(false);
      setSelectedOption(null);
      setShowExplanation(false);
    } catch (err) {
      console.error("Exam Generation Error:", err);
      setLoading(false);
      alert("Failed to generate exam questions. Please try again.");
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
      addXP(20);
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
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
        <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-3xl mb-6 animate-pulse">
          📑
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">Generating Your Exam...</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">Our clinical AI is drafting 5 high-yield multiple choice questions for your practice.</p>
        <div className="w-full max-w-xs bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-emerald-500 h-full transition-all duration-300" 
            style={{ width: `${downloadProgress}%` }}
          />
        </div>
        <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">{downloadProgress}% Prepared</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl border-4 border-emerald-50">
          🏆
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Assessment Complete!</h2>
        <p className="text-slate-500 mb-8 font-medium">You achieved a score of <span className="text-emerald-600 font-bold">{score} / {questions.length}</span></p>
        
        <div className="w-full space-y-3 max-w-xs">
          <button 
            onClick={startNewQuiz}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all"
          >
            🔄 Take Another Quiz
          </button>
          <button 
            onClick={() => setView(AppView.DASHBOARD)}
            className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-black active:scale-95 transition-all"
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-300">
      <header className="bg-white border-b border-slate-100 px-4 py-3 shrink-0 flex justify-between items-center shadow-sm">
        <button onClick={() => setView(AppView.DASHBOARD)} className="text-slate-400 hover:text-slate-600 p-1">
          <span className="text-xl">✕</span>
        </button>
        <div className="text-center">
          <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Question {currentIndex + 1} of {questions.length}</h2>
          <div className="w-32 bg-slate-100 h-1 rounded-full mt-1 overflow-hidden mx-auto">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-emerald-50 px-3 py-1 rounded-full text-emerald-600 font-black text-[10px] border border-emerald-100">
          SCORE: {score}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative">
          <span className="absolute -top-3 left-8 bg-emerald-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Clinical Scenario</span>
          <h3 className="text-lg font-bold text-slate-800 leading-relaxed mt-2">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctIndex;
            let btnClass = "bg-white border-slate-100 text-slate-700 shadow-sm";
            
            if (selectedOption !== null) {
              if (isCorrect) btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-emerald-100";
              else if (isSelected) btnClass = "bg-red-500 border-red-500 text-white shadow-red-100";
              else btnClass = "opacity-40 grayscale border-slate-50";
            } else {
              btnClass += " hover:border-emerald-200 hover:bg-emerald-50/10 active:scale-[0.99]";
            }

            return (
              <button 
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-5 rounded-2xl border-2 font-bold text-sm transition-all text-left flex items-center gap-4 ${btnClass}`}
              >
                <span className={`w-8 h-8 rounded-full border border-current flex items-center justify-center text-xs shrink-0 ${selectedOption === null ? 'text-slate-200' : ''}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-snug">{option}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="bg-blue-50 border-2 border-blue-100 p-6 rounded-[2.5rem] animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">💡</span>
              <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">Clinical Explanation</h4>
            </div>
            <p className="text-sm text-blue-800 font-medium leading-relaxed">
              {currentQuestion.explanation}
            </p>
            <button 
              onClick={handleNext}
              className="mt-6 w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {currentIndex === questions.length - 1 ? 'See Results 🏁' : 'Next Question ➡️'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPractice;
