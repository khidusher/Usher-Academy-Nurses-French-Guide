
import React, { useState, useEffect, useRef } from 'react';
import { VOCABULARY_DATA } from '../constants.tsx';
import { AppView } from '../types.ts';
import { getSpeech } from '../services/gemini.ts';
import { audioCache } from '../services/audioCache.ts';
import { decode, decodeAudioData } from '../services/audioUtils.ts';

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
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const [cachedItems, setCachedItems] = useState<Set<string>>(new Set());
  const [individualDownloading, setIndividualDownloading] = useState<Set<string>>(new Set());
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const checkCache = async () => {
      try {
        const cachedSet = new Set<string>();
        for (const item of VOCABULARY_DATA) {
          if (await audioCache.has(item.french)) {
            cachedSet.add(item.french);
          }
        }
        if (mountedRef.current) setCachedItems(cachedSet);
      } catch (err) {
        console.warn("Cache check failed:", err);
      }
    };
    checkCache();
    
    return () => {
      mountedRef.current = false;
      stopCurrentAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const stopCurrentAudio = () => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {}
      currentSourceRef.current = null;
    }
    setIsSpeaking(false);
  };

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

  const handleNext = () => {
    stopCurrentAudio();
    setIsFlipped(false);
    if (currentIndex < VOCABULARY_DATA.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSessionXP(prev => prev + 5);
    } else {
      generateQuiz();
    }
  };

  // Quiz Logic
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleQuizAnswer = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const isCorrect = option === quizQuestions[currentQuizIndex].correctEnglish;
    if (isCorrect) setQuizScore(prev => prev + 1);
    setTimeout(() => {
      if (!mountedRef.current) return;
      setSelectedOption(null);
      if (currentQuizIndex < quizQuestions.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 1000);
  };

  const playAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopCurrentAudio();
      return;
    }
    if (isLoadingAudio) return;
    
    const indexAtStart = currentIndex;
    const frenchText = VOCABULARY_DATA[indexAtStart].french;
    
    // 1. CRITICAL: Initialize or Resume AudioContext IMMEDIATELY on click
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const audioCtx = audioCtxRef.current;
    
    try {
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
    } catch (err) {
      console.warn("Initial context resume failed:", err);
    }
    
    setIsLoadingAudio(true);
    try {
      let base64Audio = await audioCache.get(frenchText);
      
      if (!base64Audio) {
        if (!navigator.onLine) throw new Error("Offline");
        base64Audio = await getSpeech(frenchText);
        if (base64Audio) {
          await audioCache.set(frenchText, base64Audio);
          if (mountedRef.current) {
            setCachedItems(prev => new Set(prev).add(frenchText));
          }
        }
      }
      
      if (!mountedRef.current || currentIndex !== indexAtStart || !base64Audio) {
        setIsLoadingAudio(false);
        return;
      }

      const bytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(bytes, audioCtx, 24000, 1);
      
      // 2. CRITICAL: Resume again right before playing to ensure we haven't timed out during async fetch
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      if (!mountedRef.current || currentIndex !== indexAtStart) {
        setIsLoadingAudio(false);
        return;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      
      source.onended = () => {
        if (mountedRef.current && currentSourceRef.current === source) {
          setIsSpeaking(false);
          currentSourceRef.current = null;
        }
      };

      currentSourceRef.current = source;
      setIsLoadingAudio(false);
      setIsSpeaking(true);
      source.start(0);
    } catch (error) {
      console.error("Playback failed:", error);
      if (mountedRef.current) {
        setIsLoadingAudio(false);
        setIsSpeaking(false);
      }
    }
  };

  const downloadSpecificAudio = async (text: string) => {
    if (cachedItems.has(text) || individualDownloading.has(text)) return;
    if (!navigator.onLine) {
      alert("Connect to internet to save audio.");
      return;
    }
    setIndividualDownloading(prev => new Set(prev).add(text));
    try {
      const base64 = await getSpeech(text);
      if (base64) {
        await audioCache.set(text, base64);
        if (mountedRef.current) setCachedItems(prev => new Set(prev).add(text));
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (mountedRef.current) {
        setIndividualDownloading(prev => {
          const next = new Set(prev);
          next.delete(text);
          return next;
        });
      }
    }
  };

  const downloadAllAudio = async () => {
    if (!navigator.onLine) {
      alert("Connect to internet.");
      return;
    }
    const uncached = VOCABULARY_DATA.filter(item => !cachedItems.has(item.french));
    if (uncached.length === 0) return;
    setIsDownloadingAll(true);
    setDownloadProgress({ current: 0, total: uncached.length });
    let processedCount = 0;
    for (const item of uncached) {
      if (!mountedRef.current) break;
      try {
        const base64 = await getSpeech(item.french);
        if (base64) {
          await audioCache.set(item.french, base64);
          setCachedItems(prev => new Set(prev).add(item.french));
        }
      } catch (err) {}
      processedCount++;
      setDownloadProgress(prev => ({ ...prev, current: processedCount }));
    }
    if (mountedRef.current) setIsDownloadingAll(false);
  };

  const currentCard = VOCABULARY_DATA[currentIndex];
  const isCurrentlyCached = cachedItems.has(currentCard.french);
  const isCurrentlyIndividualDownloading = individualDownloading.has(currentCard.french);
  const allDownloaded = cachedItems.size === VOCABULARY_DATA.length;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
        <button onClick={() => setView(AppView.DASHBOARD)} className="p-2 hover:bg-emerald-700 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </button>
        <h2 className="text-sm font-bold uppercase tracking-wider">
          {isQuizMode ? 'Review Mode' : 'Flashcards'}
        </h2>
        <div className="w-10"></div>
      </header>

      {/* Progress Header */}
      <div className="bg-white border-b border-slate-200 p-4 space-y-3 shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Offline Audio Pack</h3>
            <p className="text-xs font-bold text-slate-700">{cachedItems.size} of {VOCABULARY_DATA.length} saved</p>
          </div>
          <button 
            onClick={downloadAllAudio} 
            disabled={isDownloadingAll || allDownloaded}
            className={`text-[10px] font-bold px-4 py-2 rounded-xl border transition-all flex items-center gap-2 ${
              allDownloaded 
              ? 'bg-emerald-500 text-white border-emerald-500' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 disabled:opacity-50'
            }`}
          >
            {allDownloaded ? '✓ Pack Offline' : isDownloadingAll ? `⏳ ${Math.round((downloadProgress.current / downloadProgress.total) * 100)}%` : '📥 Download All'}
          </button>
        </div>
        {isDownloadingAll && (
          <div className="w-full bg-emerald-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(downloadProgress.current / downloadProgress.total) * 100}%` }} />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
        {isQuizMode ? (
          quizFinished ? (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center w-full">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl ${((quizScore / quizQuestions.length) * 100) >= 75 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {((quizScore / quizQuestions.length) * 100) >= 75 ? '🎓' : '📚'}
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">{((quizScore / quizQuestions.length) * 100) >= 75 ? 'Lesson Passed!' : 'Need more practice'}</h2>
              <p className="text-slate-500 mb-6 font-medium">Score: <span className="font-bold text-slate-800">{(quizScore / quizQuestions.length) * 100}%</span></p>
              <button onClick={() => setView(AppView.DASHBOARD)} className="w-full max-w-xs bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg">Finish Lesson</button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-sm">
              <div className="w-full mb-8 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Q {currentQuizIndex + 1} of {quizQuestions.length}</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full"><div className="bg-emerald-500 h-full transition-all" style={{ width: `${((currentQuizIndex + 1) / quizQuestions.length) * 100}%` }} /></div>
              </div>
              <div className="bg-white border-2 border-slate-100 w-full p-10 rounded-[2.5rem] shadow-sm mb-8 text-center min-h-[200px] flex flex-col justify-center">
                <h3 className="text-3xl font-black text-emerald-600 leading-tight">{quizQuestions[currentQuizIndex].french}</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 w-full">
                {quizQuestions[currentQuizIndex].options.map((option, idx) => {
                  const isCorrect = option === quizQuestions[currentQuizIndex].correctEnglish;
                  const isSelected = option === selectedOption;
                  let btnClass = "bg-white border-slate-200 text-slate-700";
                  if (selectedOption) {
                    if (isCorrect) btnClass = "bg-emerald-500 border-emerald-500 text-white";
                    else if (isSelected) btnClass = "bg-red-500 border-red-500 text-white";
                    else btnClass = "opacity-40 grayscale";
                  }
                  return (
                    <button key={idx} disabled={!!selectedOption} onClick={() => handleQuizAnswer(option)} className={`w-full p-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-4 ${btnClass}`}>
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
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tap for English</p>
            </div>

            <div className="w-full max-w-sm aspect-[4/5] relative perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                <div className="absolute inset-0 bg-white border-2 border-slate-100 rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-8 [backface-visibility:hidden]">
                  <div className="absolute top-8 left-0 right-0 px-8 flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{currentCard.category}</span>
                    <button onClick={(e) => { e.stopPropagation(); downloadSpecificAudio(currentCard.french); }} className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase ${isCurrentlyCached ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 bg-slate-50'}`}>
                      {isCurrentlyCached ? '✓ Offline' : isCurrentlyIndividualDownloading ? '⏳ Saving' : '📥 Offline'}
                    </button>
                  </div>
                  <h3 className="text-4xl font-black text-slate-800 text-center leading-tight mb-8">{currentCard.french}</h3>
                  <button 
                    onClick={playAudio} 
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl relative overflow-hidden ${
                      isSpeaking ? 'bg-emerald-100 text-emerald-600 ring-4 ring-emerald-200' : isLoadingAudio ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {isLoadingAudio && <div className="absolute inset-0 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />}
                    <span className={`text-5xl ${isSpeaking ? 'animate-bounce' : ''}`}>{isSpeaking ? '🔊' : isLoadingAudio ? '⏳' : '▶️'}</span>
                  </button>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">
                    {isSpeaking ? 'Now Playing' : isLoadingAudio ? 'Loading Audio' : 'Hear Pronunciation'}
                  </p>
                </div>
                <div className="absolute inset-0 bg-emerald-600 border-2 border-white/20 rounded-[3rem] shadow-xl flex flex-col items-center justify-center p-8 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="text-emerald-100/50 text-[10px] font-bold uppercase mb-8">Meaning</span>
                  <h3 className="text-4xl font-black text-white text-center leading-tight">{currentCard.english}</h3>
                </div>
              </div>
            </div>

            <div className="mt-10 w-full max-w-sm">
              <button onClick={handleNext} className="w-full bg-slate-800 text-white py-5 rounded-[2.5rem] font-black text-lg shadow-xl active:scale-95 transition-all">
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
