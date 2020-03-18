import { Request, Response } from 'express';
import ImportTemplateService from '@services/ImportTemplateService';

import Template from '@models/Template';
import { getFile, deleteFile } from '@utils/File';

class TemplateController {
  async index(_req: Request, res: Response): Promise<Response> {
    return res.json(await Template.findAll());
  }

  async store(req: Request, res: Response): Promise<Response> {
    const importTemplateService = new ImportTemplateService();

    const { fileKey, template } = req.body;

    const data = await getFile(fileKey);
    await deleteFile(fileKey);

    await importTemplateService.run(data);

    const { parsed } = importTemplateService;

    if (!parsed)
      return res
        .status(400)
        .json({ error: { message: 'Invalid Template Service' } });

    const { name, subject, text } = template;

    const templateData = {
      name,
      subject,
      html: parsed,
      text,
    };

    const result = await Template.create(templateData);

    return res.status(204).json(result);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const template = await Template.findByPk(id, { rejectOnEmpty: true });

    return res.json(template);
  }
}

export default new TemplateController();
