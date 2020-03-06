# Specifications

## Upload

- [x] System must upload files to a temp S3 Bucket
- [x] System must return key of the file
- [ ] Routes must send the path of the file to be processed
- [ ] Services must delete files after processed
- [x] Bucket must remove files after 7 days, then be removed permanently after 7 days

## Template

- [ ] User can upload an HTML template
- [x] Template should be parsed to HTML
- [x] Parsed template must be saved in AWS
- [x] Template data must be saved in Database

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
