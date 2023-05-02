import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoom(id: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: faker.datatype.number(),
      hotelId: id,
    },
  });
}

export async function createRoomCapacityZero(id: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: 1,
      hotelId: id,
    },
  });
}
