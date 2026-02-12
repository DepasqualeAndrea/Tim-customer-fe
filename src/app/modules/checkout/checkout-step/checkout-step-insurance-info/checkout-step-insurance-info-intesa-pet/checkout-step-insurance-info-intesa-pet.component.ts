import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbDateParserFormatter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import * as moment from 'moment';
import { PetInfo, CheckoutStepInsuranceInfoMiFidoProduct } from '../checkout-step-insurance-info-mi-fido/checkout-step-insurance-info-mi-fido.model';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { Observable, of, throwError } from 'rxjs';
import { LineFirstItem } from '@model';
import { AuthService, DataService, InsurancesService, UserService } from '@services';
import { switchMap, take, tap } from 'rxjs/operators';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ManageDataService } from 'app/modules/checkout/services/manage-data.service';
import { ToastrService } from 'ngx-toastr';
import { NypInsurancesService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-step-insurance-info-intesa-pet',
  templateUrl: './checkout-step-insurance-info-intesa-pet.component.html',
  styleUrls: ['./checkout-step-insurance-info-intesa-pet.component.scss']
})
export class CheckoutStepInsuranceInfoIntesaPetComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit, AfterViewInit {

  form: FormGroup;

  maxBirthDate: NgbDate = TimeHelper.fromDateToNgbDate(moment().subtract(181, 'day').toDate());
  minBirthDate: NgbDate = TimeHelper.fromDateToNgbDate(moment().subtract(9, 'y').add(1, 'day').toDate());
  showConsent = false;
  @ViewChild('consent') consent: ConsentFormComponent;
  petLabel: string;
  dog_image: string;
  dog_image_alt: string;
  cat_image: string;
  cat_image_alt: string;
  intesaPetChoise = false;

