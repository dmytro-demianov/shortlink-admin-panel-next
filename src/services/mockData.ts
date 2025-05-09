
import { formatDistance } from 'date-fns';

// Types
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

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
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

// Generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// Generate a random short code
const generateShortCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

// Generate random users
export const mockUsers: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: `user-${i + 1}`,
  email: i === 0 ? 'admin@example.com' : `user${i}@example.com`,
  name: i === 0 ? 'Admin User' : `User ${i}`,
  role: i === 0 ? 'admin' : 'user',
  createdAt: randomDate(new Date(2022, 0, 1), new Date()),
  lastLoginAt: Math.random() > 0.2 ? randomDate(new Date(2023, 0, 1), new Date()) : null,
  isActive: Math.random() > 0.1,
}));

// Generate random folders
export const mockFolders: Folder[] = Array.from({ length: 15 }, (_, i) => ({
  id: `folder-${i + 1}`,
  userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
  name: ['Work', 'Personal', 'Social Media', 'Projects', 'Marketing'][Math.floor(Math.random() * 5)] + ` ${i + 1}`,
  createdAt: randomDate(new Date(2022, 0, 1), new Date()),
}));

// Generate random tags
export const mockTags: Tag[] = [
  'Marketing', 'Social', 'Work', 'Personal', 'Important', 'Archive',
  'Project', 'Campaign', 'Event', 'Blog', 'Product', 'News'
].map((name, i) => ({
  id: `tag-${i + 1}`,
  name,
}));

// Generate random links
export const mockLinks: Link[] = Array.from({ length: 50 }, (_, i) => {
  const createdAt = randomDate(new Date(2023, 0, 1), new Date());
  const randomExpireDays = Math.floor(Math.random() * 90) + 30;
  const expireDate = new Date();
  expireDate.setDate(new Date(createdAt).getDate() + randomExpireDays);
  
  return {
    id: `link-${i + 1}`,
    userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
    folderId: Math.random() > 0.3 ? mockFolders[Math.floor(Math.random() * mockFolders.length)].id : null,
    originalUrl: `https://example.com/very/long/path/to/some/page?param=${i}&source=campaign`,
    shortCode: generateShortCode(),
    passwordHash: Math.random() > 0.8 ? 'hashed_password' : null,
    expireAt: Math.random() > 0.7 ? expireDate.toISOString() : null,
    clickLimit: Math.random() > 0.8 ? Math.floor(Math.random() * 1000) + 100 : null,
    totalClicks: Math.floor(Math.random() * 5000),
    isActive: Math.random() > 0.1,
    createdAt,
    utmParams: Math.random() > 0.6 ? {
      source: ['google', 'facebook', 'twitter', 'email', 'direct'][Math.floor(Math.random() * 5)],
      medium: ['cpc', 'social', 'email', 'organic'][Math.floor(Math.random() * 4)],
      campaign: `campaign-${Math.floor(Math.random() * 10) + 1}`,
    } : null,
    smartRedirect: Math.random() > 0.8 ? {
      rules: [
        {
          condition: 'country',
          value: ['US', 'CA'],
          redirectUrl: 'https://example.com/us-ca',
        },
      ],
    } : null,
    type: Math.random() > 0.9 ? 'ab_test' : Math.random() > 0.85 ? 'bio_page' : 'normal',
  };
});

// Generate link tags
export const mockLinkTags: LinkTag[] = [];
mockLinks.forEach(link => {
  const numTags = Math.floor(Math.random() * 3);
  const selectedTagIndices = new Set<number>();
  
  while (selectedTagIndices.size < numTags) {
    selectedTagIndices.add(Math.floor(Math.random() * mockTags.length));
  }
  
  selectedTagIndices.forEach(tagIndex => {
    mockLinkTags.push({
      id: `link-tag-${mockLinkTags.length + 1}`,
      linkId: link.id,
      tagId: mockTags[tagIndex].id,
    });
  });
});

