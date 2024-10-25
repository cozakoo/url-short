import { signIn, signOut } from "next-auth/react";
import styles from '../styles/Home.module.css';

const SessionStatus = ({ session }) => {
  return (
    <div>
      {session ? (
        <>
          <p>Bienvenido {session.user.name}</p>
          <br/>
          <button onClick={() => signOut()}>Finalizar sesión</button>
        </>
      ) : (
        <>
          <p>Para acceder a características adicionales, inicia sesión en tu cuenta.</p>
          <br/>
          <button className={styles.button} onClick={() => signIn()}>Iniciar sesión</button>
        </>
      )}
    </div>
  );
};

export default SessionStatus;
