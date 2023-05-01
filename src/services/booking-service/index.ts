import bookingRepository from '@/repositories/booking-repository';
import { notFoundError, forbiddenError } from '@/errors';
import roomRepository from '@/repositories/room-repository';

async function getBookingById(userId: number) {
  const booking = await bookingRepository.findBookingById(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function bookRoom(userId: number, roomId: number) {
  const room = await roomRepository.findRoomById(roomId);

  if (!room) throw notFoundError();
  if (room.capacity === 0) throw forbiddenError();

  const booking = await bookingRepository.bookRoom(userId, room.id);

  return booking;
}

async function updateBookingRoom(userId: number, bookingId: number, roomId: number) {
  const room = await roomRepository.findRoomById(roomId);
  const booking = await bookingRepository.findBookingById(userId);

  if (!room || booking) throw notFoundError();
  if (room.capacity === 0) throw forbiddenError();

  const updatedBooking = await bookingRepository.updateBooking(bookingId, roomId);

  return updatedBooking;
}

const bookingService = {
  getBookingById,
  bookRoom,
  updateBookingRoom,
};

export default bookingService;
