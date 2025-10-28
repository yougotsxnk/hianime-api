import app from './src/app.js';

const PORT = process.env.PORT || 5000;

Bun.serve({
  port: PORT,
  hostname: '0.0.0.0',
  fetch: app.fetch,
});

console.log(`server is running at http://0.0.0.0:${PORT}`);
console.log(`docs: http://0.0.0.0:${PORT}/doc`);
console.log(`swagger: http://0.0.0.0:${PORT}/ui`);
