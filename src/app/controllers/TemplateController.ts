import { Request, Response } from 'express';
import ImportHTMLService from '@services/ImportHTMLService';
import ToReadable from '@utils/ToReadable';
import { Template as TemplateType } from 'aws-sdk/clients/ses';
import Template from '@models/Template';
import { getFile, deleteFile } from '@utils/File';

class TemplateController {
  async store(req: Request, res: Response): Promise<Response> {
    const importHtmlService = new ImportHTMLService();

    const { fileKey, template } = req.body;

    const data = await getFile(fileKey);
    await deleteFile(fileKey);

    const readable = await ToReadable(data);

    await importHtmlService.run(readable);

    const { parsedHTML } = importHtmlService;

    if (!parsedHTML)
      return res.status(400).json({ error: { message: 'Invalid HTML file' } });

    const { name, subject, text, variables } = template;

    const templateData: TemplateType = {
      TemplateName: name,
      HtmlPart: parsedHTML.toString(),
      TextPart: text,
      SubjectPart: subject,
    };

    const result = await importHtmlService.createTemplate(
      templateData,
      variables,
    );

    return res.status(204).json(result);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const template = await Template.findByPk(id);

    if (!template)
      return res
        .status(404)
        .json({ error: { message: 'Template not found in database' } });

    return res.json(template);
  }
}

export default new TemplateController();
