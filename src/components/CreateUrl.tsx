import { useState } from 'react';
import { encodeUrl } from '../services/api';

export default function CreateUrl() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

interface EncodeUrlResponse {
    data: {
        shortUrl: string;
    };
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
        const response: EncodeUrlResponse = await encodeUrl(longUrl);
        setShortUrl(response.data.shortUrl);
        setError('');
    } catch (err) {
        setError('Failed to create short URL');
        console.error(err);
    }
};

  return (
    <div>
      <h2>Create Short URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter long URL"
          required
        />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && (
        <div>
          <p>Short URL: <a href={shortUrl}>{shortUrl}</a></p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}