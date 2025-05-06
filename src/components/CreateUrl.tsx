import { useState } from 'react';
import { encodeUrl } from '../services/api';

interface UrlHistoryItem {
  longUrl: string;
  shortUrl: string;
  createdAt: string;
}

export default function CreateUrl() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [urlHistory, setUrlHistory] = useState<UrlHistoryItem[]>([]);

  interface EncodeUrlResponse {
    data: {
      shortUrl: string;
    };
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response: EncodeUrlResponse = await encodeUrl(longUrl);
      const newShortUrl = response.data.shortUrl;
      setShortUrl(newShortUrl);
      setError('');
      
      // Add to history
      setUrlHistory(prev => [
        {
          longUrl,
          shortUrl: newShortUrl,
          createdAt: new Date().toLocaleString()
        },
        ...prev
      ]);
    } catch (err) {
      setError('Failed to create short URL');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            URL Shortener
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Enter a long URL to get a shortened version
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-8 mb-12">
          <form 
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            className="space-y-6"
          >
            <div>
              <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700">
                Long URL
              </label>
              <div className="mt-1">
                <input
                  id="longUrl"
                  type="url"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Short URL
              </button>
            </div>
          </form>

          {shortUrl && (
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-gray-700">Short URL:</p>
              <a 
                href={shortUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-1 block text-blue-600 hover:text-blue-800 break-all"
              >
                {shortUrl}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(shortUrl)}
                className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Copy to clipboard
              </button>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-md">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}
        </div>

        {urlHistory.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <h2 className="sr-only">URL History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Short URL
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {urlHistory.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-xs truncate">
                        <a href={item.longUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {item.longUrl}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                        <a href={item.shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {item.shortUrl}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}