import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// findExistingUser con logs detallados
export async function findExistingUser(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    return user.id;
  } else {
    return null;
  }
}


// Función para crear un nuevo usuario
export async function createUser(email) {
  return await prisma.user.create({
    data: { email },
  });
}

export async function createShortUrl(url, shortUrl) {
  return await prisma.link.create({
    data: { url, shortUrl },
  });
}

export async function createUserLink(userId, linkId) {
  return await prisma.userLink.create({
    data: { userId, linkId },
  });
}

export async function disconnect() {
  await prisma.$disconnect();
}

// Función optimizada para agregar un enlace a un usuario
export async function addLinkToUser(userId, url) {
  try {
    // Buscar o crear el enlace (Link)
    const link = await prisma.link.upsert({
      where: { url },
      update: {}, // No actualiza nada si el enlace ya existe
      create: { url, shortUrl: generateShortUrl() } // Crear un nuevo Link si no existe
    });

    // Crear el vínculo solo si no existe
    await prisma.userLink.upsert({
      where: {
        userId_linkId: { userId, linkId: link.id } // Usa la restricción única
      },
      update: {}, // No actualiza si ya existe
      create: {
        userId,
        linkId: link.id
      }
    });
  } catch (error) {
    console.error("Error al agregar la URL al usuario:", error);
  }
}

// Función para generar un shortUrl aleatorio
function generateShortUrl() {
  return Math.random().toString(36).substr(2, 6);
}
