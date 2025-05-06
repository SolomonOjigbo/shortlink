import { useState, useEffect } from 'react';
import { listUrls } from '../services/api';

interface Url {
  _id: string;
  longUrl: string;
  shortUrl: string;
  urlPath: string;
  clicks: number;
  createdAt: string | Date;
  lastAccessed?: string | Date | null;
}

const UrlList = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUrls = async () => {
      setLoading(true);
      try {
        const response = await listUrls(searchTerm);
        setUrls(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Only search if searchTerm is empty or >= 3 characters
    if (searchTerm === '' || searchTerm.length >= 3) {
      const timer = setTimeout(() => {
        fetchUrls();
      }, 500);

      return () => clearTimeout(timer);
    } else {
      // Clear results if search term is less than 3 characters
      setUrls([]);
    }
  }, [searchTerm]);

  const formatDate = (date: string | Date | undefined | null): string => {
    if (!date) return 'Never';
    const dateObj = date instanceof Date ? date : new Date(date);
    return isNaN(dateObj.getTime()) ? 'Invalid date' : dateObj.toLocaleString();
  };

  return (
    <div className="container flex flex-col mx-auto p-3 bg-white justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Shortened URL list</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        placeholder="Search URLs (min 3 chars)"
        className="border border-gray-300 rounded p-4 mb-4 w-1/2"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck="false"
      />
      
      {loading ? (
        <p className="loading-message">Loading...</p>
      ) : (
        <table className="url-table">
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Original URL</th>
              <th>Clicks</th>
              <th>Created</th>
              <th>Last Accessed</th>
            </tr>
          </thead>
          <tbody>
            {urls.length > 0 ? (
              urls.map((url) => (
                <tr key={url._id}>
                  <td>
                    <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                      {url.shortUrl}
                    </a>
                  </td>
                  <td>
                    <a href={url.longUrl} target="_blank" rel="noopener noreferrer" className="long-url">
                      {url.longUrl}
                    </a>
                  </td>
                  <td>{url.clicks}</td>
                  <td>{formatDate(url.createdAt)}</td>
                  <td>{formatDate(url.lastAccessed)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="no-results">
                  {searchTerm.length > 0 && searchTerm.length < 3
                    ? 'Please enter at least 3 characters to search'
                    : 'No URLs found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UrlList;