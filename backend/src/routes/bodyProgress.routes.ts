import { Router } from 'express';
import { bodyProgressController } from '../controllers/bodyProgress.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', bodyProgressController.create);
router.get('/', bodyProgressController.getAll);
router.get('/latest', bodyProgressController.getLatest);
router.get('/chart', bodyProgressController.getChartData);
router.get('/stats', bodyProgressController.getStats);
router.put('/:id', bodyProgressController.update);
router.delete('/:id', bodyProgressController.delete);

export default router;
