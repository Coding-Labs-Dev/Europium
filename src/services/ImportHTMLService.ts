import { Readable } from 'stream';
import { parse, TextNode, HTMLElement } from 'node-html-parser';
import AWS from 'aws-sdk';
import { Template as TemplateType } from 'aws-sdk/clients/ses';
import Template from '@models/Template';

export default class ImportHTMLService {
  private client: AWS.SES;

  public parsedHTML:
    | null
    | (TextNode & {
        valid: boolean;
      })
    | (HTMLElement & {
        valid: boolean;
      });

  constructor() {
    this.parsedHTML = null;
    this.client = new AWS.SES({
      region: 'us-east-1',
    });
  }

  async run(data: Readable): Promise<void> {
    const chunks: Uint8Array[] = [];

    data.on('data', chunk => chunks.push(chunk));

    await new Promise(resolve =>
      data.on('end', () => {
        const string = chunks.join('');

        const root = parse(string);
        this.parsedHTML = root;

        resolve();
      }),
    );
  }

  async createTemplate(
    data: TemplateType,
    variables: string[],
  ): Promise<Template> {
    const template = await Template.create({
      name: data.TemplateName,
      variables,
    });

    try {
      await this.client.createTemplate({ Template: data }).promise();
      return template;
    } catch (error) {
      await template.destroy();
      throw error;
    }
  }
}
