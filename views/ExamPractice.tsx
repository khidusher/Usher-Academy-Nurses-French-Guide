
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const startNewQuiz = async () => {
    setLoading(true);
    try {
      const qs = await generateExamQuestions("Clinical Communication in Ghanaian Hospitals");
      setQuestions(qs);
      setCurrentIndex(0);
      setSelectedOption(null);
      setShowExplanation(false);
      setScore(0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startNewQuiz();
  }, []);

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === questions[currentIndex].correctIndex) {
      setScore(prev => prev + 1);
      addXP(15);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setView(AppView.DASHBOARD);
    }
  };

  if (loading) return (
    <div className="flex flex-col h-full bg-white">
      <header className="bg-emerald-600 text-white px-4 py-3 shrink-0">
        <h2 className="text-sm font-bold uppercase tracking-wider text-center">Exam Prep</h2>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center space-y-2">
          <p className="text-slate-800 font-black text-xl">Creating Exam Pack...</p>
          <p className="text-slate-400 text-sm font-medium">Standard clinical communication assessment</p>
        </div>
      </div>
    </div>
  );

  if (questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
        <button onClick={() => setView(AppView.DASHBOARD)} className="p-2 hover:bg-emerald-700 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xs font-bold uppercase tracking-wider">Exam Practice</h2>
          <p className="text-[10px] font-medium text-emerald-100 tracking-widest">Q{currentIndex + 1} OF {questions.length}</p>
        </div>
        <div className="bg-emerald-700/50 px-2 py-1 rounded-lg text-[10px] font-black">
          SCORE: {score}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
          <p className="text-lg font-bold text-slate-800 leading-relaxed text-center">
            {currentQ.question}
          </p>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            const isCorrect = idx === currentQ.correctIndex;
            const isSelected = idx === selectedOption;
            let btnClass = "bg-white border-slate-200 text-slate-700 hover:border-emerald-300 transition-colors";
            if (showExplanation) {
              if (isCorrect) btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100";
              else if (isSelected) btnClass = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100";
              else btnClass = "bg-white border-slate-100 text-slate-300 opacity-40";
            }
            return (
              <button
                key={idx}
                disabled={showExplanation}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${btnClass}`}
              >
                <span className={`w-8 h-8 flex-shrink-0 rounded-full border-2 flex items-center justify-center font-black text-[10px] ${
                  showExplanation && isCorrect ? 'bg-white text-emerald-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-bold text-sm">{option}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="bg-white p-6 rounded-[2rem] border-2 border-emerald-100 shadow-xl shadow-emerald-100/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-3">
               <span className="text-2xl">{selectedOption === currentQ.correctIndex ? '✅' : '❌'}</span>
               <h4 className="font-black text-slate-800">
                {selectedOption === currentQ.correctIndex ? 'Excellent!' : 'Correct Answer'}
              </h4>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
              {currentQ.explanation}
            </p>
            <button 
              onClick={nextQuestion}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all"
            >
              {currentIndex === questions.length - 1 ? 'Complete Assessment' : 'Next Question ▶️'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPractice;
