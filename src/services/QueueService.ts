import { SQS, AWSError } from 'aws-sdk';
import { uuid } from 'uuidv4';
import { Email, Contact, Template } from '@models/index';
import {
  SendMessageBatchRequest,
  SendMessageBatchRequestEntry,
  SendMessageBatchRequestEntryList,
  SendMessageResult,
} from 'aws-sdk/clients/sqs';
import { PromiseResult } from 'aws-sdk/lib/request';

export default class SendEmailService {
  private sqs: SQS;

  constructor() {
    this.sqs = new SQS({ region: 'us-east-1' });
  }

  arrayChunks = (array: Array<any>, chunk: number): Array<Array<any>> =>
    Array(Math.ceil(array.length / chunk))
      .fill(0)
      .map((_, index) => index * chunk)
      .map(begin => array.slice(begin, begin + chunk));

  async run(
    emailId: number,
  ): Promise<PromiseResult<SendMessageResult, AWSError>[] | void> {
    const email = await Email.findByPk(emailId, {
      rejectOnEmpty: true,
      include: [
        { model: Template, as: 'template' },
        { model: Contact, as: 'contacts' },
      ],
    });

    const { template, contacts, variables } = email;

    const emailsBatch: SendMessageBatchRequestEntry[] = this.arrayChunks(
      contacts,
      process.env.SES_MAX_SEND_QUOTA,
    ).map(contactsBatch => {
      const emails = contactsBatch.map(contact => ({
        emailId,
        template,
        configurationName: process.env.SES_CONFIGURATION_NAME,
        source: process.env.SOURCE_EMAIL,
        variables,
        contact,
      }));
      return {
        Id: uuid(),
        DelaySeconds: 1,
        MessageBody: JSON.stringify(emails),
      };
    });

    const messagesBatch: SendMessageBatchRequestEntryList[] = this.arrayChunks(
      emailsBatch,
      10,
    );

    const data = await Promise.all(
      messagesBatch.map(async batchMessage => {
        const parameters: SendMessageBatchRequest = {
          QueueUrl: process.env.SQS_QUEUE,
          Entries: batchMessage,
        };
        return this.sqs.sendMessageBatch(parameters).promise();
      }),
    );

    return data;
  }
}
