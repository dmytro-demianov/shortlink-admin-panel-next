
import { toast } from '@/hooks/use-toast';

const API_BASE_URL = '/api';

// Utility function for handling API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'An unknown error occurred',
    }));
    
    throw new Error(error.message || `Error: ${response.status}`);
  }
  
  return response.json();
};

// Utility function for making API requests
const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  data?: any,
  customHeaders: Record<string, string> = {}
) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      credentials: 'include', // Include cookies for session authentication
    };

    if (data) {
      requestOptions.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    toast({
      title: "API Request Failed",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
};

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    apiRequest('/auth/login', 'POST', { email, password }),
  
  register: (name: string, email: string, password: string) =>
    apiRequest('/auth/register', 'POST', { name, email, password }),
  
  logout: () => apiRequest('/auth/logout', 'POST'),
  
  getCurrentUser: () => apiRequest('/auth/me'),
};

// Links API
export const linksApi = {
  getAll: (params?: Record<string, string>) => {
    const queryParams = params 
      ? `?${new URLSearchParams(params).toString()}` 
      : '';
    return apiRequest(`/links${queryParams}`);
  },
  
  getById: (id: string) => apiRequest(`/links/${id}`),
  
  create: (linkData: any) => apiRequest('/links', 'POST', linkData),
  
  update: (id: string, linkData: any) => apiRequest(`/links/${id}`, 'PUT', linkData),
  
  delete: (id: string) => apiRequest(`/links/${id}`, 'DELETE'),
  
  getStats: (id: string) => apiRequest(`/links/${id}/stats`),
};

// Folders API
export const foldersApi = {
  getAll: () => apiRequest('/folders'),
  
  create: (name: string) => apiRequest('/folders', 'POST', { name }),
  
  rename: (id: string, name: string) => apiRequest(`/folders/${id}`, 'PUT', { name }),
  
  delete: (id: string) => apiRequest(`/folders/${id}`, 'DELETE'),
};

// Tags API
export const tagsApi = {
  getAll: () => apiRequest('/tags'),
  
  create: (name: string) => apiRequest('/tags', 'POST', { name }),
  
  delete: (id: string) => apiRequest(`/tags/${id}`, 'DELETE'),
};

// QR Codes API
export const qrCodesApi = {
  get: (linkId: string) => apiRequest(`/qr/${linkId}`),
  
  generate: (linkId: string, style?: any) => apiRequest(`/qr/${linkId}`, 'POST', { style }),
};

// Stats API
export const statsApi = {
  getLinkStats: (id: string) => apiRequest(`/stats/link/${id}`),
  
  getSummary: () => apiRequest('/stats/summary'),
};

// API Keys API
export const apiKeysApi = {
  getAll: () => apiRequest('/api-keys'),
  
  create: (name: string) => apiRequest('/api-keys', 'POST', { name }),
  
  delete: (id: string) => apiRequest(`/api-keys/${id}`, 'DELETE'),
};

// Admin API
export const adminApi = {
  getAllUsers: () => apiRequest('/admin/users'),
  
  getAllLinks: () => apiRequest('/admin/links'),
};
