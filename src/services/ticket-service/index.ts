import { Ticket, TicketType, TicketStatus } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';

async function getTicketTypes() {
  const types = await ticketRepository.findTypes();
  return types;
}

const ticketService = {
  getTicketTypes,
};

export default ticketService;