// Generate QR codes
export const mockQRCodes: QRCode[] = mockLinks
  .filter(() => Math.random() > 0.6)
  .map((link, i) => ({
    linkId: link.id,
    imageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://short.url/${link.shortCode}`,
    style: {
      foreground: ['#000000', '#0066cc', '#cc3300'][Math.floor(Math.random() * 3)],
      background: '#ffffff',
      shape: ['square', 'rounded'][Math.floor(Math.random() * 2)],
      logo: Math.random() > 0.5 ? 'logo.png' : null,
    },
    createdAt: randomDate(new Date(link.createdAt), new Date()),
  }));

// Generate clicks
export const mockClicks: Click[] = [];
mockLinks.forEach(link => {
  const numClicks = link.totalClicks;
  
  for (let i = 0; i < numClicks; i++) {
    const clickDate = randomDate(new Date(link.createdAt), new Date());
    
    if (mockClicks.length < 1000) { // Limit the total number of clicks for performance
      mockClicks.push({
        id: `click-${mockClicks.length + 1}`,
        linkId: link.id,
        timestamp: clickDate,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        country: ['US', 'UK', 'CA', 'DE', 'FR', 'JP', 'AU', 'BR', 'IN', 'RU'][Math.floor(Math.random() * 10)],
        city: ['New York', 'London', 'Toronto', 'Berlin', 'Paris', 'Tokyo', 'Sydney', 'São Paulo', 'Mumbai', 'Moscow'][Math.floor(Math.random() * 10)],
        userAgent: [
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
          'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
          'Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36'
        ][Math.floor(Math.random() * 4)],
        referrer: Math.random() > 0.3 ? [
          'https://google.com',
          'https://facebook.com',
          'https://twitter.com',
          'https://linkedin.com',
          'https://instagram.com',
          null
        ][Math.floor(Math.random() * 6)] : null,
      });
    }
  }
});

// Generate subscriptions
export const mockSubscriptions: Subscription[] = mockUsers.map((user, i) => ({
  id: `subscription-${i + 1}`,
  userId: user.id,
  planName: ['free', 'pro', 'business'][Math.floor(Math.random() * 3)] as 'free' | 'pro' | 'business',
  expiresAt: randomDate(new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1))),
  isActive: Math.random() > 0.1,
}));

// Generate API keys
export const mockApiKeys: ApiKey[] = mockUsers
  .filter(() => Math.random() > 0.6)
  .map((user, i) => ({
    id: `api-key-${i + 1}`,
    userId: user.id,
    name: `API Key ${i + 1}`,
    key: Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    isActive: Math.random() > 0.1,
    createdAt: randomDate(new Date(2023, 0, 1), new Date()),
  }));

// Generate A/B variants
export const mockABVariants: ABVariant[] = mockLinks
  .filter(link => link.type === 'ab_test')
  .flatMap(link => {
    const numVariants = Math.floor(Math.random() * 2) + 1; // 1-2 variants
    return Array.from({ length: numVariants }, (_, i) => ({
      id: `variant-${link.id}-${i + 1}`,
      linkId: link.id,
      variantUrl: `https://example.com/variant/${i + 1}?source=abtest`,
      weight: Math.floor(Math.random() * 50) + 10, // 10-60
    }));
  });

// Utility functions for working with mock data
export const getTagsForLink = (linkId: string): Tag[] => {
  const tagIds = mockLinkTags
    .filter(lt => lt.linkId === linkId)
    .map(lt => lt.tagId);
    
  return mockTags.filter(tag => tagIds.includes(tag.id));
};

export const getClicksForLink = (linkId: string): Click[] => {
  return mockClicks.filter(click => click.linkId === linkId);
};

export const getQRCodeForLink = (linkId: string): QRCode | undefined => {
  return mockQRCodes.find(qr => qr.linkId === linkId);
};

