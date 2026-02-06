
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call and success
    setTimeout(() => {
      const userData: User = {
        id: name.toLowerCase().replace(/\s+/g, '_'), // Generate a simple ID from name
        name: name,
        identifier: name, // Using name as the unique identifier for this simplified version
        college: 'Nursing Student' // Default placeholder
      };
      onLogin(userData);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-200 mb-6">
            <span className="text-4xl">🩺</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 px-4 leading-tight">Usher Academy Nurses French guide</h2>
          <p className="text-slate-500 mt-2 font-medium">Akwaaba! Let's get you exam-ready.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-5 border border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">
              {isLogin ? 'Full Name' : 'Enter Your Full Name'}
            </label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none font-medium" 
              placeholder="e.g. Nurse Kofi"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none font-medium" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !name || !password}
            className={`w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 ${isLoading || !name || !password ? 'opacity-70 grayscale' : ''}`}
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center space-y-4">
          <button 
            disabled={isLoading}
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-600 font-bold text-sm"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>

        <p className="text-center text-slate-400 text-[10px] font-medium leading-relaxed mt-4">
          By continuing, you agree to the Terms of Service. <br/>
          Progress is automatically synced to your cloud profile.
        </p>
      </div>
    </div>
  );
};

export default Auth;
