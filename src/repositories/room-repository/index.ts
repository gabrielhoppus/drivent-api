import { prisma } from '@/config';

async function findRoomById(roomId: number) {
  const room = prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });

  return room;
}

const roomRepository = {
  findRoomById,
};

export default roomRepository;
