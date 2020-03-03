/* eslint-disable @typescript-eslint/camelcase */
import { Readable } from 'stream';
import csvParse from 'csv-parse';

export default class ImportContactService {
  contacts: Contact[];

  emails: string[];

  duplicated: Duplicated[];

  invalid: Invalid;

  readonly nameTester: RegExp;

  readonly emailTester: RegExp;

  constructor() {
    this.contacts = [];
    this.emails = [];
    this.duplicated = [];
    this.invalid = [];

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
      .map((word, i, arr) => {
        return word.length > 2 || i === arr.length - 1 || i === 0
          ? `${word[0].toLocaleUpperCase()}${word.substr(1)}`
          : word;
      })
      .join(' ');
  }

  checkIfExists(data: string): number {
    return this.emails.findIndex(email => email === data);
  }

  registerDuplicate(data: string): void {
    const position = this.duplicated
      .map(({ email }) => email)
      .findIndex(email => email === data);

    if (position >= 0) {
      this.duplicated[position].occurrences += 1;
    } else {
      this.duplicated.push({ email: data, occurrences: 1 });
    }
  }

  async run(contactsFileStream: Readable): Promise<void> {
    const parser = csvParse({
      delimiter: ';',
      columns: ['data', 'origin', 'nameFromCSV'],
    });

    const parseCSV = contactsFileStream.pipe(parser);

    parseCSV.on('data', line => {
      const { data, origin, nameFromCSV } = line;

      const emailMatch = this.getEmail(data.trim());
      const nameMatch = this.getName(data.trim());

      if (!emailMatch) return this.invalid.push(line);

      const email = emailMatch[0];

      const name =
        nameMatch && nameMatch[1] ? nameMatch[1].trim() : nameFromCSV.trim();
      const tags = [origin.trim()];

      const position = this.checkIfExists(email);

      if (position >= 0) {
        this.registerDuplicate(email);

        const {
          alternate_names,
          name: savedName,
          tags: savedTags,
        } = this.contacts[position];

        if (
          name.length &&
          savedName !== name &&
          !alternate_names.includes(name)
        )
          if (savedName === '') {
            this.contacts[position].name = this.capitalize(name);
          } else {
            this.contacts[position].alternate_names.push(this.capitalize(name));
          }
        if (origin.length && !savedTags.includes(origin))
          this.contacts[position].tags.push(origin);
      } else {
        this.emails.push(email);
        this.contacts.push({
          email,
          name: name.length ? this.capitalize(name) : '',
          tags,
          alternate_names: [],
        });
      }
    });

    await new Promise(resolve => parseCSV.on('end', resolve));
  }
}

type Contact = {
  email: string;
  name?: string;
  alternate_names: string[];
  tags: string[];
};

type Duplicated = {
  email: string;
  occurrences: number;
};

type Invalid = string[];
