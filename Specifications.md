# Specifications

## Template

- [ ] User can upload an HTML template
- [ ] Template shloud be parsed to HTML
- [ ] Parsed template must be saved in AWS
- [ ] Template data must be saved in Database

## E-mail

- [ ] User can define a new e-mail
- [ ] User must select a template to use in the new e-mail
- [ ] User must add a subject to the e-mail
- [ ] User must add contacts to send the e-mail to
- [ ] User must map variables from template to contact data
- [ ] E-mail sending must use a queue system (Bull/Redis/SQS)

## Events

- [ ] All e-mail events must be saved to the database
- [ ] Bounce/rejected events must inactivate contact

## Unsubscribe

- [ ] Contacs must have an option to unsubscribe (set inactive in database)
