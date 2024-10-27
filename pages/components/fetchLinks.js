// /components/fetchLinks.js
export const fetchLinks = async () => {
    try {
      const response = await fetch('/api/links');
      if (!response.ok) throw new Error('Error al obtener los enlaces');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  