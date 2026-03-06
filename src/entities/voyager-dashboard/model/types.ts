
export interface Offer{
  "id": string,
  "title": string,
  "price": number
}


export interface VoyagerPoint {
  id: string;
  base_price: number;
  type: string;
  destination: string;
  date_from: string;
  date_to: string;
  offers: string[];
}

export interface VoyagerDestination {
  id: string;
  name: string;
  description: string;
  pictures: { src: string; description: string }[];
}

export interface VoyagerProjectData {
  points: VoyagerPoint[];
  destinations: VoyagerDestination[];
  offers: Offer[];
}