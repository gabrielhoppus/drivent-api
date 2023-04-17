import { prisma } from '@/config';

async function findPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

type PaymentData = {
  value: number;
  cardIssuer: string;
  cardLastDigits: string;
};

async function makePayment(ticketId: number, cardData: PaymentData) {
  return prisma.payment.create({
    data: {
      ticketId: ticketId,
      value: cardData.value,
      cardIssuer: cardData.cardIssuer,
      cardLastDigits: cardData.cardLastDigits,
    },
  });
}

const paymentRepository = {
  findPayment,
  makePayment,
};

export default paymentRepository;
