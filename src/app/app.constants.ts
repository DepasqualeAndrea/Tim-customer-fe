export const CONSTANTS = {
  PROFESSIONS: ['employee', 'labourer', 'unemployed', 'other'],
  EDUCATIONS: ['undergraduate', 'bachelor_degree', 'master_degree', 'doctorate', 'post_doctorate'],
  SALARIES: ['low', 'regular', 'medium', 'high'],

  SSO_UNEXPECTED_ERROR_PARAM: 'error',

  CERTIFICATE_URL_MISSING: '/certificates/original/missing.png',
  SURVEY_URL_MISSING: '/adequacy_surveys/original/missing.png',

  NAME_PATTERN: '[a-zA-Z\ òàùèéì\']*',
  FISCAL_CODE_PATTERN: '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$',
  BIRTH_DATE_PATTERN: '([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})',
  PHONE_NUMBER_PATTERN: '[(+).0-9\/\ ]*',
  ITALIAN_IBAN: '^(it|IT)[0-9]{2}[A-Za-z][0-9]{10}[0-9A-Za-z]{12}$',
  IBAN: '/^(?:(?:IT|SM)\d{2}[A-Z]\d{22}|CY\d{2}[A-Z]\d{23}|NL\d{2}[A-Z]{4}\d{10}|LV\d{2}[A-Z]{4}\d{13}|(?:BG|BH|GB|IE)\d{2}[A-Z]{4}\d{14}|GI\d{2}[A-Z]{4}\d{15}|RO\d{2}[A-Z]{4}\d{16}|KW\d{2}[A-Z]{4}\d{22}|MT\d{2}[A-Z]{4}\d{23}|NO\d{13}|(?:DK|FI|GL|FO)\d{16}|MK\d{17}|(?:AT|EE|KZ|LU|XK)\d{18}|(?:BA|HR|LI|CH|CR)\d{19}|(?:GE|DE|LT|ME|RS)\d{20}|IL\d{21}|(?:AD|CZ|ES|MD|SA)\d{22}|PT\d{23}|(?:BE|IS)\d{24}|(?:FR|MR|MC)\d{25}|(?:AL|DO|LB|PL)\d{26}|(?:AZ|HU)\d{27}|(?:GR|MU)\d{28})$/i'
};

export const PAYMENT_METHOD_NAME = {
  BRAINTREE: 'Braintree',
  BRAINTREE_RECURRENT: 'Braintree Recurrent',
  BRAINTREE_THREE_D_SECURE: 'PaypalBraintree',
  BRAINTREE_RECURRENT_THREE_D_SECURE: 'PaypalBraintree Recurrent',
  BANK_TRANSFER: 'Transfer',
  NO_PAYMENT: 'No Payment CC',
};
