import httpStatus from 'http-status';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import paymentService from '@/services/payments-service';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketId = Number(req.query.ticketId);
    const { userId } = req;

    if (!ticketId) return res.sendStatus(httpStatus.BAD_REQUEST);

    const payment = await paymentService.getPayment(ticketId, userId);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

type CardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

export async function makePayment(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId, cardData } = req.body;
    const { userId } = req;

    if (!ticketId || !cardData) return res.sendStatus(httpStatus.BAD_REQUEST);

    const payment = await paymentService.makePayment(ticketId, cardData, userId);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
