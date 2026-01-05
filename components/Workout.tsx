
import React, { useState } from 'react';
import { AppState, WorkoutSession, Exercise, SetRecord, WorkoutType } from '../types';
import { Plus, Trash2, LogOut, SkipForward, X, Dumbbell, Save, Target, Copy, CheckCircle2, Sparkles, Pencil, Footprints, Info, Clock, Ruler } from 'lucide-react';
import { analyzeWorkout } from '../services/geminiService';

interface Props {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  onCompleteTest?: () => void;
}

const Workout: React.FC<Props> = ({ state, setState, onCompleteTest }) => {
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // Etsitään aktiivinen, viimeistelemätön treeni
  const activeSession = state.sessions.find(s => !s.finished && !s.isSkipped);

  const startWorkout = (type: WorkoutType, isTest: boolean = false) => {
    const newSession: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: type,
      exercises: isTest ? [{ id: 'test-ex', name: '', sets: [{ reps: 0, weight: 0 }] }] : [],
      finished: false,
      isTest: isTest,
      activityNotes: type === 'Aktiviteetti' ? '' : undefined,
      activityDuration: type === 'Aktiviteetti' ? 0 : undefined,
      activityDistance: type === 'Aktiviteetti' ? 0 : undefined
    };
    setState(prev => ({ 
      ...prev, 
      sessions: [...prev.sessions, newSession],
      profile: { ...prev.profile, tutorialStep: isTest ? 6 : prev.profile.tutorialStep }
    }));
    setShowTypeSelector(false);
  };

  const updateActiveSession = (data: Partial<WorkoutSession>) => {
    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s => s.id === activeSession?.id ? { ...s, ...data } : s)
    }));
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!activeSession) return;

    if (window.confirm("Haluatko varmasti peruuttaa tämän? Tallentamattomat tiedot poistetaan.")) {
      const idToRemove = activeSession.id;
      const wasTest = !!activeSession.isTest;
      
      setState(prev => ({
        ...prev,
        sessions: prev.sessions.filter(s => s.id !== idToRemove),
        profile: {
          ...prev.profile,
          // Jos oli testi, palautetaan tutorialStep tilaan jossa menu näkyy
          tutorialStep: wasTest ? -1 : prev.profile.tutorialStep
        }
      }));
    }
  };

  const handleFinish = async () => {
    if (!activeSession) return;
    setIsFinishing(true);
    
    let analysis;
    if (activeSession.isTest) {
      analysis = { analysis: "Loistava testitreeni! Olet nyt valmis aloittamaan varsinaisen ohjelmasi.", rating: 'green' };
      setState(prev => ({ ...prev, profile: { ...prev.profile, tutorialStep: -1 } }));
    } else if (activeSession.type === 'Aktiviteetti') {
      const durationMsg = activeSession.activityDuration ? `${activeSession.activityDuration} minuutin ` : '';
      const distanceMsg = activeSession.activityDistance ? `${activeSession.activityDistance} km ` : '';
      analysis = { analysis: `Hienoa liikehdintää! ${durationMsg}${distanceMsg}tekeminen pitää aineenvaihdunnan käynnissä.`, rating: 'green' };
    } else {
      analysis = await analyzeWorkout(state.profile, activeSession, state.sessions.filter(s => s.finished));
    }
    
    updateActiveSession({ finished: true, aiAnalysis: analysis.analysis, rating: analysis.rating });
    setIsFinishing(false);
    if (activeSession.isTest && onCompleteTest) onCompleteTest();
  };

  const handleSkip = (reason: string) => {
    const skip: WorkoutSession = { 
      id: Date.now().toString(), 
      date: new Date().toISOString(), 
      type: 'Normaali', 
      exercises: [], 
      finished: true, 
      isSkipped: true, 
      skipReason: reason 
    };
    setState(prev => ({ ...prev, sessions: [...prev.sessions, skip] }));
    setShowSkipModal(false);
  };

  if (!activeSession) {
    if (state.profile.tutorialStep === 6) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-6 animate-in slide-in-from-bottom-8">
          <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center mb-10 text-white shadow-2xl rotate-3">
            <Sparkles size={48} />
          </div>
          <h1 className="text-4xl font-black mb-4 text-slate-900 tracking-tight">Viimeinen askel!</h1>
          <p className="text-slate-500 mb-12 font-bold leading-relaxed">Aloita nyt testi-treeni oppiaksesi kirjaamisen.</p>
          <div className="w-full space-y-4">
            <button onClick={() => startWorkout('Normaali', true)} className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
              Aloita Testitreeni
            </button>
            <button onClick={() => setState(p => ({...p, profile: {...p.profile, tutorialStep: -1}}))} className="w-full py-4 text-slate-400 font-black uppercase text-xs">Peruuta tutorial</button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-6 animate-in slide-in-from-bottom-8">
        <div className="w-28 h-28 bg-slate-900 rounded-[40px] flex items-center justify-center mb-10 text-white shadow-2xl rotate-3">
          <Dumbbell size={54} />
        </div>
        <h1 className="text-4xl font-black mb-4 text-slate-900 tracking-tight leading-tight">Mitä tänään <br/>tehdään?</h1>
        <div className="w-full space-y-4">
          <button onClick={() => setShowTypeSelector(true)} className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
            <Plus size={24} /> Aloita sali-treeni
          </button>
          <button onClick={() => startWorkout('Aktiviteetti')} className="w-full bg-emerald-50 text-emerald-600 py-6 rounded-[32px] font-black flex items-center justify-center gap-3 border-2 border-emerald-100">
            <Footprints size={24} /> Merkitse aktiviteetti
          </button>
          <button onClick={() => setShowSkipModal(true)} className="w-full bg-white border-2 border-slate-300 text-slate-500 py-6 rounded-[32px] font-black flex items-center justify-center gap-3">
            <SkipForward size={24} /> Täysi lepopäivä
          </button>
        </div>

        {showTypeSelector && (
          <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-end p-4">
            <div className="bg-white rounded-[56px] w-full p-10 space-y-5 animate-in slide-in-from-bottom-full duration-500">
              <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Valitse tyyppi</h3>
              {[
                {id: 'Normaali', desc: 'Vahva ja tehokas treeni', icon: '⚡'},
                {id: 'Rento', desc: 'Palauttava ja kevyt päivä', icon: '🍃'},
                {id: 'Ykköset', desc: 'PR-päivä ja maksimivoima', icon: '🏆'}
              ].map(t => (
                <button key={t.id} onClick={() => startWorkout(t.id as WorkoutType)} className="w-full p-6 bg-slate-50 rounded-[32px] text-left border-4 border-transparent transition-all group active:bg-blue-50">
                  <div className="flex justify-between items-center">
                    <div><div className="font-black text-xl text-slate-900">{t.id}</div><div className="text-sm font-bold text-slate-400 mt-1">{t.desc}</div></div>
                    <span className="text-3xl">{t.icon}</span>
                  </div>
                </button>
              ))}
              <button onClick={() => setShowTypeSelector(false)} className="w-full py-6 text-slate-300 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Peruuta</button>
            </div>
          </div>
        )}

        {showSkipModal && (
          <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-[48px] w-full p-10 space-y-4 shadow-2xl">
              <h3 className="text-2xl font-black mb-4">Miksi lepo?</h3>
              {['Kipeä', 'Loma', 'Muu syy', 'Väsymys'].map(r => (
                <button key={r} onClick={() => handleSkip(r)} className="w-full p-5 bg-slate-50 rounded-[24px] font-black text-left active:bg-blue-50">{r}</button>
              ))}
              <button onClick={() => setShowSkipModal(false)} className="w-full py-4 text-slate-400 font-black uppercase text-xs text-center">Peruuta</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-48 animate-in fade-in duration-500">
      <header className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md py-4 z-20 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={handleCancelClick}
            className="w-14 h-14 -ml-2 text-slate-400 hover:text-rose-500 active:scale-90 transition-all rounded-full border-2 border-slate-200 flex items-center justify-center bg-white shadow-sm z-30 cursor-pointer"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X size={32} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
              {activeSession.isTest ? 'TESTI-TREENI' : activeSession.type}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{state.profile.coachName} analysoi</span>
            </div>
          </div>
        </div>
        {!activeSession.isTest && activeSession.type !== 'Aktiviteetti' && (
          <button onClick={async () => { setIsSaving(true); const analysis = await analyzeWorkout(state.profile, activeSession, state.sessions.filter(s => s.finished)); updateActiveSession({ aiAnalysis: analysis.analysis }); setIsSaving(false); }} disabled={isSaving} className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-[11px] font-black flex items-center gap-2 shadow-xl active:scale-95 transition-all">
            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            AI-Muisti
          </button>
        )}
      </header>

      {activeSession.isTest && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[32px] p-6 flex gap-4 items-start animate-in slide-in-from-top-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl">
            <Info size={24} />
          </div>
          <div className="space-y-1">
            <p className="font-black text-blue-900 text-sm uppercase tracking-wide">Tutorial-ohje</p>
            <p className="text-xs font-bold text-blue-700 leading-relaxed">
              Nimeä liike itse (esim. Penkkipunnerrus), syötä toistot ja paino. Kun olet valmis, paina alhaalta "Viimeistele tutorial".
            </p>
          </div>
        </div>
      )}

      {activeSession.type === 'Aktiviteetti' ? (
        <div className="space-y-6">
          <div className="bg-white border-4 border-emerald-100 rounded-[48px] p-8 shadow-2xl shadow-emerald-50 space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-500 text-white rounded-[24px] shadow-lg"><Footprints size={24} /></div>
              <span className="text-xl font-black text-slate-900 uppercase tracking-tight">Muu aktiviteetti</span>
            </div>
            
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Mitä teit?</label>
              <textarea 
                className="w-full h-40 p-6 bg-slate-50 border-2 border-slate-200 rounded-[32px] font-bold text-slate-900 focus:border-emerald-500 outline-none resize-none placeholder-slate-300 shadow-inner"
                placeholder="Esim. kävelylenkki koiran kanssa tai kehonhuoltoa"
                value={activeSession.activityNotes || ''}
                onChange={(e) => updateActiveSession({ activityNotes: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2"><Clock size={14} /> Kesto (min)</label>
                <input 
                  type="number" 
                  value={activeSession.activityDuration || ''} 
                  onChange={e => updateActiveSession({ activityDuration: parseInt(e.target.value) || 0 })} 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[24px] p-5 font-black text-center text-xl outline-none focus:border-emerald-500 shadow-inner" 
                  placeholder="0" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2"><Ruler size={14} /> Matka (km)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  value={activeSession.activityDistance || ''} 
                  onChange={e => updateActiveSession({ activityDistance: parseFloat(e.target.value) || 0 })} 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[24px] p-5 font-black text-center text-xl outline-none focus:border-emerald-500 shadow-inner" 
                  placeholder="0.0" 
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {activeSession.exercises.map((ex) => (
            <div key={ex.id} className="bg-white border-4 border-slate-100 rounded-[48px] p-8 shadow-2xl shadow-slate-100/30 space-y-8">
              <div className="flex flex-col gap-4">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 text-white rounded-[20px] shadow-sm"><Pencil size={18} /></div>
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Liikkeen nimi</label>
                 </div>
                 <input 
                  type="text" 
                  placeholder="Mikä liike kyseessä?" 
                  className="w-full text-xl font-black bg-slate-50 border-2 border-slate-200 rounded-[24px] p-6 focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900 transition-all placeholder-slate-300 shadow-inner" 
                  value={ex.name} 
                  onChange={(e) => updateActiveSession({ exercises: activeSession.exercises.map(x => x.id === ex.id ? {...x, name: e.target.value} : x) })} 
                />
                {!activeSession.isTest && (
                  <button onClick={() => updateActiveSession({ exercises: activeSession.exercises.filter(x => x.id !== ex.id) })} className="self-end text-rose-500 font-black text-[10px] uppercase flex items-center gap-1 mt-1">
                    <Trash2 size={14} /> Poista liike
                  </button>
                )}
              </div>

              <div className="space-y-4 border-t-2 border-slate-50 pt-8">
                <div className="grid grid-cols-12 gap-4 text-[10px] font-black text-slate-300 uppercase tracking-widest px-4">
                  <div className="col-span-2 text-center">NRO</div>
                  <div className="col-span-4 text-center">TOISTOT</div>
                  <div className="col-span-4 text-center">KG</div>
                  <div className="col-span-2"></div>
                </div>

                {ex.sets.map((set, sIdx) => (
                  <div key={sIdx} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2 text-center font-black text-slate-900 text-xl">{sIdx + 1}</div>
                    <input type="number" placeholder="0" className="col-span-4 bg-white border-2 border-slate-300 rounded-[20px] p-4 text-center text-xl font-black text-blue-600 focus:border-blue-600 outline-none shadow-sm" value={set.reps || ''} onChange={(e) => {
                      updateActiveSession({
                        exercises: activeSession.exercises.map(exc => 
                          exc.id === ex.id ? {
                            ...exc,
                            sets: exc.sets.map((s, i) => i === sIdx ? { ...s, reps: parseInt(e.target.value) || 0 } : s)
                          } : exc
                        )
                      });
                    }} />
                    <input type="number" placeholder="0" className="col-span-4 bg-white border-2 border-slate-300 rounded-[20px] p-4 text-center text-xl font-black text-blue-600 focus:border-blue-600 outline-none shadow-sm" value={set.weight || ''} onChange={(e) => {
                      updateActiveSession({
                        exercises: activeSession.exercises.map(exc => 
                          exc.id === ex.id ? {
                            ...exc,
                            sets: exc.sets.map((s, i) => i === sIdx ? { ...s, weight: parseFloat(e.target.value) || 0 } : s)
                          } : exc
                        )
                      });
                    }} />
                    <button onClick={() => {
                      updateActiveSession({
                        exercises: activeSession.exercises.map(exc => 
                          exc.id === ex.id ? { ...exc, sets: exc.sets.filter((_, i) => i !== sIdx) } : exc
                        )
                      });
                    }} className="col-span-2 flex justify-center text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button onClick={() => updateActiveSession({ exercises: activeSession.exercises.map(x => x.id === ex.id ? {...x, sets: [...x.sets, {reps: 0, weight: 0}]} : x) })} className="py-4 bg-slate-900 text-white text-[10px] font-black rounded-[20px] flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95 transition-all"><Plus size={16} /> Lisää sarja</button>
                  <button onClick={() => {
                    updateActiveSession({
                      exercises: activeSession.exercises.map(x => {
                        if (x.id === ex.id) {
                          const lastSet = x.sets[x.sets.length - 1];
                          return { ...x, sets: [...x.sets, { ...lastSet }] };
                        }
                        return x;
                      })
                    });
                  }} className="py-4 bg-blue-50 text-blue-600 text-[10px] font-black rounded-[20px] flex items-center justify-center gap-2 border-2 border-blue-100 uppercase tracking-widest active:scale-95 transition-all"><Copy size={16} /> Kopioi luvut</button>
                </div>
              </div>
            </div>
          ))}

          <button onClick={() => updateActiveSession({ exercises: [...activeSession.exercises, { id: Date.now().toString(), name: '', sets: [{ reps: 0, weight: 0 }], isPRAttempt: false }] })} className="w-full py-8 bg-blue-50 text-blue-600 rounded-[44px] font-black flex items-center justify-center gap-4 border-4 border-dashed border-blue-200 uppercase tracking-[0.2em] text-sm hover:bg-blue-100 active:scale-95 transition-all">
            <Plus size={28} /> Lisää uusi liike
          </button>
        </div>
      )}

      <div className="fixed bottom-28 left-6 right-6 z-30 max-w-md mx-auto">
        <button 
          onClick={handleFinish} 
          disabled={isFinishing || (activeSession.type !== 'Aktiviteetti' && activeSession.exercises.length === 0) || (activeSession.isTest && (!activeSession.exercises[0]?.name || activeSession.exercises[0].sets.some(s => s.reps === 0)))} 
          className="w-full bg-slate-900 text-white py-7 rounded-[32px] font-black flex items-center justify-center gap-4 shadow-2xl active:scale-95 disabled:opacity-50 transition-all border-4 border-slate-800"
        >
          {isFinishing ? <div className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={28} />}
          {activeSession.isTest ? 'Viimeistele tutorial' : 'Tallenna treeni'}
        </button>
      </div>
    </div>
  );
};

export default Workout;
