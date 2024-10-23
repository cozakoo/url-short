import { useRef, useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const inputRef = useRef();
  const [shortURL, setShortURL] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = inputRef.current.value;
    
    fetch('/api/shortUrl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url}),
    })
    .then(res => res.json())
    .then(data => { setShortURL(data.shortUrl) });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Simplifica tus URLs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Acorta, Comparte y Simplifica
        </h1>

        <p className={styles.description}>
        Haz clic en el botón y observa cómo tu URL se transforma
        </p>

        <div className={styles.grid}>
          <form className={styles.card} onSubmit={handleSubmit}>
            <input ref={inputRef} type="text" className={styles.input} placeholder="Introduce tu URL aquí" />
            <button className={styles.button}>Acorta</button>
            <span className={styles.input}>{shortURL}</span>
          </form>

        </div>
      </main>
    </div>
  )
}
