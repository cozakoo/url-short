// pages/index.js
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import UrlShortener from './UrlShortener';
import SessionStatus from './SessionStatus';
import History from "./History";

export default function Home() {
  const { data: session } = useSession();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (session) {
      const fetchLinks = async () => {
        const response = await fetch(`/api/getUserLinks?email=${session.user.email}`); // Enviar el email
        const data = await response.json();
        setHistory(data);
      };
      fetchLinks();
    }
  }, [session]);

  const fetchHistory = async () => {
    const response = await fetch(`/api/getUserLinks?email=${session.user.email}`);
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
        
      <h1 className={styles.title}>Acorta, Comparte y Simplifica</h1>

      <main className={styles.main}>
        <div className={styles.content}>
          
          <div className={styles.left}>
            <UrlShortener onShorten={(shortUrl) => console.log(shortUrl)} />
          </div>

          <div className={styles.right}>
            <SessionStatus session={session} />
          </div>
          
        </div>
        {session && <History session={session} fetchHistory={fetchHistory} />}
      </main>
    </div>
  );
}
