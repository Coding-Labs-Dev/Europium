import Database from '@database/index';
import Email from '@models/Email';

describe('Models: Email', () => {
  describe('associations', () => {
    const email = Email;
    email.associate(Database.models);

    it('should have a BelongsTo Template', () => {
      expect(email.associations).toMatchObject({
        Template: { associationType: 'BelongsTo' },
      });
    });
  });
});
