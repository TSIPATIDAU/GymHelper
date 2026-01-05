
import React, { useState } from 'react';
import { WorkoutSession } from '../types';
import { ChevronDown, ChevronUp, Sparkles, Dumbbell, Coffee, Footprints } from 'lucide-react';

interface Props {
  sessions: WorkoutSession[];
}

const History: React.FC<Props> = ({ sessions }) => {
  const [expandedAI, setExpandedAI] = useState<string | null>(null);

  const finishedSessions = [...sessions]
    .filter(s => s.finished)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (finishedSessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-in fade-in">
        <h2 className="text-2xl font-black text-slate-900">Ei historiaa vielä</h2>
        <p className="text-slate-400 text-sm mt-3 font-medium">Valmentajasi odottaa ensimmäistä treeniäsi!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Treenihistoria</h1>
      
      <div className="space-y-5">
        {finishedSessions.map((session) => (
          <div key={session.id} className="bg-white border border-slate-100 rounded-[40px] p-7 shadow-xl shadow-slate-50 relative overflow-hidden group">
            {/* Color-coded rating bar on the left */}
            {!session.isSkipped && (
              <div className={`absolute left-0 top-0 bottom-0 w-2.5 ${
                session.rating === 'green' ? 'bg-emerald-500' :
                session.rating === 'yellow' ? 'bg-amber-400' : 'bg-rose-500'
              }`} />
            )}

            <div className="flex items-center justify-between mb-6 ml-1">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-[20px] shadow-sm ${
                  session.isSkipped ? 'bg-slate-100 text-slate-400' : 
                  session.type === 'Aktiviteetti' ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white'
                }`}>
                  {session.isSkipped ? <Coffee size={24} /> : 
                   session.type === 'Aktiviteetti' ? <Footprints size={24} /> : <Dumbbell size={24} />}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg leading-none uppercase tracking-tight">
                    {session.isTest ? 'TUTORIAL' : 
                     session.isSkipped ? 'Lepopäivä' : 
                     session.type === 'Aktiviteetti' ? 'Muu aktiviteetti' : session.type + ' treeni'}
                  </h3>
                  <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest mt-2 block">
                    {new Date(session.date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long' })}
                  </span>
                </div>
              </div>
            </div>

            {session.type === 'Aktiviteetti' && session.activityNotes && (
              <div className="ml-1 p-5 bg-emerald-50 rounded-[28px] border border-emerald-100">
                <p className="text-sm font-bold text-emerald-800 leading-relaxed italic">
                  "{session.activityNotes}"
                </p>
              </div>
            )}

            {!session.isSkipped && session.type !== 'Aktiviteetti' && (
              <div className="space-y-4 ml-1">
                {session.exercises.map(ex => (
                  <div key={ex.id} className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-base font-black text-slate-900 tracking-tight">{ex.name}</span>
                      {ex.isPRAttempt && (
                        <span className="text-[9px] bg-amber-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg shadow-amber-200">
                          Uusi PR!
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {ex.sets.map((set, i) => (
                        <div key={i} className="text-[11px] text-slate-400 font-black bg-white rounded-2xl p-3 border border-slate-100 flex justify-between items-center shadow-sm">
                          <span className="text-slate-300">{i+1}. sarja</span>
                          <span className="text-slate-900">{set.reps} x {set.weight}kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {session.aiAnalysis && (
              <div className="border-t border-slate-100 pt-6 mt-6 ml-1">
                <button 
                  onClick={() => setExpandedAI(expandedAI === session.id ? null : session.id)}
                  className="w-full flex items-center justify-between text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]"
                >
                  <span className="flex items-center gap-2"><Sparkles size={14} /> Valmentajan analyysi</span>
                  {expandedAI === session.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {expandedAI === session.id && (
                  <div className="mt-4 p-6 bg-blue-50/30 rounded-[32px] border border-blue-100/50 animate-in slide-in-from-top-2">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                      "{session.aiAnalysis}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
