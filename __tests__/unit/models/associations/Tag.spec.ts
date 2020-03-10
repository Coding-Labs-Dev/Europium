import Tag from '@models/Tag';
import Database from '../../../utils/Database';

describe('Models: Tag', () => {
  beforeAll(async () => {
    await Database.getInstance();
  });
  beforeEach(async () => Database.truncate(['Tag', 'Contact']));
  describe('associations', () => {
    it('should have a belongsToMany Contacts', () => {
      expect(Tag.associations).toMatchObject({
        contacts: { associationType: 'BelongsToMany' },
      });
    });
  });
});
