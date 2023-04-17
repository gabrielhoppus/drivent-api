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

// export async function getUserTicket(req: AuthenticatedRequest, res: Response) {
//     const id = req.body as number;
//     try{
//         const userId = await ticketService.getUserById(id)
//         const enrollmentId = await ticketService.getEnrollmentByUserId(userId)
//     } catch (error) {
//         return res.sendStatus(httpStatus.BAD_REQUEST);
//     }
// }
