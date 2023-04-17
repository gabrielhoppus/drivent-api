import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketTypes, getUserTicket } from '@/controllers/tickets-controller';

const ticketRouter = Router();

ticketRouter.all('/*', authenticateToken).get('/types', getTicketTypes).get('/', getUserTicket);

export { ticketRouter };
