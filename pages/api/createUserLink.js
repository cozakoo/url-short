// pages/api/createUserLink.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Verificar que el método sea POST
  console.log(`----------------------------------------`);
  if (req.method !== 'POST') {
    console.log(`ESTOY EN EL IF DEL POST`);
    return res.status(405).json({ message: 'Método no permitido' });
  }else{
    console.log(`ESTOY EN EL ELSE DEL POST`);
  }

  const { userId, linkId } = req.body;
  
  console.log(`userId,`, userId);
  console.log(`linkId,`, linkId);

  if (!userId || !linkId) {
    console.log(`ESTOY EN EL IF DEL !userId || !linkId`);

    return res.status(400).json({ message: 'userId y linkId son requeridos' });
  }else{
    console.log(`ESTOY EN EL ELSE DEL !userId || !linkId`);
  }
  console.log(`Vínculo creado entre usuarioasdasdsad`);

  try {
    // Crear el vínculo en la base de datos
    const userLink = await prisma.userLink.create({
      data: { userId, linkId },
    });

    console.log(`Vínculo creado entre usuario ${userId} y link ${linkId}`);
    return res.status(201).json({ userLink, message: 'Vínculo creado exitosamente' });
  } catch (error) {
    console.error('Error al crear el vínculo:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
}
