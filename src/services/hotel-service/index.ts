import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';

async function getHotels() {
  const hotels = await hotelRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getRooms(id: number) {
  const hotel = await hotelRepository.findHotelById(id);
  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelService = {
  getHotels,
  getRooms,
};

export default hotelService;
