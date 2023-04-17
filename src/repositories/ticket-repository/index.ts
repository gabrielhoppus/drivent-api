import { prisma } from '@/config';

async function findTypes() {
  return prisma.ticketType.findMany();
}

async function findEnrollmentByUserId(userId: number) {
  const enrollment = prisma.enrollment.findFirst({
    where: { userId },
  });
  return enrollment;
}

async function findTicketByUserId(userId: number) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId,
      },
    },
    include: {
      TicketType: true,
    },
  });
  return ticket;
}

// async function createTicket(userId: number, ticketTypeId: number){
//   return prisma.ti

// }

const ticketRepository = {
  findTypes,
  findTicketByUserId,
  findEnrollmentByUserId,
};

export default ticketRepository;
