
import React from 'react';
import { User, UserProgress, AppView } from '../types';
import { LEVELS } from '../constants';

interface ProfileProps {
  user: User | null;
  progress: UserProgress;
  setView: (view: AppView) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, progress, setView, onLogout }) => {
  const currentLevel = LEVELS.find(l => l.id === progress.level) || LEVELS[0];

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Profile Header */}
      <div className="bg-emerald-600 text-white p-8 pt-12 pb-16 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 text-6xl">🏥</div>
          <div className="absolute bottom-10 right-10 text-6xl">🩺</div>
        </div>
        
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl shadow-xl relative z-10 border-4 border-emerald-400">
           {currentLevel.icon}
        </div>
        
        <h2 className="text-2xl font-black mt-4 relative z-10">{user?.name}</h2>
        <p className="text-emerald-100 font-medium text-sm relative z-10">{user?.college || 'Nursing Student'}</p>
        
        <div className="mt-6 flex gap-4 relative z-10">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl text-center border border-white/10 min-w-[70px]">
            <p className="text-[10px] uppercase font-bold text-emerald-100">Level</p>
            <p className="text-lg font-black">{progress.level}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl text-center border border-white/10 min-w-[70px]">
            <p className="text-[10px] uppercase font-bold text-emerald-100">XP</p>
            <p className="text-lg font-black">{progress.xp}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl text-center border border-white/10 min-w-[70px]">
            <p className="text-[10px] uppercase font-bold text-emerald-100">Streak</p>
            <p className="text-lg font-black">{progress.streak}d</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white -mt-8 rounded-t-[3rem] p-6 shadow-2xl relative z-20 space-y-8 pb-32">
        
        {/* Achievements Section */}
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Achievements</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {progress.badges.length > 0 ? (
              progress.badges.map(badge => (
                <div key={badge} className="flex-shrink-0 flex flex-col items-center gap-1 bg-slate-50 p-4 rounded-3xl border border-slate-100 min-w-[90px] shadow-sm">
                  <span className="text-2xl">{badge === 'SUPPORTER' ? '❤️' : '🎖️'}</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase">{badge}</span>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 font-medium italic">Complete clinical exams to earn badges!</p>
              </div>
            )}
          </div>
        </section>

        {/* Exam History Section */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Clinical Exam History</h3>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg uppercase tracking-tight">Records: {progress.examRecords.length}</span>
          </div>
          <div className="space-y-3">
            {progress.examRecords.length > 0 ? (
              progress.examRecords.map((record, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ${record.score >= 7 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {record.score >= 7 ? '✅' : '📑'}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 capitalize">{record.lessonId.replace(/_/g, ' ')}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                        {new Date(record.date).toLocaleDateString()} • {record.timeSpent ? `${Math.floor(record.timeSpent / 60)}m ${record.timeSpent % 60}s` : 'Timed'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-black ${record.score >= 7 ? 'text-emerald-600' : 'text-slate-600'}`}>{record.score}/10</p>
                    <p className="text-[8px] font-black text-slate-300 uppercase">Score</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-medium italic">No exam records yet. Visit the Exams tab!</p>
              </div>
            )}
          </div>
        </section>

        {/* Account Settings */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Account</h3>
          
          <button 
            onClick={() => setView(AppView.EDIT_PROFILE)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-emerald-50 hover:border-emerald-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">✏️</span>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800">Professional Identity</p>
                <p className="text-[10px] text-slate-500">Update name and nursing college</p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-emerald-400 transition-colors">▶</span>
          </button>

          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 group hover:bg-red-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">🚪</span>
              <div className="text-left">
                <p className="text-sm font-bold text-red-600">Sign Out</p>
                <p className="text-[10px] text-red-400">Exit your current session</p>
              </div>
            </div>
          </button>
        </section>

        {/* Version Info */}
        <div className="text-center pt-8 pb-4">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Usher Academy Nurses French v1.8</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-slate-300 font-medium">Cloud Sync Enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
