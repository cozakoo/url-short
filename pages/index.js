// pages/index.js
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import UrlShortener from './UrlShortener';
import SessionStatus from './SessionStatus';

export default function Home() {
  const { data: session } = useSession();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (session) {
      const fetchLinks = async () => {
        const response = await fetch('/api/getUserLinks');
        const data = await response.json();
        setHistory(data);
      };
      fetchLinks();
    }
  }, [session]);

  const fetchHistory = async () => {
    const response = await fetch('/api/getUserLinks');
    const data = await response.json();
    return data;
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Simplifica tus URLs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <br/>
        
      <main className={styles.main}>
      <h1 className={styles.title}>Acorta, Comparte y Simplifica</h1>
        <div className={styles.content}>
          <div className={styles.left}>
            <UrlShortener onShorten={(shortUrl) => console.log(shortUrl)} />
          </div>
          <div className={styles.right}>
            <SessionStatus session={session} fetchHistory={fetchHistory} /> {/* Cambio aquí */}
          </div>
        </div>
      </main>
    </div>
  );
}
