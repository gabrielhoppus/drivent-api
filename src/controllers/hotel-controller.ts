import httpStatus from 'http-status';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import hotelService from '@/services/hotel-service';
import ticketService from '@/services/ticket-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const tickets = await ticketService.getTicketByUserId(userId);

    if (tickets.status !== 'PAID' || tickets.TicketType.isRemote === true || tickets.TicketType.includesHotel !== true)
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);

    const hotels = await hotelService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
