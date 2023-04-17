import { Ticket, TicketType, TicketStatus } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';
import { notFoundError } from '@/errors';

async function getTicketTypes() {
  const types = await ticketRepository.findTypes();
  return types;
}

async function getTicketByUserId(userId: number) {
  const ticket = await ticketRepository.findTicketByUserId(userId);
  if (!ticket) throw notFoundError();

  return ticket;
}

async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await ticketRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketRepository.createTicket(enrollment.id, ticketTypeId);

  return ticket;
}

const ticketService = {
  getTicketTypes,
  getTicketByUserId,
  createTicket,
};

export default ticketService;
