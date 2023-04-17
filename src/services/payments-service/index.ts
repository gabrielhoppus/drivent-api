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

type CardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

type PaymentData = {
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

async function makePayment(ticketId: number, cardData: CardData, userId: number) {
  const ticket = await ticketRepository.findTicketByTicketId(ticketId);

  if (!ticket) throw notFoundError();

  if (ticket.Enrollment.userId !== userId) throw unauthorizedError();

  const lastDigits = cardData.number.toString().slice(-4);

  const paymentData: PaymentData = {
    value: ticket.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: lastDigits,
  };

  const payment = await paymentRepository.makePayment(ticketId, paymentData);
  await ticketRepository.updatePaidTicket(ticketId);

  return payment;
}

const paymentService = {
  getPayment,
  makePayment,
};

export default paymentService;
