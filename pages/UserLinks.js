// components/UserLinks.js
import { useEffect, useState } from 'react';

const UserLinks = () => {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch('/api/userLinks');
        if (!response.ok) {
          throw new Error('Error al cargar los enlaces');
        }
        const data = await response.json();
        setLinks(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLinks();
  }, []);

  return (
    <div>
      <h2>Tus Enlaces Acortados</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {links.map(link => (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">{link.shortUrl}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserLinks;
