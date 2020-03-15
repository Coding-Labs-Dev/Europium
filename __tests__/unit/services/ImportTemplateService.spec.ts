import AWS from 'aws-sdk-mock';
import { resolve } from 'path';
import { Readable } from 'stream';
import ImportTemplateService from '@services/ImportTemplateService';
import Database from '../../utils/Database';

AWS.setSDK(resolve(__dirname, '..', '..', '..', 'node_modules', 'aws-sdk'));

describe('Import Template Service', () => {
  beforeAll(async () => {
    await Database.getInstance();
  });

  afterAll(async () => {
    await Database.close();
  });

  beforeEach(async () => {
    await Database.truncate('Template');
  });

  it('should be able to parse an HTML template', async () => {
    const data = Readable.from([
      `<html><head><title>Template</title></head><body><h1>Hello {{name}}! This is a minified <a href="{{href}}">tempalte</a></h1></body></html>`,
    ]);

    const importTemplateService = new ImportTemplateService();

    await importTemplateService.run(data);

    const { parsed } = importTemplateService;

    expect(parsed && parsed.toString()).toEqual(
      '<html><head><title>Template</title></head><body><h1>Hello {{name}}! This is a minified <a href="{{href}}">tempalte</a></h1></body></html>',
    );
  });
});
