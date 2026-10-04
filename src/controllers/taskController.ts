import { NextFunction, Response } from 'express';
import { AuthRequest } from '../api/middlewares/authenticate';
import * as taskService from '../services/taskService';
import { AuthenticationError, ValidationError } from '../utils/errors';

/** Obtiene el id del usuario que dejó el middleware de autenticación. */
function getUserId(req: AuthRequest): number {
    if (req.userId === undefined) {
        throw new AuthenticationError();
    }
    return req.userId;
}

/** Convierte el parámetro :id en número o lanza un error de validación. */
function parseId(value: string | string[] | undefined): number {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) {
        throw new ValidationError('El id debe ser un entero positivo');
    }
    return id;
}

export async function create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const task = await taskService.createTask(getUserId(req), req.body);
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
}

export async function list(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const tasks = await taskService.listTasks(getUserId(req));
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const task = await taskService.getTask(parseId(req.params.id), getUserId(req));
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const task = await taskService.updateTask(parseId(req.params.id), getUserId(req), req.body);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        await taskService.deleteTask(parseId(req.params.id), getUserId(req));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}