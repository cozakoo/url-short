// pages/api/links.js
import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {

    const prisma = new PrismaClient();


  try {
    const links = await prisma.link.findMany(); // Obtén todos los enlaces
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener enlaces' });
  }
}
