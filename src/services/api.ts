import axios, { AxiosError} from 'axios';


const API_URL = import.meta.env.VITE_API_URL || 'https://shortlink-server.vercel.app/';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

// Types
export interface ShortUrlResponse {
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

export interface UrlListItem extends ShortUrlResponse {
  longUrl: string;
  clicks: number;
  createdAt: string;
  lastAccessed?: string;
}

export interface DecodeResponse {
  longUrl: string;
}


export const encodeUrl = async (longUrl: string): Promise<ShortUrlResponse> => {
  try {
    const response = await apiClient.post<ShortUrlResponse>('/encode', { longUrl });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const decodeUrl = async (shortUrl: string): Promise<DecodeResponse> => {
  try {
    const response = await apiClient.post<DecodeResponse>('/decode', { shortUrl });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUrlStats = async (urlPath: string): Promise<UrlStats> => {
  try {
    const response = await apiClient.get<UrlStats>(`/statistic/${urlPath}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const listUrls = async (searchTerm = ''): Promise<UrlListItem[]> => {
  try {
    const response = await apiClient.get<UrlListItem[]>('/list', {
      params: { search: searchTerm }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Utility function for error handling
export const handleApiError = (error: unknown): { message: string; status?: number; data?: Record<string, unknown> } => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
  }
  return {
    message: 'An unexpected error occurred',
  };
};