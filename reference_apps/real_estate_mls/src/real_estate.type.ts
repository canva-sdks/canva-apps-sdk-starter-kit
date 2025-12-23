export interface Property {
  id: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  url: string;
  title: string;
  name: string;
  description: string;
  address: string;
  price: string;
  suburb: string;
  listingType: string;
  listing_images?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  }[];
  agent?: Agent;
}

export interface Agent {
  id: string;
  name: string;
  officeId?: string;
  phoneNumber?: string;
  roleTitle?: string;
  headshots?: {
    url: string;
    width: number;
    height: number;
  }[];
}

export interface Office {
  id: string;
  name: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
}
