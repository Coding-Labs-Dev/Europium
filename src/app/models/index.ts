import Template, { TemplateAttributes } from './Template';
import Email, { EmailAttributes } from './Email';
import Contact, { ContactAttributes } from './Contact';
import Event, { EventAttributes } from './Event';

export default [
  {
    model: Template,
    attributes: TemplateAttributes,
  },
  {
    model: Email,
    attributes: EmailAttributes,
  },
  {
    model: Contact,
    attributes: ContactAttributes,
  },
  {
    model: Event,
    attributes: EventAttributes,
  },
];
