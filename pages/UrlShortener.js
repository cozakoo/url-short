// /components/UrlShortener.js
import { useRef, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import styles from '../styles/Home.module.css';
import { fetchLinks } from '../components/fetchLinks';
import { isUrlValid } from '../components/validateUrl';

const UrlShortener = ({ onShorten }) => {
  const inputRef = useRef();
  const [shortURL, setShortURL] = useState('');
  const [error, setError] = useState('');
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

  const handleUserLinking = async (userEmail, linkId, url) => {
    const existingUserId = await findExistingUser(userEmail);

    if (existingUserId) {
      await addLinkToUser(existingUserId, url);
    } else {
      const newUser = await createUser(userEmail);
      await createUserLink(newUser.id, linkId);
    }
  };

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
        body: JSON.stringify({ url, existingLink }),
      });
  
      if (!response.ok) throw new Error('Error al acortar la URL: ' + response.statusText);
  
      const data = await response.json();
  
      // Aquí actualizas el estado antes de hacer la llamada al handler
      setShortURL(data.shortUrl); // Esto se ejecutará primero
  
      // Ahora llama a la API para crear el enlace en la base de datos
      if (data.createNewLink) {
        const createResponse = await fetch('/api/createShortUrl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, shortUrl: data.shortUrl }),
        });
  
        if (!createResponse.ok) {
          throw new Error('Error al crear el enlace en la base de datos.');
        }
      }
  
      setLinks([...links, { url, shortUrl: data.shortUrl }]);
      
      if (session) {
        await handleUserLinking(session.user.email, linkId, url);
      }
  
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

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
      {shortURL && !error && (
        <span className={styles.result}>
          URL acortada: <a href={`${baseUrl}/${shortURL}`} target="_blank" rel="noopener noreferrer">{`${baseUrl}/${shortURL}`}</a>
        </span>
      )}
    </form>
  );
};

export default UrlShortener;
