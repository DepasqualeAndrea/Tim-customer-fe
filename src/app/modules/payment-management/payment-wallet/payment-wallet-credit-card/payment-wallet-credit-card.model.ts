export const HOSTED_FIELDS: { [key: string]: { selector: string, placeholder: string } } = {
  number: {
    selector: '#number',
    placeholder: 'Numero carta'
  },
  cvv: {
    selector: '#cvv',
    placeholder: 'CVV'
  },
  expirationDate: {
    selector: '#expiration-date',
    placeholder: 'Data di scadenza MM/YYYY'
  }
};

const BRAINTREE_DEFAULT_STYLE = {
  'font-family': 'Arial',
  'font-size': '13.3333px',
  'color': '#7f7e81',
  'font-style': 'normal',
  'font-weight': 'normal'

};

const BRAINTREE_HOSTED_FIELDS_STYLES = {
  'input': BRAINTREE_DEFAULT_STYLE,
  'input.invalid': BRAINTREE_DEFAULT_STYLE,
  'input.valid': BRAINTREE_DEFAULT_STYLE,
  '::-webkit-input-placeholder': BRAINTREE_DEFAULT_STYLE,
  ':-moz-placeholder': BRAINTREE_DEFAULT_STYLE,
  '::-moz-placeholder': BRAINTREE_DEFAULT_STYLE,
  ':-ms-input-placeholder': BRAINTREE_DEFAULT_STYLE,

  '@media  (min-width: 280px) and (max-width: 1280px)': {
    'input': BRAINTREE_DEFAULT_STYLE,
    'input.invalid': BRAINTREE_DEFAULT_STYLE,
    'input.valid': BRAINTREE_DEFAULT_STYLE,
    '::-webkit-input-placeholder': BRAINTREE_DEFAULT_STYLE,
    ':-moz-placeholder': BRAINTREE_DEFAULT_STYLE,
    '::-moz-placeholder': BRAINTREE_DEFAULT_STYLE,
    ':-ms-input-placeholder': BRAINTREE_DEFAULT_STYLE,
  }
};

export const BRAINTREE_HOSTED_FIELDS_STYLES_CONFIG: {[property: string]: object} = {
  ...BRAINTREE_HOSTED_FIELDS_STYLES,
};

const BRAINTREE_GENERTEL_STYLE = {
  'font-family': 'Lato',
  'font-size': '17px',
  'font-weight': 'bold',
  'width': '100%',
  'color': '#707070',
  'background-color': 'transparent',
  'border': 'none',
  'outline': 'none',
};

const BRAINTREE_HOSTED_FIELDS_GENERTEL_STYLES = {
  'input': BRAINTREE_GENERTEL_STYLE,
  'input.invalid': BRAINTREE_GENERTEL_STYLE,
  'input.valid': BRAINTREE_GENERTEL_STYLE,
  '::-webkit-input-placeholder': BRAINTREE_GENERTEL_STYLE,
  ':-moz-placeholder': BRAINTREE_GENERTEL_STYLE,
  '::-moz-placeholder': BRAINTREE_GENERTEL_STYLE,
  ':-ms-input-placeholder': BRAINTREE_GENERTEL_STYLE,

  '@media  (min-width: 280px) and (max-width: 1280px)': {
    'input': BRAINTREE_GENERTEL_STYLE,
    'input.invalid': BRAINTREE_GENERTEL_STYLE,
    'input.valid': BRAINTREE_GENERTEL_STYLE,
    '::-webkit-input-placeholder': BRAINTREE_GENERTEL_STYLE,
    ':-moz-placeholder': BRAINTREE_GENERTEL_STYLE,
    '::-moz-placeholder': BRAINTREE_GENERTEL_STYLE,
    ':-ms-input-placeholder': BRAINTREE_GENERTEL_STYLE,
  }
};

const BRAINTREE_HOSTED_FIELDS_GENERTEL_STYLES_CONFIG: {[property: string]: object} = {
  ...BRAINTREE_HOSTED_FIELDS_GENERTEL_STYLES,
};

export const braintreeTenantLayouts = {
  'genertel': BRAINTREE_HOSTED_FIELDS_GENERTEL_STYLES_CONFIG
}