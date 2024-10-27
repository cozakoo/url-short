import {
  findExistingUrl,
  addLinkToUser,
  findExistingUser,
  createShortUrl,
  createUser,
  createUserLink,
  disconnect
} from '../../services/shortUrlService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, userEmail } = req.body;
    
    // Muestra en la terminal la URL y el correo del usuario
    console.log('URL a acortar:', url);
    console.log('Correo del usuario:', userEmail);

    try {
      const existingUrl = await findExistingUrl(url);
      let shortUrl;
      let linkId; // Declarar la variable aquí

      if (existingUrl) {
        shortUrl = existingUrl.shortUrl;
        linkId = existingUrl.id; // Asignar el ID de la URL existente
      } else {
        shortUrl = Math.random().toString(36).substr(2, 6);
        const newLink = await createShortUrl(url, shortUrl);
        shortUrl = newLink.shortUrl;
        linkId = newLink.id; // Asignar el ID del nuevo enlace
      }

      if (userEmail !== null) {
        const existingUserId = await findExistingUser(userEmail);

        if (existingUserId) {
          await addLinkToUser(existingUserId, url); // Agregar la URL al usuario existente
        } else {
          const newUser = await createUser(userEmail);
          await createUserLink(newUser.id, linkId); // Vincular con linkId
        }
      }

      return res.status(201).send({ shortUrl });

    } catch (error) {
      console.error('Error al procesar la solicitud:', error); // Agregar este log para errores
      return res.status(500).send({ error: 'Internal server error' });
    } finally {
      await disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}