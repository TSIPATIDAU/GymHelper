
import React from 'react';
import { UserProfile, TrainingGoal, CreatinePhase } from '../types';
import { GOALS } from '../constants';
import { Weight, Target, User, FlaskConical, Droplets, Trophy, ChevronRight, Ruler, Sparkles } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

const Profile: React.FC<Props> = ({ profile, setProfile }) => {
  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile({ ...profile, ...data });
  };

  const calculateLevel = () => {
    const { weight, benchPR, squatPR, deadliftPR, gender } = profile;
    if (!weight || weight === 0) return { name: 'Noob', time: '0-6kk' };
    
    const benchRatio = benchPR / weight;
    const squatRatio = squatPR / weight;
    const deadliftRatio = deadliftPR / weight;

    if (gender === 'Mies') {
      if (benchRatio >= 2.25 && squatRatio >= 3 && deadliftRatio >= 3.5) return { name: 'Freak', time: '5-10+ vuotta' };
      if (benchRatio >= 2 && squatRatio >= 2.5 && deadliftRatio >= 3) return { name: 'Elite', time: '5-10+ vuotta' };
      if (benchRatio >= 1.5 && squatRatio >= 1.75 && deadliftRatio >= 2.25) return { name: 'Advanced', time: '5+ vuotta' };
      if (benchRatio >= 1 && squatRatio >= 1.25 && deadliftRatio >= 1.5) return { name: 'Intermediate', time: '2-5 vuotta' };
      if (benchRatio >= 0.75 && squatRatio >= 1 && deadliftRatio >= 1.25) return { name: 'Beginner', time: '0.5-2 vuotta' };
      return { name: 'Noob', time: '0-6kk' };
    } else {
      if (benchRatio >= 1.25 && squatRatio >= 2.25 && deadliftRatio >= 3) return { name: 'Freak', time: '5-10+ vuotta' };
      if (benchRatio >= 1 && squatRatio >= 1.75 && deadliftRatio >= 2.25) return { name: 'Elite', time: '5-10+ vuotta' };
      if (benchRatio >= 0.75 && squatRatio >= 1.5 && deadliftRatio >= 1.75) return { name: 'Advanced', time: '5+ vuotta' };
      if (benchRatio >= 0.5 && squatRatio >= 1 && deadliftRatio >= 1.25) return { name: 'Intermediate', time: '2-5 vuotta' };
      if (benchRatio >= 0.4 && squatRatio >= 0.75 && deadliftRatio >= 1) return { name: 'Beginner', time: '0.5-2 vuotta' };
      return { name: 'Noob', time: '0-6kk' };
    }
  };

  const getNextLevelStats = () => {
    const levels = ['Noob', 'Beginner', 'Intermediate', 'Advanced', 'Elite', 'Freak'];
    const current = calculateLevel().name;
    const currentIndex = levels.indexOf(current);
    if (currentIndex === levels.length - 1) return null;
    
    const nextLevel = levels[currentIndex + 1];
    const weight = profile.weight;
    let targetB = 0, targetS = 0, targetD = 0;

    if (profile.gender === 'Mies') {
      const ratios = {
        'Beginner': [0.75, 1, 1.25],
        'Intermediate': [1, 1.25, 1.5],
        'Advanced': [1.5, 1.75, 2.25],
        'Elite': [2, 2.5, 3],
        'Freak': [2.25, 3, 3.5]
      };
      [targetB, targetS, targetD] = (ratios as any)[nextLevel].map((r: number) => r * weight);
    } else {
      const ratios = {
        'Beginner': [0.4, 0.75, 1],
        'Intermediate': [0.5, 1, 1.25],
        'Advanced': [0.75, 1.5, 1.75],
        'Elite': [1, 1.75, 2.25],
        'Freak': [1.25, 2.25, 3]
      };
      [targetB, targetS, targetD] = (ratios as any)[nextLevel].map((r: number) => r * weight);
    }

    return {
      name: nextLevel,
      bench: Math.max(0, targetB - profile.benchPR),
      squat: Math.max(0, targetS - profile.squatPR),
      deadlift: Math.max(0, targetD - profile.deadliftPR)
    };
  };

  const handleReset = () => {
    if (window.confirm("Haluatko varmasti nollata kaikki tiedot ja aloittaa kyselyn alusta?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const levelInfo = calculateLevel();
  const nextStats = getNextLevelStats();

  return (
    <div className="space-y-8 pb-32 custom-scrollbar animate-in fade-in duration-500">
      <header className="text-center py-8">
        <div className="w-28 h-28 bg-slate-900 rounded-[40px] flex items-center justify-center mx-auto mb-6 text-white shadow-2xl rotate-3">
          <User size={54} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{profile.name}</h1>
        <div className="flex justify-center gap-2 mt-4">
          <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-600 px-4 py-2 rounded-full tracking-widest">{profile.experience}</span>
          <span className="text-[10px] font-black uppercase bg-slate-900 text-white px-4 py-2 rounded-full tracking-widest">{levelInfo.name}</span>
        </div>
      </header>

      {/* SBD Assessment Section */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] ml-6">SBD Tason Arviointi</h2>
        <div className="bg-white border-4 border-slate-50 rounded-[44px] p-8 shadow-xl space-y-6">
          <div className="space-y-4">
            {[
              { label: 'Penkki', val: profile.benchPR, key: 'benchPR' },
              { label: 'Kyykky', val: profile.squatPR, key: 'squatPR' },
              { label: 'Maastaveto', val: profile.deadliftPR, key: 'deadliftPR' }
            ].map(stat => (
              <div key={stat.key} className="flex items-center gap-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider w-24 shrink-0">{stat.label}</label>
                <div className="flex-1">
                   <input 
                    type="number" 
                    value={stat.val || ''} 
                    onChange={e => updateProfile({ [stat.key]: parseFloat(e.target.value) || 0 })} 
                    className="w-full bg-slate-50 rounded-[24px] py-5 text-center font-black text-slate-900 border-2 border-slate-200 focus:border-blue-600 outline-none transition-all" 
                    placeholder="0" 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 rounded-[32px] p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500 rounded-2xl"><Trophy size={24} /></div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tasosi</span>
                <h4 className="text-xl font-black tracking-tight">{levelInfo.name} <span className="text-xs text-slate-500 font-bold ml-1 uppercase">{levelInfo.time}</span></h4>
              </div>
            </div>
            {nextStats && (
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2"><Sparkles size={12}/> Seuraava taso: {nextStats.name}</p>
                <div className="grid grid-cols-1 space-y-1 text-[11px] font-black">
                  <div className="flex justify-between"><span>Penkki:</span> <span className="text-blue-300">+{nextStats.bench.toFixed(1)}kg</span></div>
                  <div className="flex justify-between"><span>Kyykky:</span> <span className="text-blue-300">+{nextStats.squat.toFixed(1)}kg</span></div>
                  <div className="flex justify-between"><span>Maastaveto:</span> <span className="text-blue-300">+{nextStats.deadlift.toFixed(1)}kg</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] ml-6">Perustiedot</h2>
        <div className="bg-white border-4 border-slate-50 rounded-[44px] overflow-hidden shadow-xl divide-y divide-slate-100">
          <div className="p-7 flex items-center justify-between">
            <div className="flex items-center gap-4"><div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Weight size={20} /></div><span className="text-base font-black text-slate-900">Paino</span></div>
            <div className="flex items-center gap-2"><input type="number" value={profile.weight || ''} onChange={e => updateProfile({weight: parseFloat(e.target.value) || 0})} className="w-20 text-right font-black text-slate-900 bg-transparent outline-none text-xl" /><span className="text-sm font-bold text-slate-300">kg</span></div>
          </div>
          <div className="p-7 flex items-center justify-between">
            <div className="flex items-center gap-4"><div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Ruler size={20} /></div><span className="text-base font-black text-slate-900">Pituus</span></div>
            <div className="flex items-center gap-2"><input type="number" value={profile.height || ''} onChange={e => updateProfile({height: parseFloat(e.target.value) || 0})} className="w-20 text-right font-black text-slate-900 bg-transparent outline-none text-xl" /><span className="text-sm font-bold text-slate-300">cm</span></div>
          </div>
          <div className="p-7 flex items-center justify-between">
            <div className="flex items-center gap-4"><div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Target size={20} /></div><span className="text-base font-black text-slate-900">Tavoite</span></div>
            <select value={profile.goal} onChange={e => updateProfile({goal: e.target.value as TrainingGoal})} className="text-sm font-black text-slate-900 bg-transparent outline-none appearance-none pr-2">{GOALS.map(g => <option key={g} value={g}>{g}</option>)}</select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] ml-6">Lisäravinteet & Nesteet</h2>
        <div className="bg-white border-4 border-slate-50 rounded-[44px] p-8 shadow-xl space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4"><div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><FlaskConical size={20} /></div><span className="text-base font-black text-slate-900">Kreatiini</span></div>
              <button 
                onClick={() => updateProfile({creatine: {...profile.creatine, enabled: !profile.creatine.enabled}})} 
                className={`w-14 h-8 rounded-full transition-all relative border-2 border-slate-400 ${profile.creatine.enabled ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${profile.creatine.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
            {profile.creatine.enabled && (
              <div className="space-y-6 animate-in slide-in-from-top-4">
                <div className="grid grid-cols-2 gap-2">
                  {(['Tankkaus', 'Ylläpito'] as CreatinePhase[]).map(phase => (
                    <button 
                      key={phase} 
                      onClick={() => updateProfile({creatine: {...profile.creatine, phase}})}
                      className={`py-4 rounded-[20px] font-black text-[10px] uppercase tracking-widest border-2 transition-all ${profile.creatine.phase === phase ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}
                    >
                      {phase}
                    </button>
                  ))}
                </div>
                {profile.creatine.phase === 'Tankkaus' && (
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-[24px]">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Annostus</span>
                    <div className="flex gap-2">
                      {[20, 10, 5].map(s => (
                        <button key={s} onClick={() => updateProfile({creatine: {...profile.creatine, speed: s as any}})} className={`w-12 h-12 rounded-xl font-black text-sm flex items-center justify-center transition-all ${profile.creatine.speed === s ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}>{s}g</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-8">
            <div className="flex items-center gap-4"><div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Droplets size={20} /></div><span className="text-base font-black text-slate-900">Vesiseuranta</span></div>
            <button 
              onClick={() => updateProfile({waterTrackingEnabled: !profile.waterTrackingEnabled})} 
              className={`w-14 h-8 rounded-full transition-all relative border-2 border-slate-400 ${profile.waterTrackingEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${profile.waterTrackingEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          {profile.waterTrackingEnabled && !profile.creatine.enabled && (
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] animate-in fade-in">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Päivätavoite</span>
              <div className="flex items-center gap-2">
                <input type="number" step="0.5" value={profile.waterIntake} onChange={e => updateProfile({waterIntake: parseFloat(e.target.value) || 0})} className="w-16 text-right font-black text-blue-600 bg-transparent outline-none text-xl" />
                <span className="text-xs font-black text-slate-300">L</span>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <div className="px-6">
        <button 
          onClick={handleReset} 
          className="w-full py-7 text-[11px] font-black text-rose-300 uppercase tracking-[0.4em] border-4 border-dashed border-rose-50 rounded-[32px] hover:border-rose-200 transition-colors"
        >
          Nollaa Sovellus
        </button>
      </div>
    </div>
  );
};

export default Profile;
