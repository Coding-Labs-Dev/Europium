import { Readable } from 'stream';

export default class ImportTemplateService {
  public parsed: string | null;

  constructor() {
    this.parsed = null;
  }

  async run(data: Readable): Promise<void> {
    const chunks: Uint8Array[] = [];

    data.on('data', chunk => chunks.push(chunk));

    await new Promise(resolve =>
      data.on('end', () => {
        const string = chunks.join('');

        this.parsed = string;

        resolve();
      }),
    );
  }
}
