import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuración de la aplicación.
 * Singleton: se carga una sola vez y se comparte en todo el proyecto.
 */

class Config {
    private static instance: Config;

    public readonly port: number;
    public readonly db: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    };
    public readonly jwt: {
        secret: string;
        expiresIn: string;
    };

    private constructor() {
        this.port = Number(process.env.PORT ?? 3000);
        this.db = {
            host: Config.required('DB_HOST'),
            port: Number(Config.required('DB_PORT')),
            user: Config.required('DB_USER'),
            password: Config.required('DB_PASSWORD'),
            database: Config.required('DB_NAME'),
        };
        this.jwt = {
            secret: Config.required('JWT_SECRET'),
            expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
        };
    }

    public static getInstance(): Config {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }

    private static required(name: string): string {
        const value = process.env[name];
        if (!value) {
            throw new Error(`Falta la variable de entorno obligatoria: ${name}`);
        }
        return value;
    }
}

export const config = Config.getInstance();