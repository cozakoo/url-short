// pages/api/findUser.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Validar que el método sea GET para esta API
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Obtener el email del query de la solicitud
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email es requerido' });
  }

  try {
    // Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Si se encuentra el usuario, devuelve el ID
    if (user) {
      return res.status(200).json({ userId: user.id });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}