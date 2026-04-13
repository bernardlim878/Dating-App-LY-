export type Screen = 'onboarding' | 'home' | 'explore' | 'plans' | 'insight' | 'profile';

export interface UserProfile {
  name: string;
  memberSince: string;
  avatar: string;
  partnerName: string;
  partnerBirthday: string;
  partnerNotes: string;
  cuisines: string[];
  hobbies: string[];
  anniversaries: { title: string; date: string }[];
}

export interface PartnerDetails {
  name: string;
  birthday: string;
  anniversaries: { label: string; date: string }[];
  cuisines: string[];
  hobbies: string[];
  notes: string;
}

export interface DateIdea {
  id: string;
  title: string;
  category: string;
  image: string;
  rating?: number;
  priceRange?: string;
  description?: string;
  location?: string;
}
