import express from "express";
import compressionMiddleware from "compression";
import markoMiddleware from "@marko/express";

const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 3000;

(async () => {
  const app = express()
    .use(compressionMiddleware()) // Enable gzip compression for all HTTP responses.
    .use(markoMiddleware.default());

  if (isProd) {
    const dist = await import('./dist');
    app
      .use('/assets', express.static('dist/assets')) // Serve assets generated from vite.
      .use(dist);
  } else {
    const vite = await import('vite');
    const devServer = await vite.createServer({
      server: { middlewareMode: true }
    });
    app.use(devServer.middlewares);
    app.use(async (req, res, next) => {
      req.devServer = devServer;
      const handler = await devServer.ssrLoadModule('./src/index');
      const onerr = (err) => {
        if (err) {
          devServer.ssrFixStacktrace(err);
          next(err);
        } else {
          next();
        }
      }
      handler.default(req, res, onerr);
    }
    );
  }

  app.listen(port, err => {
    if (err) {
      throw err;
    }
    console.log(`Listening on port ${port}`);
  });
})();