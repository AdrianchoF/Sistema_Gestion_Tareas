import pool from './db';

export interface User {
    id: number;
    nombre: string;
    correo: string;
    contrasena: string;
    fecha_creacion: Date;
}

async function createUser(nombre: string, correo: string, contrasena: string): Promise<Omit<User, 'contrasena'>> {
    const query = 'INSERT INTO users (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id, nombre, correo, fecha_creacion';
    const values = [nombre, correo, contrasena];

    const result = await pool.query(query, values);
    return result.rows[0];
}

async function findUserByEmail(correo: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE correo = $1';
    const values = [correo];

    const result = await pool.query(query, values);
    return result.rows[0] || null;
}

export { createUser, findUserByEmail };