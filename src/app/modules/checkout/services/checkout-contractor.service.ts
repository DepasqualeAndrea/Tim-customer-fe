import { CheckoutContractor } from '../checkout-step/checkout-step-address/checkout-step-address.model';
import { User, Address } from '@model';
import { Injectable } from '@angular/core';
import moment from 'moment';

@Injectable({ providedIn: 'root' })
export class CheckoutContractorService {
    public getCheckoutContractorFromUser(user: User): CheckoutContractor {
        if (user.business) {
            return this.getCheckoutContractorFromUserBusiness(user);
        }
        return this.getCheckoutContractorFromPersonalUser(user);
    }
    private getCheckoutContractorFromUserBusiness(user: User): CheckoutContractor {
        return {
            firstName: user.address.firstname,
            lastName: user.address.lastname,
            fiscalCode: user.address.taxcode,
            birthDate: null,
            birthCountry: null,
            birthState: null,
            birthCity: null,
            birthCountryId: null,
            birthStateId: null,
            birthCityId: null,
            residenceCity: null,
            residenceCountry: null,
            residendeState: null,
            residenceCountryId: null,
            residendeStateId: null,
            company: user.address.company,
            vatcode: user.address.vatcode,
            phoneNumber: user.address.phone,
            email: user.email,
            address1: user.address.address1,
            zipCode: user.address.zipcode,
            city: user.address.city,
            countryId: user.address.country.id,
            stateId: user.address.state.id,
            locked_anagraphic: user.locked_anagraphic,
            address: null
        };
    }

    getCheckoutContractorFromPersonalUser(user: User): CheckoutContractor {
        return this.getContractor(user);
    }

    getContractor(user: User): CheckoutContractor {
        const address = this.computeAddress(user);
        const contractor = this.fillContractor(address);
        return contractor;
    }
    computeAddress(user: User): Address {
        const emptyAddress = { birth_country: {}, birth_state: {}, birth_city: {}, country: {}, state: {}, locked_anagraphic: user.locked_anagraphic, email: user.email };
        return <Address>Object.assign(emptyAddress, user.address);
    }
    fillContractor(address: Address): CheckoutContractor {

        const transformDate = (date: string): string => {
            const d = date?.split('/');
            return !!d ? `${d[2]}-${d[1]}-${d[0]}` : undefined;
        }
        if (address.birth_date?.includes('/'))
            address.birth_date = transformDate(address.birth_date);

        return {
            firstName: address.firstname,
            lastName: address.lastname,
            fiscalCode: address.taxcode,
            phoneNumber: address.phone,
            birthDate: address.birth_date.split('-').join('/'),
            birthCountry: address.birth_country && address.birth_country.name || undefined,
            birthState: address.birth_state && address.birth_state.name || undefined,
            birthCity: address.birth_city && address.birth_city.name || undefined,
            birthCountryId: address.birth_country && address.birth_country.id || undefined,
            birthStateId: address.birth_state && address.birth_state.id || undefined,
            birthCityId: address.birth_city && address.birth_city.id || undefined,
            address: address.address1,
            residenceCity: address.city,
            zipCode: address.zipcode,
            email: address.email,
            residenceCountry: address.country && address.country.name || undefined,
            residendeState: address.state && address.state.name || undefined,
            residenceCountryId: address.country && address.country.id || undefined,
            residendeStateId: address.state && address.state.id || undefined,
            locked_anagraphic: address.locked_anagraphic
        };
    }
}

