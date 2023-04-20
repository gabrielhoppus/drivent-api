import { Router } from 'express';
import { getHotels } from '@/controllers/hortel-controller';

const hotelRouter = Router();

hotelRouter.get('/', getHotels);
// hotelRouter.get('/:hotelId');

export { hotelRouter };
