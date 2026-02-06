
import React, { useState, useEffect, useRef } from 'react';
import { generateExamQuestions } from '../services/examService';
import { ExamQuestion, AppView, ExamRecord } from '../types';
import { EXAMS_SCHEMA } from '../constants';

interface ExamPracticeProps {
  addXP: (amount: number) => void;
  setView: (view: AppView) => void;
  saveExamResult: (record: ExamRecord) => void;
}

const ExamPractice: React.FC<ExamPracticeProps> = ({ addXP, setView, saveExamResult }) => {
  const [activeStep, setActiveStep] = useState<'SELECT' | 'SYNC' | 'QUIZ' | 'RESULT'>('SELECT');
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isTimed, setIsTimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const startExam = async (lessonId: string, lessonTitle: string) => {
    setSelectedLessonId(lessonId);
    setSelectedLessonTitle(lessonTitle);
    setActiveStep('SYNC');
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(p => Math.min(99, p + Math.random() * 20));
    }, 100);

    try {
      const q = await generateExamQuestions(lessonId);
      setQuestions(q);
      setAnswers(new Array(q.length).fill(null));
      setIsConfirmed(false);
      setCurrentIndex(0);
      setSyncProgress(100);
      setTimeout(() => {
        setActiveStep('QUIZ');
        setStartTime(Date.now());
        if (isTimed) setTimeLeft(q.length * 45); 
      }, 500);
    } catch (err) {
      console.error("Exam Load Error:", err);
      alert("Local Exam Data Error: Please contact Usher Academy support.");
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
            finalizeExam();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeStep, isTimed, timeLeft]);

  const handleSelectOption = (idx: number) => {
    if (isConfirmed) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = idx;
    setAnswers(newAnswers);
  };

  const handleConfirm = () => {
    if (answers[currentIndex] === null) return;
    setIsConfirmed(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setIsConfirmed(false);
    } else {
      finalizeExam();
    }
  };

  const finalizeExam = () => {
    const score = calculateScore();
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const xpBase = score * 20;
    const timeBonus = isTimed ? xpBase : 0;
    
    if (selectedLessonId) {
      saveExamResult({
        lessonId: selectedLessonId,
        score: score,
        total: questions.length,
        date: new Date().toISOString(),
        timeSpent: timeSpent
      });
    }

    addXP(xpBase + timeBonus);
    setActiveStep('RESULT');
  };

  const calculateScore = () => {
    return answers.reduce((acc, curr, idx) => {
      return acc + (curr === questions[idx]?.correctIndex ? 1 : 0);
    }, 0);
  };

  if (activeStep === 'SELECT') {
    const currentWeekData = EXAMS_SCHEMA.weeks.find(w => w.week === selectedWeek);

    return (
      <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-32">
        <header className="p-8 pb-4 text-center space-y-2 bg-white">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Exam Center</h2>
          <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Master 160 Clinical MCQs</p>
        </header>

        {/* Week Selector Tabs */}
        <div className="bg-white border-b border-slate-100 px-4 sticky top-0 z-30">
          <div className="flex gap-2 overflow-x-auto py-4 no-scrollbar">
            {EXAMS_SCHEMA.weeks.map((week) => (
              <button
                key={week.week}
                onClick={() => setSelectedWeek(week.week)}
                className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  selectedWeek === week.week 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                Week {week.week}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-8 space-y-8">
          <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-2xl flex justify-between items-center group">
            <div className="space-y-1">
              <h3 className="font-black text-lg flex items-center gap-2">⏱️ Timed Mode</h3>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Double XP Rewards</p>
            </div>
            <button 
              onClick={() => setIsTimed(!isTimed)}
              className={`w-14 h-8 rounded-full relative transition-all duration-300 ${isTimed ? 'bg-emerald-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md ${isTimed ? 'left-[calc(100%-1.75rem)]' : 'left-1'}`} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-base font-black text-slate-800">{currentWeekData?.title}</h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg font-black uppercase">Active</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {currentWeekData?.lessons.map(lesson => (
                <button
                  key={lesson.id}
                  onClick={() => startExam(lesson.id, lesson.title)}
                  className="w-full bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-50"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-50 transition-all shadow-inner border border-slate-100">
                      {lesson.icon || '📑'}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-slate-800 text-lg">{lesson.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ghana Clinical Standard</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 text-slate-300 group-hover:bg-emerald-500 group-hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all border border-slate-100">
                    <span className="text-lg font-bold">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeStep === 'SYNC') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-white text-center">
        <div className="relative mb-12">
          <div className="w-32 h-32 bg-emerald-600 rounded-[3.5rem] flex items-center justify-center shadow-2xl relative z-10 border-8 border-emerald-50 animate-bounce">
            <span className="text-5xl">💉</span>
          </div>
          <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping scale-150 opacity-20"></div>
        </div>
        <div className="w-full max-w-xs space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800">Retrieving Clinic Data</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.3em]">{selectedLessonTitle}</p>
          </div>
          <div className="space-y-3">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-50">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full" 
                style={{ width: `${syncProgress}%` }} 
              />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Ready to Practice
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeStep === 'QUIZ') {
    const q = questions[currentIndex];
    const userChoice = answers[currentIndex];
    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
    const progressPerc = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-6 py-5 flex justify-between items-center shadow-md shrink-0 relative z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setActiveStep('SELECT')} className="text-slate-300 hover:text-slate-600 transition-colors p-1">✕</button>
            <div className="bg-slate-900 text-white px-4 py-1.5 rounded-2xl">
              <span className="text-[10px] font-black tracking-widest uppercase">Question {currentIndex + 1} / {questions.length}</span>
            </div>
          </div>
          {isTimed && (
            <div className={`px-4 py-1.5 rounded-2xl text-[11px] font-black border-2 transition-all ${timeLeft < 30 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          )}
        </header>

        <div className="w-full h-1.5 bg-slate-100 overflow-hidden shrink-0 z-50">
          <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${progressPerc}%` }} />
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth" style={{ paddingBottom: '160px' }}>
          <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
            <h3 className="text-xl font-bold text-slate-800 leading-relaxed">{q.question}</h3>
          </div>

          <div className="space-y-4">
            {q.options.map((opt, idx) => {
              const isSelected = userChoice === idx;
              const isCorrect = q.correctIndex === idx;
              
              let choiceStyle = "bg-white border-slate-100 text-slate-700";
              if (isSelected) choiceStyle = "bg-emerald-600 border-emerald-600 text-white scale-[1.02] shadow-xl";
              
              if (isConfirmed) {
                if (isCorrect) choiceStyle = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100";
                else if (isSelected) choiceStyle = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100";
                else choiceStyle = "bg-white border-slate-100 text-slate-300 opacity-50";
              }

              return (
                <button
                  key={idx}
                  disabled={isConfirmed}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-6 rounded-[2.5rem] border-2 font-bold text-base text-left flex items-center gap-5 transition-all shadow-sm ${choiceStyle}`}
                >
                  <span className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center text-sm shrink-0 font-black ${
                     isSelected || (isConfirmed && isCorrect) ? 'bg-white/20 border-white/40' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>

          {isConfirmed && (
            <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="flex items-center gap-3 mb-2">
                 <span className="text-xl">{userChoice === q.correctIndex ? '✅' : '❌'}</span>
                 <p className={`font-black uppercase tracking-widest text-[10px] ${userChoice === q.correctIndex ? 'text-emerald-600' : 'text-red-500'}`}>
                   {userChoice === q.correctIndex ? 'Correct Analysis' : 'Clinical Correction'}
                 </p>
               </div>
               <p className="text-xs text-slate-600 leading-relaxed font-medium italic">{q.explanation}</p>
            </div>
          )}
        </div>

        <footer className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md p-6 border-t border-slate-100 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
           <div className="max-w-md mx-auto">
             {!isConfirmed ? (
               <button 
                  onClick={handleConfirm}
                  disabled={userChoice === null}
                  className={`w-full py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all ${
                    userChoice === null ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-emerald-600 text-white active:scale-95'
                  }`}
               >
                  Confirm Analysis 💉
               </button>
             ) : (
               <button 
                  onClick={handleNext}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 animate-in zoom-in duration-200"
               >
                  {currentIndex === questions.length - 1 ? 'Finish Exam 🏁' : 'Submit & Next ➡️'}
               </button>
             )}
           </div>
        </footer>
      </div>
    );
  }

  if (activeStep === 'RESULT') {
    const finalScore = calculateScore();
    const passed = finalScore >= 7;

    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 bg-slate-50 animate-in zoom-in duration-500 pb-32 overflow-y-auto">
        <div className={`w-36 h-36 rounded-[3.5rem] flex items-center justify-center text-7xl mb-10 shadow-2xl border-[12px] ${
          passed ? 'bg-emerald-100 border-emerald-50 text-emerald-600 shadow-emerald-100' : 'bg-amber-100 border-amber-50 text-amber-600'
        }`}>
          {passed ? '🏆' : '📚'}
        </div>
        
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">{passed ? 'Qualified!' : 'Revision Required'}</h2>
          <p className="text-xs text-slate-500 font-black uppercase tracking-[0.3em]">{selectedLessonTitle}</p>
        </div>

        <div className="grid grid-cols-2 gap-5 w-full max-w-sm mb-12">
           <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</p>
             <p className="text-3xl font-black text-slate-800">{finalScore}/10</p>
           </div>
           <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">XP Reward</p>
             <p className="text-3xl font-black text-emerald-600">+{finalScore * (isTimed ? 40 : 20)}</p>
           </div>
        </div>

        <div className="w-full max-w-sm space-y-4 px-4">
          <button onClick={() => setActiveStep('SELECT')} className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-black text-lg shadow-2xl active:scale-95 transition-all">🔄 Try Another Lesson</button>
          <button onClick={() => setView(AppView.DASHBOARD)} className="w-full bg-white text-slate-500 border-2 border-slate-100 py-5 rounded-[2.5rem] font-black text-sm active:scale-95 transition-all">🏠 Home</button>
        </div>
      </div>
    );
  }

  return null;
};

export default ExamPractice;
