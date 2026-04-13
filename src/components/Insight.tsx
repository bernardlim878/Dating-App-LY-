import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, ChevronRight, Umbrella, Sparkles, Map, PlusCircle, Calendar, MapPin, Check, Plus, Trash2, Clock, Search, X, Share2, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { spotsData, Spot } from '../constants/spots';
import { UserProfile } from '../types';

interface Story {
  id: string;
  title: string;
  likes: string;
  activities: number;
  author: string;
  category: string;
  vibe: string;
  date: string;
  places: string[];
  reservationNeeded?: boolean;
}

interface InsightProps {
  initialMode?: 'gallery' | 'create';
  profile: UserProfile;
}

export default function Insight({ initialMode = 'gallery', profile }: InsightProps) {
  const [mode, setMode] = useState<'gallery' | 'create'>(initialMode);
  
  // Create Story State
  const [occasions, setOccasions] = useState(['Anniversary', 'Birthday', 'First Date', 'Just Because']);
  const [vibes, setVibes] = useState(['Romantic', 'Adventurous', 'Cozy', 'Elegant', 'Spontaneous']);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [places, setPlaces] = useState<string[]>([]);
  const [newPlace, setNewPlace] = useState('');
  const [date, setDate] = useState('');
  const [reservationNeeded, setReservationNeeded] = useState(false);
  const [showExplorePicker, setShowExplorePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [viewingStoryId, setViewingStoryId] = useState<string | null>(null);
  const [showHolidays, setShowHolidays] = useState(false);
  const [showSpecialDates, setShowSpecialDates] = useState(false);
  const [specialDateType, setSpecialDateType] = useState<'Birthdays' | 'Anniversaries' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All Ideas');
  const [showAllStories, setShowAllStories] = useState(false);

  const malaysianHolidays = [
    { name: "New Year's Day", date: "Jan 1", day: "Wednesday" },
    { name: "Chinese New Year", date: "Feb 10-11", day: "Sat-Sun" },
    { name: "Hari Raya Aidilfitri", date: "Apr 10-11", day: "Wed-Thu" },
    { name: "Labour Day", date: "May 1", day: "Wednesday" },
    { name: "Wesak Day", date: "May 22", day: "Wednesday" },
    { name: "King's Birthday", date: "Jun 3", day: "Monday" },
    { name: "Hari Raya Haji", date: "Jun 17", day: "Monday" },
    { name: "Awal Muharram", date: "Jul 7", day: "Sunday" },
    { name: "National Day", date: "Aug 31", day: "Saturday" },
    { name: "Malaysia Day", date: "Sep 16", day: "Monday" },
    { name: "Deepavali", date: "Oct 31", day: "Thursday" },
    { name: "Christmas Day", date: "Dec 25", day: "Wednesday" }
  ];

  // Gallery State
  const [stories, setStories] = useState<Story[]>([
    {
      id: '1',
      title: 'KL Skyline Date Night',
      likes: '3.4k',
      activities: 4,
      author: '@romantic_planner',
      category: 'Anniversaries',
      vibe: 'Romantic',
      date: '2024-04-15',
      places: ['Uo Shin', 'Sky Bar']
    },
    {
      id: 'trending-1',
      title: '3D2N Terengganu Heritage Tour',
      likes: '1.2k',
      activities: 4,
      author: '@travel_enthusiast',
      category: 'Malaysian Holidays',
      vibe: 'Adventurous',
      date: '2024-08-31',
      places: ['Pasar Payang', 'Crystal Mosque', 'Islamic Heritage Park', 'Redang Island']
    },
    {
      id: 'trending-2',
      title: 'Anniversary Night at Old Klang',
      likes: '856',
      activities: 4,
      author: '@romantic_planner',
      category: 'Anniversaries',
      vibe: 'Romantic',
      date: '2024-10-14',
      places: ['Old Klang Road Cafe', 'Mid Valley Megamall', 'The Gardens Mall', 'Speakeasy Bar']
    }
  ]);

  const toggleVibe = (vibe: string) => {
    setSelectedVibes(prev => 
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    );
  };

  const addPlace = (placeName: string) => {
    if (placeName.trim()) {
      setPlaces([...places, placeName.trim()]);
      setNewPlace('');
      toast.success('Place added to your itinerary!');
    }
  };

  const removePlace = (index: number) => {
    setPlaces(places.filter((_, i) => i !== index));
    toast.info('Place removed');
  };

  const handleEditStory = (story: Story) => {
    setSelectedOccasion(story.category);
    setSelectedVibes([story.vibe]);
    setPlaces(story.places);
    setDate(story.date);
    setReservationNeeded(story.reservationNeeded || false);
    setEditingStoryId(story.id);
    setMode('create');
  };

  const handleShare = (story: Story) => {
    const shareData = {
      title: story.title,
      text: `Check out my trip: ${story.title} with ${story.activities} activities!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleViewStory = (storyId: string) => {
    setViewingStoryId(storyId);
  };

  const handleGenerate = () => {
    if (!selectedOccasion) {
      toast.error('Please select an occasion');
      return;
    }
    if (selectedVibes.length === 0) {
      toast.error('Please set at least one vibe');
      return;
    }
    if (places.length === 0) {
      toast.error('Please add at least one place to visit');
      return;
    }
    if (!date) {
      toast.error('Please choose a date');
      return;
    }

    if (editingStoryId) {
      setStories(stories.map(s => s.id === editingStoryId ? {
        ...s,
        title: `${selectedOccasion} Special`,
        activities: places.length,
        category: selectedOccasion,
        vibe: selectedVibes[0],
        date: date,
        places: places,
        reservationNeeded: reservationNeeded
      } : s));
      toast.success('Story updated successfully!');
    } else {
      const newStory: Story = {
        id: Date.now().toString(),
        title: `${selectedOccasion} Special`,
        likes: '0',
        activities: places.length,
        author: '@me',
        category: selectedOccasion,
        vibe: selectedVibes[0],
        date: date,
        places: places,
        reservationNeeded: reservationNeeded
      };
      setStories([newStory, ...stories]);
      toast.success('Generated! Your story is now in Community Favorites.');
    }

    setMode('gallery');
    setEditingStoryId(null);
    
    // Reset form
    setSelectedOccasion(null);
    setSelectedVibes([]);
    setPlaces([]);
    setDate('');
    setReservationNeeded(false);
  };

  const allSpots = spotsData['All Spots'];
  const filteredSpots = allSpots.filter(spot => 
    spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spot.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-background font-sans text-slate-800 antialiased">
        <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl px-6 py-5 flex items-center justify-between">
          <button 
            onClick={() => {
              setMode('gallery');
              setEditingStoryId(null);
            }}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border-2 border-slate-100 active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600 font-bold" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            {editingStoryId ? 'Edit Story' : 'Create a Story'}
          </h1>
          <div className="w-12" />
        </nav>

        <main className="max-w-2xl mx-auto pb-48 px-6 pt-8 space-y-8">
          {/* Occasion Section */}
          <div className="bg-white rounded-[2.5rem] p-8 border-b-8 border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-extrabold flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                What's the occasion?
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {occasions.map((occ) => (
                <button 
                  key={occ} 
                  onClick={() => setSelectedOccasion(occ)}
                  className={`p-6 rounded-3xl border-2 transition-all text-left font-bold relative group ${
                    selectedOccasion === occ 
                      ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                      : 'border-slate-100 hover:border-primary/40'
                  }`}
                >
                  {occ}
                  {selectedOccasion === occ && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
              <button 
                onClick={() => {
                  const val = prompt('Enter custom occasion:');
                  if (val) setOccasions([...occasions, val]);
                }}
                className="p-6 rounded-3xl border-2 border-dashed border-slate-200 hover:border-primary/40 transition-all text-left font-bold text-slate-400 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Custom
              </button>
            </div>
          </div>

          {/* Vibe Section */}
          <div className="bg-white rounded-[2.5rem] p-8 border-b-8 border-slate-100 shadow-sm">
            <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-500" />
              Set the vibe
            </h2>
            <div className="flex flex-wrap gap-3">
              {vibes.map((vibe) => (
                <button 
                  key={vibe} 
                  onClick={() => toggleVibe(vibe)}
                  className={`px-6 py-3 rounded-full border-2 transition-all font-bold ${
                    selectedVibes.includes(vibe)
                      ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                      : 'border-slate-100 text-slate-600 hover:border-primary/40'
                  }`}
                >
                  {vibe}
                </button>
              ))}
              <button 
                onClick={() => {
                  const val = prompt('Enter custom vibe:');
                  if (val) setVibes([...vibes, val]);
                }}
                className="px-6 py-3 rounded-full border-2 border-dashed border-slate-200 text-slate-400 font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          {/* Places Section */}
          <div className="bg-white rounded-[2.5rem] p-8 border-b-8 border-slate-100 shadow-sm">
            <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3">
              <MapPin className="w-8 h-8 text-sky-500" />
              Places to visit
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input 
                  type="text"
                  value={newPlace}
                  onChange={(e) => setNewPlace(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlace(newPlace)}
                  placeholder="e.g. Old Klang Road Cafe"
                  className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 outline-none font-bold transition-all"
                />
                <button 
                  onClick={() => setShowExplorePicker(true)}
                  className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus className="w-8 h-8" />
                </button>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {places.map((place, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border-2 border-slate-100 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-black shadow-sm">
                          {idx + 1}
                        </div>
                        <span className="font-bold">{place}</span>
                      </div>
                      <button 
                        onClick={() => removePlace(idx)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Date & Reservation Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-8 border-b-8 border-slate-100 shadow-sm">
              <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-indigo-500" />
                Choose Date
              </h2>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 outline-none font-bold transition-all"
              />
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border-b-8 border-slate-100 shadow-sm">
              <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-500" />
                Reservation?
              </h2>
              <button 
                onClick={() => setReservationNeeded(!reservationNeeded)}
                className={`w-full py-4 rounded-2xl border-2 font-bold transition-all flex items-center justify-center gap-3 ${
                  reservationNeeded 
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-lg shadow-amber-500/10' 
                    : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                {reservationNeeded ? (
                  <>
                    <Check className="w-5 h-5" />
                    Yes, please!
                  </>
                ) : (
                  'Not needed'
                )}
              </button>
            </div>
          </div>
        </main>

        {/* Explore Picker Modal */}
        <AnimatePresence>
          {showExplorePicker && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowExplorePicker(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
              >
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black">Choose from Explore</h3>
                    <button onClick={() => setShowExplorePicker(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text"
                      placeholder="Search spots..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-primary/30 outline-none font-bold"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                  {filteredSpots.map((spot) => (
                    <button 
                      key={spot.id}
                      onClick={() => {
                        addPlace(spot.name);
                        setShowExplorePicker(false);
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-3xl border-2 border-slate-50 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                    >
                      <img src={spot.image} alt={spot.name} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{spot.name}</h4>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {spot.location}
                        </p>
                      </div>
                      <PlusCircle className="w-6 h-6 text-primary" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none z-50">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <button 
              onClick={handleGenerate}
              className="w-full h-20 bg-primary text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl border-b-8 border-black/10 active:border-b-0 active:translate-y-1 transition-all"
            >
              {editingStoryId ? 'Update Story' : 'Generate Story'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const viewingStory = stories.find(s => s.id === viewingStoryId);

  return (
    <div className="min-h-screen bg-background font-sans text-slate-800 antialiased">
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl px-6 py-5 flex items-center justify-between">
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border-2 border-slate-100 active:scale-90 transition-transform">
          <ArrowLeft className="w-6 h-6 text-slate-600 font-bold" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Insight Gallery</h1>
        <div className="w-12" />
      </nav>

      <main className="max-w-2xl mx-auto pb-40 px-6">
        <section className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight">Community Favorites</h2>
            <button className="text-primary text-sm font-bold bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
              View leaderboard
            </button>
          </div>
          
          <div className="space-y-4">
            {stories.map((story) => (
              <div key={story.id} className="relative group flex items-center gap-5 bg-white p-6 rounded-[2.5rem] border-b-4 border-r-4 border-slate-200 shadow-sm overflow-hidden">
                <div 
                  onClick={() => handleViewStory(story.id)}
                  className="w-20 h-20 rounded-3xl bg-orange-100 flex items-center justify-center shrink-0 border-2 border-orange-200 rotate-3 group-hover:rotate-0 transition-transform cursor-pointer"
                >
                  <Sparkles className="w-10 h-10 text-orange-500 fill-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 
                    onClick={() => handleViewStory(story.id)}
                    className="font-bold text-xl truncate cursor-pointer hover:text-primary transition-colors"
                  >
                    {story.title}
                  </h4>
                  <div className="flex flex-col gap-1 mt-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-500 flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-primary fill-primary" /> {story.likes} likes
                      </span>
                      <span className="text-sm text-slate-400 font-bold">• {story.activities} activities</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium truncate">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {story.places.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleEditStory(story)}
                    className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleShare(story)}
                    className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Story Detail View Modal */}
        <AnimatePresence>
          {viewingStory && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setViewingStoryId(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
              >
                <div className="p-8 border-b border-slate-100 bg-primary/5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-4 py-1.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                      {viewingStory.category}
                    </span>
                    <button onClick={() => setViewingStoryId(null)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <h3 className="text-3xl font-black mb-2">{viewingStory.title}</h3>
                  <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                    <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-primary fill-primary" /> {viewingStory.likes}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {viewingStory.date}</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-500" /> {viewingStory.vibe}</span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">The Itinerary</h4>
                    <div className="space-y-4">
                      {viewingStory.places.map((place, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-slate-100">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sm font-black shadow-sm shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-lg">{place}</p>
                            <p className="text-xs text-slate-400 font-medium">Activity {idx + 1}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-indigo-50 rounded-3xl border-2 border-indigo-100">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Date</p>
                      <p className="font-bold text-indigo-900">{viewingStory.date}</p>
                    </div>
                    <div className="p-5 bg-amber-50 rounded-3xl border-2 border-amber-100">
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Reservation</p>
                      <p className="font-bold text-amber-900">{viewingStory.reservationNeeded ? 'Confirmed' : 'Not required'}</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  <button 
                    onClick={() => {
                      handleEditStory(viewingStory);
                      setViewingStoryId(null);
                    }}
                    className="flex-1 h-16 bg-white border-2 border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-primary/30 transition-all"
                  >
                    <Edit3 className="w-5 h-5" /> Edit Plan
                  </button>
                  <button 
                    onClick={() => handleShare(viewingStory)}
                    className="flex-1 h-16 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    <Share2 className="w-5 h-5" /> Share Trip
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <section className="mt-8 mb-8">
          <div className="flex overflow-x-auto no-scrollbar gap-4 py-2">
            {[
              { id: 'All Ideas', label: 'All Ideas' },
              { id: 'Malaysian Holidays', label: 'Malaysian Holidays' },
              { id: 'Anniversaries', label: 'Anniversaries' },
              { id: 'Birthdays', label: 'Birthdays' }
            ].map((cat) => (
              <button 
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (cat.id === 'Malaysian Holidays') {
                    setShowHolidays(true);
                  } else if (cat.id === 'Anniversaries' || cat.id === 'Birthdays') {
                    setSpecialDateType(cat.id as any);
                    setShowSpecialDates(true);
                  } else {
                    toast.info(`Showing ${cat.label} ideas`);
                  }
                }}
                className={`shrink-0 px-8 py-3 rounded-full text-base font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-xl border-b-4 border-primary/20'
                    : 'bg-white text-slate-600 border-2 border-slate-100 hover:border-primary/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Malaysian Holidays Modal */}
        <AnimatePresence>
          {showHolidays && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowHolidays(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
              >
                <div className="p-8 border-b border-slate-100 bg-sky-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-black text-sky-900">Malaysian Holidays</h3>
                    <button onClick={() => setShowHolidays(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-sky-600 font-bold text-sm">Plan your long weekends! 🇲🇾</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
                  {malaysianHolidays.map((holiday, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{holiday.name}</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{holiday.day}</span>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-xl border-2 border-slate-100 shadow-sm">
                        <span className="font-black text-primary">{holiday.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setShowHolidays(false);
                      setMode('create');
                      setSelectedOccasion('Malaysian Holidays');
                    }}
                    className="w-full h-16 bg-primary text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all"
                  >
                    Plan a Holiday Trip
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Special Dates Modal (Birthdays/Anniversaries) */}
        <AnimatePresence>
          {showSpecialDates && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSpecialDates(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[70vh]"
              >
                <div className={`p-8 border-b border-slate-100 ${specialDateType === 'Birthdays' ? 'bg-rose-50' : 'bg-primary/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-2xl font-black ${specialDateType === 'Birthdays' ? 'text-rose-900' : 'text-primary'}`}>
                      {specialDateType === 'Birthdays' ? "Partner's Birthday" : "Your Anniversaries"}
                    </h3>
                    <button onClick={() => setShowSpecialDates(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <p className={`${specialDateType === 'Birthdays' ? 'text-rose-600' : 'text-primary/60'} font-bold text-sm`}>
                    {specialDateType === 'Birthdays' ? `Don't forget ${profile.partnerName}'s big day!` : "Celebrating your journey together."}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
                  {specialDateType === 'Birthdays' ? (
                    <div className="flex items-center justify-between p-5 bg-rose-50/30 rounded-2xl border-2 border-rose-100">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{profile.partnerName}'s Birthday</span>
                        <span className="text-xs text-rose-400 font-bold uppercase tracking-widest">Special Day</span>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-xl border-2 border-rose-100 shadow-sm">
                        <span className="font-black text-rose-500">{profile.partnerBirthday}</span>
                      </div>
                    </div>
                  ) : (
                    profile.anniversaries.map((ann, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{ann.title}</span>
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Anniversary</span>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl border-2 border-slate-100 shadow-sm">
                          <span className="font-black text-primary">{ann.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      setShowSpecialDates(false);
                      setMode('create');
                      setSelectedOccasion(specialDateType === 'Birthdays' ? 'Birthday' : 'Anniversary');
                      if (specialDateType === 'Birthdays') {
                        // Try to parse date or just set a placeholder
                        toast.info(`Planning for ${profile.partnerBirthday}`);
                      }
                    }}
                    className={`w-full h-16 ${specialDateType === 'Birthdays' ? 'bg-rose-500' : 'bg-primary'} text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all`}
                  >
                    Plan this Special Day
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight">Trending Itineraries</h2>
            <button 
              onClick={() => setShowAllStories(!showAllStories)}
              className="text-primary font-bold hover:underline"
            >
              {showAllStories ? 'Show less' : 'See all'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            {stories
              .filter(s => showAllStories ? true : s.id.startsWith('trending'))
              .map((story, idx) => (
                <motion.div 
                  key={story.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }} 
                  onClick={() => handleViewStory(story.id)}
                  className={`group flex flex-col bg-white rounded-[3rem] p-5 border-2 border-slate-100 shadow-sm cursor-pointer ${!showAllStories && idx === 1 ? 'mt-8' : ''}`}
                >
                  <div className={`relative flex-1 min-h-[140px] rounded-[2.5rem] flex items-center justify-center mb-5 overflow-hidden transition-transform ${idx % 2 === 0 ? 'bg-sky-100 -rotate-2 group-hover:rotate-0' : 'bg-rose-100 rotate-2 group-hover:rotate-0'}`}>
                    {idx % 2 === 0 ? <Umbrella className="w-16 h-16 text-sky-400" /> : <Heart className="w-16 h-16 text-rose-400" />}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <Heart className="w-3 h-3 text-primary fill-primary" /> {story.likes}
                    </div>
                  </div>
                  <div>
                    <span className={`text-[11px] font-black uppercase tracking-wider mb-2 block ${idx % 2 === 0 ? 'text-sky-600' : 'text-rose-600'}`}>
                      {story.category}
                    </span>
                    <h3 className="text-base font-bold leading-snug mb-3">{story.title}</h3>
                    <p className="text-[11px] font-bold text-slate-400">{story.author}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <button 
            onClick={() => setMode('create')}
            className="w-full h-20 bg-primary text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl border-b-8 border-black/10 active:border-b-0 active:translate-y-1 transition-all"
          >
            <PlusCircle className="w-10 h-10" />
            Start from Scratch
          </button>
        </div>
      </div>
    </div>
  );
}
