import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

import styles from '../styles/Home.module.css';

const UrlShortener = ({ onShorten }) => {
  const inputRef = useRef();
  const [shortURL, setShortURL] = useState('');
  const [error, setError] = useState('Introduce una URL válida'); // Mensaje por defecto
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

    console.log('Función handleSubmit ejecutada'); // Esto debería aparecer en la consola


    if (!isUrlValid(url)) {
      setError('Por favor, introduce una URL válida.'); // Cambia el mensaje de error
      setShortURL('');
      setIsLoading(false);
      return;
    }

    setError(''); // Resetea el mensaje de error
    setIsLoading(true);

    fetch('/api/shortUrl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ 
        url, 
        userEmail: session ? session.user.email : null,
      }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok ' + res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      setShortURL(data.shortUrl);
      setError(''); // Resetea el mensaje de error
      onShorten(data.shortUrl); // Llama a la función proporcionada
    })
    .catch((err) => {
      console.error('Error:', err);
      setError(err.message); // Manejo del error
    })
    .finally(() => setIsLoading(false));
  };

  // Asegúrate de que la variable de entorno está definida
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
      {error && <span className={styles.error}>{error}</span>} {/* Muestra el mensaje de error */}
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
