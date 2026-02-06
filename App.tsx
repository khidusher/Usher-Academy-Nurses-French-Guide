
import React, { useState, useEffect } from 'react';
import { AppView, UserProgress, User } from './types.ts';
import { NAVIGATION_ITEMS, LEVELS } from './constants.tsx';
import Dashboard from './views/Dashboard.tsx';
import Vocabulary from './views/Vocabulary.tsx';
import Grammar from './views/Grammar.tsx';
import ExamPractice from './views/ExamPractice.tsx';
import Leaderboard from './views/Leaderboard.tsx';
import Support from './views/Support.tsx';
import Auth from './views/Auth.tsx';
import EditProfile from './views/EditProfile.tsx';
import Profile from './views/Profile.tsx';
import OralSimulator from './views/OralSimulator.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedSession = localStorage.getItem('nursing_french_session');
      return savedSession ? JSON.parse(savedSession) : null;
    } catch (e) {
      console.error("Failed to parse session", e);
      return null;
    }
  });

  const [currentView, setCurrentView] = useState<AppView>(user ? AppView.DASHBOARD : AppView.AUTH);
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    streak: 3,
    completedLessons: [],
    badges: [],
    isSupporter: false
  });

  // Load user-specific progress when user changes
  useEffect(() => {
    if (user) {
      try {
        const savedProgress = localStorage.getItem(`progress_${user.id}`);
        if (savedProgress) {
          setProgress(JSON.parse(savedProgress));
        } else {
          setProgress({
            xp: 0,
            level: 1,
            streak: 1,
            completedLessons: [],
            badges: [],
            isSupporter: false
          });
        }
      } catch (e) {
        console.error("Failed to load progress", e);
      }
      
      if (currentView === AppView.AUTH) {
        setCurrentView(AppView.DASHBOARD);
      }
    } else {
      setCurrentView(AppView.AUTH);
    }
  }, [user]);

  // Save progress whenever it changes
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(`progress_${user.id}`, JSON.stringify(progress));
      } catch (e) {
        console.error("Failed to save progress", e);
      }
    }
  }, [progress, user]);

  const addXP = (amount: number) => {
    setProgress(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const markAsSupporter = (reference: string) => {
    setProgress(prev => ({
      ...prev,
      isSupporter: true,
      supportReference: reference,
      badges: [...new Set([...prev.badges, 'SUPPORTER'])]
    }));
  };

  const handleLogin = (userData: User) => {
    localStorage.setItem('nursing_french_session', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('nursing_french_session');
    setUser(null);
    setCurrentView(AppView.AUTH);
  };

  const handleUpdateUser = (updatedUser: User) => {
    localStorage.setItem('nursing_french_session', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setCurrentView(AppView.PROFILE);
  };

  const renderView = () => {
    if (!user && currentView !== AppView.AUTH) return <Auth onLogin={handleLogin} />;
    
    switch (currentView) {
      case AppView.AUTH: return <Auth onLogin={handleLogin} />;
      case AppView.DASHBOARD: return <Dashboard user={user} progress={progress} setView={setCurrentView} onLogout={handleLogout} />;
      case AppView.VOCABULARY: return <Vocabulary addXP={addXP} setView={setCurrentView} />;
      case AppView.GRAMMAR: return <Grammar addXP={addXP} setView={setCurrentView} />;
      case AppView.EXAM_PRACTICE: return <ExamPractice addXP={addXP} setView={setCurrentView} />;
      case AppView.LEADERBOARD: return <Leaderboard />;
      case AppView.SUPPORT: return <Support progress={progress} onSupport={markAsSupporter} />;
      case AppView.PROFILE: return <Profile user={user} progress={progress} setView={setCurrentView} onLogout={handleLogout} />;
      case AppView.EDIT_PROFILE: return user ? <EditProfile user={user} onUpdate={handleUpdateUser} onCancel={() => setCurrentView(AppView.PROFILE)} /> : <Auth onLogin={handleLogin} />;
      case AppView.ORAL_SIMULATOR: return <OralSimulator addXP={addXP} setView={setCurrentView} />;
      default: return <Dashboard user={user} progress={progress} setView={setCurrentView} onLogout={handleLogout} />;
    }
  };

  const isLearningView = [AppView.VOCABULARY, AppView.GRAMMAR, AppView.EXAM_PRACTICE, AppView.ORAL_SIMULATOR].includes(currentView);

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-white shadow-xl relative overflow-hidden border-x border-slate-200">
      {user && !isLearningView && currentView !== AppView.EDIT_PROFILE && currentView !== AppView.PROFILE && (
        <>
          <header className="bg-emerald-600 text-white p-4 flex justify-between items-center shrink-0">
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold tracking-tight flex items-center gap-1 whitespace-nowrap">
                Usher Academy Nurses French guide {progress.isSupporter && <span title="Supporter" className="text-xs">❤️</span>}
              </h1>
              <p className="text-[10px] opacity-90 truncate">{user.college || 'Ghana Nursing Prep'}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-emerald-700/50 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1">
                <span>🔥</span> {progress.streak}
              </div>
              <div className="bg-emerald-700/50 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1">
                <span>⭐</span> {progress.xp}
              </div>
            </div>
          </header>

          <div className="bg-emerald-50 px-4 py-2 flex items-center justify-between border-b border-emerald-100 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl">{LEVELS.find(l => l.id === progress.level)?.icon || '🩺'}</span>
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Level {progress.level}</p>
                <p className="text-xs text-emerald-600 font-medium leading-none">{LEVELS.find(l => l.id === progress.level)?.name || 'Nursing Student'}</p>
              </div>
            </div>
            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (progress.xp % 500) / 5)}%` }}
              />
            </div>
          </div>
        </>
      )}

      <main className={`flex-1 overflow-y-auto bg-white ${user && !isLearningView ? 'pb-16' : 'pb-0'}`}>
        {renderView()}
      </main>

      {user && currentView !== AppView.EDIT_PROFILE && !isLearningView && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t border-slate-200 flex justify-around p-1 z-50">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex-1 flex flex-col items-center py-1.5 px-1 rounded-xl transition-colors ${
                currentView === item.view ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:text-emerald-500'
              }`}
            >
              <span className="text-lg mb-0.5">{item.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default App;
