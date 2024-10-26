import { signIn, signOut } from "next-auth/react";
import styles from '../styles/Home.module.css';

const SessionStatus = ({ session }) => {
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
              <button className={styles.buttonSession} onClick={() => signOut()}>Finalizar sesión</button>
            </div>
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
