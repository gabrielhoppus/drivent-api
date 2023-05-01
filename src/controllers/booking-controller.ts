import httpStatus from 'http-status';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';
import ticketService from '@/services/ticket-service';

export async function getBookingById(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;
    const booking = await bookingService.getBookingById(userId);

    return res.send(booking).status(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId as number;
    const roomId = req.body;

    const tickets = await ticketService.getTicketByUserId(userId);

    if (tickets.status !== 'PAID' || tickets.TicketType.isRemote === true || tickets.TicketType.includesHotel !== true)
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);

    const booking = await bookingService.bookRoom(userId, roomId);

    return res.send(booking.id).status(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'ForbiddenError') return res.sendStatus(httpStatus.FORBIDDEN);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    const bookingId = Number(req.params.bookingId);
    const roomId = req.body;

    const booking = await bookingService.updateBookingRoom(userId, bookingId, roomId);

    return res.send(booking.id).status(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'ForbiddenError') return res.sendStatus(httpStatus.FORBIDDEN);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
