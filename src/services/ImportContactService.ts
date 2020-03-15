/* eslint-disable @typescript-eslint/camelcase */
import { Readable } from 'stream';
import csvParse from 'csv-parser';

export default class ImportContactService {
  contacts: Contact[];

  emails: string[];

  duplicated: Duplicated[];

  invalid: Invalid;

  tags: string[];

  readonly nameTester: RegExp;

  readonly emailTester: RegExp;

  constructor() {
    this.contacts = [];
    this.emails = [];
    this.duplicated = [];
    this.invalid = [];
    this.tags = [];

    this.nameTester = /(?:"?([^"]*)"?\s)?(?:<?([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)>?)/;
    this.emailTester = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  }

  getEmail(data: string): string | null {
    const match = data.toLowerCase().match(this.emailTester);
    if (match) return match[0];
    return null;
  }

  getName(data: string): string | null {
    const match = data.match(this.nameTester);
    if (match) return match[1];
    return null;
  }

  setName(data: string[]): string | null {
    const [matchName, nameFromCSV] = data;
    if (matchName && matchName.trim().length) return matchName.trim();
    if (nameFromCSV && nameFromCSV.trim().length) return nameFromCSV.trim();
    return null;
  }

  capitalize(data: string): string {
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

  addTag(data: string): void {
    if (data.length && !this.tags.includes(data)) this.tags.push(data);
  }

  async run(input: Readable, parserOptions?: csvParse.Options): Promise<void> {
    const options: csvParse.Options = {
      separator: ';',
      headers: ['email', 'tag', 'name'],
      ...parserOptions,
    };
    const parser = csvParse(options);

    const parseCSV = input.pipe(parser);

    parseCSV.on('data', line => {
      const { email: data, tag: origin, name: nameFromCSV } = line;

      const email = this.getEmail(data.trim());
      const nameMatch = this.getName(data.trim());

      if (!email) return this.invalid.push(line);

      const name = this.setName([nameMatch, nameFromCSV]);

      this.addTag(origin.trim());

      const tags = [origin.trim()];

      const position = this.checkIfExists(email);

      if (position >= 0) {
        this.registerDuplicate(email);

        const {
          alternateNames,
          name: savedName,
          tags: savedTags,
        } = this.contacts[position];

        if (
          name &&
          savedName !== name &&
          (!alternateNames || !alternateNames.includes(name))
        ) {
          if (!savedName) {
            this.contacts[position].name = this.capitalize(name);
          } else {
            const altNames = this.contacts[position].alternateNames || [];
            this.contacts[position].alternateNames = [
              ...altNames,
              this.capitalize(name),
            ];
          }
        }
        if (origin.length && !savedTags.includes(origin))
          this.contacts[position].tags.push(origin);
      } else {
        this.emails.push(email);
        return this.contacts.push({
          email,
          name: name ? this.capitalize(name) : null,
          tags,
          alternateNames: null,
        });
      }
      return null;
    });
    await new Promise(resolve => parseCSV.on('end', resolve));
  }
}

export type Contact = {
  email: string;
  name: string | null;
  alternateNames: string[] | null;
  tags: string[];
};

type Duplicated = {
  email: string;
  occurrences: number;
};

type Invalid = string[];
