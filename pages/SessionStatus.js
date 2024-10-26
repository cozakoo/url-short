// SessionStatus.js
import { signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from '../styles/Home.module.css';
import Record from './Record';

const SessionStatus = ({ session, fetchHistory }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchHistory()
        .then((data) => setHistory(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [session, fetchHistory]);

  return (
    <div>
      {session ? (
        <>
          <div className={styles.containerSession}>
            <img src={session.user.image} alt="Profile" className={styles.imageSession} />
            <div className={styles.details}>
              <div className={styles.infoSession}>
                <p className={styles.nameSession}>{session.user.name}</p>
                <p className={styles.emailSession}>{session.user.email}</p>
              </div>
            </div>
            <button className={styles.buttonSession} onClick={() => signOut()}>Cerrar sesión</button>
          </div>

          <div className={styles.history}>
            <h2 className={styles.titleRecord}>Historial de URLs</h2>
            {loading ? (
              <p>Cargando historial...</p>
            ) : history.length > 0 ? (
              history.map(link => (
                <Record key={link.id} url={link.url} shortUrl={link.shortUrl} />
              ))
            ) : (
              <p>No tienes historial de URLs.</p>
            )}
          </div>
        </>
      ) : (
        <>
          <p>Inicia sesión en tu cuenta para guardar tus URLs y acceder a tu historial.</p>
          <button className={styles.buttonSession} onClick={() => signIn()}>Iniciar sesión</button>
        </>
      )}
    </div>
  );
};

export default SessionStatus;
