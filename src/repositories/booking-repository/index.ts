import { prisma } from '@/config';

async function findBookingById(userId: number) {
  const booking = await prisma.booking.findFirst({
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
  const booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });

  return booking;
}

async function findBookingsByRoom(roomId: number) {
  const bookings = await prisma.booking.findMany({
    where: {
      id: roomId,
    },
  });
  return bookings;
}

async function updateBooking(bookingId: number, roomId: number) {
  const booking = await prisma.booking.update({
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
  findBookingsByRoom,
};

export default bookingRepository;