export const getFolderById = (id: string | null): Folder | undefined => {
  if (!id) return undefined;
  return mockFolders.find(folder => folder.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getClickStats = (linkId: string) => {
  const clicks = getClicksForLink(linkId);
  
  // Group by country
  const byCountry = clicks.reduce((acc: Record<string, number>, click) => {
    acc[click.country] = (acc[click.country] || 0) + 1;
    return acc;
  }, {});
  
  // Group by day
  const byDay = clicks.reduce((acc: Record<string, number>, click) => {
    const day = click.timestamp.split('T')[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  
  // Group by referrer
  const byReferrer = clicks.reduce((acc: Record<string, number>, click) => {
    const referrer = click.referrer || 'Direct';
    acc[referrer] = (acc[referrer] || 0) + 1;
    return acc;
  }, {});
  
  // Group by device type (simplified)
  const byDevice = clicks.reduce((acc: Record<string, number>, click) => {
    let device = 'Desktop';
    if (click.userAgent.includes('iPhone') || click.userAgent.includes('Android')) {
      device = 'Mobile';
    } else if (click.userAgent.includes('iPad')) {
      device = 'Tablet';
    }
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {});
  
  return {
    total: clicks.length,
    byCountry,
    byDay,
    byReferrer,
    byDevice,
  };
};

export const getFormattedTimeAgo = (dateString: string) => {
  return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
};

// Mock API functions
export const getLinkById = (id: string): Promise<Link> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const link = mockLinks.find(link => link.id === id);
      if (link) {
        resolve(link);
      } else {
        reject(new Error('Link not found'));
      }
    }, 300);
  });
};

export const getAllLinks = (params?: Record<string, string>): Promise<Link[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredLinks = [...mockLinks];
      
      if (params) {
        if (params.folder) {
          filteredLinks = filteredLinks.filter(link => link.folderId === params.folder);
        }
        
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          filteredLinks = filteredLinks.filter(
            link => link.shortCode.toLowerCase().includes(searchLower) || 
                    link.originalUrl.toLowerCase().includes(searchLower)
          );
        }
      }
      
      resolve(filteredLinks);
    }, 300);
  });
};

export const getAllFolders = (): Promise<Folder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFolders);
    }, 200);
  });
};

export const getAllTags = (): Promise<Tag[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTags);
    }, 200);
  });
};

export const createLink = (linkData: Partial<Link>): Promise<Link> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLink: Link = {
        id: `link-${mockLinks.length + 1}`,
        userId: linkData.userId || 'user-1',
        folderId: linkData.folderId || null,
        originalUrl: linkData.originalUrl || 'https://example.com',
        shortCode: linkData.shortCode || generateShortCode(),
        passwordHash: linkData.passwordHash || null,
        expireAt: linkData.expireAt || null,
        clickLimit: linkData.clickLimit || null,
        totalClicks: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        utmParams: linkData.utmParams || null,
        smartRedirect: linkData.smartRedirect || null,
        type: linkData.type || 'normal',
      };
      
      mockLinks.push(newLink);
      resolve(newLink);
    }, 500);
  });
};

export const updateLink = (id: string, linkData: Partial<Link>): Promise<Link> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockLinks.findIndex(link => link.id === id);
      
      if (index !== -1) {
        mockLinks[index] = { ...mockLinks[index], ...linkData };
        resolve(mockLinks[index]);
      } else {
        reject(new Error('Link not found'));
      }
    }, 500);
  });
};

export const deleteLink = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockLinks.findIndex(link => link.id === id);
      
      if (index !== -1) {
        mockLinks.splice(index, 1);
        resolve();
      } else {
        reject(new Error('Link not found'));
      }
    }, 500);
  });
};

export const generateQRCode = (linkId: string): Promise<QRCode> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const link = mockLinks.find(link => link.id === linkId);
      
      if (!link) {
        reject(new Error('Link not found'));
        return;
      }
      
      const existingQR = mockQRCodes.find(qr => qr.linkId === linkId);
      
      if (existingQR) {
        resolve(existingQR);
        return;
      }
      
      const newQR: QRCode = {
        linkId,
        imageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://short.url/${link.shortCode}`,
        style: {
          foreground: '#000000',
          background: '#ffffff',
          shape: 'square',
        },
        createdAt: new Date().toISOString(),
      };
      
      mockQRCodes.push(newQR);
      resolve(newQR);
    }, 500);
  });
};

