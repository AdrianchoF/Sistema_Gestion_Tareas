/** Error base de la aplicación: lleva el código HTTP que se debe responder. */
export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Datos de entrada inválidos') {
        super(message, 400);
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'No autenticado') {
        super(message, 401);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'El recurso ya existe') {
        super(message, 409);
    }
}