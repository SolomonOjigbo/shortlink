/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface EncodeUrlRequest {
    longUrl: string;
}

export interface EncodeUrlResponse {
    data: any;
    shortUrl: string;
}

export const encodeUrl = (longUrl: string): Promise<EncodeUrlResponse> => {
    return axios.post<{ data: EncodeUrlResponse }>(`${API_URL}/encode`, { longUrl }).then(response => response.data.data);
};

export interface DecodeUrlRequest {
    shortUrl: string;
}

export interface DecodeUrlResponse {
    longUrl: string;
}

export const decodeUrl = (shortUrl: string): Promise<DecodeUrlResponse> => {
    return axios.post<{ data: DecodeUrlResponse }>(`${API_URL}/decode`, { shortUrl }).then(response => response.data.data);
};

export interface GetUrlStatsRequest {
    urlPath: string;
}

export interface GetUrlStatsResponse {
    clicks: number;
    createdAt: string;
    updatedAt: string;
}

export const getUrlStats = (urlPath: string): Promise<GetUrlStatsResponse> => {
    return axios.get<GetUrlStatsResponse>(`${API_URL}/statistic/${urlPath}`).then(response => response.data);
};

export const listUrls = (searchTerm = '') => {
  return axios.get(`${API_URL}/list`, {
    params: { search: searchTerm }
  });
};