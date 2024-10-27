// /components/UrlShortener.js
import { useRef, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import styles from '../styles/Home.module.css';
import { fetchLinks } from './components/fetchLinks';
import { isUrlValid } from './components/validateUrl';

const UrlShortener = ({ onShorten }) => {
  const inputRef = useRef();
  const [shortURL, setShortURL] = useState('');
  const [error, setError] = useState('Introduce una URL válida');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const loadLinks = async () => {
      const loadedLinks = await fetchLinks();
      setLinks(loadedLinks);
    };

    loadLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = inputRef.current.value;

    if (!isUrlValid(url)) {
      setError('Por favor, introduce una URL válida.');
      setShortURL('');
      return;
    }

    const existingLink = links.find(link => link.url === url);

    let isExistingLink = false;

    if (existingLink) {
      isExistingLink = true;
      setShortURL(existingLink.shortUrl);
      setError('');
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/shortUrl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          url, 
          userEmail: session ? session.user.email : null,
          existingLink
         }),
      });

      if (!response.ok) throw new Error('Error al acortar la URL: ' + response.statusText);

      const data = await response.json();
      setShortURL(data.shortUrl);
      onShorten(data.shortUrl);

      setLinks([...links, { url, shortUrl: data.shortUrl }]);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const baseUrl = process.env.NEXTAUTH_URL;

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder="Introduce tu URL aquí"
      />
      <button className={styles.button} disabled={isLoading}>Acorta</button>
      <br />
      <br />
      {error && <span className={styles.error}>{error}</span>}
      {isLoading && <span className={styles.loading}>Procesando...</span>}
      {shortURL && !error && !isLoading && (
        <span className={styles.result}>
          URL acortada: <a href={`${baseUrl}/${shortURL}`} target="_blank" rel="noopener noreferrer">{`${baseUrl}/${shortURL}`}</a>
        </span>
      )}
    </form>
  );
};

export default UrlShortener;
