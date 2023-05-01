import { ApplicationError } from '@/protocols';

export function notFoundError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'No result for this search!',
  };
}

export function forbiddenError(): ApplicationError {
  return {
    name: 'ForbiddenError',
    message: 'This action is forbidden',
  };
}
