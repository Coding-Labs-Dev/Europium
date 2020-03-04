import Database from '@database/index';
import Email from '@models/Email';

describe('Models: Email', () => {
  afterAll(async () => Database.close());
  describe('associations', () => {
    it('should have a BelongsTo Template', () => {
      expect(Email.associations).toMatchObject({
        template: { associationType: 'BelongsTo' },
      });
    });
  });
});
