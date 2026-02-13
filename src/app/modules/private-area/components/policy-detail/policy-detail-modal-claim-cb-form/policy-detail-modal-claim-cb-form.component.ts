import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Policy } from '../../../private-area.model';
import { ActivatedRoute, Data } from '@angular/router';
import * as moment from 'moment';
import { InsurancesService, DataService, AuthService } from '@services';
import { PolicyConfirmModalClaimComponent } from '../policy-confirm-modal-claim/policy-confirm-modal-claim.component';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, UntypedFormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '@model';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { CONSTANTS } from 'app/app.constants';

@Component({
    selector: 'app-policy-detail-modal-claim-cb-form',
    templateUrl: './policy-detail-modal-claim-cb-form.component.html',
    styleUrls: ['./policy-detail-modal-claim-cb-form.component.scss'],
    standalone: false
})
export class PolicyDetailModalClaimCbFormComponent implements OnInit {

  @Input() public policyData: Policy;
  message: String;
  date: Data;
  hour: String;
  accidentPlace: String;
  policy: AbstractControl;
  todayDate: string;

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private dataService: DataService,
    private insurancesService: InsurancesService,
    private authService: AuthService) { }


  claimForm: UntypedFormGroup;
  user: User;

  datepicker: NgbDateStruct;
  claimSentSuccessfully = false;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  yoloEndDate: string;
  claimDate: any;
  completeMessage: string;
  selectedClaimDate: string;
  myValidator: any;

  // changable form fields
  time: UntypedFormControl;
  claimMessage: UntypedFormControl;

  eventTypeList = [];
  authorityList = [
    'Carabinieri',
    'Esercito Italiano',
    'Guardia di Finanza',
    'Guardia Forestale',
    'Polizia di Stato',
    'Polizia Municipale',
    'Soccorso Alpino',
    'Vigili del Fuoco'
  ];
  insuredPersons = [];
  showActivity = false;

  ngOnInit() {
    // get user, insured people and Event Type list based on product
    this.user = this.authService.loggedUser;
    this.insuredPersons = this.policyData.insuredEntities.insurance_holders;
    this.eventTypeList = this.insurancesService.getClaimEventList(this.policyData.product.product_code);

    // Define claim posible dates
    this.startDate = {
      year: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('DD')
    };
    this.claimDateRange();

    this.claimsForm();
    this.setUserCategoryValidators();
    this.authorityDescControl();
    this.countHolderControl();
  }

  // Build form
  claimsForm(): void {
    this.claimForm = this.formBuilder.group({
      claimDate: [null, Validators.required],
      claimHours: [null, Validators.required],
      claimMinutes: [null, Validators.required],
      policyNumber: new UntypedFormControl({ value: this.policyData.policyNumber, disabled: true }, Validators.required),
      firstname: new UntypedFormControl({ value: this.user.address.firstname, disabled: false }, Validators.required),
      lastname: new UntypedFormControl({ value: this.user.address.lastname, disabled: false }, Validators.required),
      taxcode: new UntypedFormControl({ value: this.user.address.taxcode, disabled: false }, Validators.required),
      presentAuthority: new UntypedFormControl(),
      authorityDesc: new UntypedFormControl(),
      claimPlace: new UntypedFormControl('', Validators.required),
      eventType: new UntypedFormControl('', Validators.required),
      involvedPersonsNames: this.formBuilder.array(this.createInvolvedPersons(this.insuredPersons)),
      testimonialNames: new UntypedFormControl(),
      email: new UntypedFormControl({ value: this.user.email, disabled: false }, Validators.required),
      phoneNumber: new UntypedFormControl({ value: this.user.address.phone, disabled: false }, Validators.required),
      countNumber: new UntypedFormControl(null, Validators.pattern(CONSTANTS.ITALIAN_IBAN)),
      countHolder: new UntypedFormControl(),
      privacy: [ null, Validators.requiredTrue]
    });
    this.claimForm.setValidators(this.claimDateValidator());
  }

  claimDateRange() {
    this.todayDate = moment().format('DD/MM/YYYY');
    this.yoloEndDate = this.dataService.genEndDateYoloWay(this.policyData.expirationDate);

    this.endDate = {
      year: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('DD')
    };
    this.claimDate = {
      year: +moment(this.todayDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.todayDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.todayDate, 'DD/MM/YYYY').format('DD')
    };


    if (moment().isBefore(this.endDate) && this.policyData.status !== 'expired') {
      return this.endDate = {
        year: +moment(this.todayDate, 'DD/MM/YYYY').format('YYYY'),
        month: +moment(this.todayDate, 'DD/MM/YYYY').format('MM'),
        day: +moment(this.todayDate, 'DD/MM/YYYY').format('DD')
      };
    } else {
      return this.endDate;
    }
  }

  setUserCategoryValidators() {

    const authority = this.claimForm.get('authorityDesc');
    const present = this.claimForm.get('presentAuthority');
    if (this.policyData.product.product_code.startsWith('ge-bike')) {
      authority.setValidators([Validators.required]);
      present.setValidators([Validators.required]);
    } else {
      authority.setValidators(null);
      present.setValidators(null);
    }
  }

  claimDateValidator() {
    return (group: UntypedFormGroup): ValidationErrors => {
      const claimDate = group.controls['claimDate'].value;
      const claimHours = group.controls['claimHours'];
      const claimMinutes = group.controls['claimMinutes'];
      claimHours.setErrors(null);
      claimMinutes.setErrors(null);
      if (!!claimDate && !!claimHours.value && !!claimMinutes.value) {
        const claimTime = moment(TimeHelper.fromNgbDateToDate(claimDate)).hour(claimHours.value).minute(claimMinutes.value).toDate();
        if (!this.claimTimeValid(claimTime)) {
          const claimTimeInvalid = { claim_time_invalid: true };
          claimHours.setErrors({...claimHours.errors, ...claimTimeInvalid});
          claimMinutes.setErrors({...claimMinutes.errors, ...claimTimeInvalid})
        }
      }
      return;
    };
  }

  claimTimeValid(claimTime: Date) {
    return claimTime >= this.policyData.startDate;
  }

  authorityDescControl() {
    const authority = this.claimForm.get('authorityDesc');
    if ( this.claimForm.controls['presentAuthority'].value === true) {
      authority.setValidators([Validators.required]);
    } else {
      authority.setValidators(null);
    }
  }

  countHolderControl() {
    const accountNumber = this.claimForm.controls['countNumber'];
    const accountHolder = this.claimForm.controls['countHolder'];
    accountNumber.valueChanges.subscribe(value => {
      if (value) {
        accountHolder.setValidators([Validators.required]);
      } else {
        accountHolder.setValidators(null);
      }
      accountHolder.updateValueAndValidity();
    });
  }

  createInvolvedPersons(insuredPersons: Array<any>): AbstractControl[] {
    let persons = new Array(insuredPersons.length);
    persons = insuredPersons.map(ip => this.createInvolvedPersonItem(ip));
    return persons;
  }

  createInvolvedPersonItem(person): UntypedFormGroup {
    return this.formBuilder.group({
      name: person.firstname + ' ' + person.lastname,
      checked: false,
    });
  }

  getInvolvedPersonsNames() {
    return this.claimForm.controls.involvedPersonsNames as UntypedFormArray;
  }

  formatDate() {
    const datepickerValue = this.claimForm.controls.claimDate.value;
    return moment(`${datepickerValue.month}/${datepickerValue.day}/${datepickerValue.year}`, 'MM/DD/YYYY').format('YYYY-MM-DD');
  }

  createMessageWithFormInfo() {
    let completeMessage = '';
    const selectedInvolvedPersons = this.claimForm.controls.involvedPersonsNames.value.filter(ip => ip.checked);
    for (const ctrlName of Object.keys(this.claimForm.controls)) {
      if (ctrlName !== 'claimDate' && ctrlName !== 'involvedPersonsNames') {
        const ctrlValue = this.claimForm.controls[ctrlName].value;
        completeMessage += `${ctrlName}: ${ctrlValue} - `;
      }
    }
    completeMessage += 'involvedPersonsNames: ';
    completeMessage += selectedInvolvedPersons.map(sPerson => sPerson.name);
    return completeMessage;
  }

  privacyConsense() {
    if (this.claimForm.controls['privacy'].value === true) {
      return 'SI';
    } else {
      return 'NO';
    }
  }

  authorityControl() {
   return  this.claimForm.controls['authorityDesc'].value ? this.claimForm.controls['authorityDesc'].value : 'NO';
  }

  ibanControl() {
    return  this.claimForm.controls['countNumber'].value ? this.claimForm.controls['countNumber'].value : 'ND';
   }

  cardHolderControl() {
    return  this.claimForm.controls['countHolder'].value ? this.claimForm.controls['countHolder'].value : 'ND';
   }

  claimHtmlMessage() {
    const privacy = this.privacyConsense();
    const date = this.claimForm.controls['claimDate'].value;
    const hour = this.claimForm.controls['claimHours'].value;
    const accidentPlace = this.claimForm.controls['claimPlace'].value;
    const type = this.claimForm.controls['eventType'].value;
    const testimonials = this.claimForm.controls['testimonialNames'].value;
    const cardNumber = this.ibanControl();
    const accountHolder = this.cardHolderControl();
    const involved = this.claimForm.controls['involvedPersonsNames'].value[0].name;
    const mail = this.claimForm.controls['email'].value;
    const phone = this.claimForm.controls['phoneNumber'].value;
    const authority = this. authorityControl();
    const tax = this.claimForm.controls['taxcode'].value;

    return `<div>
    <ul>
    <li><b>Data e ora evento:</b> ${date.day}/${date.month}/${date.year} - ${hour}</li>
    <li><b>Indirizzo e-mail:</b> ${mail}</li>
    <li><b>Numero di Telefono:</b> ${phone}</li>
    <li><b>Codice Fiscale:</b> ${tax}</li>
    <li><b>Luogo incidente:</b> ${accidentPlace}</li>
    <li><b>Autorità presenti:</b> ${authority}</li>
    <li><b>Tipologia di danno:</b> ${type}</li>
    <li><b>Persone coinvolte:</b> ${involved}</li>
    <li><b>Testimoni:</b> ${testimonials} </li>
    <li><b>Codice IBAN:</b> ${cardNumber} </li>
    <li><b>Intestatario del conto:</b> ${accountHolder}</li>
    <li><b>Consenso del trattamento dei dati personali:</b> ${privacy}</li>
  </ul>
  </div>
  `;
  }

  submitClaim() {
    if (this.claimForm.valid) {
      const body = {
        date: this.formatDate(),
        message: this.claimHtmlMessage(),
        policy_number: this.policyData.policyNumber,
      };
      this.insurancesService.submitClaims(body).subscribe((res) => {
        this.claimSentSuccessfully = true;
        const modalRef = this.modalService.open(PolicyConfirmModalClaimComponent, { size: 'lg' });
      }, (error) => {
        throw error;
      });
    }
  }

}
