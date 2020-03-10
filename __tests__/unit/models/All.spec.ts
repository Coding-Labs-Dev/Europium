import Database from '../../utils/Database';

describe('Models', () => {
  beforeAll(async () => {
    await Database.getInstance();
  });

  afterAll(async () => {
    await Database.close();
  });

  const models = ['Template', 'Contact', 'Email', 'Event', 'Tag'];

  models.map(model =>
    it(`should have a Model named ${model}`, () =>
      expect(Database.models).toHaveProperty(model)),
  );
});
