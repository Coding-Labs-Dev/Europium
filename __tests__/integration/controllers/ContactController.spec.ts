import { mockRequest, mockResponse } from 'mock-req-res';
import ContactController from '@controllers/ContactController';
import Database from '../../utils/Database';

describe('Contact Controller: Store', () => {
  beforeAll(async () => {
    await Database.getInstance();
  });

  afterAll(async () => {
    await Database.close();
  });

  it('should be able create contacts and tags', async () => {
    const request = mockRequest({
      body: {
        contacts: [
          {
            email: 'test_1@codinglabs.dev',
            name: 'Test 1',
            tags: ['Test'],
            alternateNames: null,
          },
        ],
        tags: ['Test', 'AWS'],
      },
    });

    const response = mockResponse();
    jest.spyOn(response, 'json');

    await ContactController.store(request, response);

    const expected = {
      contacts: [
        {
          email: 'test_1@codinglabs.dev',
          name: 'Test 1',
          tags: ['Test'],
          alternateNames: null,
        },
      ],
      tags: ['Test', 'AWS'],
    };

    expect(response.json).toHaveBeenCalledWith(expected);
  });
});
