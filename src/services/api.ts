import axios, { AxiosError, AxiosResponse } from 'axios';

// Type for API error responses
interface ApiError {
  message: string;
  status?: number;
}

// Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message,
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  }
);

// Types
export interface ShortUrl {
  shortUrl: string;
  urlPath: string;
}

export interface UrlStats {
  longUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  lastAccessed?: string;
}

export interface UrlListItem extends ShortUrl {
  longUrl: string;
  clicks: number;
  createdAt: string;
  lastAccessed?: string;
}

// API Methods
export const encodeUrl = async (longUrl: string): Promise<ShortUrl> => {
  const response: AxiosResponse<ShortUrl> = await apiClient.post('/encode', { longUrl });
  return response.data;
};

export const decodeUrl = async (shortUrl: string): Promise<{ longUrl: string }> => {
  const response: AxiosResponse<{ longUrl: string }> = await apiClient.post('/decode', { shortUrl });
  return response.data;
};

export const getUrlStats = async (urlPath: string): Promise<UrlStats> => {
  const response: AxiosResponse<UrlStats> = await apiClient.get(`/statistic/${urlPath}`);
  return response.data;
};

export const listUrls = async (searchTerm = ''): Promise<UrlListItem[]> => {
  const response: AxiosResponse<UrlListItem[]> = await apiClient.get('/list', {
    params: { search: searchTerm }
  });
  return response.data;
};

// Utility function for error handling
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
  return {
    message: 'An unexpected error occurred',
  };
};