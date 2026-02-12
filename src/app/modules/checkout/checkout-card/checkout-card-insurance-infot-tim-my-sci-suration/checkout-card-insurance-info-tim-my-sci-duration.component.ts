import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PolicyOptions } from './policy-options.enum';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import moment from 'moment';
import { DataService } from '@services';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';

type FormValue = { [key: string]: any; }

@Component({
  selector: 'app-checkout-card-insurance-info-tim-my-sci-duration',
  templateUrl: './checkout-card-insurance-info-tim-my-sci-duration.component.html',
  styleUrls: ['./checkout-card-insurance-info-tim-my-sci-duration.component.scss']
})
export class CheckoutCardInsuranceInfoTimMySciDurationComponent implements OnInit {

  form: FormGroup;
  @Input() kenticoContent: any;
  @Output() formUpdated: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Output() operation:  EventEmitter<string> = new EventEmitter<string>();
  
  contentItem: any;
  minFromPurchaseDate: NgbDateStruct;
  maxFromPurchaseDate: NgbDateStruct;
  minToPurchaseDate: NgbDateStruct;
  maxToPurchaseDate: NgbDateStruct;

  constructor(
    private formBuilder: FormBuilder,
    public dataService: DataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService
  ) { }

  ngOnInit() {
    this.minFromPurchaseDate = TimeHelper.fromDateToNgbDate(moment().add(1, 'day').toDate());
    this.maxFromPurchaseDate = TimeHelper.fromDateToNgbDate(moment().add(2, 'month').toDate());
    this.contentItem = this.kenticoContent.step_insurance_policy_period;
    this.createForm();
  }
  
  private createForm(): void {
    this.form = this.formBuilder.group({
      policyOption: [PolicyOptions.DAILY, Validators.required],
      dateFrom: [null, Validators.required],
      dateTo: [null, Validators.required],
    });
    /*
    this.form.get('policyOption').valueChanges.subscribe((changes: PolicyOptions)=> {
      this.updateDatesValidators()
    });*/
    this.form.valueChanges.subscribe(() => {
      this.formUpdated.emit(this.form)
    })
  }

  private updateDatesValidators(): void {

  }

  submit() {
    const form: any = {
      paymentmethod: '',
      mypet_pet_type: '',
      codice_sconto: 'no',
      sci_numassicurati: this.dataService.getParams().insuredNumber,
      sci_min14: this.dataService.getParams().insuredMinors,
      sci_polizza: '',
    }
    const number =  this.dataService.responseOrder.id + '';
    let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.dataService.product, 1, number, {}, form, 'tim broker', '');
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    
    this.operation.emit('next');
  }

  previousPage() {
    this.operation.emit('prev');
  }

  onStartDateSelection(event) {
    this.form.controls.dateTo.setValue(null);
    this.form.updateValueAndValidity();
    let sStartDateSelection = moment(TimeHelper.fromNgbDateStrucutreStringTo(event)).format('YYYY-MM-DD');
    const startDateSelection = new Date(sStartDateSelection);  
    this.minToPurchaseDate = TimeHelper.fromDateToNgbDate(startDateSelection);
    let sEndMaxDate = moment(TimeHelper.fromNgbDateStrucutreStringTo(event)).add(30, 'day').format('YYYY-MM-DD');
    const endMaxDate = new Date(sEndMaxDate);  
    this.maxToPurchaseDate = TimeHelper.fromDateToNgbDate(endMaxDate); 
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
