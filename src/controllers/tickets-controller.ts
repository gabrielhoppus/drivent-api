import httpStatus from 'http-status';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/ticket-service';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const types = await ticketService.getTicketTypes();
    return res.status(httpStatus.OK).send(types);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.body as number;
  try {
    const tickets = await ticketService.getTicketByUserId(userId);
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
