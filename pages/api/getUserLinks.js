// pages/api/getUserLinks.js
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const prisma = new PrismaClient();

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userLinks = await prisma.userLink.findMany({
    where: {
      userId: session.user.id, // Suponiendo que el ID del usuario está en session.user.id
    },
    include: {
      link: true, // Incluye los enlaces asociados
    },
  });

  const links = userLinks.map(userLink => ({
    id: userLink.link.id,
    url: userLink.link.url,
    shortUrl: userLink.link.shortUrl,
    createdAt: userLink.link.createdAt,
  }));

  res.json(links);
}
