/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Errback } from 'express';
// import Youch from 'Youch';

async function errorMiddleware(
  error: HTTPError,
  _request: Request,
  response: Response,
  _next: NextFunction | undefined,
): Promise<Response> {
  if (error.name === 'ValidationError')
    return response.status(error.statusCode || 400).json({
      error: {
        message: 'Validation Error',
        fields: error.fields,
      },
    });
  // eslint-disable-next-line no-console
  console.log(error);

  if (process.env.NODE_ENV !== 'production') {
    // const youch = new Youch(error, request);

    // const errorJSON = await youch.toJSON();
    return response.status(error.statusCode || 500).json(error);
  }

  return response.status(error.statusCode || 500).send(error);
}

interface HTTPError extends Errback {
  statusCode?: number;
  message?: string;
  fields?: object[];
}

export default errorMiddleware;
