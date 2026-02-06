
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { AppView } from '../types.ts';
import { decode, decodeAudioData, createPCMBlob } from '../services/audioUtils.ts';

interface OralSimulatorProps {
  addXP: (amount: number) => void;
  setView: (view: AppView) => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const OralSimulator: React.FC<OralSimulatorProps> = ({ addXP, setView }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    addXP(30);
  };

  const startSession = async () => {
    setIsConnecting(true);
    setMessages([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPCMBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcription
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const userText = currentInputTranscription.current;
              const modelText = currentOutputTranscription.current;
              if (userText || modelText) {
                setMessages(prev => [
                  ...prev, 
                  ...(userText ? [{ role: 'user', text: userText } as ChatMessage] : []),
                  ...(modelText ? [{ role: 'model', text: modelText } as ChatMessage] : [])
                ]);
              }
              currentInputTranscription.current = '';
              currentOutputTranscription.current = '';
            }

            // Handle Audio Playback
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e) => console.error("Live API Error:", e),
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: `You are a patient in a Ghanaian hospital. Speak English with a local accent or occasionally simple French. 
          Scenario: You have come to the clinic with symptoms. Let the student nurse triage you. 
          Be realistic, occasionally express pain (e.g., 'Aie!', 'Ça fait mal!'). 
          Goal: Help the student practice clinical French. Keep responses concise.`
        }
      });
      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error("Failed to start oral session:", err);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sessionRef.current) sessionRef.current.close();
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
        <button onClick={() => { stopSession(); setView(AppView.DASHBOARD); }} className="p-2 hover:bg-emerald-700 rounded-full transition-colors">
          <span className="text-xl">←</span>
        </button>
        <h2 className="text-xs font-bold uppercase tracking-wider">Clinical Oral Lab</h2>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Scenario Header */}
        <div className="w-full text-center mb-6">
          <h2 className="text-xl font-black text-slate-800">Ghana Health Service Simulation</h2>
          <p className="text-xs text-slate-500 font-medium">Topic: Patient Triage & Assessment</p>
        </div>

        {/* Visualizer Area */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] relative">
          <div className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-700 relative z-10 ${
            isActive ? 'bg-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.3)] scale-110' : 'bg-white border-4 border-slate-100'
          }`}>
            <span className="text-7xl">{isActive ? '👴🏾' : '🎙️'}</span>
            
            {isActive && (
              <div className="absolute -bottom-4 bg-white px-4 py-1 rounded-full shadow-md border border-slate-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">
                  {isSpeaking ? 'Patient Speaking...' : 'Listening to Nurse...'}
                </p>
              </div>
            )}
          </div>

          {/* Waveform Animation */}
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-30">
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 bg-emerald-400 rounded-full transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`} 
                  style={{ 
                    height: isSpeaking ? `${20 + Math.random() * 60}%` : '10%',
                    animationDelay: `${i * 0.05}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Transcription Log */}
        <div className="bg-white rounded-[2rem] border-2 border-slate-100 p-6 shadow-sm min-h-[150px] max-h-[300px] overflow-y-auto mb-6 flex flex-col gap-3">
          {messages.length === 0 && !isActive && !isConnecting && (
            <p className="text-center text-slate-400 text-sm italic py-4">
              Tap start to begin your clinical oral assessment. Introduce yourself as the nurse in French.
            </p>
          )}
          {isConnecting && (
            <div className="flex items-center justify-center py-6 gap-3">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-slate-500">Connecting to Simulator...</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                msg.role === 'user' ? 'bg-emerald-50 text-emerald-800 rounded-tr-none' : 'bg-slate-50 text-slate-700 rounded-tl-none'
              }`}>
                <p className="text-[8px] uppercase font-black opacity-40 mb-1">{msg.role === 'user' ? 'Nurse (You)' : 'Patient'}</p>
                {msg.text}
              </div>
            </div>
          ))}
          <div id="anchor" className="h-1"></div>
        </div>

        {/* Controls */}
        <div className="pb-6">
          {!isActive ? (
            <button 
              disabled={isConnecting}
              onClick={startSession}
              className={`w-full bg-emerald-500 text-white py-5 rounded-[2.5rem] font-black text-xl shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95 transition-all ${isConnecting ? 'opacity-50 grayscale' : ''}`}
            >
              <span>▶️</span> Start Oral Exam
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="w-full bg-red-500 text-white py-5 rounded-[2.5rem] font-black text-xl shadow-xl shadow-red-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <span>⏹️</span> End Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OralSimulator;
