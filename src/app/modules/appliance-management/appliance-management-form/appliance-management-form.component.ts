import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DomesticAppliance, CheckoutStepInsuranceInfoElettrodomesticiProduct } from '../../checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-elettrodomestici/checkout-step-insurance-info-elettrodomestici.model';
import { TimeHelper } from '../../../shared/helpers/time.helper';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { count } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoProduct } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';

@Component({
  selector: 'app-appliance-management-form',
  templateUrl: './appliance-management-form.component.html',
  styleUrls: ['./appliance-management-form.component.scss']
})
export class ApplianceManagementFormComponent implements OnInit {

  form: FormGroup;

  panelCollapsed = true;
  tvpanelCollapsed = true;

  @Input() appliance: DomesticAppliance;

  @Input() kinds: Array<{ key: string, value: string }>;

  @Input() brands: Array<{ key: string, value: string }>;

  @Input() variantName: any;

  @Input() product: CheckoutStepInsuranceInfoProduct;

  @Input() appliances: DomesticAppliance[];


  @Output() applianceAdded: EventEmitter<DomesticAppliance> = new EventEmitter();


  minPurchaseDate: NgbDateStruct;
  maxPurchaseDate: NgbDateStruct;

  tv: any;
  elettrodomestici: { key: string; value: string; }[];
  tvCheck: any;

  constructor(private formBuilder: FormBuilder,
    public ngbDateParserFormatter: NgbDateParserFormatter) {
    this.maxPurchaseDate = TimeHelper.fromDateToNgbDate(moment().subtract(1, 'd').toDate());
    this.minPurchaseDate = TimeHelper.fromDateToNgbDate(moment().subtract(8, 'y').toDate());
  }

  ngOnInit() {
    this.form = this.formBuilder.group(this.fromModelToView());
    this.form.get('kind').setValidators(Validators.required);
    this.form.get('brand').setValidators(Validators.required);
    this.form.get('model').setValidators(Validators.required);
    this.form.get('purchaseDate').setValidators(Validators.required);
    this.tv = this.kinds[this.kinds.length - 1];
    this.kindsList();
  }

  kindsList() {
    if (this.variantName === 'covercare_appliance_6') {
      this.kinds.pop();
    }
      return this.elettrodomestici = this.kinds;
  }

  fivePlusOne() {

    if (this.appliances.length < 5) {
      return true;
    }
  }

  tvAppliance() {
    this.appliances.forEach(item => this.tvCheck = item.kind.key);
    if (this.variantName === 'covercare_appliance_6') {
      if (this.tvCheck !== 'tv') {
        return true;
      } if (this.appliances.length < 1) {
        return true;
      }
    }
  }

  fromModelToView(appliance?: DomesticAppliance): { [key: string]: any } {
    return {
      kind: appliance && appliance.kind || null,
      brand: appliance && appliance.brand || null,
      model: appliance && appliance.model || null,
      purchaseDate: appliance && TimeHelper.fromDateToNgbDate(appliance.purchaseDate) || null,
      receiptNumber: appliance && appliance.receiptNumber || null
    };
  }

  fromViewToModel(form: FormGroup): DomesticAppliance {
    return {
      kind: form.controls.kind.value,
      brand: form.controls.brand.value,
      model: form.controls.model.value,
      receiptNumber: form.controls.receiptNumber.value,
      purchaseDate: TimeHelper.fromNgbDateToDate(form.controls.purchaseDate.value)
    };
  }

  onAddClicked(): void {
    this.applianceAdded.emit(this.fromViewToModel(this.form));
    this.form.reset();
  }
}