  constraints;
  formValidityValue: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public ngbDateParserFormatter: NgbDateParserFormatter,
    public dataService: DataService,
    protected nypInsurancesService: NypInsurancesService,
    private authService: AuthService,
    private nypUserService: NypUserService,
    private componentFeaturesService: ComponentFeaturesService,
    private kenticoTranslateService: KenticoTranslateService,
    private manageDataService: ManageDataService,
    private toastrService: ToastrService
  ) {
    super();
  }


  ngOnInit() {
    this.isIntesaPetChoise();
    // this.minBirthDate = TimeHelper.fromDateToNgbDate(moment().subtract(9, 'y').add(1, 'day').toDate());
    // this.maxBirthDate = TimeHelper.fromDateToNgbDate(moment().subtract(181, 'day').toDate());
    this.constraints = this.product.order.line_items[0].pet_properties.constraints;
    this.setShowConsent();

    const product: CheckoutStepInsuranceInfoMiFidoProduct = Object.assign(this.product);
    this.form = this.formBuilder.group({
      petName: new FormControl(product.petName || null, [Validators.required]),
      kind: new FormControl(product.kind || null, [Validators.required]),
      birthDate: new FormControl(TimeHelper.fromDateToNgbDate(product.birthDate), [Validators.required]),
      privacy: new FormControl(false, [Validators.required])
    });
    if (this.intesaPetChoise === true) {
      this.form.valueChanges.subscribe(changes => this.selectPetType(changes.kind))
      if (!product.kind) {
        this.form.patchValue({ kind: 'dog' });
        (this.dataService.isTenant('yolo-es-es_db')) ? this.petLabel = 'perro'
          : this.petLabel = 'cane';
      } else {
        this.form.patchValue({ kind: product.kind });
      }
      this.kenticoTranslateService.getItem<any>('checkout_pet').pipe(take(1)).subscribe(item => {
        this.dog_image = item.step_insurance_info.dog_icon.thumbnail ?
          item.step_insurance_info.dog_icon.thumbnail.value[0].url :
          item.step_insurance_info.dog_icon.image.value[0].url;

        this.dog_image_alt = item.step_insurance_info.dog_icon.thumbnail ?
          item.step_insurance_info.dog_icon.thumbnail.value[0].description :
          item.step_insurance_info.dog_icon.image.value[0].description;

        this.cat_image = item.step_insurance_info.cat_icon.thumbnail ?
          item.step_insurance_info.cat_icon.thumbnail.value[0].url :
          item.step_insurance_info.cat_icon.image.value[0].url;

        this.cat_image_alt = item.step_insurance_info.cat_icon.thumbnail ?
          item.step_insurance_info.cat_icon.thumbnail.value[0].description :
          item.step_insurance_info.cat_icon.image.value[0].description;
      });

    }

  }

  ngAfterViewInit(): void {
    this.form.controls.petName.valueChanges.subscribe((data) => {
      if (data) {
        this.form.controls.petName.markAsUntouched();
      }
    });
    this.form.controls.birthDate.valueChanges.subscribe((data) => {
      this.form.controls.birthDate.markAsUntouched();
    });

  }
  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  isIntesaPetChoise() {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('intesa-choise-pet');
    this.intesaPetChoise = this.componentFeaturesService.isRuleEnabled();
    if (this.componentFeaturesService.isRuleEnabled() === null) {
      this.intesaPetChoise = false;
    }
  }

  fromViewToModel(form: FormGroup): PetInfo {
    return {
      petName: form.controls.petName.value,
      kind: form.controls.kind.value,
      chip: null,
      breed: null,
      birthDate: TimeHelper.fromNgbDateToDate(form.controls.birthDate.value),
      informationPackage: form.controls.privacy.value,
    };
  }

  setShowConsent() {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('show-consent');
    const showConsentEnabled = this.componentFeaturesService.isRuleEnabled();
    if (showConsentEnabled) {
      this.nypInsurancesService.getInsurances().pipe(take(1)).subscribe(res => {
        this.showConsent = res.insurances.length === 0;
      });
    } else {
      this.showConsent = false;
    }
  }
  getConsentFormValidity(event) {
    this.formValidityValue = event;
  }

  isFormValid(): boolean {

    if (this.showConsent) {
      if (this.intesaPetChoise) {
        this.manageDataService.setValue(this.form.valid);
        return true;

      }
      return (this.consent.consentForm.valid &&
        this.form.valid);
    } else {
      if (this.intesaPetChoise) {
        this.manageDataService.setValue(this.form.valid);
        return true;
      }
      return this.form.valid;
    }
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const petInfo: PetInfo = this.fromViewToModel(this.form);
    Object.assign(this.product, petInfo);
    return <CheckoutStepInsuranceInfoMiFidoProduct>Object.assign({}, this.product, { insuredSubjects: null });
  }
  verifyForm() {
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach((control) => {
        const controlValue = this.form.get(control);
        if (!controlValue.valid) {
          controlValue.setErrors({ required: true });
          controlValue.markAsTouched();
        }
      });
    }
  }

  onBeforeNextStep(): Observable<any> {
    if (this.intesaPetChoise) {
      if (this.form.valid && this.formValidityValue && this.showConsent) {
        const userAcceptancesAttributes = {};
        const user = this.authService.loggedUser;
        user.user_acceptances.forEach((ua: any, index) => {
          if (ua.kind === 'privacy') {
            userAcceptancesAttributes[`${index}`] = {
              id: ua.id,
              value: this.consent.consentForm.controls[ua.tag].value
            };
          }
        });
        user.user_acceptances_attributes = userAcceptancesAttributes;
        return this.nypUserService.editUser(user)
          .pipe(
            tap(() => this.authService.setCurrentUserFromLocalStorage()),
            switchMap(() => of(null)
            ));
      } else if (this.form.valid && !this.showConsent) {
        return of(null);
      } else {
        this.verifyForm();
        this.toastrService.error('Verifica di aver compilato tutti i campi necessari');
        return throwError(null);
      }


    } else {
      if (this.showConsent) {
        const userAcceptancesAttributes = {};
        const user = this.authService.loggedUser;
        user.user_acceptances.forEach((ua: any, index) => {
          if (ua.kind === 'privacy') {
            userAcceptancesAttributes[`${index}`] = {
              id: ua.id,
              value: this.consent.consentForm.controls[ua.tag].value
            };
          }
        });
        user.user_acceptances_attributes = userAcceptancesAttributes;
        return this.nypUserService.editUser(user)
          .pipe(
            tap(() => this.authService.setCurrentUserFromLocalStorage()),
            switchMap(() => of(null)
            ));
      }
      return of(null);
    }
  }

  public selectPetType(type: string): void {
    this.form.patchValue({ kind: type });
    if (this.intesaPetChoise === true) {
      if (type === 'dog') {
        (this.dataService.isTenant('yolo-es-es_db')) ? this.petLabel = 'perro' :
          this.petLabel = 'cane';
      } else {
        (this.dataService.isTenant('yolo-es-es_db')) ? this.petLabel = 'gato' :
          this.petLabel = 'gatto';
      }
    }
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    const product = <CheckoutStepInsuranceInfoMiFidoProduct>this.computeProduct();
    lineItem['pet_attributes'] = Object.assign({
      name: product.petName,
      kind: product.kind,
      birth_date: moment(product.birthDate).format('YYYY-MM-DD')
    });
  }

}
