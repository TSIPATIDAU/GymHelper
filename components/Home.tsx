
import React from 'react';
import { AppState } from '../types';
import { Sparkles, Calendar, Droplets, FlaskConical, Plus, CheckCircle2, Dumbbell, Footprints, Coffee } from 'lucide-react';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const Home: React.FC<Props> = ({ state, setState }) => {
  const { profile, sessions, dailyWater, dailyCreatine } = state;

  const todayStr = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD paikallisessa ajassa

  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(now.setDate(diff));
  startOfWeek.setHours(0,0,0,0);
  
  // Suodatetaan: Ei tutorial-treenejä, ei skippauksia, vain valmistuneet kuntosalitreenit
  const thisWeekSessions = sessions.filter(s => {
    const sDate = new Date(s.date);
    return sDate >= startOfWeek && 
           !s.isSkipped && 
           s.finished && 
           !s.isTest && 
           s.type !== 'Aktiviteetti';
  });

  const progressRatio = thisWeekSessions.length / profile.weeklyTarget;
  const radius = 42; 
  const circumference = 2 * Math.PI * radius;

  const getDayInfo = (dayOffset: number) => {
    const targetDate = new Date(startOfWeek);
    targetDate.setDate(targetDate.getDate() + dayOffset);
    const dateStr = targetDate.toLocaleDateString('sv-SE');
    
    const session = sessions.find(s => new Date(s.date).toLocaleDateString('sv-SE') === dateStr && s.finished);
    
    if (!session) return { color: 'bg-slate-100', icon: null };
    if (session.isSkipped) return { 
      color: 'bg-slate-100 border-2 border-slate-200 border-dashed', 
      icon: <Coffee size={14} className="text-slate-300" /> 
    };
    
    if (session.type === 'Aktiviteetti') return { 
      color: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]', 
      icon: <Footprints size={14} className="text-white" /> 
    };

    let color = 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]';
    if (session.rating === 'yellow') color = 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
    if (session.rating === 'red') color = 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]';
    
    return { color, icon: <Dumbbell size={14} className="text-white" /> };
  };

  const addWater = (amount: number) => {
    setState(prev => ({ ...prev, dailyWater: prev.dailyWater + amount }));
  };

  const waterGoal = profile.creatine.enabled ? 3.0 : profile.waterIntake;
  const creatineGoal = profile.creatine.phase === 'Tankkaus' ? profile.creatine.speed : 5;
  const waterDone = dailyWater >= waterGoal;
  const creatineDone = dailyCreatine >= creatineGoal;

  const coachNameDisplay = profile.coachType === 'arnold' ? "Arnold Schwarzenegger" : `${profile.coachName}-Valmentaja`;
  const feedback = sessions.find(s => s.aiAnalysis && !s.isTest)?.aiAnalysis || `Tervehdys! ${profile.coachName} täällä valmiina päivän koitokseen.`;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Hei, {profile.name}! 👋</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Päiväsi yhteenveto</p>
      </header>

      <div className="bg-white rounded-[44px] p-8 shadow-2xl shadow-slate-100 flex items-center gap-10 border border-slate-50">
        <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-50" />
            <circle 
              cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" 
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (Math.min(progressRatio, 1) * circumference)}
              strokeLinecap="round"
              className="text-blue-600 transition-all duration-1000" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900 leading-none">{thisWeekSessions.length}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">/{profile.weeklyTarget}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-black text-slate-900 text-xl leading-none">Viikon tavoite</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {progressRatio >= 1 ? "Huippusuoritus! Tavoite täynnä." : `${Math.max(0, profile.weeklyTarget - thisWeekSessions.length)} treeniä jäljellä tavoitteeseen.`}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[36px] p-7 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-400">{coachNameDisplay}</span>
          </div>
          <p className="text-base font-medium leading-relaxed italic opacity-90 pr-4">"{feedback}"</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className={`p-7 rounded-[40px] border transition-all duration-500 ${waterDone ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50/40 border-blue-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${waterDone ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                {waterDone ? <CheckCircle2 size={24} /> : <Droplets size={24} />}
              </div>
              <div>
                <span className={`block text-[10px] font-black uppercase tracking-widest ${waterDone ? 'text-emerald-400' : 'text-blue-400'}`}>Nesteet</span>
                <span className="text-xl font-black text-slate-900">{dailyWater.toFixed(2)}L <span className="text-slate-400 text-xs font-bold">/ {waterGoal.toFixed(1)}L</span></span>
              </div>
            </div>
            {!waterDone ? (
              <div className="flex gap-2">
                <button onClick={() => addWater(0.1)} className="bg-white px-4 py-3 rounded-2xl shadow-sm text-blue-600 font-black text-[10px] border border-blue-50 active:scale-90 transition-all">+100ml</button>
                <button onClick={() => addWater(0.25)} className="bg-white px-4 py-3 rounded-2xl shadow-sm text-blue-600 font-black text-[10px] border border-blue-50 active:scale-90 transition-all">+250ml</button>
              </div>
            ) : (
              <div className="text-emerald-600 animate-bounce"><CheckCircle2 size={32} /></div>
            )}
          </div>
        </div>

        {profile.creatine.enabled && (
          <div className={`p-7 rounded-[40px] border transition-all duration-500 ${creatineDone ? 'bg-emerald-50 border-emerald-100' : 'bg-purple-50/30 border-purple-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${creatineDone ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-600'}`}>
                  {creatineDone ? <CheckCircle2 size={24} /> : <FlaskConical size={24} />}
                </div>
                <div>
                  <span className={`block text-[10px] font-black uppercase tracking-widest ${creatineDone ? 'text-emerald-400' : 'text-purple-400'}`}>Kreatiini</span>
                  <span className="text-xl font-black text-slate-900">{dailyCreatine}g <span className="text-slate-400 text-xs font-bold">/ {creatineGoal}g</span></span>
                </div>
              </div>
              {!creatineDone ? (
                <button onClick={() => setState(p => ({...p, dailyCreatine: p.dailyCreatine + 5}))} className="bg-white px-6 py-4 rounded-[20px] shadow-sm text-purple-600 active:scale-90 transition-all font-black text-sm border border-purple-50">+5g</button>
              ) : (
                <div className="text-emerald-600 animate-bounce"><CheckCircle2 size={32} /></div>
              )}
            </div>
          </div>
        )}
      </div>

      <section className="bg-white rounded-[40px] p-7 shadow-sm border border-slate-50">
        <h2 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
          <Calendar size={16} className="text-blue-600" /> Aktiivisuus
        </h2>
        <div className="flex justify-between gap-2.5">
          {['MA', 'TI', 'KE', 'TO', 'PE', 'LA', 'SU'].map((day, i) => {
            const dayInfo = getDayInfo(i);
            return (
              <div key={i} className="flex flex-col items-center gap-3 flex-1">
                <div className={`w-full aspect-square rounded-2xl ${dayInfo.color} transition-all duration-700 flex items-center justify-center overflow-hidden`}>
                  {dayInfo.icon}
                </div>
                <span className="text-[10px] font-black text-slate-300 tracking-tighter">{day}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
