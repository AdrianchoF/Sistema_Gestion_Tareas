import express from 'express';
import { config } from './config';
import { testConnect } from './persistence/db';
import authRoutes from './api/routes/authRoutes';
import { errorHandler } from './api/middlewares/errorHandler';
import taskRoutes from './api/routes/taskRoutes';
// import { createUser, findUserByEmail } from './persistence/userRepository';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use(errorHandler);

async function start() {
    try {
        await testConnect();
        // Pruebas para crear y buscar un usuario en la base de datos
        // await createUser('Felipe', 'felipebaquero28@gmail.com', 'hash-de-prueba');
        // console.log('Usuario creado exitosamente');
        // const user = await findUserByEmail('felipebaquero28@gmail.com');
        // console.log('Usuario encontrado:', user);

        app.listen(config.port, () => {
        console.log(`Servidor corriendo en http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error);
        process.exit(1);
    }
}

start();