import { jest } from '@jest/globals';
import faker from '@faker-js/faker';
import { response } from 'express';
import bookingRepository from '@/repositories/booking-repository';
import hotelRepository from '@/repositories/hotel-repository';
import bookingService from '@/services/booking-service';
import { forbiddenError, notFoundError } from '@/errors';

describe('get booking by id', () => {
  it('should return booking information', async () => {
    const booking = {
      id: Number(faker.random.numeric()),
      userId: Number(faker.random.numeric()),
      roomId: Number(faker.random.numeric()),
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
    };

    jest.spyOn(bookingRepository, 'findBookingById').mockImplementationOnce((): any => booking);

    const response = bookingService.getBookingById(booking.id);

    expect(bookingRepository.findBookingById).toBeCalled();
    expect(response).resolves.toEqual(booking);
  });

  it('should throw not found error with no book is found', async () => {
    const id = Number(faker.random.numeric());

    jest.spyOn(bookingRepository, 'findBookingById').mockImplementationOnce((): any => {
      return undefined;
    });

    const response = bookingService.getBookingById(id);

    expect(bookingRepository.findBookingById).toBeCalled();
    expect(response).rejects.toEqual(notFoundError());
  });
});

describe('create booking', () => {
  it('should throw not found error if there is no room', async () => {
    const roomId = Number(faker.random.numeric());
    const userId = Number(faker.random.numeric());

    jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
      return undefined;
    });

    const response = bookingService.bookRoom(userId, roomId);

    expect(hotelRepository.findRoomById).toBeCalled();
    expect(response).rejects.toEqual(notFoundError());
  });

  it('should throw forbidden error when there is no capacity', async () => {
    type Room = {
      id: number;
      name: string;
      capacity: number;
      hotelId: number;
      createdAt: Date;
      updatedAt: Date;
    };

    const room: Room = {
      id: Number(faker.random.numeric()),
      name: faker.company.companyName(),
      capacity: 1,
      hotelId: Number(faker.random.numeric()),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const bookings: Array<any> = [
      {
        id: Number(faker.random.numeric()),
        userId: Number(faker.random.numeric()),
        roomId: room.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(hotelRepository, 'findRoomById').mockResolvedValueOnce(room);
    jest.spyOn(bookingRepository, 'findBookingsByRoom').mockResolvedValueOnce(bookings);

    const response = await bookingService.bookRoom(bookings[0].userId, room.id);

    expect(hotelRepository.findRoomById).toBeCalled();
    expect(bookingRepository.findBookingsByRoom).toBeCalled();
    expect(response).rejects.toEqual(forbiddenError());
  });

  it('should create booking', async () => {
    const userId = Number(faker.random.numeric());
    const room = {
      id: Number(faker.random.numeric()),
      name: faker.company.companyName(),
      capacity: 1,
      hotelId: Number(faker.random.numeric()),
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
    };

    const booking = {
      id: Number(faker.random.numeric()),
      userId,
      roomId: room.id,
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
    };

    jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
      return room;
    });
    jest.spyOn(bookingRepository, 'findBookingsByRoom').mockImplementationOnce((): any => []);
    jest.spyOn(bookingRepository, 'bookRoom').mockImplementationOnce((): any => {
      return booking;
    });

    const response = await bookingService.bookRoom(userId, room.id);

    expect(hotelRepository.findRoomById).toBeCalled();
    expect(bookingRepository.findBookingsByRoom).toBeCalled();
    expect(bookingRepository.bookRoom).toBeCalled();
    expect(response).toEqual(booking);
  });
});

describe('update booking', () => {
  it('should throw not found error if there is no room', async () => {
    const roomId = Number(faker.random.numeric());
    const userId = Number(faker.random.numeric());
    const bookingId = Number(faker.random.numeric());

    jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
      return undefined;
    });

    const response = bookingService.updateBookingRoom(userId, bookingId, roomId);

    expect(hotelRepository.findRoomById).toBeCalled();
    expect(response).rejects.toEqual(notFoundError());
  });

  it('should throw not forbidden error if there is no room', async () => {
    const room = {
      id: Number(faker.random.numeric()),
      name: faker.company.companyName(),
      capacity: 1,
      hotelId: Number(faker.random.numeric()),
      createdAt: '2020-01-01T00:00:00.000Z',
      updatedAt: '2020-01-01T00:00:00.000Z',
    };
    const userId = Number(faker.random.numeric());
    const bookingId = Number(faker.random.numeric());

    jest.spyOn(hotelRepository, 'findRoomById').mockImplementationOnce((): any => {
      return room;
    });
    jest.spyOn(bookingRepository, 'findBookingById').mockImplementationOnce((): any => false);

    const response = await bookingService.updateBookingRoom(userId, bookingId, room.id);

    expect(hotelRepository.findRoomById).toBeCalled();
    expect(bookingRepository.findBookingById).toBeCalled();
    expect(response).rejects.toEqual(forbiddenError());
  });
});
