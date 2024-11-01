// History.js
import { useState, useEffect } from "react";
import Record from "./Record";
import styles from "../styles/Home.module.css";

const History = ({ session, fetchHistory }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (session) {
      fetchHistory()
        .then((data) => setHistory(data || [])) // Ensure data is an array
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [session, fetchHistory]);

  const filteredHistory = Array.isArray(history)
    ? history.filter((link) =>
        link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.shortUrl.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/urls/${id}`, {
        method: 'DELETE',
      });
      // Update the state to remove the deleted record from the UI
      setHistory((prev) => prev.filter(link => link.id !== id));
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  };

  return (
    <div className={styles.history}>
      <h2 className={styles.titleRecord}>Historial de URL's</h2>
      
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
          <Record key={link.id} url={link.url} shortUrl={link.shortUrl} onDelete={() => handleDelete(link.id)} />
        ))
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default History;