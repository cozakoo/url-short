import { PrismaClient } from "@prisma/client";

export default function ShortIdPage() {
  return <div>ShortID Redirect</div>;
}

export async function getServerSideProps({ params }) {
  const prisma = new PrismaClient();
  const { shortId } = params;

  // Buscar el enlace correspondiente al shortId
  const link = await prisma.link.findUnique({
    where: { shortUrl: shortId },
  });

  // Si no se encuentra el enlace, redirigir a la página principal
  if (!link) {
    return {
      redirect: { destination: "/" },
    };
  }

  // Incrementar el contador de redirecciones
  await prisma.link.update({
    where: { shortUrl: shortId },
    data: { redirectCount: link.redirectCount + 1 },
  });

  // Desconectar el cliente de Prisma
  await prisma.$disconnect();

  // Redirigir al enlace original
  return {
    redirect: {
      destination: link.url,
    },
  };
}
