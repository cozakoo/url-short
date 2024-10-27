import { useSession, signIn, signOut } from "next-auth/react"

export default function AccessToken() {
  const { data, status } = useSession()

  // Verifica el estado de la sesión
  if (status === "loading") {
    return <div>Cargando...</div>
  }

  if (status === "unauthenticated") {
    return (
      <div>
        No estás autenticado. <button onClick={() => signIn()}>Iniciar sesión</button>
      </div>
    )
  }

  // Si 'data' no está definido, muestra un mensaje de error o maneja la situación
  if (!data || !data.accessToken) {
    return <div>Error: No se pudo obtener el token de acceso.</div>
  }

  const { accessToken } = data

  return <div>Access Token: {accessToken}</div>
}
