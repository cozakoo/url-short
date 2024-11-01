// /components/UrlShortener.js
import { useRef, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import styles from '../styles/Home.module.css';
import { fetchLinks } from '../components/fetchLinks';
import { isUrlValid } from '../components/validateUrl';

import {findExistingUser} from '../services/shortUrlService';

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
    try {
      // Verificar si el usuario existe
      const response = await fetch(`/api/findUser?email=${userEmail}`);
      
      if (response.ok) {
        const data = await response.json();
        const existingUserId = data.userId;
  
        // Si el usuario existe, agregar el link
        await fetch('/api/createUserLink', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: existingUserId, linkId }),
        });

        
      } else if (response.status === 404) {
        // Si el usuario no existe, crearlo
        const createUserResponse = await fetch('/api/createUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail }),
        });
  
        if (createUserResponse.ok) {
          const newUserData = await createUserResponse.json();
  
          // Vincular el link al nuevo usuario
          await fetch('/api/createUserLink', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: newUserData.userId, linkId }),
          });
        }
      }
    } catch (error) {
      console.error('Error en handleUserLinking:', error);
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
  
      let data = await response.json();
  
      // Update the short URL state before making any other calls
      setShortURL(data.shortUrl);
  
      // Create the link in the database if needed
      let createResponse;
      if (data.createNewLink) {
        createResponse = await fetch('/api/createShortUrl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, shortUrl: data.shortUrl }),
        });
  
        if (!createResponse.ok) {
          throw new Error('Error al crear el enlace en la base de datos.');
        }
  
        data = await createResponse.json();
      }
  
      setLinks([...links, { url, shortUrl: data.shortUrl }]);
  
      // Only proceed with user linking if createResponse exists and session is valid
      if (session && createResponse) {
        await handleUserLinking(session.user.email, data.id, url);
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
      
      <button className={styles.button} disabled={isLoading}>
        {isLoading ? 'Acortando su URL y guardando...' : 'Acorta'}
      </button>

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
