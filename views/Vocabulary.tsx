
import React, { useState } from 'react';
import { VOCABULARY_DATA } from '../constants.tsx';
import { AppView } from '../types.ts';

interface VocabularyProps {
  addXP: (amount: number) => void;
  setView: (view: AppView) => void;
}

interface QuizQuestion {
  french: string;
  correctEnglish: string;
  options: string[];
}

const Vocabulary: React.FC<VocabularyProps> = ({ addXP, setView }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < VOCABULARY_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      generateQuiz();
    }
  };

  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const generateQuiz = () => {
    const shuffled = [...VOCABULARY_DATA].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    const newQuestions = selected.map(item => {
      const others = VOCABULARY_DATA
        .filter(v => v.id !== item.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(v => v.english);
      const options = [...others, item.english].sort(() => 0.5 - Math.random());
      return { french: item.french, correctEnglish: item.english, options };
    });
    setQuizQuestions(newQuestions);
    setIsQuizMode(true);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleQuizAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const isCorrect = quizQuestions[currentQuizIndex].options[idx] === quizQuestions[currentQuizIndex].correctEnglish;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
      addXP(10);
    }
    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1000);
  };

  const currentCard = VOCABULARY_DATA[currentIndex];

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4">
      <div className="flex-1 flex flex-col items-center">
        {isQuizMode ? (
          quizFinished ? (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center w-full animate-in fade-in zoom-in duration-300">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl ${((quizScore / quizQuestions.length) * 100) >= 75 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {((quizScore / quizQuestions.length) * 100) >= 75 ? '🎓' : '📚'}
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">
                {((quizScore / quizQuestions.length) * 100) >= 75 ? 'Lesson Passed!' : 'Needs Review'}
              </h2>
              <p className="text-slate-500 mb-6 font-medium">Score: <span className="font-bold text-slate-800">{quizScore} / {quizQuestions.length}</span></p>
              <button onClick={() => setView(AppView.DASHBOARD)} className="w-full max-w-xs bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all">Finish Lesson</button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="w-full mb-8 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Question {currentQuizIndex + 1} of {quizQuestions.length}</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }} />
                </div>
              </div>
              <div className="bg-white border-2 border-slate-100 w-full p-10 rounded-[2.5rem] shadow-sm mb-8 text-center min-h-[200px] flex flex-col justify-center">
                <h3 className="text-3xl font-black text-emerald-600 leading-tight">{quizQuestions[currentQuizIndex].french}</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 w-full">
                {quizQuestions[currentQuizIndex].options.map((option, idx) => {
                  const isCorrect = option === quizQuestions[currentQuizIndex].correctEnglish;
                  const isSelected = idx === selectedOption;
                  let btnClass = "bg-white border-slate-200 text-slate-700 active:scale-[0.98]";
                  if (selectedOption !== null) {
                    if (isCorrect) btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-emerald-100";
                    else if (isSelected) btnClass = "bg-red-500 border-red-500 text-white shadow-red-100";
                    else btnClass = "opacity-40 grayscale";
                  }
                  return (
                    <button key={idx} disabled={selectedOption !== null} onClick={() => handleQuizAnswer(idx)} className={`w-full p-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-4 ${btnClass}`}>
                      <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-[10px]">{String.fromCharCode(65 + idx)}</span>
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="w-full flex justify-between items-center mb-6 px-2">
              <span className="bg-slate-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-black">{currentIndex + 1} / {VOCABULARY_DATA.length}</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tap card for English</p>
            </div>

            <div className="w-full max-w-sm aspect-[4/5] relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                {/* Front Card */}
                <div className="absolute inset-0 bg-white border-2 border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center p-8 [backface-visibility:hidden]">
                  <div className="absolute top-8 left-0 right-0 px-8 flex items-center justify-center">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{currentCard.category}</span>
                  </div>
                  
                  <div className="flex flex-col items-center gap-6">
                    <h3 className="text-4xl font-black text-slate-800 text-center leading-tight">{currentCard.french}</h3>
                  </div>
                </div>

                {/* Back Card */}
                <div className="absolute inset-0 bg-emerald-600 border-2 border-white/20 rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="text-emerald-100/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Meaning</span>
                  <h3 className="text-4xl font-black text-white text-center leading-tight">{currentCard.english}</h3>
                </div>
              </div>
            </div>

            <div className="mt-10 w-full max-w-sm">
              <button 
                onClick={handleNext} 
                className="w-full bg-slate-800 text-white py-5 rounded-[2.5rem] font-black text-lg shadow-xl shadow-slate-200 active:scale-95 transition-all"
              >
                {currentIndex === VOCABULARY_DATA.length - 1 ? 'Start Assessment 🔓' : 'Next Word ▶️'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vocabulary;
