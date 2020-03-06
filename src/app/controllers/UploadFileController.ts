import { Request, Response } from 'express';

class ImportController {
  async store(req: Request, res: Response): Promise<Response> {
    return res.json({ file: req.file });
  }
}

export default new ImportController();
