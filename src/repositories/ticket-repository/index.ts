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

async function findTicketByTicketId(ticketId: number) {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
    },
    include: {
      Enrollment: {
        select: {
          userId: true,
        },
      },
    },
  });
}

async function createTicket(enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentId,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepository = {
  findTypes,
  findTicketByUserId,
  findEnrollmentByUserId,
  createTicket,
  findTicketByTicketId,
};

export default ticketRepository;
