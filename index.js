import app from './src/app.js';
import Bun from 'bun';

const bunApp = Bun.serve({
  port: 3000,
  fetch: app.fetch,
});

console.log(`server is started goto ${bunApp.url}ui`);
