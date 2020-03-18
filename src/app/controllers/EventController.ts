import { Request, Response } from 'express';
import { Email, Contact, Event } from '@models/index';

class EventController {
  async index(req: Request, res: Response): Promise<Response> {
    const { emailId } = req.params;
    const events = await Event.findAll({
      where: { emailId },
      include: [
        {
          model: Email,
          as: 'email',
          attributes: ['name'],
        },
        {
          model: Contact,
          as: 'contact',
          attributes: ['name', 'email'],
        },
      ],
      attributes: ['eventType', 'createdAt'],
    });
    return res.json(events);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const events = await Event.findAll({
      where: { id },
      include: [
        {
          model: Email,
          as: 'email',
          attributes: ['name'],
        },
        {
          model: Contact,
          as: 'contact',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(events);
  }
}

export default new EventController();
