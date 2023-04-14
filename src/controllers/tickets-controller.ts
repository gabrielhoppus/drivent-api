import httpStatus from 'http-status';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import ticketService from '@/services/ticket-service';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const types = await ticketService.getTicketTypes();
    return res.status(httpStatus.OK).send({ types });
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
