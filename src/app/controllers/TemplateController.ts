import { Readable } from 'stream';
import { Request, Response } from 'express';
import S3 from 'aws-sdk/clients/s3';
import ImportHTMLService from '@services/ImportHTMLService';
import ToReadable from '@utils/ToReadable';
import { Template as TemplateType } from 'aws-sdk/clients/ses';
import { Template } from '@models/index';

const s3 = new S3({ region: 'us-east-1' });

class TemplateController {
  async store(req: Request, res: Response): Promise<Response> {
    const importHtmlService = new ImportHTMLService();

    const { fileKey, template } = req.body;

    const file = await s3
      .getObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
      })
      .promise();

    const data = file.Body as Buffer | Uint8Array | Blob | string | Readable;

    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
      })
      .promise();

    if (!data)
      return res.status(400).json({ error: { message: `Empty file` } });

    const readable = await ToReadable(data);

    await importHtmlService.run(readable);

    const { parsedHTML } = importHtmlService;

    if (!parsedHTML)
      return res.status(400).json({ error: { message: 'Invalid HTML file' } });

    const { name, subject, textVersion, variables } = template;

    const templateData: TemplateType = {
      TemplateName: name,
      HtmlPart: parsedHTML.toString(),
      TextPart: textVersion,
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
