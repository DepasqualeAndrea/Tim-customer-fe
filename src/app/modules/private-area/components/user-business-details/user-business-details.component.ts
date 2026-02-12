import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UserService, AuthService, DataService } from '@services';
import { User, AcceptanceAttributes } from '@model';
import { BusinessFormComponent } from 'app/shared/business-form/business-form.component';
import { BusinessForm } from 'app/shared/business-form/business-form.model';
import { switchMap, take } from 'rxjs/operators';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-user-business-details',
  templateUrl: './user-business-details.component.html',
  styleUrls: ['./user-business-details.component.scss']
})
export class UserBusinessDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(BusinessFormComponent, { static: true }) businessFormComponent: BusinessFormComponent;
  @ViewChild('consent', { static: true }) consent: ConsentFormComponent;
  constructor(
    private userService: UserService,
    protected nypUserService: NypUserService,
    private authService: AuthService,
    public dataService: DataService
  ) {
  }
  errorMessage = '';
  success = false;
  errorDetails = false;
  business: BusinessForm;
  user: User;
  disableLockedFields = true;
  ngOnDestroy(): void {
  }
  ngOnInit(): void {
    this.user = this.authService.loggedUser;
    this.initBusiness(this.user);
  }

  initBusiness(user: User) {
    this.businessFormComponent.showRegistrationElements = false;
    this.businessFormComponent.showResetPassword = true;
    const newBusiness = this.getBusinessFromUser(user);
    this.business = newBusiness;
    this.disableLockedFields = user.locked_anagraphic;
  }

  getBusinessFromUser(user: User): BusinessForm {
    const business: BusinessForm = {
      company: user.address.company,
      id: user.address.id,
      password: user.password,
      email: user.email,
      vatcode: user.address.vatcode,
      officeaddress: user.address.address1,
      officezipcode: user.address.zipcode,
      officecity: user.address.city,
      taxcode: user.address.taxcode,
      firstname: user.address.firstname,
      lastname: user.address.lastname,
      officestate: {
        id: user.address.state.id,
        name: user.address.state.name,
        abbr: user.address.state.abbr,
        country_id: user.address.state.country_id,
        cities_required: user.address.state.cities_required,
      },
      phone: user.address.phone,
      country_id: user.address.country_id,
    };
    return business;
  }

  getUserFromBusiness(business: BusinessForm): User {
    const userAcceptancesAttributes: AcceptanceAttributes = {};
    this.user.user_acceptances.forEach((ua: any, index) => {
      if (ua.kind === 'privacy' && !!this.consent.consentForm.controls[ua.tag]) {
        userAcceptancesAttributes[`${index}`] = {
          id: ua.id,
          value: this.consent.consentForm.controls[ua.tag].value,
        };
      }
    });

    const user = {
      id: this.user.id,
      password: business.password,
      user_acceptances_attributes: userAcceptancesAttributes,
      bill_address_attributes: {
        phone: business.phone,
        city: business.officecity,
        country_id: business.country_id,
        state_id: business.officestate_id,
        zipcode: business.officezipcode,
        address1: business.officeaddress,
        vatcode: business.vatcode,
        company: business.company,
        taxcode: business.taxcode,
        firstname: business.firstname,
        lastname: business.lastname
      }
    };
    return user;
  }

  getNewUserFromBusiness(business: BusinessForm): any {
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

  updateUserBusiness() {
    const business = this.businessFormComponent.getBusiness();
    const updatedUser = this.getUserFromBusiness(business);
    const updateNewUser = this.getNewUserFromBusiness(business);
    const userTaxcode = this.authService.loggedUser.address.taxcode;

    if (!!this.authService.loggedUser.business) {
      if (!userTaxcode && (updatedUser.bill_address_attributes.taxcode !== updatedUser.bill_address_attributes.vatcode)) {
        this.userService.updateBusinessUser(this.user.id, updateNewUser).pipe(take(1),
          switchMap(() => this.nypUserService.editUser(updatedUser)))
          .subscribe(() => {
            this.success = true;
            this.authService.setCurrentUserFromLocalStorage();
          });
      } else {
        delete updatedUser.bill_address_attributes.taxcode
        this.nypUserService.editUser(updatedUser).pipe(take(1)).subscribe(
          () => {
            this.success = true;
            this.authService.setCurrentUserFromLocalStorage();
          });
      }
    }
  }
}

