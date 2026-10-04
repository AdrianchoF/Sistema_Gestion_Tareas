import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { createUser, findUserByEmail, User } from '../persistence/userRepository';
import { AuthenticationError, ConflictError } from '../utils/errors';

const SALT_ROUNDS = 10;

/** Registra un usuario nuevo guardando solo el hash de la contraseña. */
export async function register(nombre: string, correo: string, contrasena: string) : Promise<Omit<User, 'contrasena'>> {
    const existing = await findUserByEmail(correo);
    if (existing) {
        throw new ConflictError('El correo ya está registrado');
    }
    const hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
    return createUser(nombre, correo, hash);
}

/** Verifica credenciales y devuelve un JWT si son correctas. */
export async function login(correo: string, contrasena: string): Promise<{ token: string }> {
    const user = await findUserByEmail(correo);
    const passwordOk = user ? await bcrypt.compare(contrasena, user.contrasena) : false;

    if (!user || !passwordOk) {
        // Mismo mensaje para "correo no existe" y "contraseña incorrecta".
        throw new AuthenticationError('Credenciales inválidas');
    }

    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
    });
    return { token };
}