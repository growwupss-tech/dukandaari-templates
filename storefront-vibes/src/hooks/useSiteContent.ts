import { useMemo } from 'react';
import siteContentData from '@/data/siteContent.json';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  inStock: boolean;
  visibility: boolean;
}

export interface HeroSlide {
  image: string;
  title: string;
  description: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface Review {
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BrandGalleryItem {
  url: string;
  text: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface SiteContent {
  brand: {
    name: string;
    tagline: string;
    logo: string;
    whatsappNumber: string;
  };
  hero: {
    slides: HeroSlide[];
  };
  services: Service[];
  products: Product[];
  brandShowcase: {
    title: string;
    subtitle: string;
    description: string;
    stats: Stat[];
  };
  brandGallery: BrandGalleryItem[];
  reviews: Review[];
  footer: {
    about: string;
    sections: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    social: {
      facebook: string;
      twitter: string;
      instagram: string;
      youtube: string;
    };
    contact: {
      email: string;
      phone: string;
      address: string;
    };
  };
}

export const useSiteContent = () => {
  const content = useMemo(() => siteContentData as SiteContent, []);
  return content;
};
