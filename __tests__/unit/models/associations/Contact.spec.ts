import Database from '@database/index';
import Contact from '@models/Contact';

describe('Models: Contact', () => {
  afterAll(async () => Database.close());

  describe('associations', () => {
    it('should have a belongsToMany Contacts', () => {
      expect(Contact.associations).toMatchObject({
        tags: { associationType: 'BelongsToMany' },
      });
    });
  });
});
