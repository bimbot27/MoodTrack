# MoodTrack

Aplicación web para detección y seguimiento de la depresión con encuestas PHQ‑9, MADRS y Beck (BDI‑II). Incluye backend en Express con MySQL, autenticación JWT, y frontend en React.

## Requisitos

- Node.js 18+
- MySQL 8 (base de datos accesible)

## Configuración

1. Crea un archivo `.env` en la raíz (ya añadido) y ajusta credenciales:

```
DB_HOST=localhost
DB_NAME=moodtrack
DB_USER=root
DB_PASSWORD=contraseña
JWT_SECRET=cámbiame
REACT_APP_API_URL=http://localhost:4000
```

2. Instala dependencias e inicializa:

```
npm install
```

3. Crea la base en MySQL (si no existe):

```
CREATE DATABASE moodtrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Arranca en desarrollo (frontend + backend):

```
npm run dev
```

El servidor API escucha en `http://localhost:4000` y el frontend en `http://localhost:3000`.

Al iniciar el backend, se crean tablas y se cargan preguntas si aún no existen.

## Rutas principales

- `POST /api/auth/register` { email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/surveys/:type/questions` — `:type` en { phq9, madrs, beck }
- `POST /api/surveys/:type/submit` — body { answers: number[] } (requiere JWT)
- `GET /api/me/summary` (JWT)
- `GET /api/me/responses` (JWT)

## Notas

- El frontend requiere `REACT_APP_API_URL` definido para apuntar al backend.
- La severidad se calcula según rangos comunes de cada instrumento.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Scripts Disponibles



### `npm start`

Ejecuta la aplicación en el modo de desarrollo.\
Abrir [http://localhost:3000](http://localhost:3000) para ver la app en el navegador.

La página se actualiza sola.\
También es posible que veas errores en la consola.

### `npm test`

Inicia el ejecutor de pruebas en modo de observación interactiva.

Consulta la sección sobre [ejecución de pruebas](https://facebook.github.io/create-react-app/docs/running-tests) para obtener más información.

### `npm run build`

Compila la aplicación para producción en la carpeta `build`.

Integra React correctamente en modo de producción y optimiza la compilación para obtener el mejor rendimiento.

La compilación se minimiza y los nombres de archivo incluyen los hashes.

¡Tu aplicación está lista para implementarse!

Consulta la sección sobre [implementación](https://facebook.github.io/create-react-app/docs/deployment) para obtener más información.

### `npm run eject`

**Nota: Esta operación es unidireccional. Una vez que hayas realizado la operación `eject`, ¡no hay vuelta atrás!**

Si no estás satisfecho con la herramienta de compilación y las opciones de configuración, puedes realizar la operación `eject` en cualquier momento. Este comando eliminará la dependencia de compilación de tu proyecto.

En su lugar, copiará todos los archivos de configuración y las dependencias transitivas (webpack, Babel, ESLint, etc.) directamente en tu proyecto para que tengas control total sobre ellas. Todos los comandos, excepto `eject`, seguirán funcionando, pero apuntarán a los scripts copiados para que puedas modificarlos. En este punto, depende de ti.

No es necesario que uses `eject`. El conjunto de funciones seleccionadas es adecuado para implementaciones pequeñas y medianas, y no deberías sentirte obligado a usarla. Sin embargo, entendemos que esta herramienta no sería útil si no pudieras personalizarla cuando estés listo para usarla.

## Más información

Puedes obtener más información en la [Documentación para crear una app con React](https://facebook.github.io/create-react-app/docs/getting-started).

Para aprender React, consulta la [Documentación de React](https://reactjs.org/).

### División de código

Esta sección se ha trasladado aquí: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Análisis del tamaño del paquete

Esta sección se ha trasladado aquí: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Creación de una aplicación web progresiva

Esta sección se ha trasladado aquí: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Avanzado Configuración

Esta sección se ha movido aquí: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Implementación

Esta sección se ha movido aquí: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` falla al minificar

Esta sección se ha movido aquí: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
# MoodTrack
