import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/authService';

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { nombre, correo, contrasena } = req.body;
        const user = await authService.register(nombre, correo, contrasena);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { correo, contrasena } = req.body;
        const result = await authService.login(correo, contrasena);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}