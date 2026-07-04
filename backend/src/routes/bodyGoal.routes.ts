import { Router } from 'express';
import { bodyGoalController } from '../controllers/bodyGoal.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create goal
router.post('/', bodyGoalController.create);

// Get current goal
router.get('/current', bodyGoalController.getCurrent);

// Update goal
router.put('/', bodyGoalController.update);

// Check achievement
router.get('/check-achievement', bodyGoalController.checkAchievement);

// Delete goal
router.delete('/', bodyGoalController.delete);

export default router;