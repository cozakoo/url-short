import {
  addLinkToUser,
  createShortUrl,
  findExistingUser,
  createUser,
  createUserLink,
  disconnect
} from '../../services/shortUrlService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, existingLink } = req.body;

    try {
      let shortUrl;
      let linkId;
      let createNewLink = false; 

      if (existingLink) {
        shortUrl = existingLink.shortUrl;
        linkId = existingLink.id;
      } else {
        shortUrl = generateShortUrl(); //genera el acortador
        linkId = "";
        createNewLink = true;
      }

      return res.status(201).send({ shortUrl, linkId, createNewLink });

    } catch (error) {
      return res.status(500).send({ error: 'Internal server error' });
    } finally {
      await disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Función para generar un shortUrl aleatorio
function generateShortUrl() {
  return Math.random().toString(36).substr(2, 6);
}