// pages/api/getUserLinks.js
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const prisma = new PrismaClient();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Obtener el email desde los parámetros de la consulta
  const email = req.query.email;

  // Busca el usuario por email
  const user = await prisma.user.findUnique({
    where: { email }, // Asegúrate de que tengas un índice único para el correo en tu modelo de usuario
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Usa el ID del usuario para buscar sus enlaces
  const userLinks = await prisma.userLink.findMany({
    where: {
      userId: user.id,
    },
    include: {
      link: true,
    },
  });
  
  const baseUrl = process.env.NEXTAUTH_URL;

  const links = userLinks.map(userLink => ({
    id: userLink.id,
    url: userLink.link.url,
    shortUrl: `${baseUrl}/${userLink.link.shortUrl}`,
  }));

  res.json(links);
}
