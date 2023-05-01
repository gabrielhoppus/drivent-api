import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createValidTicketType,
  createRemoteTicketType,
  createHotelessTicketType,
  createUser,
  createTicketType,
  createTicket,
  createRoom,
} from '../factories';
import { createHotel, createRoomCapacityZero } from '../factories/hotels-factory';
import { createBooking } from '../factories/bookings-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /bookings', () => {
  describe('when token is invalid', () => {
    it('should respond with status 401 if no token is given', async () => {
      const res = await server.get('/booking');

      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();

      const res = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

      const res = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(httpStatus.UNAUTHORIZED);
    });
  });
  describe('when token is valid', () => {
    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
      const token = await generateValidToken();

      const res = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const res = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and booking information on success', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const res = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(res.status).toEqual(httpStatus.OK);
      expect(res.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

// describe('POST /booking', () => {
//     describe('when token is invalid', () => {
//         it('should respond with status 401 if no token is given', async () => {
//             const res = await server.post('/booking');

//             expect(res.status).toBe(httpStatus.UNAUTHORIZED);
//         });

//         it('should respond with status 401 if given token is not valid', async () => {
//             const token = faker.lorem.word();

//             const res = await server.post('/booking').set('Authorization', `Bearer ${token}`);

//             expect(res.status).toBe(httpStatus.UNAUTHORIZED);
//         });

//         it('should respond with status 401 if there is no session for given token', async () => {
//             const userWithoutSession = await createUser();
//             const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

//             const res = await server.post('/booking').set('Authorization', `Bearer ${token}`);

//             expect(res.status).toBe(httpStatus.UNAUTHORIZED);
//         });
//     });
//     describe('when token is valid', () => {
//         it('should respond with status 403 when ticket is not paid yet', async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createTicketType();
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
//             const hotel = await createHotel();
//             const room = await createRoom(hotel.id)
//             const route = `/booking`
//             const auth = 'Authorization'
//             const bearer = `Bearer ${token}`
//             const id = {roomId: room.id}

//             const res = await server
//                     .post(route)
//                     .set(auth, bearer)
//                     .send(id);

//             expect(res.status).toEqual(httpStatus.FORBIDDEN);
//         });

//         it('should respond with status 403 when ticket is remote', async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createRemoteTicketType();
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//             const hotel = await createHotel();
//             const room = await createRoom(hotel.id)
//             const route = `/booking`
//             const auth = 'Authorization'
//             const bearer = `Bearer ${token}`
//             const id = {roomId: room.id}

//             const res = await server
//                     .post(route)
//                     .set(auth, bearer)
//                     .send(id);

//             expect(res.status).toEqual(httpStatus.FORBIDDEN);
//         });

//         it('should respond with status 403 when ticket does not include hotel', async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createHotelessTicketType();
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//             const hotel = await createHotel();
//             const room = await createRoom(hotel.id)
//             const route = `/booking`
//             const auth = 'Authorization'
//             const bearer = `Bearer ${token}`
//             const id = {roomId: room.id}

//             const res = await server
//                     .post(route)
//                     .set(auth, bearer)
//                     .send(id);

//             expect(res.status).toEqual(httpStatus.FORBIDDEN);
//         });

//         it('should respond with status 403 when room has no capacity', async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createValidTicketType();
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//             const hotel = await createHotel();
//             const room = await createRoomCapacityZero(hotel.id)
//             const route = `/booking`
//             const auth = 'Authorization'
//             const bearer = `Bearer ${token}`
//             const id = {roomId: room.id}

//             const res = await server
//                     .post(route)
//                     .set(auth, bearer)
//                     .send(id);

//             expect(res.status).toEqual(httpStatus.FORBIDDEN);
//         });

//         it('should respond with status 403 when room number is 0', async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createValidTicketType();
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//             const route = `/booking`
//             const auth = 'Authorization'
//             const bearer = `Bearer ${token}`
//             const id = {roomId: 0}

//             const res = await server
//                     .post(route)
//                     .set(auth, bearer)
//                     .send(id);

//             expect(res.status).toEqual(httpStatus.FORBIDDEN);
//         });

//         it('should respond with status 403 when room number is negative', async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createValidTicketType();
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//             const route = `/booking`
//             const auth = 'Authorization'
//             const bearer = `Bearer ${token}`
//             const id = {roomId: -1}

//             const res = await server
//                     .post(route)
//                     .set(auth, bearer)
//                     .send(id);

//             expect(res.status).toEqual(httpStatus.FORBIDDEN);
//         });

//         it('should respond with status 404 when room does not exist', async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createValidTicketType();
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//             const id = Number(faker.random.numeric())
//             const route = `/booking`
//             const auth = 'Authorization'
//             const bearer = `Bearer ${token}`
//             const roomId = {roomId: id}

//             const res = await server
//                     .post(route)
//                     .set(auth, bearer)
//                     .send(roomId);

//             expect(res.status).toEqual(httpStatus.NOT_FOUND);
//         });

//         it('should respond with status 200 and bookingId on success', async () => {
//             const user = await createUser();
//             const token = await generateValidToken(user);
//             const enrollment = await createEnrollmentWithAddress(user);
//             const ticketType = await createValidTicketType();
//             await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//             const hotel = await createHotel();
//             const room = await createRoom(hotel.id)
//             const route = `/booking`
//             const auth = 'Authorization'
//             const bearer = `Bearer ${token}`
//             const id = {roomId: room.id}

//             const res = await server
//                     .post(route)
//                     .set(auth, bearer)
//                     .send(id);

//             expect(res.status).toEqual(httpStatus.OK);
//             expect(res.body).toEqual({
//                 bookingId: expect.any(Number),
//             })
//         })
//     })
// });

// describe('PUT /booking/:bookingId', () => {
//     describe('when token is invalid', () => {
//         it('should respond with status 401 if no token is given', async () => {
//             const res = await server.post('/booking');

//             expect(res.status).toBe(httpStatus.UNAUTHORIZED);
//         });

//         it('should respond with status 401 if given token is not valid', async () => {
//             const token = faker.lorem.word();

//             const res = await server.post('/booking').set('Authorization', `Bearer ${token}`);

//             expect(res.status).toBe(httpStatus.UNAUTHORIZED);
//         });

//         it('should respond with status 401 if there is no session for given token', async () => {
//             const userWithoutSession = await createUser();
//             const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

//             const res = await server.post('/booking').set('Authorization', `Bearer ${token}`);

//             expect(res.status).toBe(httpStatus.UNAUTHORIZED);
//         });
//     });
//     describe('when token is valid', () => {

//     })
// });
