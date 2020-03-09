import { Request, Response } from 'express';

class ImportController {
  async store(req: Request, res: Response): Promise<Response> {
    const { file } = req;
    if (!file) {
      const err = {
        name: 'ValidationError',
        statusCode: 400,
        fields: [
          {
            error: 'file is required',
            field: 'file',
            type: 'required',
          },
        ],
      };
      throw err;
    }
    return res.json({ file });
  }
}

export default new ImportController();
