import { AuthService } from '@services';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { ThreeDSecureParameters } from './braintree-3d-secure-parameters.interface';

export class Braintree3DSecureParametersFactory {
  constructor(
    private authService: AuthService
  ) { }
  resolveThreeDSecureParametersObject(amount, binData, nonce): ThreeDSecureParameters {
    const user = this.authService.currentUser;
    const address = user.address;
    return {
      amount: amount,
      nonce: nonce,
      bin: binData,
      email: user.email,
      billingAddress: {
        givenName: user.firstname,
        surname: user.lastname,
        phoneNumber: user.phone,
        streetAddress: address.address1,
        extendedAddress: 'NO user.address.address2 ?', // Should we include it?
        locality: address.city,
        region: address.state.abbr,
        postalCode: address.zipcode,
        countryCodeAlpha2: address.country.iso
      },
      additionalInformation: {
        workPhoneNumber: user.phone,
        shippingGivenName: user.firstname,
        shippingSurname: user.lastname,
        shippingPhone: user.phone,
        shippingAddress: {
          streetAddress: address.address1,
          extendedAddress: 'NO user.address.address2 ?',
          locality: address.city,
          region: address.state.abbr,
          postalCode: address.zipcode,
          countryCodeAlpha2: address.country.iso
        }
      }
    }
  }

  resolveThreeDSecureBasicParametersObject(nonce, bin, amount): ThreeDSecureParameters {
    const user = this.authService.currentUser;
    return {
      onLookupComplete: function (data, next) {
        next();
      },
      amount: amount,
      nonce: nonce,
      bin: bin,
      email: user.email,
    }
  }
  static resolveThreeDSecureObjectFromPaymentSource(paymentSourceInfo: {total:number, email: string, billing_address?: any, nonce: string, bin: string}): ThreeDSecureParameters {
    return {
      onLookupComplete: function (data, next) {
        next();
      },
      amount: paymentSourceInfo.total,
      nonce: paymentSourceInfo.nonce,
      bin: paymentSourceInfo.bin,
      email: paymentSourceInfo.email,
    }
    // billingAddress: paymentSourceInfo.billing_address
  }


  convertIntoAsciiPrintable(threeDSecureParameters: ThreeDSecureParameters): ThreeDSecureParameters {
    Object.keys(threeDSecureParameters).map(key => {
      if (typeof threeDSecureParameters[key] === 'object') {
        this.convertIntoAsciiPrintable(threeDSecureParameters[key]);
      }
      if (typeof threeDSecureParameters[key] === 'string') {
        threeDSecureParameters[key] = threeDSecureParameters[key].replace(/[^ -~,']+/g, "");
      }
    });
    return threeDSecureParameters;
  }

}