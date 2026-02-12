/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const { MongoClient } = require('mongodb');
const request = require('request-promise');
const inquirer = require('inquirer');

// SYS database URL
const url = 'mongodb+srv://admin:admin@cluster-yolo-pber7.mongodb.net/test?retryWrites=true&w=majority';

const dbName = 'justeat_db';
const collectionName = 'tenantInfo';

const apiHost = 'https://yolo-integration.yolo-insurance.com';
const apiLogin = 'olivier.ailloud@link-me.it';
const apiPwd = 'Test1234';

const findUpdate = (collection, findQuery, updateQuery) => collection.findOneAndUpdate(findQuery, updateQuery, {
  returnOriginal: false,
});

const getProducts = async (email, password, host) => {
  const body = { user: { email, password } };
  const signInResponse = await request.post(`${host}/dashboard/api/v2/users/sign_in`, { json: true, body });
  const { token } = signInResponse;
  const auth = {
    bearer: `Bearer ${token}`,
  };

  const products = await request.get(`${host}/dashboard/api/v2/products`, { json: true, auth });

  return products;
};

const main = async () => {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    const productsResponse = await getProducts(apiLogin, apiPwd, apiHost);

    const { products: apiProducts } = productsResponse;

    await client.connect();
    console.log('Connected correctly to server');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const tenantInfo = await collection.findOne();
    const { template } = tenantInfo;
    template.products = template.products.map((dbProduct) => {
      const currentProduct = apiProducts.find(apiProduct => apiProduct.id === dbProduct.productId);
      if (!currentProduct) {
        throw new Error(`Cannot find any product with id ${dbProduct.productId}`);
      }
      const newProduct = Object.assign({}, dbProduct);
      newProduct.productCode = currentProduct.product_code;
      return newProduct;
    });
    console.log('You\'re about to set tenantInfo.template.products with this data:');
    console.log('*********************************************');
    console.log(template);
    console.log('*********************************************');
    const prompt = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Do you wish to proceed?',
        default: false,
      },
    ]);
    if (prompt.proceed) {
      const result = await findUpdate(collection, {}, { $set: { template } });
      console.log('operation performed');
      console.log(result);
    } else {
      console.log('operation canceled');
    }
  } catch (err) {
    console.log(err.stack);
  }

  client.close();
};

main();
