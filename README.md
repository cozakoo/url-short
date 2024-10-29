# Acortador de Url´s

![Captura de pantalla 2024-10-29 135429](https://github.com/user-attachments/assets/6e4c8a12-a843-4327-a871-3a862c9258b8)


El proyecto "Acortador de URL's" es una aplicación web diseñada para simplificar el uso y la gestión de enlaces largos, permitiendo a los usuarios acortar URL's y redirigir a su destino de manera eficiente. Desarrollado utilizando React y Next.js para una experiencia de usuario ágil y dinámica, el backend está construido con Prisma y MongoDB, garantizando un manejo robusto de datos.

Características Principales:

- Acortamiento de URL: Permite a los usuarios ingresar enlaces largos y obtener una versión corta que redirige al enlace original.

- Verificación de URL: Implementa un control para asegurarse de que la URL proporcionada sea válida y exista antes de acortarla, minimizando errores y mejorando la experiencia del usuario.

- Almacenamiento en Base de Datos: Todas las URL's acortadas se almacenan en una base de datos MongoDB, lo que permite un acceso rápido y una gestión sencilla de los enlaces acortados.


## Instrucciones para Ejecutar

Este es un proyecto de Next.js creado con create-next-app.

1. Clona el Repositorio

### Paso 1: Clonar el Repositorio
```bash
git clone https://github.com/cozakoo/url-short.git
```
### Paso 2: Ir al directorio clonado
```bash
cd url-short/
```
### Paso 3: Ejecutar
```bash
npm install
#o
yarn install
# o
pnpm install
# o
bun install
```

### Paso 4: Configura la Base de Datos
Asegúrate de tener MongoDB corriendo y configura tu conexión en el archivo de configuración correspondiente. Generalmente, esto se hace en un archivo .env o en la configuración de Prisma.

### Paso 5: Ejecuta el Servidor de Desarrollo
Inicia el servidor de desarrollo con el siguiente comando:

### Paso 6: Correr
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

### Paso 7: Accede a la Aplicación
Abre tu navegador y ve a http://localhost:3000 para ver el resultado.

### Paso 8: Modifica la Página de Inicio
Puedes comenzar a editar la página modificando el archivo pages/index.js. La página se actualizará automáticamente a medida que edites el archivo.

### Paso 9: Accede a las Rutas de la API
Las rutas de la API se pueden acceder en http://localhost:3000/api/shortUrl. Este endpoint se puede editar en pages/api/shortUrl.js.

### Paso 10: Estructura de la API
La carpeta pages/api está mapeada a /api/*. Los archivos en este directorio son tratados como rutas de API en lugar de páginas de React.
