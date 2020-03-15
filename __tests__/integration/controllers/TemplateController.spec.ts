import fs from 'fs';
import { resolve } from 'path';
import AWS from 'aws-sdk-mock';
import { mockRequest, mockResponse } from 'mock-req-res';
import TemplateController from '@controllers/TemplateController';
import Template from '@models/Template';
import Database from '../../utils/Database';

AWS.setSDK(resolve(__dirname, '..', '..', '..', 'node_modules', 'aws-sdk'));

describe('Controller: Template', () => {
  beforeAll(async () => {
    await Database.getInstance();

    const fileData = [
      '<html><head><title>Hello World</title></head>',
      '<body><h1>Hello {{name}}</h1></body>',
      '</html>',
    ];
    fileData.forEach((line, i) => {
      fs.writeFileSync(resolve(process.cwd(), 'tmp', '__TEST__.html'), line, {
        encoding: 'utf8',
        flag: i ? 'a' : 'w',
      });
    });
  });

  afterAll(async () => {
    if (fs.existsSync(resolve(process.cwd(), 'tmp', '__TEST__.html')))
      fs.unlinkSync(resolve(process.cwd(), 'tmp', '__TEST__.html'));

    await Database.close();
  });

  beforeEach(async () => {
    await Database.truncate('Template');
  });

  it('should be able to save a template', async () => {
    AWS.mock('SES', 'createTemplate', () => Promise.resolve(true));

    const body = {
      fileKey: '__TEST__.html',
      template: {
        name: 'TemplateTest',
        subject: 'Hello World',
        text: 'TextPart',
      },
    };
    const request = mockRequest({ body });
    const response = mockResponse();
    jest.spyOn(response, 'status');

    await TemplateController.store(request, response);

    expect(response.status).toBeCalledWith(204);

    const template = await Template.findByPk(1);

    expect(template).toEqual(
      expect.objectContaining({
        name: 'TemplateTest',
        subject: 'Hello World',
        html:
          '<html><head><title>Hello World</title></head><body><h1>Hello {{name}}</h1></body></html>',
        text: 'TextPart',
      }),
    );
  });
  it('sould be able to recover a template', async () => {
    await Template.create({
      name: 'TemplateTest',
      subject: 'Hello World',
      text: 'TextPart',
      html:
        '<html><head><title>Hello World</title></head><body><h1>Hello {{name}}</h1></body></html>',
    });

    const templates = await Template.findAll();

    const request = mockRequest({ params: { id: templates[0].id } });
    const response = mockResponse();
    jest.spyOn(response, 'json');

    await TemplateController.show(request, response);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'TemplateTest',
        subject: 'Hello World',
        html:
          '<html><head><title>Hello World</title></head><body><h1>Hello {{name}}</h1></body></html>',
        text: 'TextPart',
      }),
    );
  });
});
