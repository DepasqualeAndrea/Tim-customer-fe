import {Address, InsuranceHoldersAttributes, OrderAttributes} from '@model';
import {CheckoutFamilyRelationship, CheckoutInsuredSubject} from './checkout-step-insurance-info.model';
import * as moment from 'moment';
import {PriceChangedReason} from './price-changed-reason.enum';

export class CheckoutStepInsuranceInfoHelper {
  static fromAddressToInsuredSubject(id: number, address: Address): CheckoutInsuredSubject {
    return {
      id: id,
      firstName: address.firstname,
      lastName: address.lastname,
      taxcode: address.taxcode,
      birthCity: address.birth_city,
      birthState: address.birth_state,
      birthCountry: address.birth_country,
      familyRelationship: 'other',
      birthDate: moment(address.birth_date, 'YYYY-MM-DD').toDate(),
    };
  }

  static findUserIdInInsuredSubjects(address: Address, insuredSubjects: CheckoutInsuredSubject[]): number {
    return ((insuredSubjects || []).find(is => is.taxcode === address.taxcode) || {id: null}).id;
  }

  static filterInsuredSubjectsByAge(insuredSubjects: CheckoutInsuredSubject[], minAge: number, maxAge: number): CheckoutInsuredSubject[] {
    return insuredSubjects.filter(is => {
      const age = moment().diff(moment(is.birthDate), 'years');
      return age <= maxAge && age >= minAge;
    });
  }

  static convertInsuredSubjectsToOrderAttributes(insuredSubjects: CheckoutInsuredSubject[]): OrderAttributes {
    return {
      number_of_insureds_25: '' + CheckoutStepInsuranceInfoHelper.filterInsuredSubjectsByAge(insuredSubjects, 0, 24).length,
      number_of_insureds_50: '' + CheckoutStepInsuranceInfoHelper.filterInsuredSubjectsByAge(insuredSubjects, 25, 49).length,
      number_of_insureds_60: '' + CheckoutStepInsuranceInfoHelper.filterInsuredSubjectsByAge(insuredSubjects, 50, 59).length,
      number_of_insureds_65: '' + CheckoutStepInsuranceInfoHelper.filterInsuredSubjectsByAge(insuredSubjects, 60, 65).length
    };
  }

  static diffOrderAttributes(oa1: OrderAttributes, oa2: OrderAttributes): OrderAttributes {
    return {
      number_of_insureds_25: '' + Math.abs(Number(oa1.number_of_insureds_25) - Number(oa2.number_of_insureds_25)),
      number_of_insureds_50: '' + Math.abs(Number(oa1.number_of_insureds_50) - Number(oa2.number_of_insureds_50)),
      number_of_insureds_60: '' + Math.abs(Number(oa1.number_of_insureds_60) - Number(oa2.number_of_insureds_60)),
      number_of_insureds_65: '' + Math.abs(Number(oa1.number_of_insureds_65) - Number(oa2.number_of_insureds_65))
    };
  }

  static quantity(orderAttributes: OrderAttributes) {
    return (
      Number(orderAttributes.number_of_insureds_25) +
      Number(orderAttributes.number_of_insureds_50) +
      Number(orderAttributes.number_of_insureds_60) +
      Number(orderAttributes.number_of_insureds_65)
    );
  }

  static computePriceChangeReason(agesChanged: number, total: number, quotationResponse: { total: number }) {
    if (agesChanged > 0 && total !== quotationResponse.total) {
      return 'Le date di nascita non corrispondono alle fasce d\'etá impostate inizialmente per questo il prezzo é stato ricalcolato';
    }
    if (agesChanged > 0) {
      return 'Le età inserite non corrispondono a quelle precedentemente selezionate';
    }
  }

  public static computePriceChangeEnumReason(agesChanged: number, total: number, quotationResponse: { total: number }): number {
    if (agesChanged > 0 && total !== quotationResponse.total) {
      return PriceChangedReason.ChangedByAge;
    }
    if (agesChanged > 0) {
      return PriceChangedReason.ChangeAgeNotCorresponding;
    }
    return PriceChangedReason.NotChanged;
  }

  public static fromCheckoutSubjectsToInsuranceHoldersAttribute(coSubjects: CheckoutInsuredSubject[]): { [key: string]: InsuranceHoldersAttributes } {
    return coSubjects.reduce((acc, subject, idx) => {
      acc[idx + ''] = this.fromCheckoutSubjectToInsuranceHolderAttribute(subject);
      acc[idx + ''] = subject._destroy ? Object.assign(acc[idx + ''], {_destroy: true}) : acc[idx + ''];
      return acc;
    }, {});
  }

