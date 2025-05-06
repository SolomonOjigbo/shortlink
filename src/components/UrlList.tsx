import { useState, useEffect } from 'react';
import { listUrls, handleApiError } from '../services/api';
import { UrlListItem } from '../types/types'; // Assuming you have a types file

const UrlList = () => {
  const [urlList, setUrlList] = useState<UrlListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrls = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await listUrls(searchTerm);
        setUrlList(data);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        console.error('Failed to fetch URLs:', apiError);
      } finally {
        setLoading(false);
      }
    };

    // Only search if searchTerm is empty or >= 3 characters
    if (searchTerm === '' || searchTerm.length >= 3) {
      const timer = setTimeout(fetchUrls, 500);
      return () => clearTimeout(timer);
    } else {
      setUrlList([]);
    }
  }, [searchTerm]);

  const formatDate = (date: string | Date | undefined | null): string => {
    if (!date) return 'Never';
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return isNaN(dateObj.getTime()) ? 'Invalid date' : dateObj.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shortened URL List</h1>
        
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search URLs (min 3 chars)"
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoComplete="off"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Accessed
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {urlList.length > 0 ? (
                  urlList.map((url) => (
                    <tr key={url.urlPath} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {url.shortUrl}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        <a href={url.longUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {url.longUrl}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {url.clicks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(url.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(url.lastAccessed)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm.length > 0 && searchTerm.length < 3
                        ? 'Please enter at least 3 characters to search'
                        : 'No URLs found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlList;