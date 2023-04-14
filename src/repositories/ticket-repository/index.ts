import { Ticket, TicketType, TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function findTypes() {
  return prisma.ticketType.findMany();
}

async function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function findEnrollmentbyUserId(userId: number) {
  return prisma.enrollment.findUnique({
    where: { userId },
    select: {
      userId: true,
    },
  });
}

async function findTicketByEnrollmentId(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: { enrollmentId },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: {
        select: {
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}

const ticketRepository = {
  findTypes,
  findTicketByEnrollmentId,
  findEnrollmentbyUserId,
  findUserById,
};

export default ticketRepository;
