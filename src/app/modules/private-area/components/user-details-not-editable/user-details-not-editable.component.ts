import {AfterContentInit, Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {User} from '@model';
import {AuthService} from '@services';
import moment from 'moment';

@Component({
    selector: 'app-user-details-not-editable',
    templateUrl: './user-details-not-editable.component.html',
    styleUrls: ['./user-details-not-editable.component.scss'],
    standalone: false
})
export class UserDetailsNotEditableComponent implements OnInit {

  userDetailsForm: UntypedFormGroup;
  user: User;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    // get current user
    this.user = this.authService.loggedUser;
    const birthDate = this.user.address.birth_date ? moment(this.user.address.birth_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : null;

    this.userDetailsForm = this.formBuilder.group({
      email: [{value: this.user.email || null, disabled: true}],
      firstname: [{value: this.user.address.firstname || null, disabled: true}],
      lastname: [{value: this.user.address.lastname || null, disabled: true}],
      taxcode: [{value: this.user.address.taxcode || null, disabled: true}],
      phoneNumber: [{value: this.user.address.phone || null, disabled: true}],
      birthDate: [{value: birthDate || null, disabled: true}],
      birthCountry: [{value: this.user.address.birth_country ? this.user.address.birth_country.name : null, disabled: true}],
      birthState: [{value: this.user.address.birth_state ? this.user.address.birth_state.name : null, disabled: true}],
      birthCity: [{value: this.user.address.birth_city ? this.user.address.birth_city.name : null, disabled: true}],
      residentialCountry: [{value: this.user.address.country ? this.user.address.country.name : null, disabled: true}],
      residentialState: [{value: this.user.address.state ? this.user.address.state.name : null, disabled: true}],
      residentialCity: [{value: this.user.address.city || null, disabled: true}],
      residentialAddress: [{value: this.user.address.address1 || null, disabled: true}],
      zipcode: [{value: this.user.address.zipcode || null, disabled: true}],
    });
  }
}

