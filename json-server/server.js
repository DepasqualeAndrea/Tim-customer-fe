const jsonServer = require('json-server');
const routes = require('./config/routes.json');

const server = jsonServer.create();
const router = jsonServer.router(require('./config/db.js')());

const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// TODO set a config file to know whether to do this change or not
server.use((req, res, next) => {
  if (req.method !== 'GET') {
    req.method = 'GET';
  }
  next();
});


// TODO extract in controller

// redirect for checkout steps
server.get('/api/legacy/checkouts/:orderId', (req, res, next) => {
  req.url = req.url.split(req.params.orderId).shift() + req.body.state;
  console.log(req.url);
  next();
});

server.get('/api/legacy/checkouts/:orderId/complete', (req, res, next) => {
  req.url = req.url.split(req.params.orderId).shift() + req.body.state;
  next();
});

server.use(jsonServer.rewriter(routes));

server.use(router);

server.listen(1080, () => {
  // eslint-disable-next-line no-console
  console.log('JSON Server is running');
});
