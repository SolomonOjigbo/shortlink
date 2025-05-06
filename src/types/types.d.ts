export interface UrlListItem {
    longUrl: string;
    shortUrl: string;
    urlPath: string;
    clicks: number;
    createdAt: string | Date;
    lastAccessed?: string | Date | null;
  }