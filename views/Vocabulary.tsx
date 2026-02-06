
import React, { useState, useEffect } from 'react';
import { VOCABULARY_DATA } from '../constants';
import { AppView } from '../types';
import { getSpeech } from '../services/gemini';
import { audioCache } from '../services/audioCache';
import { decode, decodeAudioData } from '../services/audioUtils';

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
  const [sessionXP, setSessionXP] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingStatus, setDownloadingStatus] = useState<string>("");
  const [cachedItems, setCachedItems] = useState<Set<string>>(new Set());

  // Quiz State
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    const checkCache = async () => {
      try {
        const cachedSet = new Set<string>();
        for (const item of VOCABULARY_DATA) {
          if (await audioCache.has(item.french)) {
            cachedSet.add(item.french);
          }
        }
        setCachedItems(cachedSet);
      } catch (err) {
        console.warn("Cache check failed:", err);
      }
    };
    checkCache();
  }, []);

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
      
      return {
        french: item.french,
        correctEnglish: item.english,
        options
      };
    });
    
    setQuizQuestions(newQuestions);
    setIsQuizMode(true);
    setCurrentQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < VOCABULARY_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSessionXP(prev => prev + 5);
    } else {
      generateQuiz();
    }
  };

  const handleQuizAnswer = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    
    const isCorrect = option === quizQuestions[currentQuizIndex].correctEnglish;
    if (isCorrect) setQuizScore(prev => prev + 1);

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1000);
  };

  const resetLesson = () => {
    setCurrentIndex(0);
    setIsQuizMode(false);
    setIsFlipped(false);
    setSessionXP(0);
    setQuizQuestions([]);
  };

  const finishLesson = () => {
    addXP(sessionXP + 20); 
    setView(AppView.DASHBOARD);
  };

  const playAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) return;
    
    setIsSpeaking(true);
    try {
      const card = VOCABULARY_DATA[currentIndex];
      let base64Audio = await audioCache.get(card.french);
      if (!base64Audio) {
        if (!navigator.onLine) {
          setIsSpeaking(false);
          return;
        }
        base64Audio = await getSpeech(card.french);
        if (base64Audio) {
          await audioCache.set(card.french, base64Audio);
          setCachedItems(prev => new Set(prev).add(card.french));
        }
      }
      
      if (base64Audio) {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.onended = () => {
          setIsSpeaking(false);
          audioCtx.close();
        };
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("Audio Playback Error:", error);
      setIsSpeaking(false);
    }
  };

  const downloadAllAudio = async () => {
    if (!navigator.onLine) {
      alert("Please connect to the internet.");
      return;
    }
    setIsDownloading(true);
    let count = 0;
    const total = VOCABULARY_DATA.length;
    for (const item of VOCABULARY_DATA) {
      count++;
      if (!(await audioCache.has(item.french))) {
        setDownloadingStatus(`Fetching "${item.french}"... (${count}/${total})`);
        try {
          const base64 = await getSpeech(item.french);
          if (base64) {
            await audioCache.set(item.french, base64);
            setCachedItems(prev => new Set(prev).add(item.french));
          }
        } catch (err) {}
      }
    }
    setIsDownloading(false);
    setDownloadingStatus("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
        <button onClick={() => setView(AppView.DASHBOARD)} className="p-2 hover:bg-emerald-700 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </button>
        <h2 className="text-sm font-bold uppercase tracking-wider">
          {isQuizMode ? 'Final Assessment' : 'Study Session'}
        </h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        {isQuizMode ? (
          quizFinished ? (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center w-full">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl ${((quizScore / quizQuestions.length) * 100) >= 75 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {((quizScore / quizQuestions.length) * 100) >= 75 ? '🎓' : '📚'}
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">
                {((quizScore / quizQuestions.length) * 100) >= 75 ? 'Lesson Passed!' : 'Need more practice'}
              </h2>
              <p className="text-slate-500 mb-6 font-medium">
                You scored <span className="font-bold text-slate-800">{(quizScore / quizQuestions.length) * 100}%</span> ({quizScore}/{quizQuestions.length})
              </p>

              {((quizScore / quizQuestions.length) * 100) >= 75 ? (
                <div className="space-y-4 w-full max-w-xs">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-emerald-700 text-sm font-medium leading-relaxed">
                    Excellent! You've mastered this clinical set. Keep up the great work!
                  </div>
                  <button 
                    onClick={finishLesson}
                    className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all"
                  >
                    Finish Lesson (+{sessionXP + 20} XP)
                  </button>
                </div>
              ) : (
                <div className="space-y-4 w-full max-w-xs">
                  <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-red-700 text-sm font-medium leading-relaxed">
                    You need at least 75% to pass this clinical assessment. Please retake the flashcards to master the content.
                  </div>
                  <button 
                    onClick={resetLesson}
                    className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black shadow-lg active:scale-95 transition-all"
                  >
                    Retake Lesson
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="w-full mb-8 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Question {currentQuizIndex + 1} of {quizQuestions.length}</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }} />
                </div>
              </div>

              <div className="bg-white border-2 border-slate-100 w-full p-10 rounded-[2.5rem] shadow-sm mb-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Meaning in English?</p>
                <h3 className="text-3xl font-black text-emerald-600 leading-tight">{quizQuestions[currentQuizIndex].french}</h3>
              </div>

              <div className="grid grid-cols-1 gap-3 w-full">
                {quizQuestions[currentQuizIndex].options.map((option, idx) => {
                  const isCorrect = option === quizQuestions[currentQuizIndex].correctEnglish;
                  const isSelected = option === selectedOption;
                  let btnClass = "bg-white border-slate-200 text-slate-700 shadow-sm active:scale-95";
                  if (selectedOption) {
                    if (isCorrect) btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-emerald-100";
                    else if (isSelected) btnClass = "bg-red-500 border-red-500 text-white shadow-red-100";
                    else btnClass = "bg-slate-50 border-slate-100 text-slate-300 opacity-50";
                  }
                  return (
                    <button key={idx} disabled={!!selectedOption} onClick={() => handleQuizAnswer(option)} className={`w-full p-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-4 ${btnClass}`}>
                      <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center text-[10px] flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
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
              <div className="flex flex-col">
                 <h3 className="text-lg font-bold text-slate-800">Flashcards</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tap card to see meaning</p>
              </div>
              <div className="flex items-center gap-2">
                {!isDownloading ? (
                   <button onClick={downloadAllAudio} className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors">
                     📥 Offline Pack
                   </button>
                ) : (
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg animate-pulse">{downloadingStatus}</span>
                )}
                <span className="bg-slate-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-black">{currentIndex + 1} / {VOCABULARY_DATA.length}</span>
              </div>
            </div>

            <div className="w-full max-w-sm aspect-[4/5] relative perspective-1000 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                <div className="absolute inset-0 bg-white border-2 border-slate-100 rounded-[3rem] shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center p-8 [backface-visibility:hidden]">
                  <div className="absolute top-8 flex items-center gap-2">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{VOCABULARY_DATA[currentIndex].category}</span>
                    {cachedItems.has(VOCABULARY_DATA[currentIndex].french) && <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Offline</span>}
                  </div>
                  <div className="flex flex-col items-center gap-8">
                    <h3 className="text-4xl font-black text-slate-800 text-center leading-tight">{VOCABULARY_DATA[currentIndex].french}</h3>
                    <button onClick={playAudio} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${isSpeaking ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-emerald-50 text-emerald-500 hover:scale-110 active:scale-90'}`}>
                      <span className="text-3xl">{isSpeaking ? '⏳' : '🔊'}</span>
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 bg-emerald-600 border-2 border-white/20 rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="text-emerald-100/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">English Meaning</span>
                  <h3 className="text-4xl font-black text-white text-center leading-tight">{VOCABULARY_DATA[currentIndex].english}</h3>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 w-full max-w-sm">
              <button onClick={handleNext} className="w-full bg-emerald-500 text-white py-5 rounded-[2.5rem] font-black text-lg shadow-xl shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-3">
                {currentIndex === VOCABULARY_DATA.length - 1 ? 'Unlock Assessment 🔓' : 'Next Card ▶️'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vocabulary;
