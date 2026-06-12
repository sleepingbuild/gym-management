import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Protected
router.post('/create', authenticate, paymentController.createPayment);
router.get('/history', authenticate, paymentController.getPaymentHistory);

// Callbacks - khong can auth (VNPay/MoMo goi truc tiep)
router.get('/vnpay-return', paymentController.vnpayReturn);
router.post('/momo-webhook', paymentController.momoWebhook);

export default router;