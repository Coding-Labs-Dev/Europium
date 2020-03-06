import AWS from 'aws-sdk-mock';
import Database from '@database/index';
import { Template } from '@models/index';
import { resolve } from 'path';
import { Readable } from 'stream';
import ImportHTMLService from '@services/ImportHTMLService';
import { Template as TemplateModel } from 'aws-sdk/clients/ses';

AWS.setSDK(resolve(__dirname, '..', '..', '..', 'node_modules', 'aws-sdk'));

beforeAll(async () => {
  await Database.sync({ force: true, logging: false });
});

afterAll(async () => Database.close());

describe('Import Template Service', () => {
  beforeEach(() => AWS.restore());

  it('should be able to parse an HTML template', async () => {
    const data = Readable.from([
      `<html><head><title>Template</title></head><body><h1>Hello {{name}}! This is a minified <a href="{{href}}">tempalte</a></h1></body></html>`,
    ]);

    const importHTMLService = new ImportHTMLService();

    await importHTMLService.run(data);

    const { parsedHTML } = importHTMLService;

    expect(parsedHTML && parsedHTML.toString()).toEqual(
      '<html><head><title>Template</title></head><body><h1>Hello {{name}}! This is a minified <a href="{{href}}">tempalte</a></h1></body></html>',
    );
  });

  it('should be able to create a new template in AWS and database', async () => {
    AWS.mock('SES', 'createTemplate', () => Promise.resolve(true));

    const importHTMLService = new ImportHTMLService();

    const TemplateData: TemplateModel = {
      TemplateName: 'TemplateTest',
      HtmlPart: '<HTML>',
      SubjectPart: 'Test subject',
    };

    const variables = ['name', 'href'];

    const response = await importHTMLService.createTemplate(
      TemplateData,
      variables,
    );

    expect(response).toEqual(
      expect.objectContaining({
        dbTemplate: true,
        awsTemplate: true,
      }),
    );

    const template = await Template.findOne({
      where: { name: 'TemplateTest' },
    });

    expect(template).toEqual(
      expect.objectContaining({
        name: 'TemplateTest',
      }),
    );
  });
  it('should delete a template from database if there is an AWS error when creating a new template', async () => {
    await Database.sync({ force: true, logging: false });
    AWS.mock('SES', 'createTemplate', () =>
      Promise.reject(new Error('Error from SES')),
    );

    const importHTMLService = new ImportHTMLService();

    const TemplateData: TemplateModel = {
      TemplateName: 'TemplateTest',
      HtmlPart: '<HTML>',
      SubjectPart: 'Test subject',
    };

    const variables = ['name', 'href'];

    const response = await importHTMLService.createTemplate(
      TemplateData,
      variables,
    );

    expect(response).toEqual(
      expect.objectContaining({
        dbTemplate: true,
        awsTemplate: false,
      }),
    );

    const template = await Template.findOne({
      where: { name: 'TemplateTest' },
    });

    expect(template).toBeNull();
  });
});
