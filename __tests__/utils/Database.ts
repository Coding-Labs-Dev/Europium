import Database from '@database/index';

class MockedDatabase {
  private static instance: MockedDatabase;

  public static async getInstance(): Promise<MockedDatabase> {
    if (!this.instance) {
      await Database.sync({ force: true, logging: false });
      this.instance = new MockedDatabase();
    }
    return this.instance;
  }

  public static async truncate(models: string | string[]): Promise<void> {
    if (Array.isArray(models)) {
      Promise.all(
        models.map(async model =>
          Database.models[model].destroy({ where: {}, truncate: true }),
        ),
      );
    } else {
      await Database.models[models].destroy({
        where: {},
        truncate: true,
        cascade: true,
      });
    }
  }
}

export default MockedDatabase;
