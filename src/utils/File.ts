import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({ region: 'us-east-1' });

export async function getFile(
  fileKey: string,
): Promise<Buffer | Uint8Array | Blob | string | Readable> {
  if (process.env.NODE_ENV === 'production') {
    const file = await s3
      .getObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
      })
      .promise();
    return file.Body as Buffer | Uint8Array | Blob | string | Readable;
  }

  return fs.readFileSync(path.resolve(process.cwd(), 'tmp', fileKey));
}

export async function deleteFile(fileKey: string): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
      })
      .promise();
  }
  fs.unlinkSync(path.resolve(process.cwd(), 'tmp', fileKey));
}
