// pages/api/shortUrl.js
import { PrismaClient } from '@prisma/client';
import { getSession } from "next-auth/react";

function isUrlValid(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

export default async function handler(req, res) {
  const prisma = new PrismaClient();

  if (req.method === 'POST') {
    const { data: session } = useSession();
    
    //FALTA: encontrar el usuario
    
    const session = await getSession({ req });
    const { url } = req.body;

    // Validar que la URL proporcionada sea válida
    if (!isUrlValid(url)) {
      return res.status(400).send({ error: 'Invalid URL. Please provide a valid URL.' });
    }

    try {
      // Verificar si la URL ya existe en la base de datos
      const existingUrl = await prisma.link.findUnique({
        where: { url },
      });

      if (existingUrl) {
        // Si la URL ya existe, devolver la shortURL existente
        return res.status(200).send({ shortUrl: existingUrl.shortUrl });
      }

      // Generar una shortUrl única usando Math.random
      const shortUrl = Math.random().toString(36).substr(2, 6);

      // Si está logueado, vincular la URL al usuario
      if (session) {
        console.log("esta autenticado.");
        const data = await prisma.link.create({
          data: {
            url,
            shortUrl,
            userId: session.user.id, // Vincular la URL al usuario autenticado
          },
        });
        return res.status(200).send({ shortUrl });
      } else {
        console.log("No estás autenticado.");
        // Si no está logueado, crear el link sin vincularlo a un usuario
        const data = await prisma.link.create({
          data: {
            url,
            shortUrl,
          },
        });
        return res.status(200).send({ shortUrl });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
