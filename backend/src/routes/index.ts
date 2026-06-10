import { Router } from 'express';
import authRoutes from './auth.routes';
import membershipRoutes from './membership.routes';
import aiRoutes from './ai.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/memberships', membershipRoutes);
router.use('/ai', aiRoutes);
router.use('/admin', adminRoutes);

export default router;