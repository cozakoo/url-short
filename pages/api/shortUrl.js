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
    const { url, userEmail, existingLink } = req.body;

    console.log('----------------------------------');
    console.log('url:', url);
    console.log('userEmail:', userEmail);
    console.log('existingLink:', existingLink);
    console.log('----------------------------------');

    try {
      let shortUrl;
      let linkId;
      
      if (existingLink) {
        console.log('ESTOY EN EL IF 01');

        shortUrl = existingLink.shortUrl;
        linkId = existingLink.id;
        console.log('SALI DEL IF 01');

      } else {
        console.log('ESTOY EN EL ELSE 02');
        shortUrl = generateShortUrl(); //genera el acortador
        const newLink = await createShortUrl(url, shortUrl);
        shortUrl = newLink.shortUrl;
        linkId = newLink.id;
        console.log('SALI DEL ELSE 02');
      }

      // Manejar el usuario solo si se proporciona un email
      if (userEmail) {
        console.log('ESTOY EN EL IF 03');
        await handleUserLinking(userEmail, linkId, url);
        console.log('ESTOY EN EL ELSE 03');

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
  console.log('ESTOY EN EL handleUserLinking');

  const existingUserId = await findExistingUser(userEmail);

  if (existingUserId) {
    console.log('ESTOY EN EL IF 05');

    await addLinkToUser(existingUserId, url);
    console.log('SALI EN EL IF 05');

  } else {
    console.log('ESTOY EN EL ELSE 05');

    const newUser = await createUser(userEmail);
    await createUserLink(newUser.id, linkId);
    console.log('SALI DEL ELSE 05');

  }
  console.log('SALI DEL handleUserLinking');
  
}
