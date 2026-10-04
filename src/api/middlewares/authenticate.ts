import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { AuthenticationError } from '../../utils/errors';

/** Request que, tras autenticarse, lleva el id del usuario. */
export interface AuthRequest extends Request {
    userId?: number;
}

/** Lee `Authorization: Bearer <token>`, lo verifica y deja `req.userId` disponible. */
export function authenticate(req: AuthRequest, _res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return next(new AuthenticationError('Token no proporcionado'));
    }

    const token = header.slice(7);
    try {
        const payload = jwt.verify(token, config.jwt.secret, { algorithms: ['HS256'] });
        if (typeof payload === 'string' || typeof payload.userId !== 'number') {
        return next(new AuthenticationError('Token inválido'));
        }
        req.userId = payload.userId;
        next();
    } catch {
        next(new AuthenticationError('Token inválido o expirado'));
    }
}