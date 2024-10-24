import { PrismaClient } from '@prisma/client';

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
  const { url } = req.body;
  const shortUrl = Math.random().toString(36).substr(2, 6);

  try {
    // Validar que la URL proporcionada sea válida
    if (!isUrlValid(url)) {
      return res.status(400).send({ error: 'Invalid URL. Please provide a valid URL.' });
    }

    // Verificar si la URL ya existe en la base de datos
    const existingUrl = await prisma.link.findUnique({
      where: { url },
    });

    if (existingUrl) {
      // Si la URL ya existe, devolver la shortURL existente
      return res.status(200).send({ shortUrl: existingUrl.shortUrl });
    }

    // Si no existe, crear una nueva entrada
    const data = await prisma.link.create({
      data: { url, shortUrl },
    });

    return res.status(200).send(data);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
