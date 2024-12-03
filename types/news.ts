import { StaticImageData } from "next/image";

export type NewsType = 'video' | 'skin' | 'event' | 'update';

export interface NewsItem {
  id: string;
  titleKey: string; // Chave para tradução do título
  type: NewsType;
  imageUrl: string;
  videoUrl?: string;
  descriptionKey?: string; // Chave para tradução da descrição
  date: string;
  featured?: boolean;
}

export interface NewsSection {
  title: string;
  items: NewsItem[];
}
