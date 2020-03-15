import { SQS, AWSError } from 'aws-sdk';
import { uuid } from 'uuidv4';
import Email from '@models/Email';
import {
  SendMessageBatchRequest,
  SendMessageBatchRequestEntryList,
  SendMessageResult,
} from 'aws-sdk/clients/sqs';
import { PromiseResult } from 'aws-sdk/lib/request';

export default class SendEmailService {
  private sqs: SQS;

  constructor() {
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
    const email = await Email.findByPk(emailId, {
      rejectOnEmpty: true,
      include: ['contacts', 'template'],
    });

    const { template, contacts, variables } = email;

    const allMessages: SendMessageBatchRequestEntryList = contacts.map(
      contact => ({
        Id: uuid(),
        DelaySeconds: 1,
        MessageBody: JSON.stringify({
          emailId,
          template,
          configurationName: process.env.SES_CONFIGURATION_NAME,
          source: process.env.SOURCE_EMAIL,
          variables,
          contact,
        }),
      }),
    );

    const messages = this.arrayChunks(
      allMessages,
      process.env.SES_MAX_SEND_QUOTA,
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
