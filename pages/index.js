// pages/index.js
import { useState, useEffect } from 'react'; // Asegúrate de importar useEffect
import { useSession } from "next-auth/react";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import UrlShortener from './UrlShortener';
import SessionStatus from './SessionStatus';

export default function Home() {
  const { data: session } = useSession();
  const [history, setHistory] = useState([]); // Cambia a un estado vacío por defecto

  useEffect(() => {
    if (session) {
      const fetchLinks = async () => {
        const response = await fetch('/api/getUserLinks');
        const data = await response.json();
        setHistory(data); // Actualiza el estado con los enlaces obtenidos
      };
      fetchLinks();
    }
  }, [session]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Simplifica tus URLs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
      <main className={styles.main}>
        <h1 className={styles.title}>Acorta, Comparte y Simplifica</h1>
        <div className={styles.content}>
          <div className={styles.left}>
            <UrlShortener onShorten={(shortUrl) => console.log(shortUrl)} />
          </div>
          <div className={styles.right}>
            <SessionStatus session={session} history={history} />
          </div>
        </div>
      </main>
    </div>
  );
}
