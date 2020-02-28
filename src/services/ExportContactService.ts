import { json2csvAsync } from 'json-2-csv';

export default class ExportContactService {
  processTags(data: Contact[]): ContactString[] {
    return data.map(item => ({
      ...item,
      tags: item.tags?.join(','),
    }));
  }

  async run(data: Contact[]): Promise<string> {
    const processedTags = this.processTags(data);

    return json2csvAsync(processedTags, {
      delimiter: {
        field: ';',
      },
    })
      .then(csv => csv)
      .catch(err => {
        throw new Error(err);
      });
  }
}

type Contact = {
  email: string;
  name?: string;
  altName?: string;
  tags?: string[];
};

type ContactString = {
  email: string;
  name?: string;
  altName?: string;
  tags?: string;
};
