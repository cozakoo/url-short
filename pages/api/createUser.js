// pages/api/createUser.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Verificar que el método sea POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Obtener el email del cuerpo de la solicitud
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email es requerido' });
  }

  try {
    // Crear el usuario en la base de datos
    const newUser = await prisma.user.create({
      data: { email },
    });

    console.log(`Nuevo usuario creado: ID = ${newUser.id}`);
    return res.status(201).json({ userId: newUser.id, message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}
