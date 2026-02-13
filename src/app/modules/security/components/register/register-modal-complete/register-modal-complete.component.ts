import {Component, OnInit} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {TimeHelper} from '../../../../../shared/helpers/time.helper';
import {NgbActiveModal, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {RegisterModalCompleteData} from './register-modal-complete.model';
import {PasswordHelper} from '../../../../../shared/helpers/password.helper';

@Component({
    selector: 'app-register-modal-complete',
    templateUrl: './register-modal-complete.component.html',
    styleUrls: ['./register-modal-complete.component.scss'],
    standalone: false
})
export class RegisterModalCompleteComponent implements OnInit {

  form: UntypedFormGroup;

  model: { minBirthDate: NgbDateStruct; maxBirthDate: NgbDateStruct } = {
    minBirthDate: {year: 1930, month: 1, day: 1},
    maxBirthDate: {
      year: +moment().subtract(18, 'years').format('YYYY'),
      month: +moment().subtract(18, 'years').format('MM'),
      day: +moment().subtract(18, 'years').format('DD')
    }
  };

  constructor(private formBuilder: UntypedFormBuilder,
              private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: new UntypedFormControl(null, [Validators.required, PasswordHelper.passwordValidator(8)]),
      phoneNumber: new UntypedFormControl(null, [Validators.required, Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)]),
      birthDate: new UntypedFormControl(null, [Validators.required, TimeHelper.dateValidator(moment(this.model.minBirthDate).toDate(), moment(this.model.maxBirthDate).toDate())]),
    });
  }

  fromFormToModel(form: UntypedFormGroup): RegisterModalCompleteData {
    const birthDate = form.controls.birthDate.value;
    return Object.assign({
      password: form.controls.password.value,
      birthDate: (typeof (birthDate) === 'string' ? moment(birthDate, 'DD/MM/YYYY') : moment(TimeHelper.fromNgbDateToDate(birthDate))).format('YYYY-MM-DD'),
      phone: form.controls.phoneNumber.value,
    });
  }

  register() {
    this.activeModal.close(this.fromFormToModel(this.form));
  }

}
