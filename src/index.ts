import express from 'express';
import { config } from './config';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.listen(config.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.port}`);
});