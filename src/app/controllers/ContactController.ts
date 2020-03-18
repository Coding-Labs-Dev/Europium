import { Request, Response } from 'express';
import Sequelize from 'sequelize';

import { Contact, Tag, ContactTag, Email, Event } from '@models/index';
import { Contact as ContactType } from '@services/ImportContactService';

class ContactController {
  async index(_req: Request, res: Response): Promise<Response> {
    return res.json(
      await Contact.findAll({
        include: [
          {
            model: Tag,
            as: 'tags',
          },
        ],
      }),
    );
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const contact = await Contact.findByPk(id, {
      include: [
        {
          model: Email,
          as: 'emails',
        },
        {
          model: Tag,
          as: 'tags',
        },
        {
          model: Event,
          as: 'events',
        },
      ],
    });

    return res.json(contact);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const {
      contacts,
      tags,
    }: { contacts: ContactType[]; tags: string[] } = req.body;

    await Tag.bulkCreate(
      tags.map(name => ({ name })),
      { ignoreDuplicates: true },
    );

    const allTags = await Tag.findAll({
      where: Sequelize.or({ name: tags }),
    });

    const newContacts = await Contact.bulkCreate(
      contacts.map(contact => {
        const newContact = { ...contact };
        delete newContact.tags;
        return newContact;
      }),
      { ignoreDuplicates: true },
    );

    const associateData: { contactId: number; tagId: number }[] = [];

    contacts.forEach(contact => {
      const contactId = newContacts.filter(
        ({ email }) => email === contact.email,
      )[0].id;
      const tagsIds = allTags
        .filter(({ name }) => contact.tags.includes(name))
        .map(({ id }) => id);

      const associationsData = tagsIds.map(tagId => ({ contactId, tagId }));
      associationsData.forEach(item => associateData.push(item));
    });

    await ContactTag.bulkCreate(associateData);

    return res.json({ contacts, tags });
  }
}

export default new ContactController();
