const PROXY_CONFIG = {
    '/api': {
        target: 'http://nyp.tim-customer.software-inside.it',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug'
    },
    '/dashboard': {
        target: 'https://yolo-staging.yolo-insurance.com',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug'
    },
    '/styles': {
        target: 'http://localhost:4200/assets/css',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
            '^/styles': ''
        }
    },
    '/gateway': {
        target: 'http://nyp.tim-customer.software-inside.it/api/v1',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
            "/gateway/v1": "",
        }
    },
    '/gateway-legacy': {
        target: 'http://nyp.tim-customer.software-inside.it/api/legacy',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
            "/gateway-legacy": "",
        }
    },
    '/kentico-api-key/': {
        target: 'http://nyp.tim-customer.software-inside.it',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug'
    },
    '/iad-utility': {
        target: 'http://nyp.tim-customer.software-inside.it',
        secure: false,
        changeOrigin: true,
        logLevel: 'debug'
    }

}

module.exports = PROXY_CONFIG;
