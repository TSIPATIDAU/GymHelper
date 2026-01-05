
import React, { useState } from 'react';
import { UserProfile, TrainingGoal, ExperienceLevel, UserStatus, Gender } from '../types';
import { GOALS, GOAL_DESCRIPTIONS } from '../constants';
import { ChevronRight } from 'lucide-react';

interface Props {
  onComplete: (profile: Omit<UserProfile, 'onboarded'>) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Omit<UserProfile, 'onboarded'>>({
    name: '', age: 25, weight: 75, height: 180, gender: 'Mies',
    goal: 'Kehonmuokkaus', weeklyTarget: 3, experience: 'Aloittelija',
    status: 'Uusi tulokas', gymDuration: '', breakDuration: '', preBreakDuration: '',
    creatine: { enabled: false, phase: 'Ylläpito', speed: 5, dailyIntake: 0 },
    waterIntake: 2.5, waterTrackingEnabled: true, coachName: 'Aino', coachType: 'aino',
    benchPR: 0, squatPR: 0, deadliftPR: 0, tutorialStep: 0
  });

  const next = () => setStep(s => s + 1);

  return (
    <div className="max-w-md mx-auto min-h-screen p-6 bg-white flex flex-col font-['Inter']">
      <div className="flex-1 overflow-y-auto pb-8 custom-scrollbar">
        <div className="mb-10">
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(step / 7) * 100}%` }} />
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Moi! <br/>Kuka olet?</h1>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Sukupuoli</label>
                <div className="flex gap-4">
                  {(['Mies', 'Nainen'] as Gender[]).map(g => (
                    <button key={g} onClick={() => setProfile({...profile, gender: g})} className={`flex-1 p-5 rounded-[24px] font-black border-4 transition-all ${profile.gender === g ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-300 bg-slate-50 text-slate-400'}`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Nimesi</label>
                <input type="text" className="w-full p-5 bg-slate-50 border-2 border-slate-600 rounded-[24px] font-bold text-slate-900 outline-none focus:border-blue-600" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Ikä</label>
                  <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-600 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-600 text-center" value={profile.age || ''} onChange={e => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Paino</label>
                  <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-600 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-600 text-center" value={profile.weight || ''} onChange={e => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Pituus</label>
                  <input type="number" className="w-full p-4 bg-slate-50 border-2 border-slate-600 rounded-[20px] font-bold text-slate-900 outline-none focus:border-blue-600 text-center" value={profile.height || ''} onChange={e => setProfile({ ...profile, height: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Nykyinen tila</h1>
            <div className="space-y-4">
              {(['Aktiivinen', 'Tauolta palannut', 'Uusi tulokas'] as UserStatus[]).map(status => (
                <div key={status} className="space-y-3">
                  <button onClick={() => setProfile({ ...profile, status: status })} className={`w-full p-6 rounded-[28px] border-4 text-left transition-all ${profile.status === status ? 'border-blue-600 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}><div className="font-black text-slate-900 text-lg">{status}</div></button>
                  {profile.status === status && status === 'Aktiivinen' && (
                    <input type="text" placeholder="Kauanko olet treenannut aktiivisesti?" className="w-full p-4 bg-slate-50 border-2 border-slate-600 rounded-[20px] font-bold text-slate-900 outline-none mb-4" value={profile.gymDuration} onChange={e => setProfile({...profile, gymDuration: e.target.value})} />
                  )}
                  {profile.status === status && status === 'Tauolta palannut' && (
                    <div className="space-y-3 pl-4 border-l-4 border-blue-200">
                      <input type="text" placeholder="Kauanko tauko kesti?" className="w-full p-4 bg-slate-50 border-2 border-slate-600 rounded-[20px] font-bold text-slate-900 outline-none" value={profile.breakDuration} onChange={e => setProfile({...profile, breakDuration: e.target.value})} />
                      <input type="text" placeholder="Kauan treenasit ennen taukoa?" className="w-full p-4 bg-slate-50 border-2 border-slate-600 rounded-[20px] font-bold text-slate-900 outline-none" value={profile.preBreakDuration} onChange={e => setProfile({...profile, preBreakDuration: e.target.value})} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Treenitausta</h1>
            <div className="space-y-3">
              {(['Aloittelija', 'Keskitaso', 'Kokenut', 'Todella kokenut'] as ExperienceLevel[]).map(level => (
                <button key={level} onClick={() => setProfile({ ...profile, experience: level })} className={`w-full p-6 rounded-[28px] border-4 text-left transition-all ${profile.experience === level ? 'border-blue-600 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}><div className="font-black text-slate-900 text-lg">{level}</div></button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Päätavoite</h1>
            <div className="space-y-3">
              {GOALS.map(goal => (
                <button key={goal} onClick={() => setProfile({ ...profile, goal })} className={`w-full p-6 rounded-[28px] border-4 text-left transition-all ${profile.goal === goal ? 'border-blue-600 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}><div className="font-black text-slate-900 text-lg">{goal}</div><div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{GOAL_DESCRIPTIONS[goal]}</div></button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 flex flex-col items-center">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight text-center">Treenipäivät <br/>viikossa</h1>
            <div className="flex flex-col items-center gap-6 mt-8">
              <div className="flex flex-col gap-2 w-20 bg-slate-100 rounded-[32px] p-2">
                {[7, 6, 5, 4, 3, 2, 1].map(n => (
                  <button key={n} onClick={() => setProfile({...profile, weeklyTarget: n})} className={`w-full h-12 rounded-2xl font-black transition-all ${profile.weeklyTarget === n ? 'bg-blue-600 text-white shadow-xl scale-110' : 'text-slate-400 hover:bg-slate-200'}`}>{n}</button>
                ))}
              </div>
              <div className="text-5xl font-black text-blue-600">{profile.weeklyTarget}<span className="text-lg block text-slate-300 uppercase tracking-widest text-center mt-2">Päivää</span></div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-8">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Lisäravinteet</h1>
            <div className="bg-slate-50 p-8 rounded-[40px] space-y-6 border-4 border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-slate-900">Kreatiini</span>
                <button onClick={() => setProfile({...profile, creatine: {...profile.creatine, enabled: !profile.creatine.enabled}})} className={`w-16 h-8 rounded-full transition-all relative ${profile.creatine.enabled ? 'bg-blue-600' : 'bg-slate-300'} border-2 border-slate-400`}>
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all shadow-md ${profile.creatine.enabled ? 'left-8.5' : 'left-0.5'}`} />
                </button>
              </div>
              {profile.creatine.enabled && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    {['Tankkaus', 'Ylläpito'].map(p => (
                      <button key={p} onClick={() => setProfile({...profile, creatine: {...profile.creatine, phase: p as any}})} className={`py-3 rounded-2xl font-black text-xs uppercase ${profile.creatine.phase === p ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}>{p}</button>
                    ))}
                  </div>
                  {profile.creatine.phase === 'Tankkaus' && (
                    <div className="grid grid-cols-3 gap-2">
                      {[20, 10, 5].map(s => (
                        <button key={s} onClick={() => setProfile({...profile, creatine: {...profile.creatine, speed: s as any}})} className={`py-3 rounded-xl font-black text-xs ${profile.creatine.speed === s ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>{s}g</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-8 animate-in fade-in">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tutorial</h1>
            <p className="text-slate-500 font-bold leading-relaxed">Haluatko lyhyen opastuksen sovelluksen käyttöön?</p>
            <div className="space-y-3">
              <button 
                onClick={() => onComplete({...profile, tutorialStep: 1})} 
                className="w-full p-6 bg-blue-600 text-white rounded-[28px] font-black text-lg shadow-xl shadow-blue-100 active:scale-95 transition-all"
              >
                Kyllä, näytä tutorial
              </button>
              <button 
                onClick={() => onComplete({...profile, tutorialStep: -1})} 
                className="w-full p-6 bg-slate-50 text-slate-400 rounded-[28px] font-black text-lg active:scale-95 transition-all"
              >
                Ei kiitos, osaan jo
              </button>
            </div>
          </div>
        )}
      </div>

      {step < 7 && (
        <button
          onClick={next}
          disabled={step === 1 && (!profile.name || !profile.gender)}
          className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black flex items-center justify-center gap-3 hover:bg-black disabled:opacity-50 transition-all shadow-2xl active:scale-95 mt-4"
        >
          Seuraava <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default Onboarding;
