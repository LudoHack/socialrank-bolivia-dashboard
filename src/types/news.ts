export type ImpactLevel = 'high' | 'medium' | 'low';

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: 'website' | 'twitter' | 'facebook' | 'linkedin';
  logo?: string;
}

export interface NewsTag {
  id: string;
  name: string;
  color?: string;
}

export interface News {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  source: NewsSource;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  impactLevel: ImpactLevel;
  tags: NewsTag[];
  image?: string;
  author?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevanceScore?: number;
  status: 'draft' | 'published' | 'archived';
  metadata?: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogSiteName?: string;
    [key: string]: any;
  };
}

export interface NewsFilters {
  search?: string;
  impactLevel?: ImpactLevel[];
  sources?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: News['status'][];
  sentiment?: News['sentiment'][];
}

export interface NewsSortOptions {
  field: keyof News | 'relevance';
  direction: 'asc' | 'desc';
}
