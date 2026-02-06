
import React, { useState } from 'react';
import { UserProgress } from '../types';
// Fixed: MOMO_DETAILS is exported from constants, not types.
import { MOMO_DETAILS as CONST_MOMO } from '../constants';

interface SupportProps {
  progress: UserProgress;
  onSupport: (reference: string) => void;
}

const Support: React.FC<SupportProps> = ({ progress, onSupport }) => {
  const [step, setStep] = useState<'INITIAL' | 'INSTRUCTIONS' | 'CONFIRM'>(progress.isSupporter ? 'CONFIRM' : 'INITIAL');
  const [reference, setReference] = useState('');
  const [copied, setCopied] = useState(false);

  const copyNumber = () => {
    navigator.clipboard.writeText(CONST_MOMO.number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleComplete = () => {
    if (reference.trim().length < 5) {
      alert("Please enter a valid transaction ID or reference for verification.");
      return;
    }
    onSupport(reference);
    setStep('CONFIRM');
  };

  if (step === 'CONFIRM' || progress.isSupporter) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-4xl shadow-inner">
          ❤️
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Thank You, Supporter!</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your contribution of <strong>{CONST_MOMO.amount}</strong> helps sustain the development and hosting of this platform for nursing colleges across Ghana.
          </p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 w-full max-w-xs">
          <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Badge Unlocked</p>
          <div className="flex items-center justify-center gap-2 font-bold text-emerald-800">
             <span className="text-xl">🎖️</span> Creator Supporter
          </div>
        </div>
        {progress.supportReference && (
          <p className="text-[10px] text-slate-400 font-mono">Ref: {progress.supportReference}</p>
        )}
      </div>
    );
  }

  if (step === 'INSTRUCTIONS') {
    return (
      <div className="p-4 space-y-6">
        <div className="bg-yellow-400 p-6 rounded-3xl text-slate-900 shadow-lg flex flex-col items-center">
          <span className="text-4xl mb-2">📲</span>
          <h3 className="font-black text-xl">MTN Mobile Money</h3>
        </div>

        <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 space-y-4">
          <h4 className="font-bold text-slate-800 border-b pb-2">How to Support</h4>
          <ol className="text-sm text-slate-600 space-y-3 list-decimal list-inside font-medium">
            <li>Dial <span className="font-bold text-slate-900">*170#</span> on your phone.</li>
            <li>Choose <span className="text-slate-900">1) Transfer Money</span>.</li>
            <li>Select <span className="text-slate-900">1) MoMo User</span>.</li>
            <li className="flex items-center gap-2 flex-wrap">
              Enter number: <span className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-900">{CONST_MOMO.number}</span>
              <button onClick={copyNumber} className="text-[10px] bg-emerald-500 text-white px-2 py-1 rounded-md active:scale-95">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </li>
            <li>Confirm Name: <span className="font-bold text-slate-900">{CONST_MOMO.name}</span>.</li>
            <li>Enter Amount: <span className="font-bold text-slate-900">{CONST_MOMO.amount}</span>.</li>
            <li>Enter your MoMo PIN & Complete.</li>
          </ol>
        </div>

        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Transaction Reference / ID</label>
          <input 
            type="text" 
            placeholder="Enter MoMo Ref ID"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full bg-slate-100 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700"
          />
          <button 
            onClick={handleComplete}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-all"
          >
            I've Completed Payment
          </button>
          <button 
            onClick={() => setStep('INITIAL')}
            className="w-full text-slate-400 font-bold text-xs py-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-emerald-100 rounded-3xl text-4xl mb-4">🤝🏽</div>
        <h2 className="text-3xl font-black text-slate-800">Support the Creator</h2>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
          If this app is helping your nursing studies, consider a one-time <strong>₵50</strong> MTN MoMo contribution.
        </p>
        <p className="text-[11px] text-amber-600 font-bold bg-amber-50 px-3 py-2 rounded-xl">
          ⚠️ This is 100% voluntary. No features are locked.
        </p>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={() => setStep('INSTRUCTIONS')}
          className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-bold text-xl shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          Support with MoMo ₵50
        </button>
        <button 
          onClick={() => window.history.back()}
          className="w-full text-slate-400 font-bold text-sm py-2"
        >
          Maybe Later
        </button>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 w-full">
        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 text-center">Your Support Helps:</h4>
        <ul className="space-y-2">
          <li className="text-xs text-slate-600 flex gap-2"><span>✅</span> Keep the app online and ad-free</li>
          <li className="text-xs text-slate-600 flex gap-2"><span>✅</span> Fund new clinical scenarios</li>
          <li className="text-xs text-slate-600 flex gap-2"><span>✅</span> Support Ghanaian ed-tech development</li>
        </ul>
      </div>
    </div>
  );
};

export default Support;
