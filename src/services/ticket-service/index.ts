import { Ticket, TicketType, TicketStatus } from '@prisma/client';
import ticketRepository from '@/repositories/ticket-repository';
import { invalidDataError, notFoundError } from '@/errors';

async function getTicketTypes() {
  const types = await ticketRepository.findTypes();
  return types;
}

async function getUserById(id: number) {
  const userId = await ticketRepository.findUserById(id);
  return userId;
}

async function getEnrollmentByUserId(userId: number) {
  const enrollmentId = await ticketRepository.findEnrollmentbyUserId(userId);

  if (!enrollmentId) throw notFoundError();

  return enrollmentId;
}

async function getTicketByEnrollmentId(id: number) {
  const userId = getUserById(id);
  const enrollmentId = getEnrollmentByUserId(userId);
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollmentId);
  return ticket;
}

const ticketService = {
  getTicketTypes,
  getTicketByEnrollmentId,
};

export default ticketService;
