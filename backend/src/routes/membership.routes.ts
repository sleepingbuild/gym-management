import { Router } from 'express';
import { membershipController } from '../controllers/membership.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Public
router.get('/plans', membershipController.getPlans);

// Protected - can auth
router.post('/buy', authenticate, membershipController.buyMembership);
router.get('/current', authenticate, membershipController.getCurrentMembership);

export default router;
