import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@services';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';


type FormValue = {[key: string]: any}

@Component({
  selector: 'app-checkout-card-insurance-info-tim-my-sci-number-insured',
  templateUrl: './checkout-card-insurance-info-tim-my-sci-number-insured.component.html',
  styleUrls: ['./checkout-card-insurance-info-tim-my-sci-number-insured.component.scss']
})
export class CheckoutCardInsuranceInfoTimMySciNumberInsuredComponent implements OnInit {

  form: FormGroup;
  insuredNumberArray: any[];
  insuredMinorsCheck : any[] = [{keyValue: true, value: 'si'}, {keyValue: false, value: 'no'}];
  contentItem: any;


  @Input() kenticoContent: any;
  @Input() maximumInsurable: number;
  @Output() formUpdated: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() operation:  EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    public dataService: DataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService
  ) { }

  ngOnInit() {
    this.contentItem = this.kenticoContent.step_number_insured;
    this.form = this.formBuilder.group({
      insuredNumber: [null, Validators.required],
      insuredMinors: [{value: null, disabled: true}, Validators.nullValidator],
      declarationMinors: [{value: null, disabled: true}, Validators.nullValidator],
    });

     this.form.valueChanges.subscribe((changes: FormValue) => {
      this.updateFormValidators(changes);
      this.formUpdated.emit(this.form);
    })
    this.setInsuredNumber();
  }

  private updateFormValidators(formValue: FormValue): void {
    if (+formValue.insuredNumber >= 2) {
      this.form.controls.insuredMinors.enable({emitEvent: false});
      this.form.controls.insuredMinors.setValidators(Validators.required);
      this.form.controls.insuredMinors.updateValueAndValidity({onlySelf: true, emitEvent: false})
    } else {
      this.form.controls.insuredMinors.disable({emitEvent: false});
      this.form.controls.insuredMinors.reset(null, {emitEvent: false});
      this.form.controls.declarationMinors.disable({emitEvent: false});
      this.form.controls.declarationMinors.reset(null, {emitEvent: false});
      this.form.controls.insuredMinors.updateValueAndValidity({onlySelf: true, emitEvent: false});
      this.form.controls.declarationMinors.updateValueAndValidity({onlySelf: true, emitEvent: false});

    }
    if (!!formValue.insuredMinors) {
      this.form.controls.declarationMinors.enable({emitEvent: false});
    } else {
      this.form.controls.declarationMinors.disable({emitEvent: false});
    }
  }

  setInsuredNumber() {
    this.insuredNumberArray = [];
    for (let i = 1; i <= this.maximumInsurable; i++) {
        this.insuredNumberArray.push(i);
    }
  }

  submit() {
    const form: any = {
      paymentmethod: '',
      mypet_pet_type: '',
      codice_sconto: 'no',
      sci_numassicurati: this.form.controls.insuredNumber.value,
      sci_min14: this.form.controls.insuredMinors.value !== null ? this.form.controls.insuredMinors.value : false,
      sci_polizza: '',
    }
    let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.dataService.product, 1, "", {}, form, 'tim broker', '');
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    this.dataService.setParams({insuredNumber: form.sci_numassicurati, insuredMinors: form.sci_min14});
    
    this.operation.emit('next');
  }

  previousPage() {
    window.history.back();
  }



  isFieldValid(form: any, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (this.getFieldError(formControlName, 'required')) {
        return 'error-field'
      }
    }
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName).invalid &&
      (this.form.get(formControlName).touched || this.form.get(formControlName).dirty)
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType]
  }



}
