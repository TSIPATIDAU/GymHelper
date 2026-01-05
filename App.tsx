
import React, { useState, useEffect } from 'react';
import { UserProfile, WorkoutSession, AppState, Message, ChatSession } from './types';
import Onboarding from './components/Onboarding';
import Home from './components/Home';
import Workout from './components/Workout';
import History from './components/History';
import Chat from './components/Chat';
import Profile from './components/Profile';
import TutorialOverlay from './components/TutorialOverlay';
import { Home as HomeIcon, List as HistoryIcon, Dumbbell, MessageSquare, User } from 'lucide-react';

import LockScreen from './components/LockScreen';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'workout' | 'chat' | 'profile'>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if password protection is enabled
    const password = import.meta.env.VITE_APP_PASSWORD;
    if (!password) return true; // No password = auth skipped
    return sessionStorage.getItem('voima_unlocked') === 'true';
  });

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('voimaai_state_v5');
    if (saved) return JSON.parse(saved);

    const initialChatId = Date.now().toString();
    return {
      profile: {
        name: '', age: 0, weight: 0, height: 0, gender: 'Mies',
        goal: 'Kehonmuokkaus', weeklyTarget: 3, onboarded: false,
        experience: 'Aloittelija', status: 'Uusi tulokas',
        creatine: { enabled: false, phase: 'Ylläpito', speed: 5, dailyIntake: 0 },
        waterIntake: 2.5, waterTrackingEnabled: true,
        coachName: 'Aino', coachType: 'aino',
        benchPR: 0, squatPR: 0, deadliftPR: 0, tutorialStep: -1 // Changed from 0 to -1
      },
      sessions: [],
      chats: [{ id: initialChatId, title: 'Uusi keskustelu', messages: [{ role: 'model', text: 'Tervehdys! Valmentajasi täällä valmiina.', timestamp: new Date().toISOString() }] }],
      activeChatId: initialChatId,
      dailyWater: 0,
      dailyCreatine: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('voimaai_state_v5', JSON.stringify(state));
  }, [state]);

  if (!isAuthenticated) {
    return <LockScreen onUnlock={() => {
      sessionStorage.setItem('voima_unlocked', 'true');
      setIsAuthenticated(true);
    }} />;
  }

  if (!state.profile.onboarded) {
    return <Onboarding onComplete={(profile) => setState(prev => ({ ...prev, profile: { ...profile, onboarded: true } }))} />;
  }

  const completeTutorial = () => {
    setState(prev => ({ ...prev, profile: { ...prev.profile, tutorialStep: -1 } }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Home state={state} setState={setState} />;
      case 'history': return <History sessions={state.sessions} />;
      case 'workout': return <Workout state={state} setState={setState} onCompleteTest={() => setActiveTab('home')} />;
      case 'chat': return <Chat state={state} setState={setState} />;
      case 'profile': return <Profile profile={state.profile} setProfile={(p) => setState(prev => ({ ...prev, profile: p }))} />;
      default: return <Home state={state} setState={setState} />;
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center justify-center w-full py-4 transition-all ${activeTab === id ? 'text-blue-600' : 'text-slate-400'}`}>
      <Icon size={24} strokeWidth={activeTab === id ? 3 : 2} />
      <span className="text-[9px] mt-1.5 font-black uppercase tracking-[0.1em]">{label}</span>
    </button>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white pb-32 relative overflow-x-hidden">
      <main className="p-6 pt-12">{renderContent()}</main>

      {state.profile.tutorialStep > 0 && (
        <TutorialOverlay
          step={state.profile.tutorialStep}
          setStep={(s) => setState(prev => ({ ...prev, profile: { ...prev.profile, tutorialStep: s } }))}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onFinish={completeTutorial}
        />
      )}

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t-2 border-slate-50 flex justify-around items-end px-4 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] z-50 rounded-t-[44px] h-24">
        <NavItem id="home" icon={HomeIcon} label="Koti" />
        <NavItem id="history" icon={HistoryIcon} label="Lista" />
        <div className="relative -top-8">
          <button onClick={() => setActiveTab('workout')} className={`w-18 h-18 rounded-[28px] flex items-center justify-center shadow-2xl transition-all ${activeTab === 'workout' ? 'bg-slate-900 text-white scale-110' : 'bg-blue-600 text-white'}`} style={{ width: '70px', height: '70px' }}>
            <Dumbbell size={32} />
          </button>
          <span className="absolute -bottom-6 left-0 right-0 text-center text-[9px] font-black uppercase text-slate-400 tracking-widest">Treeni</span>
        </div>
        <NavItem id="chat" icon={MessageSquare} label="Chat" />
        <NavItem id="profile" icon={User} label="Minä" />
      </nav>
    </div>
  );
};

export default App;
