// components/Record.js
import styles from '../styles/Record.module.css'; // Crea un archivo CSS para estilos personalizados

const Record = ({ url, shortUrl }) => {
  return (
    <div className={styles.record}>
      <p className={styles.url}><strong>URL Original:</strong> {url}</p>

      <p className={styles.shortUrl}><strong>URL Acortada:</strong> <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>
    </div>
  );
};

export default Record;

  