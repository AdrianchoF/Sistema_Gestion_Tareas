import { Router } from 'express';
import { login, register } from '../../controllers/authController';
import { validateBody } from '../middlewares/validate';
import { loginSchema, registerSchema } from '../schemas/schemas';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);

export default router;