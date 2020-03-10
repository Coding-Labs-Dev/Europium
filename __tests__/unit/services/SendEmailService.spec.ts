import SendEmailService from '@services/SendEmailService';

describe('Send Email Service', () => {
  it('should be able to receive a SQS message', async () => {
    const sendEmailService = new SendEmailService();
    const data = await sendEmailService.sendEmail();
  });
});
