import { Ticket, TicketType, TicketStatus } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';
import { invalidDataError, notFoundError } from '@/errors';

async function getTicketTypes() {
  const types = await ticketRepository.findTypes();
  return types;
}

async function getTicketByUserId(userId: number) {
  const user = await ticketRepository.findUserById(userId);
  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (!ticket || !user) throw notFoundError();
  return ticket;
}

const ticketService = {
  getTicketTypes,
  getTicketByUserId,
};

export default ticketService;
