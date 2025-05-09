
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt?: string;
  lastLoginAt?: string | null;
  isActive?: boolean;
}

export interface Link {
  id: string;
  userId: string;
  folderId: string | null;
  originalUrl: string;
  shortCode: string;
  passwordHash: string | null;
  expireAt: string | null;
  clickLimit: number | null;
  totalClicks: number;
  isActive: boolean;
  createdAt: string;
  utmParams: Record<string, string> | null;
  smartRedirect: Record<string, any> | null;
  type: 'normal' | 'ab_test' | 'bio_page';
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface LinkTag {
  id: string;
  linkId: string;
  tagId: string;
}

export interface QRCode {
  linkId: string;
  imageUrl: string;
  style: Record<string, any>;
  createdAt: string;
}

export interface Click {
  id: string;
  linkId: string;
  timestamp: string;
  ipAddress: string;
  country: string;
  city: string;
  userAgent: string;
  referrer: string | null;
}

export interface Subscription {
  id: string;
  userId: string;
  planName: 'free' | 'pro' | 'business';
  expiresAt: string;
  isActive: boolean;
}

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  isActive: boolean;
  createdAt: string;
}

export interface ABVariant {
  id: string;
  linkId: string;
  variantUrl: string;
  weight: number;
}

export interface LinkStats {
  total: number;
  byCountry: Record<string, number>;
  byDay: Record<string, number>;
  byReferrer: Record<string, number>;
  byDevice: Record<string, number>;
}

export interface StatsSummary {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  clicksByDay: Record<string, number>;
  clicksByCountry: Record<string, number>;
  topLinks: Array<{
    id: string;
    shortCode: string;
    originalUrl: string;
    totalClicks: number;
    createdAt: string;
  }>;
}
