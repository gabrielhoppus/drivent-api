import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';

async function getHotels() {
  const hotels = await hotelRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

const hotelService = {
  getHotels,
};

export default hotelService;
