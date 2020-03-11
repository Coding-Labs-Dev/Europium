declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | 'test';
    DB_HOST: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DB_NAME: string;
    S3_BUCKET: string;
    SQS_QUEUE: string;
    SES_CONFIGURATION_NAME: string;
    SOURCE_EMAIL: string;
  }
}
