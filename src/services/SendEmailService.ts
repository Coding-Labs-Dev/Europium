import { SQS, SES, AWSError } from 'aws-sdk';
import {
  SendTemplatedEmailRequest,
  SendTemplatedEmailResponse,
} from 'aws-sdk/clients/ses';
import { uuid } from 'uuidv4';
import Email from '@models/Email';
import { TemplateModel } from '@models/Template';
import { ContactAttributes } from '@models/Contact';
import {
  SendMessageBatchRequest,
  SendMessageBatchRequestEntryList,
  SendMessageResult,
  Message,
} from 'aws-sdk/clients/sqs';
import { PromiseResult } from 'aws-sdk/lib/request';

export default class SendEmailService {
  private ses: SES;

  private sqs: SQS;

  constructor() {
    this.ses = new SES({ region: 'us-east-1' });
    this.sqs = new SQS({ region: 'us-east-1' });
  }

  arrayChunks = (array: object[], chunk: number): object[] =>
    Array(Math.ceil(array.length / chunk))
      .fill(0)
      .map((_, index) => index * chunk)
      .map(begin => array.slice(begin, begin + chunk));

  async run(
    emailId: number,
  ): Promise<PromiseResult<SendMessageResult, AWSError>[] | void> {
    const { MaxSendRate = 14 } = await this.ses.getSendQuota().promise();

    const email = await Email.findByPk(emailId, {
      rejectOnEmpty: true,
      include: ['contacts', 'template'],
    });

    const { template, contacts, variables } = email;

    const contactsChunks = this.arrayChunks(contacts, MaxSendRate);

    const messages: SendMessageBatchRequestEntryList = contactsChunks.map(
      chunk => ({
        Id: uuid(),
        DelaySeconds: 1,
        MessageBody: JSON.stringify({
          emailId,
          template,
          variables,
          contacts: chunk,
        }),
      }),
    );

    const data = await Promise.all(
      this.arrayChunks(messages, 10).map(async message => {
        const messageList = {
          QueueUrl: process.env.SQS_QUEUE,
          Entries: message,
        } as SendMessageBatchRequest;
        return this.sqs.sendMessageBatch(messageList).promise();
      }),
    );

    return data;
  }

  async sendEmail(): Promise<
    PromiseResult<SendTemplatedEmailResponse, AWSError>[] | void
  > {
    const messages = await this.sqs
      .receiveMessage({
        QueueUrl: process.env.SQS_QUEUE,
        MaxNumberOfMessages: 1,
        VisibilityTimeout: 60,
      })
      .promise();

    const message =
      messages.Messages?.length && (messages.Messages[0] as Message);

    if (!message || !message.Body || !message.ReceiptHandle) return undefined;

    const { Body, ReceiptHandle } = message;

    const data: BodyMessage = JSON.parse(Body);

    const { template, contacts, variables, emailId } = data;

    const emails = contacts.map(
      (contact): SendTemplatedEmailRequest => {
        const Destination = { ToAddresses: [contact.email] };
        const Source = process.env.SOURCE_EMAIL;
        const Template = template.name;
        const Tags = [
          {
            Name: 'emailId',
            Value: emailId.toString(),
          },
          {
            Name: 'templateId',
            Value: template.id.toString(),
          },
          {
            Name: 'contactId',
            Value: contact.id.toString(),
          },
        ];
        const { default: defaultVars, contact: contactVars } = variables;
        const templateData: TemplateData = { ...defaultVars, ...contactVars };

        Object.keys(contactVars).forEach(key => {
          const prop = key as keyof ContactAttributes;
          const attribute = contactVars[prop] as keyof ContactAttributes;
          templateData[key] = contact[attribute];
        });

        return {
          Destination,
          Source,
          Template,
          Tags,
          TemplateData: JSON.stringify(templateData),
        };
      },
    );

    const result = await Promise.all(
      emails.map(async email => this.ses.sendTemplatedEmail(email).promise()),
    );

    await this.sqs
      .deleteMessage({ QueueUrl: process.env.SQS_QUEUE, ReceiptHandle })
      .promise();

    return result;
  }
}

interface Variables {
  default: { [key: string]: any };
  contact: ContactAttributes;
}
interface BodyMessage {
  emailId: number;
  template: TemplateModel;
  subject: string;
  variables: Variables;
  contacts: ContactAttributes[];
}

type TemplateData = ContactAttributes & {
  [key: string]: any;
};
