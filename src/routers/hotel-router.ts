import { Router } from 'express';

const hotelRouter = Router();

hotelRouter.get('/');
hotelRouter.get('/:hotelId');

export { hotelRouter };
