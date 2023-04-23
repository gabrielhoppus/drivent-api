import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findHotelById(id: number) {
  return prisma.hotel.findFirst({
    where: {
      id,
    },
    include: {
      Rooms: true,
    },
  });
}

const hotelRepository = {
  findHotels,
  findHotelById,
};

export default hotelRepository;
