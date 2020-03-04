import Database from '@database/index';
import Tag from '@models/Tag';

describe('Models: Tag', () => {
  afterAll(async () => Database.close());
  describe('associations', () => {
    it('should have a belongsToMany Contacts', () => {
      expect(Tag.associations).toMatchObject({
        contacts: { associationType: 'BelongsToMany' },
      });
    });
  });
});
