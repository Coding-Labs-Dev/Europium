import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as yup from 'yup';
import { ValidationError } from 'yup';

export function validateErrorFormater(error: ValidationError): object {
  return {
    name: 'ValidationError',
    statusCode: 400,
    fields: error.inner.map(({ message, path, type }) => ({
      error: message,
      field: path,
      type,
    })),
  };
}

export default function Validator(
  validationSchema: yup.Schema<object>,
): RequestHandler {
  const validate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { body } = req;

    validationSchema
      .validate(body, { abortEarly: false })
      .then(() => next())
      .catch(error => next(validateErrorFormater(error)));
  };
  return validate;
}
