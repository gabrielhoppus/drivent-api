import { prisma } from '@/config';

async function findTypes() {
  return prisma.ticketType.findMany();
}

async function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function findTicketByUserId(userId: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: {
        userId,
      },
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

const ticketRepository = {
  findTypes,
  findTicketByUserId,
  findUserById,
};

export default ticketRepository;
