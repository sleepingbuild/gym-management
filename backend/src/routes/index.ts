import { Router } from 'express';
import authRoutes from './auth.routes';
import membershipRoutes from './membership.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/memberships', membershipRoutes);

export default router;
