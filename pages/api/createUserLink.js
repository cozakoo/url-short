// pages/api/createUserLink.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Verificar que el método sea POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { userId, linkId } = req.body;

  if (!userId || !linkId) {
    return res.status(400).json({ message: 'userId y linkId son requeridos' });
  }

  try {
    // Crear el vínculo en la base de datos
    const userLink = await prisma.userLink.create({
      data: { userId, linkId },
    });

    return res.status(201).json({ userLink, message: 'Vínculo creado exitosamente' });
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}
