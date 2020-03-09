import fs from 'fs';
import { resolve } from 'path';
import { getFile, deleteFile } from '@utils/File';

describe('To Readable Converter (Local)', () => {
  beforeEach(() => {
    const newFile = Buffer.from([1, 2, 3]);
    fs.writeFileSync(resolve(process.cwd(), 'tmp', '__TEST__.txt'), newFile);
  });
  afterAll(() => {
    if (fs.existsSync(resolve(process.cwd(), 'tmp', '__TEST__.txt')))
      fs.unlinkSync(resolve(process.cwd(), 'tmp', '__TEST__.txt'));
  });

  it('should get a file', async () => {
    const file = await getFile('__TEST__.txt');
    expect(file).not.toBeNull();
  });

  it('should delete a file', async () => {
    await deleteFile('__TEST__.txt');
    try {
      await getFile('__TEST__.txt');
    } catch (err) {
      expect(err).not.toBeNull();
    }
  });
});
