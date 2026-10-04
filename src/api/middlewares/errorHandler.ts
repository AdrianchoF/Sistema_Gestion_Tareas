import { NextFunction, Request, Response } from 'express';
import { AppError } from '../../utils/errors';

/** Middleware centralizado: toda respuesta de error sale con el mismo formato. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: { type: err.name, message: err.message } });
        return;
    }

    console.error(err);
    res.status(500).json({ error: { type: 'InternalServerError', message: 'Error interno del servidor' } });
}