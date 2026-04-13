import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Compass, Calendar, Lightbulb, User } from 'lucide-react';
import Home from './components/Home';
import Explore from './components/Explore';
import Insight from './components/Insight';
import Profile from './components/Profile';
import Onboarding from './components/Onboarding';
import { Screen, UserProfile } from './types';
import { Toaster } from 'sonner';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    memberSince: 'Oct 2023',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    partnerName: 'Jordan Smith',
    partnerBirthday: 'June 12th',
    partnerNotes: 'Loves surprises, but hates cilantro. Prefers cozy jazz nights over loud clubs.',
    cuisines: ['Italian', 'Japanese', 'Mexican'],
    hobbies: ['Art Galleries', 'Hiking', 'Wine Tasting'],
    anniversaries: [
      { title: 'First Date', date: 'October 14th' },
      { title: 'Wedding Anniversary', date: 'May 22nd' }
    ]
  });

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <Onboarding onComplete={() => setCurrentScreen('home')} />;
      case 'home':
      case 'plans':
        return <Home onNavigate={setCurrentScreen} />;
      case 'explore':
        return <Explore />;
      case 'insight':
        return <Insight profile={profile} />;
      case 'profile':
        return <Profile profile={profile} onUpdateProfile={setProfile} />;
      default:
        return <Home onNavigate={setCurrentScreen} />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Leaf },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'insight', label: 'Insight', icon: Lightbulb },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary">
      <Toaster position="top-center" richColors />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {currentScreen !== 'onboarding' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border-muted px-6 pt-3 pb-8 z-50">
          <div className="max-w-md mx-auto flex justify-between items-center">
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id as Screen)}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    isActive ? 'text-primary scale-110' : 'text-slate-400 hover:text-primary'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
                    {isActive && item.id === 'explore' && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-white" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
