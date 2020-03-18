import { server } from './app';

server.listen(process.env.PORT || 3333, () => {
  // eslint-disable-next-line no-console
  console.log(
    `⚡️  Server listening in ${
      process.env.NODE_ENV
    } mode on http://localhost:${process.env.PORT || '3333'}`,
  );
});
