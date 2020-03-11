import { SQS, SES, AWSError } from 'aws-sdk';
import { uuid } from 'uuidv4';
import Email from '@models/Email';
import {
  SendMessageBatchRequest,
  SendMessageBatchRequestEntryList,
  SendMessageResult,
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
          configurationName: process.env.SES_CONFIGURATION_NAME,
          source: process.env.SOURCE_EMAIL,
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
}
