
import React from 'react';
import { UserProgress, AppView, User } from '../types';
import { WEEKLY_ROADMAP } from '../constants';

interface DashboardProps {
  user: User | null;
  progress: UserProgress;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, progress, setView, onLogout }) => {
  const currentWeekIdx = Math.min(Math.floor((progress?.completedLessons?.length || 0) / 2), 7);
  const currentWeek = WEEKLY_ROADMAP[currentWeekIdx];

  const handleLessonSelect = (idx: number) => {
    if (idx <= currentWeekIdx) {
      setView(AppView.VOCABULARY);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-2xl font-bold">Akwaaba, {user?.name?.split(' ')[0]}!</h2>
          </div>
          <p className="opacity-90 text-sm mb-4 leading-snug">You are ready to resume <strong>{currentWeek.title}</strong>.</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setView(AppView.VOCABULARY)}
              className="flex-1 bg-white text-emerald-600 px-4 py-3 rounded-2xl font-black text-sm shadow-sm hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
            >
              ▶️ Start Lesson
            </button>
            <button 
              onClick={() => setView(AppView.ORAL_SIMULATOR)}
              className="bg-emerald-400/40 text-white px-4 py-3 rounded-2xl font-black text-sm border border-white/20 hover:bg-emerald-400/60 transition-colors flex items-center justify-center gap-2"
            >
              💬 Chat Simulation
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <span className="text-9xl">🩺</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Vocabulary</p>
          <p className="text-xl font-black">124 / 500</p>
          <div className="w-full bg-blue-200 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-1/4 rounded-full" />
          </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Exam Prep</p>
          <p className="text-xl font-black">{Math.floor(((progress?.completedLessons?.length || 0) / (WEEKLY_ROADMAP.length * 2)) * 100) || 0}%</p>
          <div className="w-full bg-emerald-200 h-1 mt-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.max(5, ((progress?.completedLessons?.length || 0) / 16) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-slate-800">8-Week Roadmap</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Ghana Standard
          </span>
        </div>
        <div className="space-y-4 pb-10">
          {WEEKLY_ROADMAP.map((week, idx) => {
            const isCompleted = idx < currentWeekIdx;
            const isCurrent = idx === currentWeekIdx;
            const isLocked = idx > currentWeekIdx;
            return (
              <button 
                key={week.week}
                disabled={isLocked}
                onClick={() => handleLessonSelect(idx)}
                className={`w-full text-left flex gap-4 items-start relative transition-all active:scale-[0.98] ${isLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'opacity-100'}`}
              >
                <div className="flex flex-col items-center z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                    isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 
                    isCurrent ? 'bg-white border-emerald-500 text-emerald-500 shadow-md ring-4 ring-emerald-100' : 
                    'bg-slate-100 border-slate-300 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : isLocked ? '🔒' : week.week}
                  </div>
                  {idx !== WEEKLY_ROADMAP.length - 1 && (
                    <div className={`w-0.5 h-16 ${isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                  )}
                </div>
                <div className={`flex-1 p-4 rounded-2xl border ${
                  isCurrent ? 'bg-white border-emerald-100 shadow-sm ring-1 ring-emerald-50/50' : 
                  isCompleted ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50 border-slate-100'
                }`}>
                  <h4 className="font-bold text-slate-800 text-sm">{week.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {week.lessons.map(lesson => (
                      <span key={lesson} className="text-[9px] bg-slate-200/50 text-slate-600 px-2 py-0.5 rounded uppercase font-bold">
                        {lesson}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
