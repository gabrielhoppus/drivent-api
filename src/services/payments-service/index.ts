import paymentRepository from '@/repositories/payment-repository';
import { notFoundError, unauthorizedError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getPayment(ticketId: number, userId: number) {
  const ticket = await ticketRepository.findTicketByTicketId(ticketId);
  const payment = await paymentRepository.findPayment(ticketId);

  if (!ticket) throw notFoundError();
  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  return payment;
}

const paymentService = {
  getPayment,
};

export default paymentService;
