import {
  findExistingUrl,
  addLinkToUser,
  findExistingUser,
  createShortUrl,
  createUser,
  createUserLink,
  disconnect
} from '../services/shortUrlService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, userEmail } = req.body;

    try {
      const existingUrl = await findExistingUrl(url);
      let shortUrl;
      let linkId; // Declarar la variable aquí

      if (existingUrl) {
        console.log("URL YA UTILIZADA");
        shortUrl = existingUrl.shortUrl;
        linkId = existingUrl.id; // Asignar el ID de la URL existente
      
      } else {
        console.log("URL NUEVA");
        shortUrl = Math.random().toString(36).substr(2, 6);
        const newLink = await createShortUrl(url, shortUrl);
        shortUrl = newLink.shortUrl;
        linkId = newLink.id; // Asignar el ID del nuevo enlace
      
      }

      console.log("URL ACOTADA: ", shortUrl);

      if (userEmail !== null) {

        const existingUserId = await findExistingUser(userEmail);

        if (existingUserId) {
          // me quede aca
          console.log("ID del usuario existente:", existingUserId);
          await addLinkToUser(existingUserId, url); // Agregar la URL al usuario existente
        } else {
          console.log("No se encontró el usuario, voy a crearlo");
          const newUser = await createUser(userEmail);
          console.log("Nuevo usuario creado con ID:", newUser.id);
          await createUserLink(newUser.id, linkId); // Vincular con linkId
          console.log("Usuario vinculado con la URL");
        }
      }

      console.log("------------------- SHORT URL GENERADA ----------------");
      return res.status(201).send({ shortUrl });

    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: 'Internal server error' });
    } finally {
      await disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
