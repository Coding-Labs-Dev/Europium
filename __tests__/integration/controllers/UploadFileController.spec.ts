import { mockRequest, mockResponse } from 'mock-req-res';

import UploadFileController from '@controllers/UploadFileController';

describe('Upload File Controller', () => {
  it('should return file metadata', async () => {
    const request = mockRequest({
      file: {
        key: 'key-to-file',
      },
    });
    const response = mockResponse();

    jest.spyOn(response, 'json');

    await UploadFileController.store(request, response);

    expect(response.json).toBeCalledWith(
      expect.objectContaining({
        file: {
          key: 'key-to-file',
        },
      }),
    );
  });
});
