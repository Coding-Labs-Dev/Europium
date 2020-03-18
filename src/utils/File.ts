import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({ region: 'us-east-1' });

export async function getFile(fileKey: string): Promise<Readable> {
  if (process.env.STORAGE === 's3') {
    return s3
      .getObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
      })
      .createReadStream();
  }

  const file = fs.readFileSync(path.resolve('/', 'tmp', fileKey));
  return Readable.from(Buffer.from(file));
}

export async function deleteFile(fileKey: string): Promise<void> {
  if (process.env.STORAGE === 's3') {
    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
      })
      .promise();
  } else {
    fs.unlinkSync(path.resolve('/', 'tmp', fileKey));
  }
}
