export interface Dacha {
  id: string;
  title: string;
  location: string;
  district: string;
  pricePerDay: number;
  pricePerWeekend: number;
  guests: number;
  rooms: number;
  beds: number;
  area: number;
  images: string[];
  amenities: Amenity[];
  description: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  ownerId: string;
  ownerTelegram?: string;
  ownerPhone?: string;
  coordinates?: { lat: number; lng: number };
  minDays: number;
  createdAt: string;
}

export type Amenity =
  | 'pool'
  | 'bbq'
  | 'wifi'
  | 'parking'
  | 'gazebo'
  | 'sauna'
  | 'playground'
  | 'generator'
  | 'ac'
  | 'kitchen';

export interface Booking {
  id: string;
  dachaId: string;
  guestName: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  message?: string;
}

export interface SearchFilters {
  district?: string;
  priceMin?: number;
  priceMax?: number;
  guests?: number;
  amenities?: Amenity[];
  checkIn?: string;
  checkOut?: string;
}