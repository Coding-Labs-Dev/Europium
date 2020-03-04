import Database from '@database/index';

describe('Models', () => {
  const models = ['Template', 'Contact', 'Email', 'Event', 'Tag'];

  models.map(model =>
    it(`should have a Model named ${model}`, () =>
      expect(Database.models).toHaveProperty(model)),
  );
});
