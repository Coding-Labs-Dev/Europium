import ToReadable from '@utils/ToReadable';
import { Readable } from 'stream';

describe('To Readable Converter', () => {
  it('should convert a string value to Readable', async () => {
    const string = 'this is a string';
    const readable = await ToReadable(string);
    expect(typeof readable.pipe).toBe('function');
  });
  it('should convert a Buffer to Readable', async () => {
    const buffer = Buffer.from('this is a string');
    const readable = await ToReadable(buffer);
    expect(typeof readable.pipe).toBe('function');
  });
  it('should convert a Uint8Array to Readable', async () => {
    const array = Uint8Array.from([1, 2, 3, 4, 5]);
    const readable = await ToReadable(array);
    expect(typeof readable.pipe).toBe('function');
  });
  it('should return Readable from a Readable', async () => {
    const readableInput = Readable.from(['this is a readable']);
    const readable = await ToReadable(readableInput);
    expect(typeof readable.pipe).toBe('function');
  });
});
