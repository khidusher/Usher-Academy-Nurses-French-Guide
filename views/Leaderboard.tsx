
import React, { useState } from 'react';
import { User, UserProgress } from '../types';

interface LeaderboardProps {
  user: User | null;
  progress: UserProgress;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ user, progress }) => {
  const [activeTab, setActiveTab] = useState<'NURSES' | 'COLLEGES'>('NURSES');

  // Fixed: Added isUser: false to all mock rankings to ensure consistent types for display
  const nurseRankings = [
    { name: "Abena Mansa", xp: 4250, college: "NMTC Korle-Bu", rank: 1, avatar: "👩🏾‍⚕️", isUser: false },
    { name: "Kofi Asante", xp: 3820, college: "UHAS Ho", rank: 2, avatar: "👨🏾‍⚕️", isUser: false },
    { name: "Ama Serwaa", xp: 3100, college: "NMTC Kumasi", rank: 3, avatar: "👩🏾‍⚕️", isUser: false },
    { name: "Suleiman Ali", xp: 2850, college: "Tamale Nursing Col.", rank: 4, avatar: "👨🏾‍⚕️", isUser: false },
    { name: "Grace Osei", xp: 2420, college: "Central University", rank: 5, avatar: "👩🏾‍⚕️", isUser: false },
  ];

  const collegeRankings = [
    { name: "NMTC Korle-Bu", xp: 45200, rank: 1, students: 124, icon: "🏛️" },
    { name: "UHAS Ho", xp: 41800, rank: 2, students: 98, icon: "🎓" },
    { name: "NMTC Kumasi", xp: 39500, rank: 3, students: 110, icon: "🏥" },
    { name: "Legon Nursing", xp: 32100, rank: 4, students: 76, icon: "📘" },
  ];

  // Insert current user into the ranking
  const currentUserRank = nurseRankings.filter(n => n.xp > progress.xp).length + 1;
  const displayNurses = [
    ...nurseRankings.slice(0, 4),
    { name: user?.name || "You", xp: progress.xp, college: user?.college || "Nursing Student", rank: currentUserRank, avatar: "🩺", isUser: true }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 bg-white border-b border-slate-100 shrink-0">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-800">Top Prep Nurses</h2>
          <p className="text-sm text-slate-500 font-medium">Weekly Ghana Nursing Leaderboard</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('NURSES')}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'NURSES' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
          >
            Individual
          </button>
          <button 
            onClick={() => setActiveTab('COLLEGES')}
            className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'COLLEGES' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
          >
            Colleges
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {activeTab === 'NURSES' && (
          <>
            {/* Top 3 Podium */}
            <div className="flex justify-around items-end mb-12 h-44 pt-4">
              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">👨🏾‍⚕️</span>
                <div className="bg-slate-200 w-20 h-24 rounded-t-3xl relative flex flex-col items-center justify-center p-2 text-center border-t-4 border-slate-300">
                  <span className="text-slate-500 text-xs font-black">2nd</span>
                  <p className="text-[10px] font-black text-slate-700 leading-tight">Kofi</p>
                  <p className="text-[8px] font-bold text-slate-400 mt-1">3.8k XP</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center scale-110">
                <div className="relative">
                  <span className="text-5xl mb-2 block">👩🏾‍⚕️</span>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl">👑</div>
                </div>
                <div className="bg-emerald-500 w-24 h-32 rounded-t-3xl relative flex flex-col items-center justify-center p-2 text-center shadow-xl shadow-emerald-100 border-t-4 border-emerald-400">
                  <span className="text-white text-xs font-black">1st</span>
                  <p className="text-[10px] font-black text-white leading-tight">Abena</p>
                  <p className="text-[8px] font-bold text-emerald-100 mt-1">4.2k XP</p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-4xl mb-2">👩🏾‍⚕️</span>
                <div className="bg-amber-100 w-20 h-20 rounded-t-3xl relative flex flex-col items-center justify-center p-2 text-center border-t-4 border-amber-200">
                  <span className="text-amber-600 text-xs font-black">3rd</span>
                  <p className="text-[10px] font-black text-amber-800 leading-tight">Ama</p>
                  <p className="text-[8px] font-bold text-amber-400 mt-1">3.1k XP</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {displayNurses.map((nurse, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                    nurse.isUser ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-100 scale-[1.02]' : 'bg-white border-slate-100 hover:border-emerald-200'
                  }`}
                >
                  <span className={`text-[10px] font-black w-6 text-center ${nurse.isUser ? 'text-emerald-200' : 'text-slate-400'}`}>
                    #{nurse.rank}
                  </span>
                  <span className="text-2xl">{nurse.avatar}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm truncate">{nurse.name} {nurse.isUser && "(You)"}</h4>
                    <p className={`text-[10px] font-bold uppercase tracking-tight ${nurse.isUser ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {nurse.college}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ${nurse.isUser ? 'text-white' : 'text-emerald-600'}`}>{nurse.xp}</p>
                    <p className={`text-[8px] font-bold uppercase ${nurse.isUser ? 'text-emerald-200' : 'text-slate-300'}`}>XP</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'COLLEGES' && (
          <>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] text-white shadow-xl mb-6 relative overflow-hidden">
               <div className="relative z-10">
                 <h4 className="text-lg font-black mb-1">College Battleground ⚔️</h4>
                 <p className="text-xs text-blue-100 mb-4 leading-relaxed font-medium">Earn XP to move your college up the national ranking. The top college wins extra MoMo scholarships!</p>
                 <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                        <span>{user?.college || "Your College"}</span>
                        <span>Next Rank: +1.2k XP</span>
                      </div>
                      <div className="w-full bg-blue-900/40 h-2 rounded-full overflow-hidden">
                        <div className="bg-white h-full w-2/3 rounded-full" />
                      </div>
                    </div>
                 </div>
               </div>
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <span className="text-9xl">🎓</span>
               </div>
            </div>

            <div className="space-y-3">
              {collegeRankings.map((college, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 transition-colors ${
                    college.name === user?.college ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                >
                  <span className="text-[10px] font-black text-slate-400 w-6 text-center">#{college.rank}</span>
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl shadow-sm border border-slate-100">
                    {college.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{college.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      {college.students} Studying Nurses
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-blue-600">{(college.xp / 1000).toFixed(1)}k</p>
                    <p className="text-[8px] font-bold text-slate-300 uppercase">Total XP</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 bg-amber-50 p-6 rounded-[2rem] border border-amber-100 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">🏆</span>
            <h4 className="font-black text-amber-800 text-sm">Season 1: Clinical Mastery</h4>
          </div>
          <p className="text-[10px] text-amber-700 font-bold leading-relaxed">Top 10 nurses at the end of May will receive the <span className="underline">Usher Academy Excellence Badge</span> and ₵50 data bundle.</p>
          <div className="pt-2">
            <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest">Resets in: 4d 12h 30m</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
