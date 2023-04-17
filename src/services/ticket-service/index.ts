import { Ticket, TicketType, TicketStatus } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError } from '@/errors';

async function getTicketTypes() {
  const types = await ticketRepository.findTypes();
  return types;
}

async function getTicketByUserId(userId: number) {
  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (!ticket) {
    throw notFoundError();
  }
  return ticket;
}

const ticketService = {
  getTicketTypes,
  getTicketByUserId,
};

export default ticketService;
