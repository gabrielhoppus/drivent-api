import { Router } from 'express';
import { getHotels, getRooms } from '@/controllers/hotel-controller';
import { authenticateToken } from '@/middlewares';

const hotelRouter = Router();

hotelRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getRooms);

export { hotelRouter };
