import HttpExceptionMiddleware from '@middlewares/HttpExceptionMiddleware';
import { Errback } from 'express';
import { mockResponse, mockRequest } from 'mock-req-res';

interface HTTPError extends Errback {
  statusCode?: number;
  message?: string;
  fields?: object[];
}

describe('Middleware: HTTP Exception', () => {
  it('should return an error with status code 999', async () => {
    const request = mockRequest();
    const response = mockResponse();
    jest.spyOn(response, 'status');

    const error = new Error('This is an error') as HTTPError;
    error.statusCode = 999;

    await HttpExceptionMiddleware(error, request, response, undefined);

    expect(response.status).toBeCalledWith(999);
  });
});
