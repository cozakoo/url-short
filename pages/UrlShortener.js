// components/UrlShortener.js
import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react'; // Importa el hook de sesión

import styles from '../styles/Home.module.css';

const UrlShortener = ({ onShorten }) => {
  const inputRef = useRef();
  const [shortURL, setShortURL] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession(); // Obtén la sesión

  const isUrlValid = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = inputRef.current.value;

    if (!isUrlValid(url)) {
      setError('Por favor, introduce una URL válida.');
      setShortURL('');
      setIsLoading(false);
      return;
    }

    setError('');
    setIsLoading(true);

    fetch('/api/shortUrl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Esto asegura que las cookies se envían
      body: JSON.stringify({ 
        url, 
        userEmail: session ? session.user.email : null,
       }),
    })
      .then((res) => res.json())
      .then((data) => {
        setShortURL(data.shortUrl);
        setError('');
        onShorten(data.shortUrl); // Llama a la función proporcionada
      })
      .catch((err) => console.error('Error:', err))
      .finally(() => setIsLoading(false));
  };

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
      {shortURL && !error && !isLoading && <span className={styles.result}>URL acortada: {shortURL}</span>}
    </form>
  );
};

export default UrlShortener;