export const getLinkStats = (id: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const link = mockLinks.find(link => link.id === id);
      
      if (!link) {
        reject(new Error('Link not found'));
        return;
      }
      
      resolve(getClickStats(id));
    }, 500);
  });
};

export const getStatsSummary = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalLinks = mockLinks.length;
      const totalClicks = mockLinks.reduce((sum, link) => sum + link.totalClicks, 0);
      const activeLinks = mockLinks.filter(link => link.isActive).length;
      
      // Get click data for the last 30 days for all links
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const recentClicks = mockClicks.filter(
        click => new Date(click.timestamp) >= thirtyDaysAgo
      );
      
      // Group by day for the last 30 days
      const clicksByDay: Record<string, number> = {};
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayKey = date.toISOString().split('T')[0];
        clicksByDay[dayKey] = 0;
      }
      
      recentClicks.forEach(click => {
        const day = click.timestamp.split('T')[0];
        if (clicksByDay[day] !== undefined) {
          clicksByDay[day] += 1;
        }
      });
      
      // Top countries
      const clicksByCountry = recentClicks.reduce((acc: Record<string, number>, click) => {
        acc[click.country] = (acc[click.country] || 0) + 1;
        return acc;
      }, {});
      
      // Top links by clicks
      const topLinks = [...mockLinks]
        .sort((a, b) => b.totalClicks - a.totalClicks)
        .slice(0, 5)
        .map(link => ({
          id: link.id,
          shortCode: link.shortCode,
          originalUrl: link.originalUrl,
          totalClicks: link.totalClicks,
          createdAt: link.createdAt,
        }));
      
      resolve({
        totalLinks,
        totalClicks,
        activeLinks,
        clicksByDay,
        clicksByCountry,
        topLinks,
      });
    }, 700);
  });
};

export const createFolder = (name: string, userId: string = 'user-1'): Promise<Folder> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFolder: Folder = {
        id: `folder-${mockFolders.length + 1}`,
        userId,
        name,
        createdAt: new Date().toISOString(),
      };
      
      mockFolders.push(newFolder);
      resolve(newFolder);
    }, 300);
  });
};

export const renameFolder = (id: string, name: string): Promise<Folder> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockFolders.findIndex(folder => folder.id === id);
      
      if (index !== -1) {
        mockFolders[index] = { ...mockFolders[index], name };
        resolve(mockFolders[index]);
      } else {
        reject(new Error('Folder not found'));
      }
    }, 300);
  });
};

export const deleteFolder = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockFolders.findIndex(folder => folder.id === id);
      
      if (index !== -1) {
        // Update links in this folder to have no folder
        mockLinks.forEach(link => {
          if (link.folderId === id) {
            link.folderId = null;
          }
        });
        
        mockFolders.splice(index, 1);
        resolve();
      } else {
        reject(new Error('Folder not found'));
      }
    }, 300);
  });
};

export const createTag = (name: string): Promise<Tag> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTag: Tag = {
        id: `tag-${mockTags.length + 1}`,
        name,
      };
      
      mockTags.push(newTag);
      resolve(newTag);
    }, 300);
  });
};

export const deleteTag = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockTags.findIndex(tag => tag.id === id);
      
      if (index !== -1) {
        // Remove all link-tag associations for this tag
        const linkTagIndices = mockLinkTags
          .map((lt, i) => lt.tagId === id ? i : -1)
          .filter(i => i !== -1)
          .sort((a, b) => b - a);
        
        linkTagIndices.forEach(i => mockLinkTags.splice(i, 1));
        
        mockTags.splice(index, 1);
        resolve();
      } else {
        reject(new Error('Tag not found'));
      }
    }, 300);
  });
};
