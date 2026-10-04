import { Pool } from "pg";
import  { config }  from '../config/index';

const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
})

async function testConnect() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log("Conexión exitosa con la base de datos:", res.rows);
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        throw error;
    }
}

export default pool;
export { testConnect };