  public static fromCheckoutSubjectToInsuranceHolderAttribute(subject: CheckoutInsuredSubject): InsuranceHoldersAttributes {
    const ihattrs: InsuranceHoldersAttributes = {
      id: subject.id,
      first_name: subject.firstName,
      last_name: subject.lastName,
      relationship: subject.familyRelationship,
    };
    if (subject.birthDate) {
      ihattrs.birth_date = moment(subject.birthDate).format('YYYY-MM-DD');
    }
    if (subject.taxcode) {
      ihattrs.taxcode = subject.taxcode;
    }
    if (subject.birthCountry && subject.birthCountry.id) {
      ihattrs.birth_country_id = subject.birthCountry.id;
    }
    if (subject.birthState && subject.birthState.id) {
      ihattrs.birth_state_id = subject.birthState.id;
    }
    if (subject.birthCity && subject.birthCity.id) {
      ihattrs.birth_city_id = subject.birthCity.id;
    }
    if (subject.phone) {
      ihattrs.phone = subject.phone;
    }
    if (subject.email) {
      ihattrs.email = subject.email;
    }
    if (subject.phone) {
      ihattrs.phone = subject.phone;
    }
    if (subject.residentialAddress) {
      ihattrs.address1 = subject.residentialAddress;
    }
    if (subject.postCode) {
      ihattrs.zipcode = subject.postCode;
    }
    if (subject.residentialCity) {
      ihattrs.city = subject.residentialCity;
    }
    if (subject.residentialState) {
      ihattrs.state_id = subject.residentialState;
    }
    if (subject.residentialCountry) {
      ihattrs.country_id = subject.residentialCountry.id;
    }
    return ihattrs;
  }

  public static fromRequestInsuranceHoldersToCheckoutSubjects(insuranceHoldersAttributes: { [key: string]: InsuranceHoldersAttributes }): CheckoutInsuredSubject[] {
    const checkoutInsuredSubject: CheckoutInsuredSubject[] = [];
    for (const key in insuranceHoldersAttributes) {
      if (insuranceHoldersAttributes.hasOwnProperty(key)) {
        const ihattrs = insuranceHoldersAttributes[key];
        const ihsubject = this.fromRequestInsuranceHolderToCheckoutInsuredSubject(ihattrs);
        checkoutInsuredSubject.push(ihsubject);
      }
    }
    return checkoutInsuredSubject;
  }

  public static fromRequestInsuranceHolderToCheckoutInsuredSubject(ih: InsuranceHoldersAttributes | any): CheckoutInsuredSubject {
    const relationship = <CheckoutFamilyRelationship>ih.relationship;
    const is: CheckoutInsuredSubject = {
      familyRelationship: relationship,
      lastName: ih.last_name,
      firstName: ih.first_name,
      id: ih.id,
      birthDate: moment(ih.birth_date, 'YYYY-MM-DD').toDate()
    };
    return is;
  }

  public static existsInsuredSubject(insuredSubject: CheckoutInsuredSubject, insuredSubjects: CheckoutInsuredSubject[]): boolean {
    return insuredSubjects.some(subj => {
      return (insuredSubject.firstName === subj.firstName
        && insuredSubject.lastName === subj.lastName
        && moment(insuredSubject.birthDate).isSame(subj.birthDate));
    });
  }

  static findUserInInsuredSubjectsByNameAndBirthDate(address: Address, insuredSubjects: CheckoutInsuredSubject[]): CheckoutInsuredSubject {
    return insuredSubjects.find(subj => {
      return (address.firstname === subj.firstName
        && address.lastname === subj.lastName
        && moment(address.birth_date).isSame(subj.birthDate));
    });
  }

  public static fromResponseInsuranceHoldersToCheckoutSubjects(insuranceHoldersAttributes: { [key: string]: InsuranceHoldersAttributes }): CheckoutInsuredSubject[] {
    const checkoutInsuredSubject: CheckoutInsuredSubject[] = [];
    for (const key in insuranceHoldersAttributes) {
      if (insuranceHoldersAttributes.hasOwnProperty(key)) {
        const ihattrs = insuranceHoldersAttributes[key];
        const ihsubject = this.fromResponseInsuranceHolderToCheckoutInsuredSubject(ihattrs);
        checkoutInsuredSubject.push(ihsubject);
      }
    }
    return checkoutInsuredSubject;
  }

  public static fromResponseInsuranceHolderToCheckoutInsuredSubject(ih: any): CheckoutInsuredSubject {
    const relationship = <CheckoutFamilyRelationship>ih.relationship;
    const is: CheckoutInsuredSubject = {
      familyRelationship: relationship,
      lastName: ih.lastname,
      firstName: ih.firstname,
      id: ih.id,
      birthDate: moment(ih.birth_date, 'YYYY-MM-DD').toDate()
    };
    return is;
  }
}

