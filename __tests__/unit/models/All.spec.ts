import Database from '@database/index';

describe('Models', () => {
  const models = ['Template', 'Contact', 'Email', 'Event'];

  models.map(model =>
    it(`should have a Model named ${model}`, () =>
      expect(Database.models).toHaveProperty(model)),
  );
});
