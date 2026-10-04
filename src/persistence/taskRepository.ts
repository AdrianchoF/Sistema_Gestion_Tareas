import pool from './db';

export type TaskStatus = 'pendiente' | 'en curso' | 'completada';

export interface Task {
    id: number;
    titulo: string;
    descripcion: string;
    fecha_vencimiento: Date;
    estado: TaskStatus;
    id_usuario: number;
}

export interface TaskInput {
    titulo: string;
    descripcion: string;
    fecha_vencimiento: string;
    estado?: TaskStatus;
}

/** Crea una tarea asociada al usuario dueño. Si no llega estado, aplica el DEFAULT de la tabla. */
export async function createTask(userId: number, data: TaskInput): Promise<Task> {
    const result = await pool.query<Task>(
        `INSERT INTO tasks (titulo, descripcion, fecha_vencimiento, estado, id_usuario)
        VALUES ($1, $2, $3, COALESCE($4, 'pendiente'), $5)
        RETURNING *`,
        [data.titulo, data.descripcion, data.fecha_vencimiento, data.estado ?? null, userId],
    );
    return result.rows[0] as Task;
}

/** Lista únicamente las tareas del usuario. */
export async function findTasksByUser(userId: number): Promise<Task[]> {
    const result = await pool.query<Task>(
        'SELECT * FROM tasks WHERE id_usuario = $1 ORDER BY id',
        [userId],
    );
    return result.rows;
}

/** Busca una tarea por id SOLO si pertenece al usuario. */
export async function findTaskById(id: number, userId: number): Promise<Task | null> {
    const result = await pool.query<Task>(
        'SELECT * FROM tasks WHERE id = $1 AND id_usuario = $2',
        [id, userId],
    );
    return result.rows[0] ?? null;
}

/** Actualiza una tarea SOLO si pertenece al usuario. Devuelve null si no existe o es ajena. */
export async function updateTask(id: number, userId: number, data: TaskInput): Promise<Task | null> {
    const result = await pool.query<Task>(
        `UPDATE tasks
        SET titulo = $1, descripcion = $2, fecha_vencimiento = $3, estado = COALESCE($4, estado)
        WHERE id = $5 AND id_usuario = $6
        RETURNING *`,
        [data.titulo, data.descripcion, data.fecha_vencimiento, data.estado ?? null, id, userId],
    );
    return result.rows[0] ?? null;
}

/** Elimina una tarea SOLO si pertenece al usuario. Devuelve true si se borró algo. */
export async function deleteTask(id: number, userId: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND id_usuario = $2', [id, userId]);
    return (result.rowCount ?? 0) > 0;
}