import { useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const inputRef = useRef();
  const [shortURL, setShortURL] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para el indicador de carga

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
      setShortURL('');  // Limpiar la URL acortada si hay error
      setIsLoading(false); // Desactivar el cargando en caso de error
      return;
    }

    // Si la URL es válida, limpiar el error, mostrar el cargando y proceder con la solicitud
    setError('');
    setIsLoading(true); // Activar indicador de carga

    fetch('/api/shortUrl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
      .then((res) => res.json())
      .then((data) => {
        setShortURL(data.shortUrl);
        setError('');  // Limpiar el error si la solicitud es exitosa
      })
      .catch((err) => console.error('Error:', err))
      .finally(() => setIsLoading(false)); // Desactivar indicador de carga al terminar
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Simplifica tus URLs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Acorta, Comparte y Simplifica</h1>

        <p className={styles.description}>
          Haz clic en el botón y observa cómo tu URL se transforma
        </p>

        <div className={styles.grid}>
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
        </div>
      </main>
    </div>
  );
}
