import {
  findExistingUrl,
  addLinkToUser,
  createShortUrl,
  findExistingUser,
  createUser,
  createUserLink,
  disconnect
} from '../../services/shortUrlService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, userEmail } = req.body;
    
    console.log('URL a acortar:', url);
    console.log('Correo del usuario:', userEmail);

    try {
      // Buscar la URL existente
      const existingUrl = await findExistingUrl(url);
      let shortUrl;
      let linkId;

      if (existingUrl) {
        shortUrl = existingUrl.shortUrl;
        linkId = existingUrl.id;
      } else {
        shortUrl = generateShortUrl();
        console.log('shortUrl:', shortUrl);
        
        const newLink = await createShortUrl(url, shortUrl);
        console.log('newLink:', newLink);
        
        shortUrl = newLink.shortUrl;
        console.log('shortUrl:', shortUrl);
       
        linkId = newLink.id;
        console.log('linkId:', linkId);
      }

      // Manejar el usuario solo si se proporciona un email
      if (userEmail) {
        await handleUserLinking(userEmail, linkId, url);
      }

      return res.status(201).send({ shortUrl });

    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
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

// Maneja la lógica de vinculación de usuarios
async function handleUserLinking(userEmail, linkId, url) {
  const existingUserId = await findExistingUser(userEmail);

  if (existingUserId) {
    await addLinkToUser(existingUserId, url);
  } else {
    const newUser = await createUser(userEmail);
    await createUserLink(newUser.id, linkId);
  }
}
