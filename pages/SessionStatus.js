// SessionStatus.js
import { signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Record from "./Record";
import styles from "../styles/Home.module.css";

const SessionStatus = ({ session, fetchHistory }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  useEffect(() => {
    if (session) {
      fetchHistory()
        .then((data) => setHistory(data))
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [session, fetchHistory]);

  // Filtrar historial basado en el término de búsqueda
  const filteredHistory = history.filter((link) =>
    link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <br/>
            {/* Campo de búsqueda */}
            <input
              type="text"
              placeholder="Buscar URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {loading ? (
              <p>Cargando historial...</p>
            ) : filteredHistory.length > 0 ? (
              filteredHistory.map((link) => (
                <Record key={link.id} url={link.url} shortUrl={link.shortUrl} />
              ))
            ) : (
              <p>No se encontraron resultados para "{searchTerm}".</p>
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
