import { mockRequest, mockResponse } from 'mock-req-res';
import * as yup from 'yup';
import ValidationMiddleware, {
  validateErrorFormater,
} from '@middlewares/ValidatorMiddleware';

describe('Middleware: Validation', () => {
  it('should format a yup error', async () => {
    const schema = yup.object().shape({
      string: yup
        .string()
        .email()
        .required(),
      number: yup
        .number()
        .min(5)
        .max(10)
        .required(),
    });

    const input = {
      string: 5,
      number: 0,
    };

    const result = await schema
      .validate(input, { abortEarly: false })
      .catch(error => {
        return validateErrorFormater(error);
      });

    const expected = {
      name: 'ValidationError',
      statusCode: 400,
      fields: expect.arrayContaining([
        {
          field: 'string',
          type: 'email',
          error: 'string must be a valid email',
        },
        {
          field: 'number',
          type: 'min',
          error: 'number must be greater than or equal to 5',
        },
      ]),
    };
    expect(result).toEqual(expected);
  });
});
