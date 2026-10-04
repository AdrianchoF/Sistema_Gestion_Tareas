# API de Gestión de Tareas

API RESTful hecha con **Node.js, Express y TypeScript** sobre **PostgreSQL**. Permite a los usuarios registrarse, iniciar sesión y administrar sus propias tareas personales. Cada usuario solo puede ver y modificar las tareas que creó.

## Arquitectura

El proyecto se organiza en capas, cada una con una sola responsabilidad:

```
src/
├── api/
│   ├── routes/         Definición de rutas
│   ├── middlewares/    authenticate (JWT), validate (AJV), errorHandler
│   └── schemas/        Esquemas JSON Schema de validación
├── controllers/        Reciben la petición y devuelven la respuesta HTTP
├── services/           Lógica de negocio (hash, JWT, reglas de tareas)
├── persistence/        Consultas SQL a PostgreSQL (pool de conexiones)
├── config/             Configuración centralizada (patrón Singleton)
├── docs/               Especificación OpenAPI/Swagger
├── utils/              Clases de error personalizadas
└── index.ts            Punto de entrada
```

Flujo de una petición: **ruta → middlewares (autenticación y validación) → controlador → servicio → persistencia → base de datos**. Los errores se lanzan como clases personalizadas (`ValidationError`, `AuthenticationError`, `NotFoundError`, `ConflictError`) y un middleware central los convierte en una respuesta JSON consistente.

### Decisiones de diseño

- Las contraseñas se guardan con **bcrypt** (hash de una sola vía), nunca en texto plano.
- Cada consulta de tareas filtra por `id_usuario`, por lo que un usuario no puede acceder a tareas ajenas. Si una tarea existe pero es de otro usuario, la API responde **404**, para no revelar que existe.
- Todas las consultas SQL son **parametrizadas** (protección contra inyección SQL).
- El login devuelve el mismo mensaje para "correo inexistente" y "contraseña incorrecta".

## Requisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm

## Instalación local

```bash
git clone https://github.com/AdrianchoF/Sistema_Gestion_Tareas.git
cd Sistema_Gestion_Tareas
npm install
```

### 1. Crear la base de datos

Con `psql` o pgAdmin, crea la base de datos y ejecuta el script de tablas:

```sql
CREATE DATABASE gestion_tareas;
```

Conéctate a `gestion_tareas` y ejecuta:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(150) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente' NOT NULL CHECK (estado IN ('pendiente', 'en curso', 'completada')),
  id_usuario INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```

### 2. Configurar las variables de entorno

Copia el archivo de ejemplo y completa tus valores:

```bash
cp .env.example .env
```

En Windows (PowerShell): `copy .env.example .env`

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto 3000) |
| `DB_HOST` | Host de PostgreSQL (ej. `localhost`) |
| `DB_PORT` | Puerto de PostgreSQL (ej. `5432`) |
| `DB_USER` | Usuario de PostgreSQL |
| `DB_PASSWORD` | Contraseña del usuario de PostgreSQL |
| `DB_NAME` | Nombre de la base de datos (`gestion_tareas`) |
| `JWT_SECRET` | Secreto para firmar los tokens (usa uno largo y aleatorio) |
| `JWT_EXPIRES_IN` | Duración del token (ej. `1h`) |

Para generar un `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor en modo desarrollo (recarga automática) |
| `npm run build` | Compila TypeScript a la carpeta `dist` |
| `npm start` | Ejecuta la versión compilada |

Al iniciar, la aplicación comprueba la conexión con la base de datos y no arranca si falla.

## Documentación de la API (Swagger)

Con el servidor corriendo, abre **http://localhost:3000/docs**.

Para probar los endpoints protegidos: haz `POST /auth/login`, copia el `token`, pulsa **Authorize** y pégalo.

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registrar un usuario |
| POST | `/auth/login` | No | Iniciar sesión y obtener JWT |
| POST | `/tasks` | Sí | Crear una tarea |
| GET | `/tasks` | Sí | Listar las tareas del usuario |
| GET | `/tasks/:id` | Sí | Consultar una tarea propia |
| PUT | `/tasks/:id` | Sí | Modificar una tarea propia |
| DELETE | `/tasks/:id` | Sí | Eliminar una tarea propia |

Las rutas protegidas requieren la cabecera `Authorization: Bearer <token>`.

### Formato de errores

```json
{ "error": { "type": "NotFoundError", "message": "Tarea no encontrada" } }
```

| Código | Cuándo |
|---|---|
| 400 | Datos de entrada inválidos |
| 401 | Token ausente/inválido o credenciales incorrectas |
| 404 | Tarea inexistente o de otro usuario |
| 409 | El correo ya está registrado |
| 500 | Error interno |

## Bitácora de desarrollo

El proceso, el uso de asistentes de IA y los retos encontrados están documentados en [DEVELOPMENT_LOG.md](./DEVELOPMENT_LOG.md).