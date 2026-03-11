export interface User {
  email: string;
  token: string;
  name: string;
  avatarUrl: string;
  isPro: boolean;
}

type OfferTypes = 'apartment' | 'hotel' | 'house' | 'room';

interface OfferCity {
  name: string;
  location: LocationData;
}

interface LocationData {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface FullOffer {
  id: string;
  title: string;
  type: OfferTypes;
  price: number;
  city: OfferCity;
  location: LocationData;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  previewImage: string;
  bedrooms: number;
  description: string;
  goods: string[];
  host: User;
  images: string[];
  maxAdults: number;
}

export interface Comment {
  id: string;
  offerId: string;
  date: string;
  user: { name: string; avatarUrl: string; isPro: boolean };
  comment: string;
  rating: number;
}