import { json2csvAsync } from 'json-2-csv';

export default class ExportContactService {
  processData(data: Contact[]): ContactString[] {
    return data.map(item => ({
      ...item,
      altNames: item.altNames?.join(', ') || '',
      tags: item.tags?.join(', ') || '',
    }));
  }

  async run(data: Contact[]): Promise<string> {
    const processedTags = this.processData(data);

    return json2csvAsync(processedTags, {
      delimiter: {
        field: ';',
      },
    }).then(csv => csv);
  }
}

type Contact = {
  email: string;
  name?: string;
  altNames?: string[];
  tags?: string[];
};

type ContactString = {
  email: string;
  name?: string;
  altNames?: string;
  tags?: string;
};
