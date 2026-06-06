import { Router } from 'express';
import { membershipController } from '../controllers/membership.controller';

const router = Router();

// Public - khong can auth de xem danh sach goi
router.get('/plans', membershipController.getPlans);

export default router;
