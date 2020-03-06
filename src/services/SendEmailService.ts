import SES from 'aws-sdk/clients/ses';

export default class SendEmailService {
  private client: SES;

  constructor() {
    this.client = new SES({
      region: 'us-east-1',
    });
  }

  async run(): Promise<void> {
    await this.client
      .sendEmail({
        Source: 'Coding Labs <conato@codinglabs.dev>',
        Destination: {
          ToAddresses: ['Coding Labs Email Test <test@codinglabs.dev>'],
        },
        Message: {
          Subject: {
            Data: 'Email Test',
          },
          Body: {
            Text: {
              Data: 'This is a email test',
            },
          },
        },
        ConfigurationSetName: 'amigos-do-brazil',
      })
      .promise();
  }
}
