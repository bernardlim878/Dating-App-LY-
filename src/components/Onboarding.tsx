import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, Calendar as CalendarIcon, PlusCircle, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingProps {
  onComplete: () => void;
}

interface Anniversary {
  id: number;
  label: string;
  date: string;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('Alex');
  const [birthday, setBirthday] = useState('2000-05-11');
  const [anniversaries, setAnniversaries] = useState<Anniversary[]>([
    { id: 1, label: 'First Date', date: 'October 14th' },
    { id: 2, label: 'New Memory', date: 'Set Date' }
  ]);
  const [cuisines, setCuisines] = useState(['Italian', 'Japanese', 'Mexican', 'French']);
  const [selectedCuisines, setSelectedCuisines] = useState(['Italian', 'Mexican']);
  const [interests, setInterests] = useState(['Hiking', 'Photography', 'Cooking']);
  const [selectedInterests, setSelectedInterests] = useState(['Hiking']);
  const [showAddCuisine, setShowAddCuisine] = useState(false);
  const [showAddInterest, setShowAddInterest] = useState(false);
  const [newCuisine, setNewCuisine] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editDate, setEditDate] = useState('');

  const dateInputRef = useRef<HTMLInputElement>(null);

  const messages = [
    "Hello! I'm here to help you plan the perfect date. To get started, I need to know a bit about your favorite person.",
    "First things first, what's their name?",
    `Nice to meet ${name}! And when's their special day? (I'll make sure you never miss a birthday!)`,
    "Got it. Are there any other important dates we should celebrate? Like your first date or anniversary?",
    "What kind of food does ${name} absolutely love?",
    "And what do they enjoy doing in their free time?"
  ];

  const handleAddAnniversary = () => {
    const newId = anniversaries.length > 0 ? Math.max(...anniversaries.map(a => a.id)) + 1 : 1;
    const newAnniversary = { id: newId, label: 'New Memory', date: 'Set Date' };
    setAnniversaries([...anniversaries, newAnniversary]);
    setEditingId(newId);
    setEditLabel(newAnniversary.label);
    setEditDate(newAnniversary.date);
  };

  const handleEditAnniversary = (anniversary: Anniversary) => {
    setEditingId(anniversary.id);
    setEditLabel(anniversary.label);
    setEditDate(anniversary.date);
  };

  const saveEdit = () => {
    if (editingId !== null) {
      setAnniversaries(anniversaries.map(a => a.id === editingId ? { ...a, label: editLabel, date: editDate } : a));
      setEditingId(null);
    }
  };

  const toggleCuisine = (cuisine: string) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const handleAddCuisine = () => {
    if (newCuisine.trim() && !cuisines.includes(newCuisine.trim())) {
      const updatedCuisines = [...cuisines, newCuisine.trim()];
      setCuisines(updatedCuisines);
      setSelectedCuisines([...selectedCuisines, newCuisine.trim()]);
      setNewCuisine('');
      setShowAddCuisine(false);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      setSelectedInterests([...selectedInterests, newInterest.trim()]);
      setNewInterest('');
      setShowAddInterest(false);
    }
  };

  const handleNextStep = () => {
    // Validation
    if (step === 1 && !name.trim()) {
      toast.error("Please enter a name to continue");
      return;
    }
    if (step === 2 && !birthday) {
      toast.error("Please select a birthday to continue");
      return;
    }
    if (step === 4 && selectedCuisines.length === 0) {
      toast.error("Please select at least one cuisine");
      return;
    }
    if (step === 5 && selectedInterests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    if (step < messages.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBackStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNextStep();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-mono">
      <header className="flex-none bg-background/80 backdrop-blur-md px-6 py-4 border-b border-border-muted">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <button 
            type="button" 
            onClick={handleBackStep}
            disabled={step === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors active:scale-90 ${step === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div className="flex flex-col items-center">
            <p className="text-[9px] font-black tracking-[0.4em] uppercase text-[#8B5E4A] mb-2">O N B O A R D I N G   B O T</p>
            <div className="flex gap-1.5">
              {Array.from({ length: messages.length }).map((_, i) => (
                <div 
                  key={i}
                  className={`h-[3px] w-4 rounded-full transition-colors ${step >= i ? 'bg-[#8B5E4A]' : 'bg-slate-100'}`} 
                />
              ))}
            </div>
          </div>
          <button 
            type="button"
            onClick={handleNextStep}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest active:opacity-70 transition-colors"
          >
            {step === messages.length - 1 ? 'FINISH' : 'NEXT'}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.slice(0, step + 1).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] p-5 rounded-2xl text-base leading-relaxed shadow-lg border-4 ${
                  i % 2 === 0 || i === 0 
                    ? 'bg-white border-slate-200 rounded-tl-none self-start text-slate-700 font-medium' 
                    : 'bg-[#8B5E4A] text-white border-[#8B5E4A] rounded-tr-none self-end'
                }`}
              >
                {msg}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="mb-12 flex flex-col items-end gap-6">
            {step === 1 && (
              <div className="w-full sm:w-80 flex gap-2">
                <input
                  className="w-full bg-transparent border-b-2 border-[#8B5E4A] focus:outline-none focus:ring-0 text-lg p-2 placeholder:text-slate-300 font-bold"
                  placeholder="Type name here..."
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                  autoFocus
                />
                <button onClick={handleNextStep} className="p-2 bg-[#8B5E4A] text-white rounded-full active:scale-90 transition-transform">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="w-full sm:w-80 relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={dateInputRef}
                    className="w-full bg-transparent border-b-2 border-[#8B5E4A] focus:outline-none focus:ring-0 text-lg p-2 placeholder:text-slate-300 min-h-[48px] font-bold"
                    placeholder="MM / DD / YYYY"
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNextStep()}
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.focus()}
                    className="absolute right-2 bottom-3 text-[#8B5E4A] hover:scale-125 transition-transform cursor-pointer active:scale-95 p-1 bg-background"
                    aria-label="Open calendar"
                  >
                    <CalendarIcon className="w-5 h-5" />
                  </button>
                </div>
                <button onClick={handleNextStep} className="p-2 bg-[#8B5E4A] text-white rounded-full active:scale-90 transition-transform self-end mb-1">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 w-full sm:w-80">
                {anniversaries.map((anniversary) => (
                  <div key={anniversary.id} className="w-full bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                    {editingId === anniversary.id ? (
                      <div className="flex-1 flex flex-col gap-2 mr-4">
                        <input 
                          className="text-[10px] text-[#8B5E4A] font-bold uppercase bg-slate-50 p-1 rounded focus:outline-none border border-slate-100"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          autoFocus
                        />
                        <input 
                          className="text-sm font-semibold bg-slate-50 p-1 rounded focus:outline-none border border-slate-100"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <p className="text-[9px] text-[#A0AEC0] font-bold uppercase tracking-wider leading-none">{anniversary.label}</p>
                        <p className="text-sm font-bold text-slate-800">{anniversary.date}</p>
                      </div>
                    )}
                    
                    {editingId === anniversary.id ? (
                      <button 
                        type="button"
                        onClick={saveEdit}
                        className="bg-[#8B5E4A] text-white text-[10px] px-3 py-1 rounded-full font-bold active:scale-95 shadow-sm"
                      >
                        SAVE
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={() => handleEditAnniversary(anniversary)}
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer active:scale-90"
                        aria-label="Edit memory"
                      >
                        <Edit2 className="w-4 h-4 text-slate-200 hover:text-[#8B5E4A] transition-colors" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={handleAddAnniversary}
                  className="w-full py-4 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-sm flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
                >
                  <PlusCircle className="w-4 h-4 text-slate-300" />
                  <span className="font-medium">Add another memory</span>
                </button>
                <button onClick={handleNextStep} className="w-full py-3 bg-[#8B5E4A] text-white rounded-xl font-bold active:scale-95 transition-transform mt-4">
                  CONTINUE
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-end gap-3 w-full sm:w-80">
                <div className="flex flex-wrap gap-2 justify-end">
                  {cuisines.map((cuisine) => (
                    <button
                      key={cuisine}
                      type="button"
                      onClick={() => toggleCuisine(cuisine)}
                      className={`px-6 py-2 rounded-full border-2 text-xs font-bold transition-all active:scale-95 ${
                        selectedCuisines.includes(cuisine)
                          ? 'border-[#8B5E4A] bg-[#8B5E4A] text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-[#8B5E4A]/50'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                  {!showAddCuisine && (
                    <button 
                      type="button"
                      onClick={() => setShowAddCuisine(true)}
                      className="px-6 py-2 rounded-full border-2 border-slate-200 bg-white text-[#8B5E4A] text-xs font-bold hover:border-[#8B5E4A] transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span className="text-lg leading-none">+</span> Add Cuisine
                    </button>
                  )}
                </div>
                
                {showAddCuisine && (
                  <div className="flex gap-2 w-full bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                    <input
                      autoFocus
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm px-3"
                      placeholder="Enter cuisine..."
                      value={newCuisine}
                      onChange={(e) => setNewCuisine(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCuisine()}
                    />
                    <button type="button" onClick={handleAddCuisine} className="text-[#8B5E4A] font-bold text-xs px-2 active:scale-90">ADD</button>
                    <button type="button" onClick={() => setShowAddCuisine(false)} className="text-slate-400 px-2 active:scale-90"><X className="w-4 h-4" /></button>
                  </div>
                )}
                <button onClick={handleNextStep} className="w-full py-3 bg-[#8B5E4A] text-white rounded-xl font-bold active:scale-95 transition-transform mt-4">
                  CONTINUE
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="flex flex-col items-end gap-3 w-full sm:w-80">
                <div className="flex flex-wrap gap-2 justify-end">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-6 py-2 rounded-full border-2 text-xs font-bold transition-all active:scale-95 ${
                        selectedInterests.includes(interest)
                          ? 'border-[#8B5E4A] bg-[#8B5E4A] text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-[#8B5E4A]/50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                  {!showAddInterest && (
                    <button 
                      type="button"
                      onClick={() => setShowAddInterest(true)}
                      className="px-6 py-2 rounded-full border-2 border-slate-200 bg-white text-[#8B5E4A] text-xs font-bold hover:border-[#8B5E4A] transition-all active:scale-95 flex items-center gap-1"
                    >
                      <span className="text-lg leading-none">+</span> Add Interest
                    </button>
                  )}
                </div>
                
                {showAddInterest && (
                  <div className="flex gap-2 w-full bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                    <input
                      autoFocus
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm px-3"
                      placeholder="Enter interest..."
                      value={newInterest}
                      onChange={(e) => setNewInterest(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                    />
                    <button type="button" onClick={handleAddInterest} className="text-[#8B5E4A] font-bold text-xs px-2 active:scale-90">ADD</button>
                    <button type="button" onClick={() => setShowAddInterest(false)} className="text-slate-400 px-2 active:scale-90"><X className="w-4 h-4" /></button>
                  </div>
                )}
                <button onClick={handleNextStep} className="w-full py-3 bg-[#8B5E4A] text-white rounded-xl font-bold active:scale-95 transition-transform mt-4">
                  FINISH
                </button>
              </div>
            )}

            {step === 0 && (
              <button 
                onClick={handleNextStep}
                className="px-8 py-3 bg-[#8B5E4A] text-white rounded-full font-bold active:scale-95 transition-transform shadow-lg"
              >
                START CHAT
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="flex-none p-6 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={handleNextStep}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-base shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
          >
            {step === messages.length - 1 ? 'LOOKS GOOD' : 'CONTINUE'}
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
