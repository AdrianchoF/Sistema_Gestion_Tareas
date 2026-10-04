import * as taskRepository from '../persistence/taskRepository';
import { Task, TaskInput } from '../persistence/taskRepository';
import { NotFoundError } from '../utils/errors';

export function createTask(userId: number, data: TaskInput): Promise<Task> {
    return taskRepository.createTask(userId, data);
}

export function listTasks(userId: number): Promise<Task[]> {
    return taskRepository.findTasksByUser(userId);
}

export async function getTask(id: number, userId: number): Promise<Task> {
    const task = await taskRepository.findTaskById(id, userId);
    if (!task) {
        throw new NotFoundError('Tarea no encontrada');
    }
    return task;
}

export async function updateTask(id: number, userId: number, data: TaskInput): Promise<Task> {
    const task = await taskRepository.updateTask(id, userId, data);
    if (!task) {
        throw new NotFoundError('Tarea no encontrada');
    }
    return task;
}

export async function deleteTask(id: number, userId: number): Promise<void> {
    const deleted = await taskRepository.deleteTask(id, userId);
    if (!deleted) {
        throw new NotFoundError('Tarea no encontrada');
    }
}