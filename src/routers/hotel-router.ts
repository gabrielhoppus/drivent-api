import { Router } from 'express';
import { getHotels } from '@/controllers/hotel-controller';
import { authenticateToken } from '@/middlewares';

const hotelRouter = Router();

hotelRouter.all('/*', authenticateToken).get('/', getHotels);
// hotelRouter.get('/:hotelId');

export { hotelRouter };
