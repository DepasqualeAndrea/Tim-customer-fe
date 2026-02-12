const PROXY_CONFIG = {
  "/styles": {
    target: "http://localhost:4200/assets/css",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite: {
      "^/styles": "",
    },
  },
  '/api/': {
    target: "https://tim-customer.preprod.yoloassicurazioni.it/",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
  "/kentico-api-key/": {
    target: "https://tim-customer.preprod.yoloassicurazioni.it/",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
  "/cms-items/*": {
    target: "https://tim-customer.preprod.yoloassicurazioni.it/",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
  "/nyp/fetoken": {
    target: "https://tim-customer.preprod.yoloassicurazioni.it/",
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },

  // PROD
  //'/api/': {
  //  target: "https://www.timmybroker.it/",
  //  secure: false,
  //  changeOrigin: true,
  //  logLevel: "debug",
  //},
  //"/kentico-api-key/": {
  //  target: "https://www.timmybroker.it/",
  //  secure: false,
  //  changeOrigin: true,
  //  logLevel: "debug",
  //},
};

module.exports = PROXY_CONFIG;
