import { Ticket, TicketType, TicketStatus } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';
import { invalidDataError, notFoundError } from '@/errors';

async function getTicketTypes() {
  const types = await ticketRepository.findTypes();
  return types;
}

async function getTicketByEnrollmentId(userId: number) {
  const ticket = await ticketRepository.findTicketByUserId(userId);
  return ticket;
}

const ticketService = {
  getTicketTypes,
  getTicketByEnrollmentId,
};

export default ticketService;
