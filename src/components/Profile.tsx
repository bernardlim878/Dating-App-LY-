import React, { useState } from 'react';
import { Settings, Edit3, Heart, User, Cake, FileText, Calendar, PartyPopper, ChevronRight, Bell, Lock, HelpCircle, ArrowLeft, Camera, Check, X, Plus, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export default function Profile({ profile, onUpdateProfile }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(profile);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isSendingEnquiry, setIsSendingEnquiry] = useState(false);
  const [contactForm, setContactForm] = useState({ title: '', email: profile.name.toLowerCase().replace(' ', '.') + '@gmail.com', enquiry: '' });
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSave = () => {
    onUpdateProfile(editForm);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="max-w-md mx-auto bg-background min-h-screen pb-32">
        <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-5 border-b border-border-muted">
          <div className="flex items-center gap-3">
            <button onClick={handleCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
          </div>
          <button 
            onClick={handleSave}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Check className="w-6 h-6" />
          </button>
        </header>

        <main className="p-6 space-y-8">
          {/* Avatar Edit */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden">
                <img 
                  src={editForm.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button 
                onClick={() => {
                  const url = prompt('Enter image URL:');
                  if (url) setEditForm({ ...editForm, avatar: url });
                }}
                className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Change Photo</p>
          </div>

          {/* Personal Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
              <input 
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-primary/30 outline-none font-bold transition-all shadow-sm"
              />
            </div>

            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Heart className="w-6 h-6 text-primary fill-primary" />
                Partner's Details
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text"
                      value={editForm.partnerName}
                      onChange={(e) => setEditForm({ ...editForm, partnerName: e.target.value })}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 outline-none font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Birthday</label>
                  <div className="relative">
                    <Cake className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text"
                      value={editForm.partnerBirthday}
                      onChange={(e) => setEditForm({ ...editForm, partnerBirthday: e.target.value })}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 outline-none font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Notes</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                    <textarea 
                      value={editForm.partnerNotes}
                      onChange={(e) => setEditForm({ ...editForm, partnerNotes: e.target.value })}
                      rows={3}
                      className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 outline-none font-bold transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Favorite Cuisines</label>
                <button 
                  onClick={() => {
                    const c = prompt('Add cuisine:');
                    if (c) setEditForm({ ...editForm, cuisines: [...editForm.cuisines, c] });
                  }}
                  className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editForm.cuisines.map((c, i) => (
                  <span key={i} className="px-4 py-2 bg-white border-2 border-slate-100 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm">
                    {c}
                    <button onClick={() => setEditForm({ ...editForm, cuisines: editForm.cuisines.filter((_, idx) => idx !== i) })}>
                      <X className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Shared Hobbies</label>
                <button 
                  onClick={() => {
                    const h = prompt('Add hobby:');
                    if (h) setEditForm({ ...editForm, hobbies: [...editForm.hobbies, h] });
                  }}
                  className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editForm.hobbies.map((h, i) => (
                  <span key={i} className="px-4 py-2 bg-white border-2 border-slate-100 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm">
                    {h}
                    <button onClick={() => setEditForm({ ...editForm, hobbies: editForm.hobbies.filter((_, idx) => idx !== i) })}>
                      <X className="w-3 h-3 text-slate-400 hover:text-rose-500" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen pb-32">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white/80 backdrop-blur-md px-6 py-5 border-b border-border-muted">
        <h1 className="text-3xl font-serif font-semibold tracking-tight">Profile</h1>
        <button 
          onClick={() => setIsEditing(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-primary hover:text-white transition-all shadow-sm"
        >
          <Settings className="w-6 h-6" />
        </button>
      </header>

      <section className="p-6">
        <div className="flex items-center gap-5 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-cover bg-center border-4 border-white shadow-md overflow-hidden">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-slate-500 text-sm font-medium">Member since {profile.memberSince}</p>
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-2 text-primary font-bold text-sm hover:underline"
            >
              View and edit profile
            </button>
          </div>
        </div>

        <div className="bg-white border border-border-muted rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-5">
            <div>
              <h3 className="font-bold text-xl mb-0.5">Partner's Details</h3>
              <p className="text-slate-400 text-sm">Everything about {profile.partnerName.split(' ')[0]}</p>
            </div>
            <div className="bg-background p-2 rounded-full">
              <Heart className="w-5 h-5 text-primary fill-primary" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-slate-300" />
              <span className="text-slate-700 font-medium">{profile.partnerName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Cake className="w-5 h-5 text-slate-300" />
              <span className="text-slate-700 font-medium">{profile.partnerBirthday}</span>
            </div>
            <div className="flex items-start gap-3 pt-1">
              <FileText className="w-5 h-5 text-slate-300 shrink-0" />
              <p className="text-slate-600 text-[15px] leading-relaxed italic font-serif">
                "{profile.partnerNotes}"
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-2">
        <h3 className="text-xl font-bold mb-4">Important Anniversaries</h3>
        <div className="flex flex-col gap-3">
          {profile.anniversaries.map((anniversary) => (
            <button 
              key={anniversary.title} 
              onClick={() => toast.info(`Viewing details for ${anniversary.title}`)}
              className="w-full flex items-center justify-between bg-white p-4 rounded-2xl border border-border-muted shadow-sm group active:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-background flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-[15px]">{anniversary.title}</p>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{anniversary.date}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 py-8">
        <h3 className="text-xl font-bold mb-5 text-slate-900">Shared Preferences</h3>
        <div className="space-y-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-3">Favorite Cuisines</p>
            <div className="flex flex-wrap gap-2">
              {profile.cuisines.map(c => (
                <button 
                  key={c} 
                  onClick={() => toast.info(`Filtering by ${c} cuisine`)}
                  className="px-5 py-2 bg-white border border-border-muted rounded-full text-sm font-medium text-slate-700 shadow-sm hover:border-primary/40 transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-3">Shared Hobbies</p>
            <div className="flex flex-wrap gap-2">
              {profile.hobbies.map(h => (
                <button 
                  key={h} 
                  onClick={() => toast.info(`Exploring ${h} activities`)}
                  className="px-5 py-2 bg-white border border-border-muted rounded-full text-sm font-medium text-slate-700 shadow-sm hover:border-primary/40 transition-colors"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <h3 className="text-xl font-bold mb-4">Settings & Support</h3>
        <div className="bg-white border border-border-muted rounded-2xl overflow-hidden shadow-sm">
          {[
            { label: 'Notifications', icon: Bell, onClick: () => setShowNotifications(true) },
            { label: 'Privacy & Sharing', icon: Lock, onClick: () => setShowPrivacy(true) },
            { label: 'Help Center', icon: HelpCircle, onClick: () => setShowHelp(true) },
            { label: 'Contact Support', icon: MessageSquare, onClick: () => setShowContact(true) }
          ].map((item, i, arr) => (
            <button 
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between p-5 text-slate-700 active:bg-slate-50 transition-colors ${i !== arr.length - 1 ? 'border-b border-border-muted' : ''}`}
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-5 h-5 text-slate-400" />
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>
          ))}
        </div>
        <button 
          onClick={() => {
            if (confirm('Are you sure you want to log out?')) {
              toast.info('Logging out...');
              setTimeout(() => window.location.reload(), 1000);
            }
          }}
          className="w-full mt-8 py-4 px-4 bg-white border border-border-muted rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          Log out
        </button>
      </section>

      {/* Notifications Modal */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-slate-900">Notifications</h3>
                  <button onClick={() => setShowNotifications(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-slate-500 font-bold text-sm">Manage how we reach you</p>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Email Notifications</p>
                    <p className="text-xs text-slate-400 font-medium">Weekly trip ideas & updates</p>
                  </div>
                  <button 
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${emailNotifications ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: emailNotifications ? 24 : 4 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">Push Notifications</p>
                    <p className="text-xs text-slate-400 font-medium">Real-time alerts & reminders</p>
                  </div>
                  <button 
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${pushNotifications ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <motion.div 
                      animate={{ x: pushNotifications ? 24 : 4 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    toast.success('Notification settings saved!');
                  }}
                  className="w-full h-16 bg-primary text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy & Sharing Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacy(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-slate-900">User Agreement</h3>
                  <button onClick={() => setShowPrivacy(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-slate-500 font-bold text-sm">Privacy Policy & Terms of Service</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                <section>
                  <h4 className="font-black text-slate-800 mb-2 uppercase tracking-widest text-xs">1. Data Collection</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We collect information you provide directly to us, such as when you create or modify your profile, request services, or communicate with us. This includes your name, partner's details, and preferences.
                  </p>
                </section>

                <section>
                  <h4 className="font-black text-slate-800 mb-2 uppercase tracking-widest text-xs">2. Use of Information</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, such as to personalize your experience and suggest the best itineraries for your special occasions.
                  </p>
                </section>

                <section>
                  <h4 className="font-black text-slate-800 mb-2 uppercase tracking-widest text-xs">3. Sharing of Information</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We do not share your personal information with third parties except as described in this policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
                  </p>
                </section>

                <section>
                  <h4 className="font-black text-slate-800 mb-2 uppercase tracking-widest text-xs">4. Security</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                  </p>
                </section>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setShowPrivacy(false)}
                  className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Help Center Modal */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-slate-100 bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-primary">Help Center</h3>
                  <button onClick={() => setShowHelp(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-primary/60 font-bold text-sm">Find answers to common questions</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {[
                  { q: "How do I reset my password?", a: "Go to the login screen and click 'Forgot Password'. Follow the instructions sent to your email." },
                  { q: "Can I change my partner's birthday?", a: "Yes! Go to Profile > Edit Profile and update the birthday field under Partner's Details." },
                  { q: "How do I create a new itinerary?", a: "Tap the 'Insight' tab and click the large '+' button at the bottom to start planning." },
                  { q: "Is my data shared with others?", a: "No, your personal and partner data is private. Only stories you explicitly share are visible to others." },
                  { q: "How do I add a place to my trip?", a: "In the 'Create Story' mode, click the '+' icon in the Places section to pick from our curated spots." },
                  { q: "What are 'Vibes'?", a: "Vibes help our AI suggest the best activities. Choose from Romantic, Adventurous, Cozy, and more." },
                  { q: "How do I delete a saved story?", a: "Open the story in Insight, click 'Edit', and look for the trash icon at the top." },
                  { q: "Can I use the app offline?", a: "Most features require an internet connection to fetch the latest spots and sync your data." },
                  { q: "How do notifications work?", a: "We send reminders for upcoming anniversaries and birthdays so you never miss a special day." },
                  { q: "What is the 'Explore' tab?", a: "Explore is where you discover new restaurants, parks, and activities curated by our team." },
                  { q: "How do I update my avatar?", a: "In Edit Profile, click the camera icon on your photo to enter a new image URL." },
                  { q: "Can I export my itinerary?", a: "Yes, use the 'Share' button inside any story to send a link to your partner." },
                  { q: "What if a place is closed?", a: "We try to keep info updated, but always recommend checking the official website before visiting." },
                  { q: "How do I change my name?", a: "You can update your display name anytime in the Edit Profile section." },
                  { q: "Are there any subscription fees?", a: "The basic features of the app are free. Premium planning tools may be added in the future." },
                  { q: "How do I contact support?", a: "Click the 'Contact Support' button in the Settings menu to send us a direct enquiry. We'll reply within 3 working days." },
                  { q: "Can I add multiple partners?", a: "Currently, we support one primary partner profile to keep your planning focused." },
                  { q: "How do I save a spot for later?", a: "In the Explore tab, you can 'Like' any spot to save it to your favorites." },
                  { q: "What are 'Malaysian Holidays'?", a: "A curated list of public holidays in Malaysia to help you plan long weekend getaways." },
                  { q: "How do I log out?", a: "Scroll to the bottom of the Profile tab and click the 'Log out' button." },
                  { q: "What is the 'Insight' tab for?", a: "It's your personal journal of planned trips and a gallery of trending itineraries from the community." },
                  { q: "How does the 'Explore Picker' work?", a: "When creating a story, the picker lets you search and select spots directly from our database." },
                  { q: "Can I edit a trending itinerary?", a: "Yes! Open any trending itinerary and click 'Edit Plan' to customize it for yourself." },
                  { q: "What are 'Shared Preferences'?", a: "These are cuisines and hobbies you and your partner both enjoy, used to personalize suggestions." },
                  { q: "How do I add an anniversary?", a: "Currently, anniversaries are managed in your profile. Click 'Edit Profile' to add or remove them." },
                  { q: "Is there a mobile app?", a: "We are currently a web-based application, but you can add us to your home screen for a native feel." },
                  { q: "How do I report a bug?", a: "Please use the 'Contact Support' form to describe the issue, and we'll look into it immediately." },
                  { q: "Can I change the app theme?", a: "We currently feature a clean, light aesthetic. Dark mode is a highly requested feature for future updates!" },
                  { q: "How do I see my past trips?", a: "All your created and saved itineraries are listed in the 'Insight' gallery." },
                  { q: "What is 'Start from Scratch'?", a: "This button in Insight lets you build a completely custom itinerary without using a template." }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-100">
                    <h4 className="font-black text-slate-800 mb-2 text-sm">{item.q}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.a}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setShowHelp(false)}
                  className="w-full h-16 bg-primary text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact Support Modal */}
      <AnimatePresence>
        {showContact && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContact(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 bg-rose-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-rose-900">Contact Support</h3>
                  <button onClick={() => setShowContact(false)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-rose-600 font-bold text-sm">We're here to help you!</p>
              </div>
              
              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Enquiry Title</label>
                  <input 
                    type="text"
                    placeholder="e.g., Login Issue"
                    value={contactForm.title}
                    onChange={(e) => setContactForm({ ...contactForm, title: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 outline-none font-bold transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Email</label>
                  <input 
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 outline-none font-bold transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Enquiry Details</label>
                  <textarea 
                    placeholder="Describe your issue..."
                    rows={4}
                    value={contactForm.enquiry}
                    onChange={(e) => setContactForm({ ...contactForm, enquiry: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/30 outline-none font-bold transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button 
                  disabled={isSendingEnquiry}
                  onClick={async () => {
                    if (!contactForm.title || !contactForm.enquiry) {
                      toast.error('Please fill in all fields');
                      return;
                    }
                    
                    setIsSendingEnquiry(true);
                    
                    // In a real production environment, this would call a backend API 
                    // that uses a service like SendGrid or AWS SES to send the email
                    // to bernardlim878@gmail.com
                    console.log('Sending enquiry to bernardlim878@gmail.com...', contactForm);
                    
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    setIsSendingEnquiry(false);
                    setShowContact(false);
                    toast.success('Message sent to bernardlim878@gmail.com! We will contact you in 3 working days.');
                    setContactForm({ title: '', email: profile.name.toLowerCase().replace(' ', '.') + '@gmail.com', enquiry: '' });
                  }}
                  className={`w-full h-16 bg-primary text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 ${isSendingEnquiry ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSendingEnquiry ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Enquiry'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
