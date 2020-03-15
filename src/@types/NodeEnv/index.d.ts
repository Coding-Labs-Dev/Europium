declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | 'test';
    DB_DIALECT:
      | 'mysql'
      | 'postgres'
      | 'sqlite'
      | 'mariadb'
      | 'mssql'
      | undefined;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
    S3_BUCKET: string;
    SQS_QUEUE: string;
    SES_CONFIGURATION_NAME: string;
    SES_MAX_SEND_QUOTA: number;
    SOURCE_EMAIL: string;
    STORAGE: string | null;
  }
}
