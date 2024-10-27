// pages/api/urls/[id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'DELETE':
      try {
        // Usa delete con el id directamente
        const deletedUrl = await prisma.userLink.delete({
          where: { id: id }, // Cambia a userLink según tu modelo en Prisma
        });
        res.status(200).json({ message: 'URL eliminada con éxito', deletedUrl });
      } catch (error) {
        if (error.code === 'P2025') { // Código de error para "No se encontró el registro"
          return res.status(404).json({ message: 'URL no encontrada' });
        }
        res.status(500).json({ message: 'Error al eliminar la URL', error });
      }
      break;

    // Otros métodos (GET, POST) pueden ir aquí

    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Método ${method} no permitido`);
      break;
  }
}
