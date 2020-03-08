declare module 'Youch' {
  import { Errback, Request } from 'express';

  class Youch {
    constructor(err: Errback, req: Request);

    toJSON(): Promise<any>;
  }
  export default Youch;
}
