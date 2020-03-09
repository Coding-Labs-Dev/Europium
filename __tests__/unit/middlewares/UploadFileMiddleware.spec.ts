import UploadFileMiddleware from '@middlewares/UploadFileMiddleware';

describe('Middleware: Upload File', () => {
  it('should be able to create a multer middleware', async () => {
    const middleware = UploadFileMiddleware.single('file');

    expect(middleware).toHaveProperty('name');
    expect(middleware.name).toBe('multerMiddleware');
  });
});
