// SessionStatus.js
import { signIn, signOut } from "next-auth/react";
import styles from '../styles/Home.module.css';
import Record from './Record';

const SessionStatus = ({ session, history }) => {
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
              <button className={styles.buttonSession} onClick={() => signOut()}>Finalizar sesión</button>
          </div>

          {/* Mostrar historial */}
          <div className={styles.history}>
            <h2 className={styles.titleRecord} >Historial de URL's</h2>
            {history.length > 0 ? (
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
