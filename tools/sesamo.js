
/*

This is a little node script that generates some js code to log in to the app
(without any use of SSO or login).
Just copy/paste the code in the browser's console and you're logged in!

Launch it doing : node tools/sesamo.js

*/

/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const request = require('request-promise');
const inquirer = require('inquirer');


const YOLO_SYS_HOST = 'https://staging.yolo-insurance.com';
// const YOLO_SYS_HOST = 'https://yolo-staging.yolo-insurance.com';
const CB_SYS_HOST = 'http://chebanca.chebanca-tenant.staging.yolo-insurance.com';
const CB_PREVIEW_HOST = 'https://chebanca-chebanca-sys.preview.yolo-insurance.com';
const CB_DEMO_HOST = 'https://chebanca-staging.yolo-insurance.com';

const DEFAULT_USER = 'olivier.ailloud@link-me.it';
const DEFAULT_PASSWORD = 'Yolo1234';

const main = async () => {
  const envPrompt = await inquirer.prompt([
    {
      type: 'list',
      name: 'host',
      message: 'To which environment you want to log in?',
      choices: [
        { name: 'YOLO Sys', value: YOLO_SYS_HOST },
        { name: 'CB Sys', value: CB_SYS_HOST },
        { name: 'CB Preview', value: CB_PREVIEW_HOST },
        { name: 'CB Demo/Staging', value: CB_DEMO_HOST },
      ],
    },
    {
      type: 'input',
      name: 'email',
      message: 'With which user?',
      default: DEFAULT_USER,
    },
    {
      type: 'input',
      name: 'password',
      message: 'And which password?',
      default: DEFAULT_PASSWORD,
    },
  ]);

  const { host, email, password } = envPrompt;

  const body = { user: { email, password } };
  const signInResponse = await request.post(`${host}/dashboard/api/v2/users/sign_in`, { json: true, body });
  const { id: userId, token } = signInResponse;
  const auth = {
    bearer: `Bearer ${token}`,
  };

  const user = await request.get(`${host}/dashboard/api/v2/users/${userId}`, { json: true, auth });

  console.log(`
    Success !
    Just copy/paste this in your browser's console:
    ****************************************************************************
    localStorage.setItem('token', '${token}');
    localStorage.setItem('user', '${JSON.stringify(user)}');
    ****************************************************************************
  `);
};

main().catch((err) => {
  console.error(`Code ${err.statusCode} on ${err.options.method} ${err.options.uri}`);
  console.error(err.message);
});
