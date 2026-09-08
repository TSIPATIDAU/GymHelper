
import React from 'react';
import { ChevronRight, Sparkles, Home, List, MessageSquare, User, Dumbbell } from 'lucide-react';

interface Props {
  step: number;
  setStep: (s: number) => void;
  activeTab: string;
  setActiveTab: (t: any) => void;
  onFinish: () => void;
}

const TutorialOverlay: React.FC<Props> = ({ step, setStep, activeTab, setActiveTab, onFinish }) => {
  const steps = [
    {
      tab: 'home',
      title: 'Tervetuloa kotiin! 👋',
      text: 'Täältä näet viikon aktiivisuutesi ja nesteytyksen. Jos käytät kreatiinia, täällä on myös sen seuranta.',
      icon: <Home className="text-blue-600" size={40} />
    },
    {
      tab: 'history',
      title: 'Treenilista 📋',
      text: 'Täältä löydät kaikki aiemmat treenisi ja merkinnät jokaisesta käynnistä.',
      icon: <List className="text-blue-600" size={40} />
    },
    {
      tab: 'profile',
      title: 'Sinun tietosi 👤',
      text: 'Täällä voit päivittää painosi ja seurata voimatasoasi SBD-laskurin avulla. Seuraava tasosi on aina näkyvillä!',
      icon: <User className="text-blue-600" size={40} />
    },
    {
      tab: 'workout',
      title: 'Nyt tositoimiin! 💪',
      text: 'Tärkein osa: Treenien kirjaaminen. Tehdään nyt yksi "Testi-treeni", jotta opit kuinka helppoa se on.',
      icon: <Dumbbell className="text-blue-600" size={40} />
    }
  ];

  const currentStep = steps[step - 1];

  // If we're between steps or at an invalid step, don't crash
  if (!currentStep && step <= steps.length) return null;
  if (step > 4) return null;

  const handleNext = () => {
    if (step < steps.length) {
      const nextStep = steps[step];
      setActiveTab(nextStep.tab);
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 flex items-end p-6 pointer-events-none transition-all">
      <div className="bg-white w-full rounded-[48px] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 pointer-events-auto border-4 border-blue-600">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-5 bg-blue-50 rounded-[32px] mb-2">{currentStep.icon}</div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{currentStep.title}</h2>
          <p className="text-slate-500 font-bold leading-relaxed">{currentStep.text}</p>
          <button 
            onClick={handleNext}
            className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-black flex items-center justify-center gap-2 mt-4 active:scale-95 transition-all shadow-xl"
          >
            {step === 4 ? 'Aloita testitreeni' : 'Seuraava'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;
