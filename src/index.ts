import express from 'express';
import { config } from './config';
import { testConnect } from './persistence/db';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

async function start() {
    try {
        await testConnect();

        app.listen(config.port, () => {
        console.log(`Servidor corriendo en http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error);
        process.exit(1);
    }
}

start();