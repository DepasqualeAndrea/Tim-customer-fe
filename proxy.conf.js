const API_BASE_URL = "https://tim-customer.dev.yoloassicurazioni.it/";

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
  // TEST
  '/api/': {
    target: `${API_BASE_URL}`,
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
  "/kentico-api-key/": {
    target: `${API_BASE_URL}`,
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
  "/cms-items/*": {
    target: `${API_BASE_URL}`,
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
  "/nyp/fetoken": {
    target: `${API_BASE_URL}`,
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
  "/api/latest/customer/token": {
    target: `${API_BASE_URL}`,
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
  "/nyp/login": {
    target: `${API_BASE_URL}`,
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
  "/nyp/getUserDetails": {
    target: `${API_BASE_URL}`,
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  }
  // UAT
  //'/api/': {
  //  target: "https://tim-customer.preprod.yoloassicurazioni.it/",
  //  secure: false,
  //  changeOrigin: true,
  //  logLevel: "debug",
  //},
  //"/kentico-api-key/": {
  //  target: "https://tim-customer.preprod.yoloassicurazioni.it/",
  //  secure: false,
  //  changeOrigin: true,
  //  logLevel: "debug",
  //},
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
