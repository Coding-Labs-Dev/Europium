/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response, Errback } from 'express';
// import Youch from 'Youch';

async function errorMiddleware(
  error: HTTPError,
  request: Request,
  response: Response,
  next: NextFunction | undefined,
): Promise<Response> {
  if (error.name === 'ValidationError')
    return response.status(error.statusCode || 400).json({
      error: {
        message: 'Validation Error',
        fields: error.fields,
      },
    });

  console.log(error);

  if (process.env.NODE_ENV !== 'production') {
    // const youch = new Youch(error, request);

    // const errorJSON = await youch.toJSON();
    return response.status(error.statusCode || 500).json(error);
  }

  return response.status(error.statusCode || 500).send();
}

interface HTTPError extends Errback {
  statusCode?: number;
  message?: string;
  fields?: object[];
}

export default errorMiddleware;
