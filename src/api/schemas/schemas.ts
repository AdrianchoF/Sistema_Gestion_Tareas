export const registerSchema = {
    type: 'object',
    required: ['nombre', 'correo', 'contrasena'],
    properties: {
        nombre: { type: 'string', minLength: 1, maxLength: 100 },
        correo: { type: 'string', format: 'email', maxLength: 150 },
        contrasena: { type: 'string', minLength: 8, maxLength: 72 },
    },
    additionalProperties: false,
};

export const loginSchema = {
    type: 'object',
    required: ['correo', 'contrasena'],
    properties: {
        correo: { type: 'string', format: 'email' },
        contrasena: { type: 'string', minLength: 1 },
    },
    additionalProperties: false,
};

export const taskSchema = {
    type: 'object',
    required: ['titulo', 'descripcion', 'fecha_vencimiento'],
    properties: {
        titulo: { type: 'string', minLength: 1, maxLength: 200 },
        descripcion: { type: 'string', minLength: 1 },
        fecha_vencimiento: { type: 'string', format: 'date' },
        estado: { type: 'string', enum: ['pendiente', 'en curso', 'completada'] },
    },
    additionalProperties: false,
};