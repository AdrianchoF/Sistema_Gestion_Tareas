/** Especificación OpenAPI 3.0 de la API. Se sirve como página interactiva en /docs. */
export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API de Gestión de Tareas',
        version: '1.0.0',
        description:
        'API RESTful para registrar usuarios, iniciar sesión y administrar tareas personales. ' +
        'Cada usuario solo puede ver y modificar sus propias tareas.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
    tags: [
        { name: 'Auth', description: 'Registro e inicio de sesión' },
        { name: 'Tasks', description: 'Gestión de tareas (requiere token)' },
    ],
    components: {
        securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
        schemas: {
        RegisterRequest: {
            type: 'object',
            required: ['nombre', 'correo', 'contrasena'],
            properties: {
            nombre: { type: 'string', maxLength: 100, example: 'Felipe' },
            correo: { type: 'string', format: 'email', example: 'felipe@correo.com' },
            contrasena: { type: 'string', minLength: 8, maxLength: 72, example: 'Clave12345' },
            },
        },
        LoginRequest: {
            type: 'object',
            required: ['correo', 'contrasena'],
            properties: {
            correo: { type: 'string', format: 'email', example: 'felipe@correo.com' },
            contrasena: { type: 'string', example: 'Clave12345' },
            },
        },
        User: {
            type: 'object',
            properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Felipe' },
            correo: { type: 'string', example: 'felipe@correo.com' },
            fecha_creacion: { type: 'string', format: 'date-time' },
            },
        },
        TaskInput: {
            type: 'object',
            required: ['titulo', 'descripcion', 'fecha_vencimiento'],
            properties: {
            titulo: { type: 'string', maxLength: 200, example: 'Estudiar bcrypt' },
            descripcion: { type: 'string', example: 'Repasar cómo funciona el hash' },
            fecha_vencimiento: { type: 'string', format: 'date', example: '2026-10-10' },
            estado: {
                type: 'string',
                enum: ['pendiente', 'en curso', 'completada'],
                description: "Opcional. Si no se envía, se usa 'pendiente'.",
            },
            },
        },
        Task: {
            type: 'object',
            properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string' },
            descripcion: { type: 'string' },
            fecha_vencimiento: { type: 'string', format: 'date-time' },
            estado: { type: 'string', enum: ['pendiente', 'en curso', 'completada'] },
            id_usuario: { type: 'integer', example: 1 },
            },
        },
        Error: {
            type: 'object',
            properties: {
            error: {
                type: 'object',
                properties: {
                type: { type: 'string', example: 'NotFoundError' },
                message: { type: 'string', example: 'Tarea no encontrada' },
                },
            },
            },
        },
        },
        responses: {
        Unauthorized: {
            description: 'Token ausente, inválido o expirado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        ValidationError: {
            description: 'Datos de entrada inválidos',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        NotFound: {
            description: 'Tarea no encontrada (o no pertenece al usuario)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        },
        parameters: {
        TaskId: {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer', minimum: 1 },
            description: 'Id de la tarea',
        },
        },
    },
    paths: {
        '/auth/register': {
        post: {
            tags: ['Auth'],
            summary: 'Registrar un usuario nuevo',
            requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
            },
            responses: {
            '201': {
                description: 'Usuario creado (sin contraseña)',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '409': {
                description: 'El correo ya está registrado',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            },
        },
        },
        '/auth/login': {
        post: {
            tags: ['Auth'],
            summary: 'Iniciar sesión y obtener un JWT',
            requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
            },
            responses: {
            '200': {
                description: 'Credenciales correctas',
                content: {
                'application/json': {
                    schema: { type: 'object', properties: { token: { type: 'string' } } },
                },
                },
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': {
                description: 'Credenciales inválidas',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
            },
            },
        },
        },
        '/tasks': {
        post: {
            tags: ['Tasks'],
            summary: 'Crear una tarea',
            security: [{ bearerAuth: [] }],
            requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } },
            },
            responses: {
            '201': {
                description: 'Tarea creada',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } },
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/Unauthorized' },
            },
        },
        get: {
            tags: ['Tasks'],
            summary: 'Listar las tareas del usuario autenticado',
            security: [{ bearerAuth: [] }],
            responses: {
            '200': {
                description: 'Lista de tareas del usuario',
                content: {
                'application/json': {
                    schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
                },
                },
            },
            '401': { $ref: '#/components/responses/Unauthorized' },
            },
        },
        },
        '/tasks/{id}': {
        get: {
            tags: ['Tasks'],
            summary: 'Consultar una tarea propia',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/TaskId' }],
            responses: {
            '200': {
                description: 'Tarea encontrada',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } },
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/Unauthorized' },
            '404': { $ref: '#/components/responses/NotFound' },
            },
        },
        put: {
            tags: ['Tasks'],
            summary: 'Modificar una tarea propia (reemplaza los campos)',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/TaskId' }],
            requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TaskInput' } } },
            },
            responses: {
            '200': {
                description: 'Tarea actualizada',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } },
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/Unauthorized' },
            '404': { $ref: '#/components/responses/NotFound' },
            },
        },
        delete: {
            tags: ['Tasks'],
            summary: 'Eliminar una tarea propia',
            security: [{ bearerAuth: [] }],
            parameters: [{ $ref: '#/components/parameters/TaskId' }],
            responses: {
            '204': { description: 'Tarea eliminada (sin contenido)' },
            '400': { $ref: '#/components/responses/ValidationError' },
            '401': { $ref: '#/components/responses/Unauthorized' },
            '404': { $ref: '#/components/responses/NotFound' },
            },
        },
        },
    },
};