import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getPayment, makePayment } from '@/controllers/payment-controller';

const paymentRouter = Router();

paymentRouter.all('/*', authenticateToken).get('/', getPayment).post('/process', makePayment);

export { paymentRouter };
