import React, { useState } from 'react';
import { Search, Star, MapPin, Utensils, CreditCard, Sparkles, Plus, X, MessageSquare, Loader2, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from "@google/genai";
import { spotsData, Spot, Review } from '../constants/spots';

export default function Explore() {
  const [spots, setSpots] = useState<Record<string, Spot[]>>(spotsData);
  const [activeFilter, setActiveFilter] = useState('All Spots');
  const [categories, setCategories] = useState(['All Spots', 'Boutique', 'Cultural', 'Fine Dining', 'AI Recommended']);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  // Interactive states
  const [showReviewsId, setShowReviewsId] = useState<string | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [userCuisine, setUserCuisine] = useState('');
  const [userPriceRange, setUserPriceRange] = useState('');
  const [editingCuisineId, setEditingCuisineId] = useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [isAnalyzingId, setIsAnalyzingId] = useState<string | null>(null);

  const currentSpots = spots[activeFilter] || [];

  const handleAnalyzeReview = async (spotId: string, review: Review) => {
    setIsAnalyzingId(spotId);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following review of a restaurant and extract the most likely cuisine and price range.
        Review: "${review.comment}"
        
        Available Cuisines: Japanese, Western, Korean, Fusion, Heritage, International, Heritage.
        Available Price Ranges: RM10 to RM30, RM30 to RM60, RM60 to RM150, RM150 to RM300, RM300+.
        
        Return a JSON object with 'cuisine' and 'priceRange'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cuisine: { type: Type.STRING },
              priceRange: { type: Type.STRING },
            },
            required: ["cuisine", "priceRange"],
          },
        },
      });

      const result = JSON.parse(response.text);
      
      setSpots(prev => {
        const newSpots = { ...prev };
        Object.keys(newSpots).forEach(cat => {
          newSpots[cat] = newSpots[cat].map(s => {
            if (s.id === spotId) {
              return {
                ...s,
                cuisine: result.cuisine,
                priceRange: result.priceRange,
                isAiDefined: true
              };
            }
            return s;
          });
        });
        return newSpots;
      });
    } catch (error) {
      console.error("AI Analysis failed:", error);
      alert("AI analysis failed. Please try again.");
    } finally {
      setIsAnalyzingId(null);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setActiveFilter(newCategory.trim());
      setNewCategory('');
      setIsAdding(false);
    }
  };

  const handleAddReview = (spotId: string) => {
    if (userRating === 0) return;
    alert(`Review submitted for spot ${spotId}: ${userRating} stars - "${userComment}"\nCuisine: ${userCuisine || 'Not specified'}\nPrice: ${userPriceRange || 'Not specified'}`);
    setUserRating(0);
    setUserComment('');
    setUserCuisine('');
    setUserPriceRange('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32 pt-4">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-serif italic tracking-tight">Discover</h1>
          <div className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        <div className="relative flex items-center mb-6">
          <Search className="absolute left-4 text-primary w-5 h-5" />
          <input 
            className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-1 focus:ring-primary text-sm font-medium" 
            placeholder="Search hidden gems..." 
            type="text" 
          />
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 items-center">
          {categories.map((filter) => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer border ${
                activeFilter === filter 
                  ? 'bg-[#8B5E4A] text-white border-[#8B5E4A] shadow-md' 
                  : 'bg-white border-primary/10 text-slate-500 hover:border-primary/30'
              }`}
            >
              {filter === 'AI Recommended' && <Sparkles className="w-3 h-3 inline-block mr-1 mb-0.5" />}
              {filter}
            </button>
          ))}
          
          {isAdding ? (
            <form onSubmit={handleAddCategory} className="flex items-center gap-2">
              <input 
                autoFocus
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onBlur={() => !newCategory && setIsAdding(false)}
                placeholder="Category name..."
                className="px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border border-primary/20 bg-white focus:outline-none focus:ring-1 focus:ring-primary w-32"
              />
            </form>
          ) : (
            <button 
              onClick={() => setIsAdding(true)}
              className="p-2 rounded-full bg-white border border-primary/10 text-slate-400 hover:text-primary hover:border-primary/30 transition-all flex-shrink-0"
              title="Add Category"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.section 
          key={activeFilter}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-10"
        >
          {currentSpots.length > 0 ? (
            currentSpots.map((spot) => (
              <div key={spot.id} className="flex flex-col gap-6">
                <button 
                  onClick={() => setShowReviewsId(showReviewsId === spot.id ? null : spot.id)}
                  className="relative group overflow-hidden rounded-[2rem] shadow-lg text-left transition-all duration-500 active:scale-[0.98] cursor-pointer ring-offset-4 focus:ring-2 focus:ring-primary/20"
                >
                  <img 
                    src={spot.image} 
                    alt={spot.name} 
                    className="w-full aspect-video object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-500 group-hover:translate-y-[-2px]">
                    {spot.isExclusive && (
                      <span className="text-white/80 text-[9px] font-bold uppercase tracking-[0.3em] mb-2 block hover:text-white transition-colors">
                        Exclusive Feature
                      </span>
                    )}
                    <h2 className="text-white text-2xl font-serif italic mb-1 tracking-tight">{spot.name}</h2>
                    <p className="text-white/90 text-xs font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {spot.location}
                    </p>
                  </div>
                </button>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-serif font-medium tracking-tight">
                      {spot.category === 'AI Recommended' ? 'Tailored for You' : 'The Essence of ' + spot.cuisine}
                    </h3>
                    <div className="flex items-center gap-1 text-primary">
                      <Star className="w-4 h-4 fill-primary" />
                      <span className="text-sm font-bold">{spot.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-[15px] leading-relaxed italic font-serif">
                    {spot.description}
                  </p>
                  
                  <button 
                    onClick={() => setShowReviewsId(showReviewsId === spot.id ? null : spot.id)}
                    className="flex items-center gap-4 py-2 border-y border-primary/10 w-full hover:bg-primary/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <img 
                          key={i}
                          src={`https://i.pravatar.cc/100?img=${i + 10 + parseInt(spot.id)}`} 
                          alt="Reviewer" 
                          className="w-8 h-8 rounded-full border-2 border-background"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary group-hover:underline">
                      {spot.reviewCount} Curator Reviews
                    </span>
                  </button>

                  {/* Reviews Section */}
                  <AnimatePresence>
                    {showReviewsId === spot.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-slate-50 rounded-2xl p-6 space-y-6"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-serif italic text-lg">Curator Insights</h4>
                          <button onClick={() => setShowReviewsId(null)}><X className="w-4 h-4 text-slate-400" /></button>
                        </div>

                        <div className="space-y-4">
                          {spot.reviews.map((review, idx) => (
                            <div key={idx} className="border-b border-slate-200 pb-4 last:border-0">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm">{review.userName}</span>
                                <div className="flex flex-col items-end gap-2">
                                  <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-slate-300'}`} />
                                    ))}
                                  </div>
                                  <button 
                                    onClick={() => handleAnalyzeReview(spot.id, review)}
                                    className="flex items-center gap-1.5 px-2 py-1 bg-primary/5 hover:bg-primary/10 text-primary rounded-full text-[9px] font-bold uppercase tracking-widest transition-all group/ai"
                                  >
                                    <Wand2 className="w-2.5 h-2.5 group-hover/ai:rotate-12 transition-transform" />
                                    Define Spot with AI
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
                              <div className="flex gap-2 mt-2">
                                {review.cuisine && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    {review.cuisine}
                                  </span>
                                )}
                                {review.priceRange && (
                                  <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                                    {review.priceRange}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-1 block">{review.date}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4 border border-slate-100">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Share your experience</p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                  key={star} 
                                  onClick={() => setUserRating(star)}
                                  className="cursor-pointer transition-transform active:scale-90"
                                >
                                  <Star className={`w-7 h-7 ${star <= userRating ? 'fill-primary text-primary' : 'text-slate-100'}`} />
                                </button>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-primary">{userRating > 0 ? `${userRating}/5 Stars` : 'Rate it'}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Cuisine</label>
                              <select 
                                value={userCuisine}
                                onChange={(e) => setUserCuisine(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all appearance-none cursor-pointer"
                              >
                                <option value="">Select Cuisine</option>
                                {['Japanese', 'Western', 'Korean', 'Fusion', 'Heritage', 'Other'].map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1">Price Range</label>
                              <select 
                                value={userPriceRange}
                                onChange={(e) => setUserPriceRange(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all appearance-none cursor-pointer"
                              >
                                <option value="">Select Price</option>
                                {['RM10 to RM30', 'RM30 to RM60', 'RM60 to RM150', 'RM150 to RM300', 'RM300+'].map(p => (
                                  <option key={p} value={p}>{p}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <textarea 
                            value={userComment}
                            onChange={(e) => setUserComment(e.target.value)}
                            placeholder="What made this spot special? (e.g. 'The omakase was divine...')"
                            className="w-full p-4 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/30 transition-all min-h-[100px] resize-none"
                          />
                          
                          <button 
                            onClick={() => handleAddReview(spot.id)}
                            disabled={userRating === 0}
                            className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg ${
                              userRating > 0 
                                ? 'bg-primary text-white shadow-primary/20 hover:translate-y-[-2px] active:translate-y-[0px]' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                            }`}
                          >
                            Submit Curator Review
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Cuisine Selector */}
                  <div className="relative">
                    <button 
                      onClick={() => setEditingCuisineId(editingCuisineId === spot.id ? null : spot.id)}
                      className={`w-full p-4 rounded-2xl flex items-center gap-3 shadow-sm transition-all text-left cursor-pointer border ${
                        editingCuisineId === spot.id ? 'bg-[#8B5E4A]/5 border-[#8B5E4A]/30 ring-2 ring-[#8B5E4A]/10' : 'bg-white border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        editingCuisineId === spot.id ? 'bg-[#8B5E4A] text-white' : 'bg-[#8B5E4A]/10 text-[#8B5E4A]'
                      }`}>
                        {isAnalyzingId === spot.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Utensils className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold">Cuisine</p>
                          {(spot as any).isAiDefined && (
                            <span className="flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                              <Sparkles className="w-2 h-2" />
                              AI
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold">{isAnalyzingId === spot.id ? 'Analyzing...' : spot.cuisine}</p>
                      </div>
                    </button>
                    <AnimatePresence>
                      {editingCuisineId === spot.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full mb-3 left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 space-y-2"
                        >
                          <div className="flex justify-between items-center mb-2 px-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Cuisine</p>
                            <button onClick={() => setEditingCuisineId(null)}><X className="w-3 h-3 text-slate-400" /></button>
                          </div>
                          {['Japanese', 'Western', 'Korean', 'Fusion', 'Heritage'].map(c => (
                            <button 
                              key={c}
                              onClick={() => {
                                alert(`Cuisine changed to ${c}`);
                                setEditingCuisineId(null);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${
                                spot.cuisine === c ? 'bg-[#8B5E4A] text-white shadow-lg shadow-[#8B5E4A]/20' : 'hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              {c}
                              {spot.cuisine === c && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </button>
                          ))}
                          <div className="pt-2 border-t border-slate-100">
                            <div className="relative group">
                              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 group-focus-within:text-[#8B5E4A] transition-colors" />
                              <input 
                                placeholder="Add custom..."
                                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B5E4A]/20 focus:bg-white transition-all border border-transparent focus:border-[#8B5E4A]/30"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    alert(`Custom cuisine added: ${e.currentTarget.value}`);
                                    setEditingCuisineId(null);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Price Range Selector */}
                  <div className="relative">
                    <button 
                      onClick={() => setEditingPriceId(editingPriceId === spot.id ? null : spot.id)}
                      className={`w-full p-4 rounded-2xl flex items-center gap-3 shadow-sm transition-all text-left cursor-pointer border ${
                        editingPriceId === spot.id ? 'bg-[#8B5E4A]/5 border-[#8B5E4A]/30 ring-2 ring-[#8B5E4A]/10' : 'bg-white border-transparent hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        editingPriceId === spot.id ? 'bg-[#8B5E4A] text-white' : 'bg-[#8B5E4A]/10 text-[#8B5E4A]'
                      }`}>
                        {isAnalyzingId === spot.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <CreditCard className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold">Price Range</p>
                          {(spot as any).isAiDefined && (
                            <span className="flex items-center gap-0.5 text-[8px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                              <Sparkles className="w-2 h-2" />
                              AI
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold">{isAnalyzingId === spot.id ? 'Analyzing...' : spot.priceRange}</p>
                      </div>
                    </button>
                    <AnimatePresence>
                      {editingPriceId === spot.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-full mb-3 left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 space-y-2"
                        >
                          <div className="flex justify-between items-center mb-2 px-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Select Range</p>
                            <button onClick={() => setEditingPriceId(null)}><X className="w-3 h-3 text-slate-400" /></button>
                          </div>
                          {['RM10 to RM30', 'RM30 to RM60', 'RM60 to RM150', 'RM150 to RM300', 'RM300+'].map(p => (
                            <button 
                              key={p}
                              onClick={() => {
                                alert(`Price range changed to ${p} per pax`);
                                setEditingPriceId(null);
                              }}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${
                                spot.priceRange === p ? 'bg-[#8B5E4A] text-white shadow-lg shadow-[#8B5E4A]/20' : 'hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {p}
                                <span className={`text-[10px] ${spot.priceRange === p ? 'text-white/60' : 'text-slate-400'}`}>per pax</span>
                              </span>
                              {spot.priceRange === p && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </button>
                          ))}
                          <div className="pt-2 border-t border-slate-100">
                            <div className="relative group">
                              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 group-focus-within:text-[#8B5E4A] transition-colors" />
                              <input 
                                placeholder="Other range..."
                                className="w-full pl-8 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#8B5E4A]/20 focus:bg-white transition-all border border-transparent focus:border-[#8B5E4A]/30"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    alert(`Custom price range added: ${e.currentTarget.value}`);
                                    setEditingPriceId(null);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Sparkles className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-serif italic text-lg">No spots discovered in this category yet.</p>
              <p className="text-xs uppercase tracking-widest mt-2">Try exploring another filter</p>
            </div>
          )}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
