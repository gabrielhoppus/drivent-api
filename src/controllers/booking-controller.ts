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
    const { userId } = req;

    const roomId = req.body.roomId;

    if (roomId < 1) return res.sendStatus(httpStatus.FORBIDDEN);

    const tickets = await ticketService.getTicketByUserId(userId);

    if (tickets.status !== 'PAID' || tickets.TicketType.isRemote === true || tickets.TicketType.includesHotel !== true)
      return res.sendStatus(httpStatus.FORBIDDEN);

    const booking = await bookingService.bookRoom(userId, roomId);

    return res.send({ bookingId: booking.id }).status(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    if (error.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { bookingId } = req.params;
  const roomId = req.body.roomId;
  try {
    if (roomId < 1 || Number(bookingId) < 1 || isNaN(Number(bookingId))) return res.sendStatus(httpStatus.FORBIDDEN);

    const booking = await bookingService.updateBookingRoom(userId, Number(bookingId), roomId);

    return res.send({ bookingId: booking.id }).status(httpStatus.OK);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send(error.message);
    if (error.name === 'ForbiddenError') return res.status(httpStatus.FORBIDDEN).send(error.message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error.message);
  }
}
