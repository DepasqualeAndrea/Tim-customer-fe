import { Component, OnInit, OnDestroy } from '@angular/core';
import { SSOCseService } from 'app/core/services/sso/sso-cse.service';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { User } from '@model';
import { DataService } from '@services';

/**
 * Define basic form control
 */
class Entry {
  name: string;
  value: any;
  validators: ValidatorFn[] = [Validators.required];
  isDatepicker: boolean = false;
}

/**
 * Allows controls to be customized with validators and/or datepicker
 */
const entryMapper: {[key:string]: any}[] = [
  {name: 'firstname', validators: [Validators.required, Validators.pattern('[a-zA-Z\ òàùèéì\']*')]},
  {name: 'lastname', validators: [Validators.required, Validators.pattern('[a-zA-Z\ òàùèéì\']*')]},
  {name: 'birth_date', validators: [Validators.required], isDatepicker: true},
  {name: 'phone', validators: [Validators.required, Validators.pattern('[(+).0-9\ ]*')]}
]

@Component({
  selector: 'app-user-confirm',
  templateUrl: './user-confirm.component.html',
  styleUrls: ['./user-confirm.component.scss']
})
export class UserConfirmComponent implements OnInit, OnDestroy {
  form: FormGroup;
  userData: Entry[] = [];
  private entryPropertiesMap: Map<string, {[key: string]: any}> = new Map<string, {[key:string]:any}>();

  constructor(
    private ssoService: SSOCseService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.isSplash = true;
    this.loadEntriesConfiguration();
    this.loadUserFromSsoService();
    this.createForm();
  }
  private loadEntriesConfiguration() {
    entryMapper.forEach(entry => {
      this.entryPropertiesMap.set(entry.name, entry);
    });
  }
  private loadUserFromSsoService(): void {
    const userToFill: {[key:string]: any} = this.ssoService.dataStack.get();
    Object.entries(userToFill).forEach(property => {
      const entry: Entry = new Entry();
      entry.name = property[0];
      entry.value = property[1];

      const customProperties: {[key:string]: any} = this.entryPropertiesMap.get(entry.name);
      if(!!customProperties) {
        if(!!customProperties.validators) {
          entry.validators = customProperties.validators;
        }
        if(!!customProperties.isDatepicker) {
          entry.isDatepicker = customProperties.isDatepicker;
        }
      }

      this.userData.push(entry);
    })
  }

  private createForm() {
    this.form = new FormGroup({});
    this.userData.forEach(entry => {
      const ctrl: FormControl = new FormControl(entry.value);
      ctrl.setValidators(entry.validators);
      if(!!entry.value) {
        ctrl.disable();
      }
      this.form.addControl(entry.name, ctrl);
    });
  }

  ngOnDestroy() {
    this.dataService.isSplash = false;
  }

  confirm() {
    if(this.form.valid) {
      this.ssoService.confirmUser(this.createUserFromForm());
    }
  }

  private createUserFromForm(): User {
    const u: User = new User();
    u.firstname = this.form.controls.firstname.value;
    u.lastname = this.form.controls.lastname.value;

    return u;
  }
}
