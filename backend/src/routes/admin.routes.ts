import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.get('/stats', authenticate, authorize('ADMIN'), adminController.getStats);
router.get('/users', authenticate, authorize('ADMIN'), adminController.getUsers);

export default router;