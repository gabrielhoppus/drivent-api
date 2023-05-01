import { prisma } from '@/config';

async function findBookingById(userId: number) {
  const booking = prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });

  return booking;
}

async function bookRoom(userId: number, roomId: number) {
  const booking = prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });

  return booking;
}

async function updateBooking(bookingId: number, roomId: number) {
  const booking = prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });

  return booking;
}

const bookingRepository = {
  findBookingById,
  bookRoom,
  updateBooking,
};

export default bookingRepository;
