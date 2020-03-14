import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as yup from 'yup';
import { ValidationError } from 'yup';

interface ValidationShchema {
  params?: yup.Schema<object>;
  body?: yup.Schema<object>;
}

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
  validationSchema: ValidationShchema,
): RequestHandler {
  const validate = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { params: paramsData, body: bodyData } = req;

    const { params, body } = validationSchema;

    if (params) {
      params
        .validate(paramsData, { abortEarly: false })
        .then(() => !body && next())
        .catch(error => next(validateErrorFormater(error)));
      if (!body) return undefined;
    }
    if (body) {
      return body
        .validate(bodyData, { abortEarly: false })
        .then(() => next())
        .catch(error => next(validateErrorFormater(error)));
    }
    return next({
      name: 'ServerError',
      statusCode: 500,
      message: 'Invalid Validation Schema',
    });
  };
  return validate;
}
