import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Quote, Sparkles, Camera, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface HomeProps {
  onNavigate: (screen: 'home' | 'explore' | 'plans' | 'insight' | 'profile') => void;
}

interface Memory {
  id: string;
  title: string;
  image: string;
  date: string;
}

export default function Home({ onNavigate }: HomeProps) {
  const [activeTab, setActiveTab] = useState('Whole Heart');
  const [memories, setMemories] = useState<Memory[]>([
    { id: '1', title: 'Museum Moons', image: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?auto=format&fit=crop&q=80&w=400', date: 'April 2024' },
    { id: '2', title: 'Dusk & Crumbs', image: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&q=80&w=400', date: 'March 2024' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [modalForm, setModalForm] = useState({ title: '', date: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'Whole Heart', label: 'Whole Heart', color: 'bg-[#FDF2D5]' },
    { id: 'Locked In', label: 'Locked In', color: 'bg-[#F9E1E5]' },
    { id: 'Just Maybe', label: 'Just Maybe', color: 'bg-[#D5EEF2]' },
  ];

  const adventureData: Record<string, any[]> = {
    'Whole Heart': [
      {
        id: 'wh-1',
        title: 'Our Forever Feast',
        time: 'Saturday under the stars • 7:30 PM',
        tag: 'ROMANTIC',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
        tapeColor: 'bg-[#D9C5B2]/40',
      },
      {
        id: 'wh-2',
        title: 'Soul Connection',
        time: 'Deep talks by the fireplace',
        image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=800',
        tapeColor: 'bg-[#B2C5D9]/40',
      }
    ],
    'Locked In': [
      {
        id: 'li-1',
        title: 'Coastal Whispers',
        time: 'Chasing horizons at Big Sur',
        tag: 'LOCKED IN',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
        tapeColor: 'bg-[#B2C5D9]/40',
      },
      {
        id: 'li-2',
        title: 'Mountain High',
        time: 'Summiting our dreams together',
        tag: 'LOCKED IN',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
        tapeColor: 'bg-[#D9C5B2]/40',
      }
    ],
    'Just Maybe': [
      {
        id: 'jm-1',
        title: 'Midnight Potions',
        time: 'Secret bars and neon lights',
        tag: 'SPONTANEOUS',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
        tapeColor: 'bg-[#FDF2D5]/40',
      },
      {
        id: 'jm-2',
        title: 'Street Food Safari',
        time: 'Exploring hidden flavors',
        tag: 'MAYBE',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
        tapeColor: 'bg-[#D5EEF2]/40',
      }
    ]
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPendingImage(reader.result as string);
        setModalForm({
          title: '',
          date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        });
        setEditingMemory(null);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMemory = () => {
    if (!modalForm.title.trim()) {
      toast.error('Please enter a message for this memory');
      return;
    }

    if (editingMemory) {
      setMemories(memories.map(m => 
        m.id === editingMemory.id 
          ? { ...m, title: modalForm.title, date: modalForm.date } 
          : m
      ));
      toast.success('Memory updated!');
    } else if (pendingImage) {
      const newMemory: Memory = {
        id: Date.now().toString(),
        title: modalForm.title,
        image: pendingImage,
        date: modalForm.date,
      };
      setMemories([newMemory, ...memories]);
      toast.success('Memory added to the jar!');
    }

    setIsModalOpen(false);
    setPendingImage(null);
    setEditingMemory(null);
    setModalForm({ title: '', date: '' });
  };

  const openEditModal = (memory: Memory) => {
    setEditingMemory(memory);
    setModalForm({ title: memory.title, date: memory.date });
    setPendingImage(null);
    setIsModalOpen(true);
  };

  const removeMemory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMemories(memories.filter(m => m.id !== id));
    toast.info('Memory removed');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32 pt-8 doodle-bg">
      <header className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-serif italic text-[#8B5E4A] mb-8">My Dream Map</h1>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 font-serif text-sm transition-all transform hover:-rotate-1 whitespace-nowrap ${tab.color} ${
                  activeTab === tab.id ? 'shadow-md scale-105 -rotate-2 border-b-4 border-[#8B5E4A]' : 'opacity-80 hover:opacity-100 rotate-1 border-b-2 border-black/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={() => onNavigate('insight')}
          className="bg-[#6B4433] text-white px-6 py-2.5 rounded-full font-serif text-sm hover:opacity-90 transition-all shadow-md shrink-0"
        >
          Start a Story
        </button>
      </header>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-serif font-bold text-[#1A2B3C]">Upcoming Adventures</h2>
          <button className="flex items-center gap-2 text-[#8B5E4A] font-serif hover:opacity-70 transition-opacity">
            <Sparkles className="w-5 h-5" />
            <span className="text-lg">The Timeline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <AnimatePresence mode="wait">
            {adventureData[activeTab].map((adventure) => (
              <motion.div 
                key={adventure.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 ${adventure.tapeColor} z-10 rotate-2`} />
                <div className="bg-white p-4 shadow-xl transform group-hover:rotate-1 transition-transform border border-zinc-100">
                  <div className="aspect-[4/5] overflow-hidden mb-4 rounded-sm">
                    <img 
                      src={adventure.image} 
                      alt={adventure.title} 
                      className="w-full h-full object-cover grayscale-[5%] sepia-[10%] group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="font-serif text-2xl text-[#1A2B3C] mb-1">{adventure.title}</h3>
                  <p className="font-sans text-xs text-slate-400 mb-3">{adventure.time}</p>
                  {adventure.tag && (
                    <span className="inline-block bg-[#F9E1E5] text-[#D64545] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                      {adventure.tag}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1A1A1A] rounded-[2.5rem] p-10 text-center text-white flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
            <div className="w-16 h-16 rounded-full bg-[#8B5E4A] flex items-center justify-center mb-8 relative z-10">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-serif text-3xl italic mb-4 relative z-10">Fate's Whisper</h3>
            <p className="text-slate-400 text-sm mb-10 max-w-[200px] mx-auto relative z-10">
              Let the stars decide your next chapter with a secret plan.
            </p>
            <button className="bg-white/90 text-slate-900 px-8 py-3 rounded-full font-serif text-sm hover:bg-white transition-all relative z-10 shadow-xl active:scale-95">
              Surprise Me
            </button>
          </motion.div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-serif font-bold text-[#1A2B3C]">The Idea Jar</h2>
            <p className="text-slate-400 text-sm font-serif italic">Preserving our precious memories</p>
          </div>
          <div className="flex gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-[#8B5E4A] text-white px-6 py-2 rounded-full font-serif text-sm hover:opacity-90 transition-all shadow-md"
            >
              <Camera className="w-4 h-4" />
              Upload Memory
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <AnimatePresence>
            {memories.map((memory, i) => (
              <motion.div 
                key={memory.id}
                initial={{ opacity: 0, scale: 0.8, rotate: i % 2 === 0 ? 5 : -5 }}
                animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? 2 : -1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative cursor-pointer"
                onClick={() => openEditModal(memory)}
              >
                <button 
                  onClick={(e) => removeMemory(e, memory.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="bg-white p-4 rounded-sm shadow-lg border border-zinc-100 transition-all group-hover:rotate-0 group-hover:shadow-2xl">
                  <div className="aspect-square w-full mb-3 overflow-hidden rounded-sm bg-slate-50">
                    <img 
                      src={memory.image} 
                      alt={memory.title} 
                      className="w-full h-full object-cover grayscale-[10%] sepia-[15%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-500" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <h4 className="font-serif text-lg text-slate-800 truncate">{memory.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{memory.date}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {memories.length === 0 && (
            <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-100 rounded-3xl">
              <Plus className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="font-serif text-slate-300 text-xl italic">Your jar is empty. Add a memory!</p>
            </div>
          )}
        </div>
      </section>

      {/* Memory Edit/Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-serif font-bold text-[#1A2B3C]">
                    {editingMemory ? 'Edit Memory' : 'New Memory'}
                  </h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img 
                      src={editingMemory ? editingMemory.image : pendingImage || ''} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message</label>
                      <input 
                        type="text"
                        value={modalForm.title}
                        onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
                        placeholder="What happened in this moment?"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E4A]/20 focus:border-[#8B5E4A] transition-all font-serif"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date</label>
                      <input 
                        type="text"
                        value={modalForm.date}
                        onChange={(e) => setModalForm({ ...modalForm, date: e.target.value })}
                        placeholder="e.g. April 2024"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E4A]/20 focus:border-[#8B5E4A] transition-all font-serif"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveMemory}
                    className="w-full py-4 bg-[#8B5E4A] text-white rounded-xl font-serif text-lg shadow-lg hover:opacity-90 transition-all active:scale-[0.98]"
                  >
                    {editingMemory ? 'Save Changes' : 'Add to Jar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-12">
        <button 
          onClick={() => onNavigate('explore')}
          className="font-serif italic text-2xl text-slate-300 hover:text-[#8B5E4A] transition-colors flex items-center gap-2 group"
        >
          Explore More Spots <span className="group-hover:translate-x-2 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}
