
import React from 'react';

const Leaderboard: React.FC = () => {
  const users = [
    { name: "Abena Mansa", xp: 4250, college: "NMTC Korle-Bu", rank: 1, avatar: "👩🏾‍⚕️" },
    { name: "Kofi Asante", xp: 3820, college: "UHAS Ho", rank: 2, avatar: "👨🏾‍⚕️" },
    { name: "You", xp: 2150, college: "NMTC Kumasi", rank: 12, avatar: "🩺" },
    { name: "Efua Boateng", xp: 1980, college: "Accra School of Hygiene", rank: 13, avatar: "👩🏾‍⚕️" },
  ];

  return (
    <div className="p-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-800">Top Prep Nurses</h2>
        <p className="text-sm text-slate-500">Global ranking across Ghana's Nursing Colleges.</p>
      </div>

      {/* Top 3 Podiums */}
      <div className="flex justify-around items-end mb-12 h-40">
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2">👨🏾‍⚕️</span>
          <div className="bg-slate-200 w-20 h-24 rounded-t-xl relative flex flex-col items-center justify-center p-2 text-center">
            <span className="text-slate-400 text-xs font-bold">2nd</span>
            <p className="text-[10px] font-bold text-slate-600 leading-tight">Kofi</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl mb-2">👩🏾‍⚕️</span>
          <div className="bg-emerald-500 w-24 h-32 rounded-t-xl relative flex flex-col items-center justify-center p-2 text-center shadow-lg">
            <span className="text-white text-xs font-bold">1st</span>
            <p className="text-[10px] font-bold text-white leading-tight">Abena</p>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">👑</div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-4xl mb-2">👩🏾‍⚕️</span>
          <div className="bg-amber-100 w-20 h-20 rounded-t-xl relative flex flex-col items-center justify-center p-2 text-center">
            <span className="text-amber-600 text-xs font-bold">3rd</span>
            <p className="text-[10px] font-bold text-amber-700 leading-tight">Ama</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {users.map((user, idx) => (
          <div 
            key={idx}
            className={`flex items-center gap-4 p-4 rounded-2xl border ${
              user.name === "You" ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-100' : 'bg-white border-slate-100'
            }`}
          >
            <span className="text-sm font-black text-slate-400 w-6 text-center">{user.rank}</span>
            <span className="text-2xl">{user.avatar}</span>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase">{user.college}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-emerald-600">{user.xp}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase">XP</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
        <h4 className="font-bold text-blue-800 mb-2">Class Challenge Active! 🏆</h4>
        <p className="text-xs text-blue-600 mb-4">Kumasi NMTC needs 500 more XP to beat Legon School of Nursing this week.</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-xs shadow-md">
          Contribute XP
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
