import { Readable } from 'stream';
import csvParse from 'csv-parse';

export default class ImportContactService {
  contacts: Contact[];

  readonly nameTester: RegExp;

  readonly emailTester: RegExp;

  constructor() {
    this.contacts = [];
    this.nameTester = /(?:"?([^"]*)"?\s)?(?:<?([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)>?)/;
    this.emailTester = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  }

  getEmail(data: string): RegExpMatchArray | null {
    return data.toLowerCase().match(this.emailTester);
  }

  getName(data: string): RegExpMatchArray | null {
    return data.match(this.nameTester);
  }

  capitalize(data: string): string {
    if (!data.length) return data;

    return data
      .toLocaleLowerCase()
      .split(' ')
      .map((word, i, arr) =>
        word.length > 2 || i === arr.length - 1 || i === 0
          ? `${word[0].toLocaleUpperCase()}${word.substr(1)}`
          : word,
      )
      .join(' ');
  }

  async run(contactsFileStream: Readable): Promise<void> {
    const parser = csvParse({
      delimiter: ';',
      columns: ['data', 'origin', 'nameFromCSV'],
    });

    const parseCSV = contactsFileStream.pipe(parser);

    parseCSV.on('data', line => {
      const { data, origin, nameFromCSV } = line;

      const emailMatch = this.getEmail(data);
      const nameMatch = this.getName(data);

      if (!emailMatch) return;

      const email = emailMatch[0];

      const name = nameMatch && nameMatch[1] ? nameMatch[1] : nameFromCSV;

      const tags = [origin];

      this.contacts.push({
        email,
        name: this.capitalize(name),
        tags,
      });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));
  }
}

type Contact = {
  email: string;
  name?: string;
  altName?: string;
  tags?: string[];
};
