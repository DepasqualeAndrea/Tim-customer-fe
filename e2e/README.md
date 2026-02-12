# Test Integrations via Newman

Using Postman Collection and Env. We provide a test suite for the basic operations.

To start the Project use: 
 * _npm i_
 * _npm run test:sys_ or _npm run test:prod_

 It's also possible to run tests only for the selected environment with:
  
 _npm run test:{tenant}-{env}_ 
  
  for example: _npm run test:pet-sys_
  

# Test Integrations via Cypress

 To start tests:
 * _npm run e2e_

 Wait to Cypress program will open and select a test.
