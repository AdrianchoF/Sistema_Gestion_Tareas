import { Router } from 'express';
import { create, getById, list, remove, update } from '../../controllers/taskController';
import { authenticate } from '../middlewares/authenticate';
import { validateBody } from '../middlewares/validate';
import { taskSchema } from '../schemas/schemas';

const router = Router();

// Todas las rutas de tareas exigen un token válido.
router.use(authenticate);

router.post('/', validateBody(taskSchema), create);
router.get('/', list);
router.get('/:id', getById);
router.put('/:id', validateBody(taskSchema), update);
router.delete('/:id', remove);

export default router;