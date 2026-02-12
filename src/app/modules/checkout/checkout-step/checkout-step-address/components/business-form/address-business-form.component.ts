import { Component, OnInit, OnDestroy, Input, EventEmitter, Output, ViewChild, OnChanges, Inject } from '@angular/core';
import { CheckoutContractor } from '../../checkout-step-address.model';
import { BusinessForm } from 'app/shared/business-form/business-form.model';
import { BusinessFormComponent } from 'app/shared/business-form/business-form.component';
import { CheckoutAddressForm } from '../../checkout-address-forms.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { Address, User } from 'app/core/models/user.model';
import { RequestOrder, BillItemsAttributes } from '@model';
import { CheckoutContractorService } from 'app/modules/checkout/services/checkout-contractor.service';
import { AuthService, DataService, UserService } from '@services';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-address-business-form',
    templateUrl: './address-business-form.component.html',
    styleUrls: ['./address-business-form.component.scss']
})
export class AddressBusinessFormComponent implements OnInit, OnDestroy, CheckoutAddressForm, OnChanges {
    @ViewChild(BusinessFormComponent, { static: true }) businessFormComponent: BusinessFormComponent;
    @Input() contractor: CheckoutContractor;
    @Output() validityChange = new EventEmitter<boolean>();
    @Input() residentDataDisabled: boolean;
    business: BusinessForm;
    componentLoaded = false;
    disableLockedFields = true;
    flag = 0;
    constructor(
        private authService: AuthService,
        private userService: UserService,
        public dataService: DataService
    ) {

    }
    ngOnChanges() {
        this.detectChanges();
    }
    ngOnInit(): void {
        this.componentLoaded = true;
        this.detectChanges();
        this.businessFormComponent.showRegistrationElements = false;
        this.businessFormComponent.showResetPassword = false;
    }
    ngOnDestroy() {

    }
    detectChanges(): void {
        if (this.componentLoaded) {
            const business = this.getBusinessFromCheckoutContractor(this.contractor);
            this.business = business;
        }
    }
    disableLockedFormFields() {
        return this.contractor.locked_anagraphic;
    }
    getBusinessFromCheckoutContractor(checkoutContractor: CheckoutContractor) {
        const business: BusinessForm = {
            company: checkoutContractor.company,
            taxcode: checkoutContractor.fiscalCode,
            firstname: checkoutContractor.firstName,
            lastname: checkoutContractor.lastName,
            vatcode: checkoutContractor.vatcode,
            phone: checkoutContractor.phoneNumber,
            email: checkoutContractor.email,
            officeaddress: checkoutContractor.address1,
            officezipcode: checkoutContractor.zipCode,
            officecity: checkoutContractor.city,
            officestate: { id: checkoutContractor.stateId },
            country_id: checkoutContractor.countryId
        };
        return business;
    }
    formValueChanged(isValid: boolean) {
        this.validityChange.next(isValid);
    }

    getContractorFromForm() {
        if (!this.businessFormComponent.isValid()) {
            return undefined;
        }
        const business = this.businessFormComponent.getBusiness();
        const checkoutContractor: CheckoutContractor = {
            firstName: business.firstname,
            lastName: business.lastname,
            fiscalCode: business.taxcode,
            birthDate: null,
            birthCountry: undefined,
            birthState: undefined,
            birthCity: undefined,
            birthCountryId: null,
            birthStateId: null,
            birthCityId: undefined,
            address: undefined,
            residenceCity: undefined,
            residenceCountry: undefined,
            residendeState: undefined,
            residenceCountryId: undefined,
            residendeStateId: undefined,
            locked_anagraphic: this.contractor.locked_anagraphic,
            company: business.company,
            vatcode: business.vatcode,
            phoneNumber: business.phone,
            email: business.email,
            address1: business.officeaddress,
            zipCode: business.officezipcode,
            city: business.officecity,
            stateId: business.officestate_id,
            countryId: business.country_id,
            business: true
        };
        const updateNewUser = this.getNewUserFromBusiness(business);
        const userLogged = this.authService.loggedUser.address
        if (!!this.authService.loggedUser.business) {
            if (!userLogged.taxcode && (updateNewUser.taxcode !== updateNewUser.vatcode) && this.flag === 0) {
                this.userService.updateBusinessUser(this.authService.loggedUser.id, updateNewUser).pipe(take(1))
                    .subscribe();
                this.flag = 1;
                return checkoutContractor;
            } else {
                if (this.flag === 1) {
                    return checkoutContractor;
                }
                delete checkoutContractor.fiscalCode
                return checkoutContractor;
            }
        }
    }
    disableFields(fieldNames: string[]) {
        throw new Error('Method not implemented.');
    }

    getNewUserFromBusiness(business: BusinessForm) {
        const user = {
            phone: business.phone,
            city: business.officecity,
            country_id: business.country_id,
            state_id: business.officestate_id,
            zipcode: business.officezipcode,
            vatcode: business.vatcode,
            company: business.company,
            taxcode: business.taxcode,
            firstname: business.firstname,
            lastname: business.lastname,
            address1: business.officeaddress,
        };
        return user;
    }
}
