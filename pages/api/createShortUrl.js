// pages/api/createShortUrl.js
import { PrismaClient } from '@prisma/client';


export default async function handler(req, res) {
    const prisma = new PrismaClient();

    if (req.method === 'POST') {
    const { url, shortUrl } = req.body;

    try {
      const link = await prisma.link.create({
        data: { url, shortUrl },
      });
      return res.status(200).json(link);
    } catch (error) {
      return res.status(500).json({ error: 'Error al crear el enlace.' });
    }
  } else {
    // Manejo de métodos no permitidos
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
