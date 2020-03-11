import { Request, Response } from 'express';
import { Email } from '@models/index';
import QueueService from '@services/QueueService';

class EmailController {
  async store(req: Request, res: Response): Promise<Response> {
    const { name, templateId, variables, subject, contacts } = req.body;
    const email = await Email.create({
      name,
      subject,
      templateId,
      variables,
    });
    await email.setContacts(contacts);

    const queueService = new QueueService();

    const queue = await queueService.run(email.id);

    return res.json({ email, queue });
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const email = await Email.findByPk(id, {
      rejectOnEmpty: true,
      include: ['template', 'contacts'],
    });
    return res.json(email);
  }
}

export default new EmailController();
