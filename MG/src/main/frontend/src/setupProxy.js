const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  const common = {
    target: 'http://localhost:8080', // Spring
    changeOrigin: true,
    logLevel: 'debug',
  };

  // real prefix hehe
  app.use('/tasks', createProxyMiddleware(common));
  app.use('/login', createProxyMiddleware(common));
  app.use('/user', createProxyMiddleware(common));
  app.use('/jwt', createProxyMiddleware(common)); // /jwt/refresh, /jwt/exchange
};