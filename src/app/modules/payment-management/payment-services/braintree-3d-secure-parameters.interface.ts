export interface ThreeDSecureParameters {
    onLookupComplete?: any,
    amount?: any,
    nonce?: string,
    bin?: any,
    email?: string,
    billingAddress?: {
      givenName?: string,
      surname?: string,
      phoneNumber?: string,
      streetAddress?: string,
      extendedAddress?: string,
      locality?: string,
      region?: string,
      postalCode?: string,
      countryCodeAlpha2?: string
    },
    additionalInformation?: {
      workPhoneNumber?: string,
      shippingGivenName?: string,
      shippingSurname?: string,
      shippingPhone?: string,
      shippingAddress?: {
        streetAddress?: string,
        extendedAddress?: string,
        locality?: string,
        region?: string,
        postalCode?: string,
        countryCodeAlpha2?: string 
      }
    }
  }
  