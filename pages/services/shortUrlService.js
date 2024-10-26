import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function findExistingUrl(url) {
  return await prisma.link.findUnique({
    where: { url },
  });
  
}

export async function findExistingUser(email) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  return user ? user.id : null; // Retorna el ID del usuario si existe, o null si no
}

// Función para crear un nuevo usuario
export async function createUser(email) {
  return await prisma.user.create({
    data: {
      email,
    },
  });
}

export async function createShortUrl(url, shortUrl) {
  return await prisma.link.create({
    data: {
      url,
      shortUrl,
    },
  });
}

export async function createUserLink(userId, linkId) {
  // Crear el enlace para el usuario usando userId
  return await prisma.userLink.create({
    data: {
      userId,
      linkId,
    },
  });
}

export async function disconnect() {
  await prisma.$disconnect();
}

// Función para crear o encontrar un Link y luego vincularlo con un User existente
export async function addLinkToUser(userId, url) {
  try {
    let shortUrl;
    shortUrl = Math.random().toString(36).substr(2, 6);

    // Buscar o crear el enlace (Link)
    const link = await prisma.link.upsert({
      where: { url },
      update: {}, // No actualiza nada si el enlace ya existe
      create: { url, shortUrl } // Crear un nuevo Link si no existe
    });

    // Verificar si el vínculo UserLink ya existe
    const existingUserLink = await prisma.userLink.findUnique({
      where: {
        userId_linkId: { userId, linkId: link.id } // Usa la restricción única
      }
    });

    // Crear el vínculo solo si no existe
    if (!existingUserLink) {
      await prisma.userLink.create({
        data: {
          userId: userId,
          linkId: link.id
        }
      });
      console.log("Nuevo vínculo creado entre el usuario y el enlace");
    } else {
      console.log("El vínculo entre el usuario y el enlace ya existe");
    }
  } catch (error) {
    console.error("Error al agregar la URL al usuario:", error);
  }
}