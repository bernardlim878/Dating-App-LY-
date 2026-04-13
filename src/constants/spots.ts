export interface Review {
  userName: string;
  rating: number;
  comment: string;
  date: string;
  cuisine?: string;
  priceRange?: string;
}

export interface Spot {
  id: string;
  name: string;
  location: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  priceRange: string;
  cuisine: string;
  isExclusive?: boolean;
  reviews: Review[];
}

export const spotsData: Record<string, Spot[]> = {
  'All Spots': [
    {
      id: '1',
      name: 'Uo Shin',
      location: 'Old Klang Road, KL',
      category: 'Fine Dining',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
      rating: 4.9,
      reviewCount: 124,
      description: '"Tucked away in the historic corridor of Old Klang Road, Uo Shin is more than a restaurant; it’s a sanctuary for the senses. Chef’s precision here rivals the most quiet temples of Kyoto."',
      priceRange: 'RM150 to RM300',
      cuisine: 'Japanese',
      isExclusive: true,
      reviews: [
        { userName: 'Sarah L.', rating: 5, comment: 'Absolutely divine omakase experience.', date: '2 days ago' },
        { userName: 'Marcus T.', rating: 4, comment: 'Fresh ingredients, but a bit pricey.', date: '1 week ago' }
      ]
    },
    {
      id: '2',
      name: 'The Glasshouse',
      location: 'Seputeh, KL',
      category: 'Boutique',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
      rating: 4.7,
      reviewCount: 89,
      description: '"A botanical escape in the heart of the city. The architecture blurs the line between nature and luxury, creating an ethereal atmosphere for intimate gatherings."',
      priceRange: 'RM60 to RM150',
      cuisine: 'International',
      reviews: [
        { userName: 'Emily W.', rating: 5, comment: 'Beautiful venue for weddings!', date: '3 days ago' }
      ]
    }
  ],
  'Boutique': [
    {
      id: '2',
      name: 'The Glasshouse',
      location: 'Seputeh, KL',
      category: 'Boutique',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
      rating: 4.7,
      reviewCount: 89,
      description: '"A botanical escape in the heart of the city. The architecture blurs the line between nature and luxury, creating an ethereal atmosphere for intimate gatherings."',
      priceRange: 'RM60 to RM150',
      cuisine: 'International',
      reviews: [
        { userName: 'Emily W.', rating: 5, comment: 'Beautiful venue for weddings!', date: '3 days ago' }
      ]
    }
  ],
  'Cultural': [
    {
      id: '3',
      name: 'Batik Pavilion',
      location: 'Central Market, KL',
      category: 'Cultural',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=1200',
      rating: 4.8,
      reviewCount: 56,
      description: '"A vibrant journey through Malaysian heritage. Witness the delicate art of batik-making in a space that breathes history and craftsmanship."',
      priceRange: 'RM30 to RM60',
      cuisine: 'Heritage',
      reviews: []
    }
  ],
  'Fine Dining': [
    {
      id: '1',
      name: 'Uo Shin',
      location: 'Old Klang Road, KL',
      category: 'Fine Dining',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
      rating: 4.9,
      reviewCount: 124,
      description: '"Tucked away in the historic corridor of Old Klang Road, Uo Shin is more than a restaurant; it’s a sanctuary for the senses. Chef’s precision here rivals the most quiet temples of Kyoto."',
      priceRange: 'RM150 to RM300',
      cuisine: 'Japanese',
      isExclusive: true,
      reviews: [
        { userName: 'Sarah L.', rating: 5, comment: 'Absolutely divine omakase experience.', date: '2 days ago' }
      ]
    }
  ],
  'AI Recommended': [
    {
      id: '4',
      name: 'Lumière Secret Garden',
      location: 'Genting Highlands',
      category: 'AI Recommended',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200',
      rating: 5.0,
      reviewCount: 12,
      description: '"Based on your preference for quiet romance and mountain air, this hidden sanctuary offers the perfect blend of isolation and luxury. The stars here feel close enough to touch."',
      priceRange: 'RM150 to RM300',
      cuisine: 'Fusion',
      isExclusive: true,
      reviews: []
    }
  ]
};
