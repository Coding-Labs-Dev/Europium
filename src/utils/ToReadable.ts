import { Readable } from 'stream';

export default async function ToReadable(
  data: string | Readable | Buffer | Uint8Array,
): Promise<Readable> {
  if (data instanceof Readable) return data;
  return Readable.from(Buffer.from(data));
}
