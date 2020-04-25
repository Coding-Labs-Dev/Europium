import { SQS, AWSError } from 'aws-sdk';
import { Email, Contact, Template } from '@models/index';
import { SendMessageResult } from 'aws-sdk/clients/sqs';
import { PromiseResult } from 'aws-sdk/lib/request';

export default class SendEmailService {
  private sqs: SQS;

  constructor() {
    this.sqs = new SQS({
      region: 'us-east-1',
      endpoint:
        'https://vpce-0c0fa03f9c431f1a7.sqs.us-east-1.vpce.amazonaws.com',
    });
  }

  async run(
    email: Email,
    contacts: Contact[],
  ): Promise<PromiseResult<SendMessageResult, AWSError>[] | void> {
    const template = await Template.findByPk(email.templateId, {
      rejectOnEmpty: true,
    });

    const { variables } = email;

    const data: Promise<PromiseResult<SendMessageResult, AWSError>>[] = [];

    let sent = 0;

    contacts
      .map(contact => ({
        emailId: email.id,
        template,
        configurationName: process.env.SES_CONFIGURATION_NAME,
        source: process.env.SOURCE_EMAIL,
        variables,
        contact,
      }))
      .forEach(emailData => {
        const message = {
          MessageBody: JSON.stringify(emailData),
          QueueUrl: process.env.SQS_QUEUE,
          DelaySeconds: sent === process.env.SES_MAX_SEND_QUOTA ? 1 : 0,
        };
        data.push(this.sqs.sendMessage(message).promise());
        if (sent === Number(process.env.SES_MAX_SEND_QUOTA)) {
          sent = 0;
        } else {
          sent += 1;
        }
      });

    const result = await Promise.all(data);

    return result;
  }
}
