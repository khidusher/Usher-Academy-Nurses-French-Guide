
import React, { useState } from 'react';
import { User } from '../types';

interface EditProfileProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
  onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onUpdate, onCancel }) => {
  const [name, setName] = useState(user.name);
  const [college, setCollege] = useState(user.college || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate update
    setTimeout(() => {
      onUpdate({
        ...user,
        name,
        college
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col p-6 items-center justify-center">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 shadow-xl shadow-slate-200/50 mb-6">
            <span className="text-4xl">👤</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800">Edit Profile</h2>
          <p className="text-slate-500 mt-2 font-medium">Update your professional details.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-6 border border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none font-medium" 
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Nursing College</label>
            <input 
              type="text" 
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none font-medium" 
              placeholder="e.g. NMTC Korle-Bu"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Login ID (Fixed)</label>
            <input 
              type="text" 
              disabled
              value={user.identifier}
              className="w-full bg-slate-100 border-none rounded-2xl p-4 text-slate-400 font-medium cursor-not-allowed" 
            />
          </div>

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className={`flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70' : ''}`}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
