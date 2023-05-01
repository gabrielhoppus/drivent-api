import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createBooking, getBookingById, updateBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getBookingById)
  .post('/', createBooking)
  .put('/:bookingId', updateBooking);

export { bookingRouter };
