// components/Record.js
import styles from '../styles/Record.module.css'; // Crea un archivo CSS para estilos personalizados
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Record = ({ url, shortUrl, onDelete }) => {
  return (
    <div className={styles.record}>
      <div className={styles.recordContent}>
        <p className={styles.url}><strong>URL Original:</strong> {url}</p>
        <p className={styles.shortUrl}>
          <strong>URL Acortada:</strong> 
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </p>
      </div>
      <button className={styles.deleteButton} onClick={onDelete}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default Record;