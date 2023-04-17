import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketTypes, getUserTicket, createTicket } from '@/controllers/tickets-controller';

const ticketRouter = Router();

ticketRouter.all('/*', authenticateToken).get('/types', getTicketTypes).get('/', getUserTicket).post('/', createTicket);

export { ticketRouter };
